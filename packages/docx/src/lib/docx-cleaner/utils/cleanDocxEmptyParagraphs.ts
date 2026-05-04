import { NO_BREAK_SPACE, traverseHtmlElements } from 'platejs';

import {
  __TOKEN_AWARE_CLEANER__,
  nodeContainsTrackingToken,
} from '../tracking-tokens';

const isHtmlOpEmpty = (element: Element): boolean =>
  element.nodeName === 'O:P' && element.textContent === NO_BREAK_SPACE;

const isHtmlElementEmpty = (element: Element): boolean =>
  element.children.length === 1 &&
  element.firstElementChild !== null &&
  (isHtmlOpEmpty(element.firstElementChild) ||
    isHtmlElementEmpty(element.firstElementChild));

/** Remove paragraph innerHTML if its child is 'O:P' with NO_BREAK_SPACE. */
export const cleanDocxEmptyParagraphs = (rootNode: Node): void => {
  traverseHtmlElements(rootNode, (element) => {
    if (
      element.tagName === 'P' &&
      isHtmlElementEmpty(element) &&
      // Variant B (#348): never classify a paragraph as empty if any
      // descendant text node carries a tracking token. Closing tokens are
      // single-text-node "visible" content; we must keep them in place.
      !nodeContainsTrackingToken(element)
    ) {
      element.innerHTML = '';
    }

    return true;
  });
};

/** Variant B (#348) marker — see `tracking-tokens.ts`. */
cleanDocxEmptyParagraphs[__TOKEN_AWARE_CLEANER__] = true as const;
