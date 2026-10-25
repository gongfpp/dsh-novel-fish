import JSZip from 'jszip'
import CRC32 from 'crc-32'
import { decodeBookText } from './text-decoding.js'
import { DOMParser } from '@xmldom/xmldom'
import containerModule from 'epubjs/lib/container.js'
import packagingModule from 'epubjs/lib/packaging.js'
import navigationModule from 'epubjs/lib/navigation.js'
import { segmentChapters } from './segments.js'

// Use epubjs's actual container/OPF/navigation parsers, not its rendering lifecycle.
const Container = containerModule.default ?? containerModule
const Packaging = packagingModule.default ?? packagingModule
const Navigation = navigationModule.default ?? navigationModule
const ORIGIN = 'https://local-epub.invalid/'
const MAX_UNPACKED_BYTES = 128 * 1024 * 1024

/** Parse an EPUB's declared linear spine once; no iframe, script, CSS, or network is used. */
export async function parseEpub(file, targetLength = 600) {
  try {
    // 不启用全包 CRC 检查：它会在读取正文前解压所有未引用资源。
    const zip = await JSZip.loadAsync(await file.arrayBuffer())
    const budget = { remaining: MAX_UNPACKED_BYTES }
    const readXml = async path => {
      const entry = zip.file(path)
      if (!entry) throw new Error(`书内文件缺失：${path}`)
      const bytes = await readEntry(entry, budget)
      const source = decodeBookText(bytes, { xml: true })
      if (/<!ENTITY|<!DOCTYPE[^>]*\[/iu.test(source)) throw new Error(`不支持含外部实体声明的书内文件：${path}`)
      return new DOMParser({
        onError(level, message) { if (level !== 'warning') throw new Error(`${path}: ${message}`) },
      }).parseFromString(source, 'application/xml')
    }
    const container = new Container(await readXml('META-INF/container.xml'))
    const packagePath = archivePath(container.packagePath)
    const packaging = new Packaging(await readXml(packagePath))
    const navPath = packaging.navPath || packaging.ncxPath
    const navigation = navPath ? new Navigation(await readXml(archivePath(navPath, packagePath))) : null
    const labels = tocLabels(navigation?.toc ?? [], packagePath)
    const chapters = []
    for (const item of packaging.spine) {
      if (item.linear === 'no') continue
      const manifest = packaging.manifest[item.idref]
      if (!manifest) throw new Error(`阅读顺序引用了缺失章节：${item.idref}`)
      if (!['application/xhtml+xml', 'text/html'].includes(manifest.type)) {
        throw new Error(`不支持的章节格式：${manifest.type}`)
      }
      const path = archivePath(manifest.href, packagePath)
      const document = await readXml(path)
      const body = document.getElementsByTagNameNS('http://www.w3.org/1999/xhtml', 'body')[0]
        || document.getElementsByTagNameNS(null, 'body')[0]
      if (!body) throw new Error(`章节没有正文：${path}`)
      const sectionTitle = labels.get(path) || manifest.href.replace(/\.[^.]+$/u, '')
      let current = { title: sectionTitle, paragraphs: [] }
      const flush = () => {
        const text = current.paragraphs.join('\n\n').trim()
        if (text) chapters.push({ title: current.title, text })
        current = { title: sectionTitle, paragraphs: [] }
      }
      for (const block of extractBlocks(body)) {
        if (block.kind === 'heading') {
          flush()
          current = { title: block.text, paragraphs: [] }
        } else current.paragraphs.push(block.text)
      }
      flush()
    }
    const segments = segmentChapters(chapters, targetLength)
    if (!segments.length) throw new Error('EPUB 没有可读取的线性正文')
    return { chapters, segments, title: packaging.metadata.title || '' }
  } catch (error) {
    throw new Error(`EPUB 无法解析：${error instanceof Error ? error.message : String(error)}`)
  }
}

// 使用 JSZip 的分块流而非 async() 的全量累积，预算在保存每个块之前扣除。
function readEntry(entry, budget) {
  return new Promise((resolve, reject) => {
    const stream = entry.internalStream('uint8array')
    let chunks = []
    let length = 0
    let checksum = 0
    let settled = false
    const fail = error => {
      if (settled) return
      settled = true
      // pause 会停止后续压缩输入；当前 inflate 输入仍可能产出少量块，回调不再保留它们。
      stream.pause()
      chunks = []
      reject(error)
    }
    stream.on('data', chunk => {
      if (settled) return
      if (chunk.byteLength > budget.remaining) {
        fail(new Error('EPUB 解压正文超过 128 MiB，请使用较小书籍'))
        return
      }
      budget.remaining -= chunk.byteLength
      length += chunk.byteLength
      checksum = CRC32.buf(chunk, checksum)
      chunks.push(chunk)
    }).on('error', fail).on('end', () => {
      if (settled) return
      // JSZip 未公开期望 CRC；此字段来自它解析的中央目录，只用于校验实际读取项。
      if ((checksum >>> 0) !== (entry._data.crc32 >>> 0)) {
        fail(new Error(`书内文件 CRC 校验失败：${entry.name}`))
        return
      }
      const bytes = new Uint8Array(length)
      let offset = 0
      for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength }
      chunks = []
      settled = true
      resolve(bytes)
    }).resume()
  })
}

function archivePath(href, base = '') {
  const url = new URL(href, new URL(base, ORIGIN))
  if (url.origin !== new URL(ORIGIN).origin || url.search) throw new Error('EPUB 只能引用书内文件')
  return decodeURIComponent(url.pathname.slice(1))
}

function hidden(node) {
  const tag = String(node.localName ?? node.nodeName).toLowerCase()
  return ['script', 'style', 'noscript', 'iframe', 'object', 'svg', 'nav'].includes(tag)
    || node.hasAttribute('hidden') || node.getAttribute('aria-hidden') === 'true'
    || /(?:display\s*:\s*none|visibility\s*:\s*hidden)/iu.test(node.getAttribute('style') || '')
}

function extractBlocks(root) {
  const blocks = []
  const blockTags = new Set(['div', 'section', 'article', 'aside', 'main', 'header', 'footer', 'address',
    'p', 'li', 'ul', 'ol', 'blockquote', 'pre', 'figure', 'figcaption', 'dl', 'dt', 'dd',
    'table', 'thead', 'tbody', 'tfoot', 'tr', 'td', 'th', 'hr'])
  let pending = ''
  let kind = 'paragraph'
  const flush = () => {
    const text = pending.replace(/\u00a0/gu, ' ').trim()
    if (text) blocks.push({ kind, text })
    pending = ''
  }
  const walk = node => {
    if (node.nodeType === 3 || node.nodeType === 4) { pending += node.nodeValue || ''; return }
    if (node.nodeType !== 1 || hidden(node)) return
    const tag = String(node.localName ?? node.nodeName).toLowerCase()
    if (tag === 'br') { pending += '\n'; return }
    const heading = /^h[1-6]$/u.test(tag)
    const block = heading || blockTags.has(tag)
    const previousKind = kind
    if (block) { flush(); kind = heading ? 'heading' : 'paragraph' }
    for (const child of Array.from(node.childNodes ?? [])) walk(child)
    if (block) { flush(); kind = previousKind }
  }
  walk(root)
  flush()
  return blocks
}

function tocLabels(items, base, labels = new Map()) {
  for (const item of items) {
    if (item.href && item.label) labels.set(archivePath(item.href, base), String(item.label).trim())
    tocLabels(item.subitems ?? item.items ?? [], base, labels)
  }
  return labels
}
