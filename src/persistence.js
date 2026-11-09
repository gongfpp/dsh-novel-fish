import { settingsPatch } from './settings-data.js'
import { randomId } from './random-id.js'

const DATABASE_NAME = 'dsh-touch-fish-novel'
const DATABASE_VERSION = 1
const SETTINGS_KEY = 'settings'
const BUNDLED_BOOKS_KEY = 'bundled-books-v1'
const BUNDLED_CATALOG_KEY = 'bundled-catalog-version'

/** IndexedDB persistence for book metadata, parsed passages, and plugin settings. */
export class IndexedDbStorage {
  constructor(indexedDb = globalThis.indexedDB, keyRange = globalThis.IDBKeyRange) {
    this.indexedDb = indexedDb
    this.keyRange = keyRange
    this.database = undefined
  }

  subscribe(listener) {
    // Node's BroadcastChannel keeps test processes alive; only browser pages sync.
    if (typeof window === 'undefined' || typeof window.addEventListener !== 'function' || typeof document === 'undefined') return () => {}
    const channel = typeof window.BroadcastChannel === 'function' ? new window.BroadcastChannel(DATABASE_NAME) : null
    this.channel = channel
    const refresh = () => listener()
    channel?.addEventListener('message', refresh)
    window.addEventListener('focus', refresh)
    const visible = () => { if (document.visibilityState === 'visible') refresh() }
    document.addEventListener('visibilitychange', visible)
    return () => {
      channel?.close()
      if (this.channel === channel) this.channel = null
      window.removeEventListener('focus', refresh)
      document.removeEventListener('visibilitychange', visible)
    }
  }

  notify() { this.channel?.postMessage('changed') }

  close() {
    this.channel?.close()
    this.channel = null
    this.database?.close()
    this.database = undefined
  }

  async load() {
    const db = await this.#open()
    const tx = db.transaction(['books', 'settings'], 'readonly')
    const done = transactionDone(tx)
    const stored = await readLibrary(tx)
    await done
    return stored
  }

  /** Seed ordinary, deletable books exactly once, including across concurrent tabs. */
  async initializeBundledBooks(entries, catalogVersion) {
    if (catalogVersion !== undefined && (!Number.isSafeInteger(catalogVersion) || catalogVersion < 1)) throw new Error('内置书目版本无效')
    if (!Array.isArray(entries) || !entries.length) throw new Error('内置书籍列表不能为空')
    const ids = new Set()
    for (const { book, segments } of entries) {
      if (!book?.id || !book.bundledId || !Array.isArray(segments) || !segments.length
        || book.segmentCount !== segments.length || ids.has(book.id)) {
        throw new Error('内置书籍数据无效或重复')
      }
      ids.add(book.id)
    }
    const db = await this.#open()
    const tx = db.transaction(['books', 'segments', 'settings'], 'readwrite')
    const done = transactionDone(tx)
    // A synchronous put failure must still consume the subsequent abort rejection.
    done.catch(() => undefined)
    try {
      const stored = await readLibrary(tx)
      if (!stored.bundledBooksInitialized) {
        const bookStore = tx.objectStore('books')
        const segmentStore = tx.objectStore('segments')
        const existingBooks = [...stored.books]
        let firstBookId
        for (const { book, segments } of entries) {
          let matchingBook
          for (const candidate of existingBooks) {
            // EPUB metadata titles can differ from the concise bundled menu title.
            if (candidate.format !== book.format || candidate.segmentCount !== segments.length) continue
            const existingSegments = await requestResult(segmentStore.index('bookId').getAll(this.keyRange.only(candidate.id)))
            const byIndex = new Map(existingSegments.map(segment => [segment.index, segment]))
            if (existingSegments.length === segments.length && segments.every((segment, index) => sameSegment(byIndex.get(index), segment))) {
              matchingBook = candidate
              break
            }
          }
          if (matchingBook) {
            firstBookId ??= matchingBook.id
            continue // Legacy imports keep their original IDs, metadata and progress.
          }
          if (existingBooks.some(candidate => candidate.id === book.id)) throw new Error('内置书籍 ID 与已有书籍冲突')
          bookStore.add(book)
          segments.forEach((segment, index) => segmentStore.add({
            ...segment, id: `${book.id}:${index}`, bookId: book.id, index,
          }))
          existingBooks.push(book)
          firstBookId ??= book.id
        }
        // Do not replace an existing user's intentional empty selection or settings.
        if (!stored.books.length && !stored.settings?.currentBookId) {
          tx.objectStore('settings').put({ key: SETTINGS_KEY, value: { ...stored.settings, currentBookId: firstBookId } })
        }
        tx.objectStore('settings').put({ key: BUNDLED_BOOKS_KEY, value: true })
        if (catalogVersion !== undefined) tx.objectStore('settings').put({ key: BUNDLED_CATALOG_KEY, value: catalogVersion })
      }
      // Read inside this transaction: a losing initializer sees the winner's state.
      const latest = await readLibrary(tx)
      await done
      return latest
    } catch (error) {
      try { tx.abort() } catch { /* The transaction may already have aborted. */ }
      await done.catch(() => undefined)
      throw error
    }
  }

  /** Upgrade only identifiable defaults; metadata, deletion and marker commit together. */
  async migrateBundledCatalog({ version, removedIds = [], updates = [] }) {
    if (!Number.isSafeInteger(version) || version < 1 || !Array.isArray(removedIds)
      || removedIds.some(id => typeof id !== 'string' || !id) || !Array.isArray(updates)
      || updates.some(update => !update?.id || !['txt', 'md'].includes(update.fromFormat)
        || !['txt', 'md'].includes(update.format) || !Array.isArray(update.segments) || !update.segments.length)) {
      throw new Error('内置书目迁移数据无效')
    }
    const db = await this.#open()
    const tx = db.transaction(['books', 'segments', 'settings'], 'readwrite')
    const done = transactionDone(tx)
    done.catch(() => undefined)
    try {
      const stored = await readLibrary(tx)
      if (stored.bundledBooksInitialized && (stored.bundledCatalogVersion ?? 0) < version) {
        const books = tx.objectStore('books')
        const segments = tx.objectStore('segments')
        const removedBookIds = new Set()
        const owned = (book, id) => book.bundledId === id || book.id === `bundled:${id}`
        for (const book of stored.books) {
          if (removedIds.some(id => owned(book, id))) {
            books.delete(book.id)
            const keys = await requestResult(segments.index('bookId').getAllKeys(this.keyRange.only(book.id)))
            keys.forEach(key => segments.delete(key))
            removedBookIds.add(book.id)
            continue
          }
          const update = updates.find(update => owned(book, update.id) && book.format === update.fromFormat)
          if (!update || book.segmentCount !== update.segments.length) continue
          const existing = await requestResult(segments.index('bookId').getAll(this.keyRange.only(book.id)))
          const byIndex = new Map(existing.map(segment => [segment.index, segment]))
          if (existing.length === update.segments.length && update.segments.every((segment, index) => sameSegment(byIndex.get(index), segment))) {
            // Keep every passage, ID, title, import time and progress byte-for-byte;
            // only the file-format label changes after exact canonical comparison.
            books.put({ ...book, format: update.format })
          }
        }
        if (removedBookIds.has(stored.settings?.currentBookId)) {
          const currentBookId = stored.books.find(book => !removedBookIds.has(book.id))?.id ?? null
          tx.objectStore('settings').put({ key: SETTINGS_KEY, value: { ...stored.settings, currentBookId } })
        }
        // Even a deliberately empty library advances without reseeding anything.
        tx.objectStore('settings').put({ key: BUNDLED_CATALOG_KEY, value: version })
      }
      const latest = await readLibrary(tx)
      await done
      return latest
    } catch (error) {
      try { tx.abort() } catch { /* The transaction may already have aborted. */ }
      await done.catch(() => undefined)
      throw error
    }
  }

  async saveSettings(patch) {
    const db = await this.#open()
    const tx = db.transaction(['settings', 'books'], 'readwrite')
    const done = transactionDone(tx)
    done.catch(() => undefined)
    const settings = tx.objectStore('settings')
    const previous = await requestResult(settings.get(SETTINGS_KEY))
    const value = settingsPatch({ ...previous?.value, ...patch })
    if (value.currentBookId && !await requestResult(tx.objectStore('books').get(value.currentBookId))) {
      await done
      throw new Error('找不到这本书')
    }
    settings.put({ key: SETTINGS_KEY, value })
    await done
    this.notify()
    return value
  }

  async addBook(book, segments, { selectIfEmpty = false } = {}) {
    const db = await this.#open()
    const tx = db.transaction(['books', 'segments', 'settings'], 'readwrite')
    const done = transactionDone(tx)
    done.catch(() => undefined)
    tx.objectStore('books').add(book)
    const segmentStore = tx.objectStore('segments')
    segments.forEach((segment, index) => segmentStore.put({
      id: `${book.id}:${index}`,
      bookId: book.id,
      index,
      ...segment,
    }))
    if (selectIfEmpty) {
      const settings = tx.objectStore('settings')
      const previous = (await requestResult(settings.get(SETTINGS_KEY)))?.value ?? {}
      if (!previous.currentBookId) settings.put({ key: SETTINGS_KEY, value: { ...previous, currentBookId: book.id } })
    }
    await done
    this.notify()
  }

  async updateBook(book, { expectedRevision, targetType } = {}) {
    const db = await this.#open()
    const tx = db.transaction(['books', 'settings'], 'readwrite')
    const done = transactionDone(tx)
    done.catch(() => undefined)
    const books = tx.objectStore('books')
    const existing = await requestResult(books.get(book.id))
    if (!existing) {
      await done
      if (expectedRevision !== undefined) return null
      throw new Error('找不到这本书，无法保存阅读进度')
    }
    if (expectedRevision !== undefined && (existing.revision ?? 0) !== expectedRevision) { await done; return null }
    if (targetType) {
      const settings = (await requestResult(tx.objectStore('settings').get(SETTINGS_KEY)))?.value ?? {}
      if (settings.currentBookId !== book.id || settings.enabled === false
        || !(settings.targetTypes ?? ['reasoning']).includes(targetType)) { await done; return null }
    }
    const updated = expectedRevision === undefined ? book : { ...book, revision: (existing.revision ?? 0) + 1 }
    books.put(updated)
    await done
    this.notify()
    return updated
  }

  async getSegment(bookId, index) {
    const db = await this.#open()
    const tx = db.transaction('segments', 'readonly')
    const done = transactionDone(tx)
    const result = await requestResult(tx.objectStore('segments').get(`${bookId}:${index}`))
    await done
    if (!result) return null
    const { id: _id, bookId: _bookId, index: _index, ...segment } = result
    return segment
  }

  async deleteBook(bookId) {
    const db = await this.#open()
    const tx = db.transaction(['books', 'segments', 'settings'], 'readwrite')
    const done = transactionDone(tx)
    done.catch(() => undefined)
    tx.objectStore('books').delete(bookId)
    const settings = tx.objectStore('settings')
    const previous = (await requestResult(settings.get(SETTINGS_KEY)))?.value
    if (previous?.currentBookId === bookId) {
      const books = await requestResult(tx.objectStore('books').getAll())
      settings.put({ key: SETTINGS_KEY, value: { ...previous, currentBookId: books[0]?.id ?? null } })
    }
    const cursorRequest = tx.objectStore('segments').index('bookId').openCursor(this.keyRange.only(bookId))
    cursorRequest.onsuccess = () => {
      const cursor = cursorRequest.result
      if (!cursor) return
      cursor.delete()
      cursor.continue()
    }
    await done
    this.notify()
  }

  async exportLibrary() {
    const db = await this.#open()
    const tx = db.transaction(['books', 'segments', 'settings'], 'readonly')
    const done = transactionDone(tx)
    done.catch(() => undefined)
    const [stored, records] = await Promise.all([readLibrary(tx), requestResult(tx.objectStore('segments').getAll())])
    const byBook = new Map()
    for (const { id: _id, bookId, index, ...segment } of records) {
      if (!byBook.has(bookId)) byBook.set(bookId, [])
      byBook.get(bookId)[index] = segment
    }
    await done
    return { ...stored, books: stored.books.map(book => ({ book, segments: byBook.get(book.id) ?? [] })) }
  }

  /** Merge atomically; existing text/metadata/progress are never overwritten. */
  async restoreLibrary(backup) {
    const db = await this.#open()
    const tx = db.transaction(['books', 'segments', 'settings'], 'readwrite')
    const done = transactionDone(tx)
    done.catch(() => undefined)
    try {
      const stored = await readLibrary(tx)
      const books = tx.objectStore('books'), segments = tx.objectStore('segments')
      const candidates = [...stored.books]
      const idMap = new Map()
      let added = 0
      for (const entry of backup.books) {
        let match
        for (const candidate of candidates) {
          if (candidate.title !== entry.book.title || candidate.format !== entry.book.format
            || candidate.segmentCount !== entry.segments.length) continue
          const records = await requestResult(segments.index('bookId').getAll(this.keyRange.only(candidate.id)))
          const byIndex = new Map(records.map(segment => [segment.index, segment]))
          if (records.length === entry.segments.length && entry.segments.every((segment, index) => sameSegment(byIndex.get(index), segment))) {
            match = candidate
            break
          }
        }
        if (match) { idMap.set(entry.book.id, match.id); continue }
        // Always allocate a new identity: a backup cannot impersonate bundled defaults.
        const book = { ...entry.book, id: randomId() }
        books.add(book)
        entry.segments.forEach((segment, index) => segments.add({ ...segment, id: `${book.id}:${index}`, bookId: book.id, index }))
        candidates.push(book)
        idMap.set(entry.book.id, book.id)
        added++
      }
      const settings = { ...stored.settings, ...backup.settings,
        currentBookId: idMap.get(backup.settings.currentBookId) ?? null }
      tx.objectStore('settings').put({ key: SETTINGS_KEY, value: settingsPatch(settings) })
      // Restoring an empty library must not trigger bundled provisioning on reload.
      tx.objectStore('settings').put({ key: BUNDLED_BOOKS_KEY, value: true })
      await done
      this.notify()
      return { added, reused: backup.books.length - added }
    } catch (error) {
      try { tx.abort() } catch { /* Already settled. */ }
      await done.catch(() => undefined)
      throw error
    }
  }

  async #open() {
    if (this.database) return this.database
    if (!this.indexedDb) throw new Error('当前浏览器不支持 IndexedDB')
    this.database = await new Promise((resolve, reject) => {
      const request = this.indexedDb.open(DATABASE_NAME, DATABASE_VERSION)
      request.onupgradeneeded = () => {
        const db = request.result
        if (!db.objectStoreNames.contains('books')) db.createObjectStore('books', { keyPath: 'id' })
        if (!db.objectStoreNames.contains('segments')) {
          const store = db.createObjectStore('segments', { keyPath: 'id' })
          store.createIndex('bookId', 'bookId', { unique: false })
        }
        if (!db.objectStoreNames.contains('settings')) db.createObjectStore('settings', { keyPath: 'key' })
      }
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error ?? new Error('无法打开本地书库'))
      request.onblocked = () => reject(new Error('本地书库正在被其他页面占用，请关闭重复页面后重试'))
    })
    this.database.onversionchange = () => {
      this.database?.close()
      this.database = undefined
    }
    return this.database
  }
}

async function readLibrary(tx) {
  const [books, settings, marker, catalog] = await Promise.all([
    requestResult(tx.objectStore('books').getAll()),
    requestResult(tx.objectStore('settings').get(SETTINGS_KEY)),
    requestResult(tx.objectStore('settings').get(BUNDLED_BOOKS_KEY)),
    requestResult(tx.objectStore('settings').get(BUNDLED_CATALOG_KEY)),
  ])
  return { books, settings: settings?.value,
    ...(marker?.value === true ? { bundledBooksInitialized: true } : {}),
    ...(Number.isSafeInteger(catalog?.value) && catalog.value > 0 ? { bundledCatalogVersion: catalog.value } : {}),
  }
}

function sameSegment(stored, parsed) {
  if (!stored) return false
  const { id: _id, bookId: _bookId, index: _index, ...content } = stored
  const keys = Object.keys(parsed)
  return Object.keys(content).length === keys.length && keys.every(key => content[key] === parsed[key])
}

function requestResult(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('本地书库读写失败'))
  })
}

function transactionDone(transaction) {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve()
    transaction.onerror = () => reject(transaction.error ?? new Error('本地书库事务失败'))
    transaction.onabort = () => reject(transaction.error ?? new Error('本地书库事务已取消'))
  })
}
