import type { Document, IPropertiesOptions, ISectionOptions } from 'docx';

/** Font family options for DOCX export */
export type DocxFontFamily = 'Arial' | 'Calibri' | 'Times New Roman' | string;

/** Font size in half-points (e.g., 24 = 12pt) */
export type DocxFontSize = number;

/** Document properties for DOCX export */
export type DocxDocumentProperties = {
  /** Document author */
  creator?: string;
  /** Document description */
  description?: string;
  /** Document keywords */
  keywords?: string;
  /** Document subject */
  subject?: string;
  /** Document title */
  title?: string;
};

/** Page margin settings in twips (1 inch = 1440 twips) */
export type DocxPageMargins = {
  bottom?: number;
  left?: number;
  right?: number;
  top?: number;
};

/** Page size settings in twips */
export type DocxPageSize = {
  height?: number;
  orientation?: 'landscape' | 'portrait';
  width?: number;
};

/** Options for the DOCX export function */
export type DocxExportOptions = {
  /**
   * Function that wraps the editor HTML into a full HTML document string.
   * Default creates a minimal HTML shell.
   */
  createHtmlDocument?: (params: { editorHtml: string }) => string;

  /** Default font family for the document */
  fontFamily?: DocxFontFamily;

  /** Default font size in half-points (e.g., 24 = 12pt) */
  fontSize?: DocxFontSize;

  /** Footer HTML content */
  footerHtml?: string;

  /** Header HTML content */
  headerHtml?: string;

  /**
   * Pre-generated HTML string to use instead of calling serializeHtml.
   * Useful if you already have the HTML from elsewhere.
   */
  html?: string;

  /** Page margin settings */
  margins?: DocxPageMargins;

  /** Page size and orientation */
  pageSize?: DocxPageSize;

  /** Document properties (title, author, etc.) */
  properties?: DocxDocumentProperties;

  /** Additional section options passed to docx */
  sectionOptions?: Partial<ISectionOptions>;
};

/** Result type for DOCX export - Blob in browser */
export type DocxExportResult = Blob;

/** Configuration options for the ExportDocxPlugin */
export type ExportDocxPluginOptions = {
  /** Default export options */
  defaultOptions?: DocxExportOptions;
};

/** Type for the Document class from docx package */
export type DocxDocument = Document;

/** Type for document options from docx package */
export type DocxDocumentOptions = IPropertiesOptions;
