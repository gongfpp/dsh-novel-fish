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

  async saveSettings(settings) {
    this.settings = { ...settings }
  }

  async addBook(book, segments) {
    this.books.set(book.id, { ...book })
    segments.forEach((segment, index) => this.passages.set(`${book.id}:${index}`, { ...segment }))
  }

  async updateBook(book) {
    this.books.set(book.id, { ...book })
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
    for (const key of this.passages.keys()) if (key.startsWith(`${bookId}:`)) this.passages.delete(key)
  }

  close() {}
}
