import type { SlateEditor, TElement } from 'platejs';

import { KEYS } from 'platejs';

/** Insert a default header at index 0 when none exists. */
export const ensureHeader = (editor: SlateEditor): void => {
  const headerType = editor.getType(KEYS.header);

  if ((editor.children as TElement[]).some((n) => n.type === headerType))
    return;

  editor.tf.insertNodes(
    {
      children: [{ text: 'Header' }],
      type: headerType,
    } as TElement,
    { at: [0] }
  );
};
