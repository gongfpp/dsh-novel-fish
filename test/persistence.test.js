import test from 'node:test'
import assert from 'node:assert/strict'
import { IDBFactory, IDBKeyRange } from 'fake-indexeddb'
import { IndexedDbStorage } from '../src/persistence.js'

test('IndexedDB stores metadata/settings separately from lazily-read passage records', async () => {
  const storage = new IndexedDbStorage(new IDBFactory(), IDBKeyRange)
  const book = { id: 'book-test', title: 'Test', format: 'txt', segmentCount: 2, progress: 0 }
  try {
    assert.deepEqual(await storage.load(), { books: [], settings: undefined })
    await storage.addBook(book, [{ text: 'A', chapterTitle: 'One', chapterIndex: 0 }, { text: 'B', chapterTitle: 'Two', chapterIndex: 1 }])
    await storage.saveSettings({ currentBookId: book.id })
    assert.deepEqual(await storage.load(), { books: [book], settings: { currentBookId: book.id } })
    assert.deepEqual(await storage.getSegment(book.id, 1), { text: 'B', chapterTitle: 'Two', chapterIndex: 1 })
    assert.equal(await storage.getSegment(book.id, 2), null)

    await storage.updateBook({ ...book, progress: 1 })
    assert.equal((await storage.load()).books[0].progress, 1)
    await storage.deleteBook(book.id)
    assert.equal(await storage.getSegment(book.id, 0), null)
    assert.equal(await storage.getSegment(book.id, 1), null)
    await assert.rejects(storage.updateBook({ ...book, progress: 2 }), /找不到这本书/u)
    assert.deepEqual(await storage.load(), { books: [], settings: { currentBookId: book.id } })
  } finally {
    storage.close()
  }
})
