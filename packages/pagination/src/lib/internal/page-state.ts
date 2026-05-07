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
  // Use a non-enumerable, writable property so:
  //  - `JSON.stringify(editor)`, `Object.keys(editor)`, debug logs, and any
  //    Plate dev-tools that walk the editor do not reveal the slot;
  //  - subsequent updates can overwrite the same hidden slot without
  //    re-defining it.
  const target = editor as Record<string, Page[]>;
  const desc = Object.getOwnPropertyDescriptor(target, SLOT);

  if (desc?.writable) {
    target[SLOT] = pages;

    return;
  }

  Object.defineProperty(target, SLOT, {
    configurable: true,
    enumerable: false,
    value: pages,
    writable: true,
  });
};

export const getEditorPages = (editor: object): Page[] => {
  const slot = (editor as Record<string, unknown>)[SLOT];

  return Array.isArray(slot) ? (slot as Page[]) : [];
};
