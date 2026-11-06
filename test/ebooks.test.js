import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { NovelStore } from '../src/store.js'
import { MemoryStorage } from './helpers/memory-storage.js'

// Ordinary tests use only committed samples: no dist, temporary downloads or network.
const samples = new URL('../samples/ebooks/', import.meta.url)
const { books } = JSON.parse(await readFile(new URL('sources.json', samples), 'utf8'))
const pinned = {
  'million-pound-bank-note': { file: 'million-pound-bank-note-pg61522.txt', format: 'txt', bytes: 394538, sha256: '4f36f8ce3837afd6c28a23684153a946e39c8970a27486d36f6f4c64b92bb0d2' },
  'aq-zheng-zhuan': { file: 'aq-zheng-zhuan-wikisource.md', format: 'md', bytes: 68170, sha256: '228f5e9504caecc97460e815461df7ac60de80ea311f289f7de23760c69c9643' },
}
const aqChapters = ['第一章 序', '第二章 優勝記略', '第三章 續優勝記略', '第四章 戀愛的悲劇', '第五章 生計問題', '第六章 從中興到末路', '第七章 革命', '第八章 不准革命', '第九章 大團圓']
const otherStories = ['MENTAL TELEGRAPHY', 'A CURE FOR THE BLUES', 'THE ENEMY CONQUERED; OR, LOVE TRIUMPHANT', 'ABOUT ALL KINDS OF SHIPS', 'PLAYING COURIER', 'THE GERMAN CHICAGO', 'A PETITION TO THE QUEEN OF ENGLAND', 'A MAJESTIC LITERARY FOSSIL']
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex')
const compact = text => text.replace(/\s+/gu, '')
const asFile = (name, bytes) => ({ name, arrayBuffer: async () => Uint8Array.from(bytes).buffer })
const byId = id => books.find(book => book.id === id)
const segmentsFor = (storage, book) => Promise.all(Array.from({ length: book.segmentCount }, (_, index) => storage.getSegment(book.id, index)))
const storedBody = async (storage, book) => (await segmentsFor(storage, book)).map(segment => segment.text).join('\n')

function assertReadableBody(id, body) {
  assert.doesNotMatch(body, /\uFFFD/u)
  const text = compact(body)
  if (id === 'million-pound-bank-note') {
    assert.ok(text.includes(compact('When I was twenty-seven years old, I was a mining-broker’s clerk in San Francisco')), 'English narrative, not just PG wrapper')
    assert.ok(text.includes(compact('My Portia’s papa took that friendly and hospitable bill back to the Bank of England and cashed it')), 'title story reaches its ending')
    for (const title of otherStories) assert.ok(text.includes(compact(`_${title}_`)), title)
  } else {
    assert.equal(id, 'aq-zheng-zhuan')
    assert.ok(text.includes('我要給阿Q做正傳，已經不止一兩年了。'))
    assert.ok(text.includes('他們白跟一趟了。'), 'AQ final paragraph survived import')
    assert.ok(text.includes('（一九二一年十二月。）'))
    assert.match(body, /About this digital edition/u)
    assert.match(body, /The following users contributed to this book:/u)
    assert.match(body, /Dbenbenn/u)
  }
}

function seededStorage() {
  return new MemoryStorage({
    books: [{ id: 'existing', title: '已有的书', format: 'txt', progress: 1, segmentCount: 3, importedAt: 1 }],
    settings: { currentBookId: 'existing', mainTitle: '原来的标题' },
    passages: { existing: [{ text: '已经读过。' }, { text: '保留现有阅读位置。' }, { text: '最后一段。' }] },
  })
}

test('confirmed two-book offline corpus pins original English TXT and complete derived AQ Markdown bytes', async () => {
  assert.deepEqual(books.map(book => book.id), Object.keys(pinned))
  let totalBytes = 0
  for (const source of books) {
    for (const [key, value] of Object.entries(pinned[source.id])) assert.equal(source[key], value, `${source.id}.${key}`)
    const bytes = await readFile(new URL(source.file, samples))
    assert.equal(bytes.length, source.bytes, source.file)
    assert.equal(sha256(bytes), source.sha256, source.file)
    assert.equal(source.redistribution.status, 'permitted-with-conditions')
    assert.equal(source.redistribution.packageByDefault, true)
    assert.match(source.redistribution.conditions, /Retain|Keep/u)
    totalBytes += bytes.length
  }
  assert.equal(totalBytes, 462708)
  assert.ok(totalBytes < 600 * 1024, `Bundled corpus grew to ${totalBytes} bytes`)
})

test('manifest and combined notices distinguish collection, complete Markdown derivative and digital licenses', async () => {
  const english = byId('million-pound-bank-note')
  const aq = byId('aq-zheng-zhuan')
  assert.equal(english.source, 'https://www.gutenberg.org/ebooks/61522')
  assert.equal(english.redistribution.authorDeathYear, 1910)
  assert.match(english.edition, /Unmodified original download.*collection/u)
  assert.match(english.edition, /full title story and eight other stories; not a standalone/u)
  assert.match(english.redistribution.conditions, /1\.E\.1.*full-license.*Fee-bearing/u)
  assert.equal(aq.redistribution.authorDeathYear, 1936)
  assert.match(aq.download, /^https:\/\/ws-export\.wmcloud\.org\/\?lang=zh&format=txt&page=/u)
  assert.match(aq.edition, /Local Markdown derivative.*complete nine chapters/u)
  assert.match(aq.redistribution.license, /CC BY-SA 3\.0 Unported or GFDL/u)
  const notices = await readFile(new URL('LICENSE.md', samples), 'utf8')
  for (const source of books) {
    assert.ok(notices.includes(source.source), `${source.id} source attribution`)
    assert.ok(notices.includes(source.redistribution.licenseUrl), `${source.id} license access`)
  }
  assert.match(notices, /NOT covered by the plugin's MIT/u)
  assert.match(notices, /NOT a standalone/u)
  assert.doesNotMatch(notices, /山海經|南山經|shanhaijing/u)
  assert.match(notices, /CC BY-SA 3\.0.*GFDL/su)
  const noticeIndex = await readFile(new URL('NOTICE.md', samples), 'utf8')
  assert.match(noticeIndex, /^# 内置两本样书/mu)
  assert.ok(noticeIndex.includes('462708 bytes'))
  for (const source of books) assert.ok(noticeIndex.includes(source.file))
  for (const [, link] of noticeIndex.matchAll(/\]\(<?([^)>]+)>?\)/gu)) {
    if (!/^https?:/u.test(link)) await readFile(new URL(link, samples))
  }

  const original = (await readFile(new URL(english.file, samples), 'utf8')).replace(/\r\n?/gu, '\n')
  assert.match(original, /Credits: Produced by Richard Tonsing/u)
  const licenseStart = original.indexOf('START: FULL LICENSE')
  assert.ok(licenseStart > 0)
  const fullLicense = original.slice(licenseStart).trim()
  assert.match(fullLicense, /1\.E\.1\./u)
  assert.match(fullLicense, /Section 5\. General Information/u)
  assert.ok(notices.replace(/\r\n?/gu, '\n').includes(fullLicense), 'combined LICENSE retains the entire original PG license verbatim')
})

test('official AQ export has all nine ordered chapters, ending, notices and complete credit tail', async () => {
  const original = await readFile(new URL(byId('aq-zheng-zhuan').file, samples), 'utf8')
  assert.deepEqual([...original.matchAll(/^第[一二三四五六七八九]章[\t \u3000]+.+$/gmu)].map(match => match[0].replace(/\s+/gu, ' ')), aqChapters)
  assertReadableBody('aq-zheng-zhuan', original)
  assert.ok(original.indexOf('他們白跟一趟了。') < original.indexOf('About this digital edition'))
  assert.match(original, /Creative Commons Attribution-ShareAlike 3\.0 Unported.*GNU FDL/u)
  assert.match(original, /https:\/\/www\.creativecommons\.org\/licenses\/by-sa\/3\.0/u)
  assert.match(original, /https:\/\/www\.gnu\.org\/copyleft\/fdl\.html/u)
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
      if (source.id === 'aq-zheng-zhuan') {
        const segments = await segmentsFor(storage, book)
        assert.equal(segments[0].chapterTitle, '阿Q正傳')
        const body = segments.map(segment => segment.text).join('\n')
        for (const title of aqChapters) assert.ok(compact(body).includes(compact(title)), title)
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

test('canonical AQ Markdown retains the entire original official export byte-for-byte after its sole heading', async () => {
  const source = byId('aq-zheng-zhuan')
  const bytes = await readFile(new URL(source.file, samples))
  const prefix = Buffer.from(source.derivation.prefix, 'utf8')
  assert.deepEqual(bytes.subarray(0, prefix.length), prefix)
  const original = bytes.subarray(prefix.length)
  assert.equal(original.length, 68156)
  assert.equal(sha256(original), '15a60f2d6e105c0869c4a11516eaba0d6726e6df68a91c40836dad51c1016b51')
  const text = original.toString('utf8')
  const storage = new MemoryStorage()
  const store = new NovelStore(storage)
  await store.ready
  try {
    const book = await store.importFile(asFile(source.file, bytes))
    assert.equal(book.format, 'md')
    const body = await storedBody(storage, book)
    assertReadableBody(source.id, body)
    for (const title of aqChapters) assert.ok(compact(body).includes(compact(title)), title)
    assert.equal(compact(body), compact(text), 'all original exported text survives the Markdown import')
    assert.equal((await storage.getSegment(book.id, 0)).chapterTitle, '阿Q正傳')
    assert.match(body, /Creative Commons Attribution-ShareAlike 3\.0 Unported.*GNU FDL/u)
  } finally {
    store.dispose()
  }
})
