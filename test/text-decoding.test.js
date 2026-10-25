import test from 'node:test'
import assert from 'node:assert/strict'
import { decodeBookText } from '../src/text-decoding.js'

function utf16(text, bigEndian = false, bom = true) {
  const bytes = new Uint8Array(text.length * 2 + (bom ? 2 : 0))
  const view = new DataView(bytes.buffer)
  if (bom) view.setUint16(0, 0xfeff, !bigEndian)
  for (let i = 0; i < text.length; i++) view.setUint16((bom ? 2 : 0) + i * 2, text.charCodeAt(i), !bigEndian)
  return bytes
}

test('strict UTF-8 accepts buffers, offset views and BOM without leaking the marker', () => {
  const text = '中文小说😀\n第二段'
  assert.equal(decodeBookText(new TextEncoder().encode(text).buffer), text)
  const bytes = new TextEncoder().encode(`x\ufeff${text}x`)
  assert.equal(decodeBookText(bytes.subarray(1, -1)), text)
})

test('UTF-16 LE and BE BOM are decoded without replacement characters', () => {
  for (const bigEndian of [false, true]) assert.equal(decodeBookText(utf16('中文😀', bigEndian)), '中文😀')
})

test('malformed UTF-8, truncated UTF-16 and GBK are rejected explicitly', () => {
  for (const bytes of [Uint8Array.of(0xef, 0xbb, 0xbf, 0xff), Uint8Array.of(0xc3),
    Uint8Array.of(0xd6, 0xd0, 0xce, 0xc4), Uint8Array.of(0xff, 0xfe, 0x61), Uint8Array.of(0xfe, 0xff, 0xd8, 0)]) {
    assert.throws(() => decodeBookText(bytes), /编码/u)
  }
})

test('XML supports UTF-16 byte signatures with and without BOM and matching declarations', () => {
  for (const bigEndian of [false, true]) {
    for (const bom of [false, true]) {
      for (const declaration of ['UTF-16', bigEndian ? 'UTF-16BE' : 'UTF-16LE']) {
        const xml = `<?xml version="1.0" encoding="${declaration}"?><root>中文😀</root>`
        assert.equal(decodeBookText(utf16(xml, bigEndian, bom), { xml: true }), xml)
      }
      assert.equal(decodeBookText(utf16('<root>中文</root>', bigEndian, bom), { xml: true }), '<root>中文</root>')
    }
  }
})

test('XML rejects unknown declarations and declarations contradictory to actual bytes', () => {
  for (const encoding of ['GBK', 'windows-1252', 'UTF-16', 'UTF-16BE']) {
    assert.throws(() => decodeBookText(new TextEncoder().encode(`<?xml version="1.0" encoding="${encoding}"?><r/>`), { xml: true }), /编码/u)
  }
  assert.throws(() => decodeBookText(utf16('<?xml version="1.0" encoding="UTF-8"?><r/>'), { xml: true }), /编码/u)
  assert.throws(() => decodeBookText(utf16('中文', false, false)), /编码/u)
})
