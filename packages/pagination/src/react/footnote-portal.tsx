import type { TElement } from 'platejs';

export type FootnotePortalProps = {
  /** Definitions that should appear inside `target` for the current page. */
  definitions: TElement[];
  /** The per-page footer-well DOM node receiving the portalled definitions. */
  target: HTMLElement | null;
};

/**
 * Hide footnote definitions in the document flow and re-mount them inside
 * the page's footer well.
 *
 * Variant A — CodeRabbit Design Choice 2: definitions stay in the Slate
 * tree (so editing/selection/keyboard nav are unaffected) but render with
 * `visibility: hidden` in flow, and a React portal mirrors them into the
 * footer well so they appear in print position.
 */
export const FootnotePortal = (_props: FootnotePortalProps): null => {
  // TODO: variant A — `createPortal(<DefinitionList nodes={definitions} />, target)`
  // and emit a `<style>` rule that hides the in-flow nodes via
  // `[data-pagination-hidden=true] { visibility: hidden; pointer-events: none; }`.
  return null;
};
