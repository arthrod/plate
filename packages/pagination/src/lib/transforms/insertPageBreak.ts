import type { SlateEditor, TElement } from 'platejs';

import { PAGE_BREAK_KEY } from '../internal/keys';

/** Insert a hard page-break void at the current selection. */
export const insertPageBreak = (editor: SlateEditor): void => {
  editor.tf.insertNodes({
    children: [{ text: '' }],
    type: editor.getType(PAGE_BREAK_KEY),
  } as TElement);
};
