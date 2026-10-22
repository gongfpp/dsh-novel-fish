import test from 'node:test'
import assert from 'node:assert/strict'
import { NovelStore } from '../src/store.js'
import { MemoryStorage } from './helpers/memory-storage.js'

function textFile(name, text) {
  return { name, text: async () => text }
}

test('TXT, Markdown, and pasted text imports produce readable stored passages', async () => {
  const storage = new MemoryStorage()
  const store = new NovelStore(storage)
  await store.ready
  try {
    const txt = await store.importFile(textFile('novel.txt', '第一章 初见\n\nTXT 正文。'))
    const md = await store.importFile(textFile('novel.md', '# Markdown Chapter\n\nMarkdown body.'))
    const paste = await store.importPastedText('Pasted', '## Pasted Chapter\n\nPasted body.')

    assert.equal(txt.format, 'txt')
    assert.equal(md.format, 'md')
    assert.equal(paste.format, 'text')
    assert.equal((await storage.getSegment(txt.id, 0)).text, 'TXT 正文。')
    assert.equal((await storage.getSegment(md.id, 0)).chapterTitle, 'Markdown Chapter')
    assert.equal((await storage.getSegment(paste.id, 0)).text, 'Pasted body.')
    assert.equal(store.getSettingsSnapshot().currentBookId, txt.id)
  } finally {
    store.dispose()
  }
})

test('unsupported file extensions fail clearly', async () => {
  const store = new NovelStore(new MemoryStorage())
  await store.ready
  await assert.rejects(store.importFile(textFile('novel.pdf', 'not supported')), /只支持 EPUB、TXT、MD/u)
  store.dispose()
})
