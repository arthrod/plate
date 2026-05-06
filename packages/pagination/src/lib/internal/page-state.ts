import type { Page } from '../types';

/**
 * The latest pagination snapshot is stored on the editor instance under a
 * non-enumerable slot so `editor.api.pagination.*` queries can resolve
 * without going through React. `usePageLayout` writes the slot after each
 * pagination cycle; `BasePaginationPlugin.api.pagination.getPages` reads it.
 *
 * Writing onto the editor avoids a WeakMap allocation and keeps the read
 * path zero-overhead — the API just dereferences a property.
 *
 * Lives under `lib/internal` so the base (Slate-only) plugin can import it
 * without React depending on `lib`.
 */
export const SLOT = '__pagination_pages__' as const;

export const setEditorPages = (editor: object, pages: Page[]): void => {
  (editor as Record<string, Page[]>)[SLOT] = pages;
};

export const getEditorPages = (editor: object): Page[] => {
  const slot = (editor as Record<string, unknown>)[SLOT];

  return Array.isArray(slot) ? (slot as Page[]) : [];
};
