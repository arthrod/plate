/**
 * @file Cross-node text search used by the DOCX tracking-token resolver to
 * anchor `[[DOCX_INS_*]]` / `[[DOCX_DEL_*]]` / `[[DOCX_CMT_*]]` token pairs
 * after HTML deserialization. See issue #342.
 *
 * Tokens survive deserialization as plain text inside Slate text nodes, but
 * a single OOXML run can split across multiple Slate text nodes (mark
 * boundaries, normalization, etc.), so the resolver needs a search that
 * walks across siblings.
 */

import type { Descendant, Path } from 'platejs';

/** A located range expressed as path + offset pairs. */
export type FoundRange = {
  anchor: { path: Path; offset: number };
  focus: { path: Path; offset: number };
};

export type SearchRangeFn = (needle: string) => FoundRange | null;

export type CreateSearchRangeFnOptions = {
  /** Slate value to search. */
  value: Descendant[];
  /**
   * Optional position fingerprint — short text fragments expected immediately
   * before / after the needle. Reserved for issue #349's anchor-resilience
   * variant; the basic resolver does not use it.
   */
  fingerprint?: { before?: string; after?: string };
};

/**
 * Build a function that locates a `needle` substring across the deserialized
 * tree's text nodes. Returns `null` if no match is found.
 *
 * TODO(#342): real implementation. For now this returns a no-op resolver so
 * the public API surface compiles while the deep traversal lands behind it.
 */
export function createSearchRangeFn(
  _options: CreateSearchRangeFnOptions
): SearchRangeFn {
  return () => {
    // TODO(#342): walk text nodes in document order, accumulating offsets,
    // and return the path / offset of the first cross-node match.
    return null;
  };
}
