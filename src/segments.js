// Half-width display units, not a character/word count: Latin ≈ 1, CJK/emoji ≈ 2.
// At 13px in a 320–600px text column, 800 units occupy roughly 9–17 lines.
export const DEFAULT_SEGMENT_LENGTH = 800

const TXT_CHAPTER = /^\s*(?:第[0-9０-９零〇一二三四五六七八九十百千万两壹贰叁肆伍陆柒捌玖拾佰仟]{1,24}[章节卷篇回部](?:[\t \u3000]+[^。！？!?，,；;\r\n]{1,80})?|chapter\s+(?:\d+|[ivxlcdm]+)(?:[\t ]+[^.!?\r\n]{1,80})?|(?:序章|楔子|前言|尾声|后记|附录)(?:[\t \u3000]+[^。！？!?，,；;\r\n]{1,80})?)\s*$/iu
const MD_HEADING = /^\s{0,3}(#{1,6})\s+(.+?)\s*#*\s*$/u
const WIDE = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}\p{Extended_Pictographic}\u3000-\u303f\uff01-\uff60\uffe0-\uffe6]/u
const CLOSING = /^[”’"'」』】）)\]]+$/u

/** Split plain text into chapter groups while retaining paragraph breaks. */
export function textToChapters(text, format = 'txt') {
  const lines = String(text).replace(/^\uFEFF/u, '').replace(/\r\n?/gu, '\n').split('\n')
  const chapters = []
  let title = '正文'
  let body = []
  let sawHeading = false

  const flush = () => {
    const content = body.join('\n').trim()
    if (content) chapters.push({ title, text: content })
    body = []
  }

  for (const line of lines) {
    const heading = format === 'md' ? line.match(MD_HEADING) : line.match(TXT_CHAPTER)
    if (!heading) {
      body.push(line)
      continue
    }
    flush()
    title = format === 'md' ? heading[2].trim() : line.trim()
    sawHeading = true
  }
  flush()
  if (!chapters.length && !sawHeading) {
    const content = lines.join('\n').trim()
    if (content) chapters.push({ title: '正文', text: content })
  }
  return chapters
}

/**
 * Segment new imports only; stored passages/progress are not read or rewritten.
 * targetLength is a positive-integer soft display-width budget (half-width units).
 * Paragraph/sentence boundaries may extend it to floor(targetLength * 1.25).
 * Newlines cost 40 units (a conservative wrap/blank-line allowance). A single
 * indivisible grapheme may exceed the hard budget rather than being corrupted.
 */
export function segmentChapters(chapters, targetLength = DEFAULT_SEGMENT_LENGTH) {
  const target = positiveInteger(targetLength)
  const segments = []
  chapters.forEach((chapter, chapterIndex) => {
    for (const text of splitChapter(chapter.text, target)) {
      segments.push({ text, chapterTitle: chapter.title, chapterIndex })
    }
  })
  return segments
}

/** Normalize a parsed text file into titled reading passages. */
export function parseTextBook(text, format = 'txt', targetLength = DEFAULT_SEGMENT_LENGTH) {
  const chapters = textToChapters(text, format)
  const segments = segmentChapters(chapters, targetLength)
  if (!segments.length) throw new Error('文件里没有可阅读的正文文本')
  return { chapters, segments }
}

function splitChapter(text, target) {
  const source = String(text).replace(/\r\n?/gu, '\n').split(/\n\s*\n+/u)
    .map(value => value.trim()).filter(Boolean).join('\n\n')
  if (!source) return []
  const parts = graphemes(source)
  const widths = [0]
  const offsets = [0]
  for (const part of parts) {
    widths.push(widths.at(-1) + displayWidth(part))
    offsets.push(offsets.at(-1) + part.length)
  }
  const sentenceEnds = new Set()
  if (typeof Intl.Segmenter === 'function') {
    for (const item of new Intl.Segmenter(undefined, { granularity: 'sentence' }).segment(source)) {
      sentenceEnds.add(item.index + item.segment.length)
    }
  }
  const hard = Math.max(1, Math.floor(target * 1.25))
  // A word that fits in one passage stays intact even if that requires a short
  // predecessor. Only genuinely overlong tokens are eligible for forced cuts.
  const insideWord = new Set()
  for (let index = 0; index < parts.length;) {
    if (/^\s+$/u.test(parts[index]) || WIDE.test(parts[index])) { index += 1; continue }
    const begin = index
    while (index < parts.length && !/^\s+$/u.test(parts[index]) && !WIDE.test(parts[index])) index += 1
    if (widths[index] - widths[begin] <= hard) {
      for (let end = begin + 1; end < index; end += 1) insideWord.add(end)
    }
  }
  const segments = []
  let start = 0
  while (start < parts.length) {
    // Boundary whitespace has no meaning outside a passage, and must not create
    // an empty fragment (even for targetLength=1 or punctuation-free input).
    while (start < parts.length && /^\s+$/u.test(parts[start])) start += 1
    if (start === parts.length) break
    const remaining = widths.at(-1) - widths[start]
    if (remaining <= hard) {
      segments.push(source.slice(offsets[start]).trim())
      break
    }
    // Plan balanced passages rather than greedily producing a 20-character tail.
    const count = Math.max(2, Math.round(remaining / target), Math.ceil(remaining / hard))
    const ideal = remaining / count
    const minimum = Math.min(target * 0.55, ideal * 0.7)
    let best = start + 1
    let bestScore = Infinity
    for (let end = start + 1; end <= parts.length; end += 1) {
      const width = widths[end] - widths[start]
      if (width > hard && end > start + 1) break
      if (insideWord.has(end)) continue
      // Discourage short tails, but preserve a fitting word even when no fully
      // balanced cut exists. Chapters and indivisible tokens are never merged.
      const tail = widths.at(-1) - widths[end]
      const priority = boundaryPriority(parts, end, sentenceEnds.has(offsets[end]))
      const shortPenalty = (width < minimum ? target : 0) + (tail < minimum ? target : 0)
      const score = Math.abs(width - ideal) + priority * target + shortPenalty
      if (score < bestScore) {
        bestScore = score
        best = end
      }
    }
    const passage = source.slice(offsets[start], offsets[best]).trim()
    if (passage) segments.push(passage)
    start = best
  }
  return segments
}

function boundaryPriority(parts, end, sentenceEnd) {
  const previous = parts[end - 1]
  const next = parts[end] ?? ''
  if (previous === '\n' && parts[end - 2] === '\n') return 0
  if (previous === '\n') return 0.08
  // Neither leave an opening quote behind nor strand a closing quote/punctuation.
  if (/^[“‘「『【（(\[]+$/u.test(previous)
    || (/^["']$/u.test(previous) && /^\s$/u.test(parts[end - 2] ?? ''))
    || CLOSING.test(next) || /^[。！？!?，,；;：:]/u.test(next)) return 2
  if (sentenceEnd) return 0.10
  let index = end - 1
  while (index >= 0 && (/^\s+$/u.test(parts[index]) || CLOSING.test(parts[index]))) index -= 1
  if (/[。！？!?…]$/u.test(parts[index] ?? '')
    || (typeof Intl.Segmenter !== 'function' && /\.$/u.test(parts[index] ?? ''))) return 0.10
  if (/[，,；;：:]$/u.test(parts[index] ?? '')) return 0.22
  if (/^\s+$/u.test(previous) || /^\s+$/u.test(next)) return 0.30
  // A Latin word may exceed the budget; only then fall back to a grapheme cut.
  return WIDE.test(previous) || WIDE.test(next) ? 0.48 : 2
}

function displayWidth(part) {
  if (part === '\n') return 40
  if (part === '\t') return 4
  return WIDE.test(part) || /\p{Regional_Indicator}/u.test(part) ? 2 : 1
}

function graphemes(text) {
  if (typeof Intl.Segmenter === 'function') {
    return Array.from(new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(text), item => item.segment)
  }
  // Conservative fallback for older hosts: keep marks, variation selectors,
  // emoji modifiers, ZWJ sequences and regional-indicator flag pairs together.
  const parts = []
  let regionalCount = 0
  for (const point of text) {
    const regional = /\p{Regional_Indicator}/u.test(point)
    if (parts.length && (/^[\p{Mark}\p{Emoji_Modifier}\u200d\ufe0e\ufe0f]$/u.test(point)
      || parts.at(-1).endsWith('\u200d') || (regional && regionalCount % 2 === 1))) {
      parts[parts.length - 1] += point
    } else parts.push(point)
    regionalCount = regional ? regionalCount + 1 : 0
  }
  return parts
}

function positiveInteger(value) {
  if (!Number.isSafeInteger(value) || value < 1) throw new RangeError('分段长度必须是正整数')
  return value
}
