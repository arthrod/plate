import type { SlateEditor, TElement } from 'platejs';

import { FIRST_PAGE_FOOTER_KEY, FOOTER_KEY } from '../internal/keys';

/**
 * Insert a default first-page footer when none exists.
 *
 * Slot is second-to-last when a regular footer exists, otherwise last; the
 * `enforceHeaderFooterInvariants` normalizer reorders as needed.
 */
export const ensureFirstPageFooter = (editor: SlateEditor): void => {
  const firstPageFooterType = editor.getType(FIRST_PAGE_FOOTER_KEY);
  const footerType = editor.getType(FOOTER_KEY);
  const children = editor.children as TElement[];

  if (children.some((n) => n.type === firstPageFooterType)) return;

  const footerIdx = children.findIndex((n) => n.type === footerType);
  const at = footerIdx >= 0 ? footerIdx : children.length;

  editor.tf.insertNodes(
    {
      children: [{ text: '' }],
      type: firstPageFooterType,
    } as TElement,
    { at: [at] }
  );
};
