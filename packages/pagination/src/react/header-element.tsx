import * as React from 'react';

import type { TElement } from 'platejs';

export const HeaderElement = React.forwardRef<
  HTMLDivElement,
  {
    attributes: React.HTMLAttributes<HTMLDivElement>;
    children: React.ReactNode;
    element: TElement;
  }
>(({ attributes, children }, ref) => (
  <div ref={ref} {...attributes} className="section-header">
    {children}
  </div>
));

HeaderElement.displayName = 'HeaderElement';
