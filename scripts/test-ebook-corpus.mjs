import assert from 'node:assert/strict'
import { readFile, writeFile, copyFile, mkdir } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import JSZip from 'jszip'
import { NovelStore } from '../src/store.js'
import { MemoryStorage } from '../test/helpers/memory-storage.js'

// Explicit local-only extended probe; ordinary tests never read these downloads.
// Use existing dist/ebooks Alice files, or --copy-from <download-directory>.
// Generates one clearly labelled test-only EPUB from the complete AQ export;
// this is NOT a downloaded original EPUB or a new bundled book.
// This script does not download anything or add support for negative formats.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const output = resolve(root, 'dist/ebooks')
const args = process.argv.slice(2)
if (args.length && (args.length !== 2 || args[0] !== '--copy-from')) {
  throw new Error('Usage: node scripts/test-ebook-corpus.mjs [--copy-from <download-directory>]')
}
const { books } = JSON.parse(await readFile(resolve(root, 'samples/ebooks/sources.json'), 'utf8'))
assert.deepEqual(books.map(book => book.id), ['million-pound-bank-note', 'aq-zheng-zhuan'])
const additional = [
  { file: 'alice.html', format: 'html', source: 'https://www.gutenberg.org/ebooks/11', download: 'https://www.gutenberg.org/ebooks/11.html.images' },
  { file: 'alice.azw3', format: 'azw3', source: 'https://www.gutenberg.org/ebooks/11', download: 'https://www.gutenberg.org/ebooks/11.kf8.images' },
  { file: 'alice.mobi', format: 'mobi', source: 'https://www.gutenberg.org/ebooks/11', download: 'https://www.gutenberg.org/ebooks/11.kindle.noimages' },
  { file: 'alice.pdf', format: 'pdf', source: 'https://www.adobe.com/be_en/active-use/pdf/Alice_in_Wonderland.pdf', download: 'https://www.adobe.com/be_en/active-use/pdf/Alice_in_Wonderland.pdf' },
]
const compact = text => text.replace(/\s+/gu, '')
const asFile = (name, bytes) => ({ name, arrayBuffer: async () => Uint8Array.from(bytes).buffer })
const aqChapters = ['第一章 序', '第二章 優勝記略', '第三章 續優勝記略', '第四章 戀愛的悲劇', '第五章 生計問題', '第六章 從中興到末路', '第七章 革命', '第八章 不准革命', '第九章 大團圓']
await mkdir(output, { recursive: true })
for (const source of books) await copyFile(resolve(root, 'samples/ebooks', source.file), resolve(output, source.file))
if (args.length) {
  const input = resolve(args[1])
  for (const source of additional) {
    if (resolve(input, source.file) !== resolve(output, source.file)) await copyFile(resolve(input, source.file), resolve(output, source.file))
  }
}
const aq = books.find(book => book.id === 'aq-zheng-zhuan')
const aqText = await readFile(resolve(output, aq.file), 'utf8')
const prefix = aq.derivation.prefix
assert.ok(aqText.startsWith(prefix))
const originalAqText = aqText.slice(prefix.length)
assert.equal(Buffer.byteLength(originalAqText), aq.derivation.originalBytes)
assert.equal(createHash('sha256').update(originalAqText).digest('hex'), aq.derivation.originalSha256)
// A deterministic EPUB container around the entire recovered export, including
// all credits/license text. No source EPUB is claimed and no obsolete sample is read.
const escapeXml = text => text.replace(/&/gu, '&amp;').replace(/</gu, '&lt;').replace(/>/gu, '&gt;')
const zip = new JSZip()
const add = (path, text) => zip.file(path, text, { date: new Date('2000-01-01T00:00:00Z'), compression: 'STORE', createFolders: false })
add('mimetype', 'application/epub+zip')
add('META-INF/container.xml', '<?xml version="1.0"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>')
add('OEBPS/content.opf', '<?xml version="1.0"?><package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="book-id"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:identifier id="book-id">aq-derived-test-fixture</dc:identifier><dc:title>阿Q正傳 · derived test fixture</dc:title><dc:language>zh</dc:language><meta property="dcterms:modified">2000-01-01T00:00:00Z</meta></metadata><manifest><item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/><item id="text" href="text.xhtml" media-type="application/xhtml+xml"/></manifest><spine><itemref idref="text"/></spine></package>')
add('OEBPS/nav.xhtml', '<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops"><head><title>Test fixture</title></head><body><nav epub:type="toc"><ol><li><a href="text.xhtml">阿Q正傳</a></li></ol></nav></body></html>')
add('OEBPS/text.xhtml', `<html xmlns="http://www.w3.org/1999/xhtml"><head><title>Test fixture</title></head><body><h1>阿Q正傳</h1><pre>${escapeXml(originalAqText)}</pre></body></html>`)
const fixtureFile = 'aq-derived-test-fixture.epub'
const fixtureBytes = await zip.generateAsync({ type: 'nodebuffer', compression: 'STORE' })
const checked = await JSZip.loadAsync(fixtureBytes, { checkCRC32: true })
assert.equal(await checked.file('mimetype').async('string'), 'application/epub+zip')
await writeFile(resolve(output, fixtureFile), fixtureBytes)
const corpus = [
  ...books.map(book => ({ ...book, expectedSegments: book.format === 'txt' ? 820 : 100, expected: 'imported' })),
  { id: aq.id, file: fixtureFile, format: 'epub', title: '阿Q正傳 · derived test fixture', source: aq.source,
    derivedFrom: aq.file, transformation: 'Test-only EPUB container with an XML-escaped complete original TXT export and one title heading; not an original downloaded EPUB; never bundled.', expected: 'imported' },
  ...additional.map(book => ({ ...book, title: "Alice's Adventures in Wonderland", expected: 'rejected' })),
]
const storage = new MemoryStorage()
const store = new NovelStore(storage)
await store.ready
const results = []
try {
  const original = await store.importFile(asFile('existing.txt', new TextEncoder().encode('第一章 原书\n\n保留的原有内容。'.repeat(200))))
  const first = await store.claimPassage('original-before-import')
  assert.equal(first.kind, 'ready')
  const originalBook = structuredClone(storage.books.get(original.id))
  const originalPassages = structuredClone([...storage.passages.entries()])
  let bundledBytes = 0
  for (const source of corpus) {
    const bytes = await readFile(resolve(output, source.file))
    if (source.format === 'pdf') assert.equal(bytes.subarray(0, 5).toString(), '%PDF-')
    if (['mobi', 'azw3'].includes(source.format)) assert.equal(bytes.subarray(60, 68).toString(), 'BOOKMOBI')
    if (source.format === 'html') assert.match(bytes.toString('utf8').slice(0, 200), /<!DOCTYPE html|<html/iu)
    const hash = createHash('sha256').update(bytes).digest('hex')
    if (source.sha256) {
      assert.equal(bytes.length, source.bytes, source.file)
      assert.equal(hash, source.sha256, source.file)
      bundledBytes += bytes.length
    }
    const file = asFile(source.file, bytes)
    const started = performance.now()
    const result = {
      file: source.file, title: source.title, format: source.format, source: source.source,
      ...(source.download ? { download: source.download } : {}),
      ...(source.edition ? { edition: source.edition, license: source.license } : {}),
      ...(source.derivedFrom ? { derivedFrom: source.derivedFrom, transformation: source.transformation } : {}),
      bytes: bytes.length, sha256: hash, expected: source.expected,
    }
    if (source.expected === 'rejected') {
      const before = await storage.load()
      const passages = structuredClone([...storage.passages.entries()])
      await assert.rejects(store.importFile(file), error => {
        assert.match(error.message, /只支持 EPUB、TXT、MD 文件/u)
        result.message = error.message
        return true
      })
      assert.deepEqual(await storage.load(), before)
      assert.deepEqual([...storage.passages.entries()], passages)
      result.actual = 'rejected-with-library-unchanged'
    } else {
      const book = await store.importFile(file)
      assert.equal(book.format, source.format)
      assert.ok(book.segmentCount > 1)
      if (source.expectedSegments) assert.equal(book.segmentCount, source.expectedSegments)
      assert.equal(book.progress, 0)
      const segments = await Promise.all(Array.from({ length: book.segmentCount }, (_, index) => storage.getSegment(book.id, index)))
      const body = segments.map(segment => segment.text).join('\n')
      const text = compact(body)
      assert.doesNotMatch(body, /\uFFFD/u)
      if (source.id === 'million-pound-bank-note') {
        assert.ok(text.includes(compact('When I was twenty-seven years old, I was a mining-broker’s clerk in San Francisco')), 'not merely PG metadata/license')
        assert.ok(text.includes(compact('My Portia’s papa took that friendly and hospitable bill back to the Bank of England and cashed it')))
        assert.match(body, /_A MAJESTIC LITERARY FOSSIL_/u)
        assert.match(body, /START: FULL LICENSE/u)
        assert.match(body, /Section 5\. General Information/u)
        result.actual = 'imported-readable-english-collection'
      } else {
        assert.equal(source.id, 'aq-zheng-zhuan')
        assert.ok(text.includes('我要給阿Q做正傳，已經不止一兩年了。'))
        assert.ok(text.includes('他們白跟一趟了。'))
        assert.ok(text.includes('（一九二一年十二月。）'))
        assert.match(body, /About this digital edition/u)
        assert.match(body, /Creative Commons Attribution-ShareAlike 3\.0 Unported.*GNU FDL/u)
        assert.match(body, /Dbenbenn/u)
        assert.equal(text, compact(originalAqText), 'Markdown and test EPUB retain the complete exported text')
        assert.equal(segments[0].chapterTitle, '阿Q正傳')
        for (const title of aqChapters) assert.ok(text.includes(compact(title)), title)
        result.actual = source.format === 'md' ? 'imported-readable-complete-chinese-markdown-derivative' : 'imported-readable-complete-chinese-derived-test-epub'
      }
      result.segmentCount = book.segmentCount
    }
    assert.equal(store.getSettingsSnapshot().currentBookId, original.id)
    assert.deepEqual(storage.books.get(original.id), originalBook)
    for (const [key, passage] of originalPassages) assert.deepEqual(storage.passages.get(key), passage)
    assert.deepEqual(await store.claimPassage('original-before-import'), first, 'imports do not invalidate or advance the existing passage')
    result.milliseconds = Math.round((performance.now() - started) * 100) / 100
    results.push(result)
  }
  assert.equal(bundledBytes, 462708)
  assert.ok(bundledBytes < 600 * 1024)
  const report = {
    verifiedOn: new Date().toISOString(), scope: 'NovelStore + MemoryStorage; no GUI claims; no network requests',
    output: 'dist/ebooks', bundledBytes, originalSelectionAndProgressUnchanged: true,
    redistribution: 'Bundled samples comprise one unchanged English TXT download and one clearly labelled complete AQ Markdown derivative, under their individual notices, not plugin MIT. The Markdown suffix retains the full original official TXT export and credits byte-for-byte. The generated AQ EPUB is a local test-only derivative preserving the complete export, not an original EPUB download or package asset. The four Alice files are local negative-test downloads, not package assets; the Adobe PDF is not cleared for redistribution.',
    results,
  }
  await writeFile(resolve(output, 'results.json'), `${JSON.stringify(report, null, 2)}\n`)
  console.log(JSON.stringify(report, null, 2))
} finally {
  store.dispose()
}
