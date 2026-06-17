import { createSlatePlugin, KEYS } from 'platejs';

/**
 * Section footer — one allowed per `section`, always the last child. Hosts
 * footnote definitions whose references live in this section's body, scoped
 * via `configurePlugin` on the React wrapper.
 */
export const BaseFooterPlugin = createSlatePlugin({
  key: KEYS.footer,
  node: {
    isContainer: true,
    isElement: true,
  },
});
