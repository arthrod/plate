import { toPlatePlugin } from 'platejs/react';

import { BaseHeaderPlugin } from '../lib/base-header-plugin';
import { HeaderElement } from './header-element';

export const HeaderPlugin =
  toPlatePlugin(BaseHeaderPlugin).withComponent(HeaderElement);
