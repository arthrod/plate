import type { SlateEditor } from 'platejs';

import HtmlToDocx from '@turbodocx/html-to-docx';
import { serializeHtml } from 'platejs/static';

import type { DocxExportOptions, DocxExportResult } from './types';

/**
 * Default function to wrap editor HTML into a complete HTML document.
 */
const defaultCreateHtmlDocument = ({ editorHtml }: { editorHtml: string }) =>
  [
    '<!DOCTYPE html>',
    '<html lang="en">',
    '  <head>',
    '    <meta charset="UTF-8" />',
    '    <title>Document</title>',
    '  </head>',
    '  <body>',
    editorHtml,
    '  </body>',
    '</html>',
  ].join('\n');

/**
 * Standalone helper: export any Plate editor to DOCX.
 *
 * This is the core implementation; the plugin API just calls into it.
 *
 * @example
 * ```ts
 * import { createStaticEditor } from 'platejs/static';
 * import { exportEditorToDocx } from '@platejs/docx-export';
 *
 * const editor = createStaticEditor({ plugins, value });
 * const docx = await exportEditorToDocx(editor, {
 *   documentOptions: { title: 'My Document' },
 * });
 *
 * // In Node.js, docx is ArrayBuffer
 * // In browser, docx is Blob
 * ```
 */
export const exportEditorToDocx = async (
  editor: SlateEditor,
  options?: DocxExportOptions
): Promise<DocxExportResult> => {
  const {
    createHtmlDocument = defaultCreateHtmlDocument,
    documentOptions,
    footerHtml,
    headerHtml,
    html,
  } = options ?? {};

  // 1. Get HTML from the Plate editor if the caller didn't provide it.
  //
  //    serializeHtml(editor) uses the editor's plugin HTML rules and components.
  //    In static/SSR contexts you'll normally pass a static editor created
  //    with createStaticEditor; in client contexts you can also call this,
  //    but it will pull in the static renderer into the bundle.
  const editorHtml = html ?? (await serializeHtml(editor));

  // 2. Wrap into a complete HTML document for HtmlToDocx.
  const fullHtml = createHtmlDocument({ editorHtml });

  // 3. Let @turbodocx/html-to-docx do the heavy lifting.
  //    - In Node: returns ArrayBuffer
  //    - In browser: returns Blob
  return HtmlToDocx(
    fullHtml,
    headerHtml ?? null,
    documentOptions ?? {},
    footerHtml ?? null
  );
};
