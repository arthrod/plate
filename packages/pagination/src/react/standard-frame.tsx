import * as React from 'react';

import type { TElement } from 'platejs';

import { useEditorRef, useEditorValue, usePluginOption } from 'platejs/react';

import { BasePaginationPlugin } from '../lib/base-pagination-plugin';
import {
  FOOTER_KEY,
  FOOTNOTE_DEFINITION_KEY,
  HEADER_KEY,
} from '../lib/internal/keys';
import { PageOverlay } from './page-overlay';

const SHORT_DOC_THRESHOLD_PX = 0;

/**
 * Header chrome for `mode: 'standard'` — rendered via `render.beforeEditable`
 * so it sits above the live `<Editable />` without wrapping it.
 *
 * Returns `null` in paged mode (PageOverlay paints chrome inside each frame
 * instead).
 */
export const StandardHeaderRail = (): React.JSX.Element | null => {
  const editor = useEditorRef();
  const mode = usePluginOption(BasePaginationPlugin, 'mode');
  const margins = usePluginOption(BasePaginationPlugin, 'margins');
  const value = useEditorValue();

  if (mode !== 'standard') return null;

  const headerType = editor.getType(HEADER_KEY);
  const headerNode = (value as TElement[]).find((n) => n.type === headerType);
  if (!headerNode) return null;

  return (
    <ChromeBlock
      ariaLabel="Document header"
      padding={margins ?? FALLBACK_MARGINS}
      slot="header"
    >
      <ChromeReadout block={headerNode} />
    </ChromeBlock>
  );
};

/**
 * `render.afterEditable` slot — owns:
 * - end-of-doc footnote well (standard mode only),
 * - hybrid sticky/anchored footer chrome (standard mode only),
 * - the existing page-thumbnail side panel (paged mode only — delegates
 *   to `PageOverlay`).
 */
export const StandardFooterAndPanel = (): React.JSX.Element | null => {
  const editor = useEditorRef();
  const mode = usePluginOption(BasePaginationPlugin, 'mode');
  const margins = usePluginOption(BasePaginationPlugin, 'margins');
  const value = useEditorValue();

  const footerRef = React.useRef<HTMLDivElement | null>(null);
  const [isShort, setIsShort] = React.useState(true);

  React.useEffect(() => {
    if (mode !== 'standard') return;
    if (typeof window === 'undefined') return;

    const measure = (): void => {
      const viewportHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const footerHeight = footerRef.current?.offsetHeight ?? 0;

      // Doc + chrome shorter than viewport → pin footer.
      // Once content extends past viewport, footer detaches and lands at
      // end-of-content in normal flow.
      setIsShort(
        docHeight + footerHeight <= viewportHeight + SHORT_DOC_THRESHOLD_PX
      );
    };

    measure();

    const ro = new ResizeObserver(measure);
    if (footerRef.current) ro.observe(footerRef.current);

    window.addEventListener('resize', measure);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [mode]);

  if (mode === 'paged') {
    return <PageOverlay />;
  }

  const footerType = editor.getType(FOOTER_KEY);
  const footnoteDefinitionType = editor.getType(FOOTNOTE_DEFINITION_KEY);
  const footerNode = (value as TElement[]).find((n) => n.type === footerType);
  const footnoteDefinitions = (value as TElement[]).filter(
    (n) => n.type === footnoteDefinitionType
  );

  return (
    <>
      {footnoteDefinitions.length > 0 ? (
        <div
          data-plate-pagination-footnote-well=""
          style={{
            borderTop: '1px solid rgba(15,23,42,0.12)',
            marginTop: 24,
            padding: `12px ${margins?.right ?? 0}px 12px ${margins?.left ?? 0}px`,
          }}
        >
          {footnoteDefinitions.map((def, i) => (
            <ChromeReadout
              key={`fn-${i}`}
              block={def as TElement}
              numberPrefix={`${i + 1}. `}
            />
          ))}
        </div>
      ) : null}

      {footerNode ? (
        <ChromeBlock
          ref={footerRef}
          ariaLabel="Document footer"
          padding={margins ?? FALLBACK_MARGINS}
          slot="footer"
          style={
            isShort
              ? { bottom: 0, position: 'sticky', zIndex: 1 }
              : { position: 'static' }
          }
        >
          <ChromeReadout block={footerNode} />
        </ChromeBlock>
      ) : null}
    </>
  );
};

const FALLBACK_MARGINS = { bottom: 0, left: 0, right: 0, top: 0 };

const ChromeBlock = React.forwardRef<
  HTMLDivElement,
  {
    ariaLabel: string;
    children: React.ReactNode;
    padding: { bottom: number; left: number; right: number; top: number };
    slot: 'footer' | 'header';
    style?: React.CSSProperties;
  }
>(({ ariaLabel, children, padding, slot, style }, ref) => {
  const Tag = slot === 'header' ? 'header' : 'footer';

  return (
    <Tag
      ref={ref as React.Ref<HTMLElement>}
      aria-label={ariaLabel}
      data-plate-pagination-chrome={slot}
      style={{
        background: '#fff',
        borderBottom:
          slot === 'header' ? '1px solid rgba(15,23,42,0.06)' : undefined,
        borderTop:
          slot === 'footer' ? '1px solid rgba(15,23,42,0.06)' : undefined,
        boxSizing: 'border-box',
        paddingBottom: 8,
        paddingLeft: padding.left,
        paddingRight: padding.right,
        paddingTop: 8,
        ...style,
      }}
    >
      {children}
    </Tag>
  );
});

ChromeBlock.displayName = 'ChromeBlock';

/**
 * Read-only renderer for header/footer/footnote-def blocks inside the
 * standard-mode chrome. v1 ships this as a flat-text rendering. Phase 3 of
 * the plan adds a sub-editor pattern (`use-chrome-editor`) that swaps this
 * for an editable Plate sub-editor; the data shape stays the same so that
 * upgrade is purely additive.
 */
const ChromeReadout = ({
  block,
  numberPrefix,
}: {
  block: TElement;
  numberPrefix?: string;
}): React.JSX.Element => {
  const text = collectPlainText(block);

  return (
    <div style={{ fontSize: 13 }}>
      {numberPrefix ? <sup>{numberPrefix}</sup> : null}
      {text}
    </div>
  );
};

const collectPlainText = (node: TElement): string => {
  let out = '';
  const walk = (n: { children?: unknown[]; text?: string }): void => {
    if (typeof n.text === 'string') {
      out += n.text;

      return;
    }
    if (!Array.isArray(n.children)) return;
    for (const child of n.children) {
      walk(child as { children?: unknown[]; text?: string });
    }
  };

  walk(node);

  return out;
};
