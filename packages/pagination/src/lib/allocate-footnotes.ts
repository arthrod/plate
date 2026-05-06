import { KEYS, type TElement } from 'platejs';

import type { Page } from './types';

/**
 * Greedy assignment of footnote definitions to per-page footer wells.
 *
 * Walks each page's blocks, collects every inline `footnoteReference` by its
 * `identifier` field, then attaches the matching definition (looked up in
 * the document-level definition list) to that page. Definitions referenced
 * on multiple pages attach to the first page that references them.
 *
 * Returns a new array of {@link Page} objects with `footnotes` populated.
 * The original `pages` argument is not mutated.
 */
export const allocateFootnotes = (
  pages: Page[],
  footnotes: TElement[]
): Page[] => {
  if (footnotes.length === 0) return pages;

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
    node.type === KEYS.footnoteReference &&
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
