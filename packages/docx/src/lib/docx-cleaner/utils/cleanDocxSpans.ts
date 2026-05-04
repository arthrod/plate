import { traverseHtmlElements } from 'platejs';

import {
  __TOKEN_AWARE_CLEANER__,
  containsTrackingToken,
} from '../tracking-tokens';
import { cleanDocxSpacerun } from './cleanDocxSpacerun';
import { cleanDocxTabCount } from './cleanDocxTabCount';

/**
 * Variant B (#348) — collect every ancestor element of a token-bearing text
 * node in one O(N) text-node sweep. Per-span membership lookup against this
 * set is then O(1), avoiding the O(N²) cost of re-scanning each span's
 * subtree text content during traversal.
 */
const collectTokenBearingAncestors = (rootNode: Node): Set<Element> => {
  const out = new Set<Element>();
  const doc = (rootNode as Element).ownerDocument ?? null;
  if (!doc) return out;
  const walker = doc.createTreeWalker(rootNode, 0x4 /* SHOW_TEXT */);
  let cursor = walker.nextNode();
  while (cursor) {
    const text = cursor as Text;
    if (containsTrackingToken(text.nodeValue ?? '')) {
      let ancestor: Element | null = text.parentElement;
      while (ancestor) {
        if (out.has(ancestor)) break;
        out.add(ancestor);
        ancestor = ancestor.parentElement;
      }
    }
    cursor = walker.nextNode();
  }
  return out;
};

/** Clean docx spaceruns and tab counts. */
export const cleanDocxSpans = (rootNode: Node): void => {
  // Single O(N) text-node sweep so each span lookup below is O(1).
  const tokenAncestors = collectTokenBearingAncestors(rootNode);
  traverseHtmlElements(rootNode, (element) => {
    if (element.nodeName !== 'SPAN') {
      return true;
    }
    // Variant B (#348): never touch a span whose subtree carries a tracking
    // token — preserves the run-level wrapper that anchors token adjacency.
    if (tokenAncestors.has(element)) {
      return true;
    }

    cleanDocxSpacerun(element);
    cleanDocxTabCount(element);

    return true;
  });
};

/** Variant B (#348) marker — see `tracking-tokens.ts`. */
cleanDocxSpans[__TOKEN_AWARE_CLEANER__] = true as const;
