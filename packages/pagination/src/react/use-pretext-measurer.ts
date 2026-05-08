import { useMemo } from 'react';

import type { SlateEditor, TElement } from 'platejs';

import { layout, prepare } from '@chenglou/pretext';
import {
  type RichInlineItem,
  measureRichInlineStats,
  prepareRichInline,
} from '@chenglou/pretext/rich-inline';

import type { Measurer, PageContext } from '../lib/types';

import {
  type MeasureCache,
  createMeasureCache,
  hashString,
} from '../lib/internal/measure-cache';

const FALLBACK_FONT_SIZE_PX = 16;
const FALLBACK_LINE_HEIGHT_PX = 24;
const FALLBACK_FONT = `400 ${FALLBACK_FONT_SIZE_PX}px "Inter"`;

const SYSTEM_UI_FAMILY_RE =
  /\b(system-ui|-apple-system|BlinkMacSystemFont|"Segoe UI"|Segoe UI)\b/i;
const FONT_WEIGHT_TOKEN_RE = /\b([1-9]00|normal|bold)\b/;
const FONT_STYLE_TOKEN_RE = /\b(normal|italic|oblique)\b/;

/**
 * Returns a {@link Measurer} backed by `@chenglou/pretext` and a per-instance
 * height cache.
 *
 * For each block the measurer scrapes the rendered DOM element via
 * `editor.api.toDOMNode(node)` and reads `getComputedStyle(...).font`. The
 * `system-ui` family is rewritten to `Inter` because pretext's accuracy
 * tables cover named families only. Mixed-mark blocks fall through to
 * `prepareRichInline()` so per-run font weights/styles measure correctly.
 *
 * Cache key is `(node.id, marksFingerprint, font, width, contentHash)`. The
 * `contentHash` invalidates the entry when text changes without the
 * `node.id` rotating (Slate mutates `children` in place).
 */
export const usePretextMeasurer = (editor: SlateEditor): Measurer =>
  useMemo<Measurer>(() => {
    const cache: MeasureCache = createMeasureCache();

    return {
      measure: (node: TElement, ctx: PageContext): number => {
        const metrics = scrapeBlockMetrics(editor, node, ctx.font);
        const nodeId =
          (node as TElement & { id?: string | number }).id?.toString() ??
          fallbackNodeId(node);
        const text = collectPlainText(node);
        const contentHash = hashString(`${node.type ?? ''}|${text}`);

        const cacheKey = {
          contentHash,
          font: metrics.font,
          marksFingerprint: ctx.marksFingerprint,
          nodeId,
          width: ctx.width,
        };

        const cached = cache.get(cacheKey);
        if (cached !== undefined) return cached;

        const total =
          measureBlockHeight(node, text, metrics, ctx.width) +
          blockSpacingPx(node.type, metrics.sizePx);

        cache.set(cacheKey, total);

        return total;
      },
    };
  }, [editor]);

type BlockMetrics = {
  font: string;
  lineHeightPx: number;
  sizePx: number;
};

const measureBlockHeight = (
  node: TElement,
  text: string,
  metrics: BlockMetrics,
  width: number
): number => {
  if (text.length === 0) {
    return metrics.lineHeightPx;
  }

  // Pretext requires a DOM canvas / OffscreenCanvas — both absent during
  // Next.js SSR. Guard with a try/catch so the SSR build still produces a
  // height (one line) instead of throwing during prerender.
  try {
    if (hasMixedMarks(node)) {
      const items: RichInlineItem[] = collectLeaves(node).map((leaf) => ({
        font: applyLeafMarks(metrics.font, leaf.marks),
        text: leaf.text,
      }));
      const prepared = prepareRichInline(items);
      const stats = measureRichInlineStats(prepared, width);

      return Math.max(1, stats.lineCount) * metrics.lineHeightPx;
    }

    const prepared = prepare(text, metrics.font);
    const result = layout(prepared, width, metrics.lineHeightPx);

    return result.height;
  } catch {
    return metrics.lineHeightPx;
  }
};

const scrapeBlockMetrics = (
  editor: SlateEditor,
  node: TElement,
  fallbackFont: string
): BlockMetrics => {
  if (typeof window === 'undefined') return fallbackMetrics(fallbackFont);

  try {
    const dom = editor.api.toDOMNode(node);

    if (!(dom instanceof HTMLElement)) return fallbackMetrics(fallbackFont);

    return readComputedFont(window.getComputedStyle(dom));
  } catch {
    return fallbackMetrics(fallbackFont);
  }
};

const fallbackMetrics = (fallbackFont: string): BlockMetrics => ({
  font: fallbackFont || FALLBACK_FONT,
  lineHeightPx: FALLBACK_LINE_HEIGHT_PX,
  sizePx: FALLBACK_FONT_SIZE_PX,
});

const readComputedFont = (cs: CSSStyleDeclaration): BlockMetrics => {
  const sizePx = Number.parseFloat(cs.fontSize) || FALLBACK_FONT_SIZE_PX;

  let lineHeightPx: number;

  if (!cs.lineHeight || cs.lineHeight === 'normal') {
    lineHeightPx = sizePx * 1.5;
  } else {
    const parsed = Number.parseFloat(cs.lineHeight);
    lineHeightPx = Number.isFinite(parsed) ? parsed : sizePx * 1.5;
  }

  const family = snapSystemUi(cs.fontFamily || '"Inter"');
  const weight = cs.fontWeight || '400';
  const style = cs.fontStyle || 'normal';
  const stylePart = style === 'normal' ? '' : `${style} `;
  const font = `${stylePart}${weight} ${roundPx(sizePx)}px ${family}`;

  return { font, lineHeightPx, sizePx };
};

const snapSystemUi = (family: string): string =>
  SYSTEM_UI_FAMILY_RE.test(family)
    ? family.replace(SYSTEM_UI_FAMILY_RE, '"Inter"')
    : family;

const roundPx = (n: number): number => Math.round(n * 100) / 100;

type LeafSnapshot = {
  marks: Record<string, unknown>;
  text: string;
};

const collectLeaves = (node: TElement): LeafSnapshot[] => {
  const out: LeafSnapshot[] = [];

  const walk = (n: unknown): void => {
    if (n === null || typeof n !== 'object') return;

    const obj = n as Record<string, unknown>;

    if (typeof obj.text === 'string') {
      const { text, ...marks } = obj as Record<string, unknown> & {
        text: string;
      };

      out.push({ marks, text });

      return;
    }

    const children = obj.children;
    if (!Array.isArray(children)) return;

    for (const child of children) walk(child);
  };

  walk(node);

  return out;
};

const collectPlainText = (node: TElement): string => {
  let out = '';

  for (const leaf of collectLeaves(node)) out += leaf.text;

  return out;
};

const hasMixedMarks = (node: TElement): boolean => {
  const leaves = collectLeaves(node);
  if (leaves.length <= 1) return false;

  const first = serializeMarks(leaves[0]!.marks);

  for (let i = 1; i < leaves.length; i++) {
    if (serializeMarks(leaves[i]!.marks) !== first) return true;
  }

  return false;
};

const serializeMarks = (marks: Record<string, unknown>): string => {
  const keys = Object.keys(marks).sort();
  if (keys.length === 0) return '';

  return keys.map((k) => `${k}=${formatMark(marks[k])}`).join(',');
};

const formatMark = (value: unknown): string => {
  if (value === true) return '1';
  if (value === false) return '0';
  if (value == null) return '';
  if (typeof value === 'object') return JSON.stringify(value);

  return String(value);
};

const applyLeafMarks = (
  baseFont: string,
  marks: Record<string, unknown>
): string => {
  let font = baseFont;

  if (marks.bold === true) {
    font = FONT_WEIGHT_TOKEN_RE.test(font)
      ? font.replace(FONT_WEIGHT_TOKEN_RE, '700')
      : `700 ${font}`;
  }
  if (marks.italic === true) {
    font = FONT_STYLE_TOKEN_RE.test(font)
      ? font.replace(FONT_STYLE_TOKEN_RE, 'italic')
      : `italic ${font}`;
  }

  return font;
};

const fallbackNodeId = (node: TElement): string => {
  let acc = '';

  const walk = (n: unknown): boolean => {
    if (n === null || typeof n !== 'object') return true;

    const obj = n as Record<string, unknown>;

    if (typeof obj.text === 'string') {
      acc += obj.text;

      return acc.length < 64;
    }

    const children = obj.children;
    if (!Array.isArray(children)) return true;

    for (const child of children) {
      if (!walk(child)) return false;
    }

    return true;
  };

  walk(node);

  return `t:${acc.slice(0, 64)}`;
};

const HEADING_SPACING_FACTOR = 1.2;
const QUOTE_OR_CODE_SPACING_FACTOR = 1;
const BODY_SPACING_FACTOR = 0.5;

const HEADING_TYPES = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);
const QUOTE_OR_CODE_TYPES = new Set(['blockquote', 'code_block']);

const blockSpacingPx = (type: string | undefined, sizePx: number): number => {
  if (type !== undefined) {
    if (HEADING_TYPES.has(type)) return sizePx * HEADING_SPACING_FACTOR;
    if (QUOTE_OR_CODE_TYPES.has(type))
      return sizePx * QUOTE_OR_CODE_SPACING_FACTOR;
  }

  return sizePx * BODY_SPACING_FACTOR;
};
