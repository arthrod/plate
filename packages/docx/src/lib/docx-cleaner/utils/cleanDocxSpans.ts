import { traverseHtmlElements } from 'platejs';

import {
  __TOKEN_AWARE_CLEANER__,
  nodeContainsTrackingToken,
} from '../tracking-tokens';
import { cleanDocxSpacerun } from './cleanDocxSpacerun';
import { cleanDocxTabCount } from './cleanDocxTabCount';

/** Clean docx spaceruns and tab counts. */
export const cleanDocxSpans = (rootNode: Node): void => {
  traverseHtmlElements(rootNode, (element) => {
    if (element.nodeName !== 'SPAN') {
      return true;
    }
    // Variant B (#348): never touch a span whose subtree carries a tracking
    // token — preserves the run-level wrapper that anchors token adjacency.
    if (nodeContainsTrackingToken(element)) {
      return true;
    }

    cleanDocxSpacerun(element);
    cleanDocxTabCount(element);

    return true;
  });
};

/** Variant B (#348) marker — see `tracking-tokens.ts`. */
cleanDocxSpans[__TOKEN_AWARE_CLEANER__] = true as const;
