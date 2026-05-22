// ============================================================
// pagination/react/domMeasure.ts
//
// DOM-backed MeasureFn for the engine: resolves each top-level block's font +
// content width from the live editable, then derives height from the number of
// lines pretext wraps the block text to. Pure DOM (no slate-react / editor
// dependency) — top-level blocks are the direct `[data-slate-node="element"]`
// children of the editable, indexed by path[0].
// ============================================================

import type { MeasureFn } from '../measure/measure';
import { measureBlockHeight } from '../measure/pretext';

/** Direct top-level block elements of an editable, in document order. */
export function topLevelBlockElements(editable: HTMLElement): HTMLElement[] {
  return Array.from(
    editable.querySelectorAll(':scope > [data-slate-node="element"]')
  ) as HTMLElement[];
}

function resolveLineHeight(style: CSSStyleDeclaration): number {
  const lh = Number.parseFloat(style.lineHeight);
  if (Number.isFinite(lh) && lh > 0) return lh;

  const fontSize = Number.parseFloat(style.fontSize);
  if (Number.isFinite(fontSize) && fontSize > 0) return fontSize * 1.5;

  return 20;
}

/** A canvas-compatible font string from computed style (the editor's font). */
function resolveFont(style: CSSStyleDeclaration): string {
  if (style.font) return style.font;

  const parts = [
    style.fontStyle,
    style.fontWeight,
    style.fontSize,
    style.fontFamily,
  ].filter((p) => p && p !== 'normal');

  return parts.join(' ').trim() || '16px sans-serif';
}

/** Inner content width (excludes horizontal padding) the text wraps within. */
function contentWidth(dom: HTMLElement, style: CSSStyleDeclaration): number {
  const padLeft = Number.parseFloat(style.paddingLeft) || 0;
  const padRight = Number.parseFloat(style.paddingRight) || 0;

  return Math.max(0, dom.clientWidth - padLeft - padRight);
}

/**
 * Build a {@link MeasureFn} that resolves the block's font + content width from
 * the live editable, then derives height from the number of lines pretext wraps
 * the block text to. Pretext — not the DOM box — owns the line count, so the
 * layout is line-accurate and the box's padding/margin don't perturb it.
 * Re-queries on each call so it reflects edits.
 */
export function createDomMeasure(editable: HTMLElement): MeasureFn {
  return (block) => {
    const dom = topLevelBlockElements(editable)[block.path[0]];
    if (!dom) return null;

    const style = getComputedStyle(dom);
    const lineHeightPx = resolveLineHeight(style);

    return {
      heightPx: measureBlockHeight(
        block.text,
        resolveFont(style),
        contentWidth(dom, style),
        lineHeightPx
      ),
      lineHeightPx,
    };
  };
}
