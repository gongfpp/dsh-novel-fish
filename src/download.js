/** Download local JSON without involving a host endpoint or a model request. */
export function downloadBackup(json) {
  const href = URL.createObjectURL(new Blob([json], { type: 'application/json;charset=utf-8' }))
  const anchor = document.createElement('a')
  anchor.href = href
  anchor.download = `novel-fish-backup-${new Date().toISOString().slice(0, 10)}.json`
  anchor.hidden = true
  document.body.append(anchor)
  try { anchor.click() }
  finally {
    anchor.remove()
    setTimeout(() => URL.revokeObjectURL(href), 1000)
  }
}
