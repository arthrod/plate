import type { SlateEditor, TElement } from 'platejs';

import {
  FIRST_PAGE_FOOTER_KEY,
  FIRST_PAGE_HEADER_KEY,
  FOOTER_KEY,
  HEADER_KEY,
} from '../internal/keys';

/**
 * Enforce single-instance invariants on chrome nodes (header, footer,
 * firstPageHeader, firstPageFooter). Dedupes stray copies and snaps the
 * regular header to index 0; first-page chrome positioning relative to
 * regular chrome is corrected so dialog inserts land in the right slot.
 *
 * Footer position is intentionally unconstrained: pagination's `paginate()`
 * locates the footer by type, not tree index, so a trailing block after the
 * footer does not break correctness — and trying to keep the footer "last"
 * would loop with plugins that always append a trailing paragraph.
 *
 * Performs at most one mutation per call and returns `true` when something
 * was changed. The caller (`normalizeNode` override) re-queues by short-
 * circuiting so Slate triggers the next iteration with fresh indices —
 * avoids stale-index loops and infinite normalization passes.
 */
export const enforceHeaderFooterInvariants = (editor: SlateEditor): boolean => {
  const headerType = editor.getType(HEADER_KEY);
  const footerType = editor.getType(FOOTER_KEY);
  const firstPageHeaderType = editor.getType(FIRST_PAGE_HEADER_KEY);
  const firstPageFooterType = editor.getType(FIRST_PAGE_FOOTER_KEY);

  const headerIdxs: number[] = [];
  const footerIdxs: number[] = [];
  const fphIdxs: number[] = [];
  const fpfIdxs: number[] = [];

  (editor.children as TElement[]).forEach((n, i) => {
    if (n.type === headerType) headerIdxs.push(i);
    else if (n.type === footerType) footerIdxs.push(i);
    else if (n.type === firstPageHeaderType) fphIdxs.push(i);
    else if (n.type === firstPageFooterType) fpfIdxs.push(i);
  });

  // Phase 1 — dedupe (one mutation per pass).
  if (headerIdxs.length > 1) {
    editor.tf.removeNodes({ at: [headerIdxs.at(-1)!] });

    return true;
  }
  if (fphIdxs.length > 1) {
    editor.tf.removeNodes({ at: [fphIdxs.at(-1)!] });

    return true;
  }
  if (footerIdxs.length > 1) {
    editor.tf.removeNodes({ at: [footerIdxs[0]] });

    return true;
  }
  if (fpfIdxs.length > 1) {
    editor.tf.removeNodes({ at: [fpfIdxs[0]] });

    return true;
  }

  // Phase 2 — reposition (header to 0; first-page chrome relative to siblings).
  if (headerIdxs[0] !== undefined && headerIdxs[0] !== 0) {
    editor.tf.moveNodes({ at: [headerIdxs[0]], to: [0] });

    return true;
  }

  // First-page header should be immediately after regular header (or at 0).
  if (fphIdxs[0] !== undefined) {
    const expected = headerIdxs[0] !== undefined ? 1 : 0;
    if (fphIdxs[0] !== expected && fphIdxs[0] > expected) {
      editor.tf.moveNodes({ at: [fphIdxs[0]], to: [expected] });

      return true;
    }
  }

  // First-page footer should sit before regular footer when both exist.
  if (
    fpfIdxs[0] !== undefined &&
    footerIdxs[0] !== undefined &&
    fpfIdxs[0] > footerIdxs[0]
  ) {
    editor.tf.moveNodes({ at: [fpfIdxs[0]], to: [footerIdxs[0]] });

    return true;
  }

  return false;
};
