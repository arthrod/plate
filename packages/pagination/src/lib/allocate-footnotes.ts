import type { TElement } from 'platejs';

import type { FootnotePlacement, Page } from './types';

import { FOOTNOTE_REFERENCE_KEY } from './internal/keys';
import { canonicalFootnotePlacement } from './types';

let warnedBeneathText = false;
let warnedSectEnd = false;

/**
 * Assign footnote definitions to pages according to the configured placement.
 *
 * Modes (canonicalised via {@link canonicalFootnotePlacement}):
 *
 * - `pageBottom` — greedy per-page allocation in reference order. Every
 *   `footnoteReference` is matched against the document-level definition
 *   list; the definition lands on the page that holds the first reference.
 *   This is the historical behavior and the Word default.
 * - `docEnd` — all definitions accumulate on the document's last page in
 *   reference order. Definitions referenced multiple times still appear
 *   once.
 * - `beneathText` — accepted by the type, but the per-paragraph layout
 *   still requires paginate-time integration. Falls back to `pageBottom`
 *   with a one-time console warning.
 * - `sectEnd` — accepted but multi-section is a follow-up. Falls back to
 *   `docEnd` with a one-time console warning.
 *
 * Returns a new `Page[]` with `footnotes` populated. The input is not
 * mutated.
 */
export const allocateFootnotes = (
  pages: Page[],
  footnotes: TElement[],
  placement: FootnotePlacement = 'pageBottom'
): Page[] => {
  if (footnotes.length === 0 || pages.length === 0) return pages;

  const byId = new Map<string, TElement>();
  for (const def of footnotes) {
    const id = (def as TElement & { identifier?: string }).identifier;
    if (typeof id === 'string') byId.set(id, def);
  }

  if (byId.size === 0) return pages;

  const canonical = canonicalFootnotePlacement(placement);

  if (canonical === 'beneathText' && !warnedBeneathText) {
    warnedBeneathText = true;
    // eslint-disable-next-line no-console
    console.warn(
      "[plate-pagination] footnotePlacement 'beneathText' is not yet implemented; falling back to 'pageBottom'."
    );
  }
  if (canonical === 'sectEnd' && !warnedSectEnd) {
    warnedSectEnd = true;
    // eslint-disable-next-line no-console
    console.warn(
      "[plate-pagination] footnotePlacement 'sectEnd' is not yet implemented; falling back to 'docEnd'."
    );
  }

  if (canonical === 'docEnd' || canonical === 'sectEnd') {
    const referencedInOrder: TElement[] = [];
    const seen = new Set<string>();

    for (const page of pages) {
      for (const node of page.nodes) {
        collectReferenceIds(node, (id) => {
          if (seen.has(id)) return;

          const def = byId.get(id);

          if (!def) return;

          seen.add(id);
          referencedInOrder.push(def);
        });
      }
    }

    if (referencedInOrder.length === 0) return pages;

    const lastIndex = pages.length - 1;

    return pages.map((page, index) =>
      index === lastIndex ? { ...page, footnotes: referencedInOrder } : page
    );
  }

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
