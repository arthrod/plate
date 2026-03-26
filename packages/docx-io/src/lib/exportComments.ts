/**
 * DOCX Comments Export
 *
 * This module provides types and utilities specific to comment export.
 * The actual token injection is handled by exportTrackChanges.ts since
 * track changes and comments are processed together during export.
 *
 * For token injection, use injectDocxTrackingTokens from exportTrackChanges.ts
 */

// Re-export comment-related types from exportTrackChanges
export type {
	DocxExportComment,
	DocxExportDiscussion,
	DocxExportUser,
	InjectDocxTrackingTokensOptions,
} from "./exportTrackChanges";
// Re-export utility functions useful for comments
// Re-export the main injection function
export {
	buildUserNameMap,
	createDiscussionsForTransientComments,
	injectDocxTrackingTokens,
	normalizeDate,
	normalizeDateUtc,
	toInitials,
} from "./exportTrackChanges";
