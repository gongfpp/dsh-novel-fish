// Project Gutenberg License §1.E.1, with only the source's line wrapping removed.
export const PG_NOTICE = 'This eBook is for the use of anyone anywhere in the United States and most other parts of the world at no cost and with almost no restrictions whatsoever. You may copy it, give it away or re-use it under the terms of the Project Gutenberg™ License included with this eBook or online at www.gutenberg.org. If you are not located in the United States, you will have to check the laws of the country where you are located before using this eBook.'

// Separate from PASSAGE_STYLE: the notice must never be hidden inside the novel's
// scroll viewport or a collapsed details element. Both renderers share this style.
export const PG_NOTICE_STYLE = {
  margin: '8px 0', padding: '10px 12px',
  border: '1px solid var(--dsw-alias-border-l2)', borderRadius: '8px',
  fontSize: 'var(--dsh-content-font-size-secondary, 13px)', lineHeight: '1.6',
  color: 'var(--dsw-alias-label-primary, inherit)',
  whiteSpace: 'normal', overflowWrap: 'anywhere',
}

export const PG_LICENSE_LABEL = 'Full Project Gutenberg™ License (offline download)'
export const PG_LICENSE_DOWNLOAD = 'project-gutenberg-full-license.txt'

export function hasProjectGutenbergReference(text) {
  return /\bProject\s+Gutenberg\b/iu.test(String(text ?? ''))
}
