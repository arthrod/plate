/** Comment extracted from DOCX file */
export type DocxComment = {
  /** Comment ID from the DOCX file */
  id: string;
  /** Comment text content */
  text: string;
};

/** Result of importing a DOCX file */
export type ImportDocxResult = {
  /** Deserialized editor nodes */
  nodes: any[];
  /** Comments extracted from the DOCX file (not yet applied to editor) */
  comments: DocxComment[];
  /** Warnings from mammoth conversion */
  warnings: string[];
};

/** Options for importing a DOCX file */
export type ImportDocxOptions = {
  /** RTF data for image extraction (optional) */
  rtf?: string;
  /**
   * Enable the tracking import branch — extract `[[DOCX_(INS|DEL|CMT)_*]]`
   * tokens from the raw HTML before `cleanDocx` runs, then re-anchor them on
   * the deserialized tree (variant C — see #349).
   */
  tracking?: boolean;
};

/**
 * Result returned when `ImportDocxOptions.tracking` is enabled. Intersects
 * `ImportDocxResult` so any future field added to the base result type flows
 * through automatically.
 */
export type ImportDocxWithTrackingResult = ImportDocxResult & {
  /** Anchor-resolution and pairing failures, surfaced to the caller. */
  errors?: string[];
};
