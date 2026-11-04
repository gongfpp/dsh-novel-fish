import test from 'node:test'
import assert from 'node:assert/strict'
import semver from 'semver'
import { readFile, access } from 'node:fs/promises'

const root = new URL('../', import.meta.url)
const read = path => readFile(new URL(path, root), 'utf8')

test('public package identity matches the Host patch and browser module', async () => {
  const manifest = JSON.parse(await read('package.json'))
  assert.equal(manifest.name, '@gongfpp/dsh-novel-fish')
  assert.equal(manifest.repository.url, 'https://github.com/gongfpp/dsh-novel-fish.git')
  assert.equal(manifest.engines.dsh, '>=0.2.1-rc.2 <=0.2.2-alpha.2')
  assert.ok((await read('cordis.patch.yml')).includes(`name: '${manifest.name}'`))
  assert.ok((await read('src/client.js')).includes(`const MODULE_ID = '${manifest.name}'`))
  assert.ok((await read('lib/client.js')).includes(manifest.name))
  for (const path of ['./index.js', './lib/client.js', './assets/icon.png', './locale/en.json', './locale/zh.json']) {
    await access(new URL(path, root))
  }
})

test('host compatibility includes rc.2–rc.5 and alpha.2 but does not promise unknown releases', async () => {
  const { engines } = JSON.parse(await read('package.json'))
  // DSH preflight evaluates prereleases explicitly, unlike npm's default semver rules.
  for (const version of ['0.2.1-rc.2', '0.2.1-rc.3', '0.2.1-rc.4', '0.2.1-rc.5', '0.2.2-alpha.2']) {
    assert.equal(semver.satisfies(version, engines.dsh, { includePrerelease: true }), true, version)
  }
  for (const version of ['0.2.0', '0.2.1-alpha.5', '0.2.1-rc.1', '0.2.2-alpha.3', '0.2.2', '0.3.0', '1.0.0']) {
    assert.equal(semver.satisfies(version, engines.dsh, { includePrerelease: true }), false, version)
  }
})

test('notices include JSZip prebundled libraries and the zlib copyright', async () => {
  const notices = await read('THIRD-PARTY-NOTICES.txt')
  for (const name of ['pako@1.0.11', 'lie@3.3.0', 'immediate@3.0.6', 'setimmediate@1.0.5', 'crc-32@1.2.2', 'Jean-loup Gailly and Mark Adler']) {
    assert.ok(notices.includes(name), `Missing third-party notice: ${name}`)
  }
})

test('市场索引保留固定提交来源、版本唯一和宿主兼容范围', async () => {
  const manifest = JSON.parse(await read('package.json'))
  const index = JSON.parse(await read('index.json'))
  assert.equal(index.format, 1)
  const entry = index.plugins.find(plugin => plugin.name === manifest.name)
  assert.ok(entry)
  assert.equal(entry.author, manifest.author)
  assert.equal(entry.repository.url + '.git', manifest.repository.url)
  await access(new URL(entry.icon, root))
  assert.ok(entry.versions.length)
  assert.equal(new Set(entry.versions.map(version => version.version)).size, entry.versions.length)
  for (const version of entry.versions) {
    assert.match(version.version, /^\d+\.\d+\.\d+$/u)
    assert.ok(Number.isSafeInteger(version.publishTimestamp) && version.publishTimestamp > 0)
    assert.equal(version.engines.dsh, '0.2.1-rc.2', 'published history must not inherit the candidate compatibility range')
    assert.equal(version.source.type, 'git')
    assert.equal(version.source.url, entry.repository.url)
    assert.match(version.source.commit, /^[a-f0-9]{40}$/u)
  }
})

test('README local links resolve and installation contains no personal absolute path', async () => {
  const readme = await read('README.md')
  assert.doesNotMatch(readme, /\/Users\/|C:\\Users\\/u)
  const index = JSON.parse(await read('index.json'))
  const published = index.plugins.find(plugin => plugin.name === '@gongfpp/dsh-novel-fish').versions[0]
  assert.ok(readme.includes(`github:gongfpp/dsh-novel-fish#v${published.version}`), 'installation uses an actually published version')
  for (const match of readme.matchAll(/\]\(([^)]+)\)/gu)) {
    const path = match[1].replace(/^<|>$/gu, '').split('#')[0]
    if (!path || /^[a-z]+:/iu.test(path)) continue
    await access(new URL(path, root))
  }
})
