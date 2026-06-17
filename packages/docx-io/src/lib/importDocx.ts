import { cleanDocx } from '@platejs/docx';
import mammoth from 'mammoth';
import type { SlateEditor } from 'platejs';

import { extractTokens } from './extractTokensForCleaning';
import {
  extractComments,
  preprocessMammothHtml,
} from './preprocessMammothHtml';
import { reapplyTokens } from './reapplyTokens';
import type {
  ImportDocxOptions,
  ImportDocxResult,
  ImportDocxWithTrackingResult,
} from './types';

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
): Promise<ImportDocxResult | ImportDocxWithTrackingResult> {
  const { rtf = '', tracking = false } = options;

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

  // Variant C (#349): when tracking is enabled, extract tracking tokens
  // BEFORE cleanDocx so the cleaner stays token-blind.
  const { stripped: htmlForCleanup, tokens: stashedTokens } = tracking
    ? extractTokens(preprocessedHtml)
    : { stripped: preprocessedHtml, tokens: [] };

  // Clean DOCX-specific HTML
  const cleanedHtml = cleanDocx(htmlForCleanup, rtf);

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
  let nodes = editor.api.html.deserialize({ element }) as any[];

  // Extract comments
  const comments = extractComments(commentById, commentIds);

  // Variant C (#349): re-anchor stashed tokens onto the deserialized tree.
  // Anchor misses are aggregated and surfaced via the result's `errors[]`.
  if (tracking && stashedTokens.length > 0) {
    const reapplied = reapplyTokens(editor, nodes, stashedTokens);
    nodes = reapplied.nodes as any[];
    const errors = reapplied.errors.map(
      (err) => `${err.reason}: ${err.token.kind}#${err.token.index}`
    );
    return {
      comments,
      errors,
      nodes,
      warnings,
    };
  }

  return {
    comments,
    nodes,
    warnings,
  };
}
