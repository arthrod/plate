import {
  FootnoteDefinitionPlugin,
  FootnoteInputPlugin,
  FootnoteReferencePlugin,
} from '@platejs/footnote/react';
import { toTPlatePlugin } from 'platejs/react';

import { BasePaginationPlugin } from '../lib/base-pagination-plugin';
import type { BasePaginationConfig } from '../lib/types';
import { FooterPlugin } from './footer-plugin';
import { HeaderPlugin } from './header-plugin';
import { PageBreakPlugin } from './page-break-plugin';
import { SectionPlugin } from './section-plugin';

/**
 * Variant B Plate-side pagination plugin.
 *
 * Bundles every node plugin owned by pagination, plus the footnote plugins
 * (CR Design Choice 2 on issue #354 — footnote definitions are scoped to the
 * section that owns their references via `configurePlugin`, no fork of
 * `@platejs/footnote`).
 *
 * The `configurePlugin` call is wired up against `FootnoteDefinitionPlugin`
 * with a no-op options merge so the section-scoping seam is real; the actual
 * scoping selector lands with the `withNormalizeNode` body. See TODO(#358) in
 * `with-pagination.ts`.
 */
export const PaginationPlugin = toTPlatePlugin<BasePaginationConfig>(
  BasePaginationPlugin,
  {
    plugins: [
      SectionPlugin,
      HeaderPlugin,
      FooterPlugin,
      PageBreakPlugin,
      FootnoteDefinitionPlugin,
      FootnoteReferencePlugin,
      FootnoteInputPlugin,
    ],
  }
).configurePlugin(FootnoteDefinitionPlugin, {
  // TODO(#358): replace with the real section-scoping options merge once the
  // auto-paginator's section walk lands.
  options: {},
});
