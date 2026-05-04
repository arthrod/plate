import * as React from 'react';

import type { TElement } from 'platejs';

export const FooterElement = React.forwardRef<
  HTMLDivElement,
  {
    attributes: React.HTMLAttributes<HTMLDivElement>;
    children: React.ReactNode;
    element: TElement;
  }
>(({ attributes, children }, ref) => (
  <div ref={ref} {...attributes} className="section-footer">
    {children}
  </div>
));

FooterElement.displayName = 'FooterElement';
