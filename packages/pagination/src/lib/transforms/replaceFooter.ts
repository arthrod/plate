import type { Descendant, SlateEditor, TElement } from 'platejs';

import { FOOTER_KEY } from '../internal/keys';
import { removeNodesByType } from './removeNodesByType';

/**
 * Replace the top-level footer block with `content`, removing any existing
 * footer(s) first and reinserting at the end of the doc.
 *
 * Wrapped in `withoutNormalizing` so the remove + insert lands as one atomic
 * step — otherwise the intermediate "no footer" state can fight with the
 * `enforceHeaderFooterInvariants` normalizer and stall.
 */
export const replaceFooter = (
  editor: SlateEditor,
  content: Descendant[]
): void => {
  editor.tf.withoutNormalizing(() => {
    const footerType = editor.getType(FOOTER_KEY);
    removeNodesByType(editor, footerType);

    editor.tf.insertNodes(
      {
        children: content as TElement['children'],
        type: footerType,
      } as TElement,
      { at: [editor.children.length] }
    );
  });
};
