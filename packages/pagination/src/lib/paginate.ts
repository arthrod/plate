import type { TElement } from 'platejs';

import type {
  BasePaginationOptions,
  Measurer,
  Page,
  PageContext,
  PageRect,
} from './types';

import {
  FOOTER_KEY,
  FOOTNOTE_DEFINITION_KEY,
  HEADER_KEY,
  PAGE_BREAK_KEY,
} from './internal/keys';
import { marksFingerprint } from './internal/marks-fingerprint';

export type PaginateOptions = Partial<
  Pick<BasePaginationOptions, 'footnotePlacement'>
> & {
  ctx: PageContext;
  doc: TElement[];
  measurer: Measurer;
  rect: PageRect;
};

/**
 * Derive the page sequence from a flat list of top-level blocks.
 *
 * Variant A — render-overlay paginator. Walks the doc, calls
 * `measurer.measure(node, ctx)` per block, and bin-packs into page rects
 * honoring the `rect.contentHeight` budget. Page-break voids
 * (`type === KEYS.pageBreak`) are hard splits. Pages are derived; this
 * never mutates Slate state.
 *
 * Top-level `header` and `footer` blocks are skipped because they render via
 * the page chrome. `footnoteDefinition` blocks are skipped only when
 * footnotes render in page footer wells.
 *
 * @param doc Top-level Slate blocks (`editor.children`).
 * @param rect Resolved page geometry (see `resolvePageRect`).
 * @param ctx Per-document measurement context. `ctx.marksFingerprint` is
 *   the doc-level fallback when a block has no own marks.
 * @param measurer Pluggable height oracle. Inject a fake monospace one
 *   in tests; the React layer wires the DOM-backed measurer.
 */
export const paginate = ({
  ctx,
  doc,
  footnotePlacement = 'footer',
  measurer,
  rect,
}: PaginateOptions): Page[] => {
  const pages: Page[] = [];
  let current: TElement[] = [];
  let used = 0;
  let pageIndex = 0;

  const flush = (forceBlankPage = false): void => {
    if (current.length === 0 && pages.length > 0 && !forceBlankPage) {
      return;
    }

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
    if (node.type === PAGE_BREAK_KEY) {
      // Explicit author break: emit a blank page if we're already at a
      // boundary (e.g. consecutive `<page-break/>` voids), otherwise close
      // the current page. Without `forceBlankPage`, the second break would
      // be silently dropped because `current` is empty.
      flush(true);
      continue;
    }
    if (
      node.type === HEADER_KEY ||
      node.type === FOOTER_KEY ||
      (footnotePlacement === 'footer' && node.type === FOOTNOTE_DEFINITION_KEY)
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
