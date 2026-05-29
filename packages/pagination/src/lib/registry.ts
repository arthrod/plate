// ============================================================
// pagination/lib/registry.ts
//
// Per-editor derived-layout registry. The composed LayoutOutput is per-client
// state (never replicated, yjs-safe), held in a WeakMap keyed by the editor and
// rebuilt lazily: content edits mark it dirty, the next read recomputes.
//
// Mirrors the footnote registry pattern (packages/footnote/src/lib/registry.ts):
// WeakMap + dirty flag + lazy rebuild. The `editor.apply` override that calls
// invalidateLayoutRegistry on content ops lives in the plugin layer; this module
// stays free of plugin wiring so it is unit-testable on its own.
// ============================================================

import type { SlateEditor } from 'platejs';

import type { MeasureCache } from '../measure/measure';
import type { LayoutOutput } from '../layout/types';

export type LayoutRegistryEntry = {
  /** Last composed layout, or null when never built / invalidated. */
  output: LayoutOutput | null;
  /** Whether {@link output} is stale and must be rebuilt on next read. */
  dirty: boolean;
  /** Measurement cache reused across rebuilds (keyed by block id + width). */
  measureCache: MeasureCache;
};

const LAYOUT_REGISTRY = new WeakMap<SlateEditor, LayoutRegistryEntry>();

/** Get (lazily creating) the editor's layout registry entry. Starts dirty. */
export function getLayoutRegistry(editor: SlateEditor): LayoutRegistryEntry {
  let entry = LAYOUT_REGISTRY.get(editor);

  if (!entry) {
    entry = { dirty: true, measureCache: new Map(), output: null };
    LAYOUT_REGISTRY.set(editor, entry);
  }

  return entry;
}

/** Mark the editor's layout stale so the next read rebuilds it. */
export function invalidateLayoutRegistry(editor: SlateEditor): void {
  const entry = getLayoutRegistry(editor);
  entry.dirty = true;
  entry.output = null;
}

/**
 * Return the editor's layout, rebuilding via `compute` only when dirty. The
 * pipeline (snapshot→measure→compose) is injected so this stays pure and
 * testable; the plugin supplies the real `compute`.
 */
export function ensureLayout(
  editor: SlateEditor,
  compute: () => LayoutOutput
): LayoutOutput {
  const entry = getLayoutRegistry(editor);

  if (entry.dirty || !entry.output) {
    entry.output = compute();
    entry.dirty = false;
  }

  return entry.output;
}

/** Slate operation types that change content (and thus invalidate layout). */
const CONTENT_OPS = new Set([
  'insert_node',
  'insert_text',
  'merge_node',
  'move_node',
  'remove_node',
  'remove_text',
  'set_node',
  'split_node',
]);

/**
 * Whether a Slate operation changes content and so invalidates the layout.
 * Selection-only operations (`set_selection`) do not.
 */
export function shouldInvalidateLayout(operation: { type: string }): boolean {
  return CONTENT_OPS.has(operation.type);
}
