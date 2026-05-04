import type { SlateEditor } from 'platejs';

/**
 * Variant B invariant set, enforced by `withPagination` inside
 * `withNormalizeNode`:
 *
 * 1. Editor children are exclusively `section` elements.
 * 2. Each section's children are `[header?, ...body, footer?]`.
 * 3. Body blocks may contain `page_break` void elements; non-`manual` breaks
 *    are owned by the auto-paginator and may be inserted/removed at will.
 *
 * TODO: variant B — implement the invariant pass. See CR design choices on
 * issue #354 for ownership boundaries.
 */
export const enforceSectionInvariants = (_editor: SlateEditor): void => {
  // TODO: variant B — wrap loose root blocks into a `section`, ensure the
  // header/body/footer order, and dedupe contiguous page breaks.
};
