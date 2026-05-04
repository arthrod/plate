import type { TElement } from 'platejs';

import type { Page } from './types';

/**
 * Greedy bin-pack of footnote definitions into per-page footer wells.
 *
 * Variant A walks each page, finds inline footnote references, then assigns
 * their definitions to the same page's footer well — overflowing later
 * definitions onto subsequent pages and triggering a re-flow upstream when
 * the well grows past `BasePaginationOptions.footnoteWell`.
 */
export const allocateFootnotes = (
  pages: Page[],
  _footnotes: TElement[]
): Page[] => {
  // TODO: variant A — allocator that hides definitions in flow via
  // visibility:hidden and portals them into the per-page footer well.
  return pages;
};
