import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { IDBFactory, IDBKeyRange } from 'fake-indexeddb'
import { IndexedDbStorage } from '../src/persistence.js'
import { DEFAULT_SETTINGS, NovelStore } from '../src/store.js'
import { parseTextBook } from '../src/segments.js'
import { PG_NOTICE, hasProjectGutenbergReference } from '../src/pg-notice.js'
import { novelContent } from '../src/novel-content.js'
import { MemoryStorage } from './helpers/memory-storage.js'

const source = await readFile(new URL('../samples/ebooks/million-pound-bank-note-pg61522.txt', import.meta.url), 'utf8')
const pgSegments = parseTextBook(source).segments
const file = (name, text) => ({ name, arrayBuffer: async () => new TextEncoder().encode(text).buffer })

test('notice is exactly the licensed §1.E.1 statement, including ™', async () => {
  const license = await readFile(new URL('../samples/ebooks/LICENSE.md', import.meta.url), 'utf8')
  const statement = license.slice(license.indexOf('    This eBook'), license.indexOf('1.E.2.')).trim().replace(/\s+/gu, ' ')
  assert.equal(PG_NOTICE, statement)
  assert.match(PG_NOTICE, /Project Gutenberg™ License/u)
  assert.equal(hasProjectGutenbergReference('The PROJECT\nGUTENBERG eBook'), true)
  assert.equal(hasProjectGutenbergReference('阿Q正傳'), false)
  assert.equal(hasProjectGutenbergReference('notProject Gutenbergish'), false)
})

test('real bundled PG default is detected without tagging AQ or title-based lookalikes', async () => {
  const storage = new IndexedDbStorage(new IDBFactory(), IDBKeyRange)
  const aq = await readFile(new URL('../samples/ebooks/aq-zheng-zhuan-wikisource.md', import.meta.url), 'utf8')
  const store = new NovelStore(storage, { bundledBooks: [
    { id: 'million-pound-bank-note', title: '百萬英鎊', format: 'txt', createFile: () => file('default.txt', source) },
    { id: 'aq-zheng-zhuan', title: '阿Q正傳', format: 'md', createFile: () => file('aq.md', aq) },
    { id: 'unrelated', title: 'Project Gutenberg', format: 'txt', createFile: () => file('other.txt', 'Unrelated original text.') },
  ] })
  try {
    await store.ready
    assert.equal(store.getSnapshot().error, null)
    assert.equal((await store.claimPassage('pg')).projectGutenberg, true)
    await store.selectBook('bundled:aq-zheng-zhuan')
    assert.equal((await store.claimPassage('aq')).projectGutenberg, false)
    await store.selectBook('bundled:unrelated')
    assert.equal((await store.claimPassage('other')).projectGutenberg, false)
  } finally { store.dispose() }
})

test('adopted legacy PG with arbitrary ID/title resumes using cached segment-zero provenance without migration', async () => {
  const book = { id: 'old-random-import-42', title: 'Renamed by reader', format: 'txt', progress: 8, segmentCount: pgSegments.length, importedAt: 42 }
  const storage = new MemoryStorage({ books: [book], settings: { ...DEFAULT_SETTINGS, currentBookId: book.id }, passages: { [book.id]: pgSegments } })
  const indices = []
  const getSegment = storage.getSegment.bind(storage)
  storage.getSegment = async (id, index) => { indices.push(index); return getSegment(id, index) }
  const store = new NovelStore(storage)
  try {
    await store.ready
    assert.deepEqual(storage.books.get(book.id), book)
    assert.equal(storage.reads, 0, 'hydration does not scan books or consume progress')
    const first = await store.claimPassage('first')
    assert.equal(first.projectGutenberg, true)
    assert.equal(first.index, 8)
    assert.equal(first.passage.text, pgSegments[8].text)
    assert.equal(novelContent(first, true, key => key).projectGutenberg, true)
    const next = await store.continuePassage('first')
    assert.equal(next.projectGutenberg, true)
    assert.deepEqual(indices, [8, 0, 9], 'header is loaded once; subsequent claims reuse provenance')
    assert.deepEqual(storage.books.get(book.id), { ...book, progress: 10 }, 'only normal progress changes, not IDs, ownership or metadata')
    assert.strictEqual(await store.claimPassage('first'), next)
    assert.deepEqual(indices, [8, 0, 9], 'cached remount does not read again')
  } finally { store.dispose() }
})

test('manual import of the identical PG TXT is detected despite arbitrary filename and no bundled identity', async () => {
  const storage = new MemoryStorage()
  const store = new NovelStore(storage)
  try {
    await store.ready
    const imported = await store.importFile(file('reader-chosen-name.txt', source))
    assert.equal(imported.bundledId, undefined)
    const first = await store.claimPassage('import')
    assert.equal(first.projectGutenberg, true)
    assert.equal(first.passage.text, pgSegments[0].text)
    assert.equal(storage.reads, 1, 'first claim reuses its segment-zero read')
    assert.equal((await store.continuePassage('import')).projectGutenberg, true)
    assert.equal(storage.reads, 2)
  } finally { store.dispose() }
})

test('a canceled provenance read never publishes a passage or advances resumed progress', async () => {
  const book = { id: 'legacy', title: 'Renamed', format: 'txt', progress: 2, segmentCount: 4 }
  const storage = new MemoryStorage({ books: [book], settings: { ...DEFAULT_SETTINGS, currentBookId: book.id }, passages: { legacy: pgSegments.slice(0, 4) } })
  let release, entered
  const gate = new Promise(resolve => { release = resolve })
  const started = new Promise(resolve => { entered = resolve })
  const getSegment = storage.getSegment.bind(storage)
  storage.getSegment = async (id, index) => {
    if (index === 0) { entered(); await gate }
    return getSegment(id, index)
  }
  const store = new NovelStore(storage)
  try {
    await store.ready
    const reading = store.claimPassage('pending')
    await started
    const disabling = store.setOption('enabled', false)
    release()
    assert.equal((await reading).kind, 'empty')
    await disabling
    assert.equal(storage.books.get(book.id).progress, 2)
    assert.equal(store.getPassageStatus(book.id, 'pending').kind, 'empty')
  } finally { release(); store.dispose() }
})
