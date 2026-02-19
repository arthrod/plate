/**
 * schema.ts — Mammoth.js Document Model Types
 *
 * Extracted from documents.js, results.js, and index.d.ts.
 * This file defines all document model types as a discriminated union,
 * the Result monad, and all public API types.
 *
 * Copyright (c) 2013, Michael Williamson
 * BSD-2-Clause License
 */

// ---------------------------------------------------------------------------
// Vertical Alignment
// ---------------------------------------------------------------------------

export type VerticalAlignment = 'baseline' | 'superscript' | 'subscript';

export const verticalAlignment = {
  baseline: 'baseline' as const,
  superscript: 'superscript' as const,
  subscript: 'subscript' as const,
};

// ---------------------------------------------------------------------------
// Break Types
// ---------------------------------------------------------------------------

export type BreakType = 'line' | 'page' | 'column';

// ---------------------------------------------------------------------------
// Note Types
// ---------------------------------------------------------------------------

export type NoteType = 'footnote' | 'endnote';

// ---------------------------------------------------------------------------
// Document Element Type Discriminants
// ---------------------------------------------------------------------------

export const types = {
  document: 'document',
  paragraph: 'paragraph',
  run: 'run',
  text: 'text',
  tab: 'tab',
  checkbox: 'checkbox',
  hyperlink: 'hyperlink',
  noteReference: 'noteReference',
  image: 'image',
  note: 'note',
  commentReference: 'commentReference',
  comment: 'comment',
  commentRangeStart: 'commentRangeStart',
  commentRangeEnd: 'commentRangeEnd',
  inserted: 'inserted',
  deleted: 'deleted',
  table: 'table',
  tableRow: 'tableRow',
  tableCell: 'tableCell',
  break: 'break',
  bookmarkStart: 'bookmarkStart',
} as const;

export type DocumentElementType = (typeof types)[keyof typeof types];

// ---------------------------------------------------------------------------
// Numbering
// ---------------------------------------------------------------------------

export interface Numbering {
  level: number;
  isOrdered: boolean;
}

// ---------------------------------------------------------------------------
// Indent
// ---------------------------------------------------------------------------

export interface Indent {
  start: string | null;
  end: string | null;
  firstLine: string | null;
  hanging: string | null;
}

// ---------------------------------------------------------------------------
// Document Element Interfaces (Discriminated Union Members)
// ---------------------------------------------------------------------------

export interface DocumentNode {
  type: 'document';
  children: DocumentElement[];
  notes: Notes;
  comments: Comment[];
}

export interface Paragraph {
  type: 'paragraph';
  children: DocumentElement[];
  styleId: string | null;
  styleName: string | null;
  numbering: Numbering | null;
  alignment: string | null;
  indent: Indent;
  paraId: string | null;
}

export interface Run {
  type: 'run';
  children: DocumentElement[];
  styleId: string | null;
  styleName: string | null;
  isBold: boolean;
  isUnderline: boolean;
  isItalic: boolean;
  isStrikethrough: boolean;
  isAllCaps: boolean;
  isSmallCaps: boolean;
  verticalAlignment: VerticalAlignment;
  font: string | null;
  fontSize: string | null;
  highlight: string | null;
}

export interface Text {
  type: 'text';
  value: string;
}

export interface Tab {
  type: 'tab';
}

export interface Checkbox {
  type: 'checkbox';
  checked: boolean;
}

export interface Hyperlink {
  type: 'hyperlink';
  children: DocumentElement[];
  href: string | undefined;
  anchor: string | undefined;
  targetFrame: string | undefined;
}

export interface NoteReference {
  type: 'noteReference';
  noteType: NoteType;
  noteId: string;
}

export interface ImageElement {
  type: 'image';
  read: ImageRead;
  readAsArrayBuffer: () => Promise<ArrayBuffer>;
  readAsBase64String: () => Promise<string>;
  readAsBuffer: () => Promise<Buffer>;
  altText: string | undefined;
  contentType: string | undefined;
}

export interface ImageRead {
  (): Promise<Buffer>;
  (encoding: string): Promise<string>;
}

export interface NoteNode {
  type: 'note';
  noteType: NoteType;
  noteId: string;
  body: DocumentElement[];
}

export interface CommentReference {
  type: 'commentReference';
  commentId: string;
}

export interface Comment {
  type: 'comment';
  commentId: string;
  body: DocumentElement[];
  authorName: string | null;
  authorInitials: string | null;
  date: string | null;
  paraId: string | null;
  parentParaId: string | null;
}

export interface CommentRangeStart {
  type: 'commentRangeStart';
  commentId: string;
}

export interface CommentRangeEnd {
  type: 'commentRangeEnd';
  commentId: string;
}

export interface Inserted {
  type: 'inserted';
  children: DocumentElement[];
  author: string | null;
  date: string | null;
  changeId: string | null;
}

export interface Deleted {
  type: 'deleted';
  children: DocumentElement[];
  author: string | null;
  date: string | null;
  changeId: string | null;
}

export interface Table {
  type: 'table';
  children: DocumentElement[];
  styleId: string | null;
  styleName: string | null;
}

export interface TableRow {
  type: 'tableRow';
  children: DocumentElement[];
  isHeader: boolean;
}

export interface TableCell {
  type: 'tableCell';
  children: DocumentElement[];
  colSpan: number;
  rowSpan: number;
}

export interface Break {
  type: 'break';
  breakType: BreakType;
}

export interface BookmarkStart {
  type: 'bookmarkStart';
  name: string;
}

// ---------------------------------------------------------------------------
// Discriminated Union
// ---------------------------------------------------------------------------

export type DocumentElement =
  | DocumentNode
  | Paragraph
  | Run
  | Text
  | Tab
  | Checkbox
  | Hyperlink
  | NoteReference
  | ImageElement
  | NoteNode
  | CommentReference
  | Comment
  | CommentRangeStart
  | CommentRangeEnd
  | Inserted
  | Deleted
  | Table
  | TableRow
  | TableCell
  | Break
  | BookmarkStart;

// ---------------------------------------------------------------------------
// Notes Collection
// ---------------------------------------------------------------------------

export interface NotesMap {
  [key: string]: NoteNode;
}

/**
 * Notes is a keyed collection of notes, indexed by `noteType-noteId`.
 * This is a class (not a plain interface) because it has methods.
 */
export class Notes {
  _notes: NotesMap;

  constructor(notes: NoteNode[] | Record<string, NoteNode>) {
    if (Array.isArray(notes)) {
      this._notes = {};
      for (const note of notes) {
        this._notes[noteKey(note.noteType, note.noteId)] = note;
      }
    } else {
      this._notes = notes;
    }
  }

  resolve(reference: NoteReference): NoteNode | null {
    return this.findNoteByKey(noteKey(reference.noteType, reference.noteId));
  }

  findNoteByKey(key: string): NoteNode | null {
    return this._notes[key] || null;
  }
}

function noteKey(noteType: string, id: string): string {
  return noteType + '-' + id;
}

// ---------------------------------------------------------------------------
// Result Monad
// ---------------------------------------------------------------------------

export type MessageType = 'warning' | 'error';

export interface WarningMessage {
  type: 'warning';
  message: string;
}

export interface ErrorMessage {
  type: 'error';
  message: string;
  error: unknown;
}

export type Message = WarningMessage | ErrorMessage;

export class Result<T> {
  value: T;
  messages: Message[];

  constructor(value: T, messages?: Message[]) {
    this.value = value;
    this.messages = messages || [];
  }

  map<U>(func: (value: T) => U): Result<U> {
    return new Result(func(this.value), this.messages);
  }

  flatMap<U>(func: (value: T) => Result<U>): Result<U> {
    const funcResult = func(this.value);
    return new Result(funcResult.value, combineMessages([this, funcResult]));
  }

  flatMapThen<U>(func: (value: T) => Promise<Result<U>>): Promise<Result<U>> {
    return func(this.value).then(
      (otherResult) =>
        new Result(otherResult.value, combineMessages([this, otherResult]))
    );
  }

  static combine(results: Result<unknown[]>[]): Result<unknown[]> {
    const values = results.flatMap((r) => r.value);
    const messages = combineMessages(results);
    return new Result(values, messages);
  }
}

export function success<T>(value: T): Result<T> {
  return new Result(value, []);
}

export function warning(message: string): WarningMessage {
  return {
    type: 'warning',
    message,
  };
}

export function error(exception: { message: string }): ErrorMessage {
  return {
    type: 'error',
    message: exception.message,
    error: exception,
  };
}

function combineMessages(results: { messages: Message[] }[]): Message[] {
  const messages: Message[] = [];
  for (const result of results) {
    for (const message of result.messages) {
      if (!containsMessage(messages, message)) {
        messages.push(message);
      }
    }
  }
  return messages;
}

function containsMessage(messages: Message[], message: Message): boolean {
  return messages.some(
    (existing) =>
      existing.type === message.type && existing.message === message.message
  );
}

// ---------------------------------------------------------------------------
// Constructor Functions (matching documents.js exports)
// ---------------------------------------------------------------------------

export interface DocumentOptions {
  notes?: Notes;
  comments?: Comment[];
}

export function Document(
  children: DocumentElement[],
  options?: DocumentOptions
): DocumentNode {
  const opts = options || {};
  return {
    type: 'document',
    children,
    notes: opts.notes || new Notes([]),
    comments: opts.comments || [],
  };
}

export interface ParagraphProperties {
  styleId?: string | null;
  styleName?: string | null;
  numbering?: Numbering | null;
  alignment?: string | null;
  indent?: Partial<Indent>;
  paraId?: string | null;
}

export function createParagraph(
  children: DocumentElement[],
  properties?: ParagraphProperties
): Paragraph {
  const props = properties || {};
  const indent = props.indent || {};
  return {
    type: 'paragraph',
    children,
    styleId: props.styleId || null,
    styleName: props.styleName || null,
    numbering: props.numbering || null,
    alignment: props.alignment || null,
    indent: {
      start: indent.start || null,
      end: indent.end || null,
      firstLine: indent.firstLine || null,
      hanging: indent.hanging || null,
    },
    paraId: props.paraId || null,
  };
}

export interface RunProperties {
  styleId?: string | null;
  styleName?: string | null;
  isBold?: boolean;
  isUnderline?: boolean;
  isItalic?: boolean;
  isStrikethrough?: boolean;
  isAllCaps?: boolean;
  isSmallCaps?: boolean;
  verticalAlignment?: VerticalAlignment;
  font?: string | null;
  fontSize?: string | null;
  highlight?: string | null;
}

export function createRun(
  children: DocumentElement[],
  properties?: RunProperties
): Run {
  const props = properties || {};
  return {
    type: 'run',
    children,
    styleId: props.styleId || null,
    styleName: props.styleName || null,
    isBold: !!props.isBold,
    isUnderline: !!props.isUnderline,
    isItalic: !!props.isItalic,
    isStrikethrough: !!props.isStrikethrough,
    isAllCaps: !!props.isAllCaps,
    isSmallCaps: !!props.isSmallCaps,
    verticalAlignment: props.verticalAlignment || verticalAlignment.baseline,
    font: props.font || null,
    fontSize: props.fontSize || null,
    highlight: props.highlight || null,
  };
}

export function createText(value: string): Text {
  return { type: 'text', value };
}

export function createTab(): Tab {
  return { type: 'tab' };
}

export function createCheckbox(options: { checked: boolean }): Checkbox {
  return { type: 'checkbox', checked: options.checked };
}

export interface HyperlinkOptions {
  href?: string;
  anchor?: string;
  targetFrame?: string;
}

export function createHyperlink(
  children: DocumentElement[],
  options: HyperlinkOptions
): Hyperlink {
  return {
    type: 'hyperlink',
    children,
    href: options.href,
    anchor: options.anchor,
    targetFrame: options.targetFrame,
  };
}

export interface NoteReferenceOptions {
  noteType: NoteType;
  noteId: string;
}

export function createNoteReference(
  options: NoteReferenceOptions
): NoteReference {
  return {
    type: 'noteReference',
    noteType: options.noteType,
    noteId: options.noteId,
  };
}

export interface NoteOptions {
  noteType: NoteType;
  noteId: string;
  body: DocumentElement[];
}

export function createNote(options: NoteOptions): NoteNode {
  return {
    type: 'note',
    noteType: options.noteType,
    noteId: options.noteId,
    body: options.body,
  };
}

export interface CommentOptions {
  commentId: string;
  body: DocumentElement[];
  authorName?: string | null;
  authorInitials?: string | null;
  date?: string | null;
  paraId?: string | null;
  parentParaId?: string | null;
}

export function createComment(options: CommentOptions): Comment {
  return {
    type: 'comment',
    commentId: options.commentId,
    body: options.body,
    authorName: options.authorName || null,
    authorInitials: options.authorInitials || null,
    date: options.date || null,
    paraId: options.paraId || null,
    parentParaId: options.parentParaId || null,
  };
}

export function createCommentReference(options: {
  commentId: string;
}): CommentReference {
  return { type: 'commentReference', commentId: options.commentId };
}

export function createCommentRangeStart(options: {
  commentId: string;
}): CommentRangeStart {
  return { type: 'commentRangeStart', commentId: options.commentId };
}

export function createCommentRangeEnd(options: {
  commentId: string;
}): CommentRangeEnd {
  return { type: 'commentRangeEnd', commentId: options.commentId };
}

export interface TrackChangeOptions {
  author?: string | null;
  date?: string | null;
  changeId?: string | null;
}

export function createInserted(
  children: DocumentElement[],
  options?: TrackChangeOptions
): Inserted {
  const opts = options || {};
  return {
    type: 'inserted',
    children,
    author: opts.author || null,
    date: opts.date || null,
    changeId: opts.changeId || null,
  };
}

export function createDeleted(
  children: DocumentElement[],
  options?: TrackChangeOptions
): Deleted {
  const opts = options || {};
  return {
    type: 'deleted',
    children,
    author: opts.author || null,
    date: opts.date || null,
    changeId: opts.changeId || null,
  };
}

export interface ImageOptions {
  readImage: {
    (): Promise<ArrayBuffer>;
    (encoding: string): Promise<string>;
  };
  altText?: string;
  contentType?: string;
}

export function createImage(options: ImageOptions): ImageElement {
  return {
    type: 'image',
    read(encoding?: string) {
      if (encoding) {
        return options.readImage(encoding);
      }
      return options
        .readImage()
        .then((arrayBuffer: ArrayBuffer) => Buffer.from(arrayBuffer));
    },
    readAsArrayBuffer() {
      return options.readImage();
    },
    readAsBase64String() {
      return options.readImage('base64');
    },
    readAsBuffer() {
      return options
        .readImage()
        .then((arrayBuffer: ArrayBuffer) => Buffer.from(arrayBuffer));
    },
    altText: options.altText,
    contentType: options.contentType,
  } as ImageElement;
}

export interface TableProperties {
  styleId?: string | null;
  styleName?: string | null;
}

export function createTable(
  children: DocumentElement[],
  properties?: TableProperties
): Table {
  const props = properties || {};
  return {
    type: 'table',
    children,
    styleId: props.styleId || null,
    styleName: props.styleName || null,
  };
}

export interface TableRowOptions {
  isHeader?: boolean;
}

export function createTableRow(
  children: DocumentElement[],
  options?: TableRowOptions
): TableRow {
  const opts = options || {};
  return {
    type: 'tableRow',
    children,
    isHeader: opts.isHeader || false,
  };
}

export interface TableCellOptions {
  colSpan?: number;
  rowSpan?: number;
}

export function createTableCell(
  children: DocumentElement[],
  options?: TableCellOptions
): TableCell {
  const opts = options || {};
  return {
    type: 'tableCell',
    children,
    colSpan: opts.colSpan == null ? 1 : opts.colSpan,
    rowSpan: opts.rowSpan == null ? 1 : opts.rowSpan,
  };
}

export function createBreak(breakType: BreakType): Break {
  return { type: 'break', breakType };
}

export const lineBreak: Break = createBreak('line');
export const pageBreak: Break = createBreak('page');
export const columnBreak: Break = createBreak('column');

export interface BookmarkStartOptions {
  name: string;
}

export function createBookmarkStart(options: BookmarkStartOptions): BookmarkStart {
  return { type: 'bookmarkStart', name: options.name };
}

// ---------------------------------------------------------------------------
// Public API Types (from index.d.ts)
// ---------------------------------------------------------------------------

export type Input = NodeJsInput | BrowserInput;
export type NodeJsInput = PathInput | BufferInput;
export type BrowserInput = ArrayBufferInput;

export interface PathInput {
  path: string;
}

export interface BufferInput {
  buffer: Buffer;
}

export interface ArrayBufferInput {
  arrayBuffer: ArrayBuffer;
}

export interface ConvertOptions {
  styleMap?: string | string[];
  includeEmbeddedStyleMap?: boolean;
  includeDefaultStyleMap?: boolean;
  convertImage?: ImageConverter;
  ignoreEmptyParagraphs?: boolean;
  idPrefix?: string;
  externalFileAccess?: boolean;
  transformDocument?: (element: DocumentElement) => DocumentElement;
  outputFormat?: string;
}

/** Opaque branded type for image converters */
export interface ImageConverter {
  __mammothBrand: 'ImageConverter';
}

export interface ImageAttributes {
  src: string;
  [key: string]: string;
}

export interface ConvertResult {
  value: string;
  messages: Message[];
}

export interface EmbedResult {
  toArrayBuffer: () => ArrayBuffer;
  toBuffer: () => Buffer;
}

// ---------------------------------------------------------------------------
// Style Mapping Types
// ---------------------------------------------------------------------------

export interface StyleNameMatcher {
  operator: (first: string, second: string) => boolean;
  operand: string;
}

export interface MatcherOptions {
  styleId?: string;
  styleName?: StyleNameMatcher;
  list?: {
    levelIndex: number;
    isOrdered: boolean;
  };
}

export interface HighlightMatcherOptions {
  color?: string;
}

// ---------------------------------------------------------------------------
// Internal Options (after readOptions processing)
// ---------------------------------------------------------------------------

export interface InternalOptions extends ConvertOptions {
  customStyleMap: string[];
  embeddedStyleMap?: string;
  readStyleMap: () => string[];
}
