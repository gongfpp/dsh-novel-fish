// Optional local-only probe. Restricted candidates are never bundled or downloaded here.
// Usage: node scripts/test-candidate-books.mjs
import assert from 'node:assert/strict'
import { readFile, mkdir, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { NovelStore } from '../src/store.js'
import { MemoryStorage } from '../test/helpers/memory-storage.js'
import { DEFAULT_SEGMENT_LENGTH, parseTextBook } from '../src/segments.js'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const input = resolve(root, 'samples/ebooks-next')
const manifest = JSON.parse(await readFile(resolve(input, 'sources.json'), 'utf8'))
const storage = new MemoryStorage()
const store = new NovelStore(storage)
const graphemes = new Intl.Segmenter(undefined, { granularity: 'grapheme' })
function units(text) {
  let total = 0
  for (const { segment } of graphemes.segment(text)) {
    total += segment === '\n' ? 40 : segment === '\t' ? 4
      : /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}\p{Extended_Pictographic}\p{Regional_Indicator}\u3000-\u303f\uff01-\uff60\uffe0-\uffe6]/u.test(segment) ? 2 : 1
  }
  return total
}
function distribution(values) {
  const sorted = [...values].sort((a, b) => a - b)
  const at = p => sorted[Math.floor((sorted.length - 1) * p)]
  return { min: sorted[0], median: at(0.5), p90: at(0.9), max: sorted.at(-1) }
}
const results = []
try {
  await store.ready
  const original = await store.importFile({ name: 'existing.txt', arrayBuffer: async () => new TextEncoder().encode('保留原来的书与阅读进度。'.repeat(100)).buffer })
  await store.claimPassage('existing-before-candidates')
  const originalProgress = storage.books.get(original.id).progress
  const originalSegments = [...storage.passages.entries()]
  for (const source of manifest.books) {
    assert.equal(source.format, 'txt', 'this probe only covers the two acquired TXT candidates')
    const path = resolve(input, source.file)
    assert.ok(path.startsWith(input + '/'), 'manifest must not escape its candidate directory')
    const bytes = await readFile(path)
    assert.equal(bytes.length, source.bytes)
    assert.equal(createHash('sha256').update(bytes).digest('hex'), source.sha256)
    const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes)
    const parsed = parseTextBook(text)
    const normalizedBody = parsed.chapters.map(chapter => chapter.text).join('').replace(/\s/gu, '')
    assert.equal(parsed.segments.map(segment => segment.text).join('').replace(/\s/gu, ''), normalizedBody)
    const book = await store.importFile({ name: source.file, arrayBuffer: async () => Uint8Array.from(bytes).buffer })
    const segments = await Promise.all(Array.from({ length: book.segmentCount }, (_, index) => storage.getSegment(book.id, index)))
    assert.deepEqual(segments.map(segment => segment.text), parsed.segments.map(segment => segment.text))
    const widths = segments.map(segment => units(segment.text))
    assert.ok(widths.every(width => width <= Math.floor(DEFAULT_SEGMENT_LENGTH * 1.25)))
    assert.ok(segments.every(segment => !segment.text.includes('\uFFFD')))
    assert.equal(store.getSettingsSnapshot().currentBookId, original.id)
    assert.equal(storage.books.get(original.id).progress, originalProgress)
    for (const [key, segment] of originalSegments) assert.deepEqual(storage.passages.get(key), segment)
    results.push({ file: source.file, bytes: bytes.length, sha256: source.sha256,
      packaged: false, packageByDefault: source.redistribution?.packageByDefault ?? false, chapters: parsed.chapters.length,
      segments: segments.length, displayUnits: distribution(widths),
      characters: distribution(segments.map(segment => [...segment.text].length)),
      englishWords: distribution(segments.map(segment => (segment.text.match(/\b[A-Za-z]+\b/gu) ?? []).length)),
      below200DisplayUnits: widths.filter(width => width < 200).length,
      preservedBody: true, originalLibraryUnchanged: true })
  }
  const report = { scope: 'local candidate TXT import + MemoryStorage, not GUI, not redistribution clearance',
    softDisplayUnits: DEFAULT_SEGMENT_LENGTH, hardDisplayUnits: Math.floor(DEFAULT_SEGMENT_LENGTH * 1.25), results }
  await mkdir(resolve(root, 'dist/ebooks'), { recursive: true })
  await writeFile(resolve(root, 'dist/ebooks/candidate-results.json'), JSON.stringify(report, null, 2) + '\n')
  console.log(JSON.stringify(report, null, 2))
} finally { store.dispose() }
