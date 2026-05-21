import { toPlatePlugin } from 'platejs/react';

import { BasePaginationPlugin } from './BasePaginationPlugin';
import { PageElement } from './PageElement';
import { PaginationAboveEditable } from './internal/PaginationAboveEditable';

/**
 * React pagination plugin. Mounts its own runtime so a consumer only needs to
 * register the plugin:
 *
 * - `node`: renders each `page` element via {@link PageElement}.
 * - `aboveEditable`: wraps the editable in the page registry provider and
 *   mounts the reflow coordinator inside it (see {@link PaginationAboveEditable}),
 *   so `PageElement`s and the coordinator share one registry.
 *
 * For Yjs-backed collaboration, mount `YjsPaginationBridge` (from
 * `@platejs/pagination/yjs`) instead of relying on the built-in coordinator, to
 * avoid running two coordinators against the same editor.
 */
export const PaginationPlugin = toPlatePlugin(BasePaginationPlugin, {
  render: {
    node: PageElement,
    aboveEditable: PaginationAboveEditable,
  },
});
