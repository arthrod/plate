// ============================================================
// pagination/react/domMeasure.ts
//
// DOM-backed MeasureFn for the engine hook: reads a top-level block's rendered
// height + computed line height from the live editor DOM. This is the only
// place that touches the DOM in the measurement path — the rest of the pipeline
// (snapshot → measure → compose) stays pure.
// ============================================================

import type { SlateEditor } from 'platejs';
import { ReactEditor } from 'slate-react';

import type { MeasureFn } from '../measure/measure';

function resolveLineHeight(style: CSSStyleDeclaration): number {
  const lh = Number.parseFloat(style.lineHeight);
  if (Number.isFinite(lh) && lh > 0) return lh;

  const fontSize = Number.parseFloat(style.fontSize);
  if (Number.isFinite(fontSize) && fontSize > 0) return fontSize * 1.5;

  return 20;
}

/**
 * Build a {@link MeasureFn} that reads block geometry from the editor DOM.
 * Measured `heightPx` includes the block's own vertical margins so stacked
 * heights match what the user sees.
 */
export function createDomMeasure(editor: SlateEditor): MeasureFn {
  return (block) => {
    try {
      const entry = editor.api.node(block.path);
      if (!entry) return null;

      const dom = ReactEditor.toDOMNode(
        editor as unknown as ReactEditor,
        entry[0]
      ) as HTMLElement | null;
      if (!dom) return null;

      const style = getComputedStyle(dom);
      const marginTop = Number.parseFloat(style.marginTop) || 0;
      const marginBottom = Number.parseFloat(style.marginBottom) || 0;

      return {
        heightPx: dom.offsetHeight + marginTop + marginBottom,
        lineHeightPx: resolveLineHeight(style),
      };
    } catch {
      return null;
    }
  };
}
