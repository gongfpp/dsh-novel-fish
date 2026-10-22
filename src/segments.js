export const DEFAULT_SEGMENT_LENGTH = 600

const TXT_CHAPTER = /^\s*(?:第[0-9０-９零〇一二三四五六七八九十百千万两壹贰叁肆伍陆柒捌玖拾佰仟]{1,24}[章节卷篇回部](?:[\t \u3000]+[^。！？!?，,；;\r\n]{1,80})?|chapter\s+\d+(?:[\t ]+[^.!?\r\n]{1,80})?|(?:序章|楔子|前言|尾声|后记|附录)(?:[\t \u3000]+[^。！？!?，,；;\r\n]{1,80})?)\s*$/iu
const MD_HEADING = /^\s{0,3}(#{1,6})\s+(.+?)\s*#*\s*$/u

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

/** Segment one or more chapters once, preferring paragraph and sentence boundaries. */
export function segmentChapters(chapters, targetLength = DEFAULT_SEGMENT_LENGTH) {
  const limit = positiveInteger(targetLength)
  const segments = []
  chapters.forEach((chapter, chapterIndex) => {
    for (const text of splitChapter(chapter.text, limit)) {
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

function splitChapter(text, limit) {
  const paragraphs = String(text).split(/\n\s*\n+/u).map(value => value.trim()).filter(Boolean)
  const segments = []
  let current = ''

  const flush = () => {
    if (current) segments.push(current)
    current = ''
  }
  const append = part => {
    if (!part) return
    const next = current ? `${current}\n\n${part}` : part
    if (lengthOf(next) <= limit) {
      current = next
      return
    }
    flush()
    if (lengthOf(part) <= limit) {
      current = part
      return
    }
    for (const sentence of splitSentences(part)) {
      if (lengthOf(sentence) > limit) {
        for (const fragment of splitLongText(sentence, limit)) append(fragment)
      } else {
        const joined = current ? `${current} ${sentence}` : sentence
        if (lengthOf(joined) <= limit) current = joined
        else {
          flush()
          current = sentence
        }
      }
    }
  }

  for (const paragraph of paragraphs) append(paragraph)
  flush()
  return segments
}

function splitSentences(text) {
  if (typeof Intl.Segmenter === 'function') {
    const segmenter = new Intl.Segmenter(undefined, { granularity: 'sentence' })
    const sentences = [...segmenter.segment(text)].map(item => item.segment.trim()).filter(Boolean)
    if (sentences.length > 1) return sentences
  }
  return text.match(/[^。！？!?；;]+[。！？!?；;…]*[”’」』】）)]*|[^。！？!?；;]+$/gu)?.map(value => value.trim()).filter(Boolean) ?? [text]
}

function splitLongText(text, limit) {
  const points = [...text]
  const pieces = []
  for (let start = 0; start < points.length;) {
    let end = Math.min(start + limit, points.length)
    if (end < points.length) {
      const minimum = start + Math.floor(limit * 0.65)
      for (let index = end; index > minimum; index -= 1) {
        if (/\s/u.test(points[index - 1] ?? '')) {
          end = index
          break
        }
      }
    }
    const piece = points.slice(start, end).join('').trim()
    if (piece) pieces.push(piece)
    start = end
  }
  return pieces
}

function lengthOf(text) {
  return [...text].length
}

function positiveInteger(value) {
  if (!Number.isInteger(value) || value < 1) throw new RangeError('分段长度必须是正整数')
  return value
}
