import type { SlateEditor, TElement } from 'platejs';

import { KEYS } from 'platejs';

/** Insert a hard page-break void at the current selection. */
export const insertPageBreak = (editor: SlateEditor): void => {
  editor.tf.insertNodes({
    children: [{ text: '' }],
    type: editor.getType(KEYS.pageBreak),
  } as TElement);
};
