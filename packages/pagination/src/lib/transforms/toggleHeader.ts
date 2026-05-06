import type { SlateEditor, TElement } from 'platejs';

import { HEADER_KEY } from '../internal/keys';
import { ensureHeader } from './ensureHeader';
import { removeNodesByType } from './removeNodesByType';

/**
 * Toggle the document-level header block; returns new presence.
 *
 * Runs the insert/remove inside `withoutNormalizing` so the final tree shape
 * is committed in one pass — that gives the `enforceHeaderFooterInvariants`
 * normalizer a stable input to evaluate, instead of a half-applied state.
 */
export const toggleHeader = (editor: SlateEditor): boolean => {
  const headerType = editor.getType(HEADER_KEY);
  const present = (editor.children as TElement[]).some(
    (n) => n.type === headerType
  );

  editor.tf.withoutNormalizing(() => {
    if (present) removeNodesByType(editor, headerType);
    else ensureHeader(editor);
  });

  return !present;
};
