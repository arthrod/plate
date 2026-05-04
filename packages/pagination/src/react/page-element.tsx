import React from 'react';

/**
 * Per-page slot rendered inside a `SectionElement`. Variant B fills these by
 * partitioning the section's body children at each `page_break` boundary.
 *
 * Not a Slate element — this is a pure presentational div used by the
 * `SectionElement` once the auto-paginator wires up.
 */
export function PageElement({
  children,
  pageNumber,
  ref,
}: {
  children: React.ReactNode;
  pageNumber?: number;
  ref?: React.Ref<HTMLDivElement>;
}) {
  return (
    <div ref={ref} className="page" data-page-number={pageNumber}>
      {children}
    </div>
  );
}
