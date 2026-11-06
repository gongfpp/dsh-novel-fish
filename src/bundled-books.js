import manifest from '../samples/ebooks/sources.json'
import millionPoundBankNote from '../samples/ebooks/million-pound-bank-note-pg61522.txt'
import aqZhengZhuan from '../samples/ebooks/aq-zheng-zhuan-wikisource.md'
import notices from '../samples/ebooks/LICENSE.md'

// TXT uses the existing base64 loader; Markdown stays text, like legal notices.
// Encode/decode lazily during hydration/import, without File or network access.
const payloads = {
  'million-pound-bank-note': () => Uint8Array.from(atob(millionPoundBankNote), character => character.charCodeAt(0)),
  'aq-zheng-zhuan': () => new TextEncoder().encode(aqZhengZhuan),
}
export const sampleBooks = manifest.books.map(({ id, title, author, format, bytes, source, license }) => ({ id, title, author, format, bytes, source, license }))

export function createSampleFile(id) {
  const book = sampleBooks.find(book => book.id === id)
  if (!book || !Object.hasOwn(payloads, id)) throw new Error('Unknown bundled ebook')
  const bytes = payloads[id]()
  return { name: `${book.title}.${book.format}`, arrayBuffer: async () => bytes.buffer }
}

// Separate from the original seeding marker: upgrades must not restore deleted
// defaults or claim ownership of untagged manual imports, even identical ones.
export const bundledCatalog = {
  version: 2,
  removedIds: ['shanhaijing-illustrated'],
  updates: [{
    id: 'aq-zheng-zhuan', fromFormat: 'txt', format: 'md',
    createFile: () => {
      const prefix = '# 阿Q正傳\n\n'
      if (!aqZhengZhuan.startsWith(prefix)) throw new Error('Invalid bundled Markdown source prefix')
      const bytes = new TextEncoder().encode(aqZhengZhuan.slice(prefix.length))
      return { name: '阿Q正傳.txt', arrayBuffer: async () => bytes.buffer }
    },
  }],
}

// Combined full licenses and attribution are immediately accessible offline.
let licenseHref
export function getSampleLicenseHref() {
  if (!licenseHref) licenseHref = `data:text/plain;charset=utf-8,${encodeURIComponent(notices)}`
  return licenseHref
}
