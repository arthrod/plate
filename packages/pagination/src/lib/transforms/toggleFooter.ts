import type { SlateEditor, TElement } from 'platejs';

import { FOOTER_KEY } from '../internal/keys';
import { ensureFooter } from './ensureFooter';
import { removeNodesByType } from './removeNodesByType';

/**
 * Toggle the document-level footer block; returns new presence.
 *
 * Runs the insert/remove inside `withoutNormalizing` so the final tree shape
 * is committed in one pass — that gives the `enforceHeaderFooterInvariants`
 * normalizer a stable input to evaluate, instead of a half-applied state.
 */
export const toggleFooter = (editor: SlateEditor): boolean => {
  const footerType = editor.getType(FOOTER_KEY);
  const present = (editor.children as TElement[]).some(
    (n) => n.type === footerType
  );

  editor.tf.withoutNormalizing(() => {
    if (present) removeNodesByType(editor, footerType);
    else ensureFooter(editor);
  });

  return !present;
};
