import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import vm from 'node:vm'
import React from 'react'
import TestRenderer, { act } from 'react-test-renderer'
import { IDBFactory, IDBKeyRange } from 'fake-indexeddb'
import { IndexedDbStorage } from '../src/persistence.js'
import { DEFAULT_SETTINGS } from '../src/store.js'

import { HostSwitch, hostPrimitives } from './helpers/host-primitives.js'

test('构建产物只在本包详情注册设置，复用宿主 Switch 与原有书库', async () => {
  const indexedDB = new IDBFactory()
  const storage = new IndexedDbStorage(indexedDB, IDBKeyRange)
  const book = { id: 'existing-book', title: '已有书籍', format: 'txt', progress: 1, segmentCount: 2 }
  const settings = { ...DEFAULT_SETTINGS, enabled: false, currentBookId: book.id, mainTitle: '已保存标题' }
  await storage.addBook(book, [{ text: 'A' }, { text: 'B' }])
  await storage.saveSettings(settings)
  const manifest = JSON.parse(await readFile(new URL('../samples/ebooks/sources.json', import.meta.url), 'utf8'))
  const notices = await readFile(new URL('../samples/ebooks/LICENSE.md', import.meta.url), 'utf8')
  const imports = [], effects = [], injections = [], registrations = [], decodedPayloads = []
  let module
  vm.runInNewContext(await readFile(new URL('../lib/client.js', import.meta.url), 'utf8'), {
    window: { __ModuleLoader__: { load: value => { module = value } } },
    indexedDB, IDBKeyRange, TextDecoder, TextEncoder, URL, Blob,
    atob: payload => { decodedPayloads.push(payload); return atob(payload) },
    setTimeout, clearTimeout, setImmediate, clearImmediate,
    console,
  })
  const plugin = module.factory(name => {
    imports.push(name)
    if (name === 'react') return React
    if (name === '@deepseek-ai/dsh-client-ui-primitives') return hostPrimitives
    throw new Error(`Unexpected host import: ${name}`)
  })
  plugin.apply({
    locale: { register: () => () => {}, bind: () => key => key },
    effect: callback => { effects.push(callback) },
    slots: {
      inject: (name, callback) => { injections.push(name); callback() },
      register: (options, Component) => { registrations.push({ options, Component }); return () => {} },
    },
  })
  const own = registrations.find(entry => entry.options.name === 'plugins.bundle.config')
  let view
  try {
    assert.equal(module.id, '@gongfpp/dsh-novel-fish')
    assert.ok(imports.includes('@deepseek-ai/dsh-client-ui-primitives'))
    assert.equal(injections.includes('settings.general.item'), false)
    assert.equal(own.options.key, module.id)
    assert.equal(registrations.filter(entry => entry.options.name === 'plugins.bundle.config').length, 1)
    assert.ok(injections.includes('conversation.chat.reasoning.body'))
    const injected = own.options.inject()
    const source = injected.hooks.novelState
    await new Promise((resolve, reject) => {
      // Real default-book parsing competes with parallel EPUB/host tests. This
      // checks completion, not a 2-second performance SLA on the test runner.
      const timer = setTimeout(() => { off(); reject(new Error('Book hydration timed out')) }, 10000)
      const check = () => {
        const state = source.getSnapshot()
        if (state.error || state.hydrated) {
          off(); clearTimeout(timer)
          if (state.error) reject(new Error(`Book hydration failed: ${state.error}`))
          else resolve()
        }
      }
      const off = source.subscribe(check)
      check()
    })
    assert.equal(source.getSnapshot().error, null)
    assert.equal(source.getSnapshot().books.find(entry => entry.id === book.id).progress, 1)
    assert.equal(source.getSnapshot().settings.mainTitle, settings.mainTitle)
    const props = { ...injected, t: key => key, view: 'page',
      useNovelState: select => select(React.useSyncExternalStore(source.subscribe, source.getSnapshot)),
      useNovelUi: select => select(React.useSyncExternalStore(injected.hooks.novelUi.subscribe, injected.hooks.novelUi.getSnapshot)),
    }
    await act(async () => { view = TestRenderer.create(React.createElement(own.Component, props)) })
    const enabledSwitch = () => view.root.findAllByType(HostSwitch).find(node => node.props.label === 'settings.enabled')
    assert.equal(enabledSwitch().props.checked, false)
    assert.equal(source.getSnapshot().books.find(entry => entry.id === book.id).progress, 1)
    await act(async () => { await injected.onSetOption('enabled', true) })
    assert.equal(enabledSwitch().props.checked, true)
    const saved = await storage.load()
    assert.equal(saved.settings.enabled, true)
    assert.equal(saved.settings.currentBookId, book.id)
    assert.equal(saved.settings.mainTitle, settings.mainTitle)
    assert.equal(saved.books.find(entry => entry.id === book.id).progress, 1)
    assert.deepEqual(await storage.getSegment(book.id, 1), { text: 'B' })
    const expectedSamples = manifest.books.map(({ id, title, author, format, bytes, source, license }) => ({ id, title, author, format, bytes, source, license }))
    assert.deepEqual(JSON.parse(JSON.stringify(injected.sampleBooks)), expectedSamples)
    for (const sample of manifest.books) {
      assert.ok(sample.license?.trim(), `Missing concise license for ${sample.id}`)
      assert.equal(sample.bytes, (await readFile(new URL(`../samples/ebooks/${sample.file}`, import.meta.url))).byteLength)
    }
    assert.equal(decodedPayloads.length, manifest.books.filter(book => book.format !== 'md').length, 'Initial hydration provisions all bundled books once')
    assert.equal(injected.onImportSample, undefined, 'No separate bundled import action')
    const licenseHref = injected.getSampleLicenseHref()
    assert.ok(licenseHref.startsWith('data:text/plain;charset=utf-8,'))
    assert.equal(decodeURIComponent(licenseHref.slice(licenseHref.indexOf(',') + 1)), notices)
    assert.equal(injected.getSampleLicenseHref(), licenseHref)
    assert.equal(decodedPayloads.length, manifest.books.filter(book => book.format !== 'md').length, 'Offline notices must not decode another ebook')
    for (const sample of injected.sampleBooks) {
      const seeded = source.getSnapshot().books.find(entry => entry.bundledId === sample.id)
      assert.equal(seeded.id, `bundled:${sample.id}`)
      assert.equal(seeded.title, sample.title)
      assert.equal(seeded.format, sample.format)
      assert.ok(seeded.segmentCount > 1)
    }
    assert.equal((await storage.load()).books.length, 1 + manifest.books.length)
    const seededId = `bundled:${injected.sampleBooks[0].id}`
    await act(async () => { await injected.onSelectBook(seededId) })
    assert.equal(source.getSnapshot().settings.currentBookId, seededId)
    await act(async () => { await injected.onDeleteBook(seededId) })
    assert.equal(source.getSnapshot().books.some(entry => entry.id === seededId), false)
    assert.equal((await storage.load()).bundledBooksInitialized, true)
    assert.equal((await storage.load()).books.length, manifest.books.length)
    assert.equal(source.getSnapshot().books.find(entry => entry.id === book.id).progress, 1)
  } finally {
    if (view) await act(async () => view.unmount())
    effects[1]()() // Dispose only the store effect; do not install chat DOM observers.
    storage.close()
  }
})
