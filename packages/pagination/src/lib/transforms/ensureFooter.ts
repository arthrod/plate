import type { SlateEditor, TElement } from 'platejs';

import { FOOTER_KEY } from '../internal/keys';

/**
 * Insert an empty footer at the last index when none exists.
 *
 * Empty children — same rationale as `ensureHeader`: the chrome band looks
 * like Google Docs (blank, focusable, optional CSS placeholder hint) rather
 * than persisting the literal word "Footer" inside the document body.
 */
export const ensureFooter = (editor: SlateEditor): void => {
  const footerType = editor.getType(FOOTER_KEY);

  if ((editor.children as TElement[]).some((n) => n.type === footerType))
    return;

  editor.tf.insertNodes(
    {
      children: [{ text: '' }],
      type: footerType,
    } as TElement,
    { at: [editor.children.length] }
  );
};
