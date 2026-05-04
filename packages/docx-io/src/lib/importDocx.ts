import { cleanDocx } from '@platejs/docx';
import mammoth from 'mammoth';
import type { SlateEditor } from 'platejs';

import {
  extractComments,
  preprocessMammothHtml,
} from './preprocessMammothHtml';
import type { ImportDocxOptions, ImportDocxResult } from './types';

/**
 * Parse HTML string to DOM element for deserialization.
 */
function parseHtmlElement(html: string): HTMLElement | undefined {
  const doc = new DOMParser().parseFromString(html, 'text/html');

  return doc.body ?? undefined;
}

/**
 * Import a DOCX file and convert it to Plate editor nodes.
 *
 * @param editor - The Plate editor instance
 * @param arrayBuffer - The DOCX file as ArrayBuffer
 * @param options - Import options
 * @returns Import result with nodes, comments, and warnings
 *
 * @example
 * ```ts
 * const file = await picker.getFile();
 * const arrayBuffer = await file.arrayBuffer();
 * const result = await importDocx(editor, arrayBuffer);
 *
 * // Insert nodes into editor
 * editor.tf.insertNodes(result.nodes);
 *
 * // Handle comments separately
 * for (const comment of result.comments) {
 *   // Create discussions via your backend
 * }
 * ```
 */
export async function importDocx(
  editor: SlateEditor,
  arrayBuffer: ArrayBuffer,
  options: ImportDocxOptions = {}
): Promise<ImportDocxResult> {
  const { rtf = '', tracking } = options;

  if (tracking) {
    // TODO(#342): branch into the forked Mammoth + token-resolver path and
    // return `ImportDocxWithTrackingResult`. Throw until then so callers
    // can't mistake "tracking ignored" for "tracked changes imported".
    throw new Error(
      'Tracked-changes import branch is not implemented yet (tracked in #342).'
    );
  }

  // Convert DOCX to HTML using mammoth
  const mammothResult = await mammoth.convertToHtml(
    { arrayBuffer },
    { styleMap: ['comment-reference => sup'] }
  );

  const mammothHtml = mammothResult.value;
  const warnings = mammothResult.messages.map((msg) => msg.message);

  // Preprocess to extract comments
  const {
    commentById,
    commentIds,
    html: preprocessedHtml,
  } = preprocessMammothHtml(mammothHtml);

  // Clean DOCX-specific HTML
  const cleanedHtml = cleanDocx(preprocessedHtml, rtf);

  // Parse HTML to DOM element
  const element = parseHtmlElement(cleanedHtml);

  if (!element) {
    return {
      comments: [],
      nodes: [],
      warnings: [...warnings, 'Failed to parse HTML'],
    };
  }

  // Deserialize HTML to Plate nodes
  const nodes = editor.api.html.deserialize({ element }) as any[];

  // Extract comments
  const comments = extractComments(commentById, commentIds);

  return {
    comments,
    nodes,
    warnings,
  };
}
