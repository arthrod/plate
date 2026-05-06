import { useMemo } from 'react';

import type { TElement } from 'platejs';

import type { Measurer, PageContext } from '../lib/types';

import {
  type MeasureCache,
  createMeasureCache,
  hashString,
} from '../lib/internal/measure-cache';

const FONT_SIZE_RE =
  /(\d+(?:\.\d+)?)(px|pt)(?:\/((?:\d+(?:\.\d+)?(?:px|pt)?)|(?:\d+(?:\.\d+)?)))?/;
const PX_SUFFIX_RE = /px$/;
const PT_SUFFIX_RE = /pt$/;
const FONT_SIZE_UNIT_RE = /(\d+(?:\.\d+)?)(px|pt)/;
const WHITESPACE_RE = /\s+/;

/**
 * Returns a {@link Measurer} backed by a canvas-based text-width oracle plus
 * the per-instance {@link MeasureCache}.
 *
 * Cache key matches CodeRabbit Design Choice 3:
 * `(node.id, marks-fingerprint, font, width)`. The hook owns the cache so
 * measured heights survive React re-renders. The cache resets when the
 * editor instance changes (the hook receives a new `editorId` per editor).
 *
 * The interface mirrors the future `@chenglou/pretext`-backed measurer; only
 * the internals change when pretext is wired in. Until then, this DOM-based
 * estimator is more than accurate enough for paginating typical prose.
 */
export const usePretextMeasurer = (editorId?: string): Measurer =>
  useMemo<Measurer>(() => {
    const cache: MeasureCache = createMeasureCache();
    const ctx2d = createCanvasContext();

    void editorId;

    return {
      measure: (node: TElement, ctx: PageContext): number => {
        const nodeId =
          (node as TElement & { id?: string | number }).id?.toString() ??
          fallbackNodeId(node);
        const contentHash = hashString(
          `${node.type ?? ''}|${collectPlainText(node)}`
        );

        const key = {
          contentHash,
          font: ctx.font,
          marksFingerprint: ctx.marksFingerprint,
          nodeId,
          width: ctx.width,
        };

        const cached = cache.get(key);
        if (cached !== undefined) return cached;

        const height = estimateBlockHeight(node, ctx, ctx2d);

        cache.set(key, height);

        return height;
      },
    };
  }, [editorId]);

const createCanvasContext = (): CanvasRenderingContext2D | null => {
  if (typeof document === 'undefined') return null;

  const canvas = document.createElement('canvas');

  return canvas.getContext('2d');
};

const fallbackNodeId = (node: TElement): string => {
  // Hash the leading 64 chars of plain text — stable enough for the cache
  // when nodes lack an id (Plate editors typically assign one).
  let text = '';

  walkText(node, (t) => {
    text += t;
    if (text.length > 64) return false;

    return true;
  });

  return `t:${text.slice(0, 64)}`;
};

const walkText = (
  node: { children?: unknown[]; text?: string },
  visit: (text: string) => boolean
): boolean => {
  if (typeof node.text === 'string') {
    return visit(node.text);
  }
  if (!Array.isArray(node.children)) return true;
  for (const child of node.children) {
    const cont = walkText(
      child as { children?: unknown[]; text?: string },
      visit
    );

    if (!cont) return false;
  }

  return true;
};

const estimateBlockHeight = (
  node: TElement,
  ctx: PageContext,
  canvas: CanvasRenderingContext2D | null
): number => {
  const { fontSizePx, lineHeightPx } = parseFont(ctx.font);

  // Resolve a per-block-type baseline scale. Headings render larger than
  // body text; void images/embeds get a fixed estimate. The marksFingerprint
  // already captures bold/italic so we don't multiply for those.
  const scale = blockScale(node.type);
  const headingPx =
    scale === 1 ? 0 : Math.max(0, scale * fontSizePx - fontSizePx);
  const blockSpacingPx = blockSpacing(node.type, fontSizePx);

  const text = collectPlainText(node);
  if (text.length === 0) {
    return Math.max(lineHeightPx, scale * lineHeightPx) + blockSpacingPx;
  }

  const linesEstimate = canvas
    ? estimateLineCountFromCanvas(text, canvas, ctx, scale)
    : estimateLineCountFallback(text, ctx.width, fontSizePx * scale);

  const lineHeight = scale === 1 ? lineHeightPx : scale * lineHeightPx;

  return linesEstimate * lineHeight + headingPx + blockSpacingPx;
};

const estimateLineCountFromCanvas = (
  text: string,
  canvas: CanvasRenderingContext2D,
  ctx: PageContext,
  scale: number
): number => {
  // Set the font on the canvas. The PageContext.font already has the
  // base body font; we scale up for headings via a font-size override.
  canvas.font = scale === 1 ? ctx.font : scaleFont(ctx.font, scale);

  const words = text.split(WHITESPACE_RE).filter(Boolean);
  if (words.length === 0) return 1;

  const spaceWidth = canvas.measureText(' ').width;
  let lineWidth = 0;
  let lines = 1;

  for (const word of words) {
    const wordWidth = canvas.measureText(word).width;

    if (lineWidth === 0) {
      lineWidth = wordWidth;
      continue;
    }
    if (lineWidth + spaceWidth + wordWidth > ctx.width) {
      lines += 1;
      lineWidth = wordWidth;
    } else {
      lineWidth += spaceWidth + wordWidth;
    }
  }

  return lines;
};

const estimateLineCountFallback = (
  text: string,
  width: number,
  fontSizePx: number
): number => {
  const charsPerLine = Math.max(1, Math.floor(width / (fontSizePx * 0.5)));

  return Math.max(1, Math.ceil(text.length / charsPerLine));
};

const blockScale = (type: string | undefined): number => {
  switch (type) {
    case 'h1':
      return 2;
    case 'h2':
      return 1.5;
    case 'h3':
      return 1.25;
    case 'h4':
    case 'h5':
    case 'h6':
      return 1.1;
    default:
      return 1;
  }
};

const blockSpacing = (type: string | undefined, fontSizePx: number): number => {
  // Margin-top + margin-bottom approximation per block type.
  switch (type) {
    case 'h1':
    case 'h2':
    case 'h3':
    case 'h4':
    case 'h5':
    case 'h6':
      return fontSizePx * 1.2;
    case 'blockquote':
    case 'code_block':
      return fontSizePx;
    default:
      return fontSizePx * 0.5;
  }
};

const parseFont = (
  font: string
): {
  fontSizePx: number;
  lineHeightPx: number;
} => {
  // Tolerant parser — pulls the first `<n>px` (or `<n>pt`) it finds for size,
  // and an optional `/lineHeight` immediately after.
  const sizeMatch = font.match(FONT_SIZE_RE);

  if (!sizeMatch) {
    return { fontSizePx: 16, lineHeightPx: 24 };
  }

  const fontSizePx =
    sizeMatch[2] === 'pt'
      ? Number.parseFloat(sizeMatch[1]) * (96 / 72)
      : Number.parseFloat(sizeMatch[1]);

  const lhRaw = sizeMatch[3];
  let lineHeightPx = fontSizePx * 1.5;

  if (lhRaw) {
    if (PX_SUFFIX_RE.test(lhRaw)) {
      lineHeightPx = Number.parseFloat(lhRaw);
    } else if (PT_SUFFIX_RE.test(lhRaw)) {
      lineHeightPx = Number.parseFloat(lhRaw) * (96 / 72);
    } else {
      lineHeightPx = Number.parseFloat(lhRaw) * fontSizePx;
    }
  }

  return { fontSizePx, lineHeightPx };
};

const scaleFont = (font: string, scale: number): string =>
  font.replace(
    FONT_SIZE_UNIT_RE,
    (_m, n, unit) =>
      `${Math.round(Number.parseFloat(n) * scale * 100) / 100}${unit}`
  );

const collectPlainText = (node: TElement): string => {
  // Concatenate leaf text exactly — adjacent formatted leaves form one
  // word in the rendered DOM, so inserting an artificial space between
  // them would over-count line breaks during measurement.
  let out = '';

  walkText(node, (t) => {
    out += t;

    return true;
  });

  return out;
};
