import { toPlatePlugin } from 'platejs/react';

import { BaseFooterPlugin } from '../lib/base-footer-plugin';
import { FooterElement } from './footer-element';

export const FooterPlugin =
  toPlatePlugin(BaseFooterPlugin).withComponent(FooterElement);
