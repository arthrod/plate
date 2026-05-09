import { toPlatePlugin } from 'platejs/react';

import { BaseFooterPlugin } from '../lib/base-footer-plugin';
import { FooterChrome } from './chrome-shell';

/**
 * React footer plugin — wraps the chrome node with `ChromeShell` so the
 * editor surfaces a labelled focus state when the user clicks into it.
 */
export const FooterPlugin = toPlatePlugin(BaseFooterPlugin, {
  node: { component: FooterChrome },
});
