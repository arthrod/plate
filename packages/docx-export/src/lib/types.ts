import type HtmlToDocx from '@turbodocx/html-to-docx';

/**
 * Type of the `documentOptions` parameter forwarded to HtmlToDocx.
 * This stays in sync with the library's typings.
 */
export type HtmlToDocxOptions = NonNullable<Parameters<typeof HtmlToDocx>[2]>;

/**
 * Result type returned by HtmlToDocx:
 * - ArrayBuffer in Node.js
 * - Blob in browser environments
 */
export type DocxExportResult = Awaited<ReturnType<typeof HtmlToDocx>>;

export type DocxExportOptions = {
  /**
   * Function that wraps the editor HTML into a full HTML document string.
   *
   * The default is a minimal HTML shell:
   *
   * ```html
   * <!DOCTYPE html>
   * <html lang="en">
   *   <head><meta charset="UTF-8" /><title>Document</title></head>
   *   <body>{editorHtml}</body>
   * </html>
   * ```
   */
  createHtmlDocument?: (params: { editorHtml: string }) => string;

  /**
   * Options forwarded to HtmlToDocx as its third parameter
   * (orientation, margins, pageSize, imageProcessing, etc.).
   */
  documentOptions?: HtmlToDocxOptions;

  /**
   * Raw HTML inserted into the DOCX footer.
   * Passed as the fourth argument to HtmlToDocx.
   */
  footerHtml?: string | null;

  /**
   * Raw HTML inserted into the DOCX header.
   * Passed as the second argument to HtmlToDocx.
   */
  headerHtml?: string | null;

  /**
   * If provided, this HTML will be used directly instead of calling serializeHtml.
   * Useful if you already generated HTML elsewhere.
   */
  html?: string;
};
