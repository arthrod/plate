'use client';

// ============================================================
// pagination/react/PageSetupPlugin.tsx
//
// React lift of BasePageSetupPlugin: registers the invisible PageSetupElement
// for the void `page_setup` node. Add this plugin alongside PaginationPlugin so
// documents can carry page setup in their value. The node renders nothing; the
// settings modal reads/writes it via getPageSetup/setPageSetup.
// ============================================================

import { toPlatePlugin } from 'platejs/react';

import { BasePageSetupPlugin } from '../lib/BasePageSetupPlugin';
import { PageSetupElement } from './PageSetupElement';

export const PageSetupPlugin =
  toPlatePlugin(BasePageSetupPlugin).withComponent(PageSetupElement);
