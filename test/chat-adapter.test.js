import test from 'node:test'
import assert from 'node:assert/strict'
import { JSDOM } from 'jsdom'
import React from 'react'
import TestRenderer, { act } from 'react-test-renderer'
import { passageSnapshotKey } from '../src/store.js'
import { registerChatAdapter } from '../src/chat-adapter.js'

// Mirrors CURRENT 0.2.1-rc.2 DisclosureRow/TextShimmer nesting, not a replacement
// renderer. Trusted events below are handler-contract probes, NOT browser evidence.
function row({ leadingOnly = false, running = true } = {}) {
  const toggle = leadingOnly ? '' : 'role="button" tabindex="0" aria-expanded="false"'
  const leading = leadingOnly ? 'button type="button" aria-expanded="false" aria-label="Native title"' : 'span'
  const layer = highlight => `<span class="native-content"><span class="native-title" ${highlight ? 'data-shimmer-text="Native title"' : ''}>${highlight ? '' : 'Native title'}</span><span data-shimmer-decoration aria-hidden="true" class="native-separator"></span><span class="native-summary"><span class="native-text" ${highlight ? 'data-shimmer-text="Native summary"' : ''}>${highlight ? '' : 'Native summary'}</span></span></span>`
  return `<div data-variant="think"><div data-disclosure-header><div data-disclosure-row class="native-row" ${toggle}><${leading} class="native-leading"><span class="native-idle"><svg width="14" data-glyph="think"></svg></span><svg class="native-hover" data-glyph="down"></svg></${leadingOnly ? 'button' : 'span'}><span class="native-shimmer" ${running ? 'data-shimmer' : ''}>${layer(false)}${running ? `<span aria-hidden="true" inert class="native-decoration"><span class="native-sweep">${layer(true)}</span></span>` : ''}</span></div></div></div>`
}
function thought(key, content = row()) {
  return `<div data-chat-flow-kind="assistant-step" data-chat-node-key="${key}">${content}</div>`
}
const readingKey = (session, node, index = 0) => JSON.stringify([session, node, 'reasoning', index])
const settle = () => new Promise(resolve => setImmediate(resolve))

function installDom(dom) {
  const originals = Object.fromEntries(['document', 'Element', 'MutationObserver'].map(key => [key, globalThis[key]]))
  for (const key of Object.keys(originals)) globalThis[key] = dom.window[key]
  return () => {
    dom.window.close()
    for (const [key, value] of Object.entries(originals)) {
      if (value === undefined) delete globalThis[key]
      else globalThis[key] = value
    }
  }
}
function adapterFixture(content = thought('node-a'), session = 'session-a') {
  const dom = new JSDOM(`<body><div data-conversation-session="${session}">${content}</div></body>`)
  const restoreDom = installDom(dom)
  let settings = { enabled: true, currentBookId: 'book', targetTypes: ['reasoning'], mainTitle: '思考', extraTitle: 'Checking project structure' }
  const claims = [], types = [], effects = [], actions = {}
  const statuses = new Map()
  let passagesChanged
  const add = document.addEventListener.bind(document)
  document.addEventListener = (type, handler, ...args) => { actions[type] = handler; return add(type, handler, ...args) }
  let settingsChanged
  const store = {
    cacheGeneration: 0,
    settingsSource: {}, passageSource: {}, getSettingsSnapshot: () => settings,
    subscribeSettings: fn => { settingsChanged = fn; return () => {} },
    subscribePassages: callback => { passagesChanged = callback; return () => {} },
    getPassageStatus: (_book, key) => statuses.get(key) ?? ({ kind: 'empty' }),
    claimPassage: (key, type) => { claims.push(key); types.push(type); return Promise.resolve() },
  }
  const ctx = { slots: { inject: (_key, fn) => fn(), register: () => () => {} }, effect: fn => { effects.push(fn()) } }
  return {
    dom, claims, types, actions, start: () => registerChatAdapter(ctx, store, React, 'novel'),
    passage: (key, status) => { statuses.set(key, status); passagesChanged() },
    invalidate: () => { store.cacheGeneration += 1 },
    settings: patch => { settings = { ...settings, ...patch }; settingsChanged() },
    close: () => { effects.reverse().forEach(dispose => dispose?.()); restoreDom() },
  }
}
const trustedClick = target => ({ isTrusted: true, type: 'click', defaultPrevented: false, button: 0, target })

test('text-only adaptation retains native glyphs, shimmer layers, layout nodes and tool rows', async () => {
  const f = adapterFixture(thought('a') + thought('b') + `<div data-chat-flow-kind="tool-call">${row()}</div>`)
  try {
    const roots = document.querySelectorAll('[data-chat-flow-kind="assistant-step"] [data-variant="think"]')
    const header = roots[0].querySelector('[data-disclosure-row]')
    const leading = header.firstElementChild
    const glyphs = leading.outerHTML
    const title = header.querySelector('.native-title')
    const titleText = title.firstChild
    const nodes = [...header.querySelectorAll('*')]
    const tool = document.querySelector('[data-chat-flow-kind="tool-call"]')
    const toolHtml = tool.innerHTML
    f.start()
    assert.equal(document.querySelectorAll('[data-novel-target]').length, 2)
    assert.equal(header.firstElementChild, leading)
    assert.equal(leading.outerHTML, glyphs)
    assert.equal(title.firstChild, titleText, 'native React text node is retained')
    assert.equal(title.textContent, '思考')
    assert.equal(header.querySelector('.native-summary').textContent, 'Checking project structure')
    assert.deepEqual([...header.querySelectorAll('*')], nodes, 'no replacement title, overlay or arrow nodes')
    assert.deepEqual([...header.querySelectorAll('[data-shimmer-text]')].map(node => node.getAttribute('data-shimmer-text')), ['思考', 'Checking project structure'])
    assert.equal(header.querySelector('[data-shimmer]').hasAttribute('data-shimmer'), true)
    assert.equal(tool.innerHTML, toolHtml)
    assert.equal(document.querySelector('style, [data-novel-label], [data-novel-icon]'), null)
    assert.equal(header.querySelector('[style]'), null, 'native font/color/spacing/hover styles remain authoritative')
    // Simulate a native streaming write; disabling must restore the latest host text.
    titleText.nodeValue = 'Updated native title'
    await settle()
    assert.equal(title.textContent, '思考')
    f.settings({ enabled: false })
    assert.equal(title.textContent, 'Updated native title')
    assert.equal(header.querySelector('.native-summary').textContent, 'Native summary')
    assert.equal(header.querySelector('[data-shimmer-text]').getAttribute('data-shimmer-text'), 'Native title')
    assert.equal(leading.outerHTML, glyphs)
    assert.equal(document.querySelector('[data-novel-target]'), null)
  } finally { f.close() }
})

test('only verified user closed-to-open transitions claim; automatic, canceled and nested actions do not', async () => {
  const f = adapterFixture()
  try {
    f.start()
    const header = document.querySelector('[data-disclosure-row]')
    const nested = document.createElement('button')
    nested.textContent = 'Independent action'; header.append(nested)
    const link = document.createElement('a'); link.href = '#other'; header.append(link)
    header.dispatchEvent(new f.dom.window.MouseEvent('click', { bubbles: true }))
    f.actions.click({ ...trustedClick(header), defaultPrevented: true })
    f.actions.click({ ...trustedClick(header), button: 1 })
    f.actions.click(trustedClick(nested))
    f.actions.click(trustedClick(link))
    f.actions.keydown({ isTrusted: true, type: 'keydown', key: ' ', repeat: true, target: header })
    f.actions.keydown({ isTrusted: true, type: 'keydown', key: 'Escape', target: header })
    f.actions.keydown({ isTrusted: true, type: 'keydown', key: 'Enter', target: nested })
    await settle()
    assert.equal(f.claims.length, 0)
    f.actions.click(trustedClick(header))
    assert.equal(f.claims.length, 0, 'capture is intent only')
    await settle()
    assert.equal(f.claims.length, 0, 'no host transition means no read')
    header.setAttribute('aria-expanded', 'true')
    header.append(document.createTextNode('streaming update'))
    await settle()
    assert.equal(f.claims.length, 0, 'history/automatic expansion and stream changes do not read')
    f.actions.click(trustedClick(header))
    header.setAttribute('aria-expanded', 'false')
    await settle()
    assert.equal(f.claims.length, 0, 'closing does not read')
    f.actions.click(trustedClick(header.querySelector('.native-title')))
    header.setAttribute('aria-expanded', 'true')
    assert.equal(f.claims.length, 0)
    await settle()
    assert.deepEqual(f.claims, [readingKey('session-a', 'node-a')])
  } finally { f.close() }
})

test('Enter/Space use the native toggle and thought regions get independent temporary keys', async () => {
  const f = adapterFixture(thought('node-a', row() + row()))
  try {
    f.start()
    const headers = document.querySelectorAll('[data-disclosure-row]')
    for (const [index, target] of [...headers].entries()) {
      f.actions.keydown({ isTrusted: true, type: 'keydown', key: index ? ' ' : 'Enter', repeat: false, target })
      target.setAttribute('aria-expanded', 'true')
    }
    await settle()
    assert.deepEqual(f.claims, [readingKey('session-a', 'node-a', 0), readingKey('session-a', 'node-a', 1)])
  } finally { f.close() }
})

test('leading-button mode ignores title/row clicks and keeps the native button accessible label', async () => {
  const f = adapterFixture(thought('node-a', row({ leadingOnly: true })))
  try {
    f.start()
    const header = document.querySelector('[data-disclosure-row]')
    const toggle = header.firstElementChild
    f.actions.click(trustedClick(header))
    f.actions.click(trustedClick(header.querySelector('.native-title')))
    await settle()
    assert.equal(f.claims.length, 0)
    assert.equal(toggle.getAttribute('aria-label'), 'Native title')
    f.actions.click(trustedClick(toggle.querySelector('svg')))
    toggle.setAttribute('aria-expanded', 'true')
    await settle()
    assert.equal(f.claims.length, 1)
    assert.equal(toggle.getAttribute('aria-label'), 'Native title', 'no accessible-control rewrite')
  } finally { f.close() }
})

test('book switch, disposal and removed rows cancel pending reads; rapid intent is coalesced', async () => {
  const f = adapterFixture()
  try {
    f.start()
    const header = document.querySelector('[data-disclosure-row]')
    f.actions.click(trustedClick(header))
    header.setAttribute('aria-expanded', 'true')
    f.settings({ currentBookId: 'other-book' })
    await settle()
    assert.equal(f.claims.length, 0)
    header.setAttribute('aria-expanded', 'false')
    f.actions.click(trustedClick(header)); f.actions.click(trustedClick(header))
    header.setAttribute('aria-expanded', 'true')
    await settle()
    assert.equal(f.claims.length, 1)
    header.setAttribute('aria-expanded', 'false')
    f.actions.click(trustedClick(header))
    header.setAttribute('aria-expanded', 'true')
    header.remove()
    await settle()
    assert.equal(f.claims.length, 1)
  } finally { f.close() }
})

test('关闭重开、类型移除重选和切书切回不能复活帧内旧意图', async () => {
  const f = adapterFixture()
  const frames = []
  f.dom.window.requestAnimationFrame = callback => { frames.push(callback); return frames.length }
  f.dom.window.cancelAnimationFrame = () => {}
  try {
    f.start()
    const header = document.querySelector('[data-disclosure-row]')
    for (const cancel of [
      () => { f.settings({ enabled: false }); f.settings({ enabled: true }) },
      () => { f.settings({ targetTypes: [] }); f.settings({ targetTypes: ['reasoning'] }) },
      () => { f.settings({ currentBookId: 'other' }); f.settings({ currentBookId: 'book' }) },
      () => f.invalidate(), // 持久化尚未发出设置快照时，意图代次已失效。
    ]) {
      header.setAttribute('aria-expanded', 'false')
      f.actions.click(trustedClick(header))
      header.setAttribute('aria-expanded', 'true')
      cancel()
      frames.at(-1)()
      assert.equal(f.claims.length, 0)
    }
    header.setAttribute('aria-expanded', 'false')
    f.actions.click(trustedClick(header)); header.setAttribute('aria-expanded', 'true')
    frames.at(-1)()
    assert.equal(f.claims.length, 1, '重新主动展开的新意图仍可读取')
  } finally { f.close() }
})

test('微任务回退同样不会恢复已取消的用户展开', async () => {
  const f = adapterFixture()
  try {
    f.start()
    const header = document.querySelector('[data-disclosure-row]')
    f.actions.click(trustedClick(header)); header.setAttribute('aria-expanded', 'true')
    f.settings({ enabled: false }); f.settings({ enabled: true })
    await settle()
    assert.equal(f.claims.length, 0)
  } finally { f.close() }
})

function bodyFixture() {
  const dom = new JSDOM(`<div data-conversation-session="session-a">${thought('14:assistant-step1:1')}</div>`)
  const marker = dom.window.document.createElement('div')
  dom.window.document.querySelector('[data-variant="think"]').append(marker)
  let Body
  const ctx = { slots: { inject: (_key, fn) => fn(), register: (_options, component) => { Body = component; return () => {} } }, effect: () => {} }
  registerChatAdapter(ctx, {}, React, 'novel')
  return { dom, marker, Body }
}

test('纯文本小说和章节位于原思考后的分隔线下；重挂载和流式更新不读取', async () => {
  const { dom, marker, Body } = bodyFixture()
  const settings = { enabled: true, currentBookId: 'book', targetTypes: ['reasoning'] }
  let status = { kind: 'ready', index: 0, passage: { text: 'A cached passage', chapterTitle: '第一章' } }
  let claims = 0
  const forwarded = []
  const props = {
    text: 'ORIGINAL MODEL THOUGHT', running: true, sessionId: 'session-a',
    useNovelSettings: selector => selector(settings),
    useNovelPassages: selector => selector({ [passageSnapshotKey('book', readingKey('session-a', '14:assistant-step1:1'))]: status }),
    renderFactorySlot: (name, input) => { forwarded.push({ name, ...input }); return React.createElement('p', null, input.text) }, t: key => key,
    onClaimPassage: () => { claims += 1 },
  }
  let view
  try {
    await act(async () => { view = TestRenderer.create(React.createElement(Body, props), { createNodeMock: () => marker }) })
    assert.equal(view.root.findByProps({ 'data-novel-original': true }).findByType('p').children.join(''), props.text)
    assert.equal(view.root.findByProps({ 'data-novel-passage': 1 }).children.join(''), 'A cached passage')
    assert.equal(view.root.findByProps({ 'data-novel-label': true }).children.join(''), 'chat.novel · 第一章')
    assert.equal(view.root.findAllByType('hr').length, 1)
    assert.equal(view.toJSON().children[0].props['data-novel-original'], true)
    assert.equal(view.toJSON().children[1].props['data-novel-append'], true)
    assert.equal(view.toJSON().children[1].props.style.whiteSpace, 'pre-wrap')
    await act(async () => view.update(React.createElement(Body, { ...props, text: 'stream update', running: false })))
    assert.match(JSON.stringify(view.toJSON()), /stream update.*A cached passage/u)
    assert.ok(forwarded.some(input => input.name === 'conversation.chat.reasoning.content' && input.text === 'stream update' && input.running === false))
    assert.equal(claims, 0)
    await act(async () => view.unmount())
    await act(async () => { view = TestRenderer.create(React.createElement(Body, props), { createNodeMock: () => marker }) })
    assert.match(JSON.stringify(view.toJSON()), /ORIGINAL MODEL THOUGHT.*A cached passage/u)
    const literal = 'normal (prose) $100 and $200\na\n===\n    indent\nuser@example.com https://example.invalid ![image](x) <script> & text'
    status = { kind: 'ready', index: 0, passage: { text: literal } }
    await act(async () => view.update(React.createElement(Body, props)))
    assert.equal(view.root.findByProps({ 'data-novel-passage': 1 }).children.join(''), literal)
    assert.ok(forwarded.every(input => ['ORIGINAL MODEL THOUGHT', 'stream update'].includes(input.text)), '只有真实思考进入宿主 Markdown Factory')
    for (const tag of ['a', 'img', 'script', 'pre', 'h1']) assert.equal(view.root.findAllByType(tag).length, 0)
    for (const next of [undefined, { kind: 'loading' }, { kind: 'error' }, { kind: 'end' }]) {
      status = next
      await act(async () => view.update(React.createElement(Body, { ...props, running: false })))
      assert.match(JSON.stringify(view.toJSON()), /ORIGINAL MODEL THOUGHT/u)
      assert.equal(view.root.findAllByProps({ 'data-novel-passage': 1 }).length, 0)
      const notice = view.root.findByProps({ role: next?.kind === 'error' ? 'alert' : 'status' })
      assert.equal(notice.children.length, 1, '状态消息同样作为纯文本呈现')
      assert.equal(forwarded.at(-1).name, 'conversation.chat.reasoning.content')
      assert.equal(forwarded.at(-1).text, 'ORIGINAL MODEL THOUGHT')
      assert.equal(forwarded.at(-1).running, false)
    }
    assert.equal(claims, 0)
    settings.enabled = false
    await act(async () => view.update(React.createElement(Body, props)))
    assert.equal(view.root.findAllByProps({ 'data-novel-append': true }).length, 0)
  } finally { await act(async () => view?.unmount()); dom.window.close() }
})

function toolRow(name, variant, callId) {
  const native = row().replace('data-variant="think"', `data-tool="${name}" data-variant="${variant}"`)
  return `<div data-chat-flow-kind="tool-call" data-chat-node-key="tools"><div data-chat-call-id="${callId}">${native.slice(0, -6)}<p data-native-output>真实工具输入输出</p>${native.slice(-6)}</div></div>`
}
function commandRow() {
  return '<div data-chat-flow-kind="tool-call" data-chat-node-key="tools"><div data-chat-call-id="command"><div class="native-command-card"><div data-sample="bash" data-variant="bash" role="button" aria-expanded="false" tabindex="0"><span><svg data-glyph="bash"></svg></span><span><span><span>运行命令</span><span data-shimmer-decoration></span><span>原生摘要</span></span></span></div><pre data-native-output>exit code: 0</pre></div></div></div>'
}

test('五类区域独立定位，工具原正文保持且分隔线下只追加一次，卸载清理', async () => {
  const f = adapterFixture(thought('thought') + toolRow('web_fetch', 'read', 'other') + toolRow('read', 'read', 'read') + toolRow('grep', 'search', 'search') + commandRow())
  try {
    f.start()
    f.settings({ targetTypes: ['reasoning', 'tool-call', 'read-file', 'command', 'file-search'] })
    const outputs = [...document.querySelectorAll('[data-native-output]')]
    const originalOutputs = outputs.map(node => node.outerHTML)
    const headers = [...document.querySelectorAll('[data-disclosure-row], [data-sample="bash"]')]
    for (const header of headers) {
      f.actions.click(trustedClick(header))
      header.setAttribute('aria-expanded', 'true')
    }
    await settle()
    assert.deepEqual(f.types, ['reasoning', 'tool-call', 'read-file', 'file-search', 'command'])
    const literal = '价格 $100 and $200 (正文) user@example.com\na\n===\n![x](https://invalid)'
    for (const [index, key] of f.claims.entries()) f.passage(key, { kind: 'ready', index, passage: { text: literal, chapterTitle: '章节甲' } })
    await settle()
    assert.equal(document.querySelectorAll('[data-novel-append]').length, 4, '思考正文由其原生body slot负责')
    for (const append of document.querySelectorAll('[data-novel-append]')) {
      assert.equal(append.querySelectorAll('hr').length, 1)
      assert.ok(append.previousElementSibling.hasAttribute('data-native-output'), '小说位于原生工具正文之后')
      assert.match(append.querySelector('[data-novel-label]').textContent, /章节甲/u)
      assert.equal(append.lastElementChild.textContent, literal)
      assert.equal(append.querySelector('a, img, script, pre, h1'), null)
    }
    assert.deepEqual(outputs.map(node => node.outerHTML), originalOutputs)
    f.settings({ targetTypes: ['reasoning'] })
    assert.equal(document.querySelectorAll('[data-novel-append]').length, 0)
    assert.deepEqual(outputs.map(node => node.outerHTML), originalOutputs)
  } finally { f.close() }
})

test('工具自动展开及内部文件链接不消耗，折叠重挂载仍用稳定callId键', async () => {
  const f = adapterFixture(toolRow('read', 'read', 'call-a'))
  try {
    f.start(); f.settings({ targetTypes: ['read-file'] })
    let header = document.querySelector('[data-disclosure-row]')
    header.setAttribute('aria-expanded', 'true')
    await settle()
    assert.equal(f.claims.length, 0)
    const link = document.createElement('button'); header.append(link)
    f.actions.click(trustedClick(link)); await settle()
    assert.equal(f.claims.length, 0)
    header.setAttribute('aria-expanded', 'false')
    f.actions.click(trustedClick(header)); header.setAttribute('aria-expanded', 'true'); await settle()
    const key = f.claims[0]
    document.querySelector('[data-chat-flow-kind]').outerHTML = toolRow('read', 'read', 'call-a')
    await settle()
    header = document.querySelector('[data-disclosure-row]')
    f.actions.click(trustedClick(header)); header.setAttribute('aria-expanded', 'true'); await settle()
    assert.deepEqual(f.claims, [key, key], '组件重挂载不生成另一个阅读缓存键')
    assert.equal(f.types[0], 'read-file')
  } finally { f.close() }
})

test('native thought remains visible when its DOM identity is unavailable', async () => {
  const { dom, Body } = bodyFixture()
  let view
  try {
    await act(async () => { view = TestRenderer.create(React.createElement(Body, {
      text: 'REAL THOUGHT BEFORE IDENTITY', running: false,
      useNovelSettings: select => select({ enabled: true, targetTypes: ['reasoning'] }),
      useNovelPassages: select => select({}), renderFactorySlot: (_name, input) => input.text, t: key => key,
    }), { createNodeMock: () => null }) })
    assert.match(JSON.stringify(view.toJSON()), /REAL THOUGHT BEFORE IDENTITY/u)
    assert.equal(view.root.findAllByProps({ 'data-novel-append': true }).length, 0)
  } finally { await act(async () => view?.unmount()); dom.window.close() }
})
