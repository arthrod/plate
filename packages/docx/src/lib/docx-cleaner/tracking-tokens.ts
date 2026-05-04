/**
 * @file Single source of truth for the DOCX tracking-token grammar shared by
 * `@platejs/docx` (cleaner) and `@platejs/docx-io` (importer/exporter).
 *
 * Lives under `packages/docx` to avoid publishing a one-file package and to
 * avoid coupling `@platejs/utils` to docx-specific concerns. `@platejs/docx-io`
 * re-imports these constants instead of redeclaring them.
 *
 * See issues #346 / #347 / #348 / #349.
 */

export const DOCX_INSERTION_START_TOKEN_PREFIX = '[[DOCX_INS_START:';
export const DOCX_INSERTION_END_TOKEN_PREFIX = '[[DOCX_INS_END:';
export const DOCX_INSERTION_TOKEN_SUFFIX = ']]';

export const DOCX_DELETION_START_TOKEN_PREFIX = '[[DOCX_DEL_START:';
export const DOCX_DELETION_END_TOKEN_PREFIX = '[[DOCX_DEL_END:';
export const DOCX_DELETION_TOKEN_SUFFIX = ']]';

export const DOCX_COMMENT_START_TOKEN_PREFIX = '[[DOCX_CMT_START:';
export const DOCX_COMMENT_END_TOKEN_PREFIX = '[[DOCX_CMT_END:';
export const DOCX_COMMENT_REF_TOKEN_PREFIX = '[[DOCX_CMT_REF:';
export const DOCX_COMMENT_TOKEN_SUFFIX = ']]';

/**
 * Single regex matching every tracking token. The prefix list is locked: only
 * tokens whose prefix matches one of the exported `DOCX_*_TOKEN_PREFIX`
 * constants are considered. A user-typed `"see [[note]]"` does NOT match.
 */
export const TRACKING_TOKEN_REGEX =
  /\[\[DOCX_(?:INS|DEL|CMT)_(?:START|END|REF):.*?]]/g;

/**
 * True if the given string contains at least one tracking token. The single
 * predicate every token-aware cleaner consults so adding a new cleaner that
 * forgets to opt in is a one-line review check.
 */
export function containsTrackingToken(text: string): boolean {
  TRACKING_TOKEN_REGEX.lastIndex = 0;
  return TRACKING_TOKEN_REGEX.test(text);
}

/**
 * True if any descendant text node of `node` contains a tracking token.
 * Used by element-level cleaners (`cleanDocxEmptyParagraphs`,
 * `cleanHtmlEmptyElements`) to short-circuit the empty-classification path.
 */
export function nodeContainsTrackingToken(node: Node): boolean {
  const text = node.textContent ?? '';
  return containsTrackingToken(text);
}

/**
 * Marker every cleaner that has reviewed its token-handling MUST export so a
 * `cleanDocx`-side count check can fail the build when a new cleaner is added
 * without a token-handling decision. The counter is read by `cleanDocx.ts`'s
 * type assertion (see `TOKEN_AWARE_CLEANERS`).
 */
export const __TOKEN_AWARE_CLEANER__ = Symbol.for(
  '@platejs/docx/token-aware-cleaner'
);
export type TokenAwareCleanerMarker = typeof __TOKEN_AWARE_CLEANER__;
