import type { Descendant, SlateEditor, TElement } from 'platejs';

import { FIRST_PAGE_FOOTER_KEY, FOOTER_KEY } from '../internal/keys';
import { removeNodesByType } from './removeNodesByType';

/**
 * Replace the first-page footer with `content`; positions before any
 * regular footer when present, otherwise at the doc end.
 */
export const replaceFirstPageFooter = (
  editor: SlateEditor,
  content: Descendant[]
): void => {
  editor.tf.withoutNormalizing(() => {
    const firstPageFooterType = editor.getType(FIRST_PAGE_FOOTER_KEY);
    const footerType = editor.getType(FOOTER_KEY);
    removeNodesByType(editor, firstPageFooterType);

    const children = editor.children as TElement[];
    const footerIdx = children.findIndex((n) => n.type === footerType);
    const at = footerIdx >= 0 ? footerIdx : children.length;

    editor.tf.insertNodes(
      {
        children: content as TElement['children'],
        type: firstPageFooterType,
      } as TElement,
      { at: [at] }
    );
  });
};
