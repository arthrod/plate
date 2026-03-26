import { describe, expect, it } from "bun:test";

import {
	applyTrackedChangeSuggestions,
	DOCX_DELETION_END_TOKEN_PREFIX,
	DOCX_DELETION_START_TOKEN_PREFIX,
	DOCX_DELETION_TOKEN_SUFFIX,
	DOCX_INSERTION_END_TOKEN_PREFIX,
	DOCX_INSERTION_START_TOKEN_PREFIX,
	DOCX_INSERTION_TOKEN_SUFFIX,
	parseDocxTrackedChanges,
	stripDocxTrackingTokens,
	type TRange,
	type TrackingEditor,
} from "../importTrackChanges";

function buildInsertionToken(
	payload: { id: string; author?: string; date?: string; occurrence?: number },
	position: "start" | "end",
): string {
	const occurrence = payload.occurrence ?? 0;
	if (position === "start") {
		const encoded = encodeURIComponent(
			JSON.stringify({ ...payload, occurrence }),
		);
		return `${DOCX_INSERTION_START_TOKEN_PREFIX}${encoded}${DOCX_INSERTION_TOKEN_SUFFIX}`;
	}

	return `${DOCX_INSERTION_END_TOKEN_PREFIX}${payload.id}:${occurrence}${DOCX_INSERTION_TOKEN_SUFFIX}`;
}

function buildDeletionToken(
	payload: { id: string; author?: string; date?: string; occurrence?: number },
	position: "start" | "end",
): string {
	const occurrence = payload.occurrence ?? 0;
	if (position === "start") {
		const encoded = encodeURIComponent(
			JSON.stringify({ ...payload, occurrence }),
		);
		return `${DOCX_DELETION_START_TOKEN_PREFIX}${encoded}${DOCX_DELETION_TOKEN_SUFFIX}`;
	}

	return `${DOCX_DELETION_END_TOKEN_PREFIX}${payload.id}:${occurrence}${DOCX_DELETION_TOKEN_SUFFIX}`;
}

function makeRange(
	paragraphIndex: number,
	anchorOffset: number,
	focusOffset: number,
): TRange {
	return {
		anchor: { path: [paragraphIndex, 0], offset: anchorOffset },
		focus: { path: [paragraphIndex, 0], offset: focusOffset },
	};
}

function createEditorHarness(_tokenRanges: Map<string, TRange | null>): {
	appliedRanges: TRange[];
	state: { deletedTokenCount: number };
	editor: TrackingEditor;
} {
	const appliedRanges: TRange[] = [];
	const state = { deletedTokenCount: 0 };

	const editor: TrackingEditor = {
		api: {
			rangeRef: (range) => ({
				current: range,
				unref: () => range,
			}),
			string: () => "",
		},
		tf: {
			delete: () => {
				state.deletedTokenCount += 1;
			},
			setNodes: (_props, options) => {
				appliedRanges.push(options.at);
			},
			withMerging: (fn) => {
				fn();
			},
		},
	};

	editor.api.nodes = () => [];

	return { appliedRanges, state, editor };
}

function createSearchRange(
	tokenRanges: Map<string, TRange | null>,
): (editor: TrackingEditor, search: string) => TRange | null {
	return (_editor, search) => tokenRanges.get(search) ?? null;
}

function runInsertionParagraphScenario(paragraphCount: number): {
	appliedRanges: TRange[];
	parsedCount: number;
} {
	const html = Array.from({ length: paragraphCount }, (_, index) => {
		const payload = {
			id: "ins-multi",
			author: "Alice",
			date: "2024-01-01",
			occurrence: index,
		};

		return `<p>${buildInsertionToken(payload, "start")}paragraph-${index}${buildInsertionToken(payload, "end")}</p>`;
	}).join("");

	const parsed = parseDocxTrackedChanges(html);
	const tokenRanges = new Map<string, TRange | null>();

	for (const [index, change] of parsed.changes.entries()) {
		tokenRanges.set(change.startToken, makeRange(index, 0, 6));
		tokenRanges.set(change.endToken, makeRange(index, 30, 36));
	}

	const harness = createEditorHarness(tokenRanges);
	const result = applyTrackedChangeSuggestions({
		editor: harness.editor,
		changes: parsed.changes,
		searchRange: createSearchRange(tokenRanges),
		suggestionKey: "suggestion",
		getSuggestionKey: (id) => `suggestion_${id}`,
		isText: () => true,
	});

	expect(result.errors).toEqual([]);
	expect(result.insertions).toBe(paragraphCount);
	expect(result.deletions).toBe(0);
	expect(harness.state.deletedTokenCount).toBe(paragraphCount * 2);

	return {
		appliedRanges: harness.appliedRanges,
		parsedCount: parsed.changes.length,
	};
}

describe("DOCX Import Multi-Paragraph Track Changes", () => {
	it("marks all paragraphs for a 2-paragraph insertion", () => {
		const outcome = runInsertionParagraphScenario(2);

		expect(outcome.parsedCount).toBe(2);
		expect(outcome.appliedRanges).toHaveLength(2);
		expect(outcome.appliedRanges.map((range) => range.anchor.path[0])).toEqual([
			0, 1,
		]);
	});

	it("marks all paragraphs for a 3-paragraph insertion", () => {
		const outcome = runInsertionParagraphScenario(3);

		expect(outcome.parsedCount).toBe(3);
		expect(outcome.appliedRanges).toHaveLength(3);
		expect(outcome.appliedRanges.map((range) => range.anchor.path[0])).toEqual([
			0, 1, 2,
		]);
	});

	it("marks all paragraphs for a 4+ paragraph insertion", () => {
		const outcome = runInsertionParagraphScenario(5);

		expect(outcome.parsedCount).toBe(5);
		expect(outcome.appliedRanges).toHaveLength(5);
		expect(outcome.appliedRanges.map((range) => range.anchor.path[0])).toEqual([
			0, 1, 2, 3, 4,
		]);
	});

	it("handles consecutive, nested, and mixed insert/delete changes across paragraphs", () => {
		const html = `
      <p>${buildInsertionToken({ id: "A", occurrence: 0 }, "start")}a0${buildInsertionToken({ id: "A", occurrence: 0 }, "end")}</p>
      <p>${buildInsertionToken({ id: "A", occurrence: 1 }, "start")}a1${buildDeletionToken({ id: "B", occurrence: 0 }, "start")}nested${buildDeletionToken({ id: "B", occurrence: 0 }, "end")}${buildInsertionToken({ id: "A", occurrence: 1 }, "end")}</p>
      <p>${buildDeletionToken({ id: "B", occurrence: 1 }, "start")}b1${buildDeletionToken({ id: "B", occurrence: 1 }, "end")}</p>
      <p>${buildInsertionToken({ id: "C", occurrence: 0 }, "start")}c0${buildInsertionToken({ id: "C", occurrence: 0 }, "end")}</p>
    `;

		const parsed = parseDocxTrackedChanges(html);
		expect(parsed.changes).toHaveLength(5);
		expect(parsed.insertionCount).toBe(3);
		expect(parsed.deletionCount).toBe(2);

		const tokenRanges = new Map<string, TRange | null>();
		for (const [index, change] of parsed.changes.entries()) {
			tokenRanges.set(change.startToken, makeRange(index, 0, 4));
			tokenRanges.set(change.endToken, makeRange(index, 20, 24));
		}

		const harness = createEditorHarness(tokenRanges);
		const applied = applyTrackedChangeSuggestions({
			editor: harness.editor,
			changes: parsed.changes,
			searchRange: createSearchRange(tokenRanges),
			suggestionKey: "suggestion",
			getSuggestionKey: (id) => `suggestion_${id}`,
			isText: () => true,
		});

		expect(applied.total).toBe(5);
		expect(applied.errors).toEqual([]);
		expect(harness.appliedRanges).toHaveLength(5);
	});

	it("strips all tracking tokens including occurrence-aware tokens", () => {
		const html = `
      <p>${buildInsertionToken({ id: "ins", occurrence: 0 }, "start")}one${buildInsertionToken({ id: "ins", occurrence: 0 }, "end")}</p>
      <p>${buildInsertionToken({ id: "ins", occurrence: 1 }, "start")}two${buildInsertionToken({ id: "ins", occurrence: 1 }, "end")}</p>
      <p>${buildDeletionToken({ id: "del", occurrence: 0 }, "start")}three${buildDeletionToken({ id: "del", occurrence: 0 }, "end")}</p>
    `;

		const cleaned = stripDocxTrackingTokens(html);

		expect(cleaned).not.toContain("[[DOCX_INS_START:");
		expect(cleaned).not.toContain("[[DOCX_INS_END:");
		expect(cleaned).not.toContain("[[DOCX_DEL_START:");
		expect(cleaned).not.toContain("[[DOCX_DEL_END:");
		expect(cleaned).toContain("one");
		expect(cleaned).toContain("two");
		expect(cleaned).toContain("three");
	});
});
