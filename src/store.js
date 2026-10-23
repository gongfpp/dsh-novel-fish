import { parseEpub } from './epub.js'
import { DEFAULT_SEGMENT_LENGTH, parseTextBook } from './segments.js'

export const DEFAULT_SETTINGS = Object.freeze({
  enabled: true,
  currentBookId: null,
  targets: [],
  icon: '📖',
  mainTitle: '',
  extraTitle: '',
})

const EMPTY_STATUS = Object.freeze({ kind: 'empty' })

export function passageSnapshotKey(bookId, stepKey) {
  return `${bookId}\u0000${stepKey}`
}

/** Own persistent books/settings and page-only passage cache for Novel Fish. */
export class NovelStore {
  constructor(storage) {
    this.storage = storage
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
    this.cacheGeneration = 0
    this.disposed = false
    this.persistenceError = null
    this.mutationQueue = Promise.resolve()
    this.ready = this.#hydrate()
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
    this.listeners.clear()
    this.settingsListeners.clear()
    this.uiListeners.clear()
    this.passageListeners.clear()
    this.storage.close?.()
  }

  setNotice(notice) {
    this.ui = { ...this.ui, notice: notice ? String(notice) : null }
    this.#emitUi()
  }

  async setOption(key, value) {
    if (!['enabled', 'icon', 'mainTitle', 'extraTitle'].includes(key)) throw new Error('未知设置项')
    const normalized = key === 'enabled' ? Boolean(value) : String(value)
    return this.#updateSettings(() => ({ [key]: normalized }))
  }

  async addTarget(target) {
    const normalized = {
      sessionId: String(target.sessionId),
      nodeKey: String(target.nodeKey),
      turn: Number(target.turn),
      step: Number(target.step),
    }
    await this.#updateSettings(settings => {
      if (settings.targets.some(item => item.sessionId === normalized.sessionId && item.nodeKey === normalized.nodeKey)) return null
      return { targets: [...settings.targets, normalized] }
    })
  }

  async removeTarget(sessionId, nodeKey) {
    await this.#updateSettings(settings => ({
      targets: settings.targets.filter(item => item.sessionId !== sessionId || item.nodeKey !== nodeKey),
    }))
  }

  async selectBook(bookId) {
    const nextId = bookId || null
    this.cacheGeneration += 1
    return this.#enqueueMutation(async () => {
      if (nextId && !this.state.books.some(book => book.id === nextId)) throw new Error('找不到这本书')
      if (nextId === this.state.settings.currentBookId) return
      await this.#saveSettings({ ...this.state.settings, currentBookId: nextId })
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
      : parseTextBook(await file.text(), extension, DEFAULT_SEGMENT_LENGTH)
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
      const books = this.state.books.filter(item => item.id !== bookId)
      const previousSettings = this.state.settings
      const settings = {
        ...previousSettings,
        currentBookId: previousSettings.currentBookId === bookId ? books[0]?.id ?? null : previousSettings.currentBookId,
      }
      // Save selection first: a failed settings write must not delete the selected book.
      await this.storage.saveSettings(settings)
      try {
        await this.storage.deleteBook(bookId)
      } catch (error) {
        await this.#restore(() => this.storage.saveSettings(previousSettings))
        throw error
      }
      this.#setState({ books, settings })
      if (settings.currentBookId !== previousSettings.currentBookId) this.#clearPassages(false)
    })
  }

  async claimPassage(stepKey) {
    if (this.disposed) return EMPTY_STATUS
    const generation = this.cacheGeneration
    const requestKey = `${generation}\u0000${stepKey}`
    const inFlight = this.pendingReads.get(requestKey)
    if (inFlight) return inFlight

    let bookId
    let loadingStatus
    const operation = this.#enqueueMutation(async () => {
      if (generation !== this.cacheGeneration) return EMPTY_STATUS
      bookId = this.state.settings.currentBookId
      if (!bookId) return EMPTY_STATUS
      const existing = this.getPassageStatus(bookId, stepKey)
      if (existing.kind === 'ready' || existing.kind === 'end') return existing
      const book = this.state.books.find(item => item.id === bookId)
      if (!book || book.progress >= book.segmentCount) {
        return this.#writePassageStatus(bookId, stepKey, { kind: 'end', bookId })
      }

      loadingStatus = { kind: 'loading' }
      this.#writePassageStatus(bookId, stepKey, loadingStatus)
      const index = book.progress
      const passage = await this.storage.getSegment(bookId, index)
      if (!passage?.text) throw new Error('当前段落为空或已损坏')
      if (generation !== this.cacheGeneration) return EMPTY_STATUS

      const updated = { ...book, progress: index + 1 }
      await this.storage.updateBook(updated)
      if (generation !== this.cacheGeneration) {
        await this.#restore(() => this.storage.updateBook(book))
        return EMPTY_STATUS
      }
      const result = { kind: 'ready', bookId, index, passage }
      this.#setState({ books: this.state.books.map(item => item.id === bookId ? updated : item) })
      return this.#writePassageStatus(bookId, stepKey, result)
    }).catch(error => {
      const failure = { kind: 'error', message: messageOf(error) }
      if (generation === this.cacheGeneration && bookId) this.#writePassageStatus(bookId, stepKey, failure)
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
      const stored = await this.storage.load()
      const books = stored.books ?? []
      const storedSettings = stored.settings ?? {}
      const availableIds = new Set(books.map(book => book.id))
      const settings = {
        ...DEFAULT_SETTINGS,
        ...storedSettings,
        currentBookId: availableIds.has(storedSettings.currentBookId) ? storedSettings.currentBookId : null,
        targets: Array.isArray(storedSettings.targets) ? storedSettings.targets : [],
      }
      this.#setState({ books, settings, hydrated: true, error: null })
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
      await this.storage.addBook(book, segments)
      const settings = this.state.settings.currentBookId
        ? this.state.settings
        : { ...this.state.settings, currentBookId: book.id }
      try {
        if (settings !== this.state.settings) await this.storage.saveSettings(settings)
      } catch (error) {
        await this.#restore(() => this.storage.deleteBook(book.id))
        throw error
      }
      if (settings !== this.state.settings) this.#clearPassages()
      this.#setState({ books: [...this.state.books, book], settings })
      return book
    })
  }

  #updateSettings(update) {
    return this.#enqueueMutation(async () => {
      const patch = update(this.state.settings)
      if (!patch) return this.state.settings
      return this.#saveSettings({ ...this.state.settings, ...patch })
    })
  }

  async #saveSettings(settings) {
    await this.storage.saveSettings(settings)
    this.#setState({ settings })
    return settings
  }

  #enqueueMutation(action) {
    const operation = this.mutationQueue.then(async () => {
      await this.ready
      this.#assertWritable()
      return action()
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

function randomId() {
  return globalThis.crypto?.randomUUID?.() ?? `book-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function messageOf(error) {
  return error instanceof Error ? error.message : String(error)
}
