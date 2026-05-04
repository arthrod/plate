import React from 'react';

import { type PlateElementProps, PlateElement } from 'platejs/react';

/**
 * Minimal `<section>` element. Variant B will render header/body/footer via
 * pretext-driven page slots; this scaffold just forwards children so editors
 * can mount the plugin without rendering errors.
 *
 * TODO(#358): variant B — split `children` into per-page `<div class="page">`
 * slots driven by the auto-paginator's break placements.
 */
export function SectionElement(props: PlateElementProps) {
  return <PlateElement className="section" {...props} />;
}
