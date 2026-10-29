import { TARGET_TYPES } from './store.js'

const TYPE_LABELS = { reasoning: 'typeReasoning', 'tool-call': 'typeToolCall', 'read-file': 'typeReadFile', command: 'typeCommand', 'file-search': 'typeFileSearch' }
const MAIN_TITLES = ['', '思考', '分析', '检查', 'Thinking']
const EXTRA_TITLES = ['', 'Checking project structure', 'Analyzing the request', 'Reviewing implementation', 'Verifying results']

// Only layout belongs to the plugin. Controls, menus, focus and dialogs belong to DSH.
const STYLES = `
.novel-fish-settings{display:flex;flex-direction:column;gap:32px;min-width:0;font-size:14px;line-height:1.6;color:var(--dsw-alias-label-primary)}
.novel-fish-settings .novel-fish-section{display:flex;flex-direction:column;gap:16px;min-width:0}
.novel-fish-settings .novel-fish-row{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px}
.novel-fish-settings h3{margin:0;font:inherit;font-weight:600}
.novel-fish-settings .novel-fish-field{display:flex;flex-direction:column;gap:8px;min-width:0}
.novel-fish-settings .novel-fish-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr));gap:16px}
.novel-fish-settings .novel-fish-select,.novel-fish-settings .novel-fish-input{display:flex;width:100%;min-width:0}
.novel-fish-settings .novel-fish-select-button{width:100%;justify-content:space-between;gap:12px;text-align:start}
.novel-fish-settings .novel-fish-selection{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}
.novel-fish-settings .novel-fish-hint{margin:0;color:var(--dsw-alias-label-tertiary);font-size:13px;line-height:1.6}
.novel-fish-settings .novel-fish-error{color:var(--dsw-alias-state-error-primary)}
`

/** Embedded in this bundle's official configuration slot; never a reading page. */
export function createSettingsRow(React, { Switch, Button, Input, Menu, Modal, IconChevronDownOutlineRegular }) {
  const h = React.createElement

  function SelectMenu({ label, summary, value, items, disabled, onChange, marker, multiple = false, footer }) {
    const [open, setOpen] = React.useState(false)
    const selection = multiple ? summary : items.find(item => item.id === value)?.label ?? label
    return h(Menu, {
      open, onClose: () => setOpen(false), portal: true, autoFocus: true,
      className: 'novel-fish-select',
      items: items.map(item => ({ ...item, disabled: disabled || item.disabled })),
      footer: footer?.map(item => ({ ...item, disabled })),
      ...(multiple ? { selectedIds: value } : { selectedId: value }),
      onSelect: id => {
        if (disabled) return
        if (!multiple) setOpen(false)
        onChange(id)
      },
      anchor: h(Button, {
        variant: 'outline', disabled, className: 'novel-fish-select-button',
        'aria-label': label, 'aria-haspopup': 'menu', 'aria-expanded': open,
        ...marker, onClick: () => { if (!disabled) setOpen(current => !current) },
      }, h('span', { className: 'novel-fish-selection' }, selection), h(IconChevronDownOutlineRegular, { size: 16 })),
    })
  }

  function PresetField({ t, label, value, choices, disabled, onChange, testId }) {
    const [custom, setCustom] = React.useState(!choices.includes(value))
    const showCustom = custom || !choices.includes(value)
    return h('div', { className: 'novel-fish-field' },
      h('span', null, label),
      h(SelectMenu, {
        label, value: showCustom ? '__custom' : value, disabled,
        marker: { 'data-novel-preset': testId },
        items: [...choices.map(choice => ({ id: choice, label: choice || t(testId === 'title' ? 'settings.nativeTitle' : 'settings.noExtra') })), { id: '__custom', label: t('settings.custom') }],
        onChange: next => {
          if (next === '__custom') setCustom(true)
          else void onChange(next).then(saved => { if (saved) setCustom(false) })
        },
      }),
      showCustom ? h(Input, {
        className: 'novel-fish-input', defaultValue: value, disabled,
        'aria-label': t('settings.customField', { label }), [`data-novel-${testId}`]: true,
        onChange: event => { void onChange(event.currentTarget.value) },
      }) : null,
    )
  }

  function SettingsRow({ t, useNovelState, useNovelUi, onSetOption, onSetNotice, onSelectBook, onDeleteBook, onImportFile }) {
    const state = useNovelState(value => value)
    const ui = useNovelUi(value => value)
    const [busy, setBusy] = React.useState(false)
    const [savingTypes, setSavingTypes] = React.useState(false)
    const [savingEnabled, setSavingEnabled] = React.useState(false)
    const [removeBook, setRemoveBook] = React.useState(null)
    const [removeError, setRemoveError] = React.useState(null)
    const enabling = React.useRef(false)
    const changingTypes = React.useRef(false)
    const importing = React.useRef(false)
    const removing = React.useRef(false)
    const fileInput = React.useRef(null)
    const selectedBook = state.books.find(book => book.id === state.settings.currentBookId)
    const disabled = busy || !state.hydrated || Boolean(state.error)
    const perform = async action => {
      try { await action(); return true }
      catch (error) { onSetNotice(t('settings.actionError', { message: errorMessage(error) })); return false }
    }
    const setEnabled = async enabled => {
      if (disabled || enabling.current) return
      enabling.current = true
      setSavingEnabled(true)
      try { await perform(() => onSetOption('enabled', enabled)) }
      finally { enabling.current = false; setSavingEnabled(false) }
    }
    const setTypes = async types => {
      if (disabled || changingTypes.current) return
      changingTypes.current = true
      setSavingTypes(true)
      try { await perform(() => onSetOption('targetTypes', types)) }
      finally { changingTypes.current = false; setSavingTypes(false) }
    }
    const importFile = async event => {
      const input = event.currentTarget
      const file = input.files?.[0]
      if (!file || disabled || importing.current) return
      importing.current = true
      setBusy(true)
      onSetNotice(t('settings.importing'))
      try {
        const book = await onImportFile(file)
        onSetNotice(t('settings.importDone', { count: book.segmentCount }))
      } catch (error) {
        onSetNotice(t('settings.importError', { message: errorMessage(error) }))
      } finally {
        input.value = ''
        importing.current = false
        setBusy(false)
      }
    }
    const closeRemove = () => { if (!removing.current) setRemoveBook(null) }
    const confirmRemove = async () => {
      if (!removeBook || disabled || removing.current) return
      removing.current = true
      setRemoveError(null)
      setBusy(true)
      try { await onDeleteBook(removeBook.id); setRemoveBook(null) }
      catch (error) { setRemoveError(t('settings.actionError', { message: errorMessage(error) })) }
      finally { removing.current = false; setBusy(false) }
    }

    return h('section', { className: 'novel-fish-settings', 'data-novel-settings': true },
      h('style', null, STYLES),
      !state.hydrated && !state.error ? h('div', { role: 'status' }, t('settings.storageLoading')) : null,
      state.error ? h('div', { role: 'alert', className: 'novel-fish-error' }, state.error) : null,
      h('section', { className: 'novel-fish-section' },
        h('div', { className: 'novel-fish-row' },
          h('h3', null, t('settings.books')),
          h(Button, { variant: 'outline', disabled, 'data-novel-import': true, onClick: () => { if (!disabled) fileInput.current?.click() } }, t('settings.importBook')),
        ),
        h('input', { ref: fileInput, hidden: true, type: 'file', accept: '.epub,.txt,.md,application/epub+zip,text/plain,text/markdown', onChange: event => { void importFile(event) }, disabled, 'data-novel-file-input': true }),
        h('div', { className: 'novel-fish-field' },
          h('span', null, t('settings.selectBook')),
          h(SelectMenu, {
            label: t('settings.selectBook'), value: state.settings.currentBookId ?? '', disabled: disabled || !state.books.length,
            marker: { 'data-novel-book-select': true },
            items: [{ id: '', label: t('settings.noBook') }, ...state.books.map(book => ({ id: book.id, label: `${book.title} · ${book.format.toUpperCase()}` }))],
            onChange: id => { void perform(() => onSelectBook(id)) },
          }),
        ),
        selectedBook ? h('div', { className: 'novel-fish-row' },
          h('span', { className: 'novel-fish-hint', 'data-novel-progress': true }, t('settings.progressValue', { progress: selectedBook.progress, total: selectedBook.segmentCount, percent: Math.floor(selectedBook.progress / selectedBook.segmentCount * 100) })),
          h(Button, { variant: 'ghost', disabled, 'data-novel-delete': true, onClick: () => { setRemoveError(null); setRemoveBook(selectedBook) } }, t('settings.deleteBook')),
        ) : h('p', { className: 'novel-fish-hint' }, t('settings.emptyLibrary')),
      ),
      h('section', { className: 'novel-fish-section' },
        h('h3', null, t('settings.reading')),
        h('div', { className: 'novel-fish-row' },
          h('span', null, t('settings.enabled')),
          h(Switch, { checked: state.settings.enabled, disabled: disabled || savingEnabled, label: t('settings.enabled'), onChange: enabled => { void setEnabled(enabled) } }),
        ),
        h('div', { className: 'novel-fish-field' },
          h('span', null, t('settings.targetType')),
          h(SelectMenu, {
            label: t('settings.targetType'), summary: t('settings.selectedTypes', { count: state.settings.targetTypes.length, total: TARGET_TYPES.length }),
            value: state.settings.targetTypes, multiple: true, disabled: disabled || savingTypes,
            marker: { 'data-novel-type-select': true },
            items: TARGET_TYPES.map(type => ({ id: type, label: t(`settings.${TYPE_LABELS[type]}`) })),
            footer: [{ id: '__all', label: t(state.settings.targetTypes.length === TARGET_TYPES.length ? 'settings.clearTypes' : 'settings.allTypes') }],
            onChange: type => { void setTypes(type === '__all' ? (state.settings.targetTypes.length === TARGET_TYPES.length ? [] : [...TARGET_TYPES]) : TARGET_TYPES.filter(value => value === type ? !state.settings.targetTypes.includes(type) : state.settings.targetTypes.includes(value))) },
          }),
          h('p', { className: 'novel-fish-hint' }, t('settings.typeHint')),
        ),
      ),
      h('section', { className: 'novel-fish-section' },
        h('h3', null, t('settings.appearance')),
        h('div', { key: String(state.hydrated), className: 'novel-fish-grid' },
          [
            ['mainTitle', 'settings.titleMain', 'title', MAIN_TITLES],
            ['extraTitle', 'settings.titleExtra', 'extra', EXTRA_TITLES],
          ].map(([key, label, testId, choices]) => h(PresetField, {
            key, t, label: t(label), value: state.settings[key], choices, disabled, testId,
            onChange: value => perform(() => onSetOption(key, value)),
          })),
        ),
        h('p', { className: 'novel-fish-hint' }, t('settings.nativeControls')),
      ),
      ui.notice ? h('div', { role: 'status', 'data-novel-notice': true }, ui.notice) : null,
      h(Modal, {
        open: Boolean(removeBook), onClose: closeRemove, title: t('settings.deleteBook'), closeLabel: t('settings.cancel'),
        description: removeBook ? t('settings.removeConfirm', { title: removeBook.title }) : '',
        footer: h(React.Fragment, null,
          h(Button, { variant: 'outline', disabled: busy, onClick: closeRemove }, t('settings.cancel')),
          h(Button, { variant: 'primary', disabled: disabled || !removeBook, 'data-novel-delete-confirm': true, onClick: () => { void confirmRemove() } }, t('settings.confirmDelete')),
        ),
      }, removeError ? h('p', { role: 'alert' }, removeError) : null),
    )
  }

  return React.memo(SettingsRow)
}

function errorMessage(error) {
  return error instanceof Error ? error.message : String(error)
}
