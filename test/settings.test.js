import test from 'node:test'
import assert from 'node:assert/strict'
import React from 'react'
import TestRenderer, { act } from 'react-test-renderer'
import { createSettingsRow } from '../src/settings.js'
import { DEFAULT_SETTINGS } from '../src/store.js'
import zh from '../locale/zh.json' with { type: 'json' }
import en from '../locale/en.json' with { type: 'json' }

const t = (key, vars = {}) => key.split('.').reduce((value, field) => value?.[field], zh)?.replace(/\{(\w+)\}/gu, (_, key) => String(vars[key])) ?? key

function setup(settings = {}) {
  const state = { hydrated: true, books: [{id:'book-a',title:'测试书籍',format:'txt',progress:1,segmentCount:3}], settings:{...DEFAULT_SETTINGS,currentBookId:'book-a',...settings} }
  const options = [], books = []
  const props = { t,
    useNovelState: select => select(state), useNovelUi: select => select({ notice:null }),
    onSetOption: async (...input) => options.push(input), onSelectBook: async id => books.push(id),
    onSetNotice: () => {}, onDeleteBook: async () => {}, onImportFile: async () => {},
  }
  return { props, state, options, books }
}

test('设置选择的是原生区域类型，不依赖聊天 DOM 或选择具体轮次步骤', async () => {
  const model = setup()
  let view
  await act(async () => { view = TestRenderer.create(React.createElement(createSettingsRow(React), model.props)) })
  try {
    const dropdown = view.root.findByProps({'data-novel-type-select':true})
    assert.equal(dropdown.props.disabled, false)
    assert.equal(dropdown.props.value, 'reasoning')
    assert.deepEqual(dropdown.findAllByType('option').map(option => option.props.value), ['reasoning'])
    assert.equal(view.root.findAllByProps({'data-novel-target-select':true}).length, 0)
    await act(async () => dropdown.props.onChange({currentTarget:{value:'reasoning'}}))
    assert.deepEqual(model.options, [['targetType','reasoning']])
    assert.doesNotMatch(JSON.stringify(view.toJSON()), /选择一个真实思考步骤|刷新步骤列表|阅读位置|粘贴文本|会话 session-/u)
    assert.match(JSON.stringify(view.toJSON()), /保留真实思考.*末尾追加小说/u)
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

test('已保存的自定义内容保留，打开设置不会写入选项', async () => {
  const model = setup({mainTitle:'已存标题'})
  let view
  await act(async () => { view = TestRenderer.create(React.createElement(createSettingsRow(React), model.props)) })
  try {
    assert.equal(view.root.findByProps({'data-novel-title':true}).props.defaultValue, '已存标题')
    assert.deepEqual(model.options, [])
  } finally { await act(async () => view.unmount()) }
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

test('中英文设置类型文案都有对应值，不再含位置选择翻译', () => {
  assert.deepEqual(Object.keys(zh.settings).sort(), Object.keys(en.settings).sort())
  for (const key of ['targetType','typeReasoning','typeHint']) {
    assert.equal(typeof zh.settings[key], 'string')
    assert.equal(typeof en.settings[key], 'string')
  }
  assert.equal(Object.hasOwn(zh.settings, 'targetKey'), false)
})
