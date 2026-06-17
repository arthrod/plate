import { createSlatePlugin, KEYS } from 'platejs';

/** Section header — one allowed per `section`, always the first child. */
export const BaseHeaderPlugin = createSlatePlugin({
  key: KEYS.header,
  node: {
    isContainer: true,
    isElement: true,
  },
});
