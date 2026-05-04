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
 * Element types whose schema requires inline-only children. Block voids
 * Mammoth puts inside these (e.g. `<p><img/></p>`) must be lifted to siblings.
 */
const INLINE_ONLY_PARENTS = new Set([
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'lic',
  'p',
]);

/**
 * Block containers we walk through but never split on. These already accept
 * block children so their structure is preserved as-is.
 */
const BLOCK_CONTAINERS = new Set([
  'callout',
  'column',
  'column_group',
  'li',
  'ol',
  'table',
  'td',
  'th',
  'toggle',
  'tr',
  'ul',
]);

/**
 * Block-void fallback set used when an editor lacks the relevant void plugin
 * for a given element type. Keeps this normalization useful regardless of
 * which media plugins are registered on the consumer's editor.
 */
const FALLBACK_BLOCK_VOIDS = new Set([
  'audio',
  'file',
  'hr',
  'iframe',
  'img',
  'media_embed',
  'video',
]);

/**
 * Properties safe to copy onto each split half of a paragraph. Anything that
 * uniquely identifies one paragraph (list-item ID, comment / suggestion
 * anchors, etc.) is intentionally excluded — duplicating those would create
 * two paragraphs claiming the same anchor.
 */
const PROPAGATED_PROPERTIES = [
  'align',
  'indent',
  'indentSize',
  'textAlign',
  'textIndent',
  'type',
] as const;

type LiftableNode = {
  children?: LiftableNode[];
  text?: string;
  type?: string;
  [key: string]: unknown;
};

const isText = (node: LiftableNode) => typeof node.text === 'string';

const pickPropagatedProperties = (node: LiftableNode) => {
  const out: Record<string, unknown> = {};
  for (const key of PROPAGATED_PROPERTIES) {
    if (key in node) out[key] = node[key];
  }
  return out;
};

const isBlockChild = (
  editor: SlateEditor | undefined,
  node: LiftableNode
): boolean => {
  if (isText(node)) return false;
  const type = typeof node.type === 'string' ? node.type : undefined;
  if (type && FALLBACK_BLOCK_VOIDS.has(type)) return true;
  if (type && INLINE_ONLY_PARENTS.has(type)) return true;
  if (type && BLOCK_CONTAINERS.has(type)) return true;
  if (editor) {
    try {
      return editor.api.isBlock(node as any);
    } catch {
      return false;
    }
  }
  return false;
};

/**
 * Recursively lift block-void / nested-block children out of inline-only
 * parents (`p`, `h1`-`h6`, `lic`). Pure: returns a new array, never mutates
 * input. Skips block containers (`table`, `tr`, `td`, lists, etc.) so their
 * structure is preserved.
 */
export function liftBlocksOutOfParagraphs(
  editor: SlateEditor | undefined,
  nodes: readonly LiftableNode[]
): LiftableNode[] {
  const out: LiftableNode[] = [];
  for (const node of nodes) {
    if (isText(node)) {
      out.push(node);
      continue;
    }
    const type = typeof node.type === 'string' ? node.type : undefined;
    if (type && INLINE_ONLY_PARENTS.has(type)) {
      out.push(...processInlineOnlyParent(editor, node));
      continue;
    }
    if (node.children && Array.isArray(node.children)) {
      out.push({
        ...node,
        children: liftBlocksOutOfParagraphs(editor, node.children),
      });
      continue;
    }
    out.push(node);
  }
  return out;
}

function processInlineOnlyParent(
  editor: SlateEditor | undefined,
  node: LiftableNode
): LiftableNode[] {
  const children = node.children ?? [];
  const propagated = pickPropagatedProperties(node);
  const result: LiftableNode[] = [];
  let buffer: LiftableNode[] = [];

  const flushBuffer = () => {
    if (buffer.length === 0) return;
    result.push({ ...propagated, children: buffer });
    buffer = [];
  };

  for (const child of children) {
    if (isBlockChild(editor, child)) {
      flushBuffer();
      // Recurse so deeply nested invalid structures are fully flattened.
      const lifted = liftBlocksOutOfParagraphs(editor, [child]);
      result.push(...lifted);
    } else {
      buffer.push(child);
    }
  }
  flushBuffer();

  if (result.length === 0) {
    // Preserve at least an empty paragraph so the surrounding tree is intact.
    return [{ ...propagated, children: [{ text: '' }] }];
  }
  return result;
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
  const { rtf = '' } = options;

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
  const rawNodes = editor.api.html.deserialize({ element }) as any[];

  // Lift block-void / nested-block children out of paragraphs so the resulting
  // tree matches Plate's schema (a `p` cannot contain a block-void `img`).
  const nodes = liftBlocksOutOfParagraphs(editor, rawNodes) as any[];

  // Extract comments
  const comments = extractComments(commentById, commentIds);

  return {
    comments,
    nodes,
    warnings,
  };
}
