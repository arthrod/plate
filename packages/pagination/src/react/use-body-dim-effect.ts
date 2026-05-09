import { useEffect } from 'react';

import type { SlateEditor } from 'platejs';

/**
 * Apply body-editor opacity dim while a chrome region holds focus.
 *
 * `PageOverlay` mounts inside `render.afterEditable`, which means our React
 * subtree is a sibling — not an ancestor — of the live editable. We can't
 * style it through normal CSS cascading, so this effect resolves the
 * editable's DOM node (via Slate's `toDOMNode`, falling back to a stable
 * `[data-slate-editor]` query) and mutates inline style.
 *
 * Cleans up its mutations on unmount or when `dim` flips back to `false`.
 */
export const useBodyDimEffect = (
  editor: SlateEditor,
  dim: boolean,
  reducedMotion: boolean
): void => {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const dom = resolveEditableDom(editor);

    if (!dom) return;

    const previousOpacity = dom.style.opacity;
    const previousTransition = dom.style.transition;

    if (dim) {
      dom.style.opacity = '0.5';
      dom.style.transition = reducedMotion ? 'none' : 'opacity 200ms ease-out';
    } else {
      dom.style.opacity = previousOpacity || '';
      dom.style.transition = previousTransition || '';
    }

    return () => {
      dom.style.opacity = previousOpacity;
      dom.style.transition = previousTransition;
    };
  }, [editor, dim, reducedMotion]);
};

const resolveEditableDom = (editor: SlateEditor): HTMLElement | null => {
  const api = (editor as { api?: { toDOMNode?: (e: SlateEditor) => Node } })
    .api;

  if (api?.toDOMNode) {
    try {
      const node = api.toDOMNode(editor);

      if (node instanceof HTMLElement) return node;
    } catch {
      // fall through to document query
    }
  }

  return document.querySelector<HTMLElement>('[data-slate-editor="true"]');
};
