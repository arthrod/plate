/**
 * @file Variant C — extract tracking tokens from raw HTML before `cleanDocx`
 * runs, stash them with anchor fingerprints, and let the cleaner stay
 * token-blind. See issue #349.
 *
 * The companion module is {@link ./reapplyTokens.ts}, which uses the same
 * `searchRange` infrastructure that #342's tracked-changes resolver needs
 * to anchor tokens after deserialization.
 */

/**
 * Match every tracking token (`[[DOCX_(INS|DEL|CMT)_(START|END|REF):…]]`) so
 * the prefix list is locked: a user-typed `"see [[note]]"` does NOT match.
 */
export const TRACKING_TOKEN_REGEX =
  /\[\[DOCX_(?:INS|DEL|CMT)_(?:START|END|REF):.*?]]/g;

export type StashedTokenKind =
  | 'cmt-end'
  | 'cmt-ref'
  | 'cmt-start'
  | 'del-end'
  | 'del-start'
  | 'ins-end'
  | 'ins-start';

const KIND_BY_PREFIX: [string, StashedTokenKind][] = [
  ['[[DOCX_INS_START:', 'ins-start'],
  ['[[DOCX_INS_END:', 'ins-end'],
  ['[[DOCX_DEL_START:', 'del-start'],
  ['[[DOCX_DEL_END:', 'del-end'],
  ['[[DOCX_CMT_START:', 'cmt-start'],
  ['[[DOCX_CMT_END:', 'cmt-end'],
  ['[[DOCX_CMT_REF:', 'cmt-ref'],
];

const classifyToken = (token: string): StashedTokenKind | null => {
  for (const [prefix, kind] of KIND_BY_PREFIX) {
    if (token.startsWith(prefix)) return kind;
  }
  return null;
};

/**
 * One stashed token recovered from the raw Mammoth HTML, ready for
 * post-deserialization re-anchoring via `reapplyTokens`.
 */
export type StashedToken = {
  kind: StashedTokenKind;
  /** The raw token text. */
  tokenText: string;
  /**
   * The JSON / id payload between the prefix and `]]`. Cached so the reapply
   * step does not re-parse from `tokenText`.
   */
  payload: string;
  /**
   * 32-character text fingerprints (HTML-decoded plain text) immediately
   * preceding and following the token, ignoring whitespace. Used by the
   * post-deserialization resolver to anchor with edit distance ≤ 2 tolerance.
   */
  anchorBefore: string;
  anchorAfter: string;
  /**
   * Monotonic per-token counter so duplicate tokens (same author, same
   * position) can still be disambiguated when fingerprints collide.
   */
  index: number;
};

const FINGERPRINT_LENGTH = 32;

const decodeHtmlEntities = (s: string): string =>
  s
    .replaceAll(/&nbsp;/g, ' ')
    .replaceAll(/&amp;/g, '&')
    .replaceAll(/&lt;/g, '<')
    .replaceAll(/&gt;/g, '>')
    .replaceAll(/&quot;/g, '"')
    .replaceAll(/&#39;/g, "'");

const stripTags = (s: string): string => s.replaceAll(/<[^>]+>/g, '');

const collapseWhitespace = (s: string): string =>
  s.replaceAll(/\s+/g, ' ').trim();

const fingerprint = (
  html: string,
  start: number,
  end: number,
  direction: 'after' | 'before'
): string => {
  const slice =
    direction === 'before'
      ? html.slice(Math.max(0, start - 4 * FINGERPRINT_LENGTH), end)
      : html.slice(start, end + 4 * FINGERPRINT_LENGTH);
  const text = collapseWhitespace(decodeHtmlEntities(stripTags(slice)));
  if (direction === 'before') return text.slice(-FINGERPRINT_LENGTH);
  return text.slice(0, FINGERPRINT_LENGTH);
};

const extractPayload = (token: string, kind: StashedTokenKind): string => {
  const prefix = KIND_BY_PREFIX.find(([, k]) => k === kind)?.[0] ?? '';
  return token.slice(prefix.length, token.length - 2);
};

/**
 * Walk `html` once with the token regex. For every match, record the token
 * plus its 32-character before/after text fingerprints, then strip the token
 * from the HTML. Returns the cleaned-input HTML (passable to `cleanDocx` as
 * if the document had no tracking metadata) and the stashed-token list.
 */
export function extractTokens(html: string): {
  stripped: string;
  tokens: StashedToken[];
} {
  const tokens: StashedToken[] = [];
  let stripped = '';
  let cursor = 0;
  let index = 0;

  TRACKING_TOKEN_REGEX.lastIndex = 0;
  let match: RegExpExecArray | null = TRACKING_TOKEN_REGEX.exec(html);
  while (match) {
    const tokenText = match[0];
    const kind = classifyToken(tokenText);
    if (!kind) {
      // Not a recognized prefix — skip without stripping.
      match = TRACKING_TOKEN_REGEX.exec(html);
      continue;
    }
    const tokenStart = match.index;
    const tokenEnd = tokenStart + tokenText.length;

    stripped += html.slice(cursor, tokenStart);
    cursor = tokenEnd;

    tokens.push({
      anchorAfter: fingerprint(html, tokenEnd, tokenEnd, 'after'),
      anchorBefore: fingerprint(html, tokenStart, tokenStart, 'before'),
      index: index++,
      kind,
      payload: extractPayload(tokenText, kind),
      tokenText,
    });

    match = TRACKING_TOKEN_REGEX.exec(html);
  }
  stripped += html.slice(cursor);

  return { stripped, tokens };
}
