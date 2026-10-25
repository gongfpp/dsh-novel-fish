import test from 'node:test'
import assert from 'node:assert/strict'
import { NovelStore } from '../src/store.js'
import { MemoryStorage } from './helpers/memory-storage.js'

function bytesFile(name, bytes) {
  const buffer = Uint8Array.from(bytes).buffer
  return { name, arrayBuffer: async () => buffer, text: async () => { throw new Error('must decode original bytes') } }
}

function textFile(name, text) {
  return bytesFile(name, new TextEncoder().encode(text))
}

function utf16Bytes(text, bigEndian = false) {
  const bytes = bigEndian ? [0xfe, 0xff] : [0xff, 0xfe]
  for (let index = 0; index < text.length; index += 1) {
    const code = text.charCodeAt(index)
    bytes.push(...(bigEndian ? [code >> 8, code & 0xff] : [code & 0xff, code >> 8]))
  }
  return bytes
}

test('TXT and Markdown file imports produce readable stored passages', async () => {
  const storage = new MemoryStorage()
  const store = new NovelStore(storage)
  await store.ready
  try {
    const txt = await store.importFile(textFile('novel.txt', '第一章 初见\n\nTXT 正文。'))
    const md = await store.importFile(textFile('novel.md', '# Markdown Chapter\n\nMarkdown body.'))
    assert.equal(txt.format, 'txt')
    assert.equal(md.format, 'md')
    assert.equal((await storage.getSegment(txt.id, 0)).text, 'TXT 正文。')
    assert.equal((await storage.getSegment(md.id, 0)).chapterTitle, 'Markdown Chapter')
    assert.equal(store.getSettingsSnapshot().currentBookId, txt.id)
    assert.equal(typeof store.importPastedText, 'undefined', '粘贴能力已删除，而非只隐藏入口')
  } finally {
    store.dispose()
  }
})

for (const extension of ['txt', 'md']) {
  for (const [encoding, encode] of [
    ['UTF-8 BOM', text => [0xef, 0xbb, 0xbf, ...new TextEncoder().encode(text)]],
    ['UTF-16LE BOM', text => utf16Bytes(text)],
    ['UTF-16BE BOM', text => utf16Bytes(text, true)],
  ]) {
    test(`${extension} imports decode ${encoding} from the original bytes`, async () => {
      const storage = new MemoryStorage()
      const store = new NovelStore(storage)
      await store.ready
      try {
        const heading = extension === 'md' ? '# 初见' : '第一章 初见'
        const book = await store.importFile(bytesFile(`novel.${extension}`, encode(`${heading}\n\n正文包含中文和emoji😀。`)))
        const segment = await storage.getSegment(book.id, 0)
        assert.equal(segment.text, '正文包含中文和emoji😀。')
        assert.equal(segment.chapterTitle, extension === 'md' ? '初见' : '第一章 初见')
        assert.equal(segment.text.includes('�'), false)
      } finally {
        store.dispose()
      }
    })
  }
}

for (const extension of ['txt', 'md']) {
  test(`unsupported GBK ${extension} bytes fail clearly without importing or replacing selection`, async () => {
    const storage = new MemoryStorage()
    const store = new NovelStore(storage)
    await store.ready
    try {
      const existing = await store.importFile(textFile('existing.txt', '原来的正文。'))
      const beforeSettings = { ...storage.settings }
      // GBK encoding of 中文, deliberately not valid UTF-8.
      await assert.rejects(store.importFile(bytesFile(`novel.${extension}`, [0xd6, 0xd0, 0xce, 0xc4])), /编码|UTF/u)
      assert.equal(storage.books.size, 1)
      assert.equal(store.getSnapshot().books.length, 1)
      assert.equal(store.getSettingsSnapshot().currentBookId, existing.id)
      assert.deepEqual(storage.settings, beforeSettings)
      assert.equal((await store.claimPassage('original')).passage.text, '原来的正文。')
    } finally {
      store.dispose()
    }
  })
}

test('a malformed UTF-16 import does not create an empty or corrupted book', async () => {
  const storage = new MemoryStorage()
  const store = new NovelStore(storage)
  await store.ready
  await assert.rejects(store.importFile(bytesFile('broken.txt', [0xff, 0xfe, 0x2d])), /编码|UTF/u)
  assert.equal(storage.books.size, 0)
  assert.equal(store.getSettingsSnapshot().currentBookId, null)
  store.dispose()
})

test('unsupported file extensions fail clearly', async () => {
  const store = new NovelStore(new MemoryStorage())
  await store.ready
  await assert.rejects(store.importFile(textFile('novel.pdf', 'not supported')), /只支持 EPUB、TXT、MD/u)
  store.dispose()
})
