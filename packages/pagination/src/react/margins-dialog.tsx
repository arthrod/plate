import * as React from 'react';

import { useEditorRef, usePluginOption } from 'platejs/react';

import type {
  BasePaginationTransforms,
  PageMargins,
  PageNumberAlign,
  PageNumberFormat,
  PageNumberRegion,
  PageSize,
} from '../lib/types';

import { BasePaginationPlugin } from '../lib/base-pagination-plugin';

type Unit = 'cm' | 'in' | 'mm' | 'px';

const PX_PER_UNIT: Record<Unit, number> = {
  cm: 96 / 2.54,
  in: 96,
  mm: 96 / 25.4,
  px: 1,
};

/**
 * Built-in page-size presets in CSS pixels (96 dpi).
 *
 * Width/height are stored as the literal `{ width, height }` shape because
 * `BasePaginationOptions.pageSize` accepts either a preset key or a literal.
 * We reconstruct the literal client-side for predictable rendering even if
 * the host's `resolvePageRect` would also accept the preset key.
 */
const SIZE_PRESETS: Record<
  'A4' | 'Legal' | 'Letter',
  { height: number; width: number }
> = {
  A4: { height: 1123, width: 794 }, // 210mm x 297mm
  Legal: { height: 1344, width: 816 }, // 8.5in x 14in
  Letter: { height: 1056, width: 816 }, // 8.5in x 11in
};

/**
 * Page Setup dialog — full BasePaginationOptions surface.
 *
 * Replaces the v1 four-margin dialog with: page-size presets, per-axis
 * margins (with unit toggle), header/footer heights, footnote placement
 * toggle, first-page-different toggle, and the page-number slot config
 * (region/align/format/startAt/hideOnFirst).
 *
 * All edits flow through `editor.tf.pagination.*` transforms — no direct
 * `setOption` calls — so consumers that override transforms see the same
 * behavior they get from the toolbar buttons.
 *
 * The host opens this from the toolbar's `Page Setup…` button. v1 ships a
 * native `<dialog>`; the host may swap for a shadcn/Radix Dialog while
 * keeping this state-management contract.
 */
export const PageSetupDialog = ({
  onClose,
  open,
}: {
  onClose: () => void;
  open: boolean;
}): React.JSX.Element | null => {
  const editor = useEditorRef();
  const margins = usePluginOption(BasePaginationPlugin, 'margins');
  const headerHeight = usePluginOption(BasePaginationPlugin, 'headerHeight');
  const footerHeight = usePluginOption(BasePaginationPlugin, 'footerHeight');
  const footnotePlacement = usePluginOption(
    BasePaginationPlugin,
    'footnotePlacement'
  );
  const pageSize = usePluginOption(BasePaginationPlugin, 'pageSize');
  const pageNumber = usePluginOption(BasePaginationPlugin, 'pageNumber');
  const firstPageDifferent = usePluginOption(
    BasePaginationPlugin,
    'firstPageDifferent'
  );
  const [unit, setUnit] = React.useState<Unit>('px');

  const dialogRef = React.useRef<HTMLDialogElement | null>(null);

  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  if (!margins || !pageNumber) return null;

  const tf = editor.tf as unknown as BasePaginationTransforms;

  const setSide = (side: keyof PageMargins, valueRaw: string): void => {
    const v = Number.parseFloat(valueRaw);

    if (!Number.isFinite(v)) return;

    tf.pagination.setMargins({
      [side]: Math.round(v * PX_PER_UNIT[unit]),
    } as Partial<PageMargins>);
  };

  const toUnit = (px: number): string =>
    (px / PX_PER_UNIT[unit]).toFixed(unit === 'px' ? 0 : 2);

  const sizeKey: 'A4' | 'Legal' | 'Letter' | 'custom' =
    typeof pageSize === 'string' && pageSize in SIZE_PRESETS
      ? (pageSize as 'A4' | 'Legal' | 'Letter')
      : 'custom';
  const sizeLiteral =
    typeof pageSize === 'object'
      ? (pageSize as { height: number; width: number })
      : SIZE_PRESETS[
          (typeof pageSize === 'string' && pageSize in SIZE_PRESETS
            ? pageSize
            : 'A4') as 'A4' | 'Legal' | 'Letter'
        ];

  const setSize = (next: 'A4' | 'Legal' | 'Letter' | 'custom'): void => {
    if (next === 'custom') {
      tf.pagination.setPageSize(sizeLiteral as PageSize);
      return;
    }
    tf.pagination.setPageSize(next);
  };

  const setSizeAxis = (axis: 'height' | 'width', valueRaw: string): void => {
    const v = Number.parseFloat(valueRaw);
    if (!Number.isFinite(v)) return;

    const px = Math.round(v * PX_PER_UNIT[unit]);
    tf.pagination.setPageSize({
      ...sizeLiteral,
      [axis]: px,
    });
  };

  const setHeight = (
    key: 'footerHeight' | 'headerHeight',
    valueRaw: string
  ): void => {
    const v = Number.parseFloat(valueRaw);
    if (!Number.isFinite(v) || v < 0) return;

    const px = Math.round(v * PX_PER_UNIT[unit]);
    if (key === 'headerHeight') tf.pagination.setHeaderHeight(px);
    else tf.pagination.setFooterHeight(px);
  };

  return (
    <dialog
      ref={dialogRef}
      data-plate-pagination-page-setup-dialog=""
      onClose={onClose}
      style={{
        border: '1px solid rgba(15,23,42,0.18)',
        borderRadius: 8,
        boxShadow: '0 24px 64px rgba(15,23,42,0.18)',
        maxHeight: '85vh',
        maxWidth: 480,
        overflowY: 'auto',
        padding: 16,
      }}
    >
      <form method="dialog" style={{ display: 'grid', gap: 14 }}>
        <div style={{ fontSize: 14, fontWeight: 600 }}>Page Setup</div>

        <Section title="Units">
          <Row label="Unit">
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as Unit)}
              style={{ flex: 1 }}
            >
              <option value="px">Pixels</option>
              <option value="in">Inches</option>
              <option value="cm">Centimeters</option>
              <option value="mm">Millimeters</option>
            </select>
          </Row>
        </Section>

        <Section title="Page size">
          <Row label="Preset">
            <select
              value={sizeKey}
              onChange={(e) =>
                setSize(e.target.value as 'A4' | 'Legal' | 'Letter' | 'custom')
              }
              style={{ flex: 1 }}
            >
              <option value="A4">A4</option>
              <option value="Letter">Letter</option>
              <option value="Legal">Legal</option>
              <option value="custom">Custom…</option>
            </select>
          </Row>
          {sizeKey === 'custom' ? (
            <>
              <Row label="Width">
                <NumberInput
                  onCommit={(v) => setSizeAxis('width', v)}
                  value={toUnit(sizeLiteral.width)}
                  inputKey={`${unit}-w-${sizeLiteral.width}`}
                />
              </Row>
              <Row label="Height">
                <NumberInput
                  onCommit={(v) => setSizeAxis('height', v)}
                  value={toUnit(sizeLiteral.height)}
                  inputKey={`${unit}-h-${sizeLiteral.height}`}
                />
              </Row>
            </>
          ) : null}
        </Section>

        <Section title="Margins">
          {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
            <Row key={side} label={side[0].toUpperCase() + side.slice(1)}>
              <NumberInput
                onCommit={(v) => setSide(side, v)}
                value={toUnit(margins[side])}
                // unit + side + px value all in the key so external option
                // changes (e.g. preset clicks) and unit toggles remount the
                // input with the resolved value instead of leaving the user's
                // stale typed string in place.
                inputKey={`${unit}-${side}-${margins[side]}`}
              />
            </Row>
          ))}
        </Section>

        <Section title="Chrome heights">
          <Row label="Header">
            <NumberInput
              onCommit={(v) => setHeight('headerHeight', v)}
              value={toUnit(headerHeight ?? 0)}
              inputKey={`${unit}-h-${headerHeight}`}
            />
          </Row>
          <Row label="Footer">
            <NumberInput
              onCommit={(v) => setHeight('footerHeight', v)}
              value={toUnit(footerHeight ?? 0)}
              inputKey={`${unit}-f-${footerHeight}`}
            />
          </Row>
        </Section>

        <Section title="Page numbers">
          <Row label="Region">
            <select
              value={pageNumber.region}
              onChange={(e) =>
                tf.pagination.setPageNumber({
                  region: e.target.value as PageNumberRegion,
                })
              }
              style={{ flex: 1 }}
            >
              <option value="header">Header</option>
              <option value="footer">Footer</option>
            </select>
          </Row>
          <Row label="Align">
            <select
              value={pageNumber.align}
              onChange={(e) =>
                tf.pagination.setPageNumber({
                  align: e.target.value as PageNumberAlign,
                })
              }
              style={{ flex: 1 }}
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </Row>
          <Row label="Format">
            <select
              value={pageNumber.format}
              onChange={(e) =>
                tf.pagination.setPageNumber({
                  format: e.target.value as PageNumberFormat,
                })
              }
              style={{ flex: 1 }}
            >
              <option value="1">1</option>
              <option value="1/N">1/N</option>
              <option value="Page 1 of N">Page 1 of N</option>
            </select>
          </Row>
          <Row label="Start at">
            <NumberInput
              inputKey={`pn-start-${pageNumber.startAt}`}
              min={1}
              onCommit={(v) => {
                const n = Number.parseInt(v, 10);
                if (!Number.isFinite(n) || n < 1) return;
                tf.pagination.setPageNumber({ startAt: n });
              }}
              value={String(pageNumber.startAt)}
            />
          </Row>
          <Row label="Hide on first">
            <input
              checked={pageNumber.hideOnFirst}
              onChange={(e) =>
                tf.pagination.setPageNumber({ hideOnFirst: e.target.checked })
              }
              type="checkbox"
            />
          </Row>
        </Section>

        <Section title="First page">
          <Row label="Different first page">
            <input
              checked={firstPageDifferent ?? false}
              onChange={(e) =>
                tf.pagination.setFirstPageDifferent(e.target.checked)
              }
              type="checkbox"
            />
          </Row>
        </Section>

        <Section title="Footnotes">
          <Row label="Placement">
            <select
              value={footnotePlacement ?? 'footer'}
              onChange={(e) =>
                tf.pagination.setFootnotePlacement(
                  e.target.value as 'documentEnd' | 'footer'
                )
              }
              style={{ flex: 1 }}
            >
              <option value="footer">Page footer</option>
              <option value="documentEnd">End of document</option>
            </select>
          </Row>
        </Section>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={onClose} type="button">
            Done
          </button>
        </div>
      </form>
    </dialog>
  );
};

/**
 * Backwards-compatible alias for the v1 dialog name.
 *
 * Existing imports `import { MarginsDialog } from '@platejs/pagination/react'`
 * keep working; the alias renders the full Page Setup form, which is a
 * superset of the original margin-only UI.
 */
export const MarginsDialog = PageSetupDialog;

const Section = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}): React.JSX.Element => (
  <div style={{ display: 'grid', gap: 6 }}>
    <div
      style={{
        color: 'rgba(15,23,42,0.65)',
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: 0.4,
        textTransform: 'uppercase',
      }}
    >
      {title}
    </div>
    {children}
  </div>
);

const Row = ({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}): React.JSX.Element => (
  <div style={{ alignItems: 'center', display: 'flex', gap: 6 }}>
    <span style={{ fontSize: 13, width: 110 }}>{label}</span>
    {children}
  </div>
);

/**
 * Numeric input with commit-on-blur, auto-select-on-focus, and external-sync.
 *
 * `inputKey` should encode every external piece of state that should reset
 * the input back to `value` (e.g. `${unit}-${margins.top}`). When that key
 * changes React remounts this subtree so the user's stale typed string is
 * replaced with the freshly-resolved option value — without that, switching
 * units or clicking a margin preset leaves the input lying.
 *
 * `onFocus` selects the entire current value so users replace rather than
 * append. The previous `defaultValue` shape silently appended typed digits
 * to existing values, producing pathological margins (e.g. `96 → 96300`).
 */
const NumberInput = ({
  inputKey,
  min,
  onCommit,
  value,
}: {
  inputKey: string;
  min?: number;
  onCommit: (next: string) => void;
  value: string;
}): React.JSX.Element => (
  <input
    defaultValue={value}
    key={inputKey}
    min={min}
    onBlur={(e) => onCommit(e.target.value)}
    onFocus={(e) => e.target.select()}
    onKeyDown={(e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        (e.target as HTMLInputElement).blur();
      }
    }}
    style={{ flex: 1 }}
    type="number"
  />
);
