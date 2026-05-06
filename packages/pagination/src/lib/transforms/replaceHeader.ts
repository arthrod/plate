import type { Descendant, SlateEditor, TElement } from 'platejs';

import { HEADER_KEY } from '../internal/keys';

/**
 * Replace the top-level header block with `content`, removing any existing
 * header first and reinserting at index 0.
 *
 * Wrapped in `withoutNormalizing` so the remove + insert lands as one atomic
 * step — otherwise the intermediate "no header" state can fight with the
 * `enforceHeaderFooterInvariants` normalizer and stall.
 */
export const replaceHeader = (
  editor: SlateEditor,
  content: Descendant[]
): void => {
  editor.tf.withoutNormalizing(() => {
    const headerType = editor.getType(HEADER_KEY);
    const idx = (editor.children as TElement[]).findIndex(
      (n) => n.type === headerType
    );

    if (idx >= 0) editor.tf.removeNodes({ at: [idx] });

    editor.tf.insertNodes(
      {
        children: content as TElement['children'],
        type: headerType,
      } as TElement,
      { at: [0] }
    );
  });
};
