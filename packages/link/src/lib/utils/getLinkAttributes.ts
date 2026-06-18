import type React from 'react';

import {
  type SlateEditor,
  type TLinkElement,
  type UnknownObject,
  KEYS,
  sanitizeUrl,
} from 'platejs';

import type { BaseLinkConfig } from '../BaseLinkPlugin';

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
  }

  // Security enhancement: Prevent reverse tabnabbing for external links
  if (attributes.target === '_blank') {
    const existingRels =
      typeof attributes.rel === 'string' ? attributes.rel.split(' ') : [];
    if (!existingRels.includes('noopener')) existingRels.push('noopener');
    if (!existingRels.includes('noreferrer')) existingRels.push('noreferrer');
    attributes.rel = existingRels.join(' ').trim();
  }

  return attributes as Pick<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    'href' | 'rel' | 'target'
  > &
    UnknownObject;
};
