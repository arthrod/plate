// ============================================================
// pagination/react/domMeasure.ts
//
// DOM-backed MeasureFn for the engine: reads each top-level block's rendered
// height + computed line height from the live editable. Pure DOM (no
// slate-react / editor dependency) — top-level blocks are the direct
// `[data-slate-node="element"]` children of the editable, indexed by path[0].
// ============================================================

import type { MeasureFn } from '../measure/measure';

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

/**
 * Build a {@link MeasureFn} that reads block geometry from the editable DOM.
 * Measured `heightPx` includes the block's vertical margins so stacked heights
 * match what the user sees. Re-queries on each call so it reflects edits.
 */
export function createDomMeasure(editable: HTMLElement): MeasureFn {
  return (block) => {
    const dom = topLevelBlockElements(editable)[block.path[0]];
    if (!dom) return null;

    // offsetHeight only (no margins): the page-start spacer is applied as
    // marginTop, so reading margins here would double-count it on recompute.
    return {
      heightPx: dom.offsetHeight,
      lineHeightPx: resolveLineHeight(getComputedStyle(dom)),
    };
  };
}
