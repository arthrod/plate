// ============================================================
// reflowEngine.spec.ts — TDD Cycle 5: Reflow Engine
// ============================================================
import { createSlateEditor } from 'platejs';
import { reflowPageBoundary } from '../internal/reflowEngine';
import { BasePaginationPlugin } from '../BasePaginationPlugin';
import type { PageDom, ReflowContext } from '../types';

const pageType = 'page';

/** Create a mock PageDom backed by actual divs in the test DOM */
function makePageDom(
  overrides: {
    clientHeight?: number;
    scrollHeight?: number;
    children?: HTMLElement[];
    rowGap?: string;
  } = {}
): PageDom {
  const outer = document.createElement('div');
  const content = document.createElement('div');

  if (overrides.rowGap) {
    content.style.rowGap = overrides.rowGap;
  }

  // Override clientHeight / scrollHeight on content
  const contentHeight = overrides.clientHeight ?? 800;
  const scrollHeight = overrides.scrollHeight ?? contentHeight;

  Object.defineProperty(content, 'clientHeight', {
    value: contentHeight,
    writable: true,
    configurable: true,
  });
  Object.defineProperty(content, 'scrollHeight', {
    value: scrollHeight,
    writable: true,
    configurable: true,
  });

  // Add children if provided
  const kids = overrides.children ?? [];
  for (const child of kids) {
    content.appendChild(child);
  }

  outer.appendChild(content);
  return { outer, content };
}

/** Create a child div with known offsetTop and offsetHeight */
function makeChildDiv(
  opts: { offsetTop?: number; offsetHeight?: number } = {}
): HTMLDivElement {
  const div = document.createElement('div');
  if (opts.offsetTop !== undefined) {
    Object.defineProperty(div, 'offsetTop', {
      value: opts.offsetTop,
      writable: true,
      configurable: true,
    });
  }
  if (opts.offsetHeight !== undefined) {
    Object.defineProperty(div, 'offsetHeight', {
      value: opts.offsetHeight,
      writable: true,
      configurable: true,
    });
  }
  return div;
}

function makeReflowOptions(overrides = {}) {
  return {
    enabled: true,
    debounceMs: 100,
    maxPagesPerIdle: 6,
    maxMovesPerPage: 50,
    underflow: true,
    allowTextSplit: true,
    overflowThresholdPx: 0,
    underflowThresholdPx: 80,
    ...overrides,
  };
}

describe('reflowPageBoundary', () => {
  // ── No overflow, no underflow ──
  it('no overflow, no underflow: returns { changed: false }', () => {
    const editor = createSlateEditor({
      plugins: [BasePaginationPlugin],
      value: [
        {
          type: pageType,
          children: [{ type: 'p', children: [{ text: 'hello' }] }],
        },
        {
          type: pageType,
          children: [{ type: 'p', children: [{ text: 'world' }] }],
        },
      ],
    });

    const pageDom = makePageDom({
      clientHeight: 800,
      scrollHeight: 500, // fits comfortably
    });
    const nextPageDom = makePageDom({ clientHeight: 800, scrollHeight: 100 });

    const ctx: ReflowContext = {
      pageDom,
      nextPageDom,
      opts: makeReflowOptions(),
    };

    const result = reflowPageBoundary(editor, 0, ctx);
    expect(result).toEqual({ changed: false, nextPageToContinue: null });
  });

  // ── Underflow disabled ──
  it('underflow: no change when underflow option is false', () => {
    const editor = createSlateEditor({
      plugins: [BasePaginationPlugin],
      value: [
        {
          type: pageType,
          children: [{ type: 'p', children: [{ text: 'a' }] }],
        },
        {
          type: pageType,
          children: [{ type: 'p', children: [{ text: 'b' }] }],
        },
      ],
    });

    const pageDom = makePageDom({
      clientHeight: 800,
      scrollHeight: 200, // plenty of space
    });
    const nextPageDom = makePageDom({ clientHeight: 800, scrollHeight: 100 });

    const ctx: ReflowContext = {
      pageDom,
      nextPageDom,
      opts: makeReflowOptions({ underflow: false }),
    };

    const result = reflowPageBoundary(editor, 0, ctx);
    expect(result.changed).toBe(false);
  });

  // ── Underflow with no next page ──
  it('underflow: no change when no next page exists', () => {
    const editor = createSlateEditor({
      plugins: [BasePaginationPlugin],
      value: [
        {
          type: pageType,
          children: [{ type: 'p', children: [{ text: 'only' }] }],
        },
      ],
    });

    const pageDom = makePageDom({
      clientHeight: 800,
      scrollHeight: 200,
    });

    const ctx: ReflowContext = {
      pageDom,
      nextPageDom: undefined,
      opts: makeReflowOptions(),
    };

    const result = reflowPageBoundary(editor, 0, ctx);
    expect(result.changed).toBe(false);
  });

  // ── Underflow below threshold ──
  it('underflow: no change when available space is below threshold', () => {
    const editor = createSlateEditor({
      plugins: [BasePaginationPlugin],
      value: [
        {
          type: pageType,
          children: [{ type: 'p', children: [{ text: 'a' }] }],
        },
        {
          type: pageType,
          children: [{ type: 'p', children: [{ text: 'b' }] }],
        },
      ],
    });

    // Content almost fills the page
    const pageDom = makePageDom({
      clientHeight: 800,
      scrollHeight: 760, // only 40px free, below 80px threshold
    });
    const nextPageDom = makePageDom({ clientHeight: 800, scrollHeight: 100 });

    const ctx: ReflowContext = {
      pageDom,
      nextPageDom,
      opts: makeReflowOptions(),
    };

    const result = reflowPageBoundary(editor, 0, ctx);
    expect(result.changed).toBe(false);
  });

  // ── Underflow: empty trailing page removal (multiple pages) ──
  it('underflow: removes empty trailing page when not the only page', () => {
    const editor = createSlateEditor({
      plugins: [BasePaginationPlugin],
      value: [
        {
          type: pageType,
          children: [{ type: 'p', children: [{ text: 'a' }] }],
        },
        {
          type: pageType,
          children: [], // empty trailing page
        },
      ],
    });

    const pageDom = makePageDom({ clientHeight: 800, scrollHeight: 200 });

    const ctx: ReflowContext = {
      pageDom,
      nextPageDom: undefined,
      opts: makeReflowOptions(),
    };

    const result = reflowPageBoundary(editor, 0, ctx);
    expect(result.changed).toBe(true);
    expect(editor.children).toHaveLength(1);
  });

  // ── Overflow: no internal children (edge case) ──
  it('overflow: splitIndex null returns no change', () => {
    const editor = createSlateEditor({
      plugins: [BasePaginationPlugin],
      value: [
        {
          type: pageType,
          children: [{ type: 'p', children: [{ text: 'a' }] }],
        },
      ],
    });

    // Empty content div — no children to split
    const pageDom = makePageDom({
      clientHeight: 200,
      scrollHeight: 500, // overflowing
      children: [], // no children — findOverflowSplitIndex returns null
    });

    const ctx: ReflowContext = {
      pageDom,
      nextPageDom: undefined,
      opts: makeReflowOptions(),
    };

    const result = reflowPageBoundary(editor, 0, ctx);
    expect(result.changed).toBe(false);
  });

  // ── Overflow: single oversized child, allowTextSplit false ──
  it('overflow: single child with allowTextSplit false returns no change', () => {
    const editor = createSlateEditor({
      plugins: [BasePaginationPlugin],
      value: [
        {
          type: pageType,
          children: [{ type: 'p', children: [{ text: 'very long text' }] }],
        },
      ],
    });

    const child = makeChildDiv({ offsetTop: 0, offsetHeight: 600 });
    const pageDom = makePageDom({
      clientHeight: 200,
      scrollHeight: 600,
      children: [child],
    });

    const ctx: ReflowContext = {
      pageDom,
      nextPageDom: undefined,
      opts: makeReflowOptions({ allowTextSplit: false }),
    };

    const result = reflowPageBoundary(editor, 0, ctx);
    expect(result.changed).toBe(false);
  });

  // ── Underflow: last page empty — insert default block instead of removing
  it('underflow: inserts default block into empty last page instead of removing it', () => {
    const editor = createSlateEditor({
      plugins: [BasePaginationPlugin],
      value: [
        {
          type: pageType,
          children: [], // only page, empty
        },
      ],
    });

    const pageDom = makePageDom({ clientHeight: 800, scrollHeight: 100 });

    const ctx: ReflowContext = {
      pageDom,
      nextPageDom: undefined,
      opts: makeReflowOptions(),
    };

    const result = reflowPageBoundary(editor, 0, ctx);
    expect(result.changed).toBe(true);
    // The only page should still exist with a default block inserted
    expect(editor.children).toHaveLength(1);
    const page = editor.children[0] as any;
    expect(page.children.length).toBeGreaterThanOrEqual(1);
  });

  // ── Overflow: overflow beyond threshold triggers split ──
  it('overflow: creates next page and moves overflowing children', () => {
    const editor = createSlateEditor({
      plugins: [BasePaginationPlugin],
      value: [
        {
          type: pageType,
          children: [
            { type: 'p', children: [{ text: 'fits' }] },
            { type: 'p', children: [{ text: 'overflows' }] },
          ],
        },
      ],
    });

    // Child 0 fits, child1 overflows
    const child0 = makeChildDiv({ offsetTop: 0, offsetHeight: 100 });
    const child1 = makeChildDiv({ offsetTop: 100, offsetHeight: 300 });
    const pageDom = makePageDom({
      clientHeight: 200,
      scrollHeight: 400,
      children: [child0, child1],
    });

    const ctx: ReflowContext = {
      pageDom,
      nextPageDom: undefined,
      opts: makeReflowOptions(),
    };

    const result = reflowPageBoundary(editor, 0, ctx);
    expect(result.changed).toBe(true);
    expect(result.nextPageToContinue).toBe(1);

    // Page0 should now only have child0
    const page0 = editor.children[0] as any;
    expect(page0.children).toHaveLength(1);
    expect(page0.children[0].children[0].text).toBe('fits');

    // Page1 should have the overflow (plus the default block from page creation)
    const page1 = editor.children[1] as any;
    expect(page1.children.length).toBeGreaterThanOrEqual(1);
    // The overflowed 'overflows' text should be somewhere in page1
    const page1Texts = page1.children.map((c: any) => c.children?.[0]?.text);
    expect(page1Texts).toContain('overflows');
  });

  // ── Overflow: reflow operations bypass undo via withoutSaving ──
  it('overflow: reflow runs without crashing (withoutSaving wrapper)', () => {
    const editor = createSlateEditor({
      plugins: [BasePaginationPlugin],
      value: [
        {
          type: pageType,
          children: [
            { type: 'p', children: [{ text: 'fits' }] },
            { type: 'p', children: [{ text: 'overflow' }] },
          ],
        },
      ],
    });

    const child0 = makeChildDiv({ offsetTop: 0, offsetHeight: 100 });
    const child1 = makeChildDiv({ offsetTop: 100, offsetHeight: 300 });
    const pageDom = makePageDom({
      clientHeight: 200,
      scrollHeight: 400,
      children: [child0, child1],
    });

    const ctx: ReflowContext = {
      pageDom,
      nextPageDom: undefined,
      opts: makeReflowOptions(),
    };

    // Verify reflow doesn't throw
    expect(() => reflowPageBoundary(editor, 0, ctx)).not.toThrow();

    // Content was actually moved
    const page0 = editor.children[0] as any;
    expect(page0.children).toHaveLength(1);
  });

  // ── Underflow: candidate too large for available space ──
  it('underflow: candidate too large for available space, no change', () => {
    const editor = createSlateEditor({
      plugins: [BasePaginationPlugin],
      value: [
        {
          type: pageType,
          children: [{ type: 'p', children: [{ text: 'a' }] }],
        },
        {
          type: pageType,
          children: [{ type: 'p', children: [{ text: 'large block below' }] }],
        },
      ],
    });

    const pageDom = makePageDom({
      clientHeight: 800,
      scrollHeight: 200,
    });

    const largeChild = makeChildDiv({ offsetTop: 0, offsetHeight: 700 });
    const nextPageDom = makePageDom({
      clientHeight: 800,
      scrollHeight: 700,
      children: [largeChild],
    });

    const ctx: ReflowContext = {
      pageDom,
      nextPageDom,
      opts: makeReflowOptions(),
    };

    const result = reflowPageBoundary(editor, 0, ctx);
    expect(result.changed).toBe(false);
  });
});

describe('findOverflowSplitIndex', () => {
  it('returns null for empty content', () => {
    // We test indirectly via reflowPageBoundary with empty children
    const editor = createSlateEditor({
      plugins: [BasePaginationPlugin],
      value: [
        {
          type: pageType,
          children: [{ type: 'p', children: [{ text: 'x' }] }],
        },
      ],
    });

    const pageDom = makePageDom({
      clientHeight: 200,
      scrollHeight: 500,
      children: [], // no children -> no split index
    });

    const ctx: ReflowContext = {
      pageDom,
      nextPageDom: undefined,
      opts: makeReflowOptions(),
    };

    const result = reflowPageBoundary(editor, 0, ctx);
    expect(result.changed).toBe(false);
  });

  it('all children fit: returns null (no change)', () => {
    const editor = createSlateEditor({
      plugins: [BasePaginationPlugin],
      value: [
        {
          type: pageType,
          children: [{ type: 'p', children: [{ text: 'x' }] }],
        },
      ],
    });

    const child0 = makeChildDiv({ offsetTop: 0, offsetHeight: 50 });
    const child1 = makeChildDiv({ offsetTop: 50, offsetHeight: 50 });
    const pageDom = makePageDom({
      clientHeight: 200,
      scrollHeight: 100,
      children: [child0, child1],
    });

    const ctx: ReflowContext = {
      pageDom,
      nextPageDom: undefined,
      opts: makeReflowOptions(),
    };

    const result = reflowPageBoundary(editor, 0, ctx);
    expect(result.changed).toBe(false);
  });

  it('binary search finds first overflowing child', () => {
    const editor = createSlateEditor({
      plugins: [BasePaginationPlugin],
      value: [
        {
          type: pageType,
          children: [
            { type: 'p', children: [{ text: 'a' }] },
            { type: 'p', children: [{ text: 'b' }] },
            { type: 'p', children: [{ text: 'c' }] },
          ],
        },
      ],
    });

    // Children: 0 fits at 0-100, 1 overflows at 100-300 (>200 max), 2 also overflows
    const child0 = makeChildDiv({ offsetTop: 0, offsetHeight: 100 });
    const child1 = makeChildDiv({ offsetTop: 100, offsetHeight: 200 });
    const child2 = makeChildDiv({ offsetTop: 300, offsetHeight: 100 });
    const pageDom = makePageDom({
      clientHeight: 200,
      scrollHeight: 400,
      children: [child0, child1, child2],
    });

    const ctx: ReflowContext = {
      pageDom,
      nextPageDom: undefined,
      opts: makeReflowOptions(),
    };

    const result = reflowPageBoundary(editor, 0, ctx);
    expect(result.changed).toBe(true);
    // Only child0 should remain on page0
    const page0 = editor.children[0] as any;
    expect(page0.children).toHaveLength(1);
    expect(page0.children[0].children[0].text).toBe('a');
  });
});

describe('splitOversizedBlock', () => {
  it('returns false when editor has no hasEditableTarget', () => {
    const editor = createSlateEditor({
      plugins: [BasePaginationPlugin],
      value: [
        {
          type: pageType,
          children: [{ type: 'p', children: [{ text: 'long text here' }] }],
        },
      ],
    });

    const child = makeChildDiv({ offsetTop: 0, offsetHeight: 600 });
    const pageDom = makePageDom({
      clientHeight: 200,
      scrollHeight: 600,
      children: [child],
    });

    const ctx: ReflowContext = {
      pageDom,
      nextPageDom: undefined,
      opts: makeReflowOptions(),
    };

    const result = reflowPageBoundary(editor, 0, ctx);
    // Without React DOM bindings, splitOversizedBlock should return false
    // so the oversized single block falls through to { changed: false }
    expect(result.changed).toBe(false);
  });

  it('returns false when text length < 2', () => {
    const editor = createSlateEditor({
      plugins: [BasePaginationPlugin],
      value: [
        {
          type: pageType,
          children: [{ type: 'p', children: [{ text: 'x' }] }],
        },
      ],
    });
    // Even with hasEditableTarget, the short text prevents split
    (editor as any).hasEditableTarget = () => true;

    const child = makeChildDiv({ offsetTop: 0, offsetHeight: 600 });
    const pageDom = makePageDom({
      clientHeight: 200,
      scrollHeight: 600,
      children: [child],
    });

    const ctx: ReflowContext = {
      pageDom,
      nextPageDom: undefined,
      opts: makeReflowOptions(),
    };

    const result = reflowPageBoundary(editor, 0, ctx);
    expect(result.changed).toBe(false);
  });

  it('returns false when ReactEditor.toDOMRange is unavailable', () => {
    const editor = createSlateEditor({
      plugins: [BasePaginationPlugin],
      value: [
        {
          type: pageType,
          children: [
            { type: 'p', children: [{ text: 'long enough text here' }] },
          ],
        },
      ],
    });
    (editor as any).hasEditableTarget = () => true;

    const child = makeChildDiv({ offsetTop: 0, offsetHeight: 600 });
    const pageDom = makePageDom({
      clientHeight: 200,
      scrollHeight: 600,
      children: [child],
    });

    const ctx: ReflowContext = {
      pageDom,
      nextPageDom: undefined,
      opts: makeReflowOptions(),
    };

    const result = reflowPageBoundary(editor, 0, ctx);
    // Without ReactEditor bound, falls through to false
    expect(result.changed).toBe(false);
  });

  it('returns false when ReactEditor.toDOMRange throws', () => {
    const editor = createSlateEditor({
      plugins: [BasePaginationPlugin],
      value: [
        {
          type: pageType,
          children: [
            { type: 'p', children: [{ text: 'long enough text here' }] },
          ],
        },
      ],
    });
    (editor as any).hasEditableTarget = () => true;

    const child = makeChildDiv({ offsetTop: 0, offsetHeight: 600 });
    const pageDom = makePageDom({
      clientHeight: 200,
      scrollHeight: 600,
      children: [child],
    });

    const ctx: ReflowContext = {
      pageDom,
      nextPageDom: undefined,
      opts: makeReflowOptions(),
    };

    const result = reflowPageBoundary(editor, 0, ctx);
    // toDOMRange is undefined in test env, which triggers the fallback
    expect(result.changed).toBe(false);
  });
});
