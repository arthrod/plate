import type { Descendant, SlateEditor, TElement } from 'platejs';

import { FIRST_PAGE_HEADER_KEY, HEADER_KEY } from '../internal/keys';
import { removeNodesByType } from './removeNodesByType';

/**
 * Replace the first-page header block with `content`. Slot is index 1 if a
 * regular header exists, otherwise index 0; invariants normalizer reorders.
 */
export const replaceFirstPageHeader = (
  editor: SlateEditor,
  content: Descendant[]
): void => {
  editor.tf.withoutNormalizing(() => {
    const firstPageHeaderType = editor.getType(FIRST_PAGE_HEADER_KEY);
    const headerType = editor.getType(HEADER_KEY);
    removeNodesByType(editor, firstPageHeaderType);

    const hasHeader = (editor.children as TElement[]).some(
      (n) => n.type === headerType
    );

    editor.tf.insertNodes(
      {
        children: content as TElement['children'],
        type: firstPageHeaderType,
      } as TElement,
      { at: [hasHeader ? 1 : 0] }
    );
  });
};
