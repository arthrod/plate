import type { SlatePluginContext } from 'platejs';

import type { BasePaginationConfig } from '../types';

/**
 * Variant B invariant set, enforced by `withPagination` inside
 * `withNormalizeNode`:
 *
 * 1. Editor children are exclusively `section` elements.
 * 2. Each section's children are `[header?, ...body, footer?]`.
 * 3. Body blocks may contain `page_break` void elements; non-`manual` breaks
 *    are owned by the auto-paginator and may be inserted/removed at will.
 *
 * The wrap-loose-blocks branch is gated by
 * `getOptions().autoEnforceSections` (default `false`) so adopting this
 * plugin against existing content does not silently rewrite the document on
 * first edit.
 *
 * TODO(#358): variant B — implement the invariant pass. See CR design choices
 * on issue #354 for ownership boundaries.
 */
export const enforceSectionInvariants = (
  ctx: SlatePluginContext<BasePaginationConfig>
): void => {
  if (!ctx.getOptions().autoEnforceSections) return;

  // TODO(#358): variant B — wrap loose root blocks into a `section`, ensure
  // the header/body/footer order, and dedupe contiguous page breaks.
};
