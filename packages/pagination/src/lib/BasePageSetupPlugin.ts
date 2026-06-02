// ============================================================
// pagination/lib/BasePageSetupPlugin.ts
//
// Slate-first base plugin owning the void `page_setup` metadata node. Registers
// the node as a void element and normalizes the invariant the rest of the
// pagination layer relies on: AT MOST ONE page_setup node, ALWAYS at index 0.
// Content semantics live here; the React render wrapper (invisible in flow) and
// the option-resolution sync are layered on top.
// ============================================================

import { createSlatePlugin, ElementApi } from 'platejs';

import { PAGE_SETUP_KEY } from './pageSetup';

export const BasePageSetupPlugin = createSlatePlugin({
  key: PAGE_SETUP_KEY,
  node: { isElement: true, isVoid: true },
}).overrideEditor(({ editor, tf: { normalizeNode }, type }) => ({
  transforms: {
    normalizeNode([node, path]) {
      // Only top-level page_setup nodes are subject to the singleton rule.
      if (
        ElementApi.isElement(node) &&
        node.type === type &&
        path.length === 1 &&
        path[0] > 0
      ) {
        const leadingIsSetup =
          (editor.children[0] as { type?: string } | undefined)?.type === type;

        if (leadingIsSetup) {
          // A second page_setup node — drop it; the leading one wins.
          editor.tf.removeNodes({ at: path });
        } else {
          // The only page_setup node, but not at the top — promote it.
          editor.tf.moveNodes({ at: path, to: [0] });
        }

        return;
      }

      return normalizeNode([node, path]);
    },
  },
}));
