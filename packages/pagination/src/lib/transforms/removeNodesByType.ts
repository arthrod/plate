import type { SlateEditor, TElement } from 'platejs';

/**
 * Remove every top-level child whose `type` matches `type`. Iterates from the
 * end so removed indices don't invalidate the loop.
 */
export const removeNodesByType = (editor: SlateEditor, type: string): void => {
  const children = editor.children as TElement[];

  for (let i = children.length - 1; i >= 0; i--) {
    if (children[i].type === type) {
      editor.tf.removeNodes({ at: [i] });
    }
  }
};
