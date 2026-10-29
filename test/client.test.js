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
  const imports = [], effects = [], injections = [], registrations = []
  let module
  vm.runInNewContext(await readFile(new URL('../lib/client.js', import.meta.url), 'utf8'), {
    window: { __ModuleLoader__: { load: value => { module = value } } },
    indexedDB, IDBKeyRange, TextDecoder, TextEncoder, setTimeout, clearTimeout,
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
      const timer = setTimeout(() => { off(); reject(new Error('Book hydration timed out')) }, 2000)
      const check = () => { if (source.getSnapshot().hydrated) { off(); clearTimeout(timer); resolve() } }
      const off = source.subscribe(check)
      check()
    })
    assert.equal(source.getSnapshot().error, null)
    assert.equal(source.getSnapshot().books[0].progress, 1)
    assert.equal(source.getSnapshot().settings.mainTitle, settings.mainTitle)
    const props = { ...injected, t: key => key, view: 'page',
      useNovelState: select => select(React.useSyncExternalStore(source.subscribe, source.getSnapshot)),
      useNovelUi: select => select(React.useSyncExternalStore(injected.hooks.novelUi.subscribe, injected.hooks.novelUi.getSnapshot)),
    }
    await act(async () => { view = TestRenderer.create(React.createElement(own.Component, props)) })
    assert.equal(view.root.findByType(HostSwitch).props.checked, false)
    assert.equal(source.getSnapshot().books[0].progress, 1)
    await act(async () => { await injected.onSetOption('enabled', true) })
    assert.equal(view.root.findByType(HostSwitch).props.checked, true)
    const saved = await storage.load()
    assert.equal(saved.settings.enabled, true)
    assert.equal(saved.settings.currentBookId, book.id)
    assert.equal(saved.settings.mainTitle, settings.mainTitle)
    assert.equal(saved.books[0].progress, 1)
    assert.deepEqual(await storage.getSegment(book.id, 1), { text: 'B' })
  } finally {
    if (view) await act(async () => view.unmount())
    effects[1]()() // Dispose only the store effect; do not install chat DOM observers.
    storage.close()
  }
})
