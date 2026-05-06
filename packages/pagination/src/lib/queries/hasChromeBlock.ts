import type { SlateEditor, TElement } from 'platejs';

import { KEYS } from 'platejs';

/** Whether a top-level `header` block currently exists in the doc. */
export const hasHeaderBlock = (editor: SlateEditor): boolean => {
  const headerType = editor.getType(KEYS.header);

  return (editor.children as TElement[]).some((n) => n.type === headerType);
};

/** Whether a top-level `footer` block currently exists in the doc. */
export const hasFooterBlock = (editor: SlateEditor): boolean => {
  const footerType = editor.getType(KEYS.footer);

  return (editor.children as TElement[]).some((n) => n.type === footerType);
};
