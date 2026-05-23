// ============================================================
// pagination/react/PaginationPlugin.tsx
//
// React lift of BasePaginationPlugin. Runs the pure pipeline
// (snapshot → pretext measure → compose) against the live editable on content
// changes, stores the layout in the per-editor registry, and (continuous view)
// paints thin advisory break-lines at each page boundary. The document model is
// never mutated — pages are a derived overlay.
//
// ⚠️ SCAFFOLD — NOT dev-browser verified yet. Overlay DOM positioning
// (contentTop/left/width) and the recompute cadence are the things to verify and
// iterate in dev-browser before this is wired into a demo / shipped.
// ============================================================

import React, { useEffect } from 'react';
import {
  type EditableSiblingComponent,
  toPlatePlugin,
  useEditorRef,
  usePluginOption,
} from 'platejs/react';

import { composeLayout } from '../layout/compose';
import { getContinuousBreakYs } from '../layout/continuous';
import { buildSnapshot } from '../layout/snapshot';
import { measureSnapshot } from '../measure/measure';
import { BasePaginationPlugin } from '../lib/BasePaginationPlugin';
import { getLayoutRegistry } from '../lib/registry';
import { createDomMeasure } from './domMeasure';

/**
 * Continuous-view overlay: a thin dashed advisory rule + "Page N" tick at each
 * page boundary. `pointer-events: none`, so editing/selection stay fully native.
 * Positioned relative to the editable's content top.
 */
const PaginationBreakLines: EditableSiblingComponent = () => {
  const editor = useEditorRef();
  const breakYs = usePluginOption(PaginationPlugin, 'breakYs');

  const editable = editor.api.toDOMNode(editor);
  if (!editable || breakYs.length === 0) return null;

  const style = getComputedStyle(editable);
  const contentTop =
    editable.offsetTop + (Number.parseFloat(style.paddingTop) || 0);
  const left =
    editable.offsetLeft + (Number.parseFloat(style.paddingLeft) || 0);
  const width = editable.clientWidth;

  return (
    <div data-slot="pagination-break-lines" style={{ pointerEvents: 'none' }}>
      {breakYs.map((y, i) => (
        <div
          data-slot="pagination-break-line"
          key={i}
          style={{
            borderTop: '1px dashed rgb(148 163 184 / 60%)',
            left,
            position: 'absolute',
            top: contentTop + y,
            width,
          }}
        >
          <span
            style={{
              background: 'rgb(148 163 184 / 15%)',
              color: 'rgb(100 116 139)',
              fontSize: 10,
              padding: '0 4px',
              position: 'absolute',
              right: 0,
              top: -14,
            }}
          >
            {`Page ${i + 2}`}
          </span>
        </div>
      ))}
    </div>
  );
};

export const PaginationPlugin = toPlatePlugin(BasePaginationPlugin, {
  options: { breakYs: [] as number[] },
  render: { afterEditable: PaginationBreakLines },
}).extend(({ editor, setOption }) => ({
  useHooks: () => {
    // Recompute after paint when the layout registry is dirty (content edits via
    // the base plugin's apply override). Selection-only changes leave it clean.
    // setOption('breakYs', …) re-renders the overlay via usePluginOption.
    useEffect(() => {
      const registry = getLayoutRegistry(editor);
      if (!registry.dirty && registry.output) return;

      const raf = requestAnimationFrame(() => {
        const editable = editor.api.toDOMNode(editor);
        if (!editable) return;

        const { atomicTypes, keepWithNextTypes, margins, page, policies } =
          editor.getOptions(BasePaginationPlugin);
        const widthPx = page.widthPx - margins.leftPx - margins.rightPx;

        const snapshot = buildSnapshot(editor.children, {
          atomicTypes,
          keepWithNextTypes,
        });
        const measured = measureSnapshot(snapshot, createDomMeasure(editable), {
          cache: registry.measureCache,
          widthPx,
        });
        const layout = composeLayout(measured, { margins, page, policies });

        registry.output = layout;
        registry.dirty = false;
        setOption('breakYs', getContinuousBreakYs(layout));
      });

      return () => cancelAnimationFrame(raf);
    });
  },
}));
