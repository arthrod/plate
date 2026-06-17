/**
 * @file Variant C — re-anchor stashed tokens onto the cleaned & deserialized
 * Plate tree using the cross-node text search introduced for #342. See
 * issue #349.
 */

import type { Descendant, SlateEditor } from 'platejs';

import type { StashedToken } from './extractTokensForCleaning';

export type ReapplyTokensError = {
  /** Token whose anchor could not be resolved on the deserialized tree. */
  token: StashedToken;
  /** Reason — e.g. `"anchor-not-found"` or `"ambiguous-fingerprint"`. */
  reason: string;
};

export type ReapplyTokensResult = {
  /** Mutated nodes (mark application). The original array is not preserved. */
  nodes: Descendant[];
  /** Anchor-resolution failures, surfaced via `ImportDocxWithTrackingResult.errors`. */
  errors: ReapplyTokensError[];
};

/**
 * For each stashed token, locate the position whose surrounding context
 * matches `anchorBefore` + `anchorAfter` (with edit distance ≤ 2 to absorb
 * cleanDocx whitespace collapse) and materialize the suggestion / comment
 * mark directly on the affected text nodes. No token text is reinserted into
 * `editor.children`.
 *
 * TODO(#349): the deep cross-node walk + edit-distance-tolerant matching is
 * stubbed — this currently returns the input nodes unchanged and reports
 * every stashed token as an `anchor-not-found` error. The full implementation
 * lands once #342's `searchRange` helper provides the cross-node text
 * search this resolver is built on.
 */
export function reapplyTokens(
  _editor: SlateEditor,
  nodes: Descendant[],
  tokens: StashedToken[]
): ReapplyTokensResult {
  if (tokens.length === 0) {
    return { errors: [], nodes };
  }
  // TODO(#349): walk text nodes in document order; match each stashed
  // anchorBefore/anchorAfter pair (Levenshtein distance ≤ 2 over collapsed
  // whitespace); when both anchors hit, materialize the kind-appropriate
  // mark and consume the token. Use `index` as a secondary disambiguator
  // when fingerprints collide for adjacent identical tokens by the same
  // author.
  return {
    errors: tokens.map((token) => ({
      reason: 'anchor-not-found',
      token,
    })),
    nodes,
  };
}
