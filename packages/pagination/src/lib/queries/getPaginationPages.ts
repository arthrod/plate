import type { SlateEditor } from 'platejs';

import type { Page } from '../types';

import { getEditorPages } from '../internal/page-state';

/**
 * Read the latest derived page sequence stored on the editor by the React
 * pagination overlay. Returns an empty array when no pagination cycle has
 * run yet.
 */
export const getPaginationPages = (editor: SlateEditor): Page[] =>
  getEditorPages(editor);

/** Return the footnotes allocated to a given page index. */
export const getPaginationFootnotes = (
  editor: SlateEditor,
  pageIndex: number
) => getEditorPages(editor)[pageIndex]?.footnotes ?? [];
