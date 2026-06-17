import * as React from 'react';

/**
 * Per-page slot rendered inside a `SectionElement`. Variant B fills these by
 * partitioning the section's body children at each `page_break` boundary.
 */
export const PageElement = React.forwardRef<
  HTMLDivElement,
  {
    children: React.ReactNode;
    pageNumber?: number;
  }
>(({ children, pageNumber }, ref) => (
  <div ref={ref} className="page" data-page-number={pageNumber}>
    {children}
  </div>
));

PageElement.displayName = 'PageElement';
