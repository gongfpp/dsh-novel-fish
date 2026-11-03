#!/usr/bin/env node
// Read-only, offline probe of an installed DSH build. No server or user profile.
// Usage: node scripts/check-host-contracts.mjs /absolute/path/to/@deepseek-ai/dsh
import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'
import { isAbsolute, join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'
import { build } from 'esbuild'
import { JSDOM, VirtualConsole } from 'jsdom'
import { IDBFactory, IDBKeyRange } from 'fake-indexeddb'

const project = fileURLToPath(new URL('../', import.meta.url))
const host = process.argv[2] ?? process.env.HOST_ROOT
const report = { hostVersion: null, checks: [], claims: null,
  claimsMeaning: 'Observed book progress after an untrusted click, not claimPassage invocation count.', limitations: [
  'JSDOM, not a browser: no layout, animation, focus or trusted-user-event proof.',
  'Private host exports are exposed only in memory; host boot/apply and full UI renderer are not started.',
  'Identity ancestors and plugin-manager slot declaration are checked statically; small mounting/context facades are supplied by this probe.',
  'Tool/Bash rows and the plugin-manager page are statically checked, not rendered; settings menus/modal are closed.',
  'Plugin is built in memory from current src/client.js; lib/client.js freshness is not checked.',
  'Only the supplied installation is tested; this is not proof for other or future versions.',
] }
const check = (name, detail) => report.checks.push({ name, detail })
const read = path => readFile(path, 'utf8')
let dom
try {
  assert.ok(host && isAbsolute(host), 'Pass an absolute DSH installation path (or HOST_ROOT).')
  report.hostVersion = JSON.parse(await read(join(host, 'package.json'))).version
  const packageDir = name => join(host, 'node_modules/@deepseek-ai', `dsh-${name}`)
  const client = name => read(join(packageDir(name), 'lib/client.js'))
  const [chat, tool, conversation, manager] = await Promise.all([
    client('client-ui-chat'), client('client-ui-tool'), client('client-ui-conversation'), client('client-ui-plugin-manager'),
  ])
  for (const [source, markers] of [[chat, ['data-chat-node-key', 'data-chat-flow-kind']],
    [tool, ['data-chat-call-id', 'data-tool', 'data-variant', 'data-sample']], [conversation, ['data-conversation-session']]]) {
    for (const marker of markers) assert.ok(source.includes(`"${marker}"`), `Missing host DOM marker: ${marker}`)
  }
  const config = manager.match(/"plugins\.bundle\.config":\s*\{\s*kind:\s*"(\w+)",\s*scope:\s*"(\w+)"/)
  assert.ok(config, 'Missing plugins.bundle.config declaration')
  assert.equal(config[1], 'keyed')
  assert.match(manager, /renderSlot\("plugins\.bundle\.config",\s*\{\s*view:\s*"page"\s*\},\s*\{\s*entryKey:\s*pkg\.name/)
  check('static host markers and bundle-config seat', 'chat/tool/conversation markers; keyed config rendered by package name with view=page')

  // Built-in modules live in the shipped web shell, not separate npm packages.
  const assets = join(packageDir('web-frontend'), 'dist/assets')
  const candidates = (await readdir(assets)).filter(name => /^index-.*\.js$/.test(name))
  let entry, frontend, registry
  for (const candidate of candidates) {
    const source = await read(join(assets, candidate))
    const match = source.match(/function\s+([\w$]+)\(\)\s*\{\s*return\s*\{\s*react:/)
    if (match && source.includes('"@deepseek-ai/dsh-client-ui-primitives"')) {
      entry = join(assets, candidate); frontend = source; registry = match[1]; break
    }
  }
  assert.ok(registry, 'Cannot locate the shipped web static-module registry; probe needs an update')
  // Disable only the final application boot block, never component/module code.
  const boot = /try\s*\{\s*const\s+[\w$]+\s*=\s*document\.getElementById\("root"\)/
  assert.ok(boot.test(frontend), 'Cannot isolate web application boot; refusing to execute shell')
  frontend = frontend.replace(boot, match => `if (false) ${match}`)
  const errors = []
  const virtualConsole = new VirtualConsole()
  virtualConsole.on('jsdomError', error => errors.push(error.message))
  dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', {
    url: 'http://host-contract.invalid/', runScripts: 'outside-only', pretendToBeVisual: true, virtualConsole,
  })
  Object.assign(dom.window, {
    TextEncoder, TextDecoder, indexedDB: new IDBFactory(), IDBKeyRange,
    fetch: () => { throw new Error('Network is forbidden in host-contract probe') },
    console: { ...console, error: error => { if (error?.message !== 'web app: missing #root') errors.push(String(error)) } },
  })
  const bundled = await build({ stdin: {
    contents: `${frontend}\nglobalThis.__hostContracts = ${registry}();`, resolveDir: dirname(entry), sourcefile: entry,
  }, bundle: true, write: false, format: 'iife', logLevel: 'silent' })
  vm.runInContext(bundled.outputFiles[0].text, dom.getInternalVMContext(), { filename: entry, timeout: 15000 })
  const modules = dom.window.__hostContracts
  const React = modules.react, h = React.createElement
  const primitives = modules['@deepseek-ai/dsh-client-ui-primitives']
  for (const name of ['DisclosureRow', 'TextShimmer', 'Switch', 'Button', 'Input', 'Menu', 'Modal', 'IconChevronDownOutlineRegular']) {
    assert.ok(primitives[name], `Missing real primitive ${name}`)
  }
  const core = new modules['@deepseek-ai/dsh-client-ui-slots'].SlotCore()
  const disposers = [], waiting = new Map()
  const register = (options, component) => {
    const off = core.register(options, component)
    disposers.push(off)
    for (const [name, callback] of waiting) if (core.spec(name)) { waiting.delete(name); callback() }
    return off
  }
  const ctx = {
    slots: { register, registerFactory: (...args) => { const off = core.registerFactory(...args); disposers.push(off); return off },
      inject: (name, callback) => core.spec(name) ? callback() : waiting.set(name, callback) },
    effect: callback => { const off = callback(); if (typeof off === 'function') disposers.push(off) },
    locale: { register: () => () => {}, bind: () => key => key },
  }
  // These two outer seats belong to much larger application trees. Their declarations
  // are checked in the original builds; all subsequent registrations use real SlotCore.
  assert.match(chat, /"conversation\.chat\.node":\s*\{\s*kind:\s*"keyed",\s*scope:\s*"session"/)
  register({ name: 'root', children: {
    'conversation.chat.node': { kind: 'keyed', scope: 'session' },
    'plugins.bundle.config': { kind: config[1], scope: config[2] },
  } }, () => null)
  const capture = (source, filename, expose = '') => {
    let definition
    dom.window.__ModuleLoader__ = { load: value => { definition = value } }
    if (expose) {
      assert.equal(source.split('return module.exports;').length, 2, 'Unknown host factory return shape')
      source = source.replace('return module.exports;', `module.exports.__probe = { ${expose} }; return module.exports;`)
    }
    vm.runInContext(source, dom.getInternalVMContext(), { filename, timeout: 10000 })
    assert.ok(definition?.factory, `No module factory captured from ${filename}`)
    const require = name => {
      assert.ok(modules[name], `Unexpected host import: ${name}`)
      return modules[name]
    }
    require.asset = path => `http://host-contract.invalid/assets/${path}` // CSS only; never fetched
    return definition.factory(require)
  }
  const hostChat = capture(chat, 'host-chat-client.js', 'registerChatNodeRenderers, ReasoningRow')
  hostChat.__probe.registerChatNodeRenderers(ctx, {}, {})
  assert.equal(core.spec('conversation.chat.reasoning.body')?.kind, 'single')
  assert.ok(core.factory('conversation.chat.reasoning.content'))
  const originalBody = core.entriesOfSlot('conversation.chat.reasoning.body')[0]
  const plugin = await build({ entryPoints: [join(project, 'src/client.js')], bundle: true, write: false,
    format: 'iife', logLevel: 'silent' })
  capture(plugin.outputFiles[0].text, 'novel-client-source.js').apply(ctx)
  const body = core.entriesOfSlot('conversation.chat.reasoning.body')[0]
  assert.notEqual(body, originalBody, 'Plugin body must shadow, not replace/delete, host body')
  assert.ok(core.entries('conversation.chat.reasoning.body').includes(originalBody))
  const settings = core.entriesOfSlot('plugins.bundle.config').find(entry => entry.options.key === '@gongfpp/dsh-novel-fish')
  assert.ok(settings)
  check('real SlotCore registrations', 'host registerChatNodeRenderers + plugin apply; body priority shadowing, content Factory and package-keyed settings')

  const injected = settings.inject()
  const state = injected.hooks.novelState
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => { off(); reject(new Error('IndexedDB hydration timed out')) }, 3000)
    const ready = () => { if (state.getSnapshot().hydrated) { clearTimeout(timer); off(); resolve() } }
    const off = state.subscribe(ready); ready()
  })
  assert.equal(state.getSnapshot().error, null)
  await injected.onSetOption('mainTitle', 'Contract title')
  await injected.onSetOption('extraTitle', 'Contract summary')
  await injected.onSetOption('enabled', false)
  const book = await injected.onImportFile({ name: 'contract.txt', arrayBuffer: async () => new TextEncoder().encode('Contract novel passage.').buffer })
  await injected.onSelectBook(book.id)
  const hooks = sources => Object.fromEntries(Object.entries(sources).map(([key, source]) => [
    modules['@deepseek-ai/dsh-client-ui-slots'].standardHookPropName(key),
    select => select(React.useSyncExternalStore(source.subscribe, source.getSnapshot)),
  ]))
  const t = key => key
  const slotCalls = []
  const renderFactorySlot = (name, props) => {
    slotCalls.push({ name, ...props })
    const factory = core.factory(name)
    assert.ok(factory, `Unknown Factory ${name}`)
    return h(factory.component, { ...props, t })
  }
  function ReasoningProbe() {
    const [expanded, setExpanded] = React.useState(false)
    return h(hostChat.__probe.ReasoningRow, {
      text: 'Native summary\n\nNative reasoning', running: true, t,
      usePresentation: select => select({ settledReasoningPreview: true }),
      useDisclosure: () => ({ expanded, toggle: () => setExpanded(value => !value) }),
      renderSlot: (name, props) => {
        assert.equal(name, 'conversation.chat.reasoning.body')
        const values = body.inject()
        return h(body.component, { ...props, sessionId: 'probe-session', ...hooks(values.hooks), renderFactorySlot, t })
      },
    })
  }
  const mount = dom.window.document.createElement('main')
  dom.window.document.body.append(mount)
  const root = modules['react-dom/client'].createRoot(mount)
  const flush = callback => modules['react-dom'].flushSync(callback)
  const render = () => flush(() => root.render(h(React.Fragment, null,
    h('div', { 'data-conversation-session': 'probe-session' },
      h('div', { 'data-chat-flow-kind': 'assistant-step', 'data-chat-node-key': 'probe-node' }, h(ReasoningProbe))),
    h(settings.component, { ...injected, ...hooks(injected.hooks), t, view: 'page' }),
  )))
  render()
  await new Promise(resolve => setTimeout(resolve, 25))
  const header = mount.querySelector('[data-disclosure-row]')
  assert.ok(header)
  assert.equal(header.getAttribute('role'), 'button')
  assert.equal(header.getAttribute('aria-expanded'), 'false')
  const nativeNodes = [...header.querySelectorAll('*')]
  const glyphs = [...header.querySelectorAll('svg')]
  const nativeGlyphs = glyphs.map(node => node.outerHTML)
  assert.ok(glyphs.length > 0)
  await injected.onSetOption('enabled', true)
  await new Promise(resolve => setTimeout(resolve, 25))
  assert.deepEqual([...header.querySelectorAll('*')], nativeNodes, 'Adapter must preserve native elements')
  assert.deepEqual(glyphs.map(node => node.outerHTML), nativeGlyphs, 'Adapter must not change native SVGs')
  assert.ok(header.textContent.includes('Contract title'))
  assert.ok(header.textContent.includes('Contract summary'))
  assert.deepEqual([...header.querySelectorAll('[data-shimmer-text]')].map(el => el.getAttribute('data-shimmer-text')), ['Contract title', 'Contract summary'])
  assert.equal(mount.querySelectorAll('[data-novel-append]').length, 0)
  check('real ReasoningRow / DisclosureRow / TextShimmer', 'plugin changes both native text and shimmer layers on actual shipped components; native SVGs remain')
  // This event is intentionally untrusted: it opens React's host row but must never claim a passage.
  flush(() => header.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true })))
  await new Promise(resolve => setTimeout(resolve, 25))
  assert.equal(header.getAttribute('aria-expanded'), 'true')
  assert.ok(slotCalls.some(call => call.name === 'conversation.chat.reasoning.content' && call.text === 'Native summary\n\nNative reasoning' && call.running === true))
  assert.ok(mount.querySelector('[data-novel-original]').textContent.includes('Native reasoning'))
  report.claims = state.getSnapshot().books.find(item => item.id === book.id).progress
  assert.equal(report.claims, 0, 'Untrusted DOM click must not advance book progress')
  check('untrusted-event guard', 'actual host click expands the row but imported in-memory book progress stays at zero; no trusted input is simulated')
  assert.ok(mount.querySelector('[data-novel-settings] button'))
  assert.ok(mount.querySelector('[data-novel-settings] input[type="file"]'))
  check('real body Factory props and settings primitives', 'host row passes text/running; plugin calls actual MarkdownText Factory; settings mounts with real controls and memory IndexedDB')
  await injected.onSetOption('enabled', false)
  await new Promise(resolve => setTimeout(resolve, 25))
  assert.ok(header.textContent.includes('message.think'), 'Disabling must restore native title')
  assert.equal(mount.querySelector('[data-novel-target]'), null)
  check('restore on disable', 'native title restored and adapter target marker removed')
  // The adapter keeps the native row and only rewrites its text, so it depends on the
  // shipped title layers, disclosure row and folding anchors staying put.
  const anchors = {
    chat: { source: chat, markers: ['data-chat-flow-key', 'data-turn-process-member', 'data-turn-process-hidden', 'data-shimmer-decoration'] },
    conversation: { source: conversation, markers: ['data-conversation-session'] },
    shell: { source: frontend, markers: ['data-shimmer-text', 'data-disclosure-row'] },
  }
  for (const [name, { source, markers }] of Object.entries(anchors)) {
    for (const marker of markers) assert.ok(source.includes(`"${marker}"`), `Missing ${name} adapter anchor: ${marker}`)
  }
  check('adapter anchors for title layers and fold state', 'shimmer text/decoration, disclosure row, session identity and turn-process fold markers still ship; ambient DOM rescan has a contract to rescan')
  flush(() => root.unmount())
  for (const dispose of disposers.reverse()) dispose()
  assert.deepEqual(errors, [], 'Unexpected host/JSDOM runtime errors')
  report.ok = true
} catch (error) {
  report.ok = false
  report.error = error.stack ?? String(error)
  process.exitCode = 1
} finally {
  dom?.window.close()
  console.log(JSON.stringify(report, null, 2))
}
