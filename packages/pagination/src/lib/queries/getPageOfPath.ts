import type { SlateEditor, TElement } from 'platejs';

import { getEditorPages } from '../internal/page-state';

/**
 * Map a top-level Slate path to its derived page index. Returns `-1` when
 * the path is empty or the top block is not present in the page snapshot.
 */
export const getPageOfPath = (editor: SlateEditor, path: number[]): number => {
  if (path.length === 0) return -1;

  const top = (editor.children as TElement[])[path[0]];

  if (!top) return -1;

  const pages = getEditorPages(editor);

  for (let i = 0; i < pages.length; i++) {
    if (pages[i].nodes.includes(top)) return i;
  }

  return -1;
};
