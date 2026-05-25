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

import React, { useEffect, useLayoutEffect, useState } from 'react';
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

// Layout effect on the client (run before paint so lines appear with content),
// plain effect on the server (useLayoutEffect is a no-op + warns during SSR).
const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect;

/** Shared "Page N of M" chip, in the LEFT margin gutter (left of the content). */
const labelStyle: React.CSSProperties = {
  background: 'rgb(241 245 249)',
  border: '1px solid rgb(203 213 225)',
  borderRadius: 4,
  color: 'rgb(71 85 105)',
  fontSize: 10,
  lineHeight: '14px',
  marginRight: 8,
  padding: '0 5px',
  position: 'absolute',
  // Right edge pinned to the content's left edge → the chip sits in the left
  // margin. The left gutter stays on-screen when a narrow viewport overflows the
  // page width (unlike the right gutter, which scrolls off).
  right: '100%',
  top: -7,
  whiteSpace: 'nowrap',
};

/**
 * Continuous-view overlay: a thin dashed advisory rule at each page boundary,
 * plus a "Page N of M" chip in the left margin (including a "Page 1 of M" marker
 * at the top so the first page and the total are always shown). `pointer-events:
 * none`, so editing/selection stay fully native. Each rule is anchored to the
 * live DOM top of the block pretext chose to begin the next page. Renders nothing
 * for a single-page document.
 */
const PaginationBreakLines: EditableSiblingComponent = () => {
  const editor = useEditorRef();
  const enabled = usePluginOption(PaginationPlugin, 'enabled');
  const breaks = usePluginOption(PaginationPlugin, 'breaks');

  const editable = editor.api.toDOMNode(editor);
  if (!enabled || !editable || breaks.length === 0) return null;

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
  const total = breaks.length + 1;
  const topOf = (el: HTMLElement) =>
    editable.offsetTop + (el.getBoundingClientRect().top - editableTop);

  return (
    <div data-slot="pagination-break-lines" style={{ pointerEvents: 'none' }}>
      {blocks[0] && (
        <div
          data-slot="pagination-page-marker"
          style={{ left, position: 'absolute', top: topOf(blocks[0]), width }}
        >
          <span data-slot="pagination-break-label" style={labelStyle}>
            {`Page 1 of ${total}`}
          </span>
        </div>
      )}
      {breaks.map((brk, i) => {
        const el = blocks[brk.blockIndex];
        if (!el) return null;

        // lineStart > 0 (future line-split mode) offsets within the block by the
        // pretext line count; 0 is a clean whole-block top.
        const lineHeight =
          Number.parseFloat(getComputedStyle(el).lineHeight) || 0;
        const top = topOf(el) + brk.lineStart * lineHeight;

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
            <span data-slot="pagination-break-label" style={labelStyle}>
              {`Page ${i + 2} of ${total}`}
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
    const enabled = usePluginOption(PaginationPlugin, 'enabled');

    // Recompute when the layout registry is dirty (content edits via the base
    // plugin's apply override; selection-only changes leave it clean). Runs in a
    // layout effect — after the DOM commits, before paint — so the advisory lines
    // paint together with the content the moment the editor hydrates, rather than
    // an extra frame later. setOption re-renders the overlay via usePluginOption.
    // (The residual delay on first load is the editor's hydration time: the SSR
    // content is on screen before the client can measure the DOM to place lines.)
    // Skipped entirely while disabled; toggling `enabled` re-renders here (the
    // subscribed option above), so re-enabling recomputes from the dirty registry.
    useIsomorphicLayoutEffect(() => {
      if (!enabled) return;

      const registry = getLayoutRegistry(editor);
      if (!registry.dirty && registry.output) return;

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

    // A width change re-wraps text and changes pagination. Invalidate the layout
    // and force a re-render so the dirty-recompute effect re-measures at the new
    // width and the overlay re-anchors to the new block tops. Skip entirely while
    // disabled — no point observing when the overlay isn't rendered.
    useEffect(() => {
      if (!enabled) return;

      const editable = editor.api.toDOMNode(editor);
      if (!editable || typeof ResizeObserver === 'undefined') return;

      const observer = new ResizeObserver(() => {
        invalidateLayoutRegistry(editor);
        forceRecompute((n) => n + 1);
      });
      observer.observe(editable);

      return () => observer.disconnect();
    }, [editor, enabled]);
  },
});
