import type { TElement } from 'platejs';

import type { Measurer, Page, PageContext } from './types';

/**
 * Derive the page sequence from a flat list of top-level blocks.
 *
 * Variant A — render-overlay paginator. The real implementation walks the
 * doc, calls `measurer.measure(node, ctx)` per block, and bin-packs into
 * page rects honoring header/footer/footnote-well reservations and any
 * `pageBreak` element as a hard split.
 *
 * Pages are derived; this never mutates Slate state.
 */
export const paginate = (
  _doc: TElement[],
  _ctx: PageContext,
  _measurer: Measurer
): Page[] => {
  // TODO: variant A — render-overlay paginator. See issue #353 and the
  // CodeRabbit Design Choices: render.afterEditable + footnote portal +
  // pretext height oracle keyed by (node.id, marks-fingerprint, font, width).
  return [];
};
