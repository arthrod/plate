import * as React from 'react';

import { useSelected } from 'platejs/react';

/**
 * Chrome region kind. Drives the default label and the data attribute used
 * for styling/scraping.
 */
export type ChromeKind =
  | 'firstPageFooter'
  | 'firstPageHeader'
  | 'footer'
  | 'header';

/**
 * Default human-readable label per chrome kind.
 *
 * Consumers can override via `<ChromeShell label="Custom label" ...>` when a
 * design system has its own copy.
 */
const DEFAULT_LABEL: Record<ChromeKind, string> = {
  firstPageFooter: 'First-page footer',
  firstPageHeader: 'First-page header',
  footer: 'Footer',
  header: 'Header',
};

export type ChromeShellProps = {
  /** Children rendered inside the shell — typically the chrome's content. */
  children: React.ReactNode;
  /**
   * Kind of chrome region. Drives the default label and the
   * `data-plate-pagination-chrome` attribute consumers can hook for styling.
   */
  kind: ChromeKind;
  /** Optional className applied to the shell wrapper. */
  className?: string;
  /** Override the default label (e.g. localized copy). */
  label?: string;
  /**
   * Click handler for the "Exit chrome" affordance. When omitted, the exit
   * button is hidden so consumers without an exit policy don't show a dead
   * button. Wire it to a transform like
   * `editor.tf.deselect()` or focus-moving logic.
   */
  onExit?: () => void;
  /** Inline style merged into the wrapper. */
  style?: React.CSSProperties;
};

/**
 * Selection-aware wrapper for header/footer chrome regions.
 *
 * Renders children plain in the unselected state. Once the user's selection
 * lands inside the chrome (detected via slate-react's `useSelected`), shows
 * a dotted focus border, a label badge, and an optional "Exit chrome"
 * button. Plain reading mode (no selection) is visually unchanged so the
 * paged view stays clean.
 *
 * Author wiring (registry kit):
 * ```tsx
 * import { PlateElement } from 'platejs/react';
 * import { ChromeShell } from '@platejs/pagination/react';
 *
 * export const HeaderElement = (props) => (
 *   <ChromeShell kind="header" onExit={() => props.editor.tf.blur()}>
 *     <PlateElement {...props} />
 *   </ChromeShell>
 * );
 * ```
 */
export const ChromeShell = ({
  children,
  className,
  kind,
  label,
  onExit,
  style,
}: ChromeShellProps): React.JSX.Element => {
  const selected = useSelected();
  const resolvedLabel = label ?? DEFAULT_LABEL[kind];

  const wrapperStyle: React.CSSProperties = selected
    ? {
        border: '1px dashed rgba(59,130,246,0.6)',
        borderRadius: 4,
        margin: -3,
        padding: 2,
        position: 'relative',
        ...style,
      }
    : { position: 'relative', ...style };

  return (
    <div
      data-plate-pagination-chrome={kind}
      data-plate-pagination-chrome-focused={selected ? '' : undefined}
      className={className}
      style={wrapperStyle}
    >
      {selected ? (
        <div
          data-plate-pagination-chrome-toolbar=""
          contentEditable={false}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: 'rgba(59,130,246,0.95)',
            fontSize: 11,
            left: 0,
            padding: '0 4px',
            pointerEvents: 'none',
            position: 'absolute',
            right: 0,
            top: -16,
            userSelect: 'none',
          }}
        >
          <span
            data-plate-pagination-chrome-label=""
            style={{
              background: 'rgba(59,130,246,0.08)',
              borderRadius: 3,
              padding: '0 4px',
              pointerEvents: 'auto',
            }}
          >
            {resolvedLabel}
          </span>
          {onExit ? (
            <button
              data-plate-pagination-chrome-exit=""
              onClick={onExit}
              onMouseDown={(e) => e.preventDefault()}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'rgba(59,130,246,0.95)',
                cursor: 'pointer',
                fontSize: 11,
                padding: '0 4px',
                pointerEvents: 'auto',
              }}
              type="button"
            >
              Exit
            </button>
          ) : null}
        </div>
      ) : null}
      {children}
    </div>
  );
};
