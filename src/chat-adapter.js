import { passageSnapshotKey } from './store.js'

const THOUGHT = '[data-chat-flow-kind="assistant-step"] [data-variant="think"]'
const EMPTY = Object.freeze({ kind: 'empty' })

/** DSH 0.2.1 窄适配：只改原生文字节点，不覆盖图标、箭头、按钮或样式。 */
export function registerChatAdapter(ctx, store, React, locale) {
  ctx.slots.inject('conversation.chat.reasoning.body', () => ctx.slots.register({
    name: 'conversation.chat.reasoning.body', priority: -10, locale,
    inject: () => ({
      hooks: { novelSettings: store.settingsSource, novelPassages: store.passageSource },
    }),
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
      root.removeAttribute('data-novel-target')
      decorated.delete(root)
    }
    const refresh = () => {
      const settings = store.getSettingsSnapshot()
      for (const root of decorated.keys()) {
        if (!root.isConnected || !settings.enabled || !isTarget(settings, identityOf(root))) restore(root)
      }
      for (const root of document.querySelectorAll(THOUGHT)) {
        const header = root.querySelector('[data-disclosure-row]')
        if (!header || !settings.enabled || !isTarget(settings, identityOf(root))) continue
        let record = decorated.get(root)
        if (!record || record.header !== header) {
          restore(root)
          record = { header, texts: new Map() }
          decorated.set(root, record)
          root.setAttribute('data-novel-target', '')
        }
        const desired = new Map()
        // The base and shimmer-highlight layers must receive the same text.
        // Leave their native classes, pseudo-elements, visibility and DOM identities intact.
        const content = header.children[1]
        const layers = [content?.firstElementChild, content?.querySelector('[inert]')?.firstElementChild?.firstElementChild]
        for (const layer of layers) {
          const title = layer?.firstElementChild
          if (!title) continue
          collectText(title, settings.mainTitle.trim(), desired)
          const separator = title.nextElementSibling
          if (separator?.hasAttribute('data-shimmer-decoration')) {
            collectText(separator.nextElementSibling, settings.extraTitle.trim(), desired)
          }
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
      }
    }

    const activate = event => {
      if (!event.isTrusted || event.defaultPrevented) return
      if (event.type === 'keydown' && (event.repeat || !['Enter', ' '].includes(event.key))) return
      if (event.type === 'click' && event.button > 0) return
      const target = event.target instanceof Element ? event.target : event.target?.parentElement
      const header = target?.closest('[data-disclosure-row]')
      const root = header?.closest('[data-variant="think"]')
      if (!root?.matches(THOUGHT)) return
      // Respect the host's two modes: whole-row toggle, or leading-button-only.
      const toggle = header.matches('[role="button"][aria-expanded]')
        ? header : header.querySelector(':scope > button[aria-expanded]')
      if (!toggle || !toggle.contains(target) || toggle.getAttribute('aria-expanded') !== 'false') return
      const control = target.closest('button, [role="button"], a, input, select, textarea, [contenteditable="true"]')
      if (control && control !== toggle) return
      if (event.type === 'keydown' && target !== toggle) return
      const id = identityOf(root)
      const settings = store.getSettingsSnapshot()
      if (!settings.enabled || !isTarget(settings, id) || pending.has(toggle)) return
      const bookId = settings.currentBookId
      const intent = { frame: null }
      pending.set(toggle, intent)
      const verify = () => {
        pending.delete(toggle)
        const current = store.getSettingsSnapshot()
        // Observe the real host transition; never consume on a canceled/no-op action.
        if (!disposed && toggle.isConnected && toggle.getAttribute('aria-expanded') === 'true'
          && current.enabled && current.currentBookId === bookId && isTarget(current, identityOf(root))) {
          void store.claimPassage(readingKey(id))
        }
      }
      if (view?.requestAnimationFrame) intent.frame = view.requestAnimationFrame(verify)
      else queueMicrotask(verify)
    }
    const observer = new MutationObserver(refresh)
    // Observe text and native shimmer updates, never treat automatic expansion as reading intent.
    observer.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['data-shimmer-text'] })
    document.addEventListener('click', activate, true)
    document.addEventListener('keydown', activate, true)
    const stopSettings = store.subscribeSettings(refresh)
    refresh()
    return () => {
      disposed = true
      observer.disconnect()
      stopSettings()
      document.removeEventListener('click', activate, true)
      document.removeEventListener('keydown', activate, true)
      for (const intent of pending.values()) if (intent.frame !== null) view.cancelAnimationFrame(intent.frame)
      pending.clear()
      for (const root of decorated.keys()) restore(root)
    }
  }, 'novel-fish: native disclosure adapter')
}

function collectText(element, value, desired) {
  if (!element || !value) return
  const walker = element.ownerDocument.createTreeWalker(element, 4 /* SHOW_TEXT */)
  let first = true
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    desired.set(node, first ? value : '')
    first = false
  }
  for (const node of [element, ...element.querySelectorAll('[data-shimmer-text]')]) {
    if (node.hasAttribute('data-shimmer-text')) desired.set(node, value)
  }
}

function readText(node) {
  return node.nodeType === 3 ? node.nodeValue : node.getAttribute('data-shimmer-text')
}

function writeText(node, value) {
  if (node.nodeType === 3) node.nodeValue = value
  else node.setAttribute('data-shimmer-text', value)
}

function restoreText(node, text) {
  if (readText(node) === text.shown) writeText(node, text.native)
}

function createBody(React) {
  const h = React.createElement
  return function NovelBody({ text, running, sessionId, useNovelSettings, useNovelPassages, renderFactorySlot, t }) {
    const ref = React.useRef(null)
    const [identity, setIdentity] = React.useState(null)
    const settings = useNovelSettings(value => value)
    React.useEffect(() => {
      setIdentity(identityOf(ref.current))
    }, [sessionId])
    const selected = settings.enabled && isTarget(settings, identity)
    const key = settings.currentBookId && identity ? passageSnapshotKey(settings.currentBookId, readingKey(identity)) : null
    const status = useNovelPassages(snapshot => key ? snapshot[key] : undefined) ?? EMPTY
    const original = renderFactorySlot('conversation.chat.reasoning.content', { text, running })
    let novel = null
    if (selected && status.kind === 'ready') {
      // Same native typography as the real thought. Escape Markdown so local book
      // text cannot introduce images, links or other new visual/interactive controls.
      const plain = status.passage.text.replace(/[\\`*_{}\[\]()#+\-.!<>|~&]/gu, '\\$&')
      novel = h('div', { 'data-novel-passage': status.index + 1 },
        renderFactorySlot('conversation.chat.reasoning.content', { text: plain, running: false }))
    } else if (selected) {
      const message = status.kind === 'loading' ? 'chat.loading' : status.kind === 'end' ? 'chat.end'
        : status.kind === 'error' ? 'chat.readError' : settings.currentBookId ? 'chat.switchHint' : 'chat.noBook'
      novel = h('div', { role: status.kind === 'error' ? 'alert' : 'status' },
        renderFactorySlot('conversation.chat.reasoning.content', { text: t(message), running: false }))
    }
    return h('div', { ref },
      h('div', { 'data-novel-original': true }, original),
      novel === null ? null : h('div', { 'data-novel-append': true }, novel),
    )
  }
}

function identityOf(element) {
  const root = element?.closest('[data-variant="think"]')
  const node = root?.closest('[data-chat-flow-kind="assistant-step"][data-chat-node-key]')
  const container = node?.closest('[data-conversation-session]')
  if (!root || !node || !container) return null
  const regions = [...node.querySelectorAll('[data-variant="think"]')]
    .filter(region => region.closest('[data-chat-node-key]') === node)
  const index = regions.indexOf(root)
  const sessionId = container.getAttribute('data-conversation-session')
  const nodeKey = node.getAttribute('data-chat-node-key')
  if (index < 0 || !sessionId || !nodeKey) return null
  return { sessionId, nodeKey, type: 'reasoning', index }
}

function readingKey(identity) {
  return JSON.stringify([identity.sessionId, identity.nodeKey, identity.type, identity.index])
}

function isTarget(settings, identity) {
  return identity !== null && identity.type === settings.targetType
}
