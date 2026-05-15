import type { SlateEditor } from 'platejs';
import type { PaginationRuntime } from '../types';

const runtimes = new WeakMap<SlateEditor, PaginationRuntime>();
const mutating = new WeakSet<SlateEditor>();

export const setPaginationRuntime = (
  editor: SlateEditor,
  r: PaginationRuntime
): void => {
  runtimes.set(editor, r);
};

export const getPaginationRuntime = (
  editor: SlateEditor
): PaginationRuntime | undefined => runtimes.get(editor);

export const isPaginationMutating = (editor: SlateEditor): boolean =>
  mutating.has(editor);

export const withPaginationMutations = (
  editor: SlateEditor,
  fn: () => void
): void => {
  const prev = mutating.has(editor);
  mutating.add(editor);
  try {
    fn();
  } finally {
    if (!prev) mutating.delete(editor);
  }
};
