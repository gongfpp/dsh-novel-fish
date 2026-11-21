import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { NovelStore } from '../src/store.js'
import { parseTextBook } from '../src/segments.js'
import { MemoryStorage } from './helpers/memory-storage.js'

// Ordinary tests use only committed samples: no dist, temporary downloads or network.
const samples = new URL('../samples/ebooks/', import.meta.url)
const { books } = JSON.parse(await readFile(new URL('sources.json', samples), 'utf8'))
const pinned = {
  'aq-zheng-zhuan': { file: 'aq-zheng-zhuan.md', format: 'md', bytes: 64260, sha256: '6090fec44644c048e15eabaae2fa4778b8094bc05f1f5e844bc5922f75cc2d1d' },
  'million-pound-bank-note': { file: 'million-pound-bank-note.txt', format: 'txt', bytes: 366099, sha256: 'e352064206a32892324e07e64ee908c39e4b8f35c0c31cf1231d912196bff386' },
}
const aqChapters = ['第一章　序', '第二章　優勝記略', '第三章　續優勝記略', '第四章　戀愛的悲劇', '第五章　生計問題', '第六章　從中興到末路', '第七章　革命', '第八章　不准革命', '第九章　大團圓']
const otherStories = ['THE £1,000,000 BANK-NOTE', 'A MANUSCRIPT WITH A HISTORY', 'A CURE FOR THE BLUES', 'THE ENEMY CONQUERED; OR, LOVE TRIUMPHANT', 'THE MODERN STEAMER AND THE OBSOLETE STEAMER', 'NOAH’S ARK', 'COLUMBUS’S CRAFT', 'A VANISHED SENTIMENT', 'PLAYING COURIER', 'THE GERMAN CHICAGO', 'A PETITION TO THE QUEEN OF ENGLAND', 'A MAJESTIC LITERARY FOSSIL']
const bannedBoilerplate = /Project Gutenberg|This eBook|wikisource|维基文库|公有領域|Creative Commons|GNU FDL|TRANSCRIBER|About this digital edition|Produced by/iu
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex')
const compact = text => text.replace(/\s+/gu, '')
const asFile = (name, bytes) => ({ name, arrayBuffer: async () => Uint8Array.from(bytes).buffer })
const byId = id => books.find(book => book.id === id)
const segmentsFor = (storage, book) => Promise.all(Array.from({ length: book.segmentCount }, (_, index) => storage.getSegment(book.id, index)))
const storedBody = async (storage, book) => (await segmentsFor(storage, book)).map(segment => segment.text).join('\n')

function assertReadableBody(id, body) {
  assert.doesNotMatch(body, /\uFFFD/u)
  assert.doesNotMatch(body, bannedBoilerplate)
  const text = compact(body)
  if (id === 'million-pound-bank-note') {
    assert.ok(text.includes(compact('When I was twenty-seven years old, I was a mining-broker’s clerk in San Francisco')), 'the collection opens with the title story')
    assert.ok(text.includes(compact('My Portia’s papa took that friendly and hospitable bill back to the Bank of England and cashed it')), 'title story reaches its ending')
  } else {
    assert.equal(id, 'aq-zheng-zhuan')
    assert.ok(text.includes('我要給阿Q做正傳，已經不止一兩年了。'))
    assert.ok(text.includes('他們白跟一趟了。'), 'AQ final paragraph survived import')
  }
}

function seededStorage() {
  return new MemoryStorage({
    books: [{ id: 'existing', title: '已有的书', format: 'txt', progress: 1, segmentCount: 3, importedAt: 1 }],
    settings: { currentBookId: 'existing', mainTitle: '原来的标题' },
    passages: { existing: [{ text: '已经读过。' }, { text: '保留现有阅读位置。' }, { text: '最后一段。' }] },
  })
}

test('bundled corpus pins the cleaned sample bytes and stays small', async () => {
  assert.deepEqual(books.map(book => book.id), Object.keys(pinned))
  let totalBytes = 0
  for (const source of books) {
    assert.deepEqual(Object.keys(source).sort(), ['author', 'bytes', 'file', 'format', 'id', 'sha256', 'title'])
    for (const [key, value] of Object.entries(pinned[source.id])) assert.equal(source[key], value, `${source.id}.${key}`)
    const bytes = await readFile(new URL(source.file, samples))
    assert.equal(bytes.length, source.bytes, source.file)
    assert.equal(sha256(bytes), source.sha256, source.file)
    totalBytes += bytes.length
  }
  assert.equal(totalBytes, 430359)
  assert.ok(totalBytes < 600 * 1024, `Bundled corpus grew to ${totalBytes} bytes`)
})

test('bundled samples open on the story text and carry no licensing or navigation boilerplate', async () => {
  const english = await readFile(new URL(byId('million-pound-bank-note').file, samples), 'utf8')
  assert.equal(english.split('\n')[0].trim(), 'THE £1,000,000 BANK-NOTE')
  assert.doesNotMatch(english, bannedBoilerplate)
  assert.doesNotMatch(english, /PRINTED BY|\*\*\* END OF|\*\*\* START OF/u)

  const chinese = await readFile(new URL(byId('aq-zheng-zhuan').file, samples), 'utf8')
  assert.equal(chinese.split('\n')[0].trim(), '# 阿Q正傳')
  assert.match(chinese, /^## 第一章　序$/mu)
  assert.doesNotMatch(chinese, bannedBoilerplate)
  assert.doesNotMatch(chinese, /姊妹计划|维基百科|編輯|编辑/u)
})

test('parsed samples expose real chapter labels instead of one anonymous chapter', async () => {
  const english = parseTextBook(await readFile(new URL(byId('million-pound-bank-note').file, samples), 'utf8'), 'txt', 800)
  assert.ok(english.chapters.length >= 10, `English chapters: ${english.chapters.length}`)
  for (const title of otherStories) assert.ok(english.chapters.some(chapter => compact(chapter.title) === compact(title)), title)
  assert.ok(english.segments.length > 300 && english.segments.length < 700, `English segments: ${english.segments.length}`)

  const chinese = parseTextBook(await readFile(new URL(byId('aq-zheng-zhuan').file, samples), 'utf8'), 'md', 800)
  assert.deepEqual(chinese.chapters.map(chapter => chapter.title), aqChapters)
  assert.ok(chinese.segments.length > 30 && chinese.segments.length < 120, `Chinese segments: ${chinese.segments.length}`)
})

for (const source of books) {
  test(`real ${source.format.toUpperCase()} ${source.title}: body, selection safety, deduplicated reads and persisted progress`, async () => {
    const storage = seededStorage()
    const original = await storage.load()
    const originalPassages = structuredClone([...storage.passages.entries()])
    const store = new NovelStore(storage)
    await store.ready
    let restored
    try {
      const book = await store.importFile(asFile(source.file, await readFile(new URL(source.file, samples))))
      assert.equal(book.format, source.format)
      assert.ok(book.segmentCount > 1)
      assert.equal(book.progress, 0)
      assertReadableBody(source.id, await storedBody(storage, book))
      const segments = await segmentsFor(storage, book)
      if (source.id === 'aq-zheng-zhuan') {
        assert.deepEqual([...new Set(segments.map(segment => segment.chapterTitle))], aqChapters)
      } else {
        assert.equal(segments[0].chapterTitle, 'THE £1,000,000 BANK-NOTE')
      }
      assert.equal(store.getSettingsSnapshot().currentBookId, 'existing')
      assert.equal(store.getSettingsSnapshot().mainTitle, '原来的标题')
      assert.deepEqual(storage.books.get('existing'), original.books[0])
      for (const [key, passage] of originalPassages) assert.deepEqual(storage.passages.get(key), passage)

      await store.selectBook(book.id)
      const [first, duplicate] = await Promise.all([store.claimPassage(`real-${source.id}`), store.claimPassage(`real-${source.id}`)])
      assert.equal(first.kind, 'ready')
      assert.equal(first.index, 0)
      assert.ok(first.passage.text.trim())
      assert.deepEqual(duplicate, first)
      assert.deepEqual(await store.claimPassage(`real-${source.id}`), first, 'reopening must not consume another passage')
      assert.equal(storage.books.get(book.id).progress, 1)
      store.dispose()

      restored = new NovelStore(storage)
      await restored.ready
      assert.equal(restored.getSettingsSnapshot().currentBookId, book.id)
      assert.equal(restored.getSnapshot().books.find(item => item.id === book.id).progress, 1)
      const next = await restored.claimPassage(`restored-${source.id}`)
      assert.equal(next.kind, 'ready')
      assert.equal(next.index, 1)
      assert.equal(storage.books.get(book.id).progress, 2)
      assert.deepEqual(storage.books.get('existing'), original.books[0])
      for (const [key, passage] of originalPassages) assert.deepEqual(storage.passages.get(key), passage)
    } finally {
      store.dispose()
      restored?.dispose()
    }
  })
}
