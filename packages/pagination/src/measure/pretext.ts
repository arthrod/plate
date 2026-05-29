// ============================================================
// pagination/measure/pretext.ts
//
// Real text line-breaking via @chenglou/pretext. Given a block's text, a CSS
// font string, and the content width, this returns the wrapped lines with each
// line's text, measured width, and the segment/grapheme cursor range it spans
// (the seed for mapping a line back to a Slate offset).
//
// pretext measures glyph widths through a canvas 2d context (OffscreenCanvas or
// a DOM canvas). It therefore requires a browser-like environment at runtime;
// tests inject a deterministic canvas stub.
// ============================================================

import { layoutWithLines, prepareWithSegments } from '@chenglou/pretext';

/** A position inside the prepared text (pretext cursor). */
export type LineCursor = {
  segmentIndex: number;
  graphemeIndex: number;
};

/** One wrapped visual line of a block. */
export type MeasuredLine = {
  text: string;
  widthPx: number;
  start: LineCursor;
  end: LineCursor;
};

/**
 * Break `text` into the visual lines it wraps to at `widthPx`, measured with
 * `font`. `lineHeightPx` is the line box height pretext stacks lines by.
 */
export function measureTextLines(
  text: string,
  font: string,
  widthPx: number,
  lineHeightPx: number
): MeasuredLine[] {
  const prepared = prepareWithSegments(text, font, { whiteSpace: 'pre-wrap' });
  const { lines } = layoutWithLines(prepared, widthPx, lineHeightPx);

  return lines.map((line) => ({
    end: line.end,
    start: line.start,
    text: line.text,
    widthPx: line.width,
  }));
}

/**
 * Block height = wrapped line count × line height. This is the canonical,
 * pretext-driven block measurement: the layout no longer trusts the DOM box
 * height, it counts the lines pretext wraps `text` to at `widthPx`. Empty text
 * is one line tall.
 */
export function measureBlockHeight(
  text: string,
  font: string,
  widthPx: number,
  lineHeightPx: number
): number {
  const lineCount = Math.max(
    1,
    measureTextLines(text, font, widthPx, lineHeightPx).length
  );

  return lineCount * lineHeightPx;
}
