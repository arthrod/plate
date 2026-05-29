'use client';

import { createPlatePlugin } from 'platejs/react';

/**
 * Editor-level UI state shared between the fixed-toolbar buttons and the editor
 * container: whether the Page-setup dialog is open and whether margins mode is
 * active. Held as plugin options (the editor-native shared-state store) so the
 * toolbar button (rendered in a plugin's beforeEditable) and the container
 * (a `<Plate>` sibling) read/write the same source via usePluginOption/setOption.
 */
export const PageToolsPlugin = createPlatePlugin({
  key: 'page-tools',
  options: { marginsMode: false, pageSetupOpen: false },
});

export const PageToolsKit = [PageToolsPlugin];
