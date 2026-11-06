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

test('paragraph boundaries take priority within the default display-width budget', () => {
  assert.equal(DEFAULT_SEGMENT_LENGTH, 800)
  const segments = segmentChapters([{ title: '正文', text: `${'甲'.repeat(300)}。\n\n${'乙'.repeat(300)}。` }])
  assert.equal(segments.length, 2)
  assert.ok(segments.every(segment => [...segment.text].length < 600))
})

test('empty plain text is rejected instead of importing an unreadable book', () => {
  assert.throws(() => parseTextBook(' \n\n ', 'txt'), /没有可阅读的正文文本/u)
})

// Synthetic narrative fixtures, not quotations or claims about a real edition.
export const englishNarrative = 'When I reached the little office by the river, the clerk had already put away his books. "You must come again tomorrow," he said, looking from my muddy coat to the sealed envelope. I explained that the gentleman was leaving on the morning train, and that a delay of even one night might change everything. '
export const chineseNarrative = '天色已经暗了下来，街上的人却还没有散。他把车停在门口，抹去额上的汗，望了望远处亮着灯的窗口。“再等一会儿吧，”老人说，“也许他马上就回来了。”他没有回答，只把那封信仔细地放回衣袋里。'
export const narrativeCorpora = {
  english: Array.from({ length: 36 }, (_, i) => i % 6 === 0 ? '"Not tonight," he replied.' : englishNarrative.repeat(1 + i % 5).trim()).join('\n\n'),
  chinese: Array.from({ length: 36 }, (_, i) => i % 6 === 0 ? '“还早呢。”' : chineseNarrative.repeat(1 + i % 5)).join('\n\n'),
  dialogue: Array.from({ length: 90 }, (_, i) => i % 2 ? '“你当真要走？”' : '“天亮以前，我就得赶到城门外。”').join('\n\n'),
}
const compact = text => text.replace(/\s/gu, '')
const passages = (text, target) => segmentChapters([{ title: 'Sample', text }], target).map(segment => segment.text)
function displayUnits(text) {
  return Array.from(new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(text), ({ segment }) => {
    if (segment === '\n') return 40
    if (segment === '\t') return 4
    return /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}\p{Extended_Pictographic}\p{Regional_Indicator}\u3000-\u303f\uff01-\uff60\uffe0-\uffe6]/u.test(segment) ? 2 : 1
  }).reduce((sum, value) => sum + value, 0)
}

for (const [language, text] of Object.entries(narrativeCorpora)) {
  test(`${language} narrative balances short dialogue and long paragraphs without losing body text`, () => {
    const result = passages(text)
    assert.ok(result.length > 2, 'a complete chapter must not become one huge passage')
    assert.equal(compact(result.join('')), compact(text))
    assert.ok(result.every(part => displayUnits(part) <= 1000))
    assert.ok(result.every(part => displayUnits(part) >= 400), 'avoid isolated short paragraphs and short tails')
    if (language === 'english') {
      assert.ok(result.length < 45, 'do not require a click for each short English fragment')
      assert.ok(result.every(part => (part.match(/\b[A-Za-z]+\b/gu) ?? []).length >= 60))
    }
    if (language === 'chinese') assert.ok(result.every(part => [...part].length <= 500))
    if (language === 'dialogue') assert.ok(result.every(part => part.split('\n').length <= 22), 'blank lines count toward the visible reading budget')
  })
}

test('targetLength means a soft half-width budget with a 1.25x hard limit, not raw characters', () => {
  const latin = passages('a'.repeat(4000))
  const han = passages('甲'.repeat(2000))
  assert.equal(latin.length, han.length)
  assert.deepEqual(latin.map(part => displayUnits(part)), han.map(part => displayUnits(part)))
  assert.ok(latin.every(part => [...part].length === DEFAULT_SEGMENT_LENGTH))
  for (const target of [1, 2, 7, 31, 600]) {
    assert.ok(passages('abcd'.repeat(1800), target).every(part => displayUnits(part) <= Math.floor(target * 1.25)))
  }
})

test('sentence and quotation boundaries preserve exact intra-paragraph spacing', () => {
  for (const text of [englishNarrative.repeat(14).trim(), chineseNarrative.repeat(30)]) {
    const result = passages(text)
    assert.equal(compact(result.join('')), compact(text))
    assert.ok(result.every(part => text.includes(part)), 'never insert spaces into Chinese prose or rewrite English spacing')
    assert.ok(result.slice(0, -1).every(part => /[.!?。！？][”’"'」』】）)]?$/u.test(part)))
    assert.ok(result.every(part => !/^[”’」』】）)]/u.test(part)), 'closing quotes stay with preceding sentences')
  }
})

test('punctuation-free English splits at complete words unless one token exceeds the hard cap', () => {
  const words = Array.from({ length: 1100 }, (_, i) => `word${i}`)
  const result = passages(words.join(' '), 100)
  assert.deepEqual(result.join(' ').split(/\s+/u), words)
  assert.ok(result.every(part => displayUnits(part) <= 125))
  const hugeWord = 'pneumonoultramicroscopic'.repeat(500)
  assert.equal(passages(hugeWord, 100).join(''), hugeWord)
  // A long but still fitting word cannot be split just to fill the target.
  for (const [prefix, word] of [['a'.repeat(20), 'b'.repeat(980)], ['a'.repeat(300), 'b'.repeat(800)], ['a'.repeat(990), 'b'.repeat(80)]]) {
    assert.deepEqual(passages(`${prefix} ${word}`), [prefix, word])
  }
})

test('commas are a fallback after sentences and do not create unbounded Chinese clauses', () => {
  const clause = '他把信放回衣袋里，又在门前等了一阵，街上渐渐没有了行人，'
  const text = clause.repeat(60)
  const result = passages(text, 200)
  assert.equal(result.join(''), text)
  assert.ok(result.every(part => displayUnits(part) <= 250))
  assert.ok(result.slice(0, -1).every(part => part.endsWith('，')))
})

test('a short final paragraph is balanced with its predecessor, but never with the next chapter', () => {
  const text = `${'甲'.repeat(390)}。\n\n最后一封信。`
  const result = passages(text)
  assert.equal(result.length, 1)
  const split = passages(`${'alpha '.repeat(165)}${'bravo '.repeat(14)}`)
  assert.equal(split.length, 2)
  assert.ok(split.every(part => part.length >= 400))
  const chapters = segmentChapters([{ title: 'Chapter I', text }, { title: 'Chapter II', text: 'Next day.' }])
  assert.deepEqual(chapters.map(part => part.chapterTitle), ['Chapter I', 'Chapter II'])
  assert.deepEqual(chapters.map(part => part.chapterIndex), [0, 1])
  assert.equal(chapters[1].text, 'Next day.')
})

test('TXT Roman numeral headings are chapter boundaries, not prose or merged labels', () => {
  const book = parseTextBook('Chapter I\n\nFirst short passage.\n\nChapter II The visitor\n\nAnother short passage.\n\nChapter in the old house was unfinished.', 'txt')
  assert.deepEqual(book.chapters.map(chapter => chapter.title), ['Chapter I', 'Chapter II The visitor'])
  assert.equal(book.segments.length, 2)
  assert.match(book.segments[1].text, /Chapter in the old house/u)
})

test('grapheme clusters, flags, combining accents and ZWJ families survive every cut', () => {
  const tokens = ['👨‍👩‍👧‍👦', '🇨🇳', 'e\u0301', '👍🏽', '猫']
  const text = tokens.join('').repeat(300)
  const expected = Array.from(new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(text), item => item.segment)
  const result = passages(text, 7)
  assert.equal(result.join(''), text)
  assert.deepEqual(result.flatMap(part => Array.from(new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(part), item => item.segment)), expected)
  assert.ok(result.every(part => displayUnits(part) <= 8))
  assert.equal(passages('👨‍👩‍👧‍👦', 1)[0], '👨‍👩‍👧‍👦', 'one indivisible grapheme wins over a tiny budget')
})

test('fallback without Intl.Segmenter remains Unicode-safe and splits Latin full stops', t => {
  const original = Intl.Segmenter
  Intl.Segmenter = undefined
  t.after(() => { Intl.Segmenter = original })
  const source = `Mr. Green waited.  Then he went home. ${'👨‍👩‍👧‍👦🇨🇳e\u0301👍🏽'.repeat(180)}`
  const result = passages(source, 45)
  assert.equal(compact(result.join('')), compact(source))
  assert.ok(result.every(part => !/^[\p{Mark}\p{Emoji_Modifier}\u200d]/u.test(part) && !part.endsWith('\u200d')))
  const prose = passages('He waited at the door. '.repeat(40).trim(), 80)
  assert.ok(prose.every(part => part.endsWith('.')))
})

test('large punctuation-free chapters and newline-only tails terminate within bounded passages', { timeout: 4000 }, () => {
  for (const source of ['字'.repeat(120000), 'x'.repeat(120000), 'word\n'.repeat(6000), `${'甲'.repeat(900)}\n\n   `]) {
    const result = passages(source)
    assert.equal(compact(result.join('')), compact(source))
    assert.ok(result.every(part => part.length && displayUnits(part) <= 1000))
  }
})

test('invalid targets reject immediately rather than causing an infinite split loop', () => {
  for (const value of [0, -1, 0.5, Infinity, NaN, '600', Number.MAX_SAFE_INTEGER + 1]) {
    assert.throws(() => passages('正文', value), RangeError)
  }
})
