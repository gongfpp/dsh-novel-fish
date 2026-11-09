import { settingsPatch } from '../../src/settings-data.js'

export class MemoryStorage {
  constructor({ books = [], settings = {}, passages = {}, delayReads = 0 } = {}) {
    this.books = new Map(books.map(book => [book.id, { ...book }]))
    this.settings = { ...settings }
    this.passages = new Map()
    this.delayReads = delayReads
    this.failNextRead = false
    this.reads = 0
    for (const [bookId, segments] of Object.entries(passages)) {
      segments.forEach((segment, index) => this.passages.set(`${bookId}:${index}`, { ...segment }))
    }
  }

  async load() {
    return { books: [...this.books.values()].map(book => ({ ...book })), settings: { ...this.settings } }
  }

  async saveSettings(patch) {
    this.settings = settingsPatch({ ...this.settings, ...patch })
    return { ...this.settings }
  }

  async addBook(book, segments, { selectIfEmpty = false } = {}) {
    if (selectIfEmpty && !this.settings.currentBookId) this.settings.currentBookId = book.id
    this.books.set(book.id, { ...book })
    segments.forEach((segment, index) => this.passages.set(`${book.id}:${index}`, { ...segment }))
  }

  async updateBook(book, { expectedRevision, targetType } = {}) {
    const existing = this.books.get(book.id)
    if (!existing || (expectedRevision !== undefined && (existing.revision ?? 0) !== expectedRevision)) return null
    if (targetType && (this.settings.currentBookId !== book.id || this.settings.enabled === false
      || !(this.settings.targetTypes ?? ['reasoning']).includes(targetType))) return null
    const updated = expectedRevision === undefined ? book : { ...book, revision: (existing.revision ?? 0) + 1 }
    this.books.set(book.id, { ...updated })
    return updated
  }

  async getSegment(bookId, index) {
    this.reads += 1
    if (this.delayReads) await new Promise(resolve => setTimeout(resolve, this.delayReads))
    if (this.failNextRead) {
      this.failNextRead = false
      throw new Error('synthetic storage failure')
    }
    const segment = this.passages.get(`${bookId}:${index}`)
    return segment ? { ...segment } : null
  }

  async deleteBook(bookId) {
    this.books.delete(bookId)
    if (this.settings.currentBookId === bookId) this.settings.currentBookId = this.books.keys().next().value ?? null
    for (const key of this.passages.keys()) if (key.startsWith(`${bookId}:`)) this.passages.delete(key)
  }

  close() {}
}
