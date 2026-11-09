// randomUUID is unavailable on plain-HTTP LAN origins; IndexedDB still works.
export function randomId() {
  return globalThis.crypto?.randomUUID?.() ?? `book-${Date.now()}-${Math.random().toString(36).slice(2)}`
}
