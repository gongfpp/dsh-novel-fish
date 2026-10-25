import test from 'node:test'
import assert from 'node:assert/strict'
import JSZip from 'jszip'
import { parseEpub } from '../src/epub.js'

async function epubFile({ malformed = false, missingNav = false, missingChapter = false, injected = false, edit, compression = 'STORE' } = {}) {
  const zip = new JSZip()
  if (malformed) {
    zip.file('not-an-epub.txt', 'no package document')
  } else {
    zip.file('mimetype', 'application/epub+zip', { compression: 'STORE' })
    zip.file('META-INF/container.xml', `<?xml version="1.0"?>
      <container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
        <rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles>
      </container>`)
    zip.file('OEBPS/content.opf', `<?xml version="1.0"?>
      <package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="book-id">
        <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
          <dc:identifier id="book-id">sample-id</dc:identifier>
          <dc:title>Sample Novel</dc:title><dc:language>en</dc:language>
        </metadata>
        <manifest>
          <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
          <item id="one" href="chapter-one.xhtml" media-type="application/xhtml+xml"/>
          <item id="two" href="chapter-two.xhtml" media-type="application/xhtml+xml"/>
          <item id="appendix" href="appendix.xhtml" media-type="application/xhtml+xml"/>
        </manifest>
        <spine>
          <itemref idref="one"/><itemref idref="two"/><itemref idref="appendix" linear="no"/>
        </spine>
      </package>`)
    zip.file('OEBPS/nav.xhtml', `<?xml version="1.0"?>
      <html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
        <head></head><body><nav epub:type="toc"><ol>
          <li><a href="chapter-two.xhtml">TOC Two</a></li>
          <li><a href="chapter-one.xhtml">TOC One</a></li>
        </ol></nav></body></html>`)
    zip.file('OEBPS/chapter-one.xhtml', `<?xml version="1.0"?>
      <html xmlns="http://www.w3.org/1999/xhtml"><head></head><body><section>
        <h1>Chapter One</h1><p>First passage.</p><p>Second paragraph.</p>
      </section></body></html>`)
    zip.file('OEBPS/chapter-two.xhtml', `<?xml version="1.0"?>
      <html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>
        <h2>Chapter Two</h2><p>Third passage.</p>
      </body></html>`)
    zip.file('OEBPS/appendix.xhtml', `<?xml version="1.0"?>
      <html xmlns="http://www.w3.org/1999/xhtml"><head></head><body><h1>Appendix</h1><p>Must be excluded.</p></body></html>`)
  }
  if (missingNav) zip.remove('OEBPS/nav.xhtml')
  if (missingChapter) zip.remove('OEBPS/chapter-two.xhtml')
  if (injected) zip.file('OEBPS/chapter-one.xhtml', '<html xmlns="http://www.w3.org/1999/xhtml"><head/><body><h1>Chapter One</h1><script>evil()</script><style>.evil{}</style><p hidden="hidden">hidden text</p><p>Visible<script>nested()</script> words.</p><div aria-hidden="true">invisible</div></body></html>')
  if (edit) await edit(zip)
  const bytes = await zip.generateAsync({ type: 'uint8array', compression })
  const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)
  return { name: 'sample.epub', arrayBuffer: async () => buffer }
}

test('EPUB content follows linear spine order, extracts chapter text, and ignores non-linear content', async () => {
  const parsed = await parseEpub(await epubFile(), 600)
  assert.equal(parsed.title, 'Sample Novel')
  assert.deepEqual(parsed.chapters.map(chapter => chapter.title), ['Chapter One', 'Chapter Two'])
  assert.deepEqual(parsed.segments.map(segment => segment.text), ['First passage.\n\nSecond paragraph.', 'Third passage.'])
  assert.equal(parsed.segments.some(segment => segment.text.includes('Must be excluded.')), false)
})

test('malformed EPUB fails with an explicit parsing error', async () => {
  await assert.rejects(parseEpub(await epubFile({ malformed: true })), /EPUB 无法解析/u)
})

test('missing declared navigation and chapters reject instead of hanging', { timeout: 2000 }, async () => {
  await assert.rejects(parseEpub(await epubFile({ missingNav: true })), /文件缺失.*nav.xhtml/u)
  await assert.rejects(parseEpub(await epubFile({ missingChapter: true })), /文件缺失.*chapter-two.xhtml/u)
})

test('script, style, and hidden descendants never become book text', async () => {
  const result = await parseEpub(await epubFile({ injected: true }))
  assert.equal(result.segments[0].text, 'Visible words.')
  assert.doesNotMatch(result.segments.map(x => x.text).join(''), /evil|nested|hidden|invisible/u)
})

function utf16(text, bigEndian = false, bom = true) {
  const bytes = new Uint8Array(text.length * 2 + (bom ? 2 : 0))
  const view = new DataView(bytes.buffer)
  if (bom) view.setUint16(0, 0xfeff, !bigEndian)
  for (let i = 0; i < text.length; i++) view.setUint16(i * 2 + (bom ? 2 : 0), text.charCodeAt(i), !bigEndian)
  return bytes
}

test('namespace-prefixed XHTML keeps nested paragraphs separate and inline text continuous', async () => {
  const file = await epubFile({ edit(zip) {
    zip.file('OEBPS/chapter-one.xhtml', `<x:html xmlns:x="http://www.w3.org/1999/xhtml"><x:head/><x:body>
      <x:h1>命名空间标题</x:h1><x:blockquote><x:p>第一段</x:p><x:p>第二段</x:p></x:blockquote>
      <x:div>段首<x:span>连续<x:em>内联</x:em></x:span>段末<x:br/>换行</x:div>
      <x:div>分块一</x:div><x:div>分块二</x:div>
    </x:body></x:html>`)
  } })
  const result = await parseEpub(file)
  assert.equal(result.chapters[0].title, '命名空间标题')
  assert.equal(result.chapters[0].text, '第一段\n\n第二段\n\n段首连续内联段末\n换行\n\n分块一\n\n分块二')
})

test('无 xmlns 的 XHTML 和 text/html 章节保持可读取', async () => {
  for (const type of ['application/xhtml+xml', 'text/html']) {
    const file = await epubFile({ async edit(zip) {
      const opf = await zip.file('OEBPS/content.opf').async('string')
      zip.file('OEBPS/content.opf', opf.replace('href="chapter-one.xhtml" media-type="application/xhtml+xml"', `href="chapter-one.xhtml" media-type="${type}"`))
      zip.file('OEBPS/chapter-one.xhtml', '<html><head/><body><h1>无命名空间</h1><p>仍可读取。</p></body></html>')
    } })
    const result = await parseEpub(file)
    assert.equal(result.chapters[0].title, '无命名空间')
    assert.equal(result.chapters[0].text, '仍可读取。')
  }
})

test('UTF-16 container, package, navigation and XHTML are decoded before parsing', async () => {
  for (const bigEndian of [false, true]) {
    for (const bom of [false, true]) {
      const file = await epubFile({ async edit(zip) {
        for (const name of ['META-INF/container.xml', 'OEBPS/content.opf', 'OEBPS/nav.xhtml', 'OEBPS/chapter-one.xhtml', 'OEBPS/chapter-two.xhtml']) {
          const xml = (await zip.file(name).async('string')).replace('<?xml version="1.0"?>', '<?xml version="1.0" encoding="UTF-16"?>')
          zip.file(name, utf16(xml, bigEndian, bom))
        }
      } })
      assert.equal((await parseEpub(file)).chapters[0].text, 'First passage.\n\nSecond paragraph.')
    }
  }
})

test('invalid UTF-8 and unsupported XML declarations reject instead of corrupting text', async () => {
  for (const bytes of [Uint8Array.of(0xff), new TextEncoder().encode('<?xml version="1.0" encoding="GBK"?><html/>')]) {
    await assert.rejects(parseEpub(await epubFile({ edit(zip) { zip.file('OEBPS/chapter-one.xhtml', bytes) } })), /编码/u)
  }
})

function corruptCrc(buffer, name) {
  const bytes = new Uint8Array(buffer.slice(0))
  const view = new DataView(bytes.buffer)
  for (let i = 0; i + 46 <= bytes.length; i++) {
    if (view.getUint32(i, true) !== 0x02014b50) continue
    const length = view.getUint16(i + 28, true)
    if (new TextDecoder().decode(bytes.subarray(i + 46, i + 46 + length)) === name) {
      view.setUint32(i + 16, view.getUint32(i + 16, true) ^ 1, true)
      return bytes.buffer
    }
  }
  throw new Error(`未找到 ZIP 中央目录项：${name}`)
}

test('CRC is verified for used entries but unused resources are not decompressed', async () => {
  const file = await epubFile({ edit(zip) { zip.file('unused.bin', 'unused resource') } })
  const bytes = await file.arrayBuffer()
  assert.equal((await parseEpub({ arrayBuffer: async () => corruptCrc(bytes, 'unused.bin') })).title, 'Sample Novel')
  await assert.rejects(parseEpub({ arrayBuffer: async () => corruptCrc(bytes, 'OEBPS/chapter-one.xhtml') }), /CRC.*chapter-one.xhtml/u)
})

test('large unused content is skipped and actual streamed output is capped despite forged size metadata', { timeout: 30000 }, async t => {
  const file = await epubFile({ compression: 'DEFLATE', edit(zip) {
    zip.file('unused-large.bin', new Uint8Array(129 * 1024 * 1024).fill(0x61))
  } })
  assert.ok((await file.arrayBuffer()).byteLength < 1024 * 1024)
  assert.equal((await parseEpub(file)).title, 'Sample Novel')

  const loadAsync = JSZip.loadAsync.bind(JSZip)
  let paused = false
  let emittedAtPause = 0
  t.mock.method(JSZip, 'loadAsync', async (...args) => {
    const zip = await loadAsync(...args)
    const chapter = zip.file('OEBPS/chapter-one.xhtml')
    chapter._data = zip.file('unused-large.bin')._data
    chapter._data.uncompressedSize = 1
    const internalStream = chapter.internalStream.bind(chapter)
    chapter.internalStream = (...streamArgs) => {
      const stream = internalStream(...streamArgs)
      let emitted = 0
      stream.on('data', chunk => { emitted += chunk.byteLength })
      const pause = stream.pause.bind(stream)
      stream.pause = () => { paused = true; emittedAtPause = emitted; return pause() }
      return stream
    }
    return zip
  })
  await assert.rejects(parseEpub(file), /解压正文超过 128 MiB/u)
  assert.equal(paused, true)
  assert.ok(emittedAtPause <= 128 * 1024 * 1024 + 16 * 1024)
})
