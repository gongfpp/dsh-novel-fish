// 小说只作为纯文本呈现，不交给 Markdown / 数学 / 自动链接解析器。
export const NOVEL_STYLE = {
  fontSize: 'var(--dsh-content-font-size-secondary, 13px)',
  lineHeight: 'var(--dsh-content-line-height-secondary, 1.6)',
  color: 'var(--dsw-alias-label-tertiary)',
  whiteSpace: 'pre-wrap', overflowWrap: 'anywhere',
}
export const SEPARATOR_STYLE = {
  border: 0, borderTop: '1px solid var(--dsw-alias-border-l2)', margin: '10px 0 8px',
}

export function novelContent(status, hasBook, t) {
  if (status.kind === 'ready') return {
    label: t('chat.novel'), chapter: status.passage.chapterTitle || '',
    text: status.passage.text, index: status.index + 1,
  }
  const message = status.kind === 'loading' ? 'chat.loading' : status.kind === 'end' ? 'chat.end'
    : status.kind === 'error' ? 'chat.readError' : hasBook ? 'chat.switchHint' : 'chat.noBook'
  return { label: t('chat.novel'), chapter: '', text: t(message), role: status.kind === 'error' ? 'alert' : 'status' }
}
