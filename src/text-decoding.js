// 只接受可确定的 Unicode 编码，避免把损坏或传统编码文本静默替换后保存。
export function decodeBookText(input, { xml = false } = {}) {
  const bytes = input instanceof Uint8Array ? input : new Uint8Array(input)
  let encoding = 'utf-8'
  let marked = false
  if (bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) marked = true
  else if (bytes[0] === 0xff && bytes[1] === 0xfe) { encoding = 'utf-16le'; marked = true }
  else if (bytes[0] === 0xfe && bytes[1] === 0xff) { encoding = 'utf-16be'; marked = true }
  else if (xml && bytes[0] === 0x3c && bytes[1] === 0 && bytes[3] === 0) encoding = 'utf-16le'
  else if (xml && bytes[0] === 0 && bytes[1] === 0x3c && bytes[2] === 0) encoding = 'utf-16be'

  let text
  try {
    text = new TextDecoder(encoding, { fatal: true }).decode(bytes)
  } catch {
    throw new Error('文本编码无效：请使用 UTF-8 或带 BOM 的 UTF-16 文件')
  }
  if (text.includes('\u0000')) throw new Error('不支持的文本编码：请转换为 UTF-8 或带 BOM 的 UTF-16')
  if (xml) {
    const declared = /^<\?xml\s[^?]*\bencoding\s*=\s*(['"])([^'"]+)\1/iu.exec(text)?.[2].toLowerCase()
    const allowed = { 'utf-8': 'utf-8', utf8: 'utf-8', 'utf-16': 'utf-16', 'utf-16le': 'utf-16le', 'utf-16be': 'utf-16be' }
    if (declared && !allowed[declared]) throw new Error(`不支持的 XML 编码：${declared}`)
    if (declared && (allowed[declared] === 'utf-16' ? !encoding.startsWith('utf-16') : allowed[declared] !== encoding)) {
      throw new Error(`XML 编码声明与${marked ? ' BOM' : '实际字节'}不符：${declared}`)
    }
  }
  return text
}
