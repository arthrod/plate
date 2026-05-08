import * as React from 'react';

import { usePluginOption } from 'platejs/react';

import { BasePaginationPlugin } from '../lib/base-pagination-plugin';

/**
 * `render.beforeEditable` slot — intentionally empty.
 *
 * Standard mode (`mode === 'standard'`) shows NO chrome anywhere: the editor
 * is presented as a continuous flow with no header band, no footer band, no
 * footnote well — exactly as if pagination were disabled.
 *
 * Paged mode (`mode === 'paged'`) renders all chrome inside per-page
 * `PageFrame` components painted by the `afterEditable` slot, so this slot
 * stays empty in both modes. Kept exported so the plugin's render contract
 * can grow without breaking imports.
 */
export const StandardHeaderRail = (): null => {
  // Read the option so the component re-runs on mode change for predictable
  // suspension boundaries; rendering null is intentional.
  void usePluginOption(BasePaginationPlugin, 'mode');

  return null;
};

/**
 * `render.afterEditable` slot — also empty when the plugin uses its own
 * paged view via `PageOverlay`.
 *
 * The playground / consumer composition is expected to register
 * `PageOverlay` directly on `afterEditable` when it wants the paged view.
 * The plugin keeps this slot empty by default to avoid double-rendering
 * chrome when a host overrides the slot.
 */
export const StandardFooterAndPanel = (): null => {
  void usePluginOption(BasePaginationPlugin, 'mode');

  return null;
};
