import type { SlateEditor, TElement } from 'platejs';

import {
  FIRST_PAGE_FOOTER_KEY,
  FIRST_PAGE_HEADER_KEY,
  FOOTER_KEY,
  HEADER_KEY,
} from '../internal/keys';

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

/** Whether a top-level `firstPageHeader` block currently exists. */
export const hasFirstPageHeaderBlock = (editor: SlateEditor): boolean => {
  const type = editor.getType(FIRST_PAGE_HEADER_KEY);

  return (editor.children as TElement[]).some((n) => n.type === type);
};

/** Whether a top-level `firstPageFooter` block currently exists. */
export const hasFirstPageFooterBlock = (editor: SlateEditor): boolean => {
  const type = editor.getType(FIRST_PAGE_FOOTER_KEY);

  return (editor.children as TElement[]).some((n) => n.type === type);
};
