import type { Descendant, SlateEditor, TElement } from 'platejs';

import { KEYS } from 'platejs';

/**
 * Replace the top-level header block with `content`, removing any existing
 * header first and reinserting at index 0.
 */
export const replaceHeader = (
  editor: SlateEditor,
  content: Descendant[]
): void => {
  const headerType = editor.getType(KEYS.header);
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
};
