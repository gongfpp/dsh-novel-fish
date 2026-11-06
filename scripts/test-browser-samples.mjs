#!/usr/bin/env node
// Isolated Chromium component test, NOT the official DSH GUI or host primitives.
// No server, plugin installation, persistent browser profile, or source client entry.
// Usage: PLAYWRIGHT_MODULE=/path/to/playwright-core REACT_DOM_MODULE=/path/to/react-dom/client.js node scripts/test-browser-samples.mjs
// Optional: CHROME_EXECUTABLE=/path/to/chrome (otherwise uses installed channel chrome).
// CAPTURE_SETTINGS=1 saves an explicitly mocked component preview under dist/ebooks;
// stdout is the JSON report (redirect to dist/ebooks/browser-results.json if desired).
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { mkdtemp, readFile, realpath, rm } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { dirname, isAbsolute, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { build } from 'esbuild'
import { PG_NOTICE } from '../src/pg-notice.js'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const require = createRequire(join(root, 'package.json'))
let playwrightPath
try {
  playwrightPath = require.resolve(process.env.PLAYWRIGHT_MODULE || 'playwright-core')
} catch (cause) {
  throw new Error('No existing Playwright found. Set PLAYWRIGHT_MODULE to an existing playwright-core/index.js; this test never installs dependencies.', { cause })
}
const playwright = await import(pathToFileURL(playwrightPath).href)
const { chromium } = playwright.default ?? playwright
assert.ok(chromium?.launch, 'PLAYWRIGHT_MODULE must export Chromium')
let reactDomClient
try {
  reactDomClient = require.resolve(process.env.REACT_DOM_MODULE || 'react-dom/client')
} catch (cause) {
  throw new Error('No existing ReactDOM found. Set REACT_DOM_MODULE to an existing react-dom/client.js; this test never installs dependencies.', { cause })
}
// Resolve React beside ReactDOM, avoiding mismatched React copies/versions.
const domRequire = createRequire(reactDomClient)
const reactModule = domRequire.resolve('react')
const reactVersion = domRequire('react').version
const bundlePath = join(root, 'lib/client.js')
const bundle = await readFile(bundlePath)
const bundleSha256 = createHash('sha256').update(bundle).digest('hex')
const manifest = JSON.parse(await readFile(join(root, 'samples/ebooks/sources.json'), 'utf8'))
assert.deepEqual(manifest.books.map(({ id, format }) => ({ id, format })), [
  { id: 'million-pound-bank-note', format: 'txt' }, { id: 'aq-zheng-zhuan', format: 'md' },
])
const expectedSegments = { 'million-pound-bank-note': 820, 'aq-zheng-zhuan': 100 }
const expectedLicense = await readFile(join(root, 'samples/ebooks/LICENSE.md'), 'utf8')
assert.ok(expectedLicense.includes('START: FULL LICENSE'))
assert.ok(expectedLicense.includes('CC BY-SA 4.0'))
assert.ok(expectedLicense.includes('阿Q正傳'))
assert.doesNotMatch(expectedLicense, /山海經|南山經|shanhaijing/u)
const temp = await mkdtemp(join(tmpdir(), 'novel-browser-samples-'))
const origin = 'http://novel-samples.test'
const failures = []
const requestLog = []
const reports = []
// Deliberately keep an oversized legacy passage: new imports must not rewrite it.
const legacyPassage = 'Existing segment B\n' + Array.from({ length: 80 }, (_, i) => `旧书第 ${i + 1} 行：完整正文保留，可滚动阅读。`).join('\n')
let browser

// The fixture imports only React/ReactDOM and existing contract doubles. The
// application under test is loaded separately, verbatim from lib/client.js.
const fixtureSource = `
import React from 'react'
import { createRoot } from ${JSON.stringify(reactDomClient)}
import { hostPrimitives } from ${JSON.stringify(join(root, 'test/helpers/host-primitives.js'))}
const h = React.createElement
// The shared Modal double omits host chrome. Supply its close-button contract
// locally so information is opened AND closed with real browser clicks.
const primitives = { ...hostPrimitives, Modal({ open, title, description, children, footer, closeLabel, onClose }) {
  return open ? h('div', { role: 'dialog', 'aria-label': title },
    h('h2', null, title), h('button', { type: 'button', 'aria-label': closeLabel, onClick: onClose }, closeLabel),
    description, children, footer) : null
} }
const registrations = [], injections = [], effects = [], hostImports = []
const dictionaries = new Map()
const translate = namespace => (key, values = {}) => {
  const text = dictionaries.get(namespace)?.zh?.[key] ?? key
  return text.replace(/\\{(\\w+)\\}/g, (_, name) => String(values[name] ?? '{' + name + '}'))
}
function hook(source) {
  return select => select(React.useSyncExternalStore(source.subscribe, source.getSnapshot))
}
window.__ModuleLoader__ = { load(module) {
  try {
    if (module.id !== '@gongfpp/dsh-novel-fish') throw new Error('Unexpected plugin module: ' + module.id)
    const plugin = module.factory(name => {
      hostImports.push(name)
      if (name === 'react') return React
      if (name === '@deepseek-ai/dsh-client-ui-primitives') return primitives
      throw new Error('Unexpected host import: ' + name)
    })
    plugin.apply({
      locale: { register(name, dictionary) { dictionaries.set(name, dictionary); return () => dictionaries.delete(name) }, bind: translate },
      effect(callback, label) { effects.push({ callback, label }) },
      slots: {
        inject(name, callback) { injections.push(name); callback() },
        register(options, Component) { registrations.push({ options, Component }); return () => {} },
      },
    })
    const config = registrations.filter(item => item.options.name === 'plugins.bundle.config')
    if (config.length !== 1 || config[0].options.key !== module.id) throw new Error('Missing unique bundle settings registration')
    const entry = config[0], props = entry.options.inject()
    if (props.sampleBooks?.length !== 2 || typeof props.onImportFile !== 'function') throw new Error('lib/client.js does not expose the unified bundled library and file import contracts')
    if ('onImportSample' in props) throw new Error('Obsolete sample-import action remains in lib/client.js')
    const reasoning = registrations.find(item => item.options.name === 'conversation.chat.reasoning.body')
    if (!reasoning) throw new Error('Missing reasoning body registration')
    const bodyProps = reasoning.options.inject()
    // Run genuine bundle effects, including the trusted-event disclosure adapter.
    for (const effect of effects) effect.cleanup = effect.callback()
    function ReasoningFixture() {
      const [open, setOpen] = React.useState(false)
      return h('div', { 'data-conversation-session': 'isolated-session', style: { width: '100%', maxWidth: 600 } },
        h('div', { 'data-chat-node-key': 'isolated-node', 'data-chat-flow-kind': 'assistant-step' },
          h('div', { 'data-variant': 'think' },
            h('div', { 'data-disclosure-row': true }, h('button', {
              id: 'fixture-disclosure', 'aria-expanded': open, onClick: () => setOpen(value => !value),
            }, 'Isolated reasoning fixture')),
            open ? h(reasoning.Component, {
              ...bodyProps, text: 'Original reasoning fixture text', running: false, sessionId: 'isolated-session',
              t: translate(reasoning.options.locale),
              useNovelSettings: hook(bodyProps.hooks.novelSettings), useNovelPassages: hook(bodyProps.hooks.novelPassages),
              renderFactorySlot: (_name, input) => input.text,
            }) : null)))
    }
    const view = createRoot(document.getElementById('root'))
    view.render(h(React.Fragment, null,
      h(entry.Component, { ...props, t: translate(entry.options.locale), view: 'page',
        useNovelState: hook(props.hooks.novelState), useNovelUi: hook(props.hooks.novelUi) }),
      h(ReasoningFixture)))
    window.__novelTest = {
      moduleId: module.id, state: () => props.hooks.novelState.getSnapshot(),
      samples: props.sampleBooks, hostImports, injections,
    }
    addEventListener('pagehide', () => {
      view.unmount()
      for (const effect of [...effects].reverse()) effect.cleanup?.()
    }, { once: true })
  } catch (error) { window.__fixtureError = error.stack || String(error); console.error(error) }
} }
`
const html = `<!doctype html><html lang="zh"><meta charset="utf-8"><link rel="icon" href="data:,"><title>Isolated sample component test — not DSH GUI</title><body><h1>Isolated component fixture · mocked Host primitives · NOT official DSH GUI</h1><div id="root"></div><script src="/host-fixture.js"></script><script src="/lib/client.js"></script></body></html>`

async function state(page) {
  return page.evaluate(() => window.__novelTest.state())
}
async function hydrated(page) {
  await page.waitForFunction(() => window.__fixtureError || window.__novelTest?.state().hydrated)
  assert.equal(await page.evaluate(() => window.__fixtureError ?? null), null)
  const value = await state(page)
  assert.equal(value.error, null)
  return value
}
async function database(page) {
  return page.evaluate(async () => {
    if (!(indexedDB instanceof IDBFactory)) throw new Error('Not native IndexedDB')
    const db = await new Promise((resolve, reject) => {
      const request = indexedDB.open('dsh-touch-fish-novel', 1)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
    try {
      const tx = db.transaction(['books', 'settings', 'segments'], 'readonly')
      const done = new Promise((resolve, reject) => { tx.oncomplete = resolve; tx.onerror = () => reject(tx.error); tx.onabort = () => reject(tx.error) })
      const getAll = name => new Promise((resolve, reject) => {
        const request = tx.objectStore(name).getAll()
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })
      const [books, settings, segments] = await Promise.all(['books', 'settings', 'segments'].map(getAll))
      await done
      return { books, settings: settings.find(item => item.key === 'settings')?.value,
        bundledBooksInitialized: settings.find(item => item.key === 'bundled-books-v1')?.value === true,
        bundledCatalogVersion: settings.find(item => item.key === 'bundled-catalog-version')?.value,
        settingsRecords: settings, segments }
    } finally { db.close() }
  })
}
async function seedExisting(page, savedSamples = null, oldCatalog = false) {
  await page.evaluate(async ({ legacyPassage, savedSamples, oldCatalog }) => {
    const db = await new Promise((resolve, reject) => {
      const request = indexedDB.open('dsh-touch-fish-novel', 1)
      request.onupgradeneeded = () => {
        const db = request.result
        db.createObjectStore('books', { keyPath: 'id' })
        db.createObjectStore('settings', { keyPath: 'key' })
        db.createObjectStore('segments', { keyPath: 'id' }).createIndex('bookId', 'bookId')
      }
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
    try {
      const tx = db.transaction(['books', 'settings', 'segments'], 'readwrite')
      const done = new Promise((resolve, reject) => { tx.oncomplete = resolve; tx.onerror = () => reject(tx.error); tx.onabort = () => reject(tx.error) })
      tx.objectStore('books').put({ id: 'existing-book', title: 'Existing isolated book', format: 'txt', progress: 1, segmentCount: 2, importedAt: 1 })
      tx.objectStore('settings').put({ key: 'settings', value: { enabled: true, currentBookId: 'existing-book', targetTypes: ['reasoning'], mainTitle: 'Saved title', extraTitle: '', continueOnReopen: false } })
      for (let index = 0; index < 2; index++) tx.objectStore('segments').put({ id: 'existing-book:' + index, bookId: 'existing-book', index, text: index ? legacyPassage : 'Existing segment A' })
      // Simulate either untagged legacy manual imports or explicitly owned v1 defaults.
      if (savedSamples) {
        for (const book of savedSamples.books) tx.objectStore('books').put(book)
        for (const segment of savedSamples.segments) tx.objectStore('segments').put(segment)
        if (oldCatalog) {
          tx.objectStore('settings').put({ key: 'bundled-books-v1', value: true })
          tx.objectStore('settings').put({ key: 'settings', value: { enabled: true, currentBookId: 'bundled:shanhaijing-illustrated', targetTypes: ['reasoning'], mainTitle: 'Saved title', extraTitle: '', continueOnReopen: false } })
        }
      }
      await done
    } finally { db.close() }
  }, { legacyPassage, savedSamples, oldCatalog })
}
async function assertConciseLibrary(page) {
  assert.equal(await page.locator('[data-novel-sample-select], [data-novel-samples]').count(), 0, 'no separate bundled import UI')
  assert.equal(await page.locator('[data-novel-book-info], [data-novel-sample-license]').count(), 0, 'information is unmounted by default')
  assert.equal(await page.getByRole('dialog').count(), 0)
  assert.equal(await page.locator('[data-novel-notice]').count(), 0, 'automatic seeding and selections do not announce imports')
  // Source books retain original notices inside their reading text; only the
  // ordinary settings UI must omit the separate legal/instruction block.
  const text = await page.locator('[data-novel-settings]').innerText()
  for (const phrase of ['Project Gutenberg', 'CC BY-SA', 'This eBook is for the use', '离线完整许可', '书源、作者与许可', '首次主动展开另一个区域才续读', '图标与折叠交互跟随 DSH']) {
    assert.ok(!text.includes(phrase), `ordinary settings must not show ${phrase}`)
  }
}
async function assertUnifiedMenu(page) {
  const value = await state(page)
  const selector = page.locator('[data-novel-book-select]')
  assert.equal(await selector.isEnabled(), true, 'information remains accessible with an empty library')
  await selector.click()
  assert.deepEqual(await page.getByRole('menuitem').allTextContents(), [
    '请选择书籍', ...value.books.map(book => `${book.title} · ${book.format.toUpperCase()}`), '书籍信息',
  ])
  await selector.click()
}
async function assertProgress(page, book) {
  await page.waitForFunction(({ progress, total }) => {
    const bar = document.querySelector('[data-novel-settings] progress')
    return bar?.value === progress && bar.max === total
  }, { progress: book.progress, total: book.segmentCount })
  assert.equal(await page.locator('[data-novel-progress]').innerText(), `已读 ${book.progress} / ${book.segmentCount} 段 · ${Math.floor(book.progress / book.segmentCount * 100)}%`)
}
async function importFileByInput(page, sample, suppliedBytes = null) {
  const before = await state(page)
  const path = join(root, 'samples/ebooks', sample.file)
  const bytes = suppliedBytes ?? await readFile(path)
  assert.equal(bytes.length, sample.bytes)
  assert.equal(createHash('sha256').update(bytes).digest('hex'), sample.sha256)
  // Use the application's genuine file-input change handler, never an exposed
  // import action. A recovered official TXT payload exercises the genuine old AQ parser.
  await page.locator('[data-novel-file-input]').setInputFiles(suppliedBytes ? { name: sample.file, mimeType: 'text/plain', buffer: bytes } : path)
  await page.waitForFunction(count => window.__novelTest.state().books.length === count, before.books.length + 1)
  await page.waitForFunction(() => document.querySelector('[data-novel-notice]')?.textContent.startsWith('导入完成：'))
  const value = await state(page)
  assert.equal(value.books.length, before.books.length + 1)
  const imported = value.books.find(book => !before.books.some(previous => previous.id === book.id))
  assert.ok(imported)
  assert.equal(imported.format, sample.format)
  assert.equal(imported.segmentCount, sample.expectedSegments ?? expectedSegments[sample.id])
  assert.equal(value.settings.currentBookId, before.settings.currentBookId ?? imported.id)
  return imported
}
async function selectByClick(page, book) {
  await page.locator('[data-novel-book-select]').click()
  await page.getByRole('menuitem', { name: `${book.title} · ${book.format.toUpperCase()}`, exact: true }).click()
  await page.waitForFunction(id => window.__novelTest.state().settings.currentBookId === id, book.id)
  await assertProgress(page, (await state(page)).books.find(item => item.id === book.id))
}
async function readByClick(page, book, expectedText) {
  const toggle = page.locator('#fixture-disclosure')
  if (await toggle.getAttribute('aria-expanded') === 'true') await toggle.click()
  await toggle.click() // Playwright dispatches trusted browser input, not evaluate().click().
  await page.waitForFunction(id => window.__novelTest.state().books.find(book => book.id === id)?.progress > 0, book.id)
  await page.waitForFunction(() => document.querySelector('[data-novel-passage]')?.textContent?.length > 0)
  await page.waitForFunction(text => document.querySelector('[data-novel-passage]')?.textContent === text, expectedText)
  assert.equal(await page.locator('[data-novel-original]').innerText(), 'Original reasoning fixture text')
  assert.equal(await page.locator('[data-novel-append] hr').count(), 1)
  const first = (await database(page)).segments.find(segment => segment.bookId === book.id && segment.index === 0)
  const pg = /\bProject\s+Gutenberg\b/iu.test(first?.text ?? '')
  const notice = page.locator('[data-novel-pg-notice]')
  assert.equal(await notice.count(), pg ? 1 : 0, 'only PG text has the required display notice')
  if (pg) {
    assert.equal(await notice.locator('p').textContent(), PG_NOTICE)
    assert.equal(await notice.isVisible(), true)
    assert.equal(await notice.evaluate(element => element.parentElement === document.querySelector('[data-novel-passage]').parentElement), true, 'notice is outside the scroll-clipped passage')
    const link = notice.locator('a[download]')
    const href = await link.getAttribute('href')
    assert.equal(decodeURIComponent(href.slice(href.indexOf(',') + 1)), expectedLicense)
    const waiting = page.waitForEvent('download')
    await link.click()
    const download = await waiting
    assert.equal(download.suggestedFilename(), 'project-gutenberg-full-license.txt')
    const target = join(temp, `pg-${createHash('sha256').update(book.id).digest('hex').slice(0, 12)}.txt`)
    await download.saveAs(target)
    assert.equal(await download.failure(), null)
    assert.equal(await readFile(target, 'utf8'), expectedLicense)
  }
}
async function probeLegacyLayout(page) {
  const measurements = []
  for (const width of [320, 600]) {
    await page.setViewportSize({ width: width + 16, height: 640 })
    const passage = page.locator('[data-novel-passage]')
    assert.equal(await passage.textContent(), legacyPassage)
    const box = await passage.evaluate(element => {
      element.scrollTop = 0
      const rect = element.getBoundingClientRect()
      const toggle = document.querySelector('#fixture-disclosure').getBoundingClientRect()
      const style = getComputedStyle(element)
      return { width: rect.width, height: rect.height, scrollHeight: element.scrollHeight,
        clientHeight: element.clientHeight, overflowY: style.overflowY,
        originalHeight: document.querySelector('[data-novel-original]').getBoundingClientRect().height,
        distanceFromToggle: rect.top - toggle.bottom, fontSize: style.fontSize, lineHeight: style.lineHeight }
    })
    assert.ok(box.height <= 257, '40vh guard bounds the novel, including legacy passages')
    assert.ok(box.scrollHeight > box.clientHeight * 3, 'oversized text remains present, not truncated')
    assert.equal(box.overflowY, 'auto')
    assert.ok(box.distanceFromToggle < 100, 'novel does not add a large gap before its scroll container')
    await passage.focus()
    await passage.press('End')
    await page.waitForFunction(() => document.querySelector('[data-novel-passage]').scrollTop > 0)
    assert.equal(await passage.textContent(), legacyPassage, 'keyboard scrolling preserves the complete text')
    const progress = (await state(page)).books.find(book => book.id === 'existing-book').progress
    await page.locator('#fixture-disclosure').click()
    await passage.waitFor({ state: 'detached' })
    await page.locator('#fixture-disclosure').click()
    await page.waitForFunction(text => document.querySelector('[data-novel-passage]')?.textContent === text, legacyPassage)
    assert.equal((await state(page)).books.find(book => book.id === 'existing-book').progress, progress, 'collapse/reopen is cached')
    measurements.push({ viewportWidth: width + 16, ...box, keyboardScroll: true, cachedReopen: true })
  }
  return measurements
}
async function openBookInfo(page) {
  const before = await state(page)
  await page.locator('[data-novel-book-select]').click()
  await page.getByRole('menuitem', { name: '书籍信息', exact: true }).click()
  const dialog = page.getByRole('dialog', { name: '书籍信息', exact: true })
  await dialog.waitFor({ state: 'visible' })
  assert.equal(await page.locator('[role="menu"]').count(), 0)
  assert.deepEqual(await state(page), before, 'footer opens information without selecting a fake book')
  for (const sample of manifest.books) {
    assert.equal(await dialog.getByRole('link', { name: sample.title, exact: true }).getAttribute('href'), sample.source)
    assert.ok((await dialog.innerText()).includes(sample.author))
    assert.ok((await dialog.innerText()).includes(sample.license))
  }
  assert.equal(await dialog.locator('[data-novel-sample-license]').count(), 1)
  return dialog
}
async function closeBookInfo(page) {
  await page.getByRole('dialog', { name: '书籍信息', exact: true }).getByRole('button', { name: '关闭', exact: true }).click()
  await page.locator('[data-novel-book-info]').waitFor({ state: 'detached' })
  await assertConciseLibrary(page)
}
async function deleteByClick(page, book, { cancelFirst = false } = {}) {
  await selectByClick(page, book)
  const before = await state(page)
  await page.locator('[data-novel-delete]').click()
  const dialog = page.getByRole('dialog', { name: '删除当前书籍', exact: true })
  await dialog.waitFor({ state: 'visible' })
  assert.ok((await dialog.innerText()).includes(`删除《${book.title}》及其本地阅读进度？`))
  assert.deepEqual(await state(page), before, 'opening confirmation must not delete')
  if (cancelFirst) {
    await dialog.getByRole('button', { name: '取消', exact: true }).last().click()
    await dialog.waitFor({ state: 'detached' })
    assert.deepEqual(await state(page), before, 'cancelling preserves the complete library')
    await page.locator('[data-novel-delete]').click()
  }
  await dialog.locator('[data-novel-delete-confirm]').click()
  await page.waitForFunction(id => !window.__novelTest.state().books.some(book => book.id === id), book.id)
  await dialog.waitFor({ state: 'detached' })
  await page.waitForFunction(() => !document.querySelector('[data-novel-passage]'))
  const after = await state(page)
  assert.equal(after.books.length, before.books.length - 1)
  assert.equal(after.settings.currentBookId, after.books[0]?.id ?? null)
  assert.notEqual(after.settings.currentBookId, book.id, 'selection cannot remain on deleted book')
  const stored = await database(page)
  assert.equal(stored.bundledBooksInitialized, true)
  assert.deepEqual(stored.books, after.books)
  assert.equal(stored.settings.currentBookId, after.settings.currentBookId)
  assert.ok(stored.segments.every(segment => segment.bookId !== book.id), 'deletion removes book segments too')
  return stored
}
async function downloadLicense(page, label) {
  const dialog = await openBookInfo(page)
  const anchor = dialog.locator('[data-novel-book-info] a[download]')
  const href = await anchor.getAttribute('href')
  assert.ok(href.startsWith('data:text/plain;charset=utf-8,'))
  assert.equal(decodeURIComponent(href.slice(href.indexOf(',') + 1)), expectedLicense)
  const waiting = page.waitForEvent('download')
  await anchor.click()
  const download = await waiting
  assert.equal(download.suggestedFilename(), 'bundled-ebooks-notices.txt')
  const target = join(temp, `${label}-license.txt`)
  await download.saveAs(target)
  assert.equal(await download.failure(), null)
  const bytes = await readFile(target)
  assert.deepEqual(bytes, Buffer.from(expectedLicense, 'utf8'), 'download is byte-identical to original LICENSE.md')
  const text = bytes.toString('utf8')
  for (const section of ['START: FULL LICENSE', 'Section 1.', 'Section 2.', 'Section 3.', 'Section 4.', 'Section 5.']) assert.ok(text.includes(section), section)
  await closeBookInfo(page)
  return { bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') }
}

try {
  const fixture = await build({
    stdin: { contents: fixtureSource, resolveDir: root, sourcefile: 'isolated-browser-fixture.js', loader: 'js' },
    bundle: true, platform: 'browser', format: 'iife', target: ['chrome120'], write: false,
    outfile: join(temp, 'host-fixture.js'), define: { 'process.env.NODE_ENV': '"production"' },
    plugins: [{ name: 'single-react-runtime', setup(build) { build.onResolve({ filter: /^react$/ }, () => ({ path: reactModule })) } }],
  })
  const fixtureJs = Buffer.from(fixture.outputFiles[0].contents)
  browser = await chromium.launch({
    headless: true,
    ...(process.env.CHROME_EXECUTABLE ? { executablePath: process.env.CHROME_EXECUTABLE } : { channel: 'chrome' }),
    args: ['--disable-background-networking', '--no-first-run', '--no-default-browser-check'],
  })
  let savedSamples = null, savedV1 = null
  for (const label of ['fresh-library', 'existing-library', 'legacy-saved-samples', 'v1-catalog-upgrade']) {
    const seeded = label !== 'fresh-library'
    const migrated = label === 'legacy-saved-samples'
    const upgraded = label === 'v1-catalog-upgrade'
    const context = await browser.newContext({ offline: true, serviceWorkers: 'block', acceptDownloads: true })
    try {
      const page = await context.newPage()
      page.setDefaultTimeout(15000)
      page.on('pageerror', error => failures.push(`${label}: ${error.stack || error.message}`))
      page.on('console', message => { if (message.type() === 'error') failures.push(`${label}: console: ${message.text()}`) })
      await page.route('**/*', async route => {
        const url = route.request().url()
        requestLog.push({ scenario: label, url })
        const paths = new Map([
          [`${origin}/`, { contentType: 'text/html; charset=utf-8', body: html }],
          [`${origin}/seed`, { contentType: 'text/html', body: '<!doctype html><link rel="icon" href="data:,"><title>Isolated IndexedDB seed</title>' }],
          [`${origin}/host-fixture.js`, { contentType: 'text/javascript', body: fixtureJs }],
          [`${origin}/lib/client.js`, { contentType: 'text/javascript', body: bundle }],
        ])
        const response = paths.get(url)
        if (!response || route.request().method() !== 'GET') {
          failures.push(`${label}: unexpected network request ${route.request().method()} ${url}`)
          await route.abort('internetdisconnected')
        } else await route.fulfill({ status: 200, ...response })
      })
      if (seeded) {
        await page.goto(`${origin}/seed`)
        await seedExisting(page, migrated ? savedSamples : upgraded ? savedV1 : null, upgraded)
        assert.equal((await database(page)).bundledBooksInitialized, upgraded)
      }
      await page.goto(`${origin}/`)
      let value = await hydrated(page)
      assert.equal(await page.evaluate(() => navigator.onLine), false)
      const initialCount = manifest.books.length + Number(seeded)
      assert.equal(value.books.length, initialCount, 'bundled books are seeded automatically, not imported through a separate UI')
      const preservedId = upgraded ? 'bundled:aq-zheng-zhuan' : seeded ? 'existing-book' : `bundled:${manifest.books[0].id}`
      assert.equal(value.settings.currentBookId, preservedId)
      await assertConciseLibrary(page)
      await assertUnifiedMenu(page)
      await assertProgress(page, value.books.find(book => book.id === preservedId))
      const registration = await page.evaluate(() => ({ imports: window.__novelTest.hostImports, slots: window.__novelTest.injections, samples: window.__novelTest.samples }))
      assert.deepEqual(registration.imports, ['react', '@deepseek-ai/dsh-client-ui-primitives'])
      assert.ok(registration.slots.includes('plugins.bundle.config'))
      assert.ok(!registration.slots.includes('settings.general.item'))
      assert.deepEqual(registration.samples, manifest.books.map(({ id, title, author, format, bytes, source, license }) => ({ id, title, author, format, bytes, source, license })))
      const samples = manifest.books.map((sample, index) => {
        const id = migrated ? savedSamples.books[index].id : `bundled:${sample.id}`
        const book = value.books.find(book => book.id === id)
        assert.ok(book)
        assert.equal(book.title, migrated ? savedSamples.books[index].title : upgraded ? savedV1.books.find(item => item.id === id).title : sample.title)
        assert.equal(book.format, sample.format)
        assert.equal(book.segmentCount, upgraded ? savedV1.books.find(item => item.id === id).segmentCount : expectedSegments[sample.id])
        assert.equal(book.progress, migrated ? savedSamples.books[index].progress : upgraded ? savedV1.books.find(item => item.id === id).progress : 0)
        if (!migrated) assert.equal(book.bundledId, sample.id)
        return book
      })
      let stored = await database(page)
      assert.equal(stored.books.length, initialCount)
      assert.equal(stored.bundledBooksInitialized, true)
      assert.equal(stored.settings.currentBookId, preservedId)
      assert.equal(stored.settingsRecords.filter(record => record.key === 'bundled-books-v1').length, 1)
      assert.equal(stored.bundledCatalogVersion, 2)
      assert.ok(!('bundledBooksInitialized' in stored.settings), 'marker is separate from user settings')
      for (const book of samples) {
        const segments = stored.segments.filter(segment => segment.bookId === book.id).sort((a, b) => a.index - b.index)
        assert.equal(segments.length, book.segmentCount)
        assert.ok(segments.every((segment, index) => segment.index === index && typeof segment.text === 'string' && segment.text.length > 0))
      }
      if (migrated) {
        assert.deepEqual(stored.books.filter(book => book.id !== 'existing-book'), savedSamples.books, 'all legacy sample metadata and progress are preserved without duplicates')
        assert.deepEqual(stored.segments.filter(segment => segment.bookId !== 'existing-book'), savedSamples.segments)
        assert.equal(stored.books.filter(book => book.id.startsWith('bundled:')).length, 0)
      }
      if (upgraded) {
        const surviving = savedV1.books.filter(book => book.bundledId !== 'shanhaijing-illustrated').map(book => book.bundledId === 'aq-zheng-zhuan' ? { ...book, format: 'md' } : book)
        assert.deepEqual(stored.books.filter(book => book.id !== 'existing-book'), surviving.sort((a, b) => a.id.localeCompare(b.id)))
        assert.deepEqual(stored.segments.filter(segment => segment.bookId !== 'existing-book'), savedV1.segments.filter(segment => segment.bookId !== 'bundled:shanhaijing-illustrated').sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0))
        assert.ok(stored.segments.every(segment => segment.bookId !== 'bundled:shanhaijing-illustrated'))
        assert.equal(stored.settings.currentBookId, preservedId)
      }
      if (!seeded) {
        if (process.env.CAPTURE_SETTINGS === '1') {
          await page.setViewportSize({ width: 760, height: 1000 })
          await page.locator('[data-novel-book-select]').click()
          await page.screenshot({ path: join(root, 'dist/ebooks/settings-unified-preview.png'), fullPage: true })
          await page.locator('[data-novel-book-select]').click()
        }
      }
      await page.reload()
      value = await hydrated(page)
      assert.equal(value.settings.currentBookId, preservedId)
      assert.deepEqual(value.books, stored.books)
      await assertConciseLibrary(page)
      if (seeded) {
        assert.equal(value.settings.mainTitle, 'Saved title')
        assert.equal(value.books.find(book => book.id === 'existing-book').progress, 1)
        assert.deepEqual(stored.segments.filter(segment => segment.bookId === 'existing-book').map(segment => segment.text), ['Existing segment A', legacyPassage])
      }
      for (const book of samples) {
        await selectByClick(page, book)
        const next = stored.segments.find(segment => segment.bookId === book.id && segment.index === book.progress)
        await readByClick(page, book, next.text)
        await page.waitForFunction(({ id, progress }) => window.__novelTest.state().books.find(book => book.id === id).progress === progress + 1, book)
        await assertProgress(page, { ...book, progress: book.progress + 1 })
        await assertConciseLibrary(page)
      }
      const license = await downloadLicense(page, label)
      stored = await database(page)
      assert.equal(stored.settings.currentBookId, samples.at(-1).id)
      assert.ok(samples.every(book => stored.books.find(item => item.id === book.id).progress === book.progress + 1))
      await page.reload()
      value = await hydrated(page)
      assert.equal(value.settings.currentBookId, samples.at(-1).id)
      assert.deepEqual(value.books, stored.books)
      await assertConciseLibrary(page)
      let layout = null
      if (seeded) {
        const existing = value.books.find(book => book.id === 'existing-book')
        await selectByClick(page, existing)
        await readByClick(page, existing, legacyPassage)
        await page.waitForFunction(() => window.__novelTest.state().books.find(book => book.id === 'existing-book').progress === 2)
        layout = await probeLegacyLayout(page)
        assert.equal((await database(page)).segments.find(segment => segment.bookId === 'existing-book' && segment.index === 1).text, legacyPassage)
        await page.reload()
        value = await hydrated(page)
        assert.equal(value.settings.currentBookId, 'existing-book')
        assert.equal(value.books.find(book => book.id === 'existing-book').progress, 2)
      }
      // Keep a genuine passage visible during the first deletion, so clearing
      // stale text is verified rather than inferred from a closed disclosure.
      await selectByClick(page, samples[0])
      const deleting = (await state(page)).books.find(book => book.id === samples[0].id)
      const deletingSegment = (await database(page)).segments.find(segment => segment.bookId === deleting.id && segment.index === deleting.progress)
      await readByClick(page, deleting, deletingSegment.text)
      assert.equal(await page.locator('[data-novel-passage]').count(), 1)
      // Delete through the same menu and confirmation as an imported book.
      // The selected fallback and deletion survive reload.
      stored = await deleteByClick(page, deleting, { cancelFirst: true })
      const afterFirstDeletion = stored.books.length
      assert.equal(afterFirstDeletion, initialCount - 1)
      await page.reload()
      value = await hydrated(page)
      assert.deepEqual(value.books, stored.books, 'deleted bundled book must not be restored')
      assert.equal(value.settings.currentBookId, stored.settings.currentBookId)
      await assertConciseLibrary(page)
      await assertUnifiedMenu(page)
      const deletionCounts = [initialCount, afterFirstDeletion]
      while (value.books.length) {
        stored = await deleteByClick(page, value.books[0])
        value = await state(page)
        deletionCounts.push(value.books.length)
      }
      for (let reload = 0; reload < 2; reload++) {
        await page.reload()
        value = await hydrated(page)
        assert.deepEqual(value.books, [], 'deleting every book must not trigger reseeding')
        assert.equal(value.settings.currentBookId, null)
        stored = await database(page)
        assert.deepEqual(stored.books, [])
        assert.deepEqual(stored.segments, [])
        assert.equal(stored.settings.currentBookId, null)
        assert.equal(stored.bundledBooksInitialized, true)
        assert.equal(await page.locator('[data-novel-delete], [data-novel-progress], [data-novel-settings] progress').count(), 0)
        await assertConciseLibrary(page)
        await assertUnifiedMenu(page)
      }
      await openBookInfo(page)
      await closeBookInfo(page)
      let actualFileImports = null
      if (!seeded) {
        // Re-create the previous sample-import path with the real file input.
        // Copy its ACTUAL parsed metadata, not the new bundled descriptor,
        // into the later pre-marker adoption fixture.
        const imported = []
        for (const sample of manifest.books) imported.push(await importFileByInput(page, sample))
        await page.reload()
        value = await hydrated(page)
        await assertConciseLibrary(page)
        await assertUnifiedMenu(page)
        assert.equal(value.books.length, manifest.books.length)
        for (const book of imported) {
          await selectByClick(page, book)
          const first = (await database(page)).segments.find(segment => segment.bookId === book.id && segment.index === 0)
          await readByClick(page, book, first.text)
          await assertProgress(page, { ...book, progress: 1 })
        }
        const actual = await database(page)
        const remap = new Map(imported.map((book, index) => [book.id, `saved-sample:${index}`]))
        savedSamples = {
          books: imported.map(book => ({ ...actual.books.find(item => item.id === book.id), id: remap.get(book.id) })),
          segments: actual.segments.map(segment => ({ ...segment, id: `${remap.get(segment.bookId)}:${segment.index}`, bookId: remap.get(segment.bookId) })),
        }
        savedSamples.segments.sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0)
        actualFileImports = savedSamples.books.map(book => ({ title: book.title, format: book.format, segments: book.segmentCount, progress: book.progress }))
        // Recover all original export bytes from the shipped MD, then import
        // through the REAL file input to produce exact historical TXT passages.
        const aqSource = manifest.books.find(book => book.id === 'aq-zheng-zhuan')
        const mdBytes = await readFile(join(root, 'samples/ebooks', aqSource.file))
        const prefix = Buffer.from(aqSource.derivation.prefix, 'utf8')
        assert.deepEqual(mdBytes.subarray(0, prefix.length), prefix)
        const oldBytes = mdBytes.subarray(prefix.length)
        const legacyAq = await importFileByInput(page, { file: 'aq-legacy.txt', format: 'txt', expectedSegments: 98, bytes: aqSource.derivation.originalBytes, sha256: aqSource.derivation.originalSha256 }, oldBytes)
        await selectByClick(page, legacyAq)
        const oldSegment = (await database(page)).segments.find(segment => segment.bookId === legacyAq.id && segment.index === 0)
        await readByClick(page, legacyAq, oldSegment.text)
        const withOld = await database(page)
        const english = savedSamples.books[0]
        const oldAq = withOld.books.find(book => book.id === legacyAq.id)
        const removedId = 'bundled:shanhaijing-illustrated'
        const mapping = new Map([[english.id, 'bundled:million-pound-bank-note'], [oldAq.id, 'bundled:aq-zheng-zhuan']])
        savedV1 = {
          books: [
            { ...english, id: mapping.get(english.id), bundledId: 'million-pound-bank-note' },
            { ...oldAq, id: mapping.get(oldAq.id), bundledId: 'aq-zheng-zhuan' },
            { id: removedId, bundledId: 'shanhaijing-illustrated', title: 'Removed legacy default', format: 'epub', progress: 1, segmentCount: 1, importedAt: 1 },
          ],
          segments: [...savedSamples.segments.filter(segment => segment.bookId === english.id), ...withOld.segments.filter(segment => segment.bookId === oldAq.id)]
            .map(segment => ({ ...segment, id: `${mapping.get(segment.bookId)}:${segment.index}`, bookId: mapping.get(segment.bookId) })),
        }
        savedV1.segments.push({ id: removedId + ':0', bookId: removedId, index: 0, text: 'Legacy default passage removed atomically.' })

      }
      reports.push({ scenario: label, initialBooks: initialCount, actualFileImports,
        samples: samples.map(book => ({ id: book.id, title: book.title, format: book.format, segments: book.segmentCount, initialProgress: book.progress, readProgress: book.progress + 1 })),
        licenseBytes: license.bytes, licenseSha256: license.sha256,
        automaticSeed: !migrated && !upgraded, legacySamplesDeduplicated: migrated, v1CatalogMigrated: upgraded, markerSeparateFromSettings: true,
        reloadPersistence: true, menuClicks: true, trustedDisclosureRead: true, originalReasoningPreserved: true,
        conciseMainUi: true, conditionalBookInfo: true, emptyLibraryInfoAccess: true,
        deleteConfirmationClicks: true, deleteCancelPreserved: true, deletionCounts, noReseedAfterEmptyReloads: 2,
        legacyLayout: layout })
    } finally { await context.close() }
  }
  assert.deepEqual(failures, [], failures.join('\n'))
  // Explicitly detect concurrent rebuilds instead of attributing results to a new bundle.
  assert.equal(createHash('sha256').update(await readFile(bundlePath)).digest('hex'), bundleSha256, 'lib/client.js changed during this run; rerun against the final build')
  console.log(JSON.stringify({
    ok: true, verifiedOn: new Date().toISOString(), environment: 'isolated headless Chromium component test; mocked Host primitives; NOT official DSH GUI',
    browser: browser.version(), react: reactVersion, offline: true, bundle: 'lib/client.js', bundleBytes: bundle.length, bundleSha256,
    unexpectedRequests: failures.length, virtualRequests: requestLog.length, network: 'only page.route-fulfilled virtual HTML/fixture/bundle; no sample or external HTTP requests', scenarios: reports,
  }, null, 2))
} catch (error) {
  console.error(JSON.stringify({ ok: false, failures, requests: requestLog }, null, 2))
  throw error
} finally {
  await browser?.close()
  // Only remove the exact directory allocated by this script, never user data.
  const canonicalTemp = await realpath(temp)
  const canonicalParent = await realpath(tmpdir())
  assert.ok(isAbsolute(canonicalTemp) && dirname(canonicalTemp) === canonicalParent && canonicalTemp.split('/').at(-1).startsWith('novel-browser-samples-'))
  await rm(canonicalTemp, { recursive: true, force: true })
}
