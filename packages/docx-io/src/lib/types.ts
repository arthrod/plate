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

/**
 * Payload encoded inside a tracked-change START token (`[[DOCX_INS_START:…]]`
 * or `[[DOCX_DEL_START:…]]`).
 */
export type DocxTrackedChangeStartPayload = {
  /** Stable id pairing the START with its END. */
  id: string;
  /** Display name from `<w:author>`. */
  author: string;
  /** Author initials from `<w:initials>`. */
  authorInitials?: string;
  /** ISO-8601 date from `<w:date>`. */
  date: string;
};

/** Parsed tracked change extracted from token-bearing HTML / Slate value. */
export type DocxTrackedChange = DocxTrackedChangeStartPayload & {
  kind: 'insertion' | 'deletion';
};

/**
 * Result of importing a DOCX file with the tracking branch enabled.
 * Returned when `ImportDocxOptions.tracking` is set. See #342 / #343.
 */
export type ImportDocxWithTrackingResult = ImportDocxResult & {
  /** Tracked changes recovered from `[[DOCX_INS_*]]` / `[[DOCX_DEL_*]]`. */
  trackedChanges?: DocxTrackedChange[];
  /** Threaded discussion data recovered from `[[DOCX_CMT_*]]`. */
  discussions?: unknown[];
  /** Anchor-resolution and pairing failures, surfaced for the caller. */
  errors?: string[];
};

/** Options for importing a DOCX file */
export type ImportDocxOptions = {
  /** RTF data for image extraction (optional) */
  rtf?: string;
  /**
   * Enable the tracking import branch (forked Mammoth + token resolver).
   * Off by default so the standard happy-path stays unchanged. See #342.
   */
  tracking?: boolean;
};
