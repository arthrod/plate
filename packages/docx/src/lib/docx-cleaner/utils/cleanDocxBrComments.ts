import {
  isHtmlComment,
  removeHtmlNodesBetweenComments,
  traverseHtmlElements,
} from 'platejs';

import { __TOKEN_AWARE_CLEANER__ } from '../tracking-tokens';

/** Remove HTML nodes between comments in the next sibling after BR. */
export const cleanDocxBrComments = (rootNode: Node): void => {
  traverseHtmlElements(rootNode, (element) => {
    if (element.tagName !== 'BR') {
      return true;
    }
    if (
      element.nextSibling &&
      isHtmlComment(element.nextSibling) &&
      element.nextSibling.data === '[if !supportLineBreakNewLine]'
    ) {
      removeHtmlNodesBetweenComments(
        element.nextSibling,
        '[if !supportLineBreakNewLine]',
        '[endif]'
      );
    }

    return false;
  });
};

/**
 * Variant B (#348) marker — token-blind by design (operates on `<br>` +
 * conditional-comment tag names, not on text content). Tokens never enter
 * the removed range because they live inside surrounding text nodes.
 */
cleanDocxBrComments[__TOKEN_AWARE_CLEANER__] = true as const;
