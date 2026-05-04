/**
 * Render-overlay shell mounted via `render.afterEditable`.
 *
 * Variant A — CodeRabbit Design Choice 1: pages are derived at render time
 * and painted as an overlay on top of the live editor. This component owns
 * the per-page frames and the absolute positioning math; nothing touches
 * Slate state.
 */
export const PageOverlay = (): null => {
  // TODO: variant A — derive pages from editor.children via
  // `useMemo(() => paginate(doc, ctx, measurer))`, then render one
  // `PageFrame` per page positioned over the editor's content rects.
  return null;
};
