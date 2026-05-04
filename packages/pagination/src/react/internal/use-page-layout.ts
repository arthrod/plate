import { useMemo } from 'react';

import type { Page } from '../../lib/types';

/**
 * Resolve the derived page sequence for the current document.
 *
 * Variant A — pure projection over `editor.children`: changes to the doc
 * recompute pages, but no Slate state is written.
 */
export const usePageLayout = (): Page[] => {
  // TODO: variant A — read `editor.children`, the resolved
  // `BasePaginationOptions`, and `usePretextMeasurer()`, then call
  // `paginate(doc, ctx, measurer)` followed by `allocateFootnotes(...)`.
  return useMemo<Page[]>(() => [], []);
};
