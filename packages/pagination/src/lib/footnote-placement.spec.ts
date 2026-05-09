import { describe, expect, it } from 'bun:test';

import type { Page } from './types';

import { allocateFootnotes } from './allocate-footnotes';
import { canonicalFootnotePlacement } from './types';

describe('canonicalFootnotePlacement', () => {
  it('maps legacy aliases to the canonical names', () => {
    expect(canonicalFootnotePlacement('footer')).toBe('pageBottom');
    expect(canonicalFootnotePlacement('documentEnd')).toBe('docEnd');
  });

  it('passes the canonical OOXML modes through unchanged', () => {
    expect(canonicalFootnotePlacement('pageBottom')).toBe('pageBottom');
    expect(canonicalFootnotePlacement('docEnd')).toBe('docEnd');
    expect(canonicalFootnotePlacement('beneathText')).toBe('beneathText');
    expect(canonicalFootnotePlacement('sectEnd')).toBe('sectEnd');
  });
});

describe('allocateFootnotes', () => {
  const makePage = (pageIndex: number, referenceIds: string[]): Page => ({
    footnotes: [],
    nodes: [
      {
        children: referenceIds.map((id) => ({
          children: [{ text: '' }],
          identifier: id,
          type: 'footnoteReference',
        })),
        type: 'p',
      } as unknown as Page['nodes'][number],
    ],
    pageIndex,
    rect: { contentHeight: 100, contentWidth: 100, height: 100, width: 100 },
  });

  const def = (id: string) =>
    ({
      children: [{ text: `def-${id}` }],
      identifier: id,
      type: 'footnoteDefinition',
    }) as unknown as Page['footnotes'][number];

  it('pageBottom puts each definition on the page that holds the first reference', () => {
    const pages = [makePage(0, ['a']), makePage(1, ['b']), makePage(2, [])];
    const result = allocateFootnotes(pages, [def('a'), def('b')], 'pageBottom');

    expect(result[0].footnotes).toHaveLength(1);
    expect(result[1].footnotes).toHaveLength(1);
    expect(result[2].footnotes).toHaveLength(0);
  });

  it('docEnd accumulates every referenced definition on the last page', () => {
    const pages = [makePage(0, ['a']), makePage(1, ['b']), makePage(2, ['c'])];
    const result = allocateFootnotes(
      pages,
      [def('a'), def('b'), def('c')],
      'docEnd'
    );

    expect(result[0].footnotes).toHaveLength(0);
    expect(result[1].footnotes).toHaveLength(0);
    expect(result[2].footnotes).toHaveLength(3);
  });

  it('docEnd preserves reference order across pages', () => {
    const pages = [makePage(0, ['b']), makePage(1, ['a'])];
    const result = allocateFootnotes(pages, [def('a'), def('b')], 'docEnd');

    const ids = result[1].footnotes.map(
      (f) => (f as { identifier?: string }).identifier
    );
    expect(ids).toEqual(['b', 'a']);
  });

  it('docEnd dedupes references that appear on multiple pages', () => {
    const pages = [makePage(0, ['a', 'b']), makePage(1, ['a', 'c'])];
    const result = allocateFootnotes(
      pages,
      [def('a'), def('b'), def('c')],
      'docEnd'
    );

    expect(result[1].footnotes).toHaveLength(3);
  });

  it('returns input unchanged when there are no definitions', () => {
    const pages = [makePage(0, ['a'])];
    expect(allocateFootnotes(pages, [], 'docEnd')).toBe(pages);
  });

  it("'sectEnd' falls back to docEnd in v1", () => {
    const pages = [makePage(0, ['a']), makePage(1, [])];
    const result = allocateFootnotes(pages, [def('a')], 'sectEnd');

    expect(result[1].footnotes).toHaveLength(1);
    expect(result[0].footnotes).toHaveLength(0);
  });

  it("'beneathText' falls back to pageBottom in v1", () => {
    const pages = [makePage(0, ['a']), makePage(1, [])];
    const result = allocateFootnotes(pages, [def('a')], 'beneathText');

    expect(result[0].footnotes).toHaveLength(1);
    expect(result[1].footnotes).toHaveLength(0);
  });
});
