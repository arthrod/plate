/** Comment extracted from DOCX file */
export type DocxComment = {
  /** Comment ID from the DOCX file */
  id: string;
  /** Comment text content */
  text: string;
};

/**
 * Section properties extracted from `<w:sectPr>` of the imported document.
 * Values are in TWIPs (1/1440 inch) — matching DOCX native units. Callers
 * (e.g. `@platejs/pagination`) convert to CSS pixels at 96 DPI as needed.
 */
export type DocxSectionMeta = {
  /** Page margin box. */
  margins?: {
    bottom?: number;
    footer?: number;
    gutter?: number;
    header?: number;
    left?: number;
    right?: number;
    top?: number;
  };
  /** Orientation; missing means portrait. */
  orientation?: 'landscape' | 'portrait';
  /** Page size in TWIPs. Both dimensions present when `<w:pgSz>` is set. */
  pageSize?: { height?: number; width?: number };
};

/**
 * Header / footer payload extracted from referenced `word/headerN.xml` /
 * `word/footerN.xml` parts. v1 returns raw plain text — full structured
 * round-trip lives behind a follow-up that runs each part through mammoth
 * with the parent docx as context.
 */
export type DocxChromeBlock = {
  /** Plain text content of the part. */
  text: string;
  /** Section type (`default` / `first` / `even`). */
  type: string;
};

/** Result of importing a DOCX file */
export type ImportDocxResult = {
  /** Deserialized editor nodes */
  nodes: any[];
  /** Comments extracted from the DOCX file (not yet applied to editor) */
  comments: DocxComment[];
  /** Footer parts referenced from `w:sectPr` (default first). */
  footers?: DocxChromeBlock[];
  /** Header parts referenced from `w:sectPr` (default first). */
  headers?: DocxChromeBlock[];
  /** Page geometry from `<w:sectPr>`. */
  section?: DocxSectionMeta;
  /** Warnings from mammoth conversion */
  warnings: string[];
};

/** Options for importing a DOCX file */
export type ImportDocxOptions = {
  /** RTF data for image extraction (optional) */
  rtf?: string;
};
