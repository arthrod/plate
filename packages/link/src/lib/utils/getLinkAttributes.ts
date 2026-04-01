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

  // Security enhancement: Add rel="noopener noreferrer" for external links opening in new tabs
  // to prevent reverse tabnabbing attacks.
  if (attributes.target === '_blank') {
    const currentRel = attributes.rel as string | undefined;
    const rels = currentRel ? currentRel.split(' ') : [];

    if (!rels.includes('noopener')) rels.push('noopener');
    if (!rels.includes('noreferrer')) rels.push('noreferrer');

    attributes.rel = rels.join(' ');
  }

  return attributes as Pick<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    'href' | 'target' | 'rel'
  > &
    UnknownObject;
};
