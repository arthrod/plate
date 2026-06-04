import { createSlateEditor } from 'platejs';

import type { LayoutOutput } from '../../layout/types';
import {
  ensureLayout,
  getLayoutRegistry,
  invalidateLayoutRegistry,
  shouldInvalidateLayout,
} from '../registry';

const FAKE_LAYOUT = {
  mapping: {} as LayoutOutput['mapping'],
  metrics: { blocks: 0, pages: 1 },
  pages: [],
} satisfies LayoutOutput;

describe('layout registry', () => {
  it('starts dirty so the first read triggers a build', () => {
    const editor = createSlateEditor();
    expect(getLayoutRegistry(editor).dirty).toBe(true);
  });

  it('builds once on read, serves cached, rebuilds after invalidation', () => {
    const editor = createSlateEditor();
    let builds = 0;
    const compute = () => {
      builds++;

      return FAKE_LAYOUT;
    };

    ensureLayout(editor, compute); // dirty → build
    ensureLayout(editor, compute); // clean → cached
    expect(builds).toBe(1);

    invalidateLayoutRegistry(editor);
    ensureLayout(editor, compute); // dirty again → rebuild
    expect(builds).toBe(2);
  });

  it('treats content operations as invalidating but selection as not', () => {
    for (const type of [
      'insert_text',
      'remove_text',
      'insert_node',
      'remove_node',
      'split_node',
      'merge_node',
      'move_node',
      'set_node',
    ]) {
      expect(shouldInvalidateLayout({ type })).toBe(true);
    }
    expect(shouldInvalidateLayout({ type: 'set_selection' })).toBe(false);
  });
});
