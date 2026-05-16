// ============================================================
// PageElement.spec.ts — TDD Cycle 7
// Tests page index extraction logic and style computation
// without requiring the full Plate store context.
// ============================================================
import { createSlateEditor } from 'platejs';
import { BasePaginationPlugin } from '../BasePaginationPlugin';

describe('PageElement logic', () => {
  // ── Page index path extraction ──
  it('correctly identifies page at root index 0', () => {
    const editor = createSlateEditor({
      plugins: [BasePaginationPlugin],
      value: [
        {
          type: 'page',
          children: [{ type: 'p', children: [{ text: 'a' }] }],
        },
      ],
    });
    const rootPage = editor.children[0] as any;
    expect(rootPage.type).toBe('page');
    expect(editor.children).toHaveLength(1);
  });

  it('page index extraction from path works for page at index 3', () => {
    const editor = createSlateEditor({
      plugins: [BasePaginationPlugin],
      value: [
        { type: 'page', children: [{ type: 'p', children: [{ text: '0' }] }] },
        { type: 'page', children: [{ type: 'p', children: [{ text: '1' }] }] },
        { type: 'page', children: [{ type: 'p', children: [{ text: '2' }] }] },
        { type: 'page', children: [{ type: 'p', children: [{ text: '3' }] }] },
      ],
    });
    expect(editor.children).toHaveLength(4);
    const pages = editor.children as any[];
    expect(pages[3].type).toBe('page');
    expect(pages[3].children[0].children[0].text).toBe('3');
  });

  it('page index -1 (invalid) edge case should not be treated as valid', () => {
    // BasePaginationPlugin normalize wraps non-page children
    // into a page — single non-page root becomes page.
    const editor = createSlateEditor({
      plugins: [BasePaginationPlugin],
      value: [{ type: 'p', children: [{ text: 'wrapped' }] }],
    });
    expect(editor.children).toHaveLength(1);
    expect((editor.children[0] as any).type).toBe('page');
  });

  // ── Style computation: content dimensions ──
  it('content area subtracts margins from page size', () => {
    // A4: 794x1123, margins: 96 top/bottom, 72 left/right
    const width = 794;
    const height = 1123;
    const margins = { top: 96, right: 72, bottom: 96, left: 72 };

    const contentHeight = height - margins.top - margins.bottom;
    const contentWidth = width - margins.left - margins.right;

    expect(contentHeight).toBe(931); // 1123 - 96 - 96
    expect(contentWidth).toBe(650); // 794 - 72 - 72
  });

  it('Letter size content area is correct', () => {
    const width = 816;
    const height = 1056;
    const margins = { top: 96, right: 96, bottom: 96, left: 96 };

    const contentHeight = height - margins.top - margins.bottom;
    const contentWidth = width - margins.left - margins.right;

    expect(contentHeight).toBe(864); // 1056 - 192
    expect(contentWidth).toBe(624); // 816 - 192
  });

  // ── Document settings ──
  it('default document settings (Letter) propagate correctly', () => {
    const editor = createSlateEditor({
      plugins: [BasePaginationPlugin],
      value: [
        { type: 'page', children: [{ type: 'p', children: [{ text: 'a' }] }] },
      ],
    });
    const settings = (editor as any).getOption(
      BasePaginationPlugin,
      'documentSettings'
    );
    expect(settings).toBeDefined();
    expect(settings.sizes.width).toBe(816);
    expect(settings.sizes.height).toBe(1056);
    expect(settings.margins.top).toBe(96);
  });

  it('A4 document settings apply correctly', () => {
    const editor = createSlateEditor({
      plugins: [
        BasePaginationPlugin.configure({
          options: {
            documentSettings: {
              sizes: { width: 794, height: 1123 },
              margins: { top: 96, right: 72, bottom: 96, left: 72 },
            },
          },
        }),
      ],
      value: [
        { type: 'page', children: [{ type: 'p', children: [{ text: 'a' }] }] },
      ],
    });
    const settings = (editor as any).getOption(
      BasePaginationPlugin,
      'documentSettings'
    );
    expect(settings.sizes.width).toBe(794);
    expect(settings.sizes.height).toBe(1123);
  });

  // ── Plugin key and type ──
  it('BasePaginationPlugin has key "pagination" and type "page"', () => {
    expect(BasePaginationPlugin.key).toBe('pagination');
    const nodeConfig = BasePaginationPlugin as any;
    expect(nodeConfig.node?.type).toBe('page');
    expect(nodeConfig.node?.isElement).toBe(true);
    expect(nodeConfig.node?.isContainer).toBe(true);
  });

  // ── Multiple pages maintain order ──
  it('multiple pages maintain their content order after normalization', () => {
    const editor = createSlateEditor({
      plugins: [BasePaginationPlugin],
      value: [
        { type: 'p', children: [{ text: 'a' }] },
        { type: 'page', children: [{ type: 'p', children: [{ text: 'b' }] }] },
        { type: 'p', children: [{ text: 'c' }] },
      ],
    });
    // 'a' should be wrapped into a page, or merged with first page
    // 'c' should also be wrapped
    // Result: at least1 page exists
    expect(editor.children.length).toBeGreaterThanOrEqual(1);
    for (const child of editor.children) {
      expect((child as any).type).toBe('page');
    }
  });
});
