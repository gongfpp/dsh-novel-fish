import JSZip from 'jszip'
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
    const zip = await JSZip.loadAsync(await file.arrayBuffer(), { checkCRC32: true })
    let readBytes = 0
    const readXml = async path => {
      const entry = zip.file(path)
      if (!entry) throw new Error(`书内文件缺失：${path}`)
      const bytes = await entry.async('uint8array')
      readBytes += bytes.byteLength
      if (readBytes > MAX_UNPACKED_BYTES) throw new Error('EPUB 解压正文超过 128 MiB，请使用较小书籍')
      const source = new TextDecoder().decode(bytes)
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
      const body = document.getElementsByTagName('body')[0]
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

function visibleText(node) {
  if (node.nodeType === 3 || node.nodeType === 4) return node.nodeValue || ''
  if (node.nodeType !== 1 || hidden(node)) return ''
  if (node.localName === 'br') return '\n'
  return Array.from(node.childNodes ?? []).map(visibleText).join('')
}

function extractBlocks(root) {
  const blocks = []
  const walk = node => {
    for (const child of Array.from(node.childNodes ?? [])) {
      if (child.nodeType === 3 || child.nodeType === 4) {
        const text = (child.nodeValue || '').trim()
        if (text) blocks.push({ kind: 'paragraph', text })
      } else if (child.nodeType === 1 && !hidden(child)) {
        const tag = String(child.localName ?? child.nodeName).toLowerCase()
        if (/^h[1-6]$/u.test(tag) || ['p', 'li', 'blockquote', 'pre', 'figcaption', 'dt', 'dd'].includes(tag)) {
          const text = visibleText(child).replace(/\u00a0/gu, ' ').trim()
          if (text) blocks.push({ kind: /^h[1-6]$/u.test(tag) ? 'heading' : 'paragraph', text })
        } else walk(child)
      }
    }
  }
  walk(root)
  return blocks
}

function tocLabels(items, base, labels = new Map()) {
  for (const item of items) {
    if (item.href && item.label) labels.set(archivePath(item.href, base), String(item.label).trim())
    tocLabels(item.subitems ?? item.items ?? [], base, labels)
  }
  return labels
}
