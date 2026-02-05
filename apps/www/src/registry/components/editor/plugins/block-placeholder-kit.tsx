'use client';

import { KEYS } from 'platejs';
import { BlockPlaceholderPlugin } from 'platejs/react';

export const BlockPlaceholderKit = [
  BlockPlaceholderPlugin.configure({
    options: {
      className:
        'before:absolute before:cursor-text before:text-muted-foreground/80 before:content-[attr(placeholder)]',
      placeholders: {
        [KEYS.p]: 'Type something...',
      },
      query: ({ editor, path }) => {
        const pageType = editor.getType?.('pagination');
        const hasPages = Boolean(
          pageType &&
            Array.isArray(editor.children) &&
            editor.children.some((node) => node?.type === pageType)
        );
        const depthOffset = hasPages ? 1 : 0;
        return path.length === 1 + depthOffset;
      },
    },
  }),
];
