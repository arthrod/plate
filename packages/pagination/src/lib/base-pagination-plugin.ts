import { createTSlatePlugin } from 'platejs';

import type {
  BasePaginationApi,
  BasePaginationConfig,
  BasePaginationTransforms,
} from './types';

import { BaseFooterPlugin } from './base-footer-plugin';
import { BaseHeaderPlugin } from './base-header-plugin';
import { BasePageBreakPlugin } from './base-page-break-plugin';
import { PAGINATION_KEY } from './internal/keys';
import {
  getPageOfPath,
  getPaginationFootnotes,
  getPaginationPages,
  hasFooterBlock,
  hasHeaderBlock,
} from './queries';
import { PAGINATION_OPTION_DEFAULTS } from './resolve-options';
import {
  enforceHeaderFooterInvariants,
  insertPageBreak,
  replaceFooter,
  replaceHeader,
  toggleFooter,
  toggleHeader,
} from './transforms';

/**
 * Base orchestrator plugin for paginated layout.
 *
 * Variant A — render-time overlay; pages derived; pretext as height oracle.
 * The Slate document is unchanged; pagination is a render-only projection
 * layered onto the live editor via the Plate `render.afterEditable` slot.
 *
 * Header/footer presence is derived from `editor.children` (single source of
 * truth) — undo and paste survive correctly because we don't mirror the
 * presence to a plugin option that lives outside Slate history.
 *
 * The page-chrome element family (header, footer, page break) is composed
 * here on the Slate base so a Slate-only consumer registering
 * `BasePaginationPlugin` already gets the element schema. React-only deltas
 * (footnote sub-plugins, overlay rendering) live in `src/react`.
 */
export const BasePaginationPlugin = createTSlatePlugin<BasePaginationConfig>({
  key: PAGINATION_KEY,
  options: PAGINATION_OPTION_DEFAULTS,
  plugins: [BaseHeaderPlugin, BaseFooterPlugin, BasePageBreakPlugin],
})
  .overrideEditor(({ editor, tf: { normalizeNode } }) => ({
    transforms: {
      normalizeNode: (entry) => {
        const [, path] = entry;

        if (path.length === 0 && enforceHeaderFooterInvariants(editor)) {
          return;
        }

        normalizeNode(entry);
      },
    },
  }))
  .extendEditorApi<BasePaginationApi>(({ editor }) => ({
    pagination: {
      getFootnotes: (pageIndex) => getPaginationFootnotes(editor, pageIndex),
      getPageOf: (path) => getPageOfPath(editor, path),
      getPages: () => getPaginationPages(editor),
      hasFooter: () => hasFooterBlock(editor),
      hasHeader: () => hasHeaderBlock(editor),
    },
  }))
  .extendEditorTransforms<BasePaginationTransforms>(
    ({ editor, getOptions, setOption }) => ({
      pagination: {
        insertPageBreak: () => insertPageBreak(editor),
        setFootnotePlacement: (placement) => {
          setOption('footnotePlacement', placement);
          setOption(
            'footnoteWell',
            placement === 'footer' ? getOptions().footnoteWell || 96 : 0
          );
        },
        setFooter: (content) => replaceFooter(editor, content),
        setHeader: (content) => replaceHeader(editor, content),
        setMargins: (patch) => {
          setOption('margins', { ...getOptions().margins, ...patch });
        },
        setMode: (mode) => {
          setOption('mode', mode);
        },
        setPageBorder: (patch) => {
          setOption('pageBorder', { ...getOptions().pageBorder, ...patch });
        },
        setPageSize: (size) => {
          setOption('pageSize', size);
        },
        setPreviewWidth: (width) => {
          setOption('previewWidth', width);
        },
        toggleFooter: () => toggleFooter(editor),
        toggleHeader: () => toggleHeader(editor),
        togglePreview: () => {
          const next = !(getOptions().previewVisible ?? true);

          setOption('previewVisible', next);

          return next;
        },
      },
    })
  );

export type {
  BasePaginationApi,
  BasePaginationConfig,
  BasePaginationTransforms,
} from './types';
