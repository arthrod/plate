import type { SlateEditor, TElement } from 'platejs';

import { HEADER_KEY } from '../internal/keys';

/**
 * Insert a default header at index 0 when none exists.
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
      children: [{ text: 'Header' }],
      type: headerType,
    } as TElement,
    { at: [0] }
  );
};
