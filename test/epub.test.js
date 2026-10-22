import test from 'node:test'
import assert from 'node:assert/strict'
import JSZip from 'jszip'
import { parseEpub } from '../src/epub.js'

async function epubFile({ malformed = false, missingNav = false, missingChapter = false, injected = false } = {}) {
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
  const bytes = await zip.generateAsync({ type: 'uint8array', compression: 'STORE' })
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
