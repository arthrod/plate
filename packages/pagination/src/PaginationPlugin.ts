import { toPlatePlugin } from 'platejs/react';

import { BasePaginationPlugin } from './BasePaginationPlugin';
import { PageElement } from './PageElement';

export const PaginationPlugin = toPlatePlugin(BasePaginationPlugin, {
  render: {
    node: PageElement,
  },
});
