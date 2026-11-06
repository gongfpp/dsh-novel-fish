import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
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
  const settings = { ...DEFAULT_SETTINGS, currentBookId: originalBook.id, enabled: false, targetTypes: ['command'], mainTitle: 'custom', extraTitle: 'extra', continueOnReopen: true }
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

test('a legacy full AQ import is adopted only after every parsed segment matches, without changing progress or ID', async () => {
  const factory = new IDBFactory()
  const storage = makeStorage(factory)
  const markdown = await readFile(new URL('../samples/ebooks/aq-zheng-zhuan-wikisource.md', import.meta.url), 'utf8')
  const bytes = new TextEncoder().encode(markdown.slice('# 阿Q正傳\n\n'.length))
  const file = bytesFile('阿Q正传.txt', bytes)
  const original = new NovelStore(storage)
  await original.ready
  const imported = await original.importFile(file)
  const advanced = { ...imported, progress: 7 }
  await storage.updateBook(advanced)
  const before = await storage.load()
  original.dispose()
  const store = new NovelStore(makeStorage(factory), { bundledBooks: [{ id: 'aq-zheng-zhuan', title: '阿Q正传', format: 'txt', createFile: () => file }, bundledBook('second')] })
  try {
    await store.ready
    assert.equal(store.getSnapshot().error, null)
    assert.equal(imported.segmentCount, 98)
    assert.equal(store.getSnapshot().books.length, 2)
    assert.deepEqual(store.getSnapshot().books.find(book => book.id === imported.id), advanced)
    assert.equal(store.getSnapshot().books.some(book => book.id === 'bundled:aq-zheng-zhuan'), false)
    assert.deepEqual((await store.storage.load()).settings, before.settings)
    assert.equal((await store.storage.getSegment(imported.id, 97)).text.length > 0, true)
  } finally {
    store.dispose()
  }
})

for (const mismatch of ['last text', 'chapter metadata']) {
  test(`same title/format/count does not conflate different content: ${mismatch}`, async () => {
    const storage = makeStorage()
    const descriptor = bundledBook('first', '第一章 开始\n\n首段。\n\n第二章 结束\n\n末段。')
    const parsed = parseTextBook('第一章 开始\n\n首段。\n\n第二章 结束\n\n末段。').segments
    const changed = structuredClone(parsed)
    if (mismatch === 'last text') changed.at(-1).text = '不同的末段。'
    else changed.at(-1).chapterTitle = '不同章节'
    const userBook = { id: 'user-book', title: descriptor.title, format: 'txt', segmentCount: parsed.length, progress: 1 }
    await storage.addBook(userBook, changed)
    const store = new NovelStore(storage, { bundledBooks: [descriptor] })
    try {
      await store.ready
      assert.equal(store.getSnapshot().error, null)
      assert.equal(store.getSnapshot().books.length, 2)
      assert.deepEqual(store.getSnapshot().books.find(book => book.id === userBook.id), userBook)
      assert.deepEqual(await storage.getSegment(userBook.id, 1), changed[1])
      assert.deepEqual(await storage.getSegment('bundled:first', 1), parsed[1])
    } finally {
      store.dispose()
    }
  })
}

for (const failure of ['parse', 'factory']) {
  test(`${failure} failure is visible, persists no partial library or marker, and permits refresh retry`, async () => {
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
      await assert.rejects(store.setOption('enabled', false), /本地书库不可用/)
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

async function actualCatalog() {
  const manifest = JSON.parse(await readFile(new URL('../samples/ebooks/sources.json', import.meta.url), 'utf8'))
  const markdown = await readFile(new URL('../samples/ebooks/aq-zheng-zhuan-wikisource.md', import.meta.url), 'utf8')
  const legacyText = markdown.slice('# 阿Q正傳\n\n'.length)
  return {
    legacyText,
    bundledBooks: manifest.books.map(book => ({ ...book, createFile: async () => bytesFile(book.file, await readFile(new URL(`../samples/ebooks/${book.file}`, import.meta.url))) })),
    bundledCatalog: { version: 2, removedIds: ['shanhaijing-illustrated'], updates: [{ id: 'aq-zheng-zhuan', fromFormat: 'txt', format: 'md', createFile: () => bytesFile('old.txt', new TextEncoder().encode(legacyText)) }] },
  }
}
async function oldCatalog(storage, { selected = 'bundled:aq-zheng-zhuan', taggedRandom = false } = {}) {
  const catalog = await actualCatalog()
  const aq = entry('aq-zheng-zhuan', catalog.legacyText)
  aq.book = { ...aq.book, ...(taggedRandom ? { id: 'tagged-aq' } : {}), title: '原来的阿Q标题', progress: 7, customMetadata: 'kept' }
  const removed = entry('shanhaijing-illustrated', '旧版默认节选。')
  if (taggedRandom) removed.book.id = 'tagged-removed'
  const english = entry('million-pound-bank-note', 'English original remains untouched.')
  await storage.initializeBundledBooks([english, removed, aq])
  const settings = { ...DEFAULT_SETTINGS, currentBookId: selected, mainTitle: '用户标题', extraTitle: '附加', continueOnReopen: true, targetTypes: ['command'], customSetting: 'unchanged' }
  await storage.saveSettings(settings)
  return { catalog, aq, removed, english, settings }
}

test('actual fresh catalog provisions exactly English TXT and complete AQ MD and advances both markers atomically', async () => {
  const catalog = await actualCatalog()
  const storage = makeStorage()
  const store = new NovelStore(storage, catalog)
  try {
    await store.ready
    assert.equal(store.getSnapshot().error, null)
    assert.deepEqual(store.getSnapshot().books.map(book => [book.bundledId, book.format]), [['aq-zheng-zhuan', 'md'], ['million-pound-bank-note', 'txt']])
    assert.equal(store.getSettingsSnapshot().currentBookId, 'bundled:million-pound-bank-note')
    assert.equal((await storage.load()).bundledCatalogVersion, 2)
    const aq = store.getSnapshot().books.find(book => book.bundledId === 'aq-zheng-zhuan')
    const body = (await Promise.all(Array.from({ length: aq.segmentCount }, (_, index) => storage.getSegment(aq.id, index)))).map(segment => segment.text).join('')
    assert.match(body, /第九章/u)
    assert.match(body, /Dbenbenn/u)
  } finally { store.dispose() }
})

for (const taggedRandom of [false, true]) {
  test(`v1 catalog migration preserves canonical AQ identity/progress/passages/settings and removes only defaults (tagged random: ${taggedRandom})`, async () => {
    const storage = makeStorage()
    const seed = await oldCatalog(storage, { taggedRandom, selected: taggedRandom ? 'tagged-aq' : 'bundled:aq-zheng-zhuan' })
    if (!taggedRandom) {
      // Stable default IDs are sufficient, even if an old record lost its tag.
      delete seed.aq.book.bundledId
      delete seed.removed.book.bundledId
      await storage.updateBook(seed.aq.book)
      await storage.updateBook(seed.removed.book)
    }
    const manual = [
      { ...seed.aq.book, id: 'manual-aq', bundledId: undefined },
      { ...seed.removed.book, id: 'manual-shanhaijing', bundledId: undefined },
    ].map(({ bundledId: _tag, ...book }) => book)
    await storage.addBook(manual[0], seed.aq.segments)
    await storage.addBook(manual[1], seed.removed.segments)
    const before = await storage.load()
    const store = new NovelStore(storage, seed.catalog)
    try {
      await store.ready
      assert.equal(store.getSnapshot().error, null)
      const after = await storage.load()
      assert.equal(after.bundledCatalogVersion, 2)
      assert.equal(after.bundledBooksInitialized, true)
      assert.deepEqual(after.settings, before.settings)
      assert.equal(store.getSettingsSnapshot().currentBookId, seed.aq.book.id)
      assert.deepEqual(after.books.find(book => book.id === seed.aq.book.id), { ...seed.aq.book, format: 'md' })
      for (let index = 0; index < seed.aq.segments.length; index++) assert.deepEqual(await storage.getSegment(seed.aq.book.id, index), seed.aq.segments[index])
      assert.equal(await storage.getSegment(seed.removed.book.id, 0), null)
      assert.equal(after.books.some(book => book.id === seed.removed.book.id), false)
      for (const book of manual) assert.deepEqual(after.books.find(candidate => candidate.id === book.id), book)
      assert.deepEqual(await storage.getSegment(manual[1].id, 0), seed.removed.segments[0])
      assert.deepEqual(after.books.find(book => book.id === seed.english.book.id), seed.english.book)
    } finally { store.dispose() }
  })
}

for (const keepEnglish of [false, true]) {
  test(`removed current default selects a remaining book or null atomically (remaining: ${keepEnglish})`, async () => {
    const storage = makeStorage()
    const seed = await oldCatalog(storage, { selected: 'bundled:shanhaijing-illustrated' })
    await storage.deleteBook(seed.aq.book.id)
    if (!keepEnglish) await storage.deleteBook(seed.english.book.id)
    const store = new NovelStore(storage, seed.catalog)
    try {
      await store.ready
      assert.equal(store.getSnapshot().error, null)
      const expectedId = keepEnglish ? seed.english.book.id : null
      assert.equal(store.getSettingsSnapshot().currentBookId, expectedId)
      assert.deepEqual((await storage.load()).settings, { ...seed.settings, currentBookId: expectedId })
      assert.equal((await storage.load()).bundledCatalogVersion, 2)
      assert.equal(await storage.getSegment(seed.removed.book.id, 0), null)
    } finally { store.dispose() }
  })
}

for (const clearAll of [false, true]) {
  test(`v1 deleted defaults do not respawn during upgrade or subsequent refresh (cleared: ${clearAll})`, async () => {
    const factory = new IDBFactory()
    const storage = makeStorage(factory)
    const seed = await oldCatalog(storage)
    await storage.deleteBook(seed.aq.book.id)
    await storage.deleteBook(seed.removed.book.id)
    if (clearAll) await storage.deleteBook(seed.english.book.id)
    await storage.saveSettings({ ...seed.settings, currentBookId: clearAll ? null : seed.english.book.id })
    const noParse = { ...seed.catalog, bundledBooks: seed.catalog.bundledBooks.map(book => ({ ...book, createFile() { throw new Error('must not reseed') } })), bundledCatalog: { ...seed.catalog.bundledCatalog, updates: seed.catalog.bundledCatalog.updates.map(update => ({ ...update, createFile() { throw new Error('deleted AQ must not be parsed') } })) } }
    let store = new NovelStore(storage, noParse)
    try {
      await store.ready
      assert.equal(store.getSnapshot().error, null)
      assert.equal((await storage.load()).bundledCatalogVersion, 2)
      const before = await storage.load()
      store.dispose()
      store = new NovelStore(makeStorage(factory), noParse)
      await store.ready
      assert.equal(store.getSnapshot().error, null)
      assert.deepEqual(await store.storage.load(), before)
      assert.equal(store.getSnapshot().books.length, clearAll ? 0 : 1)
    } finally { store.dispose() }
  })
}

test('untagged legacy adopted imports remain user-owned despite exact canonical text and title', async () => {
  const storage = makeStorage()
  const seed = await oldCatalog(storage)
  await storage.deleteBook(seed.aq.book.id)
  const { bundledId: _tag, ...manual } = { ...seed.aq.book, id: 'random-legacy-adopted' }
  await storage.addBook(manual, seed.aq.segments)
  await storage.saveSettings({ ...seed.settings, currentBookId: manual.id })
  const store = new NovelStore(storage, seed.catalog)
  try {
    await store.ready
    assert.equal(store.getSnapshot().error, null)
    assert.deepEqual(store.getSnapshot().books.find(book => book.id === manual.id), manual)
    assert.equal(store.getSettingsSnapshot().currentBookId, manual.id)
    assert.equal(store.getSnapshot().books.some(book => book.id === seed.aq.book.id), false)
  } finally { store.dispose() }
})

for (const mismatch of ['text', 'chapter metadata', 'missing segment']) {
  test(`identified AQ with noncanonical ${mismatch} is not rewritten or reset`, async () => {
    const storage = makeStorage()
    const seed = await oldCatalog(storage)
    const changed = structuredClone(seed.aq.segments)
    if (mismatch === 'text') changed.at(-1).text += ' 用户修改'
    else if (mismatch === 'chapter metadata') changed.at(-1).chapterTitle = '用户章节'
    else changed.pop()
    await storage.deleteBook(seed.aq.book.id)
    await storage.addBook(seed.aq.book, changed)
    const store = new NovelStore(storage, seed.catalog)
    try {
      await store.ready
      assert.equal(store.getSnapshot().error, null)
      assert.deepEqual(store.getSnapshot().books.find(book => book.id === seed.aq.book.id), seed.aq.book)
      assert.deepEqual(await storage.getSegment(seed.aq.book.id, changed.length - 1), changed.at(-1))
      assert.equal((await storage.load()).bundledCatalogVersion, 2)
    } finally { store.dispose() }
  })
}

for (const failure of ['synchronous', 'abort']) {
  test(`catalog ${failure} failure rolls back deletion, AQ metadata, selection and version; refresh retries`, async () => {
    const factory = new IDBFactory()
    const storage = makeStorage(factory)
    const seed = await oldCatalog(storage, { selected: 'bundled:shanhaijing-illustrated' })
    const before = await storage.load()
    const db = storage.database
    const transaction = db.transaction.bind(db)
    db.transaction = (...args) => {
      const tx = transaction(...args)
      if (args[1] === 'readwrite') {
        const settings = tx.objectStore('settings')
        const put = settings.put.bind(settings)
        settings.put = value => {
          if (value.key !== 'bundled-catalog-version') return put(value)
          if (failure === 'synchronous') return put({ ...value, uncloneable() {} })
          const request = put(value)
          request.addEventListener('success', () => tx.abort())
          return request
        }
      }
      return tx
    }
    let store = new NovelStore(storage, seed.catalog)
    try {
      await store.ready
      assert.ok(store.getSnapshot().error)
      db.transaction = transaction
      assert.deepEqual(await storage.load(), before)
      assert.deepEqual(await storage.getSegment(seed.removed.book.id, 0), seed.removed.segments[0])
      assert.deepEqual(await storage.getSegment(seed.aq.book.id, 7), seed.aq.segments[7])
      await assert.rejects(store.setOption('enabled', false), /本地书库不可用/u)
      store.dispose()
      store = new NovelStore(makeStorage(factory), seed.catalog)
      await store.ready
      assert.equal(store.getSnapshot().error, null)
      assert.equal((await store.storage.load()).bundledCatalogVersion, 2)
      assert.equal(store.getSnapshot().books.find(book => book.id === seed.aq.book.id).format, 'md')
      assert.equal(await store.storage.getSegment(seed.removed.book.id, 0), null)
    } finally { store.dispose() }
  })
}

test('concurrent catalog migrations recheck the separate version and preserve winning state', async () => {
  const factory = new IDBFactory()
  const storage = makeStorage(factory)
  const seed = await oldCatalog(storage)
  storage.close()
  const first = new NovelStore(makeStorage(factory), seed.catalog)
  const second = new NovelStore(makeStorage(factory), seed.catalog)
  try {
    await Promise.all([first.ready, second.ready])
    assert.equal(first.getSnapshot().error, null)
    assert.equal(second.getSnapshot().error, null)
    assert.deepEqual(first.getSnapshot(), second.getSnapshot())
    assert.equal((await first.storage.load()).bundledCatalogVersion, 2)
    assert.equal(first.getSnapshot().books.find(book => book.id === seed.aq.book.id).progress, 7)
    assert.equal(first.getSnapshot().books.length, 2)
  } finally { first.dispose(); second.dispose() }
})
