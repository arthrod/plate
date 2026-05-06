import type { SlateEditor, TElement } from 'platejs';

import { KEYS } from 'platejs';

/**
 * Single header at index 0; single footer at the last index. Anything else
 * is normalized away — keeps paste/undo from producing duplicates.
 *
 * Two-phase to keep indices stable across mutations:
 *   1. Drop duplicate headers (keep first) and duplicate footers (keep last),
 *      removing from the highest index downward so prior indices stay valid.
 *   2. Re-scan the surviving header/footer and reposition with `moveNodes`.
 */
export const enforceHeaderFooterInvariants = (editor: SlateEditor): void => {
  const headerType = editor.getType(KEYS.header);
  const footerType = editor.getType(KEYS.footer);
  const initialHeaderIdxs: number[] = [];
  const initialFooterIdxs: number[] = [];

  (editor.children as TElement[]).forEach((n, i) => {
    if (n.type === headerType) initialHeaderIdxs.push(i);
    else if (n.type === footerType) initialFooterIdxs.push(i);
  });

  const removals: number[] = [];

  if (initialHeaderIdxs.length > 1) {
    removals.push(...initialHeaderIdxs.slice(1));
  }
  if (initialFooterIdxs.length > 1) {
    removals.push(...initialFooterIdxs.slice(0, -1));
  }

  removals.sort((a, b) => b - a);

  for (const idx of removals) {
    editor.tf.removeNodes({ at: [idx] });
  }

  let surviveHeaderIdx = -1;
  let surviveFooterIdx = -1;

  (editor.children as TElement[]).forEach((n, i) => {
    if (n.type === headerType && surviveHeaderIdx === -1) surviveHeaderIdx = i;
    if (n.type === footerType) surviveFooterIdx = i;
  });

  if (surviveHeaderIdx > 0) {
    editor.tf.moveNodes({ at: [surviveHeaderIdx], to: [0] });
  }

  const target = editor.children.length - 1;

  if (surviveFooterIdx !== -1 && surviveFooterIdx !== target) {
    editor.tf.moveNodes({ at: [surviveFooterIdx], to: [target] });
  }
};
