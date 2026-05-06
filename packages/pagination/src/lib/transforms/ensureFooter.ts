import type { SlateEditor, TElement } from 'platejs';

import { KEYS } from 'platejs';

/** Insert a default footer at the last index when none exists. */
export const ensureFooter = (editor: SlateEditor): void => {
  const footerType = editor.getType(KEYS.footer);

  if ((editor.children as TElement[]).some((n) => n.type === footerType))
    return;

  editor.tf.insertNodes(
    {
      children: [{ text: 'Footer' }],
      type: footerType,
    } as TElement,
    { at: [editor.children.length] }
  );
};
