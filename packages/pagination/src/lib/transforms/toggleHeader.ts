import type { SlateEditor, TElement } from 'platejs';

import { KEYS } from 'platejs';

import { ensureHeader } from './ensureHeader';
import { removeNodesByType } from './removeNodesByType';

/** Toggle the document-level header block; returns new presence. */
export const toggleHeader = (editor: SlateEditor): boolean => {
  const headerType = editor.getType(KEYS.header);
  const present = (editor.children as TElement[]).some(
    (n) => n.type === headerType
  );

  if (present) removeNodesByType(editor, headerType);
  else ensureHeader(editor);

  return !present;
};
