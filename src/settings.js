const PANEL = {
  display: 'grid',
  gap: 14,
  padding: 14,
  border: '1px solid var(--dsw-alias-border-l2)',
  borderRadius: 'var(--dsw-radius-md, 10px)',
  color: 'var(--dsw-alias-label-primary)',
  fontSize: 'var(--dsh-content-font-size-secondary, 13px)',
}
const LABEL = { display: 'grid', gap: 5, color: 'var(--dsw-alias-label-secondary)' }
const CONTROL = {
  boxSizing: 'border-box',
  width: '100%',
  minWidth: 0,
  border: '1px solid var(--dsw-alias-border-l2)',
  borderRadius: 'var(--dsw-radius-sm, 6px)',
  background: 'var(--dsw-alias-bg-base)',
  color: 'var(--dsw-alias-label-primary)',
  padding: '7px 9px',
  font: 'inherit',
}
const BUTTON = {
  border: '1px solid var(--dsw-alias-border-l2)',
  borderRadius: 'var(--dsw-radius-sm, 6px)',
  background: 'var(--dsw-alias-interactive-bg-hover)',
  color: 'var(--dsw-alias-label-primary)',
  padding: '7px 10px',
  font: 'inherit',
  cursor: 'pointer',
}

/** Build the one Settings → General panel for books and target-step selection. */
export function createSettingsRow(React) {
  const h = React.createElement

  function SettingsRow({ t, useNovelState, useNovelUi, onSetOption, onSetNotice, onSetPicking, onRemoveTarget, onSelectBook, onDeleteBook, onImportFile, onImportPastedText }) {
    const state = useNovelState(value => value)
    const ui = useNovelUi(value => value)
    const [pasteTitle, setPasteTitle] = React.useState('')
    const [pasteText, setPasteText] = React.useState('')
    const [busy, setBusy] = React.useState(false)

    const writeOption = async (key, value) => {
      try { await onSetOption(key, value) }
      catch (error) { onSetNotice(t('settings.importError', { message: errorMessage(error) })) }
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
    const importPaste = async () => {
      if (!pasteText.trim()) return
      setBusy(true)
      onSetNotice(t('settings.importing'))
      try {
        const book = await onImportPastedText(pasteTitle, pasteText)
        setPasteText('')
        onSetNotice(t('settings.importDone', { count: book.segmentCount }))
      } catch (error) {
        onSetNotice(t('settings.importError', { message: errorMessage(error) }))
      } finally {
        setBusy(false)
      }
    }
    const deleteBook = async book => {
      if (!globalThis.confirm?.(t('settings.removeConfirm', { title: book.title }))) return
      try { await onDeleteBook(book.id) }
      catch (error) { onSetNotice(t('settings.importError', { message: errorMessage(error) })) }
    }
    const targetRows = state.settings.targets.length
      ? state.settings.targets.map(target => h('div', {
        key: `${target.sessionId}:${target.nodeKey}`,
        style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '6px 0', borderTop: '1px solid var(--dsw-alias-border-l2)' },
      },
      h('span', null, t('settings.targetKey', { session: target.sessionId.slice(0, 8), turn: target.turn, step: target.step })),
      h('button', { type: 'button', style: BUTTON, onClick: () => onRemoveTarget(target.sessionId, target.nodeKey).catch(error => onSetNotice(errorMessage(error))) }, t('settings.removeTarget')),
      ))
      : h('div', { style: { color: 'var(--dsw-alias-label-tertiary)' } }, t('settings.noTargets'))

    const bookRows = state.books.length
      ? state.books.map(book => h('div', {
        key: book.id,
        style: { display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto', gap: 8, alignItems: 'center', padding: '8px 0', borderTop: '1px solid var(--dsw-alias-border-l2)' },
      },
      h('label', { style: { display: 'flex', alignItems: 'flex-start', gap: 8, minWidth: 0, cursor: 'pointer' } },
        h('input', { type: 'radio', name: 'novel-current-book', checked: state.settings.currentBookId === book.id, onChange: () => onSelectBook(book.id).catch(error => onSetNotice(errorMessage(error))) }),
        h('span', { style: { display: 'grid', minWidth: 0 } },
          h('span', { style: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--dsw-alias-label-primary)' } }, book.title),
          h('span', { style: { color: 'var(--dsw-alias-label-tertiary)' } }, `${book.format.toUpperCase()} · ${t('settings.progress')}: ${book.progress}/${book.segmentCount}`),
        ),
      ),
      h('button', { type: 'button', style: BUTTON, onClick: () => { void deleteBook(book) } }, t('settings.deleteBook')),
      ))
      : h('div', { style: { color: 'var(--dsw-alias-label-tertiary)' } }, t('settings.emptyLibrary'))

    return h('section', { style: PANEL, 'data-novel-settings': true },
      h('div', { style: { display: 'grid', gap: 3 } },
        h('strong', { style: { fontSize: 14, color: 'var(--dsw-alias-label-primary)' } }, t('settings.title')),
        h('span', { style: { color: 'var(--dsw-alias-label-tertiary)' } }, t('settings.description')),
      ),
      !state.hydrated && !state.error ? h('div', null, t('settings.storageLoading')) : null,
      state.error ? h('div', { role: 'alert', style: { color: 'var(--dsw-alias-danger-label, #c33)' } }, state.error) : null,
      h('label', { style: { display: 'flex', alignItems: 'center', gap: 8 } },
        h('input', { type: 'checkbox', checked: state.settings.enabled, onChange: event => { void writeOption('enabled', event.currentTarget.checked) } }),
        t('settings.enabled'),
      ),
      h('div', { style: LABEL },
        h('span', null, t('settings.targetList')),
        h('div', { style: { display: 'grid', gap: 6 } }, targetRows),
        h('button', { type: 'button', style: BUTTON, onClick: () => onSetPicking(!ui.picking), disabled: !state.hydrated }, ui.picking ? t('settings.stopPicking') : t('settings.chooseTarget')),
        ui.picking ? h('div', { role: 'status', style: { color: 'var(--dsw-alias-label-secondary)' } }, t('settings.pickHint')) : null,
      ),
      h('div', { style: LABEL },
        h('span', null, t('settings.bookSource')),
        h('input', { type: 'file', accept: '.epub,.txt,.md,application/epub+zip,text/plain,text/markdown', onChange: event => { void importFile(event) }, disabled: busy || !state.hydrated, 'data-novel-file-input': true }),
      ),
      h('div', { style: LABEL },
        h('span', null, t('settings.paste')),
        h('input', { value: pasteTitle, onChange: event => setPasteTitle(event.currentTarget.value), placeholder: t('settings.bookName'), style: CONTROL, disabled: busy || !state.hydrated }),
        h('textarea', { value: pasteText, onChange: event => setPasteText(event.currentTarget.value), placeholder: t('settings.pastePlaceholder'), rows: 4, style: { ...CONTROL, resize: 'vertical' }, disabled: busy || !state.hydrated, 'data-novel-paste': true }),
        h('button', { type: 'button', style: BUTTON, disabled: busy || !state.hydrated || !pasteText.trim(), onClick: () => { void importPaste() } }, t('settings.importPaste')),
      ),
      h('div', { style: LABEL },
        h('span', null, t('settings.selectBook')),
        h('div', { style: { display: 'grid' } }, bookRows),
      ),
      h('div', { key: String(state.hydrated), style: { display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 8 } },
        h('label', { style: LABEL },
          h('span', null, t('settings.icon')),
          h('input', { defaultValue: state.settings.icon, disabled: !state.hydrated || Boolean(state.error), onChange: event => { void writeOption('icon', event.currentTarget.value) }, style: CONTROL, maxLength: 8, 'data-novel-icon': true }),
        ),
        h('label', { style: LABEL },
          h('span', null, t('settings.titleMain')),
          h('input', { defaultValue: state.settings.mainTitle, disabled: !state.hydrated || Boolean(state.error), onChange: event => { void writeOption('mainTitle', event.currentTarget.value) }, style: CONTROL, placeholder: t('settings.titleMainPlaceholder'), 'data-novel-title': true }),
        ),
        h('label', { style: LABEL },
          h('span', null, t('settings.titleExtra')),
          h('input', { defaultValue: state.settings.extraTitle, disabled: !state.hydrated || Boolean(state.error), onChange: event => { void writeOption('extraTitle', event.currentTarget.value) }, style: CONTROL, placeholder: t('settings.titleExtraPlaceholder'), 'data-novel-extra': true }),
        ),
      ),
      ui.notice ? h('div', { role: 'status', 'data-novel-notice': true, style: { color: 'var(--dsw-alias-label-secondary)' } }, ui.notice) : null,
    )
  }

  return React.memo(SettingsRow)
}

function errorMessage(error) {
  return error instanceof Error ? error.message : String(error)
}
