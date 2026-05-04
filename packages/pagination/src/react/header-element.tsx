import React from 'react';

import { type PlateElementProps, PlateElement } from 'platejs/react';

export function HeaderElement(props: PlateElementProps) {
  return <PlateElement className="section-header" {...props} />;
}
