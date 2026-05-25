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
});
