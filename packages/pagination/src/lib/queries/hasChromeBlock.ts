import type { SlateEditor, TElement } from 'platejs';

import { FOOTER_KEY, HEADER_KEY } from '../internal/keys';

/** Whether a top-level `header` block currently exists in the doc. */
export const hasHeaderBlock = (editor: SlateEditor): boolean => {
  const headerType = editor.getType(HEADER_KEY);

  return (editor.children as TElement[]).some((n) => n.type === headerType);
};

/** Whether a top-level `footer` block currently exists in the doc. */
export const hasFooterBlock = (editor: SlateEditor): boolean => {
  const footerType = editor.getType(FOOTER_KEY);

  return (editor.children as TElement[]).some((n) => n.type === footerType);
};
