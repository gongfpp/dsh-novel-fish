import manifest from '../samples/ebooks/sources.json'
import millionPoundBankNote from '../samples/ebooks/million-pound-bank-note.txt'
import aqZhengZhuan from '../samples/ebooks/aq-zheng-zhuan.md'

// TXT uses the existing base64 loader; Markdown stays text.
// Encode/decode lazily during hydration/import, without File or network access.
const payloads = {
  'million-pound-bank-note': () => Uint8Array.from(atob(millionPoundBankNote), character => character.charCodeAt(0)),
  'aq-zheng-zhuan': () => new TextEncoder().encode(aqZhengZhuan),
}

export const sampleBooks = manifest.books.map(({ id, title, author, format, bytes }) => ({ id, title, author, format, bytes }))

export function createSampleFile(id) {
  const book = sampleBooks.find(book => book.id === id)
  if (!book || !Object.hasOwn(payloads, id)) throw new Error('Unknown bundled ebook')
  const bytes = payloads[id]()
  return { name: `${book.title}.${book.format}`, arrayBuffer: async () => bytes.buffer }
}

// 样书内容随版本更新：旧安装里带前置页的正文会被整本替换，进度按比例保留。
// 与 seeding marker 分开，删除过的默认书不会被恢复，手工导入也不会被认领。
export const bundledCatalog = {
  version: 3,
  removedIds: ['shanhaijing-illustrated'],
  refreshes: [
    { id: 'aq-zheng-zhuan', format: 'md', createFile: () => createSampleFile('aq-zheng-zhuan') },
    { id: 'million-pound-bank-note', format: 'txt', createFile: () => createSampleFile('million-pound-bank-note') },
  ],
}
