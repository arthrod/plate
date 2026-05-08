/**
 * HTML to DOCX converter using @turbodocx/html-to-docx
 *
 * This module wraps the @turbodocx/html-to-docx library to provide
 * a simple API for converting HTML content to DOCX format.
 *
 * @packageDocumentation
 */

import JSZip from 'jszip';

import addFilesToContainer from './internal/html-to-docx';
import type { DocumentOptions, Margins } from './internal/types';

// Re-export types from the library
export type {
  DocumentOptions,
  LineNumberOptions,
  Margins,
  NumberingOptions,
  PageSize,
  TableOptions,
} from './internal/types';

// Backwards compatibility aliases
export type DocumentMargins = Margins;
export type HtmlToDocxOptions = DocumentOptions;

/**
 * Per-document chrome (header / footer) and section-property overrides.
 *
 * `headerHtml` / `footerHtml` are serialized into separate `word/headerN.xml`
 * / `word/footerN.xml` parts and referenced from the body's `w:sectPr` via
 * `w:headerReference` / `w:footerReference`. Pass them when round-tripping
 * Plate documents that carry hidden header / footer blocks (the
 * `@platejs/pagination` plugin emits these).
 *
 * The `header` / `footer` flags inside `options` toggle whether the parts
 * actually emit; defaults flip on automatically when the corresponding HTML
 * is non-empty.
 */
export type DocxChrome = {
  footerHtml?: string;
  headerHtml?: string;
};

/**
 * Convert HTML content to a DOCX blob.
 *
 * Optionally serializes header / footer HTML into the section properties
 * via `w:headerReference` / `w:footerReference` so the document opens in
 * Word with the correct chrome on every page.
 *
 * @param html - The HTML content to convert
 * @param options - Optional document configuration (orientation, margins, etc.)
 * @param chrome - Optional header / footer HTML for paginated round-trips
 * @returns A Promise that resolves to a Blob containing the DOCX file
 */
export async function htmlToDocxBlob(
  html: string,
  options: DocumentOptions = {},
  chrome: DocxChrome = {}
): Promise<Blob> {
  // Handle empty HTML - the underlying library crashes on empty string
  const safeHtml = html.trim() === '' ? '<p></p>' : html;

  const headerHtml = chrome.headerHtml?.trim() ? chrome.headerHtml : null;
  const footerHtml = chrome.footerHtml?.trim() ? chrome.footerHtml : null;

  const optionsWithChrome: DocumentOptions = {
    ...options,
    footer: options.footer ?? footerHtml !== null,
    header: options.header ?? headerHtml !== null,
  };

  const zip = new JSZip();
  const resultZip = await addFilesToContainer(
    zip,
    safeHtml,
    optionsWithChrome,
    headerHtml,
    footerHtml
  );
  const buffer = await resultZip.generateAsync({ type: 'uint8array' });
  const blobBuffer = new Uint8Array(buffer);

  return new Blob([blobBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  });
}
