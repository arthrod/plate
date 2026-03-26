/**
 * HTML to DOCX converter using html-to-docx
 *
 * This module wraps the html-to-docx library to provide
 * a simple API for converting HTML content to DOCX format.
 *
 * IMPORTANT: This uses native DOCX element generation (not altChunk).
 * altChunk embeds raw HTML and only works in Microsoft Word - it breaks
 * in LibreOffice and Google Docs. This library converts HTML to native
 * DOCX elements (<w:p>, <w:r>, <w:t>, tables, images, etc.) which works
 * in all word processors.
 *
 * @packageDocumentation
 */

import HTMLtoDOCX from "./html-to-docx-dist/browser";

// Re-export types from the library
export type {
    DocumentOptions,
    HeadingOptions,
    HeadingSpacing,
    HeadingStyleOptions,
    LineNumberOptions,
    Margins,
    NumberingOptions,
    PageSize,
    TableBorderOptions,
    TableOptions
} from "./html-to-docx-dist/browser";

import type { DocumentOptions, Margins } from "./html-to-docx-dist/browser";

// Backwards compatibility aliases
export type DocumentMargins = Margins;
export type HtmlToDocxOptions = DocumentOptions;

const DOCX_MIME_TYPE =
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document";

type HtmlToDocxResult = ArrayBuffer | Blob | Buffer | Uint8Array;

function hasNodeBufferApi(): boolean {
	return typeof Buffer !== "undefined" && typeof Buffer.from === "function";
}

function isBuffer(value: unknown): value is Buffer {
	return hasNodeBufferApi() && Buffer.isBuffer(value);
}

async function createDocxResult(
	html: string,
	options: DocumentOptions,
): Promise<HtmlToDocxResult> {
	// Handle empty HTML - the underlying library crashes on empty string
	const safeHtml = html.trim() === "" ? "<p></p>" : html;
	const result = await HTMLtoDOCX(safeHtml, undefined, options);
	return result as HtmlToDocxResult;
}

async function toBlob(result: HtmlToDocxResult): Promise<Blob> {
	if (result instanceof Blob) {
		return result;
	}

	if (result instanceof ArrayBuffer) {
		return new Blob([new Uint8Array(result)], { type: DOCX_MIME_TYPE });
	}

	if (result instanceof Uint8Array || isBuffer(result)) {
		return new Blob([Uint8Array.from(result)], { type: DOCX_MIME_TYPE });
	}

	throw new TypeError("Unsupported HTMLtoDOCX result type for Blob output");
}

async function toBuffer(result: HtmlToDocxResult): Promise<Buffer> {
	if (!hasNodeBufferApi()) {
		throw new Error("htmlToDocxBuffer requires Node.js Buffer support");
	}

	if (isBuffer(result)) {
		return result;
	}

	if (result instanceof Blob) {
		return Buffer.from(await result.arrayBuffer());
	}

	if (result instanceof ArrayBuffer) {
		return Buffer.from(new Uint8Array(result));
	}

	if (result instanceof Uint8Array) {
		return Buffer.from(Uint8Array.from(result));
	}

	throw new TypeError("Unsupported HTMLtoDOCX result type for Buffer output");
}

/**
 * Convert HTML content to a DOCX blob.
 *
 * This function uses html-to-docx to create a valid DOCX file
 * from HTML content with proper support for images, tables, and styling.
 *
 * @param html - The HTML content to convert
 * @param options - Optional document configuration (orientation, margins, etc.)
 * @returns A Promise that resolves to a Blob containing the DOCX file
 *
 * @example
 * ```typescript
 * const html = '<h1>Hello World</h1><p>This is a paragraph.</p>';
 * const blob = await htmlToDocxBlob(html, { orientation: 'landscape' });
 *
 * // Download the file
 * const url = URL.createObjectURL(blob);
 * const a = document.createElement('a');
 * a.href = url;
 * a.download = 'document.docx';
 * a.click();
 * ```
 */
export async function htmlToDocxBlob(
	html: string,
	options: DocumentOptions = {},
): Promise<Blob> {
	const result = await createDocxResult(html, options);
	return toBlob(result);
}

/**
 * Convert HTML content to a DOCX buffer (Node/server-safe).
 *
 * @param html - The HTML content to convert
 * @param options - Optional document configuration (orientation, margins, etc.)
 * @returns A Promise that resolves to a Node.js Buffer containing the DOCX file
 */
export async function htmlToDocxBuffer(
	html: string,
	options: DocumentOptions = {},
): Promise<Buffer> {
	const result = await createDocxResult(html, options);
	return toBuffer(result);
}
