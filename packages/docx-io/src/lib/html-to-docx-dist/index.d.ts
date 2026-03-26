
import JSZip from "jszip";
import { XMLBuilder } from "xmlbuilder2/lib/interfaces";

//#region src/html-to-docx.d.ts
export type HtmlToDocxResult = Blob | ArrayBuffer | Buffer | Uint8Array;
declare function generateContainer(htmlString: string, headerHTMLString?: string | null, documentOptions?: DocumentOptions, footerHTMLString?: string | null): Promise<HtmlToDocxResult>;
//#endregion
//#region src/schemas/document.template.d.ts
type DocumentMargins = {
  bottom: number;
  footer: number;
  gutter: number;
  header: number;
  left: number;
  right: number;
  top: number;
};
//#endregion
//#region src/constants.d.ts
type Orientation = 'landscape' | 'portrait';
type Direction = 'ltr' | 'rtl';
type HeaderFooterType = 'default' | 'even' | 'first';
type LineNumberRestart = 'continuous' | 'newPage' | 'newSection';
type ListStyleType = 'decimal' | 'disc' | 'lower-alpha' | 'lower-roman' | 'upper-alpha' | 'upper-roman';
type VerticalAlign = 'bottom' | 'middle' | 'top';
type Margins$2 = {
  bottom: number;
  footer: number;
  gutter: number;
  header: number;
  left: number;
  right: number;
  top: number;
};
type PageSize$2 = {
  height: number;
  width: number;
};
type HeadingSpacing$1 = {
  after: number;
  before: number;
};
type HeadingStyleOptions$1 = {
  bold: boolean;
  font: string;
  fontSize: number;
  keepLines: boolean;
  keepNext: boolean;
  outlineLevel: number;
  spacing: HeadingSpacing$1;
};
type HeadingOptions$1 = {
  heading1: HeadingStyleOptions$1;
  heading2: HeadingStyleOptions$1;
  heading3: HeadingStyleOptions$1;
  heading4: HeadingStyleOptions$1;
  heading5: HeadingStyleOptions$1;
  heading6: HeadingStyleOptions$1;
};
type TableRowOptions = {
  cantSplit: boolean;
};
type TableBorderOptions$1 = {
  color: string;
  size: number;
  stroke: string;
};
type TableBorderAttributeOptions = {
  size: number;
  stroke: string;
};
type TableOptions$2 = {
  addSpacingAfter: boolean;
  borderOptions: TableBorderOptions$1;
  row: TableRowOptions;
};
type LineNumberOptions$2 = {
  countBy: number;
  restart: LineNumberRestart;
  start: number;
};
type NumberingOptions$1 = {
  defaultOrderedListStyleType: ListStyleType;
};
type ImageProcessingOptions = {
  downloadTimeout: number;
  maxCacheEntries: number;
  maxCacheSize: number;
  maxImageSize: number;
  maxRetries: number;
  maxTimeout: number;
  minImageSize: number;
  minTimeout: number;
  retryDelayBase: number;
  suppressSharpWarning: boolean;
  svgHandling: 'convert' | 'native';
  svgSanitization: boolean;
  verboseLogging: boolean;
};
type BorderSide = {
  color: string;
  size: number;
  spacing: number;
};
type ParagraphBorders = {
  bottom: BorderSide;
  left: BorderSide;
  right: BorderSide;
  top: BorderSide;
};
type DocumentOptions$1 = {
  complexScriptFontSize: number;
  createdAt: Date;
  creator: string;
  decodeUnicode: boolean;
  defaultLang: string;
  description: string;
  direction: Direction;
  font: string;
  fontSize: number;
  footer: boolean;
  footerType: HeaderFooterType;
  header: boolean;
  headerType: HeaderFooterType;
  heading: HeadingOptions$1;
  imageProcessing: ImageProcessingOptions;
  keywords: string[];
  lastModifiedBy: string;
  lineNumber: boolean;
  lineNumberOptions: LineNumberOptions$2;
  margins: Margins$2;
  modifiedAt: Date;
  numbering: NumberingOptions$1;
  orientation: Orientation;
  pageNumber: boolean;
  pageSize: PageSize$2;
  revision: number;
  skipFirstHeaderFooter: boolean;
  subject: string;
  table: TableOptions$2;
  title: string;
};
declare const applicationName = "html-to-docx";
declare const defaultOrientation: Orientation;
declare const landscapeWidth = 15840;
declare const landscapeHeight = 12240;
declare const landscapeMargins: Margins$2;
declare const portraitMargins: Margins$2;
declare const defaultFont = "Times New Roman";
declare const defaultFontSize = 22;
declare const defaultLang = "en-US";
declare const defaultDirection: Direction;
declare const defaultTableBorderOptions: TableBorderOptions$1;
declare const defaultTableBorderAttributeOptions: TableBorderAttributeOptions;
declare const SVG_UNIT_TO_PIXEL_CONVERSIONS: Record<string, number>;
declare const defaultHeadingOptions: HeadingOptions$1;
declare const defaultDocumentOptions: DocumentOptions$1;
declare const defaultHTMLString = "<p></p>";
declare const relsFolderName = "_rels";
declare const headerFileName = "header1";
declare const footerFileName = "footer1";
declare const themeFileName = "theme1";
declare const documentFileName = "document";
declare const headerType = "header";
declare const footerType = "footer";
declare const themeType = "theme";
declare const commentsType = "comments";
declare const commentsExtendedType = "commentsExtended";
declare const commentsIdsType = "commentsIds";
declare const commentsExtensibleType = "commentsExtensible";
declare const peopleType = "people";
declare const commentsExtendedContentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.commentsExtended+xml";
declare const commentsIdsContentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.commentsIds+xml";
declare const commentsExtensibleContentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.commentsExtensible+xml";
declare const peopleContentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.people+xml";
declare const commentsExtendedRelationshipType = "http://schemas.microsoft.com/office/2011/relationships/commentsExtended";
declare const commentsIdsRelationshipType = "http://schemas.microsoft.com/office/2016/09/relationships/commentsIds";
declare const commentsExtensibleRelationshipType = "http://schemas.microsoft.com/office/2018/08/relationships/commentsExtensible";
declare const peopleRelationshipType = "http://schemas.microsoft.com/office/2011/relationships/people";
declare const hyperlinkType = "hyperlink";
declare const imageType = "image";
declare const internalRelationship = "Internal";
declare const wordFolder = "word";
declare const themeFolder = "theme";
declare const paragraphBordersObject: ParagraphBorders;
declare const colorlessColors: string[];
declare const verticalAlignValues: VerticalAlign[];
//#endregion
//#region src/tracking.d.ts
/** Payload for insertion/deletion tokens */
interface SuggestionPayload {
  id: string;
  author?: string;
  date?: string;
}
/** Payload for a single comment reply */
interface CommentReply {
  id: string;
  authorName?: string;
  authorInitials?: string;
  date?: string;
  /** OOXML paraId for round-trip threading fidelity */
  paraId?: string;
  text?: string;
}
/** Payload for comment tokens */
interface CommentPayload {
  id: string;
  authorName?: string;
  authorInitials?: string;
  date?: string;
  /** OOXML paraId for round-trip threading fidelity */
  paraId?: string;
  /** OOXML parentParaId for round-trip threading fidelity */
  parentParaId?: string;
  text?: string;
  replies?: CommentReply[];
}
/** Parsed token from text */
type ParsedToken = {
  type: 'text';
  value: string;
} | {
  type: 'insStart';
  data: SuggestionPayload;
} | {
  type: 'insEnd';
  id: string;
} | {
  type: 'delStart';
  data: SuggestionPayload;
} | {
  type: 'delEnd';
  id: string;
} | {
  type: 'commentStart';
  data: CommentPayload;
} | {
  type: 'commentEnd';
  id: string;
};
/** Active suggestion state for nesting */
interface ActiveSuggestion {
  id: string;
  type: 'insert' | 'remove';
  author?: string;
  date?: string;
  revisionId: number;
}
/** Comment stored in the document */
interface StoredComment {
  id: number;
  authorName: string;
  authorInitials: string;
  date?: string;
  text: string;
  /** 8-char uppercase hex ID < 0x7FFFFFFF, links comments.xml <-> commentsExtended.xml <-> commentsIds.xml */
  paraId: string;
  /** 8-char uppercase hex ID < 0x7FFFFFFF, links commentsIds.xml <-> commentsExtensible.xml */
  durableId: string;
  /** paraId of parent comment; present only on replies */
  parentParaId?: string;
}
/** Tracking state maintained during document generation */
interface TrackingState {
  suggestionStack: ActiveSuggestion[];
  replyIdsByParent: Map<string, string[]>;
}
/** Interface for document instance with tracking support */
interface TrackingDocumentInstance {
  _trackingState?: TrackingState;
  comments: StoredComment[];
  commentIdMap: Map<string, number>;
  lastCommentId: number;
  revisionIdMap: Map<string, number>;
  lastRevisionId: number;
  ensureComment: (data: Partial<CommentPayload>, parentParaId?: string) => number;
  getCommentId: (id: string) => number;
  getRevisionId: (id?: string) => number;
}
/** Document-wide set of allocated hex IDs to ensure uniqueness (per R12). */
declare const allocatedIds: Set<string>;
/** Reset allocated IDs between documents. */
declare function resetAllocatedIds(): void;
/** Generate a unique 8-char uppercase hex ID < 0x7FFFFFFF per OOXML spec. */
declare function generateHexId(): string;
declare const DOCX_INSERTION_START_TOKEN_PREFIX = "[[DOCX_INS_START:";
declare const DOCX_INSERTION_END_TOKEN_PREFIX = "[[DOCX_INS_END:";
declare const DOCX_INSERTION_TOKEN_SUFFIX = "]]";
declare const DOCX_DELETION_START_TOKEN_PREFIX = "[[DOCX_DEL_START:";
declare const DOCX_DELETION_END_TOKEN_PREFIX = "[[DOCX_DEL_END:";
declare const DOCX_DELETION_TOKEN_SUFFIX = "]]";
declare const DOCX_COMMENT_START_TOKEN_PREFIX = "[[DOCX_CMT_START:";
declare const DOCX_COMMENT_END_TOKEN_PREFIX = "[[DOCX_CMT_END:";
declare const DOCX_COMMENT_TOKEN_SUFFIX = "]]";
/**
 * Split text into an array of text segments and parsed tokens.
 */
declare function splitDocxTrackingTokens(text: string): ParsedToken[];
/**
 * Check if text contains any DOCX tracking tokens.
 */
declare function hasTrackingTokens(text: string): boolean;
/**
 * Collect all tracking token strings from text.
 */
declare function findDocxTrackingTokens(text: string): string[];
/**
 * Ensure tracking state is initialized on the document instance.
 */
declare function ensureTrackingState(docxDocumentInstance: TrackingDocumentInstance): TrackingState;
/**
 * Build a text element for normal text.
 */
declare function buildTextElement(text: string): XMLBuilder;
/**
 * Build a deleted text element (w:delText) for deletions.
 */
declare function buildDeletedTextElement(text: string): XMLBuilder;
/**
 * Build a comment range start marker.
 */
declare function buildCommentRangeStart(id: number): XMLBuilder;
/**
 * Build a comment range end marker.
 */
declare function buildCommentRangeEnd(id: number): XMLBuilder;
/**
 * Build a comment reference run (appears after commentRangeEnd).
 */
declare function buildCommentReferenceRun(id: number): XMLBuilder;
/**
 * Wrap a run fragment with a suggestion (w:ins or w:del).
 */
declare function wrapRunWithSuggestion(runFragment: XMLBuilder, suggestion: ActiveSuggestion): XMLBuilder;
/**
 * Build a suggestion start token string.
 */
declare function buildSuggestionStartToken(payload: SuggestionPayload, type: 'insert' | 'remove'): string;
/**
 * Build a suggestion end token string.
 */
declare function buildSuggestionEndToken(id: string, type: 'insert' | 'remove'): string;
/**
 * Build a comment start token string.
 */
declare function buildCommentStartToken(payload: CommentPayload): string;
/**
 * Build a comment end token string.
 */
declare function buildCommentEndToken(id: string): string;
//#endregion
//#region src/namespaces.d.ts
/** OOXML namespace URIs used in DOCX documents */
type OoxmlNamespaces = {
  /** DrawingML main namespace */a: string; /** Bibliography namespace */
  b: string; /** Chart Drawing namespace */
  cdr: string; /** Content types namespace */
  contentTypes: string; /** Core properties namespace */
  coreProperties: string; /** Core properties relationship namespace */
  corePropertiesRelation: string; /** Dublin Core elements namespace */
  dc: string; /** Dublin Core DCMI types namespace */
  dcmitype: string; /** Dublin Core terms namespace */
  dcterms: string; /** Comments relationship namespace */
  comments: string; /** Font table relationship namespace */
  fontTable: string; /** Footer relationship namespace */
  footers: string; /** Header relationship namespace */
  headers: string; /** Hyperlink relationship namespace */
  hyperlinks: string; /** Image relationship namespace */
  images: string; /** Math namespace */
  m: string; /** Numbering relationship namespace */
  numbering: string; /** Office namespace */
  o: string; /** Office document relationship namespace */
  officeDocumentRelation: string; /** Picture namespace */
  pic: string; /** Relationships namespace */
  r: string; /** Package relationships namespace */
  relationship: string; /** Settings relationship namespace */
  settingsRelation: string; /** Schema library namespace */
  sl: string; /** Styles relationship namespace */
  styles: string; /** Theme relationship namespace */
  themes: string; /** VML namespace */
  v: string; /** Markup compatibility namespace */
  ve: string; /** Document properties variant types namespace */
  vt: string; /** WordprocessingML main namespace */
  w: string; /** Word 2010 namespace */
  w10: string; /** Word 2010 WordML namespace */
  w14: string; /** Word 2012 WordML namespace */
  w15: string; /** Word 2016 WordML comment IDs namespace */
  w16cid: string; /** Word 2018 WordML comment extensible namespace */
  w16cex: string; /** Web settings relationship namespace */
  webSettingsRelation: string; /** Word 2006 WordML namespace */
  wne: string; /** WordprocessingDrawing namespace */
  wp: string; /** XML Schema namespace */
  xsd: string; /** XML Schema instance namespace */
  xsi: string;
};
declare const namespaces: OoxmlNamespaces;
//#endregion
//#region src/utils/list.d.ts
type ListStyleType$1 = 'circle' | 'decimal' | 'decimal-bracket' | 'decimal-bracket-end' | 'disc' | 'lower-alpha' | 'lower-alpha-bracket-end' | 'lower-roman' | 'square' | 'upper-alpha' | 'upper-alpha-bracket-end' | 'upper-roman';
type DocxListStyleType = 'decimal' | 'lowerLetter' | 'lowerRoman' | 'upperLetter' | 'upperRoman';
type ListStyleDefaults = {
  defaultOrderedListStyleType: DocxListStyleType;
};
type ListStyle = {
  'list-style-type'?: ListStyleType$1;
};
//#endregion
//#region src/utils/image-dimensions.d.ts
/**
 * Browser-compatible image dimension parser
 * Parses image dimensions from a Buffer without using Node.js fs module
 */
type ImageDimensions = {
  height: number;
  type: string;
  width: number;
};
//#endregion
//#region src/utils/vnode.d.ts
type VNode = {
  children?: VNode[];
  [key: string]: unknown;
};
//#endregion
//#region src/docx-document.d.ts
/** Virtual DOM tree node */
interface VTree {
  children?: VTree[];
  properties?: Record<string, unknown>;
  tagName?: string;
  text?: string;
}
/** Margins configuration (optional fields for input) */
interface Margins$1 {
  bottom?: number;
  footer?: number;
  gutter?: number;
  header?: number;
  left?: number;
  right?: number;
  top?: number;
}
/** Page size configuration */
interface PageSize$1 {
  height?: number;
  width?: number;
}
/** Line number options */
interface LineNumberOptions$1 {
  countBy?: number;
  restart?: string;
  start?: number;
}
/** Table options */
interface TableOptions$1 {
  row?: {
    cantSplit?: boolean;
  };
}
/** Header object stored in the document */
interface HeaderObject {
  headerId: number;
  relationshipId: number;
  type: string;
}
/** Footer object stored in the document */
interface FooterObject {
  footerId: number;
  relationshipId: number;
  type: string;
}
/** Relationship object */
interface RelationshipObject {
  relationshipId: number;
  target: string;
  targetMode: string;
  type: string;
}
/** File relationship entry */
interface FileRelationship {
  fileName: string;
  lastRelsId: number;
  rels: RelationshipObject[];
}
/** Relationship XML output */
interface RelationshipXMLOutput {
  fileName: string;
  xmlString: string;
}
/** Numbering object */
interface NumberingObject {
  numberingId: number;
  properties: NumberingProperties;
  type: 'ol' | 'ul';
}
/** Numbering properties */
interface NumberingProperties {
  attributes?: Record<string, string | undefined>;
  start?: number;
  style?: {
    'list-style-type'?: ListStyleType$1;
    [key: string]: string | undefined;
  };
}
/** Font table object */
interface FontTableObject {
  fontName: string;
  genericFontName: string;
}
/** Media file info */
interface MediaFileInfo {
  fileContent: string;
  fileNameWithExtension: string;
  id: number;
  isSVG?: boolean;
}
/** Style object */
interface StyleObject {
  [key: string]: unknown;
}
/** Section header result */
interface HeaderResult {
  headerId: number;
  headerXML: XMLBuilder;
}
/** Section footer result */
interface FooterResult {
  footerId: number;
  footerXML: XMLBuilder;
}
/** DocxDocument constructor properties */
interface DocxDocumentProperties {
  complexScriptFontSize?: number | null;
  createdAt?: Date;
  creator?: string;
  direction?: string;
  description?: string;
  font?: string;
  fontSize?: number | null;
  footer?: boolean;
  footerType?: string;
  header?: boolean;
  headerType?: string;
  heading?: typeof defaultDocumentOptions.heading;
  htmlString: string | null;
  imageProcessing?: typeof defaultDocumentOptions.imageProcessing;
  keywords?: string[];
  lang?: string;
  lastModifiedBy?: string;
  lineNumber?: boolean;
  lineNumberOptions?: LineNumberOptions$1;
  margins?: Margins$1 | null;
  modifiedAt?: Date;
  numbering?: ListStyleDefaults;
  orientation?: string;
  pageNumber?: boolean;
  pageSize?: PageSize$1 | null;
  revision?: number;
  skipFirstHeaderFooter?: boolean;
  subject?: string;
  table?: TableOptions$1;
  title?: string;
  zip: JSZip;
}
//#endregion
//#region src/index.d.ts
type Margins = {
  bottom?: number;
  footer?: number;
  gutter?: number;
  header?: number;
  left?: number;
  right?: number;
  top?: number;
};
type PageSize = {
  height?: number;
  width?: number;
};
type Row = {
  cantSplit?: boolean;
};
type BorderOptions = {
  color?: string;
  size?: number;
};
type TableOptions = {
  borderOptions?: BorderOptions;
  row?: Row;
};
type TableBorderOptions = BorderOptions;
type LineNumberOptions = {
  countBy?: number;
  distance?: number;
  restart?: 'continuous' | 'newPage' | 'newSection';
  start?: number;
};
type HeadingSpacing = {
  after?: number;
  before?: number;
  line?: number;
  lineRule?: 'atLeast' | 'auto' | 'exact';
};
type HeadingStyleOptions = {
  bold?: boolean;
  color?: string;
  font?: string;
  fontSize?: number;
  italic?: boolean;
  spacing?: HeadingSpacing;
  underline?: boolean;
};
type HeadingOptions = {
  heading1?: HeadingStyleOptions;
  heading2?: HeadingStyleOptions;
  heading3?: HeadingStyleOptions;
  heading4?: HeadingStyleOptions;
  heading5?: HeadingStyleOptions;
  heading6?: HeadingStyleOptions;
};
type ImageProcessing = {
  downloadTimeout?: number;
  maxCacheEntries?: number;
  maxCacheSize?: number;
  maxImageSize?: number;
  maxRetries?: number;
  maxTimeout?: number;
  minImageSize?: number;
  minTimeout?: number;
  retryDelayBase?: number;
  suppressSharpWarning?: boolean;
  svgHandling?: 'convert' | 'native';
  svgSanitization?: boolean;
  verboseLogging?: boolean;
};
type NumberingOptions = {
  defaultOrderedListStyleType?: string;
};
type DocumentOptions = {
  complexScriptFontSize?: number | string;
  createdAt?: Date;
  creator?: string;
  decodeUnicode?: boolean;
  defaultLang?: string;
  description?: string;
  direction?: 'ltr' | 'rtl';
  font?: string;
  fontSize?: number | string;
  footer?: boolean;
  footerType?: 'default' | 'even' | 'first';
  header?: boolean;
  headerType?: 'default' | 'even' | 'first';
  heading?: HeadingOptions;
  imageProcessing?: ImageProcessing;
  keywords?: string[];
  lastModifiedBy?: string;
  lineNumber?: boolean | LineNumberOptions;
  lineNumberOptions?: LineNumberOptions;
  margins?: Margins;
  modifiedAt?: Date;
  numbering?: NumberingOptions;
  orientation?: 'landscape' | 'portrait';
  pageNumber?: boolean;
  pageSize?: PageSize;
  revision?: number;
  skipFirstHeaderFooter?: boolean;
  subject?: string;
  table?: TableOptions;
  title?: string;
};
//#endregion
export { ActiveSuggestion, BorderOptions, BorderSide, CommentPayload, CommentReply, DOCX_COMMENT_END_TOKEN_PREFIX, DOCX_COMMENT_START_TOKEN_PREFIX, DOCX_COMMENT_TOKEN_SUFFIX, DOCX_DELETION_END_TOKEN_PREFIX, DOCX_DELETION_START_TOKEN_PREFIX, DOCX_DELETION_TOKEN_SUFFIX, DOCX_INSERTION_END_TOKEN_PREFIX, DOCX_INSERTION_START_TOKEN_PREFIX, DOCX_INSERTION_TOKEN_SUFFIX, Direction, type DocumentMargins, DocumentOptions, type DocxDocumentProperties, type DocxListStyleType, type FileRelationship, type FontTableObject, type FooterObject, type FooterResult, generateContainer as HTMLtoDOCX, generateContainer as default, HeaderFooterType, type HeaderObject, type HeaderResult, HeadingOptions, HeadingSpacing, HeadingStyleOptions, type HtmlToDocxResult, type ImageDimensions, ImageProcessing, ImageProcessingOptions, LineNumberOptions, LineNumberRestart, type ListStyle, type ListStyleDefaults, ListStyleType, Margins, type MediaFileInfo, type NumberingObject, NumberingOptions, type NumberingProperties, type OoxmlNamespaces, Orientation, PageSize, ParagraphBorders, ParsedToken, type RelationshipObject, type RelationshipXMLOutput, Row, SVG_UNIT_TO_PIXEL_CONVERSIONS, StoredComment, type StyleObject, SuggestionPayload, TableBorderAttributeOptions, TableBorderOptions, TableOptions, TableRowOptions, TrackingDocumentInstance, TrackingState, type VNode, type VTree, VerticalAlign, allocatedIds, applicationName, buildCommentEndToken, buildCommentRangeEnd, buildCommentRangeStart, buildCommentReferenceRun, buildCommentStartToken, buildDeletedTextElement, buildSuggestionEndToken, buildSuggestionStartToken, buildTextElement, colorlessColors, commentsExtendedContentType, commentsExtendedRelationshipType, commentsExtendedType, commentsExtensibleContentType, commentsExtensibleRelationshipType, commentsExtensibleType, commentsIdsContentType, commentsIdsRelationshipType, commentsIdsType, commentsType, defaultDirection, defaultDocumentOptions, defaultFont, defaultFontSize, defaultHTMLString, defaultHeadingOptions, defaultLang, defaultOrientation, defaultTableBorderAttributeOptions, defaultTableBorderOptions, documentFileName, ensureTrackingState, findDocxTrackingTokens, footerFileName, footerType, generateHexId, hasTrackingTokens, headerFileName, headerType, hyperlinkType, imageType, internalRelationship, landscapeHeight, landscapeMargins, landscapeWidth, namespaces, paragraphBordersObject, peopleContentType, peopleRelationshipType, peopleType, portraitMargins, relsFolderName, resetAllocatedIds, splitDocxTrackingTokens, themeFileName, themeFolder, themeType, verticalAlignValues, wordFolder, wrapRunWithSuggestion };
//# sourceMappingURL=index.d.ts.map