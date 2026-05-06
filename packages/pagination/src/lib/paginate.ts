import { KEYS, type TElement } from 'platejs';

import type { Measurer, Page, PageContext, PageRect } from './types';

import { marksFingerprint } from './internal/marks-fingerprint';

/**
 * Derive the page sequence from a flat list of top-level blocks.
 *
 * Variant A — render-overlay paginator. Walks the doc, calls
 * `measurer.measure(node, ctx)` per block, and bin-packs into page rects
 * honoring the `rect.contentHeight` budget. Page-break voids
 * (`type === KEYS.pageBreak`) are hard splits. Pages are derived; this
 * never mutates Slate state.
 *
 * Top-level `header`, `footer`, and `footnoteDefinition` blocks are
 * skipped — they render via the page chrome / footer well, not the body.
 *
 * @param doc Top-level Slate blocks (`editor.children`).
 * @param rect Resolved page geometry (see `resolvePageRect`).
 * @param ctx Per-document measurement context. `ctx.marksFingerprint` is
 *   the doc-level fallback when a block has no own marks.
 * @param measurer Pluggable height oracle. Inject a fake monospace one
 *   in tests; the React layer wires the DOM-backed measurer.
 */
export const paginate = (
  doc: TElement[],
  rect: PageRect,
  ctx: PageContext,
  measurer: Measurer
): Page[] => {
  const pages: Page[] = [];
  let current: TElement[] = [];
  let used = 0;
  let pageIndex = 0;

  const flush = (): void => {
    if (current.length === 0 && pages.length > 0) return;

    pages.push({
      footnotes: [],
      nodes: current,
      pageIndex,
      rect,
    });
    current = [];
    used = 0;
    pageIndex += 1;
  };

  for (const node of doc) {
    if (node.type === KEYS.pageBreak) {
      flush();
      continue;
    }
    if (
      node.type === KEYS.header ||
      node.type === KEYS.footer ||
      node.type === KEYS.footnoteDefinition
    ) {
      continue;
    }

    const nodeFingerprint = marksFingerprint(node) || ctx.marksFingerprint;
    const height = measurer.measure(node, {
      font: ctx.font,
      marksFingerprint: nodeFingerprint,
      width: rect.contentWidth,
    });

    if (height > rect.contentHeight && current.length === 0) {
      current.push(node);
      flush();
      continue;
    }
    if (used + height > rect.contentHeight && current.length > 0) {
      flush();
    }

    current.push(node);
    used += height;
  }

  flush();

  if (pages.length === 0) {
    pages.push({ footnotes: [], nodes: [], pageIndex: 0, rect });
  }

  return pages;
};
