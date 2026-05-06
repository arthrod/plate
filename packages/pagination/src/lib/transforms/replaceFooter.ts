import type { Descendant, SlateEditor, TElement } from 'platejs';

import { KEYS } from 'platejs';

/**
 * Replace the top-level footer block with `content`, removing any existing
 * footer first and reinserting at the end of the doc.
 */
export const replaceFooter = (
  editor: SlateEditor,
  content: Descendant[]
): void => {
  const footerType = editor.getType(KEYS.footer);
  const idx = (editor.children as TElement[]).findIndex(
    (n) => n.type === footerType
  );

  if (idx >= 0) editor.tf.removeNodes({ at: [idx] });

  editor.tf.insertNodes(
    {
      children: content as TElement['children'],
      type: footerType,
    } as TElement,
    { at: [editor.children.length] }
  );
};
