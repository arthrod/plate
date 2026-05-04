/**
 * Comment extracted from DOCX file. The simple `{ id, text }` shape is the
 * default surface; richer threading metadata (paraId / parentParaId, author,
 * date, replies, body) is optional and only populated by the tracking import
 * branch. See {@link DocxImportDiscussion}.
 */
export type DocxComment = {
  /** Comment ID from the DOCX file */
  id: string;
  /** Comment text content */
  text: string;
  /** Display name of the comment author (`<w:author>`). */
  authorName?: string;
  /** Author initials (`<w:initials>`). */
  authorInitials?: string;
  /** ISO-8601 date string from `<w:date>`. */
  date?: string;
  /** Per-paragraph DOCX `paraId` of the root comment paragraph. */
  paraId?: string;
  /** `parentParaId` for replies (points to the root comment's `paraId`). */
  parentParaId?: string;
  /** Whether this is a point comment (single insertion-point) vs. a range. */
  isPoint?: boolean;
  /**
   * Raw HTML body of the comment text (preserved for downstream lazy
   * deserialization to Plate nodes).
   */
  body?: string;
};

/**
 * A root comment plus its threaded replies, ready to pass to the discussion
 * plugin. Returned by the tracking import branch (see #343).
 */
export type DocxImportDiscussion = {
  /** Root comment carrying `paraId`. */
  root: DocxComment;
  /** Reply comments carrying `parentParaId === root.paraId`. */
  replies: DocxComment[];
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
};
