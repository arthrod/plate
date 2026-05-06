import type { SlateEditor, TElement } from 'platejs';

import { KEYS } from 'platejs';

/**
 * Single header at index 0; single footer at the last index. Anything else
 * is normalized away — keeps paste/undo from producing duplicates.
 *
 * Performs at most one mutation per call and returns `true` when something
 * was changed. The caller (`normalizeNode` override) re-queues by short-
 * circuiting so Slate triggers the next iteration with fresh indices —
 * this prevents stale-index loops and infinite normalization passes.
 */
export const enforceHeaderFooterInvariants = (editor: SlateEditor): boolean => {
  const headerType = editor.getType(KEYS.header);
  const footerType = editor.getType(KEYS.footer);
  const headerIdxs: number[] = [];
  const footerIdxs: number[] = [];

  (editor.children as TElement[]).forEach((n, i) => {
    if (n.type === headerType) headerIdxs.push(i);
    else if (n.type === footerType) footerIdxs.push(i);
  });

  if (headerIdxs.length > 1) {
    editor.tf.removeNodes({ at: [headerIdxs.at(-1)!] });

    return true;
  }
  if (headerIdxs[0] !== undefined && headerIdxs[0] !== 0) {
    editor.tf.moveNodes({ at: [headerIdxs[0]], to: [0] });

    return true;
  }
  if (footerIdxs.length > 1) {
    editor.tf.removeNodes({ at: [footerIdxs[0]] });

    return true;
  }

  const target = editor.children.length - 1;
  const lastFooter = footerIdxs.at(-1);

  if (lastFooter !== undefined && lastFooter !== target) {
    editor.tf.moveNodes({ at: [lastFooter], to: [target] });

    return true;
  }

  return false;
};
