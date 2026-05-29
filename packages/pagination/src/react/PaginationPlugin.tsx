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

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
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
  const chrome = usePluginOption(PaginationPlugin, 'chrome');
  const page = usePluginOption(PaginationPlugin, 'page');
  const margins = usePluginOption(PaginationPlugin, 'margins');

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

  // Per-page anchor blocks. Page 1 starts at blocks[0]; subsequent pages start
  // at the block named by each break in order. `pageStartBlock[i]` is the
  // first top-level block of page i (0-indexed).
  const pageStartBlock: Array<HTMLElement | undefined> = [blocks[0]];
  for (const brk of breaks) pageStartBlock.push(blocks[brk.blockIndex]);

  /**
   * Map a page index + chrome.y (page-local) to a document-Y inside the
   * editable's positioned-ancestor space. In continuous view we use the page's
   * START BLOCK as the y=margins.topPx anchor, then offset by (chromeRect.y -
   * margins.topPx). For header (y = margins.topPx) the offset is 0 → chrome
   * sits exactly at the start block's top. For footer (y = page.heightPx -
   * margins.bottomPx - heightPx) the offset is negative relative to the start
   * block of the NEXT page (or end of document for the last page); we compute
   * it by anchoring to the NEXT page's start block and subtracting the chrome
   * band height + bottom margin.
   */
  const headerY = (i: number): number | null => {
    const startBlock = pageStartBlock[i];
    if (!startBlock) return null;
    return topOf(startBlock);
  };
  const footerY = (i: number): number | null => {
    const nextStart = pageStartBlock[i + 1];
    if (nextStart) {
      // Footer sits just ABOVE the next page's break, by chrome.footer.heightPx.
      return topOf(nextStart) - (chrome?.footer?.heightPx ?? 0);
    }
    // Last page: anchor at the end of the last block.
    const lastBlock = blocks[blocks.length - 1];
    if (!lastBlock) return null;
    const r = lastBlock.getBoundingClientRect();
    const bottom =
      editable.offsetTop + (r.bottom - editableTop);
    return bottom - (chrome?.footer?.heightPx ?? 0);
  };

  const renderHeader =
    chrome?.header && typeof chrome.header.render === 'function'
      ? chrome.header.render
      : null;
  const renderFooter =
    chrome?.footer && typeof chrome.footer.render === 'function'
      ? chrome.footer.render
      : null;

  // Backwards-compatible "Page N of M" left-margin chips. When chrome is NOT
  // configured, render the original chips. When chrome IS configured, the
  // chrome bands take over the page-number role and the chips stay hidden.
  const showLegacyChips = !chrome?.header && !chrome?.footer;

  // Iterate pages once and emit:
  //   - the dashed break-line at each interior boundary (existing behavior)
  //   - the configured chrome header / footer per page (NEW)
  //   - the legacy chip per page (only when chrome is absent)
  const pages: React.ReactNode[] = [];
  for (let i = 0; i < total; i++) {
    const headerTop = headerY(i);
    const footerTop = footerY(i);

    if (renderHeader && headerTop !== null && chrome?.header) {
      pages.push(
        <div
          data-slot="pagination-chrome"
          data-pagination-chrome="header"
          data-page-index={i}
          key={`chrome-header-${i}`}
          style={{
            height: chrome.header.heightPx,
            left,
            position: 'absolute',
            top: headerTop,
            width,
          }}
        >
          {renderHeader({
            margins,
            page,
            pageCount: total,
            pageIndex: i,
          }) as React.ReactNode}
        </div>
      );
    }
    if (renderFooter && footerTop !== null && chrome?.footer) {
      pages.push(
        <div
          data-slot="pagination-chrome"
          data-pagination-chrome="footer"
          data-page-index={i}
          key={`chrome-footer-${i}`}
          style={{
            height: chrome.footer.heightPx,
            left,
            position: 'absolute',
            top: footerTop,
            width,
          }}
        >
          {renderFooter({
            margins,
            page,
            pageCount: total,
            pageIndex: i,
          }) as React.ReactNode}
        </div>
      );
    }
    if (showLegacyChips && headerTop !== null) {
      // Legacy chip: left-margin "Page N of M" at the top of each page's first
      // block. Preserved verbatim for backward compat.
      pages.push(
        <div
          data-slot="pagination-page-marker"
          data-page-index={i}
          key={`legacy-chip-${i}`}
          style={{ left, position: 'absolute', top: headerTop, width }}
        >
          <span data-slot="pagination-break-label" style={labelStyle}>
            {`Page ${i + 1} of ${total}`}
          </span>
        </div>
      );
    }
  }

  return (
    <div data-slot="pagination-break-lines" style={{ pointerEvents: 'none' }}>
      {pages}
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
            key={`brk-${brk.blockIndex}:${brk.lineStart}`}
            style={{
              borderTop: '1px dashed rgb(100 116 139)',
              left,
              position: 'absolute',
              top,
              width,
            }}
          />
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
    // Re-enable invalidation: cache the previous `enabled` so a `false → true`
    // transition can force the next layout pass to recompute. Without this,
    // toggling off → on while the document is unchanged keeps `registry.dirty`
    // false AND `registry.output` populated, and the effect below exits early —
    // the user sees stale page breaks despite re-enabling. CodeRabbit #434.
    const prevEnabledRef = useRef(enabled);

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
      if (!enabled) {
        prevEnabledRef.current = false;
        return;
      }

      const registry = getLayoutRegistry(editor);
      // `false → true` transition: force a recompute even if the registry
      // thinks it's clean. The cached output reflects the pre-toggle DOM and
      // may now be stale (e.g. the user resized while disabled).
      if (!prevEnabledRef.current) {
        registry.dirty = true;
      }
      prevEnabledRef.current = true;

      if (!registry.dirty && registry.output) return;

      const editable = editor.api.toDOMNode(editor);
      if (!editable) return;

      const { atomicTypes, chrome, keepWithNextTypes, margins, page, policies } =
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
      // Pass chrome heights through to the composer so it can shrink the content
      // frame and emit the per-page chrome rects the overlay anchors to. The
      // `render` functions live on the plugin options and stay out of the pure
      // layout pipeline.
      const layout = composeLayout(measured, {
        margins,
        page,
        policies,
        ...(chrome
          ? {
              chrome: {
                ...(chrome.header
                  ? { header: { heightPx: chrome.header.heightPx } }
                  : {}),
                ...(chrome.footer
                  ? { footer: { heightPx: chrome.footer.heightPx } }
                  : {}),
              },
            }
          : {}),
      });

      registry.output = layout;
      registry.dirty = false;
      setOption('breaks', getContinuousBreaks(layout));
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
