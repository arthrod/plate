import { toPlatePlugin } from 'platejs/react';

import { BaseSectionPlugin } from '../lib/base-section-plugin';
import { SectionElement } from './section-element';

export const SectionPlugin =
  toPlatePlugin(BaseSectionPlugin).withComponent(SectionElement);
