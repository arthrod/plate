import { createSlatePlugin } from 'platejs';

import type { DocxExportOptions, DocxExportResult } from './types';

import { exportEditorToDocx } from './exportEditorToDocx';

/**
 * Plugin key for DocxExportPlugin.
 */
export const KEYS_DOCX_EXPORT = 'docxExport';

/**
 * DocxExportPlugin
 *
 * Adds an editor-level API for exporting Plate content to DOCX format.
 *
 * The export process:
 * 1. Serializes editor content to HTML using Plate's serializeHtml
 * 2. Wraps the HTML in a complete document structure
 * 3. Converts to DOCX using @turbodocx/html-to-docx
 *
 * @example
 * ```tsx
 * // Browser usage
 * const docx = await editor.getApi(DocxExportPlugin).export({
 *   documentOptions: { title: 'My Document' },
 * });
 *
 * // docx is a Blob in browser, ArrayBuffer in Node.js
 * const blob = docx as Blob;
 * const url = URL.createObjectURL(blob);
 * const link = document.createElement('a');
 * link.href = url;
 * link.download = 'document.docx';
 * link.click();
 * URL.revokeObjectURL(url);
 * ```
 *
 * @example
 * ```tsx
 * // Server/RSC usage
 * import { createStaticEditor } from 'platejs/static';
 *
 * const editor = createStaticEditor({ plugins, value });
 * const docx = await editor.getApi(DocxExportPlugin).export({
 *   documentOptions: {
 *     title: 'Server Export',
 *     creator: 'My App',
 *   },
 * });
 *
 * // In Node.js, docx is ArrayBuffer
 * const buffer = Buffer.from(docx as ArrayBuffer);
 * ```
 */
export const DocxExportPlugin = createSlatePlugin({
  key: KEYS_DOCX_EXPORT,
}).extendApi(({ editor }) => ({
  /**
   * Export the current editor content as DOCX.
   *
   * @param options - Export options including document metadata, headers, and footers
   * @returns Promise resolving to ArrayBuffer (Node.js) or Blob (browser)
   */
  export(options?: DocxExportOptions): Promise<DocxExportResult> {
    return exportEditorToDocx(editor, options);
  },
}));
