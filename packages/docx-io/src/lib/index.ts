/**
 * DOCX Import/Export Library
 *
 * This package provides DOCX import and export functionality for Plate editors,
 * including support for tracked changes (suggestions) and comments.
 *
 * How-to (commented example): keep track changes out of DOCX comments.
 *
 * // const commentPrefix = 'comment_';
 * // const draftCommentKey = `${commentPrefix}draft`;
 * // const blob = await exportToDocx(editor.children, {
 * //   tracking: {
 * //     discussions,
 * //     getCommentIds: (node) =>
 * //       Object.entries(node)
 * //         .filter(
 * //           ([key, value]) =>
 * //             Boolean(value) &&
 * //             key.startsWith(commentPrefix) &&
 * //             key !== draftCommentKey
 * //         )
 * //         .map(([key]) => key.slice(commentPrefix.length)),
 * //   },
 * // });
 */

// ============================================================================
// Easy Import/Export Plugin Kit
// ============================================================================

export { DocxIOKit, DocxIOPlugin } from "./DocxIOPlugin";

// ============================================================================
// Import
// ============================================================================

// Export everything from importComments (includes combined hasDocxTrackingTokens & stripDocxTrackingTokens)
export * from "./importComments";
export * from "./importDocx";
// Export from importTrackChanges, excluding duplicates that are re-exported from importComments
export {
    DOCX_DELETION_END_TOKEN_PREFIX,
    DOCX_DELETION_START_TOKEN_PREFIX,
    DOCX_DELETION_TOKEN_SUFFIX,
    DOCX_INSERTION_END_TOKEN_PREFIX,
    DOCX_INSERTION_START_TOKEN_PREFIX,
    DOCX_INSERTION_TOKEN_SUFFIX, applyTrackedChangeSuggestions, formatAuthorAsUserId, isPointAfter, parseDate,
    parseDateToDate,
    parseDocxTrackedChanges, type ApplySuggestionsOptions,
    type ApplySuggestionsResult, type ImportedUser, type ParseTrackedChangesResult, type SearchRangeFn,
    type TPoint,
    type TrackingEditor
} from "./importTrackChanges";

// ============================================================================
// Export
// ============================================================================

// Export from docx-export-plugin, excluding htmlToDocxBlob which comes from exportDocx
export {
    DEFAULT_DOCX_MARGINS,
    DOCX_EXPORT_STYLES, DocxExportPlugin, downloadDocx,
    exportEditorToDocx,
    exportToDocx, type DocxExportApiMethods,
    type DocxExportMargins,
    type DocxExportOperationOptions,
    type DocxExportOptions,
    type DocxExportOrientation, type DocxExportPluginOptions,
    type DocxExportTransformMethods,
    type DocxTrackingExportOptions
} from "./docx-export-plugin";
export * from "./exportComments";
// Export everything from exportDocx (including htmlToDocxBlob)
export * from "./exportDocx";
// Export from exportTrackChanges, excluding types that conflict
export {
    buildUserNameMap, injectDocxTrackingTokens,
    normalizeDate,
    normalizeDateUtc,
    toInitials, type DocxExportComment,
    type DocxExportDiscussion,
    type DocxExportSuggestionMeta,
    type DocxExportUser,
    type InjectDocxTrackingTokensOptions
} from "./exportTrackChanges";

// ============================================================================
// Shared
// ============================================================================

export * from "./searchRange";
export * from "./types";

// Note: Document types (DocumentOptions, Margins, etc.) are already exported
// via './exportDocx' which re-exports them from html-to-docx

// Export tracking token constants from html-to-docx
export {
    DOCX_COMMENT_END_TOKEN_PREFIX,
    DOCX_COMMENT_START_TOKEN_PREFIX,
    DOCX_COMMENT_TOKEN_SUFFIX, buildCommentEndToken,
    buildCommentStartToken,
    buildSuggestionEndToken,
    buildSuggestionStartToken, hasTrackingTokens, splitDocxTrackingTokens, type CommentPayload, type StoredComment,
    type SuggestionPayload, type TrackingState
} from "./html-to-docx-dist/browser";

