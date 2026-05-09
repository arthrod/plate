import * as React from 'react';

import {
  PlateElement,
  type PlateElementProps,
  useEditorRef,
  useReadOnly,
  useSelected,
} from 'platejs/react';

import {
  FIRST_PAGE_FOOTER_KEY,
  FIRST_PAGE_HEADER_KEY,
  FOOTER_KEY,
  HEADER_KEY,
} from '../lib/internal/keys';

export type ChromeKind =
  | 'firstPageFooter'
  | 'firstPageHeader'
  | 'footer'
  | 'header';

const LABELS: Record<ChromeKind, string> = {
  firstPageFooter: 'First page footer',
  firstPageHeader: 'First page header',
  footer: 'Footer',
  header: 'Header',
};

const PLACEHOLDERS: Record<ChromeKind, string> = {
  firstPageFooter: 'Type first-page footer',
  firstPageHeader: 'Type first-page header',
  footer: 'Type footer',
  header: 'Type header',
};

const isHeaderKind = (k: ChromeKind): boolean =>
  k === 'header' || k === 'firstPageHeader';

/**
 * Wrapper for header / footer / first-page chrome node renderers — Google
 * Docs-inspired UI:
 *
 * - Persistent dotted boundary line on the body-adjacent edge (below for
 *   headers, above for footers) so the chrome zone reads as a distinct
 *   region without inserting placeholder text.
 * - When the selection enters the chrome node, a small label badge appears
 *   on the inside edge plus an "Exit" affordance that drops focus on the
 *   first body block.
 * - When the chrome is empty, a muted placeholder hints what to type
 *   (rendered via a `data-placeholder` overlay so it never enters the
 *   document value and never serializes to DOCX).
 */
export const ChromeShell = ({
  attributes,
  children,
  element,
  kind,
  ...props
}: PlateElementProps & { kind: ChromeKind }): React.JSX.Element => {
  const editor = useEditorRef();
  const readOnly = useReadOnly();
  const selected = useSelected();
  const showAffordance = selected && !readOnly;
  const isEmpty = isElementEmpty(element);
  const headerLike = isHeaderKind(kind);

  const exit = React.useCallback(() => {
    const chromeTypes = new Set([
      editor.getType(HEADER_KEY),
      editor.getType(FOOTER_KEY),
      editor.getType(FIRST_PAGE_HEADER_KEY),
      editor.getType(FIRST_PAGE_FOOTER_KEY),
    ]);
    const idx = (editor.children as { type?: string }[]).findIndex(
      (n) => !chromeTypes.has(n.type ?? '')
    );

    if (idx < 0) return;

    editor.tf.focus({ at: [idx, 0] });
  }, [editor]);

  const boundary = '1px dashed rgba(15,23,42,0.22)';
  const focusBoundary = '1px dashed rgba(59,130,246,0.7)';
  const usedBoundary = showAffordance ? focusBoundary : boundary;

  return (
    <PlateElement {...props} attributes={attributes} element={element}>
      <div
        data-plate-pagination-chrome={kind}
        style={{
          // Boundary line on the edge that meets body content.
          borderBottom: headerLike ? usedBoundary : 'none',
          borderTop: headerLike ? 'none' : usedBoundary,
          paddingBottom: headerLike ? 6 : 4,
          paddingTop: headerLike ? 4 : 6,
          position: 'relative',
          transition: 'border-color 120ms ease',
        }}
      >
        {showAffordance ? (
          <div
            contentEditable={false}
            style={{
              alignItems: 'center',
              display: 'flex',
              fontFamily:
                'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
              fontSize: 11,
              gap: 6,
              left: 0,
              position: 'absolute',
              userSelect: 'none',
              ...(headerLike ? { bottom: -22 } : { top: -22 }),
            }}
          >
            <span
              style={{
                background: 'rgba(59,130,246,0.95)',
                borderRadius: 3,
                color: '#fff',
                fontWeight: 500,
                letterSpacing: 0.2,
                padding: '2px 7px',
                textTransform: 'uppercase',
              }}
            >
              {LABELS[kind]}
            </span>
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                exit();
              }}
              style={{
                background: '#fff',
                border: '1px solid rgba(15,23,42,0.18)',
                borderRadius: 3,
                color: 'rgba(15,23,42,0.75)',
                cursor: 'pointer',
                fontSize: 11,
                padding: '1px 7px',
              }}
              type="button"
            >
              Exit
            </button>
          </div>
        ) : null}

        {isEmpty && !readOnly ? (
          <span
            contentEditable={false}
            style={{
              color: 'rgba(15,23,42,0.32)',
              fontStyle: 'italic',
              left: 0,
              pointerEvents: 'none',
              position: 'absolute',
              top: headerLike ? 4 : 6,
              userSelect: 'none',
            }}
          >
            {PLACEHOLDERS[kind]}
          </span>
        ) : null}

        {children}
      </div>
    </PlateElement>
  );
};

const isElementEmpty = (
  element: PlateElementProps['element'] | undefined
): boolean => {
  if (!element) return true;

  const children = element.children as { text?: string }[] | undefined;

  if (!children || children.length === 0) return true;
  if (children.length > 1) return false;

  const only = children[0];

  return typeof only?.text === 'string' && only.text.length === 0;
};

export const HeaderChrome = (props: PlateElementProps): React.JSX.Element => (
  <ChromeShell {...props} kind="header" />
);

export const FooterChrome = (props: PlateElementProps): React.JSX.Element => (
  <ChromeShell {...props} kind="footer" />
);

export const FirstPageHeaderChrome = (
  props: PlateElementProps
): React.JSX.Element => <ChromeShell {...props} kind="firstPageHeader" />;

export const FirstPageFooterChrome = (
  props: PlateElementProps
): React.JSX.Element => <ChromeShell {...props} kind="firstPageFooter" />;
