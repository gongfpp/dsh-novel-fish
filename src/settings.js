const PANEL = {
  display: 'grid', gap: 14, padding: 14,
  border: '1px solid var(--dsw-alias-border-l2)',
  borderRadius: 'var(--dsw-radius-md, 10px)',
  color: 'var(--dsw-alias-label-primary)',
  fontSize: 'var(--dsh-content-font-size-secondary, 13px)',
}
const LABEL = { display: 'grid', gap: 5, color: 'var(--dsw-alias-label-secondary)' }
const CONTROL = {
  boxSizing: 'border-box', width: '100%', minWidth: 0,
  border: '1px solid var(--dsw-alias-border-l2)',
  borderRadius: 'var(--dsw-radius-sm, 6px)',
  background: 'var(--dsw-alias-bg-base)', color: 'var(--dsw-alias-label-primary)',
  padding: '7px 9px', font: 'inherit',
}
const BUTTON = {
  ...CONTROL, width: 'auto', cursor: 'pointer',
  background: 'var(--dsw-alias-interactive-bg-hover)',
}

// 预设无需打字；保留可选自定义以满足原有的任意标题／图标要求。
const ICONS = ['📖', '📚', '💭', '🔎', '⚙️', '✅']
const MAIN_TITLES = ['', '思考', '分析', '检查', 'Thinking']
const EXTRA_TITLES = ['', 'Checking project structure', 'Analyzing the request', 'Reviewing implementation', 'Verifying results']

/** 设置嵌入 DSH 通用设置，不提供独立阅读入口。 */
export function createSettingsRow(React) {
  const h = React.createElement

  function PresetField({ t, label, value, choices, disabled, onChange, testId, maxLength }) {
    const [custom, setCustom] = React.useState(!choices.includes(value))
    const showCustom = custom || !choices.includes(value)
    return h('label', { style: LABEL },
      h('span', null, label),
      h('select', {
        style: CONTROL, value: showCustom ? '__custom' : value, disabled,
        'data-novel-preset': testId,
        onChange: event => {
          const next = event.currentTarget.value
          if (next === '__custom') setCustom(true)
          else void onChange(next).then(saved => { if (saved) setCustom(false) })
        },
      },
      choices.map(choice => h('option', { key: choice, value: choice }, choice || t(testId === 'title' ? 'settings.nativeTitle' : 'settings.noExtra'))),
      h('option', { value: '__custom' }, t('settings.custom')),
      ),
      showCustom ? h('input', {
        style: CONTROL, defaultValue: value, disabled, maxLength,
        'aria-label': t('settings.customField', { label }),
        [`data-novel-${testId}`]: true,
        onChange: event => onChange(event.currentTarget.value),
      }) : null,
    )
  }

  function SettingsRow({ t, useNovelState, useNovelUi, onSetOption, onSetNotice, onSelectBook, onDeleteBook, onImportFile }) {
    const state = useNovelState(value => value)
    const ui = useNovelUi(value => value)
    const [busy, setBusy] = React.useState(false)
    const selectedBook = state.books.find(book => book.id === state.settings.currentBookId)
    const disabled = busy || !state.hydrated || Boolean(state.error)
    const perform = async action => {
      try { await action(); return true }
      catch (error) { onSetNotice(t('settings.actionError', { message: errorMessage(error) })); return false }
    }
    const importFile = async event => {
      const input = event.currentTarget
      const file = input.files?.[0]
      if (!file) return
      setBusy(true)
      onSetNotice(t('settings.importing'))
      try {
        const book = await onImportFile(file)
        onSetNotice(t('settings.importDone', { count: book.segmentCount }))
      } catch (error) {
        onSetNotice(t('settings.importError', { message: errorMessage(error) }))
      } finally {
        input.value = ''
        setBusy(false)
      }
    }

    return h('section', { style: PANEL, 'data-novel-settings': true },
      h('div', { style: { display: 'grid', gap: 3 } },
        h('strong', { style: { fontSize: 14, color: 'var(--dsw-alias-label-primary)' } }, t('settings.title')),
        h('span', { style: { color: 'var(--dsw-alias-label-tertiary)' } }, t('settings.description')),
      ),
      !state.hydrated && !state.error ? h('div', null, t('settings.storageLoading')) : null,
      state.error ? h('div', { role: 'alert' }, state.error) : null,
      h('label', { style: { display: 'flex', alignItems: 'center', gap: 8 } },
        h('input', { type: 'checkbox', disabled, checked: state.settings.enabled, onChange: event => { const enabled = event.currentTarget.checked; void perform(() => onSetOption('enabled', enabled)) } }),
        t('settings.enabled'),
      ),
      h('label', { style: LABEL },
        h('span', null, t('settings.bookSource')),
        h('input', { type: 'file', accept: '.epub,.txt,.md,application/epub+zip,text/plain,text/markdown', onChange: event => { void importFile(event) }, disabled, 'data-novel-file-input': true }),
      ),
      h('label', { style: LABEL },
        h('span', null, t('settings.selectBook')),
        h('select', { style: CONTROL, disabled: disabled || !state.books.length, value: state.settings.currentBookId ?? '', 'data-novel-book-select': true,
          onChange: event => { const id = event.currentTarget.value; void perform(() => onSelectBook(id)) } },
        h('option', { value: '' }, t('settings.noBook')),
        state.books.map(book => h('option', { key: book.id, value: book.id }, `${book.title} · ${book.format.toUpperCase()}`)),
        ),
      ),
      selectedBook ? h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 } },
        h('span', { 'data-novel-progress': true }, t('settings.progressValue', { progress: selectedBook.progress, total: selectedBook.segmentCount, percent: Math.floor(selectedBook.progress / selectedBook.segmentCount * 100) })),
        h('button', { type: 'button', style: BUTTON, disabled, onClick: () => {
          if (globalThis.confirm?.(t('settings.removeConfirm', { title: selectedBook.title }))) void perform(() => onDeleteBook(selectedBook.id))
        } }, t('settings.deleteBook')),
      ) : h('div', null, t('settings.emptyLibrary')),
      h('label', { style: LABEL },
        h('span', null, t('settings.targetType')),
        h('select', { style: CONTROL, value: state.settings.targetType, disabled, 'data-novel-type-select': true,
          onChange: event => { const type = event.currentTarget.value; void perform(() => onSetOption('targetType', type)) } },
        h('option', { value: 'reasoning' }, t('settings.typeReasoning')),
        ),
        h('span', null, t('settings.typeHint')),
      ),
      h('div', { key: String(state.hydrated), style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 8 } },
        [
          ['icon', 'settings.icon', 'icon', ICONS, 8],
          ['mainTitle', 'settings.titleMain', 'title', MAIN_TITLES],
          ['extraTitle', 'settings.titleExtra', 'extra', EXTRA_TITLES],
        ].map(([key, label, testId, choices, maxLength]) => h(PresetField, {
          key, t, label: t(label), value: state.settings[key], choices, disabled, testId, maxLength,
          onChange: value => perform(() => onSetOption(key, value)),
        })),
      ),
      h('span', { style: { color: 'var(--dsw-alias-label-tertiary)' } }, t('settings.presetHint')),
      ui.notice ? h('div', { role: 'status', 'data-novel-notice': true }, ui.notice) : null,
    )
  }

  return React.memo(SettingsRow)
}

function errorMessage(error) {
  return error instanceof Error ? error.message : String(error)
}
