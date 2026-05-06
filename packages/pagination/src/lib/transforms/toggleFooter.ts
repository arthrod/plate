import type { SlateEditor, TElement } from 'platejs';

import { KEYS } from 'platejs';

import { ensureFooter } from './ensureFooter';
import { removeNodesByType } from './removeNodesByType';

/** Toggle the document-level footer block; returns new presence. */
export const toggleFooter = (editor: SlateEditor): boolean => {
  const footerType = editor.getType(KEYS.footer);
  const present = (editor.children as TElement[]).some(
    (n) => n.type === footerType
  );

  if (present) removeNodesByType(editor, footerType);
  else ensureFooter(editor);

  return !present;
};
