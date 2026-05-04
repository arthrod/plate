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
} from './tracking-tokens';

const TOKEN_PARK_ATTR = 'data-docx-token-park';

type ParkedEntry = { marker: Comment; node: Node };

/**
 * Find every text node whose value contains a tracking token, then park its
 * immediate parent (or, when the token sits directly under `body`, the text
 * node itself) behind a marker comment so the delegated cleaner cannot see
 * the token text.
 *
 * Single text-node walk → O(N). Avoids the previous O(N²) shape that called
 * `nodeContainsTrackingToken(element)` (which itself walks the subtree) for
 * every element. Also avoids the nested-element double-park bug where a
 * token in `<div><p><span>[[T]]</span></p></div>` parked all three
 * ancestors.
 */
function parkTokenBearingElements(body: HTMLElement): ParkedEntry[] {
  const doc = body.ownerDocument;
  if (!doc) return [];

  // SHOW_TEXT only — text nodes directly under `body` are also visited, so
  // a bare `<body>[[DOCX_INS_START:...]]</body>` token is not skipped.
  const walker = doc.createTreeWalker(body, 0x4 /* SHOW_TEXT */);
  const tokenTextNodes: Text[] = [];
  let cursor = walker.nextNode();
  while (cursor) {
    const text = cursor as Text;
    if (containsTrackingToken(text.nodeValue ?? '')) {
      tokenTextNodes.push(text);
    }
    cursor = walker.nextNode();
  }

  // Park the closest enclosing element per text node, deduped. When the text
  // node is a direct child of `body`, park the text node itself.
  const parked: ParkedEntry[] = [];
  const seen = new Set<Node>();
  for (const text of tokenTextNodes) {
    const target: Node =
      text.parentElement && text.parentElement !== body
        ? text.parentElement
        : text;
    if (seen.has(target)) continue;
    // If an ancestor of `target` is already parked, skip — its subtree is
    // already detached. Walk up via `parentNode` rather than `parentElement`
    // so element-typed parents are checked correctly.
    let ancestor: Node | null = target.parentNode;
    let nestedInsideParked = false;
    while (ancestor && ancestor !== body) {
      if (seen.has(ancestor)) {
        nestedInsideParked = true;
        break;
      }
      ancestor = ancestor.parentNode;
    }
    if (nestedInsideParked) continue;
    seen.add(target);

    if (!target.parentNode) continue;
    const id = String(parked.length);
    if (target.nodeType === 1) {
      (target as Element).setAttribute(TOKEN_PARK_ATTR, id);
    }
    const marker = doc.createComment(`docx-token-park:${id}`);
    target.parentNode.insertBefore(marker, target);
    target.parentNode.removeChild(target);
    parked.push({ marker, node: target });
  }
  return parked;
}

function restoreParkedElements(parked: ParkedEntry[]): void {
  for (const { marker, node } of parked) {
    if (!marker.parentNode) continue;
    if (node.nodeType === 1) {
      (node as Element).removeAttribute(TOKEN_PARK_ATTR);
    }
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
