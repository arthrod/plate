import { createSlateEditor } from 'platejs';
import { BasePaginationPlugin } from '../BasePaginationPlugin';
import {
  getPaginationRuntime,
  isPaginationMutating,
  withPaginationMutations,
} from '../internal/editorRegistry';

test('getPaginationRuntime returns runtime once plugin is applied', () => {
  const editor = createSlateEditor({ plugins: [BasePaginationPlugin] });
  expect(getPaginationRuntime(editor)).toBeDefined();
});

test('withPaginationMutations toggles mutating flag for the editor only', () => {
  const a = createSlateEditor({ plugins: [BasePaginationPlugin] });
  const b = createSlateEditor({ plugins: [BasePaginationPlugin] });
  let seen = false;
  withPaginationMutations(a, () => {
    seen = isPaginationMutating(a);
    expect(isPaginationMutating(b)).toBe(false);
  });
  expect(seen).toBe(true);
  expect(isPaginationMutating(a)).toBe(false);
});
