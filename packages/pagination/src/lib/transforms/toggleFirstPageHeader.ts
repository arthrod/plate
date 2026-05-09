import type { SlateEditor, TElement } from 'platejs';

import { FIRST_PAGE_HEADER_KEY } from '../internal/keys';
import { ensureFirstPageHeader } from './ensureFirstPageHeader';
import { removeNodesByType } from './removeNodesByType';

/** Toggle the first-page header block; returns new presence. */
export const toggleFirstPageHeader = (editor: SlateEditor): boolean => {
  const type = editor.getType(FIRST_PAGE_HEADER_KEY);
  const present = (editor.children as TElement[]).some((n) => n.type === type);

  editor.tf.withoutNormalizing(() => {
    if (present) removeNodesByType(editor, type);
    else ensureFirstPageHeader(editor);
  });

  return !present;
};
