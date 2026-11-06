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

  close() {
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

  async saveSettings(value) {
    const db = await this.#open()
    const tx = db.transaction('settings', 'readwrite')
    const done = transactionDone(tx)
    tx.objectStore('settings').put({ key: SETTINGS_KEY, value })
    await done
  }

  async addBook(book, segments) {
    const db = await this.#open()
    const tx = db.transaction(['books', 'segments'], 'readwrite')
    const done = transactionDone(tx)
    tx.objectStore('books').put(book)
    const segmentStore = tx.objectStore('segments')
    segments.forEach((segment, index) => segmentStore.put({
      id: `${book.id}:${index}`,
      bookId: book.id,
      index,
      ...segment,
    }))
    await done
  }

  async updateBook(book) {
    const db = await this.#open()
    const tx = db.transaction('books', 'readwrite')
    const done = transactionDone(tx)
    const books = tx.objectStore('books')
    const existing = await requestResult(books.get(book.id))
    if (!existing) {
      await done
      throw new Error('找不到这本书，无法保存阅读进度')
    }
    books.put(book)
    await done
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
    const tx = db.transaction(['books', 'segments'], 'readwrite')
    const done = transactionDone(tx)
    tx.objectStore('books').delete(bookId)
    const cursorRequest = tx.objectStore('segments').index('bookId').openCursor(this.keyRange.only(bookId))
    cursorRequest.onsuccess = () => {
      const cursor = cursorRequest.result
      if (!cursor) return
      cursor.delete()
      cursor.continue()
    }
    await done
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
