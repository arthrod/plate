import * as React from 'react';

import type { TElement } from 'platejs';

/**
 * Minimal `<section>` element. Variant B will render header/body/footer via
 * pretext-driven page slots; this scaffold just forwards children so editors
 * can mount the plugin without rendering errors.
 *
 * TODO: variant B — split `children` into per-page `<div class="page">` slots
 * driven by the auto-paginator's break placements.
 */
export const SectionElement = React.forwardRef<
  HTMLDivElement,
  {
    attributes: React.HTMLAttributes<HTMLDivElement>;
    children: React.ReactNode;
    element: TElement;
  }
>(({ attributes, children }, ref) => (
  <div ref={ref} {...attributes} className="section">
    {children}
  </div>
));

SectionElement.displayName = 'SectionElement';
