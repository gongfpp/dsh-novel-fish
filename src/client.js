import { IndexedDbStorage } from './persistence.js'
import { NovelStore } from './store.js'
import { registerChatAdapter } from './chat-adapter.js'
import { createSettingsRow } from './settings.js'
import zh from '../locale/zh.json'
import en from '../locale/en.json'

const MODULE_ID = '@gongfpp/dsh-novel-fish'
const LOCALE = 'novel-fish'

function flatten(value, prefix = '') {
  return Object.fromEntries(Object.entries(value).flatMap(([key, item]) => {
    const path = prefix ? `${prefix}.${key}` : key
    return typeof item === 'string' ? [[path, item]] : Object.entries(flatten(item, path))
  }))
}

window.__ModuleLoader__.load({
  id: MODULE_ID,
  factory(require) {
    const React = require('react')
    const { Switch } = require('@deepseek-ai/dsh-client-ui-primitives')
    return {
      inject: ['slots', 'locale'],
      apply(ctx) {
        const storage = new IndexedDbStorage()
        const store = new NovelStore(storage)
        const SettingsRow = createSettingsRow(React, Switch)
        const settingsActions = {
          onSetOption: (key, value) => store.setOption(key, value),
          onSetNotice: notice => store.setNotice(notice),
          onSelectBook: bookId => store.selectBook(bookId),
          onDeleteBook: bookId => store.deleteBook(bookId),
          onImportFile: file => store.importFile(file),
        }

        ctx.effect(() => ctx.locale.register(LOCALE, { zh: flatten(zh), en: flatten(en) }), 'novel-fish: locale')
        ctx.effect(() => () => store.dispose(), 'novel-fish: store')
        ctx.slots.inject('plugins.bundle.config', () => ctx.slots.register({
          name: 'plugins.bundle.config',
          key: MODULE_ID,
          locale: LOCALE,
          inject: () => ({
            hooks: {
              novelState: store.stateSource,
              novelUi: store.uiSource,
            },
            ...settingsActions,
          }),
        }, SettingsRow))
        registerChatAdapter(ctx, store, React, LOCALE)
      },
    }
  },
})
