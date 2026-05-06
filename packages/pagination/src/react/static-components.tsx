import * as React from 'react';

import type { SlateElementProps, SlateLeafProps } from 'platejs/static';

import { SlateElement, SlateLeaf } from 'platejs/static';

/**
 * Static (SSR-safe) component map for the pagination overlay's mini-render.
 *
 * The overlay paints non-interactive thumbnails of each page, so the content
 * is rendered with `<PlateStatic>` rather than `<Plate>`. This map provides
 * faithful styling for the node types the preview is most likely to see —
 * paragraphs, headings, header/footer, basic marks. Unknown types fall
 * through to the default `SlateElement`/`SlateLeaf` renderer.
 *
 * Consumers can extend this map by composing with their own components
 * before passing it to `createSlateEditor`.
 */
export const HeaderElementStatic = (props: SlateElementProps) => (
  <SlateElement
    {...props}
    style={{
      borderBottom: '1px dashed rgba(15,23,42,0.1)',
      padding: '4px 0',
    }}
  >
    {props.children}
  </SlateElement>
);

export const FooterElementStatic = (props: SlateElementProps) => (
  <SlateElement
    {...props}
    style={{
      borderTop: '1px dashed rgba(15,23,42,0.1)',
      padding: '4px 0',
    }}
  >
    {props.children}
  </SlateElement>
);

export const ParagraphElementStatic = (props: SlateElementProps) => (
  <SlateElement
    {...props}
    style={{ fontSize: 14, lineHeight: 1.5, margin: '6px 0' }}
  >
    {props.children}
  </SlateElement>
);

const HEADING_SIZES = [0, 28, 22, 18, 16, 14, 13] as const;

export const makeHeadingStatic = (level: 1 | 2 | 3 | 4 | 5 | 6) =>
  function HeadingStatic(props: SlateElementProps) {
    return (
      <SlateElement
        {...props}
        style={{
          fontSize: HEADING_SIZES[level],
          fontWeight: 700,
          lineHeight: 1.25,
          margin: '10px 0 6px',
        }}
      >
        {props.children}
      </SlateElement>
    );
  };

export const BoldLeafStatic = (props: SlateLeafProps) => (
  <SlateLeaf {...props} as="strong">
    {props.children}
  </SlateLeaf>
);

export const ItalicLeafStatic = (props: SlateLeafProps) => (
  <SlateLeaf {...props} as="em">
    {props.children}
  </SlateLeaf>
);

export const paginationStaticComponents = {
  bold: BoldLeafStatic,
  footer: FooterElementStatic,
  h1: makeHeadingStatic(1),
  h2: makeHeadingStatic(2),
  h3: makeHeadingStatic(3),
  h4: makeHeadingStatic(4),
  h5: makeHeadingStatic(5),
  h6: makeHeadingStatic(6),
  header: HeaderElementStatic,
  italic: ItalicLeafStatic,
  p: ParagraphElementStatic,
};
