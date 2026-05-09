import { toPlatePlugin } from 'platejs/react';

import { BaseHeaderPlugin } from '../lib/base-header-plugin';
import { HeaderChrome } from './chrome-shell';

/**
 * React header plugin — wraps the chrome node with `ChromeShell` so the
 * editor surfaces a labelled focus state when the user clicks into it.
 */
export const HeaderPlugin = toPlatePlugin(BaseHeaderPlugin, {
  node: { component: HeaderChrome },
});
