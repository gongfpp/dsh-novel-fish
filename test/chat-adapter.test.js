import test from 'node:test'
import assert from 'node:assert/strict'
import { JSDOM } from 'jsdom'
import React from 'react'
import TestRenderer, { act } from 'react-test-renderer'
import { passageSnapshotKey } from '../src/store.js'
import { registerChatAdapter } from '../src/chat-adapter.js'

function row() {
  return '<div data-variant="think"><div data-disclosure-row role="button" aria-expanded="false"><span><svg></svg></span><span>Native title</span></div></div>'
}
function thought(key, content = row()) {
  return `<div data-chat-flow-kind="assistant-step" data-chat-node-key="${key}">${content}</div>`
}
const readingKey = (session, node, index = 0) => JSON.stringify([session, node, 'reasoning', index])

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

test('type selection decorates every native thought across chats, never tools or synthetic/automatic opens', async () => {
  const dom = new JSDOM(`<body><div data-conversation-session="session-a">${thought('14:assistant-step1:1')}${thought('14:assistant-step1:2')}<div data-chat-flow-kind="tool-call">${row()}</div></div><div data-conversation-session="session-b">${thought('14:assistant-step2:1')}</div></body>`)
  const restoreDom = installDom(dom)
  let settings = { enabled: true, currentBookId: 'book', targetType: 'reasoning', icon: '◎', mainTitle: '思考', extraTitle: 'Checking project structure' }
  const claims = [], effects = [], actions = {}
  const add = document.addEventListener.bind(document)
  document.addEventListener = (type, handler, ...args) => { actions[type] = handler; return add(type, handler, ...args) }
  let settingsChanged
  const store = {
    settingsSource: {}, passageSource: {}, getSettingsSnapshot: () => settings,
    subscribeSettings: fn => { settingsChanged = fn; return () => {} },
    claimPassage: key => { claims.push(key); return Promise.resolve() },
  }
  const ctx = { locale: { bind: () => key => key }, slots: { inject: (_key, fn) => fn(), register: () => () => {} }, effect: fn => { effects.push(fn()) } }
  try {
    registerChatAdapter(ctx, store, React, 'novel')
    const roots = document.querySelectorAll('[data-chat-flow-kind="assistant-step"] [data-variant="think"]')
    assert.equal(document.querySelectorAll('[data-novel-label]').length, 3, 'no individual location selection is needed')
    assert.equal(roots[0].querySelector('[data-novel-label]').textContent, '思考 · Checking project structure')
    assert.equal(roots[0].querySelector('[data-novel-icon]').textContent, '◎')
    assert.equal(document.querySelector('[data-chat-flow-kind="tool-call"] [data-novel-label]'), null)
    const header = roots[0].querySelector('[data-disclosure-row]')
    header.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }))
    assert.equal(claims.length, 0)
    header.setAttribute('aria-expanded', 'true')
    header.append(document.createTextNode('streaming update'))
    await new Promise(resolve => setImmediate(resolve))
    assert.equal(claims.length, 0, 'automatic expansion/history/stream changes must not claim')
    actions.click({ isTrusted: true, type: 'click', target: header })
    assert.equal(claims.length, 0, 'closing an expanded region does not claim')
    header.setAttribute('aria-expanded', 'false')
    actions.click({ isTrusted: true, type: 'click', target: header })
    actions.click({ isTrusted: true, type: 'click', target: roots[1].querySelector('[data-disclosure-row]') })
    actions.keydown({ isTrusted: true, type: 'keydown', key: 'Enter', target: roots[2].querySelector('[data-disclosure-row]') })
    assert.deepEqual(claims, [readingKey('session-a', '14:assistant-step1:1'), readingKey('session-a', '14:assistant-step1:2'), readingKey('session-b', '14:assistant-step2:1')])
    settings = { ...settings, targetType: 'unsupported' }; settingsChanged()
    assert.equal(document.querySelector('[data-novel-label]'), null)
    settings = { ...settings, targetType: 'reasoning', enabled: false }; settingsChanged()
    assert.equal(document.querySelector('[data-novel-label]'), null)
    assert.equal(header.querySelector('svg') !== null, true)
    assert.equal(header.querySelector('span:nth-child(2)').textContent, 'Native title')
  } finally { effects.reverse().forEach(dispose => dispose?.()); restoreDom() }
})

test('two thought regions within one assistant step have independent temporary cache keys', () => {
  const dom = new JSDOM(`<div data-conversation-session="session-a">${thought('node-a', row() + row())}</div>`)
  const restoreDom = installDom(dom)
  const claims = [], effects = []
  let click
  const add = document.addEventListener.bind(document)
  document.addEventListener = (type, handler, ...args) => { if (type === 'click') click = handler; return add(type, handler, ...args) }
  const store = { settingsSource: {}, passageSource: {}, getSettingsSnapshot: () => ({ enabled: true, targetType: 'reasoning', icon: '📖', mainTitle: '', extraTitle: '' }), subscribeSettings: () => () => {}, claimPassage: key => { claims.push(key) } }
  const ctx = { locale: { bind: () => key => key }, slots: { inject: (_key, fn) => fn(), register: () => () => {} }, effect: fn => { effects.push(fn()) } }
  try {
    registerChatAdapter(ctx, store, React, 'novel')
    for (const target of document.querySelectorAll('[data-disclosure-row]')) click({ type: 'click', isTrusted: true, target })
    assert.deepEqual(claims, [readingKey('session-a', 'node-a', 0), readingKey('session-a', 'node-a', 1)])
  } finally { effects.reverse().forEach(dispose => dispose?.()); restoreDom() }
})

function bodyFixture() {
  const dom = new JSDOM(`<div data-conversation-session="session-a">${thought('14:assistant-step1:1')}</div>`)
  const marker = dom.window.document.createElement('div')
  dom.window.document.querySelector('[data-variant="think"]').append(marker)
  let Body
  const ctx = { locale: { bind: () => key => key }, slots: { inject: (_key, fn) => fn(), register: (_options, component) => { Body = component; return () => {} } }, effect: () => {} }
  registerChatAdapter(ctx, {}, React, 'novel')
  return { dom, marker, Body }
}

test('novel is appended after real thought; remount, stream and completion only read cache', async () => {
  const { dom, marker, Body } = bodyFixture()
  const settings = { enabled: true, currentBookId: 'book', targetType: 'reasoning' }
  let status = { kind: 'ready', index: 0, passage: { text: 'A cached passage' } }
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
    const original = view.root.findByProps({ 'data-novel-original': true })
    assert.equal(original.findByType('p').children.join(''), props.text)
    assert.equal(view.root.findByProps({ 'data-novel-passage': 1 }).children.join(''), 'A cached passage')
    assert.equal(view.toJSON().children[0].props['data-novel-original'], true)
    assert.equal(view.toJSON().children[1].props['data-novel-append'], true, 'novel follows, never replaces, original thought')
    await act(async () => view.update(React.createElement(Body, { ...props, text: 'stream update', running: false })))
    assert.match(JSON.stringify(view.toJSON()), /stream update.*A cached passage/u)
    assert.deepEqual(forwarded.at(-1), { name: 'conversation.chat.reasoning.content', text: 'stream update', running: false })
    assert.equal(claims, 0)
    await act(async () => view.unmount())
    await act(async () => { view = TestRenderer.create(React.createElement(Body, props), { createNodeMock: () => marker }) })
    assert.match(JSON.stringify(view.toJSON()), /ORIGINAL MODEL THOUGHT.*A cached passage/u)
    for (const next of [undefined, { kind: 'loading' }, { kind: 'error' }, { kind: 'end' }]) {
      status = next
      await act(async () => view.update(React.createElement(Body, { ...props, running: false })))
      assert.match(JSON.stringify(view.toJSON()), /ORIGINAL MODEL THOUGHT/u)
      assert.equal(view.root.findAllByProps({ 'data-novel-passage': 1 }).length, 0)
    }
    assert.equal(claims, 0, 'empty/restored/failed bodies do not initiate a load')
    settings.enabled = false
    await act(async () => view.update(React.createElement(Body, props)))
    assert.equal(view.root.findAllByProps({ 'data-novel-append': true }).length, 0)
    assert.match(JSON.stringify(view.toJSON()), /ORIGINAL MODEL THOUGHT/u)
  } finally { await act(async () => view?.unmount()); dom.window.close() }
})

test('native thought remains visible when its DOM identity is unavailable', async () => {
  const { dom, Body } = bodyFixture()
  let view
  try {
    await act(async () => { view = TestRenderer.create(React.createElement(Body, {
      text: 'REAL THOUGHT BEFORE IDENTITY', running: false,
      useNovelSettings: select => select({ enabled: true, targetType: 'reasoning' }),
      useNovelPassages: select => select({}), renderFactorySlot: (_name, input) => input.text, t: key => key,
    }), { createNodeMock: () => null }) })
    assert.match(JSON.stringify(view.toJSON()), /REAL THOUGHT BEFORE IDENTITY/u)
    assert.equal(view.root.findAllByProps({ 'data-novel-append': true }).length, 0)
  } finally { await act(async () => view?.unmount()); dom.window.close() }
})
