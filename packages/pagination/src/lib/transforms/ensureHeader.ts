import type { SlateEditor, TElement } from 'platejs';

import { HEADER_KEY } from '../internal/keys';

/**
 * Insert an empty header at index 0 when none exists.
 *
 * The inserted node has empty text so the chrome region looks like Google
 * Docs — a blank, focusable band that displays a placeholder hint via CSS
 * (see `apps/www/src/registry/components/.../header-element.tsx`) instead
 * of the literal word "Header" baked into the document content. Inserting
 * placeholder text inside `editor.children` would persist into DOCX export
 * and round-trip back as authored content.
 *
 * Uses the package-local `HEADER_KEY` constant rather than `KEYS.header`
 * from `platejs` — older published versions of `platejs` are missing the
 * pagination keys in their `KEYS` export, which would silently produce
 * `editor.getType(undefined) === ''` and insert nodes with an empty type.
 */
export const ensureHeader = (editor: SlateEditor): void => {
  const headerType = editor.getType(HEADER_KEY);

  if ((editor.children as TElement[]).some((n) => n.type === headerType))
    return;

  editor.tf.insertNodes(
    {
      children: [{ text: '' }],
      type: headerType,
    } as TElement,
    { at: [0] }
  );
};
