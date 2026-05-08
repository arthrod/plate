import type React from 'react';

import {
  type SlateEditor,
  type TLinkElement,
  type UnknownObject,
  KEYS,
  sanitizeUrl,
} from 'platejs';

import type { BaseLinkConfig } from '../BaseLinkPlugin';

const REL_SPLIT_REGEX = /\s+/;

export const getLinkAttributes = (editor: SlateEditor, link: TLinkElement) => {
  const { allowedSchemes, dangerouslySkipSanitization, defaultLinkAttributes } =
    editor.getOptions<BaseLinkConfig>({ key: KEYS.link });

  const attributes = { ...defaultLinkAttributes };

  const href = dangerouslySkipSanitization
    ? link.url
    : sanitizeUrl(link.url, { allowedSchemes }) || undefined;

  // Avoid passing `undefined` for href or target
  if (href !== undefined) {
    attributes.href = href;
  }
  if ('target' in link && link.target !== undefined) {
    attributes.target = link.target;

    if (link.target === '_blank') {
      const rel = typeof attributes.rel === 'string' ? attributes.rel : '';
      const relList = rel.split(REL_SPLIT_REGEX).filter(Boolean);

      if (!relList.includes('noopener')) relList.push('noopener');
      if (!relList.includes('noreferrer')) relList.push('noreferrer');

      attributes.rel = relList.join(' ');
    }
  }

  return attributes as Pick<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    'href' | 'rel' | 'target'
  > &
    UnknownObject;
};
