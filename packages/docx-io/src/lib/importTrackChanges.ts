/**
 * DOCX Tracked Changes Import
 *
 * This module provides utilities for parsing and applying tracked changes
 * (insertions and deletions) from DOCX files to a Plate editor.
 *
 * Usage flow:
 * 1. Convert DOCX to HTML with mammoth (with tracking token support)
 * 2. Parse tokens from HTML using parseDocxTrackedChanges
 * 3. Deserialize HTML to editor nodes
 * 4. Apply tracked changes using applyTrackedChangeSuggestions
 */

import {
    DOCX_DELETION_END_TOKEN_PREFIX,
    DOCX_DELETION_START_TOKEN_PREFIX,
    DOCX_DELETION_TOKEN_SUFFIX,
    DOCX_INSERTION_END_TOKEN_PREFIX,
    DOCX_INSERTION_START_TOKEN_PREFIX,
    DOCX_INSERTION_TOKEN_SUFFIX,
} from "./html-to-docx-dist/browser";
import type { Point, TRange } from "./searchRange";
import type { DocxTrackedChange } from "./types";

// Re-export token constants for test usage
export {
    DOCX_DELETION_END_TOKEN_PREFIX,
    DOCX_DELETION_START_TOKEN_PREFIX,
    DOCX_DELETION_TOKEN_SUFFIX,
    DOCX_INSERTION_END_TOKEN_PREFIX,
    DOCX_INSERTION_START_TOKEN_PREFIX,
    DOCX_INSERTION_TOKEN_SUFFIX
} from "./html-to-docx-dist/browser";

export type { TRange } from "./searchRange";
export type { DocxTrackedChange } from "./types";

// ============================================================================
// Types
// ============================================================================

/** Alias for Point type */
export type TPoint = Point;

/** Editor interface for applying tracking changes */
export type TrackingEditor = {
	/** Get string content from a range */
	api: {
		string: (range: TRange) => string;
		rangeRef: (range: TRange) => {
			current: TRange | null;
			unref: () => TRange | null;
		};
		/** Get nodes matching criteria (for scanning text entries) */
		nodes?: <T>(options: {
			at: number[];
			match?: (node: unknown) => boolean;
		}) => Iterable<[T, number[]]>;
	};
	/** Transform functions */
	tf: {
		setNodes: (
			props: Record<string, unknown>,
			options: {
				at: TRange;
				match: (node: unknown) => boolean;
				split: boolean;
			},
		) => void;
		delete: (options: { at: TRange }) => void;
		withMerging: (fn: () => void) => void;
	};
	/** Set plugin option */
	setOption?: (plugin: unknown, key: string, value: unknown) => void;
	/** Get plugin option */
	getOption?: (plugin: unknown, key: string) => unknown;
};

/** Function to search for a string in the editor and return its range */
export type SearchRangeFn = (
	editor: TrackingEditor,
	search: string,
) => TRange | null;

/** Result of parsing tracked changes from HTML */
export type ParseTrackedChangesResult = {
	/** All tracked changes found (insertions and deletions) */
	changes: DocxTrackedChange[];
	/** Number of insertions found */
	insertionCount: number;
	/** Number of deletions found */
	deletionCount: number;
};

/** Options for applying tracked change suggestions */
export type ApplySuggestionsOptions = {
	/** The editor instance */
	editor: TrackingEditor;
	/** Tracked changes to apply */
	changes: DocxTrackedChange[];
	/** Function to search for ranges in editor */
	searchRange: SearchRangeFn;
	/** Key constant for suggestion marks (e.g., 'suggestion') */
	suggestionKey: string;
	/** Function to generate suggestion key property (e.g., getSuggestionKey) */
	getSuggestionKey: (id: string) => string;
	/** Function to check if node is text (e.g., TextApi.isText) */
	isText: (node: unknown) => boolean;
};

/** Imported user info from tracked changes */
export type ImportedUser = {
	/** User ID (derived from author name) */
	id: string;
	/** Display name (from w:author in DOCX) */
	name: string;
};

/** Result of applying tracked change suggestions */
export type ApplySuggestionsResult = {
	/** Number of insertions applied */
	insertions: number;
	/** Number of deletions applied */
	deletions: number;
	/** Total changes applied */
	total: number;
	/** Errors encountered */
	errors: string[];
	/** Unique users found in imported suggestions */
	users: ImportedUser[];
};

// ============================================================================
// Utility Functions
// ============================================================================

/** Escape special regex characters in a string */
function escapeRegExp(value: string): string {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Compare two points to determine order.
 * Returns true if a is after b.
 */
export function isPointAfter(a: TPoint, b: TPoint): boolean {
	for (let i = 0; i < Math.min(a.path.length, b.path.length); i++) {
		if (a.path[i] > b.path[i]) return true;
		if (a.path[i] < b.path[i]) return false;
	}
	if (a.path.length > b.path.length) return true;
	if (a.path.length < b.path.length) return false;
	return a.offset > b.offset;
}

/**
 * Format author name as userId.
 * Uses the author's name directly from the DOCX.
 */
export function formatAuthorAsUserId(authorName: string | undefined): string {
	if (!authorName) return "imported-unknown";
	return authorName;
}

/**
 * Parse date string to timestamp.
 * Returns Date.now() if parsing fails.
 */
export function parseDate(dateString: string | undefined): number {
	if (!dateString) return Date.now();
	const parsed = Date.parse(dateString);
	return Number.isNaN(parsed) ? Date.now() : parsed;
}

/**
 * Parse date string to Date object.
 * Returns provided fallback or new Date() if parsing fails.
 */
export function parseDateToDate(
	dateString: string | undefined,
	fallback?: Date,
): Date {
	if (!dateString) return fallback ?? new Date();
	const parsed = Date.parse(dateString);
	return Number.isNaN(parsed) ? (fallback ?? new Date()) : new Date(parsed);
}

// ============================================================================
// Parsing Functions
// ============================================================================

type ParsedTrackedChangeStartToken = {
	id: string;
	author?: string;
	date?: string;
	occurrence: number;
	startToken: string;
};

type ParsedEndToken = {
	id: string;
	occurrence: number;
};

function normalizeOccurrence(value: unknown): number {
	if (typeof value === "number" && Number.isInteger(value) && value >= 0) {
		return value;
	}
	if (typeof value === "string") {
		const parsed = Number.parseInt(value, 10);
		if (Number.isInteger(parsed) && parsed >= 0) {
			return parsed;
		}
	}
	return 0;
}

function buildTrackedChangePairKey(id: string, occurrence: number): string {
	return `${id}:${occurrence}`;
}

function parseTrackedChangeEndTokenPayload(
	rawPayload: string,
): ParsedEndToken | null {
	const decoded = decodeURIComponent(rawPayload);
	if (!decoded) return null;

	const withOccurrence = /^(.*):(\d+)$/.exec(decoded);
	if (!withOccurrence) {
		return { id: decoded, occurrence: 0 };
	}

	const id = withOccurrence[1];
	if (!id) return null;

	return {
		id,
		occurrence: Number.parseInt(withOccurrence[2] ?? "0", 10),
	};
}

function collectTrackedChangeStartTokens(
	html: string,
	tokenPrefix: string,
	tokenSuffix: string,
): ParsedTrackedChangeStartToken[] {
	const startTokens: ParsedTrackedChangeStartToken[] = [];
	const pattern = new RegExp(
		`${escapeRegExp(tokenPrefix)}(.*?)${escapeRegExp(tokenSuffix)}`,
		"g",
	);

	for (const match of html.matchAll(pattern)) {
		const rawPayload = match[1];
		if (!rawPayload) continue;

		try {
			const payload = JSON.parse(decodeURIComponent(rawPayload)) as {
				id?: unknown;
				author?: unknown;
				date?: unknown;
				occurrence?: unknown;
			};
			if (typeof payload.id !== "string" || payload.id.length === 0) continue;

			startTokens.push({
				id: payload.id,
				author: typeof payload.author === "string" ? payload.author : undefined,
				date: typeof payload.date === "string" ? payload.date : undefined,
				occurrence: normalizeOccurrence(payload.occurrence),
				startToken: `${tokenPrefix}${rawPayload}${tokenSuffix}`,
			});
		} catch {
			// Skip malformed tokens
		}
	}

	return startTokens;
}

function collectTrackedChangeEndTokens(
	html: string,
	tokenPrefix: string,
	tokenSuffix: string,
): Map<string, string[]> {
	const tokensByPairKey = new Map<string, string[]>();
	const pattern = new RegExp(
		`${escapeRegExp(tokenPrefix)}(.*?)${escapeRegExp(tokenSuffix)}`,
		"g",
	);

	for (const match of html.matchAll(pattern)) {
		const rawPayload = match[1];
		if (!rawPayload) continue;

		try {
			const payload = parseTrackedChangeEndTokenPayload(rawPayload);
			if (!payload) continue;

			const pairKey = buildTrackedChangePairKey(payload.id, payload.occurrence);
			const fullToken = `${tokenPrefix}${rawPayload}${tokenSuffix}`;
			const existing = tokensByPairKey.get(pairKey);

			if (existing) {
				existing.push(fullToken);
			} else {
				tokensByPairKey.set(pairKey, [fullToken]);
			}
		} catch {
			// Skip malformed tokens
		}
	}

	return tokensByPairKey;
}

function matchTrackedChangeTokenPairs(
	startTokens: ParsedTrackedChangeStartToken[],
	endTokensByPairKey: Map<string, string[]>,
	type: DocxTrackedChange["type"],
): DocxTrackedChange[] {
	const changes: DocxTrackedChange[] = [];

	for (const startToken of startTokens) {
		const pairKey = buildTrackedChangePairKey(
			startToken.id,
			startToken.occurrence,
		);
		const endTokens = endTokensByPairKey.get(pairKey);
		const endToken = endTokens?.shift();
		if (!endToken) continue;

		changes.push({
			id: startToken.id,
			type,
			author: startToken.author,
			date: startToken.date,
			occurrence: startToken.occurrence,
			startToken: startToken.startToken,
			endToken,
		});
	}

	return changes;
}

/**
 * Parse tracked change tokens (insertions and deletions) from HTML.
 *
 * This function extracts all tracked changes from HTML that contains
 * DOCX tracking tokens. It returns both the changes and token strings
 * needed to locate and apply them in an editor.
 *
 * @param html - The HTML string containing tracking tokens
 * @returns Parsed tracked changes with token strings
 *
 * @example
 * ```ts
 * const html = mammothResult.value;
 * const { changes, insertionCount, deletionCount } = parseDocxTrackedChanges(html);
 *
 * for (const change of changes) {
 *   // Find and apply each change in the editor
 *   const startRange = searchRange(editor, change.startToken);
 *   const endRange = searchRange(editor, change.endToken);
 *   // Apply suggestion marks...
 * }
 * ```
 */
export function parseDocxTrackedChanges(
	html: string,
): ParseTrackedChangesResult {
	const insertionStarts = collectTrackedChangeStartTokens(
		html,
		DOCX_INSERTION_START_TOKEN_PREFIX,
		DOCX_INSERTION_TOKEN_SUFFIX,
	);
	const insertionEnds = collectTrackedChangeEndTokens(
		html,
		DOCX_INSERTION_END_TOKEN_PREFIX,
		DOCX_INSERTION_TOKEN_SUFFIX,
	);
	const insertionChanges = matchTrackedChangeTokenPairs(
		insertionStarts,
		insertionEnds,
		"insert",
	);

	const deletionStarts = collectTrackedChangeStartTokens(
		html,
		DOCX_DELETION_START_TOKEN_PREFIX,
		DOCX_DELETION_TOKEN_SUFFIX,
	);
	const deletionEnds = collectTrackedChangeEndTokens(
		html,
		DOCX_DELETION_END_TOKEN_PREFIX,
		DOCX_DELETION_TOKEN_SUFFIX,
	);
	const deletionChanges = matchTrackedChangeTokenPairs(
		deletionStarts,
		deletionEnds,
		"remove",
	);

	return {
		changes: [...insertionChanges, ...deletionChanges],
		insertionCount: insertionChanges.length,
		deletionCount: deletionChanges.length,
	};
}

// ============================================================================
// Apply Tracked Change Suggestions
// ============================================================================

/**
 * Apply tracked change suggestions (insertions and deletions) to the editor.
 *
 * This function:
 * 1. Finds start/end tokens in the editor using searchRange
 * 2. Applies suggestion marks to the text between tokens
 * 3. Removes the tokens from the document
 *
 * @param options - Options for applying suggestions
 * @returns Result with counts and errors
 *
 * @example
 * ```ts
 * import { parseDocxTrackedChanges } from './importTrackChanges';
 * import { applyTrackedChangeSuggestions } from './importTrackChanges';
 * import { getSuggestionKey } from '@platejs/suggestion';
 *
 * const { changes } = parseDocxTrackedChanges(html);
 *
 * const result = applyTrackedChangeSuggestions({
 *   editor,
 *   changes,
 *   searchRange: mySearchRangeFn,
 *   suggestionKey: 'suggestion',
 *   getSuggestionKey,
 *   isText: TextApi.isText,
 * });
 *
 * console.log(`Applied ${result.insertions} insertions, ${result.deletions} deletions`);
 * ```
 */
export function applyTrackedChangeSuggestions(
	options: ApplySuggestionsOptions,
): ApplySuggestionsResult {
	const {
		editor,
		changes,
		searchRange,
		suggestionKey,
		getSuggestionKey,
		isText,
	} = options;

	let insertions = 0;
	let deletions = 0;
	const errors: string[] = [];
	const usersMap = new Map<string, string>();

	for (const change of changes) {
		try {
			const startTokenRange = searchRange(editor, change.startToken);
			const endTokenRange = searchRange(editor, change.endToken);

			if (!startTokenRange || !endTokenRange) {
				// Clean up any orphan tokens
				if (startTokenRange) {
					editor.tf.delete({ at: startTokenRange });
				}
				if (endTokenRange) {
					editor.tf.delete({ at: endTokenRange });
				}
				errors.push(`Missing token for change ${change.id}`);
				continue;
			}

			// Use rangeRef to track ranges through node-splitting operations
			const startTokenRef = editor.api.rangeRef(startTokenRange);
			const endTokenRef = editor.api.rangeRef(endTokenRange);

			const currentStartRange = startTokenRef.current;
			const currentEndRange = endTokenRef.current;

			if (!currentStartRange || !currentEndRange) {
				startTokenRef.unref();
				endTokenRef.unref();
				errors.push(`Invalid range for change ${change.id}`);
				continue;
			}

			// Normalize range to ensure anchor comes before focus
			let startPoint = currentStartRange.focus;
			let endPoint = currentEndRange.anchor;

			if (isPointAfter(startPoint, endPoint)) {
				[startPoint, endPoint] = [endPoint, startPoint];
			}

			const changeRange = { anchor: startPoint, focus: endPoint };

			const createdAt = parseDate(change.date);
			const userId = formatAuthorAsUserId(change.author);

			// Track unique users for registration in app user store
			if (change.author && !usersMap.has(userId)) {
				usersMap.set(userId, change.author);
			}

			// Apply suggestion marks
			editor.tf.setNodes(
				{
					[suggestionKey]: true,
					[getSuggestionKey(change.id)]: {
						id: change.id,
						type: change.type,
						userId,
						createdAt,
					},
				},
				{
					at: changeRange,
					match: isText,
					split: true,
				},
			);

			if (change.type === "insert") {
				insertions++;
			} else {
				deletions++;
			}

			// Delete tokens (end first to avoid shifting)
			const endRange = endTokenRef.unref();
			if (endRange) {
				editor.tf.delete({ at: endRange });
			}

			const startRange = startTokenRef.unref();
			if (startRange) {
				editor.tf.delete({ at: startRange });
			}
		} catch (error) {
			errors.push(
				`Failed to apply change ${change.id}: ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	}

	return {
		insertions,
		deletions,
		total: insertions + deletions,
		errors,
		users: Array.from(usersMap.entries()).map(([id, name]) => ({ id, name })),
	};
}

// ============================================================================
// Utility Functions for Tracking Detection
// ============================================================================

/**
 * Check if HTML contains any DOCX tracking tokens.
 *
 * This is a fast check that doesn't parse the tokens, just checks
 * for their presence.
 *
 * @param html - The HTML string to check
 * @returns Whether any tracking tokens are present
 */
export function hasDocxTrackingTokens(html: string): boolean {
	return (
		html.includes(DOCX_INSERTION_START_TOKEN_PREFIX) ||
		html.includes(DOCX_DELETION_START_TOKEN_PREFIX)
	);
}

/**
 * Remove all DOCX tracked change tokens from HTML.
 *
 * This preserves the content but removes the token markers.
 *
 * @param html - The HTML string containing tracking tokens
 * @returns HTML with tokens removed (content preserved)
 */
export function stripDocxTrackingTokens(html: string): string {
	const tokenPattern = /\[\[DOCX_(INS|DEL|CMT)_(START|END):[^\]]+\]\]/g;
	return html.replace(tokenPattern, "");
}
