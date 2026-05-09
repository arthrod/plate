import { toPlatePlugin } from 'platejs/react';

import { BaseFirstPageHeaderPlugin } from '../lib/base-first-page-header-plugin';
import { FirstPageHeaderChrome } from './chrome-shell';

/** React plugin for first-page header with `ChromeShell` affordances. */
export const FirstPageHeaderPlugin = toPlatePlugin(BaseFirstPageHeaderPlugin, {
  node: { component: FirstPageHeaderChrome },
});
