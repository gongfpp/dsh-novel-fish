import test from 'node:test'
import assert from 'node:assert/strict'
import { IDBFactory, IDBKeyRange } from 'fake-indexeddb'
import { IndexedDbStorage } from '../src/persistence.js'
import { DEFAULT_SETTINGS, NovelStore } from '../src/store.js'
import { parseTextBook } from '../src/segments.js'
import { MemoryStorage } from './helpers/memory-storage.js'

function bytesFile(name, bytes) {
  const buffer = Uint8Array.from(bytes).buffer
  return { name, arrayBuffer: async () => buffer }
}

function bundledBook(id, text = `${id} 正文。`, format = 'txt') {
  return { id, title: `${id} 标题`, format, createFile: () => bytesFile(`${id}.${format}`, new TextEncoder().encode(text)) }
}

function makeStorage(factory = new IDBFactory()) {
  return new IndexedDbStorage(factory, IDBKeyRange)
}

function entry(id, text = `${id} 正文。`) {
  const segments = parseTextBook(text).segments
  return {
    book: { id: `bundled:${id}`, bundledId: id, title: `${id} 标题`, format: 'txt', segmentCount: segments.length, progress: 0, importedAt: 123 },
    segments,
  }
}

async function expectUninitialized(storage) {
  assert.deepEqual(await storage.load(), { books: [], settings: undefined })
  assert.equal(await storage.getSegment('bundled:first', 0), null)
  assert.equal(await storage.getSegment('bundled:second', 0), null)
}

async function readSegments(storage, book) {
  return Promise.all(Array.from({ length: book.segmentCount }, (_, index) => storage.getSegment(book.id, index)))
}

test('fresh library provisions real readable default books and selects the descriptor-first book', async () => {
  const storage = makeStorage()
  const store = new NovelStore(storage, { bundledBooks: [bundledBook('z-first'), bundledBook('a-second', '# 章节\n\nMarkdown 正文。', 'md')] })
  try {
    assert.equal(store.getSnapshot().hydrated, false)
    await store.ready
    const state = store.getSnapshot()
    assert.equal(state.hydrated, true)
    assert.equal(state.error, null)
    assert.equal(state.books.length, 2)
    assert.equal(state.settings.currentBookId, 'bundled:z-first')
    assert.deepEqual(state.settings.targetTypes, ['reasoning'])
    assert.equal(state.settings.continueOnReopen, true)
    assert.equal(state.books.find(book => book.id === 'bundled:z-first').title, 'z-first 标题')
    assert.equal(state.books.find(book => book.id === 'bundled:z-first').bundledId, 'z-first')
    assert.equal((await storage.getSegment('bundled:a-second', 0)).chapterTitle, '章节')
    assert.equal((await store.claimPassage('reading')).passage.text, 'z-first 正文。')
    assert.equal((await storage.load()).books.find(book => book.id === 'bundled:z-first').progress, 1)
    assert.equal((await storage.load()).bundledBooksInitialized, true)
    assert.equal('bundledBooksInitialized' in store.getSettingsSnapshot(), false)
  } finally {
    store.dispose()
  }
})

test('ready awaits async factories and complete initialization without blocking queued mutations', async () => {
  const storage = makeStorage()
  let release
  const gate = new Promise(resolve => { release = resolve })
  const descriptor = bundledBook('first')
  const store = new NovelStore(storage, { bundledBooks: [{ ...descriptor, createFile: async () => { await gate; return descriptor.createFile() } }] })
  const pendingSetting = store.setOption('mainTitle', 'queued title')
  try {
    assert.equal(store.getSnapshot().hydrated, false)
    release()
    await store.ready
    await pendingSetting
    assert.equal(store.getSnapshot().books.length, 1)
    assert.equal(store.getSettingsSnapshot().mainTitle, 'queued title')
    assert.equal((await storage.load()).bundledBooksInitialized, true)
  } finally {
    store.dispose()
  }
})

test('existing books, progress, selection and settings survive provisioning unchanged', async () => {
  const storage = makeStorage()
  const originalBook = { id: 'user-book', title: 'User book', format: 'txt', segmentCount: 2, progress: 1, importedAt: 1 }
  const settings = { ...DEFAULT_SETTINGS, currentBookId: originalBook.id, enabled: false, targetTypes: ['command'], mainTitle: 'custom', extraTitle: 'extra', continueOnReopen: false }
  await storage.addBook(originalBook, [{ text: 'A' }, { text: 'B' }])
  await storage.saveSettings(settings)
  const store = new NovelStore(storage, { bundledBooks: [bundledBook('first'), bundledBook('second')] })
  try {
    await store.ready
    assert.equal(store.getSnapshot().books.length, 3)
    assert.deepEqual(store.getSnapshot().books.find(book => book.id === originalBook.id), originalBook)
    assert.deepEqual(store.getSettingsSnapshot(), settings)
    assert.deepEqual((await storage.load()).settings, settings)
    assert.deepEqual(await storage.getSegment(originalBook.id, 1), { text: 'B' })
  } finally {
    store.dispose()
  }
})

test('an existing library with no selected book is not automatically selected', async () => {
  const storage = makeStorage()
  await storage.addBook({ id: 'user-book', title: 'User', format: 'txt', segmentCount: 1, progress: 0 }, [{ text: 'existing' }])
  await storage.saveSettings({ ...DEFAULT_SETTINGS, currentBookId: null })
  const store = new NovelStore(storage, { bundledBooks: [bundledBook('first')] })
  try {
    await store.ready
    assert.equal(store.getSettingsSnapshot().currentBookId, null)
    assert.equal((await storage.load()).settings.currentBookId, null)
  } finally {
    store.dispose()
  }
})

test('deleted defaults and an entirely deleted library never reappear after refresh', async () => {
  const factory = new IDBFactory()
  const descriptors = [bundledBook('first'), bundledBook('second')]
  let store = new NovelStore(makeStorage(factory), { bundledBooks: descriptors })
  try {
    await store.ready
    await store.deleteBook('bundled:first')
    store.dispose()
    const noParseDescriptors = descriptors.map(descriptor => ({ ...descriptor, createFile: () => { throw new Error('defaults must not be parsed again') } }))
    store = new NovelStore(makeStorage(factory), { bundledBooks: noParseDescriptors })
    await store.ready
    assert.equal(store.getSnapshot().error, null)
    assert.deepEqual(store.getSnapshot().books.map(book => book.id), ['bundled:second'])
    await store.deleteBook('bundled:second')
    await store.setOption('mainTitle', 'marker survives normal settings writes')
    store.dispose()
    store = new NovelStore(makeStorage(factory), { bundledBooks: noParseDescriptors })
    await store.ready
    assert.equal(store.getSnapshot().error, null)
    assert.deepEqual(store.getSnapshot().books, [])
    assert.equal(store.getSettingsSnapshot().currentBookId, null)
    assert.equal(store.getSettingsSnapshot().mainTitle, 'marker survives normal settings writes')
    assert.equal((await store.storage.load()).bundledBooksInitialized, true)
  } finally {
    store.dispose()
  }
})

test('concurrent tabs recheck the marker atomically and both hydrate the winning library', async () => {
  const factory = new IDBFactory()
  let release
  let entered = 0
  const gate = new Promise(resolve => { release = resolve })
  const descriptor = bundledBook('first')
  const descriptors = [{ ...descriptor, createFile: async () => { entered += 1; if (entered === 2) release(); await gate; return descriptor.createFile() } }, bundledBook('second')]
  const first = new NovelStore(makeStorage(factory), { bundledBooks: descriptors })
  const second = new NovelStore(makeStorage(factory), { bundledBooks: descriptors })
  try {
    await Promise.all([first.ready, second.ready])
    assert.equal(first.getSnapshot().error, null)
    assert.equal(second.getSnapshot().error, null)
    assert.deepEqual(first.getSnapshot().books, second.getSnapshot().books)
    assert.equal(first.getSnapshot().books.length, 2)
    assert.equal(second.getSettingsSnapshot().currentBookId, 'bundled:first')
    await first.storage.initializeBundledBooks([entry('third')])
    assert.equal((await first.storage.load()).books.length, 2, 'completed marker also prevents later direct reseeding')
  } finally {
    first.dispose()
    second.dispose()
  }
})

for (const failure of ['parse', 'factory']) {
  test(`${failure} failure is visible, persists no partial library or marker, and a later write retries hydration`, async () => {
    const factory = new IDBFactory()
    const broken = failure === 'parse'
      ? bundledBook('second', '   ')
      : { ...bundledBook('second'), createFile: async () => { throw new Error('factory failed') } }
    let store = new NovelStore(makeStorage(factory), { bundledBooks: [bundledBook('first'), broken] })
    try {
      await store.ready
      assert.equal(store.getSnapshot().hydrated, true)
      assert.match(store.getSnapshot().error, failure === 'parse' ? /正文/ : /factory failed/)
      await expectUninitialized(store.storage)
      store.dispose()
      store = new NovelStore(makeStorage(factory), { bundledBooks: [bundledBook('first'), bundledBook('second')] })
      await store.ready
      assert.equal(store.getSnapshot().error, null)
      assert.equal(store.getSnapshot().books.length, 2)
      assert.equal((await store.storage.load()).bundledBooksInitialized, true)
    } finally {
      store.dispose()
    }
  })
}

test('synchronous transaction write failure rolls back preceding books, passages and marker', async () => {
  const storage = makeStorage()
  try {
    const invalid = entry('second')
    invalid.segments[0].uncloneable = () => undefined
    await assert.rejects(storage.initializeBundledBooks([entry('first'), invalid]), { name: 'DataCloneError' })
    await expectUninitialized(storage)
    assert.equal((await storage.initializeBundledBooks([entry('first'), entry('second')])).books.length, 2)
  } finally {
    storage.close()
  }
})

test('asynchronous abort after marker write rolls back all records and hydration can retry', async () => {
  const storage = makeStorage()
  await storage.load()
  const db = storage.database
  const transaction = db.transaction.bind(db)
  db.transaction = (...args) => {
    const tx = transaction(...args)
    if (args[1] === 'readwrite') {
      const settings = tx.objectStore('settings')
      const put = settings.put.bind(settings)
      settings.put = value => {
        const request = put(value)
        if (value.key === 'bundled-books-v1') request.addEventListener('success', () => tx.abort())
        return request
      }
    }
    return tx
  }
  const store = new NovelStore(storage, { bundledBooks: [bundledBook('first'), bundledBook('second')] })
  try {
    await store.ready
    assert.ok(store.getSnapshot().error)
    db.transaction = transaction
    await expectUninitialized(storage)
    const retried = await storage.initializeBundledBooks([entry('first'), entry('second')])
    assert.equal(retried.books.length, 2)
    assert.equal(retried.bundledBooksInitialized, true)
  } finally {
    store.dispose()
  }
})

test('the original constructor leaves a library empty without requiring a provisioning API', async () => {
  const memory = new MemoryStorage()
  assert.equal(memory.initializeBundledBooks, undefined)
  const oldStore = new NovelStore(memory)
  const storage = makeStorage()
  const emptyStore = new NovelStore(storage, { bundledBooks: [] })
  try {
    await Promise.all([oldStore.ready, emptyStore.ready])
    assert.deepEqual(oldStore.getSnapshot().books, [])
    assert.equal(oldStore.getSnapshot().error, null)
    assert.deepEqual(emptyStore.getSnapshot().books, [])
    await expectUninitialized(storage)
  } finally {
    oldStore.dispose()
    emptyStore.dispose()
  }
})

const OLD_AQ = '第一章　序\n\n旧正文一。\n\n第二章　大團圓\n\n旧正文二。\n\n旧正文三。\n'
const NEW_AQ = '## 第一章　序\n\n新正文一。\n\n## 第二章　大團圓\n\n新正文二。\n\n新正文三。\n\n新正文四。\n\n新正文五。\n'

async function seedOldLibrary(storage) {
  const old = entry('aq-zheng-zhuan', OLD_AQ)
  const removed = entry('shanhaijing-illustrated', '旧版默认节选。')
  const other = entry('million-pound-bank-note', 'English original remains untouched.')
  await storage.initializeBundledBooks([old, removed, other], 2)
  const aq = { ...old.book, title: '原来的阿Q标题', progress: 1, customMetadata: 'kept' }
  await storage.updateBook(aq)
  await storage.saveSettings({
    ...DEFAULT_SETTINGS, currentBookId: aq.id, mainTitle: '用户标题', extraTitle: '附加',
    continueOnReopen: false, targetTypes: ['command'], customSetting: 'unchanged',
  })
  return { aq, removed, other }
}

function refreshedCatalog() {
  return {
    version: 3,
    removedIds: ['shanhaijing-illustrated'],
    refreshes: [{
      id: 'aq-zheng-zhuan',
      format: 'md',
      createFile: () => bytesFile('aq-zheng-zhuan.md', new TextEncoder().encode(NEW_AQ)),
    }],
  }
}

test('a catalog refresh replaces an owned default body, scales progress and keeps identity and settings', async () => {
  const storage = makeStorage()
  const seed = await seedOldLibrary(storage)
  const before = await storage.load()
  const store = new NovelStore(storage, { bundledBooks: [], bundledCatalog: refreshedCatalog() })
  try {
    await store.ready
    assert.equal(store.getSnapshot().error, null)
    const after = await storage.load()
    const aq = after.books.find(book => book.id === seed.aq.id)
    const segments = parseTextBook(NEW_AQ, 'md').segments
    assert.equal(after.bundledCatalogVersion, 3)
    assert.equal(aq.format, 'md')
    assert.equal(aq.segmentCount, segments.length)
    assert.equal(aq.title, '原来的阿Q标题')
    assert.equal(aq.importedAt, seed.aq.importedAt)
    assert.equal(aq.customMetadata, 'kept')
    assert.equal(aq.revision, (seed.aq.revision ?? 0) + 1)
    assert.notEqual(aq.positionToken, seed.aq.positionToken)
    assert.equal(aq.progress, Math.round((seed.aq.progress / seed.aq.segmentCount) * segments.length))
    assert.deepEqual(await readSegments(storage, aq), segments)
    assert.deepEqual(after.settings, before.settings)
    assert.deepEqual(after.books.find(book => book.id === seed.other.book.id), seed.other.book)
    assert.equal(after.books.some(book => book.id === seed.removed.book.id), false)
    assert.equal(await storage.getSegment(seed.removed.book.id, 0), null)
  } finally {
    store.dispose()
  }
})

test('a refresh never resurrects a deleted default or claims a manually imported lookalike', async () => {
  const storage = makeStorage()
  const seed = await seedOldLibrary(storage)
  await storage.deleteBook(seed.aq.id)
  const manual = { id: 'manual-aq', title: '阿Q正传', format: 'txt', segmentCount: 1, progress: 0 }
  await storage.addBook(manual, parseTextBook(OLD_AQ).segments.slice(0, 1))
  const store = new NovelStore(storage, { bundledBooks: [], bundledCatalog: refreshedCatalog() })
  try {
    await store.ready
    assert.equal(store.getSnapshot().error, null)
    const after = await storage.load()
    assert.equal(after.books.some(book => book.id === seed.aq.id), false, 'deleted default must stay deleted')
    assert.deepEqual(after.books.find(book => book.id === manual.id), manual)
    assert.equal(after.bundledCatalogVersion, 3)
  } finally {
    store.dispose()
  }
})

test('a removed default drops its book and moves the selection to a remaining book', async () => {
  const storage = makeStorage()
  const seed = await seedOldLibrary(storage)
  await storage.saveSettings({ ...DEFAULT_SETTINGS, currentBookId: seed.removed.book.id, mainTitle: '用户标题' })
  const store = new NovelStore(storage, { bundledBooks: [], bundledCatalog: refreshedCatalog() })
  try {
    await store.ready
    assert.equal(store.getSnapshot().error, null)
    const after = await storage.load()
    assert.equal(after.books.some(book => book.id === seed.removed.book.id), false)
    assert.equal(after.settings.currentBookId, seed.aq.id)
    assert.equal(after.settings.mainTitle, '用户标题')
    assert.equal(after.bundledCatalogVersion, 3)
  } finally {
    store.dispose()
  }
})

test('a failed refresh is visible, leaves the library intact and retries on the next write', async () => {
  const storage = makeStorage()
  const seed = await seedOldLibrary(storage)
  const before = await storage.load()
  const broken = { ...refreshedCatalog(), refreshes: [{ id: 'aq-zheng-zhuan', format: 'md', createFile: () => bytesFile('broken.md', new Uint8Array([0xff, 0xff, 0xff])) }] }
  const store = new NovelStore(storage, { bundledBooks: [], bundledCatalog: broken })
  try {
    await store.ready
    assert.match(store.getSnapshot().error, /编码/u)
    assert.deepEqual(await storage.load(), before)
    await assert.rejects(store.setOption('enabled', false), /本地书库不可用/u)
  } finally {
    store.dispose()
  }
  const retried = new NovelStore(storage, { bundledBooks: [], bundledCatalog: refreshedCatalog() })
  try {
    await retried.ready
    assert.equal(retried.getSnapshot().error, null)
    const after = await storage.load()
    assert.equal(after.bundledCatalogVersion, 3)
    assert.equal(after.books.find(book => book.id === seed.aq.id).format, 'md')
  } finally {
    retried.dispose()
  }
})
