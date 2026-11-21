// 小说只作为纯文本呈现，不交给 Markdown / 数学 / 自动链接解析器。
// 整块（标题、进度、正文、翻页）放在同一个方框里，和原生思考内容区分开。
export const BOX_STYLE = {
  marginTop: '10px',
  padding: '10px 12px 12px',
  border: '1px solid var(--dsw-alias-border-l2)',
  borderRadius: '10px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  whiteSpace: 'pre-wrap',
  overflowWrap: 'anywhere',
}
export const HEADER_STYLE = {
  display: 'flex',
  alignItems: 'baseline',
  gap: '8px',
  flexWrap: 'wrap',
}
export const TITLE_STYLE = {
  fontSize: '12px',
  fontWeight: '600',
  color: 'var(--dsw-alias-label-secondary)',
}
export const CHAPTER_STYLE = {
  fontSize: '12px',
  color: 'var(--dsw-alias-label-secondary)',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  maxWidth: '60%',
}
export const META_STYLE = {
  marginLeft: 'auto',
  fontSize: '11px',
  color: 'var(--dsw-alias-label-tertiary)',
  fontVariantNumeric: 'tabular-nums',
}
export const NEXT_STYLE = {
  appearance: 'none',
  border: '1px solid var(--dsw-alias-border-l2)',
  background: 'transparent',
  color: 'var(--dsw-alias-label-secondary)',
  font: 'inherit',
  fontSize: '12px',
  lineHeight: '1.2',
  padding: '3px 8px',
  borderRadius: '999px',
  cursor: 'pointer',
}
// 正文比原生思考更松、更亮：14px + 次级色，最多 60vh，长段落仍在框内滚动。
export const PASSAGE_STYLE = {
  fontSize: 'var(--dsh-content-font-size-secondary, 14px)',
  lineHeight: '1.8',
  color: 'var(--dsw-alias-label-secondary)',
  maxHeight: 'min(60vh, 32em)',
  overflowY: 'auto',
  scrollbarGutter: 'stable',
}

/**
 * 阅读框的展示模型：书名、章节、进度、正文一起返回，避免各处各自拼文案。
 * status 来自 store；book 是当前书籍快照（可能为空）。
 */
export function novelContent(status, book, t) {
  const title = book?.title || t('chat.novel')
  if (status.kind === 'ready') {
    return {
      label: title,
      chapter: status.passage.chapterTitle || '',
      meta: t('chat.progress', { index: status.index + 1, total: book?.segmentCount ?? 0 }),
      text: status.passage.text,
      index: status.index + 1,
      canContinue: true,
    }
  }
  const message = status.kind === 'loading' ? 'chat.loading' : status.kind === 'end' ? 'chat.end'
    : status.kind === 'error' ? 'chat.readError' : book ? 'chat.switchHint' : 'chat.noBook'
  return {
    label: title,
    chapter: '',
    meta: status.kind === 'end' && book ? t('chat.progress', { index: book.segmentCount, total: book.segmentCount }) : '',
    text: t(message),
    role: status.kind === 'error' ? 'alert' : 'status',
  }
}
