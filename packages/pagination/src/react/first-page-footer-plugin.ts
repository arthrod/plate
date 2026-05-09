import { toPlatePlugin } from 'platejs/react';

import { BaseFirstPageFooterPlugin } from '../lib/base-first-page-footer-plugin';
import { FirstPageFooterChrome } from './chrome-shell';

/** React plugin for first-page footer with `ChromeShell` affordances. */
export const FirstPageFooterPlugin = toPlatePlugin(BaseFirstPageFooterPlugin, {
  node: { component: FirstPageFooterChrome },
});
