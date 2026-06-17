/**
 * @file Scaffold for emitting OOXML `<w:comments>` parts from injected
 * tracking tokens. Pairs with {@link ./importComments.ts} (issue #343).
 */

import type { Descendant } from 'platejs';

import type { DocxImportDiscussion } from './types';

export type ExportCommentsOptions = {
  /** Slate value to scan for comment-marked ranges. */
  value: Descendant[];
  /** Discussion data to be emitted as `<w:comments>` part. */
  discussions: DocxImportDiscussion[];
  /**
   * Reads the comment id(s) attached to a node. Decouples export from any
   * specific comment-mark naming convention.
   */
  getCommentIds: (node: Descendant) => string[];
  /**
   * Whether to include transient / uncommitted comment marks in the export.
   * Defaults to `false` to match the round-trip-safe flow.
   */
  includeTransientComments?: boolean;
};

/**
 * Wrap comment-marked ranges with the matching `[[DOCX_CMT_START/END/REF]]`
 * tokens so the (forked) `html-to-docx` translates them to
 * `<w:commentRangeStart>`, `<w:commentRangeEnd>`, `<w:commentReference>`,
 * and emits a `comments.xml` part.
 *
 * TODO(#343): implement the actual injection traversal once the tracked
 * changes export (#342) lands `injectDocxTrackingTokens`. This file is the
 * canonical entry point for the comments extension to that token injector.
 */
export function injectDocxCommentTokens(_options: ExportCommentsOptions): {
  value: Descendant[];
} {
  // TODO(#343): build on `injectDocxTrackingTokens` from #342. Throw rather
  // than returning the input unchanged so callers can't mistake "not
  // implemented" for "no comments to inject" — that would silently lose
  // comments on export.
  throw new Error(
    'injectDocxCommentTokens is not implemented yet (tracked in #343).'
  );
}
