import test from 'node:test'
import assert from 'node:assert/strict'
import React from 'react'
import TestRenderer, { act } from 'react-test-renderer'
import { JSDOM } from 'jsdom'
import { createSettingsRow } from '../src/settings.js'
import { listTargets } from '../src/chat-adapter.js'
import { DEFAULT_SETTINGS } from '../src/store.js'
import zh from '../locale/zh.json' with { type: 'json' }

const t = (key, vars = {}) => key.split('.').reduce((value, field) => value?.[field], zh)?.replace(/\{(\w+)\}/gu, (_, key) => String(vars[key])) ?? key
const target = { sessionId: 'session-a', nodeKey: '14:assistant-step1:2', turn: 1, step: 2 }

function setup(settings = {}) {
  const state = { hydrated: true, books: [{id:'book-a',title:'测试书籍',format:'txt',progress:1,segmentCount:3}], settings:{...DEFAULT_SETTINGS,currentBookId:'book-a',...settings} }
  const added = [], options = [], books = []
  let listed = 0
  const props = { t,
    useNovelState: select => select(state), useNovelUi: select => select({ notice:null }),
    onListTargets: () => { listed++; return [target] }, onAddTarget: async target => added.push(target),
    onSetOption: async (...input) => options.push(input), onSelectBook: async id => books.push(id),
    onSetNotice: () => {}, onRemoveTarget: async () => {}, onDeleteBook: async () => {}, onImportFile: async () => {},
  }
  return { props, state, added, options, books, getListed: () => listed }
}

test('设置内直接下拉选择真实步骤，不需要关闭弹窗或进入点选模式', async () => {
  const model = setup()
  let view
  await act(async () => { view = TestRenderer.create(React.createElement(createSettingsRow(React), model.props)) })
  try {
    const dropdown = view.root.findByProps({'data-novel-target-select':true})
    assert.equal(dropdown.props.disabled, false)
    assert.equal(dropdown.findAllByType('option').length, 2)
    await act(async () => dropdown.props.onChange({currentTarget:{value:JSON.stringify(['session-a',target.nodeKey])}}))
    assert.deepEqual(model.added, [target])
    assert.equal(model.getListed(), 1)
    assert.doesNotMatch(JSON.stringify(view.toJSON()), /粘贴文本|完成选择|onSetPicking/u)
    assert.equal(view.root.findAllByType('textarea').length, 0)
    assert.equal(view.root.findByProps({'data-novel-progress':true}).children.join(''), '已读 1 / 3 段（33%）· 自动记忆进度')
    const book = view.root.findByProps({'data-novel-book-select':true})
    await act(async () => book.props.onChange({currentTarget:{value:'book-a'}}))
    assert.deepEqual(model.books, ['book-a'])
  } finally { await act(async () => view.unmount()) }
})

test('图标和标题默认都是下拉，只有明确选择自定义才出现文本框', async () => {
  const model = setup()
  let view
  await act(async () => { view = TestRenderer.create(React.createElement(createSettingsRow(React), model.props)) })
  try {
    assert.equal(view.root.findAllByType('input').filter(node => !['checkbox','file'].includes(node.props.type)).length, 0)
    const icon = view.root.findByProps({'data-novel-preset':'icon'})
    await act(async () => icon.props.onChange({currentTarget:{value:'🔎'}}))
    assert.deepEqual(model.options, [['icon','🔎']])
    const title = view.root.findByProps({'data-novel-preset':'title'})
    await act(async () => title.props.onChange({currentTarget:{value:'__custom'}}))
    const custom = view.root.findByProps({'data-novel-title':true})
    await act(async () => custom.props.onChange({currentTarget:{value:'我的标题'}}))
    assert.deepEqual(model.options.at(-1), ['mainTitle','我的标题'])
  } finally { await act(async () => view.unmount()) }
})

test('已保存的自定义内容保留，已添加步骤禁选，刷新列表不添加或阅读', async () => {
  const model = setup({mainTitle:'已存标题',targets:[target]})
  let view
  await act(async () => { view = TestRenderer.create(React.createElement(createSettingsRow(React), model.props)) })
  try {
    assert.equal(view.root.findByProps({'data-novel-title':true}).props.defaultValue, '已存标题')
    const select = view.root.findByProps({'data-novel-target-select':true})
    assert.equal(select.findAllByType('option')[1].props.disabled, true)
    const refresh = view.root.findAllByType('button').find(node => node.children.join('') === '刷新步骤列表')
    await act(async () => refresh.props.onClick())
    assert.equal(model.getListed(), 2)
    assert.deepEqual(model.added, [])
    assert.deepEqual(model.options, [])
  } finally { await act(async () => view.unmount()) }
})

test('目标列表仅列出真实思考行，按会话和节点去重，不读取正文或工具日志', () => {
  const thought = '<div data-variant="think"><div data-disclosure-row>原生思考</div></div>'
  const dom = new JSDOM(`<div data-conversation-session="s"><div data-chat-flow-kind="assistant-step" data-chat-node-key="14:assistant-step2:3">${thought}${thought}</div><div data-chat-flow-kind="tool-call">${thought}</div></div>`)
  try {
    assert.deepEqual(listTargets(dom.window.document), [{sessionId:'s',nodeKey:'14:assistant-step2:3',turn:2,step:3}])
  } finally { dom.window.close() }
})

test('自定义输入不受异步落盘旧快照控制，连续输入不会被 React 回退', async () => {
  const model = setup({mainTitle:'已存标题'})
  let release
  const saving = new Promise(resolve => { release = resolve })
  model.props.onSetOption = async () => saving
  let view
  await act(async () => { view = TestRenderer.create(React.createElement(createSettingsRow(React), model.props)) })
  try {
    const input = view.root.findByProps({'data-novel-title':true})
    await act(async () => { void input.props.onChange({currentTarget:{value:'已存标题连续输入'}}) })
    assert.equal(Object.hasOwn(input.props, 'value'), false)
    assert.equal(input.props.defaultValue, '已存标题')
    await act(async () => { release() })
  } finally { release(); await act(async () => view.unmount()) }
})

test('预设保存失败仍保留自定义模式，下拉值始终对应有效选项', async () => {
  const model = setup({mainTitle:'已存标题'})
  const notices = []
  let reject
  const saving = new Promise((resolve, fail) => { reject = fail })
  model.props.onSetOption = async () => saving
  model.props.onSetNotice = value => notices.push(value)
  let view
  await act(async () => { view = TestRenderer.create(React.createElement(createSettingsRow(React), model.props)) })
  try {
    const select = view.root.findByProps({'data-novel-preset':'title'})
    await act(async () => { select.props.onChange({currentTarget:{value:'思考'}}) })
    assert.equal(select.props.value, '__custom')
    await act(async () => { reject(new Error('模拟保存失败')) })
    assert.equal(select.props.value, '__custom')
    assert.equal(view.root.findByProps({'data-novel-title':true}).props.defaultValue, '已存标题')
    assert.ok(select.findAllByType('option').some(option => option.props.value === select.props.value))
    assert.match(notices.at(-1), /模拟保存失败/u)
  } finally { await act(async () => view.unmount()) }
})
