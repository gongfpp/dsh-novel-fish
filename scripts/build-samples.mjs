// 从 dev/sample-sources 的原始导出生成随包样书：只留正文与章节标题。
// 版权页、许可声明、导出模板、贡献者名单、目录页码一律不进包。
// 原始文件不提交（dev/ 不打包、不入库），生成结果提交到 samples/ebooks/。
import { readFile, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const rawDir = path.join(root, 'dev', 'sample-sources')
const outDir = path.join(root, 'samples', 'ebooks')

const normalize = text => text
  .replace(/^\uFEFF/u, '')
  .replace(/\r\n?/gu, '\n')
  .split('\n')
  .map(line => line.replace(/[ \t]+$/u, ''))
  .join('\n')
  .replace(/\n{3,}/gu, '\n\n')
  .replace(/^\n+/u, '')
  .replace(/\n+$/u, '') + '\n'

function englishEdition(source) {
  const lines = normalize(source).split('\n')
  const start = lines.findIndex(line => /^\*\*\* START OF /u.test(line))
  const end = lines.findIndex(line => /^\*\*\* END OF /u.test(line))
  if (start < 0 || end < 0 || end <= start) throw new Error('English source: markers not found')
  let body = lines.slice(start + 1, end)

  // 书名页 + 目录：正文从第一篇故事标题开始。
  const firstStory = body.findIndex(line => /^_THE £1,000,000 BANK-NOTE_$/u.test(line.trim()))
  if (firstStory < 0) throw new Error('English source: first story heading not found')
  body = body.slice(firstStory)

  // 书末校勘记与分隔线。
  const notes = body.findIndex(line => /^TRANSCRIBER’S NOTES$/u.test(line.trim()))
  if (notes >= 0) {
    let cut = notes
    while (cut > 0 && (/^-{3,}$/u.test(body[cut - 1].trim()) || body[cut - 1].trim() === '')) cut -= 1
    body = body.slice(0, cut)
  }

  // 书末印刷所落款不属于正文。
  const imprint = body.findIndex(line => /^\s*PRINTED BY\s*$/u.test(line))
  if (imprint >= 0) body = body.slice(0, imprint)

  // 斜体包裹的故事标题去掉下划线，作为可识别的章节标题。
  body = body.map(line => {
    const match = /^_([^_].*[^_])_$/u.exec(line.trim())
    return match ? match[1] : line
  })
  return normalize(body.join('\n'))
}

function chineseEdition(source) {
  const lines = normalize(source).split('\n')
  const first = lines.findIndex(line => /^第[一二三四五六七八九十百]+章/u.test(line.trim()))
  if (first < 0) throw new Error('Chinese source: chapter heading not found')
  const stop = lines.findIndex((line, index) => index > first
    && (/公有領域|公有领域|著作权|著作權|About this digital edition|^\* \* \*$|^↑/u.test(line.trim())))
  const body = lines.slice(first, stop < 0 ? lines.length : stop)
  const titled = body.map(line => (/^第[一二三四五六七八九十百]+章/u.test(line.trim())
    ? `## ${line.trim()}`
    : line))
  return normalize(['# 阿Q正傳', '', ...titled].join('\n'))
}

const targets = [
  { raw: 'million-pound-bank-note.raw.txt', out: 'million-pound-bank-note.txt', build: englishEdition },
  { raw: 'aq-zheng-zhuan.raw.md', out: 'aq-zheng-zhuan.md', build: chineseEdition },
]

for (const target of targets) {
  const text = target.build(await readFile(path.join(rawDir, target.raw), 'utf8'))
  const file = path.join(outDir, target.out)
  await writeFile(file, text)
  const bytes = Buffer.byteLength(text)
  const sha256 = createHash('sha256').update(text).digest('hex')
  console.log(`${target.out}\t${bytes}\t${sha256}`)
}
