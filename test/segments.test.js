import test from 'node:test'
import assert from 'node:assert/strict'
import { DEFAULT_SEGMENT_LENGTH, parseTextBook, segmentChapters } from '../src/segments.js'

test('Markdown headings become chapter labels and paragraph breaks survive import', () => {
  const result = parseTextBook('# 序章\n\n第一段。\n\n第二段。\n\n## 章节二\n\n正文。', 'md', 600)
  assert.deepEqual(result.chapters.map(chapter => chapter.title), ['序章', '章节二'])
  assert.equal(result.chapters[0].text, '第一段。\n\n第二段。')
  assert.equal(result.segments[0].chapterTitle, '序章')
  assert.equal(result.segments[0].text, '第一段。\n\n第二段。')
})

test('TXT chapter headings are kept as chapter labels', () => {
  const result = parseTextBook('第一章 初见\n\n内容甲。\n\n第二章 重逢\n\n内容乙。', 'txt', 600)
  assert.deepEqual(result.chapters.map(chapter => chapter.title), ['第一章 初见', '第二章 重逢'])
  assert.deepEqual(result.segments.map(segment => segment.text), ['内容甲。', '内容乙。'])
})

test('TXT narrative starting with an ordinal stays in the readable body', () => {
  const prose = '第二天，他回到家里，看见一封信。'
  const result = parseTextBook(`第一章 初见\n\n${prose}\n\n他读完信后，缓缓坐下。`, 'txt', 600)
  assert.deepEqual(result.chapters.map(chapter => chapter.title), ['第一章 初见'])
  assert.equal(result.segments[0].text, `${prose}\n\n他读完信后，缓缓坐下。`)
  assert.equal(parseTextBook(prose, 'txt').segments[0].text, prose)
})

test('TXT headings require a chapter number immediately followed by a chapter unit', () => {
  const result = parseTextBook('第十二回 故人重来\n\n内容甲。\n\nChapter 13 The Letter\n\n内容乙。', 'txt')
  assert.deepEqual(result.chapters.map(chapter => chapter.title), ['第十二回 故人重来', 'Chapter 13 The Letter'])
})

test('long text is split around target length without breaking Unicode code points', () => {
  const source = '猫🐈'.repeat(401)
  const segments = segmentChapters([{ title: '正文', text: source }], 600)
  assert.ok(segments.every(segment => [...segment.text].length <= 600))
  assert.equal(segments.map(segment => segment.text).join(''), source)
})

test('paragraph boundaries take priority and the default target is about 600 characters', () => {
  assert.equal(DEFAULT_SEGMENT_LENGTH, 600)
  const segments = segmentChapters([{ title: '正文', text: `${'甲'.repeat(300)}。\n\n${'乙'.repeat(300)}。` }])
  assert.equal(segments.length, 2)
  assert.ok(segments.every(segment => [...segment.text].length < 600))
})

test('empty plain text is rejected instead of importing an unreadable book', () => {
  assert.throws(() => parseTextBook(' \n\n ', 'txt'), /没有可阅读的正文文本/u)
})
