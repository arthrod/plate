import type { SlateEditor, TElement } from 'platejs';

import { FIRST_PAGE_HEADER_KEY, HEADER_KEY } from '../internal/keys';

/**
 * Insert a default first-page header when none exists.
 *
 * Slot is index 1 if a regular header is present, otherwise index 0; the
 * `enforceHeaderFooterInvariants` normalizer relocates as needed.
 */
export const ensureFirstPageHeader = (editor: SlateEditor): void => {
  const firstPageHeaderType = editor.getType(FIRST_PAGE_HEADER_KEY);
  const headerType = editor.getType(HEADER_KEY);
  const children = editor.children as TElement[];

  if (children.some((n) => n.type === firstPageHeaderType)) return;

  const hasHeader = children.some((n) => n.type === headerType);

  editor.tf.insertNodes(
    {
      children: [{ text: '' }],
      type: firstPageHeaderType,
    } as TElement,
    { at: [hasHeader ? 1 : 0] }
  );
};
