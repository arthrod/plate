import type { SlateEditor, TElement } from 'platejs';

import { FIRST_PAGE_FOOTER_KEY } from '../internal/keys';
import { ensureFirstPageFooter } from './ensureFirstPageFooter';
import { removeNodesByType } from './removeNodesByType';

/** Toggle the first-page footer block; returns new presence. */
export const toggleFirstPageFooter = (editor: SlateEditor): boolean => {
  const type = editor.getType(FIRST_PAGE_FOOTER_KEY);
  const present = (editor.children as TElement[]).some((n) => n.type === type);

  editor.tf.withoutNormalizing(() => {
    if (present) removeNodesByType(editor, type);
    else ensureFirstPageFooter(editor);
  });

  return !present;
};
