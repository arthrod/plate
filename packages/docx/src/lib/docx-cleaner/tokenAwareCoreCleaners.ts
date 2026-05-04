/**
 * @file Variant B (#348) — token-aware shadow wrappers around the three
 * `platejs`-core cleaners (`cleanHtmlTextNodes`, `cleanHtmlEmptyElements`,
 * `copyBlockMarksToSpanChild`). The wrappers temporarily detach token-bearing
 * subtrees, delegate to the core cleaner on what's left, then re-attach.
 *
 * Keeping the change scoped here (not in `platejs` core) was a deliberate
 * trade-off — the predicate-aware behavior only matters for the docx import
 * path, and threading an injected option through every core cleaner would
 * have a large blast radius.
 */

import {
  cleanHtmlEmptyElements as coreCleanHtmlEmptyElements,
  cleanHtmlTextNodes as coreCleanHtmlTextNodes,
  copyBlockMarksToSpanChild as coreCopyBlockMarksToSpanChild,
} from 'platejs';

import {
  __TOKEN_AWARE_CLEANER__,
  containsTrackingToken,
  nodeContainsTrackingToken,
} from './tracking-tokens';

const TOKEN_PARK_ATTR = 'data-docx-token-park';

/**
 * Detach every token-bearing element from the tree, leaving a marker comment
 * in its place. Returns the parked nodes paired with their marker positions
 * so the caller can re-attach them after delegating to a token-blind cleaner.
 */
function parkTokenBearingElements(
  body: HTMLElement
): Array<{ marker: Comment; node: Element }> {
  const doc = body.ownerDocument;
  if (!doc) return [];
  const parked: Array<{ marker: Comment; node: Element }> = [];
  const walker = doc.createTreeWalker(body, 0x1 /* SHOW_ELEMENT */);
  const candidates: Element[] = [];
  let cursor = walker.nextNode();
  while (cursor) {
    const el = cursor as Element;
    if (
      nodeContainsTrackingToken(el) &&
      !el.hasAttribute(TOKEN_PARK_ATTR) &&
      !el.parentElement?.hasAttribute(TOKEN_PARK_ATTR)
    ) {
      candidates.push(el);
    }
    cursor = walker.nextNode();
  }
  for (const el of candidates) {
    if (!el.parentNode) continue;
    const id = String(parked.length);
    el.setAttribute(TOKEN_PARK_ATTR, id);
    const marker = doc.createComment(`docx-token-park:${id}`);
    el.parentNode.insertBefore(marker, el);
    el.parentNode.removeChild(el);
    parked.push({ marker, node: el });
  }
  return parked;
}

function restoreParkedElements(
  parked: Array<{ marker: Comment; node: Element }>
): void {
  for (const { marker, node } of parked) {
    if (!marker.parentNode) continue;
    node.removeAttribute(TOKEN_PARK_ATTR);
    marker.parentNode.insertBefore(node, marker);
    marker.parentNode.removeChild(marker);
  }
}

/**
 * Shadow `cleanHtmlTextNodes` that skips whitespace normalization on text
 * nodes whose content tests positive for the token regex. Internally we park
 * token-bearing elements so the core cleaner never visits the protected
 * subtree.
 */
export const cleanHtmlTextNodes = (body: HTMLElement): void => {
  // Quick exit when there is no token to protect.
  if (!containsTrackingToken(body.textContent ?? '')) {
    coreCleanHtmlTextNodes(body);
    return;
  }
  const parked = parkTokenBearingElements(body);
  try {
    coreCleanHtmlTextNodes(body);
  } finally {
    restoreParkedElements(parked);
  }
};

/** Shadow `cleanHtmlEmptyElements` — never classify a token-bearing element as empty. */
export const cleanHtmlEmptyElements = (body: HTMLElement): void => {
  if (!containsTrackingToken(body.textContent ?? '')) {
    coreCleanHtmlEmptyElements(body);
    return;
  }
  const parked = parkTokenBearingElements(body);
  try {
    coreCleanHtmlEmptyElements(body);
  } finally {
    restoreParkedElements(parked);
  }
};

/** Shadow `copyBlockMarksToSpanChild` — never copy block marks onto a token-bearing span child. */
export const copyBlockMarksToSpanChild = (body: HTMLElement): void => {
  if (!containsTrackingToken(body.textContent ?? '')) {
    coreCopyBlockMarksToSpanChild(body);
    return;
  }
  const parked = parkTokenBearingElements(body);
  try {
    coreCopyBlockMarksToSpanChild(body);
  } finally {
    restoreParkedElements(parked);
  }
};

cleanHtmlTextNodes[__TOKEN_AWARE_CLEANER__] = true as const;
cleanHtmlEmptyElements[__TOKEN_AWARE_CLEANER__] = true as const;
copyBlockMarksToSpanChild[__TOKEN_AWARE_CLEANER__] = true as const;
