import { toPlatePlugin } from 'platejs/react';

import { BasePaginationPlugin } from './BasePaginationPlugin';
import { PageElement } from './PageElement';
import { PaginationAfterEditable } from './internal/PaginationAfterEditable';
import { PaginationRegistryProvider } from './registry';

/**
 * React pagination plugin. Mounts its own runtime so a consumer only needs to
 * register the plugin:
 *
 * - `node`: renders each `page` element via {@link PageElement}.
 * - `aboveEditable`: wraps the editable in {@link PaginationRegistryProvider} so
 *   `PageElement` can register its DOM with the reflow registry.
 * - `afterEditable`: mounts the reflow coordinator via {@link PaginationAfterEditable}.
 *
 * For Yjs-backed collaboration, mount `YjsPaginationBridge` (from
 * `@platejs/pagination/yjs`) instead of relying on the built-in coordinator, to
 * avoid running two coordinators against the same editor.
 */
export const PaginationPlugin = toPlatePlugin(BasePaginationPlugin, {
  render: {
    node: PageElement,
    aboveEditable: PaginationRegistryProvider,
    afterEditable: PaginationAfterEditable,
  },
});
