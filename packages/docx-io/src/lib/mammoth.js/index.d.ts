export function convertToHtml(
  input: { arrayBuffer: ArrayBuffer } | { path: string } | { buffer: Buffer },
  options?: {
    styleMap?: string | string[];
    includeEmbeddedStyleMap?: boolean;
    includeDefaultStyleMap?: boolean;
    ignoreEmptyParagraphs?: boolean;
    idPrefix?: string;
    transformDocument?: (element: unknown) => unknown;
  }
): Promise<{
  value: string;
  messages: Array<{ type: 'warning' | 'error'; message: string }>;
}>;

export function convertToMarkdown(
  input: { arrayBuffer: ArrayBuffer } | { path: string } | { buffer: Buffer },
  options?: {
    styleMap?: string | string[];
    includeEmbeddedStyleMap?: boolean;
    includeDefaultStyleMap?: boolean;
    ignoreEmptyParagraphs?: boolean;
    idPrefix?: string;
    transformDocument?: (element: unknown) => unknown;
  }
): Promise<{
  value: string;
  messages: Array<{ type: 'warning' | 'error'; message: string }>;
}>;

export function convert(
  input: { arrayBuffer: ArrayBuffer } | { path: string } | { buffer: Buffer },
  options?: {
    styleMap?: string | string[];
    includeEmbeddedStyleMap?: boolean;
    includeDefaultStyleMap?: boolean;
    ignoreEmptyParagraphs?: boolean;
    idPrefix?: string;
    transformDocument?: (element: unknown) => unknown;
  }
): Promise<{
  value: string;
  messages: Array<{ type: 'warning' | 'error'; message: string }>;
}>;

export function extractRawText(
  input: { arrayBuffer: ArrayBuffer } | { path: string } | { buffer: Buffer }
): Promise<{
  value: string;
  messages: Array<{ type: 'warning' | 'error'; message: string }>;
}>;

export function embedStyleMap(
  input: { arrayBuffer: ArrayBuffer } | { path: string } | { buffer: Buffer },
  styleMap: string
): Promise<{
  toArrayBuffer(): ArrayBuffer;
  toBuffer(): Buffer;
}>;

export function readEmbeddedStyleMap(
  input: { arrayBuffer: ArrayBuffer } | { path: string } | { buffer: Buffer }
): Promise<string | null>;

export const images: unknown;
export const transforms: unknown;
export const underline: unknown;
export function styleMapping(): never;
