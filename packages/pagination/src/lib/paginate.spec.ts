import type { TElement } from 'platejs';

import type { Measurer, PageContext, PageRect } from './types';

import { allocateFootnotes } from './allocate-footnotes';
import { type PaginateOptions, paginate } from './paginate';

const RECT: PageRect = {
  contentHeight: 100,
  contentWidth: 600,
  height: 200,
  width: 800,
};

const CTX: PageContext = {
  font: '16px sans-serif',
  marksFingerprint: '',
  width: RECT.contentWidth,
};

const fixedHeight = (height: number): Measurer => ({
  measure: () => height,
});

const block = (id: string, type = 'p'): TElement =>
  ({ children: [{ text: id }], id, type }) as unknown as TElement;

const paginateDoc = (
  doc: TElement[],
  measurer: Measurer,
  options: Partial<Pick<PaginateOptions, 'footnotePlacement'>> = {}
) => paginate({ ctx: CTX, doc, measurer, rect: RECT, ...options });

it('returns one empty page for an empty doc', () => {
  const pages = paginateDoc([], fixedHeight(0));

  expect(pages).toHaveLength(1);
  expect(pages[0].nodes).toEqual([]);
});

it('packs blocks until the content budget is exceeded', () => {
  const doc = [block('a'), block('b'), block('c'), block('d')];
  const pages = paginateDoc(doc, fixedHeight(40));

  // 40+40 fits (80 ≤ 100); a third 40 would overflow → flush.
  expect(pages).toHaveLength(2);
  expect(
    pages[0].nodes.map((n) => (n as unknown as { id: string }).id)
  ).toEqual(['a', 'b']);
  expect(
    pages[1].nodes.map((n) => (n as unknown as { id: string }).id)
  ).toEqual(['c', 'd']);
});

it('flushes on a manual page-break void', () => {
  const doc = [
    block('a'),
    {
      children: [{ text: '' }],
      type: 'pageBreak',
    } as unknown as TElement,
    block('b'),
  ];
  const pages = paginateDoc(doc, fixedHeight(20));

  expect(pages).toHaveLength(2);
  expect((pages[0].nodes[0] as unknown as { id: string }).id).toBe('a');
  expect((pages[1].nodes[0] as unknown as { id: string }).id).toBe('b');
});

it('puts an oversized block on its own page', () => {
  const doc = [block('a'), block('big'), block('c')];
  const measure: Measurer = {
    measure: (n) => ((n as TElement & { id: string }).id === 'big' ? 1000 : 20),
  };
  const pages = paginateDoc(doc, measure);

  expect(
    pages.map((p) => p.nodes.map((n) => (n as unknown as { id: string }).id))
  ).toEqual([['a'], ['big'], ['c']]);
});

it('skips top-level header/footer/footnote-definition in footer footnote mode', () => {
  const doc = [
    { children: [], type: 'header' } as unknown as TElement,
    block('a'),
    { children: [], type: 'footer' } as unknown as TElement,
    {
      children: [],
      identifier: '1',
      type: 'footnoteDefinition',
    } as unknown as TElement,
  ];
  const pages = paginateDoc(doc, fixedHeight(20));

  expect(pages).toHaveLength(1);
  expect(
    pages[0].nodes.map((n) => (n as unknown as { id?: string }).id)
  ).toEqual(['a']);
});

it('keeps footnote definitions in document-end footnote mode', () => {
  const doc = [
    block('a'),
    {
      children: [],
      id: 'fn-1',
      identifier: '1',
      type: 'footnoteDefinition',
    } as unknown as TElement,
  ];
  const pages = paginateDoc(doc, fixedHeight(20), {
    footnotePlacement: 'documentEnd',
  });

  expect(
    pages[0].nodes.map((n) => (n as unknown as { id?: string }).id)
  ).toEqual(['a', 'fn-1']);
});

it('allocates footnote definitions to the page that references them', () => {
  const refBlock: TElement = {
    children: [
      { text: 'see ' },
      { children: [{ text: '' }], identifier: '1', type: 'footnoteReference' },
    ],
    type: 'p',
  } as unknown as TElement;
  const def: TElement = {
    children: [{ text: 'first definition' }],
    identifier: '1',
    type: 'footnoteDefinition',
  } as unknown as TElement;

  const pages = paginateDoc([refBlock, block('b')], fixedHeight(40));
  const allocated = allocateFootnotes(pages, [def]);

  expect(allocated[0].footnotes).toEqual([def]);
  expect(allocated[1]?.footnotes ?? []).toEqual([]);
});
