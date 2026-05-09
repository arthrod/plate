import type { TElement } from 'platejs';

import type { FootnotePlacement, Page } from './types';

import { FOOTNOTE_REFERENCE_KEY } from './internal/keys';

/**
 * Assign footnote definitions to per-page footer wells (`'footer'`) or
 * pile every definition onto the last page (`'documentEnd'`).
 *
 * - `'footer'` (default): greedy first-reference pass; a footnote referenced
 *   on multiple pages attaches to the first page that references it.
 * - `'documentEnd'`: every definition lands in the last page's `footnotes`
 *   array, regardless of which page references it.
 *
 * Returns a new `Page[]`; the input is not mutated.
 */
export const allocateFootnotes = (
  pages: Page[],
  footnotes: TElement[],
  placement: FootnotePlacement = 'footer'
): Page[] => {
  if (footnotes.length === 0) return pages;

  if (placement === 'documentEnd') {
    if (pages.length === 0) return pages;

    return pages.map((page, i) =>
      i === pages.length - 1 ? { ...page, footnotes: [...footnotes] } : page
    );
  }

  const byId = new Map<string, TElement>();
  for (const def of footnotes) {
    const id = (def as TElement & { identifier?: string }).identifier;
    if (typeof id === 'string') byId.set(id, def);
  }

  if (byId.size === 0) return pages;

  const claimed = new Set<string>();

  return pages.map((page) => {
    const allocated: TElement[] = [];

    for (const node of page.nodes) {
      collectReferenceIds(node, (id) => {
        if (claimed.has(id)) return;

        const def = byId.get(id);

        if (!def) return;

        claimed.add(id);
        allocated.push(def);
      });
    }

    return allocated.length > 0 ? { ...page, footnotes: allocated } : page;
  });
};

const collectReferenceIds = (
  node: { children?: unknown[]; identifier?: string; type?: string },
  visit: (identifier: string) => void
): void => {
  if (
    node.type === FOOTNOTE_REFERENCE_KEY &&
    typeof node.identifier === 'string'
  ) {
    visit(node.identifier);

    return;
  }
  if (!Array.isArray(node.children)) return;

  for (const child of node.children) {
    if (typeof child === 'object' && child !== null) {
      collectReferenceIds(
        child as { children?: unknown[]; identifier?: string; type?: string },
        visit
      );
    }
  }
};
