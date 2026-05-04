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
 * Single regex matching every tracking token. The capture group yields the
 * full token text so callers can re-insert the bytes verbatim.
 *
 * The prefix list is locked: only tokens whose prefix matches one of the
 * exported `DOCX_*_TOKEN_PREFIX` constants are considered. A user-typed
 * `"see [[note]]"` does NOT match.
 */
export const TRACKING_TOKEN_REGEX =
  /(\[\[DOCX_(?:INS|DEL|CMT)_(?:START|END|REF):.*?]])/g;

/** Token kinds that the placeholder swap distinguishes. */
export type TrackingTokenKind =
  | 'cmt-end'
  | 'cmt-ref'
  | 'cmt-start'
  | 'del-end'
  | 'del-start'
  | 'ins-end'
  | 'ins-start';

/** Identify the token kind from its raw text, or `null` if not a token. */
export function classifyTrackingToken(token: string): TrackingTokenKind | null {
  if (token.startsWith(DOCX_INSERTION_START_TOKEN_PREFIX)) return 'ins-start';
  if (token.startsWith(DOCX_INSERTION_END_TOKEN_PREFIX)) return 'ins-end';
  if (token.startsWith(DOCX_DELETION_START_TOKEN_PREFIX)) return 'del-start';
  if (token.startsWith(DOCX_DELETION_END_TOKEN_PREFIX)) return 'del-end';
  if (token.startsWith(DOCX_COMMENT_START_TOKEN_PREFIX)) return 'cmt-start';
  if (token.startsWith(DOCX_COMMENT_END_TOKEN_PREFIX)) return 'cmt-end';
  if (token.startsWith(DOCX_COMMENT_REF_TOKEN_PREFIX)) return 'cmt-ref';
  return null;
}

/** True if the given string contains at least one tracking token. */
export function containsTrackingToken(text: string): boolean {
  // Reset lastIndex defensively when the global regex is reused.
  TRACKING_TOKEN_REGEX.lastIndex = 0;
  return TRACKING_TOKEN_REGEX.test(text);
}
