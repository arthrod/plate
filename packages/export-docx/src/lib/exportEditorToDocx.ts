import type { SlateEditor } from 'platejs';

import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
  UnderlineType,
} from 'docx';

import type { DocxExportOptions, DocxExportResult } from './types';

/** Default page margins in twips (1 inch = 1440 twips) */
const DEFAULT_MARGINS = {
  bottom: 1440,
  left: 1440,
  right: 1440,
  top: 1440,
};

/** Default page size in twips (Letter: 8.5 x 11 inches) */
const DEFAULT_PAGE_SIZE = {
  height: 15_840,
  orientation: 'portrait' as const,
  width: 12_240,
};

/** Map HTML heading levels to docx HeadingLevel */
const HEADING_MAP: Record<
  string,
  (typeof HeadingLevel)[keyof typeof HeadingLevel]
> = {
  H1: HeadingLevel.HEADING_1,
  H2: HeadingLevel.HEADING_2,
  H3: HeadingLevel.HEADING_3,
  H4: HeadingLevel.HEADING_4,
  H5: HeadingLevel.HEADING_5,
  H6: HeadingLevel.HEADING_6,
};

/** Map CSS text-align to docx AlignmentType */
const ALIGNMENT_MAP: Record<
  string,
  (typeof AlignmentType)[keyof typeof AlignmentType]
> = {
  center: AlignmentType.CENTER,
  justify: AlignmentType.JUSTIFIED,
  left: AlignmentType.LEFT,
  right: AlignmentType.RIGHT,
};

/** Regex patterns for parsing CSS styles */
const FONT_SIZE_REGEX = /font-size:\s*(\d+)px/;
const COLOR_REGEX = /(?:^|;)\s*color:\s*([^;]+)/;
const RGB_REGEX = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/;
const BG_COLOR_REGEX = /background-color:\s*([^;]+)/;
const TEXT_ALIGN_REGEX = /text-align:\s*(\w+)/;
const MARGIN_LEFT_REGEX = /margin-left:\s*(\d+)px/;

type TextStyle = {
  bold?: boolean;
  color?: string;
  fontFamily?: string;
  fontSize?: number;
  highlight?: string;
  italics?: boolean;
  strike?: boolean;
  subscript?: boolean;
  superscript?: boolean;
  underline?: boolean;
};

type ParsedParagraph = {
  alignment?: (typeof AlignmentType)[keyof typeof AlignmentType];
  heading?: (typeof HeadingLevel)[keyof typeof HeadingLevel];
  indent?: number;
  runs: Array<{
    style: TextStyle;
    text: string;
  }>;
};

/**
 * Parse inline styles from an element
 */
function parseInlineStyles(element: Element): TextStyle {
  const style: TextStyle = {};
  const computedStyle = element.getAttribute('style') || '';

  // Check for bold
  if (
    element.tagName === 'STRONG' ||
    element.tagName === 'B' ||
    computedStyle.includes('font-weight: bold') ||
    computedStyle.includes('font-weight: 700')
  ) {
    style.bold = true;
  }

  // Check for italic
  if (
    element.tagName === 'EM' ||
    element.tagName === 'I' ||
    computedStyle.includes('font-style: italic')
  ) {
    style.italics = true;
  }

  // Check for underline
  if (
    element.tagName === 'U' ||
    computedStyle.includes('text-decoration: underline')
  ) {
    style.underline = true;
  }

  // Check for strikethrough
  if (
    element.tagName === 'S' ||
    element.tagName === 'DEL' ||
    element.tagName === 'STRIKE' ||
    computedStyle.includes('text-decoration: line-through')
  ) {
    style.strike = true;
  }

  // Check for subscript/superscript
  if (element.tagName === 'SUB') {
    style.subscript = true;
  }
  if (element.tagName === 'SUP') {
    style.superscript = true;
  }

  // Parse font-size
  const fontSizeMatch = computedStyle.match(FONT_SIZE_REGEX);
  if (fontSizeMatch) {
    // Convert px to half-points (1px ≈ 1.5 half-points)
    style.fontSize = Math.round(Number.parseInt(fontSizeMatch[1], 10) * 1.5);
  }

  // Parse color
  const colorMatch = computedStyle.match(COLOR_REGEX);
  if (colorMatch) {
    const color = colorMatch[1].trim();
    // Convert to hex if it's rgb
    if (color.startsWith('rgb')) {
      const rgbMatch = color.match(RGB_REGEX);
      if (rgbMatch) {
        const r = Number.parseInt(rgbMatch[1], 10)
          .toString(16)
          .padStart(2, '0');
        const g = Number.parseInt(rgbMatch[2], 10)
          .toString(16)
          .padStart(2, '0');
        const b = Number.parseInt(rgbMatch[3], 10)
          .toString(16)
          .padStart(2, '0');
        style.color = `${r}${g}${b}`;
      }
    } else if (color.startsWith('#')) {
      style.color = color.slice(1);
    }
  }

  // Parse background-color for highlight
  const bgMatch = computedStyle.match(BG_COLOR_REGEX);
  if (bgMatch) {
    const bg = bgMatch[1].trim();
    if (bg !== 'transparent' && bg !== 'inherit') {
      // docx uses named colors for highlighting
      style.highlight = 'yellow';
    }
  }

  return style;
}

/**
 * Recursively extract text runs from an element
 */
function extractTextRuns(
  node: Node,
  inheritedStyle: TextStyle = {}
): Array<{ style: TextStyle; text: string }> {
  const runs: Array<{ style: TextStyle; text: string }> = [];

  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent || '';
    if (text) {
      runs.push({ style: { ...inheritedStyle }, text });
    }
    return runs;
  }

  if (node.nodeType === Node.ELEMENT_NODE) {
    const element = node as Element;

    // Handle line breaks
    if (element.tagName === 'BR') {
      runs.push({ style: { ...inheritedStyle }, text: '\n' });
      return runs;
    }

    const elementStyle = parseInlineStyles(element);
    const combinedStyle = { ...inheritedStyle, ...elementStyle };

    for (const child of Array.from(node.childNodes)) {
      runs.push(...extractTextRuns(child, combinedStyle));
    }
  }

  return runs;
}

/**
 * Parse an HTML element into a paragraph structure
 */
function parseHtmlElement(
  element: Element,
  defaultFontSize?: number
): ParsedParagraph | null {
  const tagName = element.tagName.toUpperCase();

  // Skip non-block elements at root level
  if (
    ![
      'P',
      'H1',
      'H2',
      'H3',
      'H4',
      'H5',
      'H6',
      'DIV',
      'BLOCKQUOTE',
      'LI',
    ].includes(tagName)
  ) {
    return null;
  }

  const paragraph: ParsedParagraph = {
    runs: [],
  };

  // Check for heading
  if (HEADING_MAP[tagName]) {
    paragraph.heading = HEADING_MAP[tagName];
  }

  // Parse alignment from style
  const style = element.getAttribute('style') || '';
  const alignMatch = style.match(TEXT_ALIGN_REGEX);
  if (alignMatch && ALIGNMENT_MAP[alignMatch[1]]) {
    paragraph.alignment = ALIGNMENT_MAP[alignMatch[1]];
  }

  // Parse indent from style (margin-left)
  const marginMatch = style.match(MARGIN_LEFT_REGEX);
  if (marginMatch) {
    // Convert px to twips (1px ≈ 15 twips)
    paragraph.indent = Number.parseInt(marginMatch[1], 10) * 15;
  }

  // Extract text runs
  const defaultStyle: TextStyle = {};
  if (defaultFontSize) {
    defaultStyle.fontSize = defaultFontSize;
  }
  paragraph.runs = extractTextRuns(element, defaultStyle);

  return paragraph;
}

/**
 * Convert parsed paragraphs to docx Paragraph objects
 */
function createDocxParagraphs(
  parsedParagraphs: ParsedParagraph[]
): Paragraph[] {
  return parsedParagraphs.map((p) => {
    const children = p.runs.map(
      (run) =>
        new TextRun({
          bold: run.style.bold,
          color: run.style.color,
          font: run.style.fontFamily,
          highlight: run.style.highlight as
            | 'black'
            | 'blue'
            | 'cyan'
            | 'darkBlue'
            | 'darkCyan'
            | 'darkGray'
            | 'darkGreen'
            | 'darkMagenta'
            | 'darkRed'
            | 'darkYellow'
            | 'green'
            | 'lightGray'
            | 'magenta'
            | 'red'
            | 'white'
            | 'yellow'
            | undefined,
          italics: run.style.italics,
          size: run.style.fontSize,
          strike: run.style.strike,
          subScript: run.style.subscript,
          superScript: run.style.superscript,
          text: run.text,
          underline: run.style.underline
            ? { type: UnderlineType.SINGLE }
            : undefined,
        })
    );

    return new Paragraph({
      alignment: p.alignment,
      children,
      heading: p.heading,
      indent: p.indent ? { left: p.indent } : undefined,
    });
  });
}

/**
 * Parse HTML string into docx paragraphs
 */
function htmlToDocxParagraphs(
  html: string,
  defaultFontSize?: number
): Paragraph[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const body = doc.body;

  const parsedParagraphs: ParsedParagraph[] = [];

  // Process all child elements
  const processNode = (node: Node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;
      const parsed = parseHtmlElement(element, defaultFontSize);

      if (parsed) {
        parsedParagraphs.push(parsed);
      } else {
        // Process children for non-block elements
        for (const child of Array.from(node.childNodes)) {
          processNode(child);
        }
      }
    }
  };

  for (const child of Array.from(body.childNodes)) {
    processNode(child);
  }

  // If no paragraphs found, create one from the entire body
  if (parsedParagraphs.length === 0) {
    const runs = extractTextRuns(
      body,
      defaultFontSize ? { fontSize: defaultFontSize } : {}
    );
    if (runs.length > 0) {
      parsedParagraphs.push({ runs });
    }
  }

  return createDocxParagraphs(parsedParagraphs);
}

/**
 * Export editor content to DOCX format.
 *
 * @param editor - The Plate editor instance
 * @param options - Export options
 * @returns Promise resolving to a Blob containing the DOCX file
 *
 * @example
 * ```ts
 * const blob = await exportEditorToDocx(editor, {
 *   properties: { title: 'My Document' },
 *   fontFamily: 'Arial',
 *   fontSize: 24, // 12pt
 * });
 *
 * // Download the file
 * const url = URL.createObjectURL(blob);
 * const link = document.createElement('a');
 * link.href = url;
 * link.download = 'document.docx';
 * link.click();
 * URL.revokeObjectURL(url);
 * ```
 */
export const exportEditorToDocx = async (
  editor: SlateEditor,
  options: DocxExportOptions = {}
): Promise<DocxExportResult> => {
  const {
    createHtmlDocument = ({ editorHtml }) =>
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
      ].join('\n'),
    fontFamily = 'Arial',
    fontSize = 24, // 12pt in half-points
    footerHtml: _footerHtml,
    headerHtml: _headerHtml,
    margins = DEFAULT_MARGINS,
    pageSize = DEFAULT_PAGE_SIZE,
    properties = {},
    sectionOptions = {},
  } = options;

  // Get HTML from editor or use provided HTML
  let editorHtml: string = options.html ?? '';

  if (!editorHtml) {
    // Dynamic import to avoid bundling static renderer if not needed
    const { serializeHtml } = await import('platejs/static');
    editorHtml = (await serializeHtml(editor)) ?? '';
  }

  // Wrap in full HTML document
  const fullHtml = createHtmlDocument({ editorHtml });

  // Parse HTML to docx paragraphs
  const paragraphs = htmlToDocxParagraphs(fullHtml, fontSize);

  // Create the document
  const doc = new Document({
    creator: properties.creator,
    description: properties.description,
    keywords: properties.keywords,
    sections: [
      {
        children: paragraphs,
        properties: {
          page: {
            margin: margins,
            size: {
              height: pageSize.height ?? DEFAULT_PAGE_SIZE.height,
              orientation:
                pageSize.orientation === 'landscape' ? 'landscape' : 'portrait',
              width: pageSize.width ?? DEFAULT_PAGE_SIZE.width,
            },
          },
        },
        ...sectionOptions,
      },
    ],
    styles: {
      default: {
        document: {
          run: {
            font: fontFamily,
            size: fontSize,
          },
        },
      },
    },
    subject: properties.subject,
    title: properties.title,
  });

  // Export to Blob for browser
  return Packer.toBlob(doc);
};

/**
 * Trigger a download of the DOCX blob in the browser
 */
export const downloadDocx = (blob: Blob, filename = 'document.docx'): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
