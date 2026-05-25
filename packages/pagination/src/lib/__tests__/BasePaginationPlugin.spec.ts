import { createSlateEditor } from 'platejs';

import { BasePaginationPlugin } from '../BasePaginationPlugin';
import { getLayoutRegistry } from '../registry';

function editorWithPagination() {
  return createSlateEditor({
    plugins: [BasePaginationPlugin],
    value: [{ children: [{ text: 'hello' }], type: 'p' }],
  });
}

describe('BasePaginationPlugin', () => {
  it('enables pagination by default', () => {
    const editor = editorWithPagination();

    expect(editor.getOptions(BasePaginationPlugin).enabled).toBe(true);
  });

  it('can be disabled via options', () => {
    const editor = createSlateEditor({
      plugins: [
        BasePaginationPlugin.configure({ options: { enabled: false } }),
      ],
      value: [{ children: [{ text: 'hello' }], type: 'p' }],
    });

    expect(editor.getOptions(BasePaginationPlugin).enabled).toBe(false);
  });

  it('invalidates the layout registry on a content edit', () => {
    const editor = editorWithPagination();
    getLayoutRegistry(editor).dirty = false; // simulate a fresh build

    editor.tf.apply({
      offset: 0,
      path: [0, 0],
      text: 'x',
      type: 'insert_text',
    });

    expect(getLayoutRegistry(editor).dirty).toBe(true);
  });

  it('does not invalidate the layout registry on a selection-only change', () => {
    const editor = editorWithPagination();
    getLayoutRegistry(editor).dirty = false;

    editor.tf.apply({
      newProperties: {
        anchor: { offset: 1, path: [0, 0] },
        focus: { offset: 1, path: [0, 0] },
      },
      properties: null,
      type: 'set_selection',
    });

    expect(getLayoutRegistry(editor).dirty).toBe(false);
  });

  it('has the plugin key "pagination"', () => {
    expect(BasePaginationPlugin.key).toBe('pagination');
  });

  it('defaults to A4 page spec (794×1123 px at 96dpi)', () => {
    const editor = editorWithPagination();
    const { page } = editor.getOptions(BasePaginationPlugin);
    expect(page.widthPx).toBe(794);
    expect(page.heightPx).toBe(1123);
    expect(page.preset).toBe('a4');
  });

  it('defaults to 1in (96px) margins on all sides', () => {
    const editor = editorWithPagination();
    const { margins } = editor.getOptions(BasePaginationPlugin);
    expect(margins.topPx).toBe(96);
    expect(margins.rightPx).toBe(96);
    expect(margins.bottomPx).toBe(96);
    expect(margins.leftPx).toBe(96);
  });

  it('defaults atomicTypes to an empty array', () => {
    const editor = editorWithPagination();
    expect(editor.getOptions(BasePaginationPlugin).atomicTypes).toEqual([]);
  });

  it('defaults keepWithNextTypes to an empty array', () => {
    const editor = editorWithPagination();
    expect(editor.getOptions(BasePaginationPlugin).keepWithNextTypes).toEqual(
      []
    );
  });

  it('defaults viewMode to "continuous"', () => {
    const editor = editorWithPagination();
    expect(editor.getOptions(BasePaginationPlugin).viewMode).toBe('continuous');
  });

  it('marks the registry dirty on remove_node operations', () => {
    const editor = editorWithPagination();
    getLayoutRegistry(editor).dirty = false;

    editor.tf.apply({
      node: { children: [{ text: 'hello' }], type: 'p' },
      path: [0],
      type: 'remove_node',
    });

    expect(getLayoutRegistry(editor).dirty).toBe(true);
  });

  it('marks the registry dirty on insert_node operations', () => {
    const editor = editorWithPagination();
    getLayoutRegistry(editor).dirty = false;

    editor.tf.apply({
      node: { children: [{ text: 'new' }], type: 'p' },
      path: [1],
      type: 'insert_node',
    });

    expect(getLayoutRegistry(editor).dirty).toBe(true);
  });
});
