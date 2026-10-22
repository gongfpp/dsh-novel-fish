const DATABASE_NAME = 'dsh-touch-fish-novel'
const DATABASE_VERSION = 1
const SETTINGS_KEY = 'settings'

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
    const books = await requestResult(tx.objectStore('books').getAll())
    const settings = await requestResult(tx.objectStore('settings').get(SETTINGS_KEY))
    await done
    return { books, settings: settings?.value }
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
