import { cleanDocx } from '@platejs/docx';
import JSZip from 'jszip';
import mammoth from 'mammoth';
import type { SlateEditor } from 'platejs';

import {
  extractComments,
  preprocessMammothHtml,
} from './preprocessMammothHtml';
import type {
  DocxChromeBlock,
  DocxSectionMeta,
  ImportDocxOptions,
  ImportDocxResult,
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
  const nodes = editor.api.html.deserialize({ element }) as any[];

  // Extract comments
  const comments = extractComments(commentById, commentIds);

  // Pull section properties + chrome part text directly from the docx zip.
  // Mammoth ignores `w:sectPr` and never surfaces header / footer parts,
  // so we read them by reopening the zip in parallel. Failure here must
  // not break the body conversion — the surface is additive.
  const meta = await extractSectionMeta(arrayBuffer).catch(() => null);

  return {
    comments,
    footers: meta?.footers,
    headers: meta?.headers,
    nodes,
    section: meta?.section,
    warnings,
  };
}

type ExtractedMeta = {
  footers: DocxChromeBlock[];
  headers: DocxChromeBlock[];
  section?: DocxSectionMeta;
};

const SECT_PR_RE = /<w:sectPr[^>]*>([\S\s]*?)<\/w:sectPr>/;
const PG_SZ_RE = /<w:pgSz\b([^>/]*)\/?>/;
const PG_MAR_RE = /<w:pgMar\b([^>/]*)\/?>/;
const RELATIONSHIP_RE = /<Relationship\b([^/>]*)\/?>/g;
const W_T_RE = /<w:t\b[^>]*>([\S\s]*?)<\/w:t>/g;
const HEADER_REF_RE = /<w:headerReference\b([^/>]*)\/?>/g;
const FOOTER_REF_RE = /<w:footerReference\b([^/>]*)\/?>/g;
const REL_PATH_DOT_SLASH_RE = /^\.\//;

const extractSectionMeta = async (
  arrayBuffer: ArrayBuffer
): Promise<ExtractedMeta> => {
  const zip = await JSZip.loadAsync(arrayBuffer);

  const documentXml = await zip.file('word/document.xml')?.async('string');
  const relsXml = await zip
    .file('word/_rels/document.xml.rels')
    ?.async('string');

  if (!documentXml) return { footers: [], headers: [] };

  const section = parseSectionPr(documentXml);
  const rels = relsXml
    ? parseRelationships(relsXml)
    : new Map<string, string>();

  const headerRefs = parseHeaderFooterRefs(documentXml, 'headerReference');
  const footerRefs = parseHeaderFooterRefs(documentXml, 'footerReference');

  const headers = await Promise.all(
    headerRefs.map(async ({ rId, type }) => ({
      text: await readPartText(zip, rels.get(rId)),
      type,
    }))
  );
  const footers = await Promise.all(
    footerRefs.map(async ({ rId, type }) => ({
      text: await readPartText(zip, rels.get(rId)),
      type,
    }))
  );

  return { footers, headers, section };
};

const parseSectionPr = (xml: string): DocxSectionMeta | undefined => {
  const sectPrMatch = xml.match(SECT_PR_RE);
  if (!sectPrMatch) return;

  const block = sectPrMatch[1] ?? '';

  const pgSz = block.match(PG_SZ_RE);
  const pgMar = block.match(PG_MAR_RE);

  const pageSize: { height?: number; width?: number } = {};
  let orientation: 'landscape' | 'portrait' | undefined;

  if (pgSz) {
    const w = numAttr(pgSz[1] ?? '', 'w:w');
    const h = numAttr(pgSz[1] ?? '', 'w:h');
    const orient = strAttr(pgSz[1] ?? '', 'w:orient');

    if (w !== undefined) pageSize.width = w;
    if (h !== undefined) pageSize.height = h;
    if (orient === 'landscape' || orient === 'portrait') orientation = orient;
  }

  const margins: NonNullable<DocxSectionMeta['margins']> = {};
  if (pgMar) {
    for (const k of [
      'top',
      'right',
      'bottom',
      'left',
      'header',
      'footer',
      'gutter',
    ] as const) {
      const v = numAttr(pgMar[1] ?? '', `w:${k}`);

      if (v !== undefined) margins[k] = v;
    }
  }

  return {
    margins: Object.keys(margins).length > 0 ? margins : undefined,
    orientation,
    pageSize: Object.keys(pageSize).length > 0 ? pageSize : undefined,
  };
};

const parseRelationships = (xml: string): Map<string, string> => {
  const map = new Map<string, string>();
  RELATIONSHIP_RE.lastIndex = 0;

  for (
    let m = RELATIONSHIP_RE.exec(xml);
    m !== null;
    m = RELATIONSHIP_RE.exec(xml)
  ) {
    const id = strAttr(m[1] ?? '', 'Id');
    const target = strAttr(m[1] ?? '', 'Target');

    if (id && target) map.set(id, target);
  }

  return map;
};

const parseHeaderFooterRefs = (
  xml: string,
  tag: 'footerReference' | 'headerReference'
): { rId: string; type: string }[] => {
  const re = tag === 'headerReference' ? HEADER_REF_RE : FOOTER_REF_RE;
  re.lastIndex = 0;
  const out: { rId: string; type: string }[] = [];

  for (let m = re.exec(xml); m !== null; m = re.exec(xml)) {
    const rId = strAttr(m[1] ?? '', 'r:id');
    const type = strAttr(m[1] ?? '', 'w:type') ?? 'default';

    if (rId) out.push({ rId, type });
  }

  return out;
};

const readPartText = async (
  zip: JSZip,
  target: string | undefined
): Promise<string> => {
  if (!target) return '';

  // Targets are relative to `word/` (since the rels file is at
  // `word/_rels/document.xml.rels`). Strip a leading `/` if present.
  const path = target.startsWith('/')
    ? target.slice(1)
    : `word/${target.replace(REL_PATH_DOT_SLASH_RE, '')}`;
  const file = zip.file(path);
  if (!file) return '';

  const xml = await file.async('string');
  // Concatenate all `<w:t>...</w:t>` text — pretext-quality structure
  // recovery happens in the round-trip follow-up.
  let out = '';
  W_T_RE.lastIndex = 0;

  for (let m = W_T_RE.exec(xml); m !== null; m = W_T_RE.exec(xml)) {
    out += decodeXmlEntities(m[1] ?? '');
  }

  return out;
};

const numAttr = (s: string, name: string): number | undefined => {
  const v = strAttr(s, name);

  if (v === undefined) return;

  const n = Number.parseInt(v, 10);

  return Number.isFinite(n) ? n : undefined;
};

const strAttr = (s: string, name: string): string | undefined => {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const m = s.match(new RegExp(`\\b${escaped}="([^"]*)"`));

  return m ? m[1] : undefined;
};

const decodeXmlEntities = (s: string): string =>
  s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&');
