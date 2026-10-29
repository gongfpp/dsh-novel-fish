import test from 'node:test'
import assert from 'node:assert/strict'
import React from 'react'
import TestRenderer, { act } from 'react-test-renderer'
import { createSettingsRow } from '../src/settings.js'
import { DEFAULT_SETTINGS } from '../src/store.js'
import { HostSwitch, HostMenu, HostModal, hostPrimitives } from './helpers/host-primitives.js'
import zh from '../locale/zh.json' with { type: 'json' }
import en from '../locale/en.json' with { type: 'json' }

const t = (key, vars = {}) => key.split('.').reduce((value, field) => value?.[field], zh)?.replace(/\{(\w+)\}/gu, (_, key) => String(vars[key])) ?? key
const SettingsRow = createSettingsRow(React, hostPrimitives)
const control = (view, key, value = true) => view.root.find(node => typeof node.type === 'string' && node.props[key] === value)
const menu = (view, key, value = true) => view.root.findAllByType(HostMenu).find(node => node.props.anchor.props[key] === value)

function setup(settings = {}) {
  const state = { hydrated: true, books: [{ id: 'book-a', title: '测试书籍', format: 'txt', progress: 1, segmentCount: 3 }], settings: { ...DEFAULT_SETTINGS, currentBookId: 'book-a', ...settings } }
  const options = [], books = [], notices = []
  const props = { t,
    useNovelState: select => select(state), useNovelUi: select => select({ notice: null }),
    onSetOption: async (key, value) => { options.push([key, value]); state.settings[key] = value },
    onSelectBook: async id => { books.push(id); state.settings.currentBookId = id },
    onSetNotice: notice => notices.push(notice), onDeleteBook: async () => {}, onImportFile: async () => {},
  }
  return { props, state, options, books, notices }
}

async function mount(model, options) {
  let view
  await act(async () => { view = TestRenderer.create(React.createElement(SettingsRow, model.props), options) })
  return view
}

test('区域多选使用宿主 Menu，保留五类、全选和空选语义，不创建阅读入口', async () => {
  const model = setup(), view = await mount(model)
  try {
    const picker = () => menu(view, 'data-novel-type-select')
    assert.deepEqual(picker().props.items.map(item => item.id), ['reasoning', 'tool-call', 'read-file', 'command', 'file-search'])
    assert.deepEqual(picker().props.selectedIds, ['reasoning'])
    await act(async () => picker().props.anchor.props.onClick())
    assert.equal(picker().props.open, true)
    await act(async () => picker().props.onSelect('read-file'))
    assert.deepEqual(model.options.at(-1), ['targetTypes', ['reasoning', 'read-file']])
    assert.equal(picker().props.open, true)
    await act(async () => picker().props.onSelect('__all'))
    assert.deepEqual(model.options.at(-1), ['targetTypes', ['reasoning', 'tool-call', 'read-file', 'command', 'file-search']])
    await act(async () => picker().props.onSelect('__all'))
    assert.deepEqual(model.options.at(-1), ['targetTypes', []])
    assert.equal(view.root.findAllByType('select').length, 0)
    assert.equal(view.root.findAllByType('details').length, 0)
    assert.equal(view.root.findAllByType('textarea').length, 0)
    assert.equal(view.root.findAllByType('h3').length, 3)
    assert.doesNotMatch(JSON.stringify(view.toJSON()), /选择一个真实思考步骤|刷新步骤列表|阅读位置|粘贴文本|会话 session-/u)
    assert.equal(control(view, 'data-novel-progress').children.join(''), t('settings.progressValue', { progress: 1, total: 3, percent: 33 }))
    await act(async () => menu(view, 'data-novel-book-select').props.onSelect('book-a'))
    assert.deepEqual(model.books, ['book-a'])
  } finally { await act(async () => view.unmount()) }
})

test('多选存储未完成时快速重复选择只写一次，书籍进度不受影响', async () => {
  const model = setup()
  let release
  const saving = new Promise(resolve => { release = resolve })
  model.props.onSetOption = async (...values) => { model.options.push(values); await saving }
  const view = await mount(model)
  try {
    const select = menu(view, 'data-novel-type-select').props.onSelect
    await act(async () => { select('read-file'); select('command') })
    assert.deepEqual(model.options, [['targetTypes', ['reasoning', 'read-file']]])
    assert.equal(menu(view, 'data-novel-type-select').props.items.every(item => item.disabled), true)
    await act(async () => release())
    assert.equal(menu(view, 'data-novel-type-select').props.items.some(item => item.disabled), false)
    assert.equal(model.state.books[0].progress, 1)
  } finally { release(); await act(async () => view.unmount()) }
})

test('图标跟随 DSH，标题使用原生菜单，自定义后才出现宿主 Input', async () => {
  const model = setup(), view = await mount(model)
  try {
    assert.equal(view.root.findAllByType('input').filter(node => node.props.type !== 'file').length, 0)
    assert.equal(view.root.findAllByProps({ 'data-novel-preset': 'icon' }).length, 0)
    assert.match(JSON.stringify(view.toJSON()), /图标与折叠交互跟随 DSH/u)
    assert.deepEqual(model.options, [])
    await act(async () => menu(view, 'data-novel-preset', 'title').props.onSelect('__custom'))
    await act(async () => control(view, 'data-novel-title').props.onChange({ currentTarget: { value: '我的标题' } }))
    assert.deepEqual(model.options.at(-1), ['mainTitle', '我的标题'])
  } finally { await act(async () => view.unmount()) }
})

test('已保存的自定义内容保留，打开设置不会写入选项', async () => {
  const model = setup({ mainTitle: '已存标题' }), view = await mount(model)
  try {
    assert.equal(control(view, 'data-novel-title').props.defaultValue, '已存标题')
    assert.deepEqual(model.options, [])
  } finally { await act(async () => view.unmount()) }
})

test('宿主 Input 不受异步落盘旧快照控制，连续输入不会被 React 回退', async () => {
  const model = setup({ mainTitle: '已存标题' })
  let release
  const saving = new Promise(resolve => { release = resolve })
  model.props.onSetOption = async () => saving
  const view = await mount(model)
  try {
    const input = control(view, 'data-novel-title')
    await act(async () => { input.props.onChange({ currentTarget: { value: '已存标题连续输入' } }) })
    assert.equal(Object.hasOwn(input.props, 'value'), false)
    assert.equal(input.props.defaultValue, '已存标题')
    await act(async () => release())
  } finally { release(); await act(async () => view.unmount()) }
})

test('预设保存失败保留自定义模式，菜单的选中项仍然有效', async () => {
  const model = setup({ mainTitle: '已存标题' })
  let reject
  const saving = new Promise((resolve, fail) => { reject = fail })
  model.props.onSetOption = async () => saving
  const view = await mount(model)
  try {
    await act(async () => menu(view, 'data-novel-preset', 'title').props.onSelect('思考'))
    assert.equal(menu(view, 'data-novel-preset', 'title').props.selectedId, '__custom')
    await act(async () => reject(new Error('模拟保存失败')))
    const picker = menu(view, 'data-novel-preset', 'title')
    assert.equal(picker.props.selectedId, '__custom')
    assert.ok(picker.props.items.some(item => item.id === picker.props.selectedId))
    assert.equal(control(view, 'data-novel-title').props.defaultValue, '已存标题')
    assert.match(model.notices.at(-1), /模拟保存失败/u)
  } finally { await act(async () => view.unmount()) }
})

test('原生导入按钮触发隐藏文件选择；导入失败清空文件值并允许重试', async () => {
  const model = setup()
  let clicked = 0, attempts = 0, reject
  const importing = new Promise((resolve, fail) => { reject = fail })
  model.props.onImportFile = async () => { attempts++; return importing }
  const view = await mount(model, { createNodeMock: element => element.props['data-novel-file-input'] ? { click: () => { clicked++ } } : null })
  try {
    const button = () => control(view, 'data-novel-import')
    await act(async () => button().props.onClick())
    assert.equal(clicked, 1)
    const input = control(view, 'data-novel-file-input')
    assert.equal(input.props.hidden, true)
    const file = { files: [{ name: '示例.md' }], value: '示例.md' }
    await act(async () => { input.props.onChange({ currentTarget: file }); input.props.onChange({ currentTarget: file }) })
    assert.equal(attempts, 1)
    assert.equal(button().props.disabled, true)
    await act(async () => reject(new Error('模拟导入失败')))
    assert.equal(file.value, '')
    assert.equal(button().props.disabled, false)
    assert.match(model.notices.at(-1), /模拟导入失败/u)
    model.props.onImportFile = async () => { attempts++; return { segmentCount: 2 } }
    await act(async () => view.update(React.createElement(SettingsRow, { ...model.props })))
    await act(async () => control(view, 'data-novel-file-input').props.onChange({ currentTarget: file }))
    assert.equal(attempts, 2)
    assert.match(model.notices.at(-1), /导入完成：2 段/u)
    assert.equal(model.state.books[0].progress, 1)
  } finally { await act(async () => view.unmount()) }
})

test('删除使用宿主 Modal；取消不删除、保存失败可重试、快速确认不重复删除', async () => {
  const model = setup(), deleted = []
  let reject
  const removing = new Promise((resolve, fail) => { reject = fail })
  model.props.onDeleteBook = async id => { deleted.push(id); return removing }
  const view = await mount(model)
  try {
    await act(async () => control(view, 'data-novel-delete').props.onClick())
    assert.equal(view.root.findByType(HostModal).props.open, true)
    assert.match(view.root.findByType(HostModal).props.description, /测试书籍/u)
    await act(async () => view.root.findByType(HostModal).props.onClose())
    assert.equal(view.root.findByType(HostModal).props.open, false)
    assert.deepEqual(deleted, [])
    await act(async () => control(view, 'data-novel-delete').props.onClick())
    const confirm = control(view, 'data-novel-delete-confirm').props.onClick
    await act(async () => { confirm(); confirm() })
    assert.deepEqual(deleted, ['book-a'])
    await act(async () => view.root.findByType(HostModal).props.onClose())
    assert.equal(view.root.findByType(HostModal).props.open, true)
    await act(async () => reject(new Error('模拟删除失败')))
    assert.match(view.root.findByProps({ role: 'alert' }).children.join(''), /模拟删除失败/u)
    assert.equal(model.state.books[0].progress, 1)
    model.props.onDeleteBook = async id => deleted.push(id)
    await act(async () => view.update(React.createElement(SettingsRow, { ...model.props })))
    await act(async () => control(view, 'data-novel-delete-confirm').props.onClick())
    assert.deepEqual(deleted, ['book-a', 'book-a'])
    assert.equal(view.root.findByType(HostModal).props.open, false)
  } finally { await act(async () => view.unmount()) }
})

test('原生阅读开关保存时禁用并合并快速点击，不影响书籍进度', async () => {
  const model = setup({ enabled: false })
  let release, view
  const saving = new Promise(resolve => { release = resolve })
  model.props.onSetOption = async (key, value) => {
    model.options.push([key, value]); await saving
    model.state.settings[key] = value
    view.update(React.createElement(SettingsRow, { ...model.props }))
  }
  view = await mount(model)
  try {
    const toggle = () => view.root.findByProps({ role: 'switch' })
    assert.equal(toggle().props['aria-label'], zh.settings.enabled)
    assert.equal(toggle().props['aria-checked'], false)
    const change = view.root.findByType(HostSwitch).props.onChange
    await act(async () => { change(true); change(true) })
    assert.deepEqual(model.options, [['enabled', true]])
    assert.equal(toggle().props.disabled, true)
    assert.equal(toggle().props['aria-checked'], false)
    await act(async () => release())
    assert.equal(toggle().props.disabled, false)
    assert.equal(toggle().props['aria-checked'], true)
    assert.equal(model.state.books[0].progress, 1)
    assert.equal(model.state.settings.currentBookId, 'book-a')
    assert.deepEqual(model.state.settings.targetTypes, DEFAULT_SETTINGS.targetTypes)
  } finally { release(); await act(async () => view.unmount()) }
})

test('阅读开关保存失败不假装开启，报错后可以重试', async () => {
  const model = setup({ enabled: false })
  model.props.onSetOption = async () => { throw new Error('模拟存储失败') }
  const view = await mount(model)
  try {
    await act(async () => view.root.findByProps({ role: 'switch' }).props.onClick())
    const toggle = view.root.findByProps({ role: 'switch' })
    assert.equal(toggle.props.disabled, false)
    assert.equal(toggle.props['aria-checked'], false)
    assert.match(model.notices.at(-1), /操作失败.*模拟存储失败/u)
    model.props.onSetOption = async (...values) => model.options.push(values)
    await act(async () => view.update(React.createElement(SettingsRow, { ...model.props })))
    await act(async () => view.root.findByProps({ role: 'switch' }).props.onClick())
    assert.deepEqual(model.options, [['enabled', true]])
  } finally { await act(async () => view.unmount()) }
})

test('书库未就绪或出错时原生控件禁用，不写设置', async () => {
  for (const state of [{ hydrated: false }, { error: '模拟书库错误' }]) {
    const model = setup({ enabled: false })
    Object.assign(model.state, state)
    const view = await mount(model)
    try {
      const toggle = view.root.findByProps({ role: 'switch' })
      assert.equal(toggle.props.disabled, true)
      assert.equal(control(view, 'data-novel-import').props.disabled, true)
      assert.equal(menu(view, 'data-novel-type-select').props.items.every(item => item.disabled), true)
      await act(async () => toggle.props.onClick())
      assert.deepEqual(model.options, [])
    } finally { await act(async () => view.unmount()) }
  }
})

test('中英文设置文案键一致，不再含位置选择翻译', () => {
  assert.deepEqual(Object.keys(zh.settings).sort(), Object.keys(en.settings).sort())
  for (const key of ['targetType', 'typeReasoning', 'typeHint', 'importBook', 'cancel', 'confirmDelete']) {
    assert.equal(typeof zh.settings[key], 'string')
    assert.equal(typeof en.settings[key], 'string')
  }
  assert.equal(Object.hasOwn(zh.settings, 'targetKey'), false)
})
