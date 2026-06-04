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

  it('two editors have independent registry entries', () => {
    const editorA = createSlateEditor();
    const editorB = createSlateEditor();

    const entryA = getLayoutRegistry(editorA);
    const entryB = getLayoutRegistry(editorB);

    // They must be different object references.
    expect(entryA).not.toBe(entryB);

    // Invalidating A does not affect B.
    entryA.dirty = false;
    entryB.dirty = false;
    invalidateLayoutRegistry(editorA);
    expect(getLayoutRegistry(editorA).dirty).toBe(true);
    expect(getLayoutRegistry(editorB).dirty).toBe(false);
  });

  it('measureCache is a Map present in every fresh entry', () => {
    const editor = createSlateEditor();
    const entry = getLayoutRegistry(editor);
    expect(entry.measureCache).toBeInstanceOf(Map);
  });

  it('measureCache survives invalidation (same Map reference)', () => {
    const editor = createSlateEditor();
    const cacheRef = getLayoutRegistry(editor).measureCache;
    invalidateLayoutRegistry(editor);
    // Invalidation marks dirty + clears output, but should not replace the Map.
    expect(getLayoutRegistry(editor).measureCache).toBe(cacheRef);
  });

  it('ensureLayout returns null output before first build', () => {
    const editor = createSlateEditor();
    expect(getLayoutRegistry(editor).output).toBeNull();
  });

  it('shouldInvalidateLayout returns false for unknown operation type', () => {
    // An unknown/future op type is not a content change and must not invalidate.
    expect(shouldInvalidateLayout({ type: 'unknown_op' })).toBe(false);
  });
});
