// Half-width display units, not a character/word count: Latin ≈ 1, CJK/emoji ≈ 2.
// At 13px in a 320–600px text column, 800 units occupy roughly 9–17 lines.
export const DEFAULT_SEGMENT_LENGTH = 800

const TXT_CHAPTER = /^\s*(?:第[0-9０-９零〇一二三四五六七八九十百千万两壹贰叁肆伍陆柒捌玖拾佰仟]{1,24}[章节卷篇回部](?:[\t \u3000]+[^。！？!?，,；;\r\n]{1,80})?|chapter\s+(?:\d+|[ivxlcdm]+)(?:[\t ]+[^.!?\r\n]{1,80})?|(?:序章|楔子|前言|尾声|后记|附录)(?:[\t \u3000]+[^。！？!?，,；;\r\n]{1,80})?)\s*$/iu
const MD_HEADING = /^\s{0,3}(#{1,6})\s+(.+?)\s*#*\s*$/u
const WIDE = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}\p{Extended_Pictographic}\u3000-\u303f\uff01-\uff60\uffe0-\uffe6]/u
const CJK = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u
const CLOSING = /^[”’"'」』】）)\]]+$/u
const PARAGRAPH_BREAK_UNITS = 28

/** Split plain text into chapter groups while retaining paragraph breaks. */
export function textToChapters(text, format = 'txt') {
  const lines = String(text).replace(/^\uFEFF/u, '').replace(/\r\n?/gu, '\n').split('\n')
  const chapters = []
  let title = ''
  let body = []
  let sawHeading = false

  const flush = () => {
    const content = body.join('\n').trim()
    if (content) chapters.push({ title, text: content })
    body = []
  }

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]
    const heading = format === 'md' ? line.match(MD_HEADING) : line.match(TXT_CHAPTER)
    if (!heading && !(format === 'txt' && isCapsHeading(lines, index))) {
      body.push(line)
      continue
    }
    flush()
    title = heading ? (format === 'md' ? heading[2].trim() : line.trim()) : line.trim()
    sawHeading = true
  }
  flush()
  if (!chapters.length && !sawHeading) {
    const content = lines.join('\n').trim()
    if (content) chapters.push({ title: '', text: content })
  }
  return chapters
}

/** 英文 TXT 常用一行全大写做篇名：前后空行、无小写字母、无句末标点。 */
function isCapsHeading(lines, index) {
  const line = lines[index].trim()
  if (line.length < 3 || line.length > 80) return false
  if (CJK.test(line)) return false
  if (/[a-z]/u.test(line) || !/[A-Z]{3}/u.test(line)) return false
  // 信件抬头、引文和收尾标记不是篇名：它们以引号/逗号/破折号结尾，或只有一个词。
  if (/[.,;:!?。！？…，、；：—–-]$/u.test(line)) return false
  if (/^[‘“'"]/u.test(line)) return false
  if (!/\s/u.test(line)) return false
  const before = lines[index - 1]
  const after = lines[index + 1]
  return (before === undefined || before.trim() === '') && (after === undefined || after.trim() === '')
}

/** 硬换行文本里段落内的单个换行只是版面折行，合并成一个空格；中文段落仍按行断开。 */
function unwrapSoftBreaks(text) {
  const lines = String(text).replace(/\r\n?/gu, '\n').split('\n')
  const out = []
  for (const line of lines) {
    const previous = out.at(-1)
    const trimmed = line.trim()
    if (previous && previous.trim() && trimmed
      && !CJK.test(previous.trim().slice(-1)) && !CJK.test(trimmed[0])) {
      out[out.length - 1] = `${previous.trimEnd()} ${trimmed}`
      continue
    }
    out.push(line)
  }
  return out.join('\n')
}

/**
 * Segment new imports only; stored passages/progress are not read or rewritten.
 * targetLength is a positive-integer soft display-width budget (half-width units).
 * Paragraph/sentence boundaries may extend it to floor(targetLength * 1.25).
 * Paragraph breaks cost one unit: soft-wrapped lines are unwrapped before counting. A single
 * indivisible grapheme may exceed the hard budget rather than being corrupted.
 */
export function segmentChapters(chapters, targetLength = DEFAULT_SEGMENT_LENGTH) {
  const target = positiveInteger(targetLength)
  const segments = []
  chapters.forEach((chapter, chapterIndex) => {
    for (const block of chapterBlocks(chapter.text)) {
      for (const text of splitChapter(block, target)) {
        segments.push({ text, chapterTitle: chapter.title, chapterIndex })
      }
    }
  })
  return segments
}

/**
 * 切章按块进行：grapheme 数组只覆盖一块，几 MB 的无章节 TXT 不会在一次性
 * 切分里同时保留全文的字符、宽度、偏移三份数组。块边界优先落在换行处，
 * 因此段落不会被劈开，只有块尾可能多出一段较短的分段。
 */
const MAX_CHAPTER_BLOCK = 256 * 1024
function chapterBlocks(text) {
  const source = String(text)
  if (source.length <= MAX_CHAPTER_BLOCK) return [source]
  const blocks = []
  let start = 0
  while (start < source.length) {
    let end = Math.min(start + MAX_CHAPTER_BLOCK, source.length)
    if (end < source.length) {
      const cut = source.lastIndexOf('\n', end)
      if (cut > start + MAX_CHAPTER_BLOCK / 2) end = cut + 1
      // 硬切时不能把一个代理对劈成两个孤立半区。
      const code = source.charCodeAt(end - 1)
      if (code >= 0xd800 && code <= 0xdbff) end -= 1
    }
    blocks.push(source.slice(start, end))
    start = end
  }
  return blocks
}

/** Normalize a parsed text file into titled reading passages. */
export function parseTextBook(text, format = 'txt', targetLength = DEFAULT_SEGMENT_LENGTH) {
  const chapters = textToChapters(text, format)
  const segments = segmentChapters(chapters, targetLength)
  if (!segments.length) throw new Error('文件里没有可阅读的正文文本')
  return { chapters, segments }
}

function splitChapter(text, target) {
  const source = unwrapSoftBreaks(text).split(/\n\s*\n+/u)
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
  // A paragraph break is a visible gap, not a character: price it at about half a
  // line so dialogue-heavy chapters do not turn one passage into fifty lines.
  if (part === '\n') return PARAGRAPH_BREAK_UNITS
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
