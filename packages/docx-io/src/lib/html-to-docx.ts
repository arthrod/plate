/**
 * Backwards-compatible HTML-to-DOCX exports.
 *
 * @packageDocumentation
 */

export { htmlToDocxBlob, htmlToDocxBuffer } from "./exportDocx";

export type {
	DocumentOptions,
	LineNumberOptions,
	Margins,
	NumberingOptions,
	PageSize,
	TableOptions,
} from "./html-to-docx-dist/browser";

import type { DocumentOptions, Margins } from "./html-to-docx-dist/browser";

// Backwards compatibility aliases
export type DocumentMargins = Margins;
export type HtmlToDocxOptions = DocumentOptions;
