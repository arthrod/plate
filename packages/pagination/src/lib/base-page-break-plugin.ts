import { createSlatePlugin, KEYS } from 'platejs';

/**
 * Block-level void element marking a page boundary inside a section's body.
 *
 * The element carries a `manual: boolean` flag (CR Design Choice 3 on issue
 * #354): `true` for user-inserted breaks (preserved through normalization),
 * `false` for breaks owned by the auto-paginator (added/removed each pass).
 */
export const BasePageBreakPlugin = createSlatePlugin({
  key: KEYS.pageBreak,
  node: {
    isElement: true,
    isVoid: true,
  },
});
