import type { Page } from '../lib/types';

export type PageFrameProps = {
  page: Page;
};

/**
 * Single page chrome: header band, content rect outline, footnote well,
 * footer band.
 *
 * Variant A renders this purely as an overlay; it never wraps the live
 * editor children, so editing remains uninterrupted.
 */
export const PageFrame = (_props: PageFrameProps): null => {
  // TODO: variant A — paint header/footer slots from the document's header
  // and footer nodes; reserve `footnoteWell` height; outline `page.rect` in
  // print colors. No DOM under here is editable.
  return null;
};
