import { passageSnapshotKey } from './store.js'

const THOUGHT = '[data-chat-flow-kind="assistant-step"] [data-variant="think"]'
const EMPTY = Object.freeze({ kind: 'empty' })

/** 窄适配 DSH 0.2.1 原生折叠行，不替换回答和工具渲染。 */
export function registerChatAdapter(ctx, store, React, locale) {
  const Body = createBody(React)
  const t = ctx.locale.bind(locale)
  ctx.slots.inject('conversation.chat.reasoning.body', () => ctx.slots.register({
    name: 'conversation.chat.reasoning.body', priority: -10, locale,
    inject: () => ({
      hooks: { novelSettings: store.settingsSource, novelPassages: store.passageSource },
    }),
  }, Body))

  ctx.effect(() => {
    const decorated = new Map()
    const style = document.createElement('style')
    style.textContent = `
[data-novel-header] { position: relative; }
[data-novel-header] > :not([data-novel-label]):not(:first-child) { visibility: hidden; }
[data-novel-label] { position:absolute; left:calc(22px + var(--dsh-content-font-delta,0px)); right:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-size:var(--dsh-content-font-size-secondary,13px); line-height:calc(24px + var(--dsh-content-font-delta,0px)); font-weight:400; pointer-events:none; }
[data-novel-icon-host] > * { visibility:hidden; }
[data-novel-icon-host] [data-novel-icon] { visibility:visible; position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-size:var(--dsh-content-font-size-secondary,13px); }
`
    document.head.append(style)
    const restore = root => {
      const record = decorated.get(root)
      if (!record) return
      record.label.remove()
      record.icon.remove()
      record.header.removeAttribute('data-novel-header')
      record.leading?.removeAttribute('data-novel-icon-host')
      root.removeAttribute('data-novel-target')
      decorated.delete(root)
    }
    const refresh = () => {
      const settings = store.getSettingsSnapshot()
      for (const root of decorated.keys()) {
        const id = identityOf(root)
        if (!root.isConnected || !settings.enabled || !isTarget(settings, id)) restore(root)
      }
      for (const root of document.querySelectorAll(THOUGHT)) {
        const header = root.querySelector('[data-disclosure-row]')
        if (!header) continue
        const id = identityOf(root)
        if (!settings.enabled || !isTarget(settings, id)) continue
        let record = decorated.get(root)
        if (!record || record.header !== header || !record.label.isConnected) {
          restore(root)
          const label = document.createElement('span')
          label.setAttribute('data-novel-label', '')
          const icon = document.createElement('span')
          icon.setAttribute('data-novel-icon', '')
          icon.setAttribute('aria-hidden', 'true')
          const leading = header.firstElementChild
          header.append(label)
          leading?.append(icon)
          header.setAttribute('data-novel-header', '')
          leading?.setAttribute('data-novel-icon-host', '')
          root.setAttribute('data-novel-target', '')
          record = { header, leading, label, icon }
          decorated.set(root, record)
        }
        const title = [settings.mainTitle.trim() || t('chat.think'), settings.extraTitle.trim()].filter(Boolean).join(' · ')
        if (record.label.textContent !== title) record.label.textContent = title
        if (record.icon.textContent !== settings.icon) record.icon.textContent = settings.icon
      }
    }
    const activate = event => {
      if (!event.isTrusted) return
      if (event.type === 'keydown' && !['Enter', ' '].includes(event.key)) return
      const header = event.target instanceof Element ? event.target.closest('[data-disclosure-row]') : null
      const root = header?.closest('[data-variant="think"]')
      if (!root?.matches(THOUGHT)) return
      const id = identityOf(root)
      if (!id) return
      const settings = store.getSettingsSnapshot()
      if (settings.enabled && isTarget(settings, id) && header.getAttribute('aria-expanded') === 'false') {
        void store.claimPassage(readingKey(id))
      }
    }
    const observer = new MutationObserver(refresh)
    // 不监听折叠属性：自动展开、流式更新和重新挂载都不是续读信号。
    observer.observe(document.body, { childList: true, subtree: true, characterData: true })
    document.addEventListener('click', activate, true)
    document.addEventListener('keydown', activate, true)
    const stopSettings = store.subscribeSettings(refresh)
    refresh()
    return () => {
      observer.disconnect()
      stopSettings()
      document.removeEventListener('click', activate, true)
      document.removeEventListener('keydown', activate, true)
      for (const root of decorated.keys()) restore(root)
      style.remove()
    }
  }, 'novel-fish: native disclosure adapter')
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
    // Always keep the host's real thought renderer, even before DOM identity is available.
    const original = renderFactorySlot('conversation.chat.reasoning.content', { text, running })
    let novel = null
    if (selected && status.kind === 'ready') {
      novel = h('div', { 'data-novel-passage': status.index + 1, style: {
        whiteSpace: 'pre-wrap', overflowWrap: 'anywhere',
        color: 'var(--dsw-alias-label-tertiary)', fontSize: 'var(--dsh-content-font-size-secondary,13px)',
        lineHeight: 'calc(20px + var(--dsh-content-font-delta-secondary,0px))',
      } }, status.passage.text)
    } else if (selected) {
      const message = status.kind === 'loading' ? 'chat.loading' : status.kind === 'end' ? 'chat.end'
        : status.kind === 'error' ? 'chat.readError' : settings.currentBookId ? 'chat.switchHint' : 'chat.noBook'
      novel = h('span', { role: status.kind === 'error' ? 'alert' : 'status' }, t(message))
    }
    return h('div', { ref },
      h('div', { 'data-novel-original': true }, original),
      novel === null ? null : h('div', { 'data-novel-append': true, style: {
        marginBlockStart: 'var(--dsw-space-2,8px)', paddingBlockStart: 'var(--dsw-space-2,8px)',
        borderBlockStart: '1px solid var(--dsw-alias-border-l2)',
      } }, novel),
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
