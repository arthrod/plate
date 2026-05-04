import {
  FootnoteDefinitionPlugin,
  FootnoteInputPlugin,
  FootnoteReferencePlugin,
} from '@platejs/footnote/react';
import { toTPlatePlugin } from 'platejs/react';

import { BasePaginationPlugin } from '../lib/base-pagination-plugin';
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
 * TODO: variant B — wire `configurePlugin(FootnoteDefinitionPlugin, ...)` once
 * the section-scoping selector lands. Bundling the plugin here is enough to
 * give consumers a single import.
 */
export const PaginationPlugin = toTPlatePlugin(BasePaginationPlugin, {
  plugins: [
    SectionPlugin,
    HeaderPlugin,
    FooterPlugin,
    PageBreakPlugin,
    FootnoteDefinitionPlugin,
    FootnoteReferencePlugin,
    FootnoteInputPlugin,
  ],
});
