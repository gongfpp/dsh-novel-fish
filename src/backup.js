import { DEFAULT_SETTINGS, TARGET_TYPES } from './settings-data.js'

export const MAX_BACKUP_BYTES = 64 * 1024 * 1024
export const BACKUP_FORMAT = 'dsh-novel-fish-backup'

/** Parse everything before opening a write transaction. Never execute backup content. */
export function validateBackup(value) {
  const invalid = () => { throw new Error('备份格式无效或版本不受支持') }
  if (!value || value.format !== BACKUP_FORMAT || value.version !== 1 || !Array.isArray(value.books)
    || !value.settings || typeof value.settings !== 'object' || value.books.length > 2000) invalid()
  const ids = new Set()
  let count = 0
  let textLength = 0
  const books = value.books.map(entry => {
    const book = entry?.book, segments = entry?.segments
    if (!book || typeof book.id !== 'string' || !book.id || book.id.length > 512 || ids.has(book.id)
      || typeof book.title !== 'string' || !book.title.trim() || book.title.length > 4096
      || !['epub', 'txt', 'md'].includes(book.format) || !Array.isArray(segments) || !segments.length
      || book.segmentCount !== segments.length || !Number.isSafeInteger(book.progress)
      || book.progress < 0 || book.progress > segments.length) invalid()
    ids.add(book.id)
    count += segments.length
    if (count > 200000) invalid()
    const cleanSegments = Array.from(segments, segment => {
      if (!segment || typeof segment.text !== 'string' || !segment.text.trim()
        || (segment.chapterTitle !== undefined && typeof segment.chapterTitle !== 'string')
        || (segment.chapterIndex !== undefined && (!Number.isSafeInteger(segment.chapterIndex) || segment.chapterIndex < 0))) invalid()
      textLength += segment.text.length + (segment.chapterTitle?.length ?? 0)
      if (textLength > MAX_BACKUP_BYTES) invalid()
      return { text: segment.text,
        ...(segment.chapterTitle !== undefined ? { chapterTitle: segment.chapterTitle } : {}),
        ...(segment.chapterIndex !== undefined ? { chapterIndex: segment.chapterIndex } : {}),
      }
    })
    return { book: { id: book.id, title: book.title, format: book.format,
      segmentCount: segments.length, progress: book.progress,
      importedAt: Number.isFinite(book.importedAt) ? book.importedAt : Date.now(),
    }, segments: cleanSegments }
  })
  const input = value.settings
  if (typeof input.enabled !== 'boolean' || typeof input.continueOnReopen !== 'boolean'
    || typeof input.mainTitle !== 'string' || input.mainTitle.length > 4096
    || typeof input.extraTitle !== 'string' || input.extraTitle.length > 4096
    || !Array.isArray(input.targetTypes) || input.targetTypes.some(type => !TARGET_TYPES.includes(type))
    || (input.currentBookId !== null && !ids.has(input.currentBookId))) invalid()
  const settings = Object.fromEntries(Object.keys(DEFAULT_SETTINGS).map(key => [key, input[key]]))
  settings.targetTypes = [...new Set(settings.targetTypes)]
  return { format: BACKUP_FORMAT, version: 1, books, settings }
}
