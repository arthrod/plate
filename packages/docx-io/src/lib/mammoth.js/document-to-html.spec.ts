import { describe, expect, it } from "bun:test";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const documents = require("./lib/documents.js");
const { DocumentConverter } = require("./lib/document-to-html.js");

function buildRunText(text: string) {
	return documents.Run([documents.Text(text)]);
}

function buildInsertedParagraph(changeId: string, text: string) {
	return documents.Paragraph([
		documents.inserted([buildRunText(text)], {
			author: "Alice",
			changeId,
			date: "2024-01-01T00:00:00Z",
		}),
	]);
}

function buildDeletedParagraph(changeId: string, text: string) {
	return documents.Paragraph([
		documents.deleted([buildRunText(text)], {
			author: "Bob",
			changeId,
			date: "2024-01-01T00:00:00Z",
		}),
	]);
}

async function convertToHtml(paragraphs: unknown[]): Promise<string> {
	const converter = DocumentConverter({});
	const documentNode = documents.Document(paragraphs, { comments: [] });
	const result = await converter.convertToHtml(documentNode);
	return result.value;
}

function extractStartPayloads(
	html: string,
	prefix: "INS" | "DEL",
): Array<{ id?: string; occurrence?: number }> {
	const tokenPattern =
		prefix === "INS"
			? /\[\[DOCX_INS_START:(.*?)\]\]/g
			: /\[\[DOCX_DEL_START:(.*?)\]\]/g;
	const payloads: Array<{ id?: string; occurrence?: number }> = [];

	for (const match of html.matchAll(tokenPattern)) {
		const encoded = match[1];
		if (!encoded) continue;
		payloads.push(JSON.parse(decodeURIComponent(encoded)));
	}

	return payloads;
}

function extractEndTokenIds(html: string, prefix: "INS" | "DEL"): string[] {
	const tokenPattern =
		prefix === "INS"
			? /\[\[DOCX_INS_END:([^\]]+)\]\]/g
			: /\[\[DOCX_DEL_END:([^\]]+)\]\]/g;

	const ids: string[] = [];
	for (const match of html.matchAll(tokenPattern)) {
		if (match[1]) ids.push(match[1]);
	}

	return ids;
}

describe("mammoth tracked change token generation", () => {
	it("assigns unique occurrence values for repeated insertion change IDs", async () => {
		const html = await convertToHtml([
			buildInsertedParagraph("42", "first"),
			buildInsertedParagraph("42", "second"),
			buildInsertedParagraph("42", "third"),
		]);

		const startPayloads = extractStartPayloads(html, "INS");
		const endTokenIds = extractEndTokenIds(html, "INS");

		expect(startPayloads).toHaveLength(3);
		expect(startPayloads.map((payload) => payload.id)).toEqual([
			"42",
			"42",
			"42",
		]);
		expect(startPayloads.map((payload) => payload.occurrence)).toEqual([
			0, 1, 2,
		]);
		expect(endTokenIds).toEqual(["42:0", "42:1", "42:2"]);
	});

	it("assigns unique occurrence values for repeated deletion change IDs", async () => {
		const html = await convertToHtml([
			buildDeletedParagraph("7", "first"),
			buildDeletedParagraph("7", "second"),
			buildDeletedParagraph("7", "third"),
		]);

		const startPayloads = extractStartPayloads(html, "DEL");
		const endTokenIds = extractEndTokenIds(html, "DEL");

		expect(startPayloads).toHaveLength(3);
		expect(startPayloads.map((payload) => payload.id)).toEqual(["7", "7", "7"]);
		expect(startPayloads.map((payload) => payload.occurrence)).toEqual([
			0, 1, 2,
		]);
		expect(endTokenIds).toEqual(["7:0", "7:1", "7:2"]);
	});

	it("increments occurrences independently per change ID", async () => {
		const html = await convertToHtml([
			buildInsertedParagraph("A", "a0"),
			buildInsertedParagraph("B", "b0"),
			buildInsertedParagraph("A", "a1"),
			buildInsertedParagraph("A", "a2"),
			buildInsertedParagraph("B", "b1"),
		]);

		const payloads = extractStartPayloads(html, "INS");
		const payloadsById = new Map<string, number[]>();

		for (const payload of payloads) {
			if (!payload.id || payload.occurrence === undefined) continue;
			const occurrences = payloadsById.get(payload.id) ?? [];
			occurrences.push(payload.occurrence);
			payloadsById.set(payload.id, occurrences);
		}

		expect(payloadsById.get("A")).toEqual([0, 1, 2]);
		expect(payloadsById.get("B")).toEqual([0, 1]);
	});

	it("resets occurrence counters for each document conversion", async () => {
		const converter = DocumentConverter({});
		const convert = async (changeId: string) => {
			const result = await converter.convertToHtml(
				documents.Document([buildInsertedParagraph(changeId, "text")], {
					comments: [],
				}),
			);
			return extractStartPayloads(result.value, "INS");
		};

		const first = await convert("same-id");
		const second = await convert("same-id");

		expect(first[0]?.occurrence).toBe(0);
		expect(second[0]?.occurrence).toBe(0);
	});
});
