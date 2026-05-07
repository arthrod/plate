import type { SlateEditor, TElement } from 'platejs';

import { FOOTER_KEY, HEADER_KEY } from '../internal/keys';

/**
 * Single header at index 0; single footer somewhere in the doc. Dedupes
 * stray copies and pulls a misplaced header to the top — keeps paste/undo
 * from producing duplicates without fighting other plugins (notably any
 * trailing-block plugin that requires the last child to be a paragraph).
 *
 * Performs at most one mutation per call and returns `true` when something
 * was changed. The caller (`normalizeNode` override) re-queues by short-
 * circuiting so Slate triggers the next iteration with fresh indices —
 * this prevents stale-index loops and infinite normalization passes.
 *
 * Footer position is intentionally unconstrained: pagination's `paginate()`
 * locates the footer by type, not by tree index, so a trailing paragraph
 * after the footer does not break correctness — and trying to keep the
 * footer "last" would loop with plugins that always append a trailing block.
 */
export const enforceHeaderFooterInvariants = (editor: SlateEditor): boolean => {
  const headerType = editor.getType(HEADER_KEY);
  const footerType = editor.getType(FOOTER_KEY);
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

  return false;
};
