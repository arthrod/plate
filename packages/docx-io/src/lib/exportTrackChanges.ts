/**
 * @file Scaffold for emitting `[[DOCX_INS_*]]` / `[[DOCX_DEL_*]]` tracking
 * tokens around `@platejs/suggestion`-marked ranges so the (forked)
 * `html-to-docx` translates them into native `<w:ins>` / `<w:del>` runs.
 * See issue #342.
 */

import type { Descendant } from 'platejs';

import type { DocxTrackedChange } from './types';

export type InjectDocxTrackingTokensOptions = {
  /** Slate value to scan. */
  value: Descendant[];
  /**
   * Returns the suggestion(s) attached to a node, with stable ids and
   * author/date metadata. Decouples the injector from any specific
   * suggestion-mark shape.
   */
  getSuggestions: (node: Descendant) => DocxTrackedChange[];
  /**
   * Optional discussion data for the comment extension (#343). The injector
   * accepts both shapes so a single traversal can wrap insertions, deletions,
   * and comment ranges in one pass.
   */
  discussions?: unknown[];
  /**
   * Identity of the user performing the export. Used as the default author
   * for any uncommitted suggestions when `includeTransientSuggestions` is on.
   */
  currentUserId?: string;
  currentUserName?: string;
  /** Whether transient / uncommitted suggestion marks should be exported. */
  includeTransientSuggestions?: boolean;
};

/**
 * Walk `value`, wrap every suggestion-marked range with the matching
 * `START`/`END` token pair, and return the rewritten value ready for the
 * forked `html-to-docx` step.
 *
 * TODO(#342): real implementation. The deep version traverses the tree once,
 * accumulates active suggestion ids per text node, and emits text nodes that
 * carry the literal token strings as plain text. Throws until then so
 * callers can't mistake "not implemented" for "nothing to inject" — that
 * would silently lose tracked changes on export.
 */
export function injectDocxTrackingTokens(
  _options: InjectDocxTrackingTokensOptions
): { value: Descendant[] } {
  throw new Error(
    'injectDocxTrackingTokens is not implemented yet (tracked in #342).'
  );
}
