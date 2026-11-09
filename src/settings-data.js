export const TARGET_TYPES = Object.freeze(['reasoning', 'tool-call', 'read-file', 'command', 'file-search'])
export const DEFAULT_SETTINGS = Object.freeze({
  enabled: true, currentBookId: null, targetTypes: Object.freeze(['reasoning']),
  mainTitle: '', extraTitle: '', continueOnReopen: false,
})

// Remove obsolete step bindings without destroying unrelated persisted metadata.
// Store actions and backup validation whitelist all new user-controlled fields.
export function settingsPatch(value = {}) {
  const patch = { ...value }
  delete patch.targets
  delete patch.targetKey
  delete patch.targetType
  if (Array.isArray(patch.targetTypes)) patch.targetTypes = [...new Set(patch.targetTypes.filter(type => TARGET_TYPES.includes(type)))]
  return patch
}

export function normalizeSettings(value = {}, books = []) {
  return {
    enabled: typeof value.enabled === 'boolean' ? value.enabled : true,
    currentBookId: books.some(book => book.id === value.currentBookId) ? value.currentBookId : null,
    targetTypes: Object.freeze(Array.isArray(value.targetTypes)
      ? [...new Set(value.targetTypes.filter(type => TARGET_TYPES.includes(type)))] : [...DEFAULT_SETTINGS.targetTypes]),
    mainTitle: typeof value.mainTitle === 'string' ? value.mainTitle : '',
    extraTitle: typeof value.extraTitle === 'string' ? value.extraTitle : '',
    continueOnReopen: value.continueOnReopen === true,
  }
}
