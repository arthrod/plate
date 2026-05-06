import { createSlateEditor, KEYS } from 'platejs';

import {
  BaseFooterPlugin,
  BaseHeaderPlugin,
  BasePageBreakPlugin,
  BasePaginationPlugin,
} from './index';

describe('BasePaginationPlugins', () => {
  it('configures the page-break element as an inline-level void block', () => {
    const editor = createSlateEditor({
      plugins: [BasePaginationPlugin],
    } as any);
    const plugin = editor.getPlugin(BasePageBreakPlugin);

    expect(plugin.node).toMatchObject({
      isElement: true,
      isVoid: true,
    });
    expect(plugin.node.isInline).toBeUndefined();
  });

  it('configures header and footer as block elements', () => {
    const editor = createSlateEditor({
      plugins: [BasePaginationPlugin],
    } as any);
    const headerPlugin = editor.getPlugin(BaseHeaderPlugin);
    const footerPlugin = editor.getPlugin(BaseFooterPlugin);

    expect(headerPlugin.node).toMatchObject({ isElement: true });
    expect(headerPlugin.node.isInline).toBeUndefined();
    expect(headerPlugin.node.isVoid).toBeUndefined();

    expect(footerPlugin.node).toMatchObject({ isElement: true });
    expect(footerPlugin.node.isInline).toBeUndefined();
    expect(footerPlugin.node.isVoid).toBeUndefined();
  });

  it('exposes the documented option defaults', () => {
    const editor = createSlateEditor({
      plugins: [BasePaginationPlugin],
    } as any);
    const plugin = editor.getPlugin(BasePaginationPlugin);

    expect(plugin.options.pageSize).toBe('A4');
    expect(plugin.options.margins).toEqual({
      bottom: 72,
      left: 72,
      right: 72,
      top: 72,
    });
    expect(plugin.options.headerHeight).toBe(48);
    expect(plugin.options.footerHeight).toBe(48);
    expect(plugin.options.footnoteWell).toBe(0);
    expect(plugin.options.includeFootnoteSubPlugins).toBe(true);
    expect(plugin.options.previewVisible).toBe(true);
  });

  it('provides pagination api and transforms on the editor', () => {
    const editor = createSlateEditor({
      plugins: [BasePaginationPlugin],
    } as any);
    const api = (editor.api as any).pagination;
    const tf = (editor.tf as any).pagination;

    expect(api).toBeDefined();
    expect(typeof api.getPages).toBe('function');
    expect(typeof api.getPageOf).toBe('function');
    expect(typeof api.getFootnotes).toBe('function');
    expect(typeof api.hasHeader).toBe('function');
    expect(typeof api.hasFooter).toBe('function');

    expect(tf).toBeDefined();
    expect(typeof tf.insertPageBreak).toBe('function');
    expect(typeof tf.setHeader).toBe('function');
    expect(typeof tf.setFooter).toBe('function');
    expect(typeof tf.setMargins).toBe('function');
    expect(typeof tf.setPageSize).toBe('function');
    expect(typeof tf.toggleHeader).toBe('function');
    expect(typeof tf.toggleFooter).toBe('function');
    expect(typeof tf.togglePreview).toBe('function');
  });

  it('hasHeader/hasFooter reflect the live document', () => {
    const editor = createSlateEditor({
      plugins: [BasePaginationPlugin],
      value: [
        {
          children: [{ text: 'h' }],
          type: KEYS.header,
        },
        {
          children: [{ text: 'body' }],
          type: KEYS.p,
        },
        {
          children: [{ text: 'f' }],
          type: KEYS.footer,
        },
      ],
    } as any);

    expect((editor.api as any).pagination.hasHeader()).toBe(true);
    expect((editor.api as any).pagination.hasFooter()).toBe(true);
  });

  it('toggleHeader inserts a default header at index 0 when missing', () => {
    const editor = createSlateEditor({
      plugins: [BasePaginationPlugin],
      value: [{ children: [{ text: 'body' }], type: KEYS.p }],
    } as any);

    expect((editor.tf as any).pagination.toggleHeader()).toBe(true);
    expect(editor.children[0]).toMatchObject({
      children: [{ text: 'Header' }],
      type: KEYS.header,
    });
    expect((editor.api as any).pagination.hasHeader()).toBe(true);
  });

  it('toggleHeader removes the existing header', () => {
    const editor = createSlateEditor({
      plugins: [BasePaginationPlugin],
      value: [
        { children: [{ text: 'h' }], type: KEYS.header },
        { children: [{ text: 'body' }], type: KEYS.p },
      ],
    } as any);

    expect((editor.tf as any).pagination.toggleHeader()).toBe(false);
    expect((editor.api as any).pagination.hasHeader()).toBe(false);
    expect(editor.children).toMatchObject([
      { children: [{ text: 'body' }], type: KEYS.p },
    ]);
  });

  it('toggleFooter inserts a default footer at the last index when missing', () => {
    const editor = createSlateEditor({
      plugins: [BasePaginationPlugin],
      value: [{ children: [{ text: 'body' }], type: KEYS.p }],
    } as any);

    expect((editor.tf as any).pagination.toggleFooter()).toBe(true);
    expect(editor.children.at(-1)).toMatchObject({
      children: [{ text: 'Footer' }],
      type: KEYS.footer,
    });
  });

  it('toggleFooter removes the existing footer', () => {
    const editor = createSlateEditor({
      plugins: [BasePaginationPlugin],
      value: [
        { children: [{ text: 'body' }], type: KEYS.p },
        { children: [{ text: 'f' }], type: KEYS.footer },
      ],
    } as any);

    expect((editor.tf as any).pagination.toggleFooter()).toBe(false);
    expect((editor.api as any).pagination.hasFooter()).toBe(false);
  });

  it('setHeader replaces the existing header content', () => {
    const editor = createSlateEditor({
      plugins: [BasePaginationPlugin],
      value: [
        { children: [{ text: 'old' }], type: KEYS.header },
        { children: [{ text: 'body' }], type: KEYS.p },
      ],
    } as any);

    (editor.tf as any).pagination.setHeader([{ text: 'new' }]);

    expect(editor.children[0]).toMatchObject({
      children: [{ text: 'new' }],
      type: KEYS.header,
    });
  });

  it('setFooter replaces the existing footer content', () => {
    const editor = createSlateEditor({
      plugins: [BasePaginationPlugin],
      value: [
        { children: [{ text: 'body' }], type: KEYS.p },
        { children: [{ text: 'old' }], type: KEYS.footer },
      ],
    } as any);

    (editor.tf as any).pagination.setFooter([{ text: 'new' }]);

    expect(editor.children.at(-1)).toMatchObject({
      children: [{ text: 'new' }],
      type: KEYS.footer,
    });
  });

  it('insertPageBreak inserts a page-break void at the selection', () => {
    const editor = createSlateEditor({
      plugins: [BasePaginationPlugin],
      selection: {
        anchor: { offset: 5, path: [0, 0] },
        focus: { offset: 5, path: [0, 0] },
      },
      value: [{ children: [{ text: 'hello' }], type: KEYS.p }],
    } as any);

    (editor.tf as any).pagination.insertPageBreak();

    expect(
      (editor.children as any[]).some((n) => n.type === KEYS.pageBreak)
    ).toBe(true);
  });

  it('setMargins / setPageSize update plugin options', () => {
    const editor = createSlateEditor({
      plugins: [BasePaginationPlugin],
    } as any);

    (editor.tf as any).pagination.setMargins({
      bottom: 1,
      left: 2,
      right: 3,
      top: 4,
    });
    (editor.tf as any).pagination.setPageSize('Letter');

    expect(editor.getOption(BasePaginationPlugin, 'margins')).toEqual({
      bottom: 1,
      left: 2,
      right: 3,
      top: 4,
    });
    expect(editor.getOption(BasePaginationPlugin, 'pageSize')).toBe('Letter');
  });

  it('setMargins merges a partial patch instead of replacing all sides', () => {
    const editor = createSlateEditor({
      plugins: [BasePaginationPlugin],
    } as any);

    (editor.tf as any).pagination.setMargins({ top: 95 });

    expect(editor.getOption(BasePaginationPlugin, 'margins')).toEqual({
      bottom: 72,
      left: 72,
      right: 72,
      top: 95,
    });
  });

  it('togglePreview flips and returns previewVisible', () => {
    const editor = createSlateEditor({
      plugins: [BasePaginationPlugin],
    } as any);
    const tf = (editor.tf as any).pagination;

    expect(tf.togglePreview()).toBe(false);
    expect(editor.getOption(BasePaginationPlugin, 'previewVisible')).toBe(
      false
    );
    expect(tf.togglePreview()).toBe(true);
    expect(editor.getOption(BasePaginationPlugin, 'previewVisible')).toBe(true);
  });

  it('normalizeNode enforces a single header at index 0 and a single footer last', () => {
    const editor = createSlateEditor({
      plugins: [BasePaginationPlugin],
      value: [
        { children: [{ text: 'body1' }], type: KEYS.p },
        { children: [{ text: 'h1' }], type: KEYS.header },
        { children: [{ text: 'h2' }], type: KEYS.header },
        { children: [{ text: 'f1' }], type: KEYS.footer },
        { children: [{ text: 'body2' }], type: KEYS.p },
        { children: [{ text: 'f2' }], type: KEYS.footer },
      ],
    } as any);

    editor.tf.normalize({ force: true });

    const headers = (editor.children as any[]).filter(
      (n) => n.type === KEYS.header
    );
    const footers = (editor.children as any[]).filter(
      (n) => n.type === KEYS.footer
    );

    expect(headers).toHaveLength(1);
    expect(footers).toHaveLength(1);
    expect((editor.children[0] as any).type).toBe(KEYS.header);
    expect((editor.children.at(-1) as any).type).toBe(KEYS.footer);
  });

  it('normalizeNode converges without throwing when toggling the footer on a live doc', () => {
    const editor = createSlateEditor({
      plugins: [BasePaginationPlugin],
      value: [{ children: [{ text: 'body' }], type: KEYS.p }],
    } as any);

    expect(() => {
      (editor.tf as any).pagination.toggleFooter();
    }).not.toThrow();

    expect((editor.children.at(-1) as any).type).toBe(KEYS.footer);

    expect(() => {
      (editor.tf as any).pagination.toggleFooter();
    }).not.toThrow();

    expect((editor.children as any[]).some((n) => n.type === KEYS.footer)).toBe(
      false
    );
  });

  it('normalizeNode collapses two pasted headers to a single header at index 0', () => {
    const editor = createSlateEditor({
      plugins: [BasePaginationPlugin],
      value: [
        { children: [{ text: 'body' }], type: KEYS.p },
        { children: [{ text: 'h1' }], type: KEYS.header },
        { children: [{ text: 'h2' }], type: KEYS.header },
      ],
    } as any);

    editor.tf.normalize({ force: true });

    const headers = (editor.children as any[]).filter(
      (n) => n.type === KEYS.header
    );

    expect(headers).toHaveLength(1);
    expect((editor.children[0] as any).type).toBe(KEYS.header);
  });
});
