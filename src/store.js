import { parseEpub } from './epub.js'
import { randomId } from './random-id.js'
import { DEFAULT_SEGMENT_LENGTH, parseTextBook } from './segments.js'
import { decodeBookText } from './text-decoding.js'
import { hasProjectGutenbergReference } from './pg-notice.js'

import { BACKUP_FORMAT, MAX_BACKUP_BYTES, validateBackup } from './backup.js'
import { TARGET_TYPES, DEFAULT_SETTINGS, normalizeSettings } from './settings-data.js'
export { TARGET_TYPES, DEFAULT_SETTINGS } from './settings-data.js'

const EMPTY_STATUS = Object.freeze({ kind: 'empty' })

export function passageSnapshotKey(bookId, stepKey) {
  return `${bookId}\u0000${stepKey}`
}

/** Own persistent books/settings and page-only passage cache for Novel Fish. */
export class NovelStore {
  constructor(storage, { bundledBooks = [], bundledCatalog = null } = {}) {
    this.storage = storage
    this.bundledBooks = bundledBooks
    this.bundledCatalog = bundledCatalog
    this.state = { books: [], settings: { ...DEFAULT_SETTINGS }, hydrated: false, error: null }
    this.ui = { notice: null }
    this.listeners = new Set()
    this.settingsListeners = new Set()
    this.uiListeners = new Set()
    this.passageListeners = new Set()
    this.passageStates = new Map()
    this.passageSnapshot = Object.freeze({})
    this.stateSource = Object.freeze({ getSnapshot: this.getSnapshot, subscribe: this.subscribe })
    this.settingsSource = Object.freeze({ getSnapshot: this.getSettingsSnapshot, subscribe: this.subscribeSettings })
    this.uiSource = Object.freeze({ getSnapshot: this.getUiSnapshot, subscribe: this.subscribeUi })
    this.passageSource = Object.freeze({ getSnapshot: this.getPassageSnapshot, subscribe: this.subscribePassages })
    this.pendingReads = new Map()
    // Page-only provenance, keyed by stored identity (including adopted legacy IDs).
    // No library rewrite/migration and no dependence on mutable titles or filenames.
    this.projectGutenbergBooks = new Map()
    this.cacheGeneration = 0
    this.disposed = false
    this.persistenceError = null
    this.mutationQueue = Promise.resolve()
    this.ready = this.#hydrate()
    this.unsubscribeStorage = storage.subscribe?.(() => {
      void this.refresh().catch(error => this.setNotice(`同步书库失败：${messageOf(error)}`))
    })
  }

  getSnapshot = () => this.state
  getSettingsSnapshot = () => this.state.settings
  getUiSnapshot = () => this.ui
  getPassageSnapshot = () => this.passageSnapshot

  subscribe = listener => this.#subscribe(this.listeners, listener)
  subscribeSettings = listener => this.#subscribe(this.settingsListeners, listener)
  subscribeUi = listener => this.#subscribe(this.uiListeners, listener)
  subscribePassages = listener => this.#subscribe(this.passageListeners, listener)

  getPassageStatus(bookId, stepKey) {
    if (!bookId) return EMPTY_STATUS
    return this.passageStates.get(passageSnapshotKey(bookId, stepKey)) ?? EMPTY_STATUS
  }

  dispose() {
    this.disposed = true
    this.cacheGeneration += 1
    this.passageStates.clear()
    this.passageSnapshot = Object.freeze({})
    this.pendingReads.clear()
    this.projectGutenbergBooks.clear()
    this.listeners.clear()
    this.settingsListeners.clear()
    this.uiListeners.clear()
    this.passageListeners.clear()
    this.unsubscribeStorage?.()
    this.storage.close?.()
  }

  setNotice(notice) {
    this.ui = { ...this.ui, notice: notice ? String(notice) : null }
    this.#emitUi()
  }

  async setOption(key, value) {
    if (!['enabled', 'targetTypes', 'mainTitle', 'extraTitle', 'continueOnReopen'].includes(key)) throw new Error('未知设置项')
    let normalized
    if (key === 'targetTypes') {
      if (!Array.isArray(value) || value.some(type => !TARGET_TYPES.includes(type)) || new Set(value).size !== value.length) {
        throw new Error('阅读类型必须是有效且不重复的类型数组')
      }
      normalized = Object.freeze([...value])
    } else if (key === 'enabled' || key === 'continueOnReopen') {
      normalized = Boolean(value)
    } else {
      normalized = String(value)
    }
    // Invalidate at intent time, not after a queued settings write finishes.
    // Any type update also covers removals from settings writes still in flight.
    if ((key === 'enabled' && !normalized) || key === 'targetTypes') this.#cancelPendingReads()
    return this.#updateSettings(() => ({ [key]: normalized }))
  }

  async selectBook(bookId) {
    const nextId = bookId || null
    this.cacheGeneration += 1
    return this.#enqueueMutation(async () => {
      if (nextId && !this.state.books.some(book => book.id === nextId)) throw new Error('找不到这本书')
      if (nextId === this.state.settings.currentBookId) return
      await this.#saveSettings({ currentBookId: nextId })
      this.#clearPassages(false)
    })
  }

  async importFile(file) {
    await this.ready
    this.#assertWritable()
    const extension = String(file.name).split('.').at(-1)?.toLowerCase()
    if (!['epub', 'txt', 'md'].includes(extension)) throw new Error('只支持 EPUB、TXT、MD 文件')
    const parsed = extension === 'epub'
      ? await parseEpub(file, DEFAULT_SEGMENT_LENGTH)
      : parseTextBook(decodeBookText(await file.arrayBuffer()), extension, DEFAULT_SEGMENT_LENGTH)
    const fallbackTitle = String(file.name).replace(/\.(epub|txt|md)$/iu, '')
    return this.#addBook({
      title: parsed.title?.trim() || fallbackTitle || '未命名书籍',
      format: extension,
      segments: parsed.segments,
    })
  }

  async deleteBook(bookId) {
    if (bookId === this.state.settings.currentBookId) this.cacheGeneration += 1
    return this.#enqueueMutation(async () => {
      if (!this.state.books.some(item => item.id === bookId)) return
      // Deletion and fallback selection are one transaction, including across tabs.
      await this.storage.deleteBook(bookId)
      this.projectGutenbergBooks.delete(bookId)
      await this.#refresh()
    })
  }

  /** Set the next unread index (0 = beginning, segmentCount = finished). */
  async setProgress(bookId, progress) {
    if (!Number.isSafeInteger(progress) || progress < 0) throw new Error('段落位置无效')
    this.#cancelPendingReads()
    return this.#enqueueMutation(async () => {
      for (let attempt = 0; attempt < 32; attempt++) {
        const book = this.state.books.find(item => item.id === bookId)
        if (!book || progress > book.segmentCount) throw new Error('段落位置无效或书籍已删除')
        const updated = await this.storage.updateBook({ ...book, progress, positionToken: randomId() }, { expectedRevision: book.revision ?? 0 })
        await this.#refresh()
        if (updated) { this.#clearPassages(); return }
      }
      throw new Error('其他页面正在频繁更新进度，请稍后重试')
    })
  }

  async exportBackup() {
    return this.#enqueueMutation(async () => {
      const library = await this.storage.exportLibrary()
      const data = validateBackup({ format: BACKUP_FORMAT, version: 1, books: library.books,
        settings: normalizeSettings(library.settings, library.books.map(entry => entry.book)) })
      const json = JSON.stringify(data)
      if (new TextEncoder().encode(json).byteLength > MAX_BACKUP_BYTES) throw new Error('书库超过 64 MiB，暂不支持整库备份')
      return json
    })
  }

  async readBackup(file) {
    if (file.size > MAX_BACKUP_BYTES) throw new Error('备份文件不能超过 64 MiB')
    const text = await file.text()
    if (new TextEncoder().encode(text).byteLength > MAX_BACKUP_BYTES) throw new Error('备份文件不能超过 64 MiB')
    try { return validateBackup(JSON.parse(text)) }
    catch (error) {
      if (error instanceof SyntaxError) throw new Error('不是有效的 JSON 备份文件')
      throw error
    }
  }

  async restoreBackup(backup) {
    const validated = validateBackup(backup)
    this.#cancelPendingReads()
    return this.#enqueueMutation(async () => {
      const result = await this.storage.restoreLibrary(validated)
      this.projectGutenbergBooks.clear()
      this.#clearPassages()
      await this.#refresh()
      return result
    })
  }

  /** Reopening a region shows the passage it already holds; a first expansion reads the next one. */
  async claimPassage(stepKey, targetType = 'reasoning') {
    return this.#readPassage(stepKey, targetType, false)
  }

  /**
   * Same contract as claimPassage, except a region that already shows a passage
   * advances to the next one. Only an explicit reopen can reach this path, so a
   * repeated expansion still cannot paginate by accident while long reads
   * continue inside the same native row.
   */
  async continuePassage(stepKey, targetType = 'reasoning') {
    return this.#readPassage(stepKey, targetType, true)
  }

  async #readPassage(stepKey, targetType, advance) {
    if (this.disposed) return EMPTY_STATUS
    let generation = this.cacheGeneration
    const requestKey = `${generation}\u0000${targetType}\u0000${stepKey}`
    const inFlight = this.pendingReads.get(requestKey)
    if (inFlight) return inFlight

    let bookId
    let loadingStatus
    const operation = this.#enqueueMutation(async generationBeforeRefresh => {
      // Adopt changes discovered before this action starts, but never revive a
      // request canceled by a local user intent while it was in the queue.
      if (generation === generationBeforeRefresh) generation = this.cacheGeneration
      if (!this.#canRead(generation, targetType)) return EMPTY_STATUS
      bookId = this.state.settings.currentBookId
      if (!bookId) return EMPTY_STATUS
      const existing = this.getPassageStatus(bookId, stepKey)
      if (existing.kind === 'end') return existing
      if (!advance && existing.kind === 'ready') return existing
      loadingStatus = { kind: 'loading' }
      this.#writePassageStatus(bookId, stepKey, loadingStatus)
      for (let attempt = 0; attempt < 32; attempt++) {
        if (!this.#canRead(generation, targetType)) return EMPTY_STATUS
        const book = this.state.books.find(item => item.id === bookId)
        if (!book || book.progress >= book.segmentCount) {
          return this.#writePassageStatus(bookId, stepKey, { kind: 'end', bookId })
        }
        const index = book.progress
        const passage = await this.storage.getSegment(bookId, index)
        if (!passage?.text) throw new Error('当前段落为空或已损坏')
        if (!this.#canRead(generation, targetType)) return EMPTY_STATUS
        if (!this.projectGutenbergBooks.has(bookId)) {
          const first = index === 0 ? passage : await this.storage.getSegment(bookId, 0)
          if (!this.#canRead(generation, targetType)) return EMPTY_STATUS
          if (!first?.text) throw new Error('书籍首段为空或已损坏')
          this.projectGutenbergBooks.set(bookId, hasProjectGutenbergReference(first.text))
        }
        const projectGutenberg = this.projectGutenbergBooks.get(bookId)
        // Compare-and-swap inside IndexedDB, not an unsafe page-local read/put.
        const updated = await this.storage.updateBook({ ...book, progress: index + 1 }, {
          expectedRevision: book.revision ?? 0, targetType,
        })
        if (!updated) { await this.#refresh(); continue }
        await this.#refresh()
        if (!this.#canRead(generation, targetType)) {
          // Never undo a newer claim/seek in another tab when canceling this one.
          await this.#restore(() => this.storage.updateBook(book, { expectedRevision: updated.revision }))
          await this.#refresh()
          return EMPTY_STATUS
        }
        const result = { kind: 'ready', bookId, index, passage, projectGutenberg }
        return this.#writePassageStatus(bookId, stepKey, result)
      }
      throw new Error('其他页面正在频繁更新进度，请稍后重试')
    }).catch(error => {
      if (!this.persistenceError && !this.#canRead(generation, targetType)) return EMPTY_STATUS
      const failure = { kind: 'error', message: messageOf(error) }
      if (this.#canRead(generation, targetType) && bookId) this.#writePassageStatus(bookId, stepKey, failure)
      return failure
    })

    this.pendingReads.set(requestKey, operation)
    try {
      return await operation
    } finally {
      if (this.pendingReads.get(requestKey) === operation) this.pendingReads.delete(requestKey)
      if (bookId && loadingStatus && generation !== this.cacheGeneration && this.getPassageStatus(bookId, stepKey) === loadingStatus) {
        this.#writePassageStatus(bookId, stepKey, EMPTY_STATUS)
      }
    }
  }

  async #hydrate() {
    try {
      let stored = await this.storage.load()
      if (this.bundledBooks.length && !stored.bundledBooksInitialized) {
        const entries = []
        const bundledIds = new Set()
        // Parse everything before opening the atomic transaction; any failure leaves
        // both the library and its one-time marker untouched for a later retry.
        for (const descriptor of this.bundledBooks) {
          const { id, title, format, createFile } = descriptor
          if (typeof id !== 'string' || !id || bundledIds.has(id) || typeof title !== 'string' || !title.trim()
            || !['epub', 'txt', 'md'].includes(format) || typeof createFile !== 'function') {
            throw new Error('内置书籍描述无效或重复')
          }
          bundledIds.add(id)
          const file = await createFile()
          const parsed = format === 'epub'
            ? await parseEpub(file, DEFAULT_SEGMENT_LENGTH)
            : parseTextBook(decodeBookText(await file.arrayBuffer()), format, DEFAULT_SEGMENT_LENGTH)
          entries.push({
            book: {
              id: `bundled:${id}`, bundledId: id, title: title.trim(), format,
              segmentCount: parsed.segments.length, progress: 0, importedAt: Date.now(),
            },
            segments: parsed.segments,
          })
        }
        // Hydration must not enqueue a mutation that would itself await ready.
        stored = await this.storage.initializeBundledBooks(entries, this.bundledCatalog?.version)
      }
      if (stored.bundledBooksInitialized && this.bundledCatalog
        && (stored.bundledCatalogVersion ?? 0) < this.bundledCatalog.version) {
        const updates = []
        for (const update of this.bundledCatalog.updates ?? []) {
          // An empty/partially deleted library does not need to parse removed
          // defaults. The atomic migration rechecks identity and current content.
          if (!(stored.books ?? []).some(book => (book.bundledId === update.id || book.id === `bundled:${update.id}`)
            && book.format === update.fromFormat)) continue
          const file = await update.createFile()
          const parsed = parseTextBook(decodeBookText(await file.arrayBuffer()), update.fromFormat, DEFAULT_SEGMENT_LENGTH)
          updates.push({ id: update.id, fromFormat: update.fromFormat, format: update.format, segments: parsed.segments })
        }
        stored = await this.storage.migrateBundledCatalog({ ...this.bundledCatalog, updates })
      }
      const books = stored.books ?? []
      this.#setState({ books, settings: normalizeSettings(stored.settings, books), hydrated: true, error: null })
    } catch (error) {
      this.persistenceError = error
      this.#setState({ hydrated: true, error: messageOf(error) })
    }
  }

  #addBook({ title, format, segments }) {
    return this.#enqueueMutation(async () => {
      if (!segments.length) throw new Error('没有可导入的正文')
      const book = {
        id: randomId(),
        title: String(title).trim() || '未命名书籍',
        format,
        segmentCount: segments.length,
        progress: 0,
        importedAt: Date.now(),
      }
      await this.storage.addBook(book, segments, { selectIfEmpty: true })
      await this.#refresh()
      return book
    })
  }

  #updateSettings(update) {
    return this.#enqueueMutation(async () => {
      const patch = update(this.state.settings)
      if (!patch) return this.state.settings
      return this.#saveSettings(patch)
    })
  }

  async #saveSettings(patch) {
    const saved = await this.storage.saveSettings(patch)
    const settings = normalizeSettings(saved, this.state.books)
    this.#setState({ settings })
    return settings
  }

  refresh() { return this.#enqueueMutation(() => undefined) }

  async #refresh() {
    const stored = await this.storage.load()
    if (this.disposed) return
    const books = stored.books ?? []
    const settings = normalizeSettings(stored.settings, books)
    const previous = this.state.settings
    const selectionChanged = previous.currentBookId !== settings.currentBookId
    const positionChanged = this.state.books.some(book => book.positionToken !== books.find(item => item.id === book.id)?.positionToken)
    if (selectionChanged || positionChanged) this.#clearPassages()
    else if (previous.enabled !== settings.enabled || JSON.stringify(previous.targetTypes) !== JSON.stringify(settings.targetTypes)) this.#cancelPendingReads()
    const changes = {}
    if (JSON.stringify(this.state.books) !== JSON.stringify(books)) changes.books = books
    if (JSON.stringify(previous) !== JSON.stringify(settings)) changes.settings = settings
    if (Object.keys(changes).length) this.#setState(changes)
  }

  #enqueueMutation(action) {
    const operation = this.mutationQueue.then(async () => {
      await this.ready
      this.#assertWritable()
      const generationBeforeRefresh = this.cacheGeneration
      await this.#refresh()
      return action(generationBeforeRefresh)
    })
    this.mutationQueue = operation.catch(() => undefined)
    return operation
  }

  #assertWritable() {
    if (this.persistenceError) throw new Error(`本地书库不可用，请刷新后重试：${messageOf(this.persistenceError)}`)
    if (this.disposed) throw new Error('本地书库已关闭')
  }

  async #restore(action) {
    try {
      await action()
    } catch (error) {
      this.persistenceError = error
      this.#setState({ error: `本地书库恢复失败，请刷新后检查阅读进度：${messageOf(error)}` })
      throw error
    }
  }

  #canRead(generation, targetType) {
    return !this.disposed && generation === this.cacheGeneration
      && this.state.settings.enabled && this.state.settings.targetTypes.includes(targetType)
  }

  #cancelPendingReads() {
    this.cacheGeneration += 1
    this.pendingReads.clear()
    let changed = false
    for (const [key, status] of this.passageStates) {
      if (status.kind === 'loading') {
        this.passageStates.delete(key)
        changed = true
      }
    }
    if (changed) {
      this.passageSnapshot = Object.freeze(Object.fromEntries(this.passageStates))
      this.#emitPassages()
    }
  }

  #clearPassages(cancelReads = true) {
    if (cancelReads) this.cacheGeneration += 1
    this.passageStates.clear()
    this.passageSnapshot = Object.freeze({})
    this.#emitPassages()
  }

  #writePassageStatus(bookId, stepKey, status) {
    if (!bookId) return status
    const key = passageSnapshotKey(bookId, stepKey)
    this.passageStates.set(key, status)
    this.passageSnapshot = Object.freeze({ ...this.passageSnapshot, [key]: status })
    this.#emitPassages()
    return status
  }

  #setState(changes) {
    const next = { ...this.state, ...changes }
    this.state = next
    for (const listener of [...this.listeners]) listener()
    if (changes.settings !== undefined) {
      for (const listener of [...this.settingsListeners]) listener()
    }
  }

  #emitPassages() {
    for (const listener of [...this.passageListeners]) listener()
  }

  #emitUi() {
    for (const listener of [...this.uiListeners]) listener()
  }

  #subscribe(listeners, listener) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  }
}

function messageOf(error) {
  return error instanceof Error ? error.message : String(error)
}
