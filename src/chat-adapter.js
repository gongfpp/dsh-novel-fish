import { passageSnapshotKey } from './store.js'
import {
  BOX_STYLE, CHAPTER_STYLE, HEADER_STYLE, META_STYLE, NEXT_STYLE, PASSAGE_STYLE, TITLE_STYLE, novelContent,
} from './novel-content.js'

const THOUGHT = '[data-chat-flow-kind="assistant-step"] [data-variant="think"]'
const TOOL = '[data-chat-call-id] [data-tool], [data-chat-call-id] [data-sample="bash"]'
const REGIONS = `${THOUGHT}, ${TOOL}`
const EMPTY = Object.freeze({ kind: 'empty' })
// Attributes a region identity is derived from; changing any of them invalidates
// every cached identity, while streaming text and expansion state do not.
const IDENTITY_ATTRIBUTES = ['data-chat-flow-kind', 'data-chat-node-key', 'data-chat-call-id', 'data-conversation-session', 'data-tool', 'data-sample']
const IDENTITY_SET = new Set(IDENTITY_ATTRIBUTES)
const OBSERVED_ATTRIBUTES = ['data-shimmer-text', 'aria-expanded', 'data-state', ...IDENTITY_ATTRIBUTES]

/** DSH 0.2.1 窄适配：保留原生控件和正文，只改标题文字并追加本地纯文本。 */
export function registerChatAdapter(ctx, store, React, locale) {
  const t = ctx.locale?.bind(locale) ?? (key => key)
  ctx.slots.inject('conversation.chat.reasoning.body', () => ctx.slots.register({
    name: 'conversation.chat.reasoning.body', priority: -10, locale,
    inject: () => ({ hooks: { novelState: store.stateSource, novelSettings: store.settingsSource, novelPassages: store.passageSource } }),
  }, createBody(React, store)))

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
    // A region identity is a pure function of the host's own attributes plus the
    // order of regions inside one step node, so it survives streaming text writes.
    // Cache it per region and drop the whole cache whenever a mutation could change
    // either input; otherwise every frame pays a DOM climb per historical row.
    let identities = new WeakMap()
    const identity = root => {
      let cached = identities.get(root)
      if (!cached) {
        cached = identityOf(root)
        if (cached) identities.set(root, cached)
      }
      return cached ?? null
    }
    const refresh = () => {
      const settings = store.getSettingsSnapshot()
      for (const [toggle, intent] of pending) {
        const id = identity(intent.root)
        if (!toggle.isConnected || !settings.enabled || settings.currentBookId !== intent.bookId
          || !isTarget(settings, id) || readingKey(id) !== intent.key || store.cacheGeneration !== intent.generation) {
          if (intent.frame !== null) view.cancelAnimationFrame(intent.frame)
          pending.delete(toggle)
        }
      }
      for (const root of decorated.keys()) {
        if (!root.isConnected || !settings.enabled || !isTarget(settings, identity(root))) restore(root)
      }
      // A disabled plugin restores its decorations and then does nothing else, even
      // though the conversation keeps streaming underneath it.
      if (!settings.enabled) return
      for (const root of document.querySelectorAll(REGIONS)) {
        const id = identity(root)
        const header = headerOf(root)
        if (!header || !isTarget(settings, id)) continue
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
          const book = store.getSnapshot().books.find(item => item.id === settings.currentBookId)
          const model = novelContent(status, book, t)
          const signature = JSON.stringify(model)
          const container = root.matches('[data-sample="bash"]') ? root.parentElement : root
          if (!record.append || !container.contains(record.append)) {
            record.append = document.createElement('div')
            record.append.setAttribute('data-novel-append', '')
            container.append(record.append)
            record.signature = null
          }
          if (signature !== record.signature) {
            renderPlainAppend(record.append, model, () => {
              void store.continuePassage(readingKey(id), id.type)
            }, t)
            record.signature = signature
          }
        }
      }
    }

    // Streaming text mutates the DOM far more often than a frame; merge observer
    // bursts into one scan so a long session cannot turn every token into a full
    // rescan. Settings/passage updates still refresh immediately.
    let queued = null
    const coalescedRefresh = () => {
      if (!queued) return
      queued = null
      if (!disposed) refresh()
    }
    const scheduleRefresh = () => {
      if (queued) return
      const entry = { frame: null }
      queued = entry
      if (view?.requestAnimationFrame) entry.frame = view.requestAnimationFrame(coalescedRefresh)
      else queueMicrotask(coalescedRefresh)
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
          if (current.continueOnReopen === true) void store.continuePassage(readingKey(id), id.type)
          else void store.claimPassage(readingKey(id), id.type)
        }
      }
      if (view?.requestAnimationFrame) intent.frame = view.requestAnimationFrame(verify)
      else queueMicrotask(verify)
    }
    const observer = new MutationObserver(records => {
      for (const record of records) {
        if (record.type === 'childList' || (record.type === 'attributes' && IDENTITY_SET.has(record.attributeName))) {
          identities = new WeakMap()
          break
        }
      }
      scheduleRefresh()
    })
    observer.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true,
      attributeFilter: OBSERVED_ATTRIBUTES })
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
      if (queued && queued.frame !== null && view?.cancelAnimationFrame) view.cancelAnimationFrame(queued.frame)
      queued = null
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

function createBody(React, store) {
  const h = React.createElement
  return function NovelBody({ text, running, sessionId, useNovelSettings, useNovelPassages, useNovelState, renderFactorySlot, t }) {
    const ref = React.useRef(null)
    const [identity, setIdentity] = React.useState(null)
    const settings = useNovelSettings(value => value)
    React.useEffect(() => { setIdentity(identityOf(ref.current)) }, [sessionId])
    const selected = settings.enabled && isTarget(settings, identity)
    const book = useNovelState(snapshot => snapshot.books.find(item => item.id === settings.currentBookId) ?? null)
    const key = settings.currentBookId && identity ? passageSnapshotKey(settings.currentBookId, readingKey(identity)) : null
    const status = useNovelPassages(snapshot => key ? snapshot[key] : undefined) ?? EMPTY
    const model = selected ? novelContent(status, book, t) : null
    return h('div', { ref },
      h('div', { 'data-novel-original': true }, renderFactorySlot('conversation.chat.reasoning.content', { text, running })),
      model === null ? null : h('div', { 'data-novel-append': true, style: BOX_STYLE },
        h('div', { style: HEADER_STYLE },
          h('span', { 'data-novel-label': true, style: TITLE_STYLE }, model.label),
          model.chapter ? h('span', { 'data-novel-chapter': true, style: CHAPTER_STYLE }, model.chapter) : null,
          model.meta ? h('span', { 'data-novel-progress': true, style: META_STYLE }, model.meta) : null,
          model.canContinue ? h('button', {
            type: 'button', 'data-novel-next': true, style: NEXT_STYLE,
            onClick: () => { void store.continuePassage(readingKey(identity), identity.type) },
          }, t('chat.next')) : null),
        h('div', { 'data-novel-passage': model.index, role: model.role, style: PASSAGE_STYLE,
          tabIndex: model.index ? 0 : undefined, 'aria-label': model.label }, model.text)),
    )
  }
}
function renderPlainAppend(element, model, onNext, t) {
  Object.assign(element.style, BOX_STYLE)
  const header = document.createElement('div')
  Object.assign(header.style, HEADER_STYLE)
  const label = document.createElement('span')
  label.setAttribute('data-novel-label', '')
  Object.assign(label.style, TITLE_STYLE)
  label.textContent = model.label
  header.append(label)
  if (model.chapter) {
    const chapter = document.createElement('span')
    chapter.setAttribute('data-novel-chapter', '')
    Object.assign(chapter.style, CHAPTER_STYLE)
    chapter.textContent = model.chapter
    header.append(chapter)
  }
  if (model.meta) {
    const meta = document.createElement('span')
    meta.setAttribute('data-novel-progress', '')
    Object.assign(meta.style, META_STYLE)
    meta.textContent = model.meta
    header.append(meta)
  }
  if (model.canContinue) {
    const next = document.createElement('button')
    next.type = 'button'
    next.setAttribute('data-novel-next', '')
    Object.assign(next.style, NEXT_STYLE)
    next.textContent = t('chat.next')
    next.addEventListener('click', () => onNext?.())
    header.append(next)
  }
  const content = document.createElement('div')
  Object.assign(content.style, PASSAGE_STYLE)
  if (model.index) {
    content.setAttribute('data-novel-passage', model.index)
    content.tabIndex = 0
    content.setAttribute('aria-label', model.label)
  }
  if (model.role) content.setAttribute('role', model.role)
  content.textContent = model.text
  element.replaceChildren(header, content)
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
