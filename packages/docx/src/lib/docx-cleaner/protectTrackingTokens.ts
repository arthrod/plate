/**
 * @file Variant A — DOM placeholder swap. Wraps the existing `cleanDocx`
 * pipeline so tracking tokens (`[[DOCX_INS_*]]`, `[[DOCX_DEL_*]]`,
 * `[[DOCX_CMT_*]]`) survive every cleaner without losing any bytes.
 *
 * Strategy: before any cleaner runs, walk `body` once and swap every token
 * text into a `<span data-docx-tracking-token="<base64-of-original>"
 * data-docx-tracking-kind="ins-start|...">​</span>` placeholder. The
 * zero-width-space child guarantees no cleaner classifies the wrapper as
 * empty. After the pipeline runs, we walk again and restore each placeholder
 * to a `Text` node holding the base64-decoded original token bytes.
 *
 * See issue #347.
 */

import { classifyTrackingToken, TRACKING_TOKEN_REGEX } from './tracking-tokens';

const PLACEHOLDER_TAG = 'span';
const PLACEHOLDER_DATA_ATTR = 'data-docx-tracking-token';
const PLACEHOLDER_KIND_ATTR = 'data-docx-tracking-kind';
const ZERO_WIDTH_SPACE = '​';

// Buffer is preferred when available (Node, bundled SSR). `unescape`/`escape`
// are not defined in modern Node and must not be reached. Browser path uses
// `TextEncoder`/`TextDecoder` to round-trip arbitrary Unicode through base64.
const encodeToken = (token: string): string => {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(token, 'utf8').toString('base64');
  }
  const bytes = new TextEncoder().encode(token);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
};

const decodeToken = (encoded: string): string => {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(encoded, 'base64').toString('utf8');
  }
  const binary = atob(encoded);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
};

const collectTextNodes = (root: Node): Text[] => {
  const out: Text[] = [];
  const walker = root.ownerDocument
    ? root.ownerDocument.createTreeWalker(root, 0x4 /* SHOW_TEXT */)
    : null;
  if (!walker) return out;
  let node = walker.nextNode();
  while (node) {
    out.push(node as Text);
    node = walker.nextNode();
  }
  return out;
};

/**
 * Swap every tracking token inside `body`'s text nodes with an opaque
 * placeholder element. Pure side-effect: mutates `body` in place to keep the
 * existing `cleanDocx` linear-pipeline shape.
 */
export function protectTrackingTokens(body: HTMLElement): void {
  const doc = body.ownerDocument;
  if (!doc) return;
  for (const text of collectTextNodes(body)) {
    const value = text.nodeValue ?? '';
    TRACKING_TOKEN_REGEX.lastIndex = 0;
    if (!TRACKING_TOKEN_REGEX.test(value)) continue;

    TRACKING_TOKEN_REGEX.lastIndex = 0;
    const fragments = value.split(TRACKING_TOKEN_REGEX);
    if (fragments.length <= 1) continue;

    const parent = text.parentNode;
    if (!parent) continue;

    for (const fragment of fragments) {
      if (!fragment) continue;
      const kind = classifyTrackingToken(fragment);
      if (kind) {
        const placeholder = doc.createElement(PLACEHOLDER_TAG);
        placeholder.setAttribute(PLACEHOLDER_DATA_ATTR, encodeToken(fragment));
        placeholder.setAttribute(PLACEHOLDER_KIND_ATTR, kind);
        placeholder.textContent = ZERO_WIDTH_SPACE;
        parent.insertBefore(placeholder, text);
      } else {
        parent.insertBefore(doc.createTextNode(fragment), text);
      }
    }
    parent.removeChild(text);
  }
}

/**
 * Walk `body` after the cleanup pipeline finishes and replace every
 * surviving `<span data-docx-tracking-token>` with a `Text` node carrying
 * the base64-decoded original token bytes, preserving sibling order.
 */
export function restoreTrackingTokens(body: HTMLElement): void {
  const doc = body.ownerDocument;
  if (!doc) return;
  const placeholders = Array.from(
    body.querySelectorAll(`${PLACEHOLDER_TAG}[${PLACEHOLDER_DATA_ATTR}]`)
  );
  for (const placeholder of placeholders) {
    const encoded = placeholder.getAttribute(PLACEHOLDER_DATA_ATTR) ?? '';
    const token = decodeToken(encoded);
    placeholder.replaceWith(doc.createTextNode(token));
  }
}

/**
 * Pre-pipeline string-level pass for tokens that exist between tags (rare
 * Mammoth output) before `DOMParser` is called. Wraps any bare token in a
 * placeholder span so `protectTrackingTokens` can later see it inside a text
 * node and downstream cleaners cannot mutate the raw token text.
 */
export function preProtectRawHtml(html: string): string {
  TRACKING_TOKEN_REGEX.lastIndex = 0;
  return html.replace(TRACKING_TOKEN_REGEX, (token) => {
    const kind = classifyTrackingToken(token);
    if (!kind) return token;
    return `<${PLACEHOLDER_TAG} ${PLACEHOLDER_DATA_ATTR}="${encodeToken(token)}" ${PLACEHOLDER_KIND_ATTR}="${kind}">${ZERO_WIDTH_SPACE}</${PLACEHOLDER_TAG}>`;
  });
}
