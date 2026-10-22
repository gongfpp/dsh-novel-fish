import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile, access } from 'node:fs/promises'

const root = new URL('../', import.meta.url)
const read = path => readFile(new URL(path, root), 'utf8')

test('public package identity matches the Host patch and browser module', async () => {
  const manifest = JSON.parse(await read('package.json'))
  assert.equal(manifest.name, '@gongfpp/dsh-novel-fish')
  assert.equal(manifest.repository.url, 'https://github.com/gongfpp/dsh-novel-fish.git')
  assert.equal(manifest.engines.dsh, '0.2.1-rc.2')
  assert.ok((await read('cordis.patch.yml')).includes(`name: '${manifest.name}'`))
  assert.ok((await read('src/client.js')).includes(`const MODULE_ID = '${manifest.name}'`))
  assert.ok((await read('lib/client.js')).includes(manifest.name))
  for (const path of ['./index.js', './lib/client.js', './assets/icon.svg', './locale/en.json', './locale/zh.json']) {
    await access(new URL(path, root))
  }
})

test('notices include JSZip prebundled libraries and the zlib copyright', async () => {
  const notices = await read('THIRD-PARTY-NOTICES.txt')
  for (const name of ['pako@1.0.11', 'lie@3.3.0', 'immediate@3.0.6', 'setimmediate@1.0.5', 'Jean-loup Gailly and Mark Adler']) {
    assert.ok(notices.includes(name), `Missing third-party notice: ${name}`)
  }
})

test('README local links resolve and installation contains no personal absolute path', async () => {
  const readme = await read('README.md')
  assert.doesNotMatch(readme, /\/Users\/|C:\\Users\\/u)
  assert.match(readme, /github:gongfpp\/dsh-novel-fish#v0\.1\.0/u)
  for (const match of readme.matchAll(/\]\(([^)]+)\)/gu)) {
    const path = match[1].replace(/^<|>$/gu, '').split('#')[0]
    if (!path || /^[a-z]+:/iu.test(path)) continue
    await access(new URL(path, root))
  }
})
