// ============================================================
// pagination/react/PaginationPlugin.tsx
//
// React lift of BasePaginationPlugin. Runs the pure pipeline
// (snapshot → pretext measure → compose) against the live editable on content
// changes, stores the layout in the per-editor registry, and (continuous view)
// paints thin advisory break-lines at each page boundary. The document model is
// never mutated — pages are a derived overlay.
//
// pretext owns the break decision (which block begins each page). The overlay
// anchors each advisory rule to that boundary block's live DOM top, so the line
// always lands on a real block edge — never mid-paragraph — regardless of the
// margins the DOM flow adds between blocks.
// ============================================================

import React, { useEffect, useState } from 'react';
import {
  type EditableSiblingComponent,
  toPlatePlugin,
  useEditorRef,
  usePluginOption,
} from 'platejs/react';

import { composeLayout } from '../layout/compose';
import {
  type ContinuousBreak,
  getContinuousBreaks,
} from '../layout/continuous';
import { buildSnapshot } from '../layout/snapshot';
import { measureSnapshot } from '../measure/measure';
import { BasePaginationPlugin } from '../lib/BasePaginationPlugin';
import { getLayoutRegistry, invalidateLayoutRegistry } from '../lib/registry';
import { createDomMeasure, topLevelBlockElements } from './domMeasure';

/**
 * Continuous-view overlay: a thin dashed advisory rule + "Page N" tick at each
 * page boundary. `pointer-events: none`, so editing/selection stay fully native.
 * Each rule is anchored to the live DOM top of the block pretext chose to begin
 * the next page; the label sits in the right margin gutter, clear of body text.
 */
const PaginationBreakLines: EditableSiblingComponent = () => {
  const editor = useEditorRef();
  const breaks = usePluginOption(PaginationPlugin, 'breaks');

  const editable = editor.api.toDOMNode(editor);
  if (!editable || breaks.length === 0) return null;

  const style = getComputedStyle(editable);
  const padLeft = Number.parseFloat(style.paddingLeft) || 0;
  const padRight = Number.parseFloat(style.paddingRight) || 0;
  const left = editable.offsetLeft + padLeft;
  const width = Math.max(0, editable.clientWidth - padLeft - padRight);

  // The overlay shares the editable's positioned-ancestor coordinate space, so a
  // block's top there is `editable.offsetTop + (blockTop − editableTop)`. Using
  // rects (not the offsetParent chain) keeps this correct through any wrappers
  // Plate renders between the editable and its blocks.
  const editableTop = editable.getBoundingClientRect().top;
  const blocks = topLevelBlockElements(editable);

  return (
    <div data-slot="pagination-break-lines" style={{ pointerEvents: 'none' }}>
      {breaks.map((brk, i) => {
        const el = blocks[brk.blockIndex];
        if (!el) return null;

        // lineStart > 0 (future line-split mode) offsets within the block by the
        // pretext line count; 0 is a clean whole-block top.
        const lineHeight =
          Number.parseFloat(getComputedStyle(el).lineHeight) || 0;
        const top =
          editable.offsetTop +
          (el.getBoundingClientRect().top - editableTop) +
          brk.lineStart * lineHeight;

        return (
          <div
            data-slot="pagination-break-line"
            key={`${brk.blockIndex}:${brk.lineStart}`}
            style={{
              borderTop: '1px dashed rgb(100 116 139)',
              left,
              position: 'absolute',
              top,
              width,
            }}
          >
            <span
              data-slot="pagination-break-label"
              style={{
                background: 'rgb(241 245 249)',
                border: '1px solid rgb(203 213 225)',
                borderRadius: 4,
                color: 'rgb(71 85 105)',
                fontSize: 10,
                left: '100%',
                lineHeight: '14px',
                marginLeft: 8,
                padding: '0 5px',
                position: 'absolute',
                top: -7,
                whiteSpace: 'nowrap',
              }}
            >
              {`Page ${i + 2}`}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export const PaginationPlugin = toPlatePlugin(BasePaginationPlugin, {
  options: { breaks: [] as ContinuousBreak[] },
  render: { afterEditable: PaginationBreakLines },
  useHooks: ({ editor, setOption }) => {
    const [, forceRecompute] = useState(0);

    // Recompute after paint when the layout registry is dirty (content edits via
    // the base plugin's apply override). Selection-only changes leave it clean.
    // setOption('breaks', …) re-renders the overlay via usePluginOption.
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
        setOption('breaks', getContinuousBreaks(layout));
      });

      return () => cancelAnimationFrame(raf);
    });

    // A width change re-wraps text and changes pagination. Invalidate the layout
    // and force a re-render so the dirty-recompute effect re-measures at the new
    // width and the overlay re-anchors to the new block tops.
    useEffect(() => {
      const editable = editor.api.toDOMNode(editor);
      if (!editable || typeof ResizeObserver === 'undefined') return;

      const observer = new ResizeObserver(() => {
        invalidateLayoutRegistry(editor);
        forceRecompute((n) => n + 1);
      });
      observer.observe(editable);

      return () => observer.disconnect();
    }, [editor]);
  },
});
