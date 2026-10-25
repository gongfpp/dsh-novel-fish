import { passageSnapshotKey } from './store.js'
import { NOVEL_STYLE, SEPARATOR_STYLE, novelContent } from './novel-content.js'

const THOUGHT = '[data-chat-flow-kind="assistant-step"] [data-variant="think"]'
const TOOL = '[data-chat-call-id] [data-tool], [data-chat-call-id] [data-sample="bash"]'
const REGIONS = `${THOUGHT}, ${TOOL}`
const EMPTY = Object.freeze({ kind: 'empty' })

/** DSH 0.2.1 窄适配：保留原生控件和正文，只改标题文字并追加本地纯文本。 */
export function registerChatAdapter(ctx, store, React, locale) {
  const t = ctx.locale?.bind(locale) ?? (key => key)
  ctx.slots.inject('conversation.chat.reasoning.body', () => ctx.slots.register({
    name: 'conversation.chat.reasoning.body', priority: -10, locale,
    inject: () => ({ hooks: { novelSettings: store.settingsSource, novelPassages: store.passageSource } }),
  }, createBody(React)))

  ctx.effect(() => {
    const decorated = new Map()
    const pending = new Map()
    const view = document.defaultView
    let disposed = false

    const restore = root => {
      const record = decorated.get(root)
      if (!record) return
      for (const [node, text] of record.texts) restoreText(node, text)
      record.append?.remove()
      root.removeAttribute('data-novel-target')
      decorated.delete(root)
    }
    const refresh = () => {
      const settings = store.getSettingsSnapshot()
      for (const [toggle, intent] of pending) {
        const id = identityOf(intent.root)
        if (!toggle.isConnected || !settings.enabled || settings.currentBookId !== intent.bookId
          || !isTarget(settings, id) || readingKey(id) !== intent.key || store.cacheGeneration !== intent.generation) {
          if (intent.frame !== null) view.cancelAnimationFrame(intent.frame)
          pending.delete(toggle)
        }
      }
      for (const root of decorated.keys()) {
        if (!root.isConnected || !settings.enabled || !isTarget(settings, identityOf(root))) restore(root)
      }
      for (const root of document.querySelectorAll(REGIONS)) {
        const id = identityOf(root)
        const header = headerOf(root)
        if (!header || !settings.enabled || !isTarget(settings, id)) continue
        let record = decorated.get(root)
        if (!record || record.header !== header) {
          restore(root)
          record = { header, texts: new Map(), append: null, signature: null }
          decorated.set(root, record)
          root.setAttribute('data-novel-target', '')
        }
        const desired = new Map()
        // 原生基础层和 shimmer 高亮层保持同一文字，不改变其样式、SVG或身份。
        const content = [...header.children].find(child => child.querySelector('[data-shimmer-decoration]'))
        const layers = [content?.firstElementChild, content?.querySelector('[inert]')?.firstElementChild?.firstElementChild]
        for (const layer of layers) {
          const title = layer?.firstElementChild
          if (!title) continue
          collectText(title, settings.mainTitle.trim(), desired)
          const separator = title.nextElementSibling
          if (separator?.hasAttribute('data-shimmer-decoration')) collectText(separator.nextElementSibling, settings.extraTitle.trim(), desired)
        }
        for (const [node, text] of record.texts) {
          if (!desired.has(node)) { restoreText(node, text); record.texts.delete(node) }
        }
        for (const [node, value] of desired) {
          const current = readText(node)
          const previous = record.texts.get(node)
          const native = previous && current === previous.shown ? previous.native : current
          record.texts.set(node, { native, shown: value })
          if (current !== value) writeText(node, value)
        }
        // 工具没有公开的“正文末尾”slot；只添加自己的兄弟节点，不接管工具 renderer。
        if (id.type !== 'reasoning') {
          const toggle = toggleOf(header)
          if (toggle?.getAttribute('aria-expanded') !== 'true') {
            record.append?.remove(); record.append = null; record.signature = null
            continue
          }
          const status = store.getPassageStatus(settings.currentBookId, readingKey(id))
          const model = novelContent(status, Boolean(settings.currentBookId), t)
          const signature = JSON.stringify(model)
          const container = root.matches('[data-sample="bash"]') ? root.parentElement : root
          if (!record.append || !container.contains(record.append)) {
            record.append = document.createElement('div')
            record.append.setAttribute('data-novel-append', '')
            container.append(record.append)
            record.signature = null
          }
          if (signature !== record.signature) {
            renderPlainAppend(record.append, model)
            record.signature = signature
          }
        }
      }
    }

    const activate = event => {
      if (!event.isTrusted || event.defaultPrevented) return
      if (event.type === 'keydown' && (event.repeat || !['Enter', ' '].includes(event.key))) return
      if (event.type === 'click' && event.button > 0) return
      const target = event.target instanceof Element ? event.target : event.target?.parentElement
      const header = target?.closest('[data-disclosure-row], [data-sample="bash"][aria-expanded]')
      const root = header?.matches('[data-sample="bash"]') ? header : header?.closest('[data-tool], [data-variant="think"]')
      if (!root?.matches(REGIONS)) return
      const toggle = toggleOf(header)
      if (!toggle || !toggle.contains(target) || toggle.getAttribute('aria-expanded') !== 'false') return
      const control = target.closest('button, [role="button"], a, input, select, textarea, [contenteditable="true"]')
      if (control && control !== toggle) return
      if (event.type === 'keydown' && target !== toggle) return
      const id = identityOf(root)
      const settings = store.getSettingsSnapshot()
      if (!settings.enabled || !isTarget(settings, id) || pending.has(toggle)) return
      const bookId = settings.currentBookId
      const intent = { frame: null, root, key: readingKey(id), bookId, generation: store.cacheGeneration }
      pending.set(toggle, intent)
      const verify = () => {
        if (pending.get(toggle) !== intent) return
        pending.delete(toggle)
        const current = store.getSettingsSnapshot()
        const currentId = identityOf(root)
        if (!disposed && toggle.isConnected && toggle.getAttribute('aria-expanded') === 'true'
          && current.enabled && current.currentBookId === bookId && isTarget(current, currentId)
          && store.cacheGeneration === intent.generation && readingKey(currentId) === intent.key) {
          void store.claimPassage(readingKey(id), id.type)
        }
      }
      if (view?.requestAnimationFrame) intent.frame = view.requestAnimationFrame(verify)
      else queueMicrotask(verify)
    }
    const observer = new MutationObserver(refresh)
    observer.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true,
      attributeFilter: ['data-shimmer-text', 'aria-expanded', 'data-tool', 'data-state'] })
    document.addEventListener('click', activate, true)
    document.addEventListener('keydown', activate, true)
    const stopSettings = store.subscribeSettings(refresh)
    const stopPassages = store.subscribePassages(refresh)
    refresh()
    return () => {
      disposed = true
      observer.disconnect(); stopSettings(); stopPassages()
      document.removeEventListener('click', activate, true)
      document.removeEventListener('keydown', activate, true)
      for (const intent of pending.values()) if (intent.frame !== null) view.cancelAnimationFrame(intent.frame)
      pending.clear()
      for (const root of decorated.keys()) restore(root)
    }
  }, 'novel-fish: native disclosure adapter')
}

function headerOf(root) {
  return root.matches('[data-sample="bash"]') ? root : root.querySelector('[data-disclosure-row]')
}
function toggleOf(header) {
  return header.matches('[role="button"][aria-expanded]') ? header : header.querySelector(':scope > button[aria-expanded]')
}
function collectText(element, value, desired) {
  if (!element || !value) return
  const walker = element.ownerDocument.createTreeWalker(element, 4)
  let first = true
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    desired.set(node, first ? value : ''); first = false
  }
  for (const node of [element, ...element.querySelectorAll('[data-shimmer-text]')]) {
    if (node.hasAttribute('data-shimmer-text')) desired.set(node, value)
  }
}
function readText(node) { return node.nodeType === 3 ? node.nodeValue : node.getAttribute('data-shimmer-text') }
function writeText(node, value) {
  if (node.nodeType === 3) node.nodeValue = value
  else node.setAttribute('data-shimmer-text', value)
}
function restoreText(node, text) { if (readText(node) === text.shown) writeText(node, text.native) }

function createBody(React) {
  const h = React.createElement
  return function NovelBody({ text, running, sessionId, useNovelSettings, useNovelPassages, renderFactorySlot, t }) {
    const ref = React.useRef(null)
    const [identity, setIdentity] = React.useState(null)
    const settings = useNovelSettings(value => value)
    React.useEffect(() => { setIdentity(identityOf(ref.current)) }, [sessionId])
    const selected = settings.enabled && isTarget(settings, identity)
    const key = settings.currentBookId && identity ? passageSnapshotKey(settings.currentBookId, readingKey(identity)) : null
    const status = useNovelPassages(snapshot => key ? snapshot[key] : undefined) ?? EMPTY
    const model = selected ? novelContent(status, Boolean(settings.currentBookId), t) : null
    return h('div', { ref },
      h('div', { 'data-novel-original': true }, renderFactorySlot('conversation.chat.reasoning.content', { text, running })),
      model === null ? null : h('div', { 'data-novel-append': true, style: NOVEL_STYLE },
        h('hr', { style: SEPARATOR_STYLE }),
        h('div', { 'data-novel-label': true }, model.chapter ? `${model.label} · ${model.chapter}` : model.label),
        h('div', { 'data-novel-passage': model.index, role: model.role }, model.text)),
    )
  }
}
function renderPlainAppend(element, model) {
  Object.assign(element.style, NOVEL_STYLE)
  const divider = document.createElement('hr')
  Object.assign(divider.style, SEPARATOR_STYLE)
  const label = document.createElement('div')
  label.setAttribute('data-novel-label', '')
  label.textContent = model.chapter ? `${model.label} · ${model.chapter}` : model.label
  const content = document.createElement('div')
  if (model.index) content.setAttribute('data-novel-passage', model.index)
  if (model.role) content.setAttribute('role', model.role)
  content.textContent = model.text
  element.replaceChildren(divider, label, content)
}
function identityOf(element) {
  const root = element?.closest('[data-variant="think"], [data-tool], [data-sample="bash"]')
  const node = root?.closest('[data-chat-node-key]')
  const container = node?.closest('[data-conversation-session]')
  if (!root || !node || !container) return null
  const sessionId = container.getAttribute('data-conversation-session')
  const nodeKey = node.getAttribute('data-chat-node-key')
  if (!sessionId || !nodeKey) return null
  if (root.matches(THOUGHT)) {
    const regions = [...node.querySelectorAll('[data-variant="think"]')].filter(region => region.closest('[data-chat-node-key]') === node)
    const index = regions.indexOf(root)
    return index < 0 ? null : { sessionId, nodeKey, type: 'reasoning', index }
  }
  const call = root.closest('[data-chat-call-id]')
  if (!call || !call.getAttribute('data-chat-call-id')) return null
  const variant = root.getAttribute('data-variant')
  const name = root.getAttribute('data-tool')
  const type = variant === 'bash' ? 'command' : ['read', 'read_image'].includes(name) ? 'read-file'
    : ['grep', 'glob'].includes(name) ? 'file-search' : 'tool-call'
  return { sessionId, nodeKey, type, index: call.getAttribute('data-chat-call-id') }
}
function readingKey(identity) { return JSON.stringify([identity.sessionId, identity.nodeKey, identity.type, identity.index]) }
function isTarget(settings, identity) { return identity !== null && settings.targetTypes?.includes(identity.type) }
