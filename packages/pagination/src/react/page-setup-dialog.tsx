import * as React from 'react';

import { useEditorRef, usePluginOption } from 'platejs/react';

import type {
  BasePaginationTransforms,
  FootnotePlacement,
  PageMargins,
  PageNumberConfig,
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

const UNIT_STEP: Record<Unit, number> = {
  cm: 0.1,
  in: 0.05,
  mm: 1,
  px: 1,
};

const UNIT_PRECISION: Record<Unit, number> = {
  cm: 2,
  in: 2,
  mm: 0,
  px: 0,
};

const PRESET_NAMES = ['A4', 'Letter', 'Legal'] as const;

const isPresetName = (s: PageSize): s is (typeof PRESET_NAMES)[number] =>
  typeof s === 'string' && (PRESET_NAMES as readonly string[]).includes(s);

const DEFAULT_PAGE_NUMBER: PageNumberConfig = {
  align: 'right',
  format: '1',
  hideOnFirst: false,
  side: 'footer',
  startAt: 1,
};

const pxToUnit = (px: number, unit: Unit): string =>
  (px / PX_PER_UNIT[unit]).toFixed(UNIT_PRECISION[unit]);

const unitToPx = (raw: string, unit: Unit): number | null => {
  const v = Number.parseFloat(raw);

  return Number.isFinite(v) ? Math.round(v * PX_PER_UNIT[unit]) : null;
};

/**
 * Comprehensive Page Setup dialog (Google Docs-inspired).
 *
 * Wires UI controls to the pagination transforms — `setMargins`,
 * `setPageSize`, `setPageNumber`, `setFootnotePlacement`,
 * `setFirstPageDifferent`, plus first-page chrome toggles. All numeric
 * inputs are controlled and rerender as unit changes; selects use `value`
 * so the dialog reflects external option mutations live.
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
  const pageSize = usePluginOption(BasePaginationPlugin, 'pageSize');
  const headerHeight = usePluginOption(BasePaginationPlugin, 'headerHeight');
  const footerHeight = usePluginOption(BasePaginationPlugin, 'footerHeight');
  const footnotePlacement = usePluginOption(
    BasePaginationPlugin,
    'footnotePlacement'
  );
  const firstPageDifferent = usePluginOption(
    BasePaginationPlugin,
    'firstPageDifferent'
  );
  const pageNumber = usePluginOption(BasePaginationPlugin, 'pageNumber');
  const [unit, setUnit] = React.useState<Unit>('cm');

  const dialogRef = React.useRef<HTMLDialogElement | null>(null);

  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  if (!margins) return null;

  const tf = editor.tf as unknown as BasePaginationTransforms;

  const setSide = (side: keyof PageMargins, raw: string): void => {
    const px = unitToPx(raw, unit);
    if (px === null) return;
    tf.pagination.setMargins({ [side]: px } as Partial<PageMargins>);
  };

  const setHeaderH = (raw: string): void => {
    const px = unitToPx(raw, unit);
    if (px === null) return;
    editor.setOption(
      BasePaginationPlugin,
      'headerHeight' as never,
      px as never
    );
  };

  const setFooterH = (raw: string): void => {
    const px = unitToPx(raw, unit);
    if (px === null) return;
    editor.setOption(
      BasePaginationPlugin,
      'footerHeight' as never,
      px as never
    );
  };

  const onPageSize = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const v = e.target.value;
    if (v === 'custom') return;
    tf.pagination.setPageSize(v as PageSize);
  };

  const currentPageNumber = pageNumber ?? DEFAULT_PAGE_NUMBER;

  const updatePageNumber = (patch: Partial<PageNumberConfig>): void => {
    if (!pageNumber) {
      tf.pagination.setPageNumber({ ...DEFAULT_PAGE_NUMBER, ...patch });

      return;
    }

    tf.pagination.setPageNumber({ ...pageNumber, ...patch });
  };

  const togglePageNumber = (enabled: boolean): void => {
    tf.pagination.setPageNumber(enabled ? DEFAULT_PAGE_NUMBER : undefined);
  };

  const onFirstPageDifferent = (next: boolean): void => {
    // Just flip the flag. Word/Pages do not auto-author chrome on toggle —
    // the user clicks into the dedicated zone (or uses the per-side toggles
    // below) when they actually want different content on page 1.
    tf.pagination.setFirstPageDifferent(next);
  };

  const onFootnotePlacement = (placement: FootnotePlacement): void => {
    tf.pagination.setFootnotePlacement(placement);
  };

  return (
    <dialog
      ref={dialogRef}
      data-plate-pagination-page-setup-dialog=""
      onClose={onClose}
      style={{
        background: '#ffffff',
        border: 'none',
        borderRadius: 12,
        boxShadow:
          '0 1px 3px rgba(0,0,0,0.06), 0 24px 64px rgba(15,23,42,0.18)',
        color: '#0f172a',
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
        inset: 0,
        margin: 'auto',
        maxHeight: '85vh',
        maxWidth: 520,
        overflow: 'hidden',
        padding: 0,
        position: 'fixed',
        width: 'min(95vw, 520px)',
      }}
    >
      <style>
        {`dialog[data-plate-pagination-page-setup-dialog]::backdrop {
          background: rgba(15, 23, 42, 0.42);
          backdrop-filter: blur(2px);
        }`}
      </style>
      <form method="dialog" style={{ display: 'grid' }}>
        <Header onClose={onClose} />

        <div
          style={{
            display: 'grid',
            gap: 18,
            maxHeight: '70vh',
            overflowY: 'auto',
            padding: '20px 24px',
          }}
        >
          <Row label="Paper">
            <Select
              value={isPresetName(pageSize) ? pageSize : 'custom'}
              onChange={onPageSize}
            >
              {PRESET_NAMES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
              <option value="custom">Custom…</option>
            </Select>
          </Row>

          <Row label="Units">
            <Select
              value={unit}
              onChange={(e) => setUnit(e.target.value as Unit)}
            >
              <option value="cm">Centimeters (cm)</option>
              <option value="mm">Millimeters (mm)</option>
              <option value="in">Inches (in)</option>
              <option value="px">Pixels (px)</option>
            </Select>
          </Row>

          <Divider />

          <SectionTitle>Margins</SectionTitle>
          <div
            style={{
              display: 'grid',
              gap: 10,
              gridTemplateColumns: '1fr 1fr',
            }}
          >
            {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
              <UnitInput
                key={side}
                label={side[0].toUpperCase() + side.slice(1)}
                step={UNIT_STEP[unit]}
                unit={unit}
                value={margins[side]}
                onCommit={(raw) => setSide(side, raw)}
              />
            ))}
          </div>

          <Divider />

          <SectionTitle>Header / Footer</SectionTitle>
          <div
            style={{
              display: 'grid',
              gap: 10,
              gridTemplateColumns: '1fr 1fr',
            }}
          >
            <UnitInput
              label="Header height"
              step={UNIT_STEP[unit]}
              unit={unit}
              value={headerHeight}
              onCommit={setHeaderH}
            />
            <UnitInput
              label="Footer height"
              step={UNIT_STEP[unit]}
              unit={unit}
              value={footerHeight}
              onCommit={setFooterH}
            />
          </div>

          <Toggle
            checked={!!firstPageDifferent}
            label="Different first page"
            onChange={onFirstPageDifferent}
          />

          <Divider />

          <SectionTitle>Page numbers</SectionTitle>
          <Toggle
            checked={!!pageNumber}
            label="Show page numbers"
            onChange={togglePageNumber}
          />

          {pageNumber ? (
            <div
              style={{
                display: 'grid',
                gap: 10,
                gridTemplateColumns: '1fr 1fr',
              }}
            >
              <Field label="Position">
                <Select
                  value={currentPageNumber.side}
                  onChange={(e) =>
                    updatePageNumber({
                      side: e.target.value as PageNumberConfig['side'],
                    })
                  }
                >
                  <option value="header">Header</option>
                  <option value="footer">Footer</option>
                </Select>
              </Field>

              <Field label="Alignment">
                <Select
                  value={currentPageNumber.align}
                  onChange={(e) =>
                    updatePageNumber({
                      align: e.target.value as PageNumberConfig['align'],
                    })
                  }
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </Select>
              </Field>

              <Field label="Format">
                <Select
                  value={currentPageNumber.format}
                  onChange={(e) =>
                    updatePageNumber({
                      format: e.target.value as PageNumberConfig['format'],
                    })
                  }
                >
                  <option value="1">1</option>
                  <option value="1/N">1/N</option>
                  <option value="Page 1 of N">Page 1 of N</option>
                </Select>
              </Field>

              <Field label="Start at">
                <NumberInput
                  min={1}
                  step={1}
                  value={currentPageNumber.startAt}
                  onCommit={(v) => updatePageNumber({ startAt: v })}
                />
              </Field>

              <div style={{ gridColumn: '1 / -1' }}>
                <Toggle
                  checked={currentPageNumber.hideOnFirst}
                  label="Hide on first page"
                  onChange={(checked) =>
                    updatePageNumber({ hideOnFirst: checked })
                  }
                />
              </div>
            </div>
          ) : null}

          <Divider />

          <SectionTitle>Footnotes</SectionTitle>
          <Row label="Placement">
            <Select
              value={footnotePlacement}
              onChange={(e) =>
                onFootnotePlacement(e.target.value as FootnotePlacement)
              }
            >
              <option value="footer">Bottom of each page</option>
              <option value="documentEnd">End of document</option>
            </Select>
          </Row>
        </div>

        <Footer onClose={onClose} />
      </form>
    </dialog>
  );
};

const Header = ({ onClose }: { onClose: () => void }): React.JSX.Element => (
  <div
    style={{
      alignItems: 'center',
      borderBottom: '1px solid rgba(15,23,42,0.08)',
      display: 'flex',
      justifyContent: 'space-between',
      padding: '16px 24px',
    }}
  >
    <div style={{ fontSize: 16, fontWeight: 600 }}>Page setup</div>
    <button
      aria-label="Close"
      onClick={onClose}
      style={{
        background: 'transparent',
        border: 'none',
        color: 'rgba(15,23,42,0.6)',
        cursor: 'pointer',
        fontSize: 18,
        lineHeight: 1,
        padding: 4,
      }}
      type="button"
    >
      ×
    </button>
  </div>
);

const Footer = ({ onClose }: { onClose: () => void }): React.JSX.Element => (
  <div
    style={{
      borderTop: '1px solid rgba(15,23,42,0.08)',
      display: 'flex',
      gap: 8,
      justifyContent: 'flex-end',
      padding: '12px 24px',
    }}
  >
    <button
      onClick={onClose}
      style={{
        background: '#1e40af',
        border: 'none',
        borderRadius: 6,
        color: '#fff',
        cursor: 'pointer',
        fontSize: 13,
        fontWeight: 500,
        padding: '8px 16px',
      }}
      type="button"
    >
      Done
    </button>
  </div>
);

const SectionTitle = ({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element => (
  <div
    style={{
      color: 'rgba(15,23,42,0.55)',
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: 0.6,
      textTransform: 'uppercase',
    }}
  >
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
  <div
    style={{
      alignItems: 'center',
      display: 'grid',
      gap: 12,
      gridTemplateColumns: '120px 1fr',
    }}
  >
    <span style={{ fontSize: 13, fontWeight: 500 }}>{label}</span>
    {children}
  </div>
);

const Field = ({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}): React.JSX.Element => (
  <div style={{ display: 'grid', gap: 4 }}>
    <span style={{ color: 'rgba(15,23,42,0.7)', fontSize: 12 }}>{label}</span>
    {children}
  </div>
);

const Divider = (): React.JSX.Element => (
  <div
    style={{
      background: 'rgba(15,23,42,0.08)',
      height: 1,
      margin: '4px 0',
    }}
  />
);

const Select = (
  props: React.SelectHTMLAttributes<HTMLSelectElement>
): React.JSX.Element => (
  <select
    {...props}
    style={{
      background: '#fff',
      border: '1px solid rgba(15,23,42,0.18)',
      borderRadius: 6,
      fontSize: 13,
      padding: '6px 8px',
      width: '100%',
      ...props.style,
    }}
  />
);

const Toggle = ({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}): React.JSX.Element => (
  <label
    style={{
      alignItems: 'center',
      cursor: 'pointer',
      display: 'flex',
      fontSize: 13,
      gap: 10,
    }}
  >
    <input
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      style={{ accentColor: '#1e40af' }}
      type="checkbox"
    />
    <span>{label}</span>
  </label>
);

/**
 * Numeric input bound to a CSS-pixel value, displayed in the active unit.
 *
 * `value` is the raw px integer; the input renders the converted display
 * value and the `key={unit}` reset re-mounts the field whenever the unit
 * changes so the user immediately sees their margins/heights re-expressed
 * in cm / in / mm / px without leftover edit state.
 */
const UnitInput = ({
  label,
  onCommit,
  step,
  unit,
  value,
}: {
  label: string;
  onCommit: (raw: string) => void;
  step: number;
  unit: Unit;
  value: number;
}): React.JSX.Element => {
  const display = pxToUnit(value, unit);

  return (
    <label style={{ display: 'grid', gap: 4 }}>
      <span style={{ color: 'rgba(15,23,42,0.7)', fontSize: 12 }}>{label}</span>
      <div
        style={{
          alignItems: 'stretch',
          display: 'flex',
          gap: 0,
        }}
      >
        <input
          key={`${unit}-${value}`}
          defaultValue={display}
          onBlur={(e) => onCommit(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              onCommit((e.target as HTMLInputElement).value);
            }
          }}
          step={step}
          style={{
            border: '1px solid rgba(15,23,42,0.18)',
            borderRadius: '6px 0 0 6px',
            borderRight: 'none',
            flex: 1,
            fontSize: 13,
            minWidth: 0,
            padding: '6px 8px',
          }}
          type="number"
        />
        <span
          style={{
            alignItems: 'center',
            background: 'rgba(15,23,42,0.04)',
            border: '1px solid rgba(15,23,42,0.18)',
            borderRadius: '0 6px 6px 0',
            color: 'rgba(15,23,42,0.55)',
            display: 'flex',
            fontSize: 12,
            padding: '0 10px',
          }}
        >
          {unit}
        </span>
      </div>
    </label>
  );
};

const NumberInput = ({
  min,
  onCommit,
  step,
  value,
}: {
  min?: number;
  onCommit: (v: number) => void;
  step?: number;
  value: number;
}): React.JSX.Element => (
  <input
    key={value}
    defaultValue={value}
    min={min}
    onBlur={(e) => {
      const v = Number.parseInt(e.target.value, 10);
      if (Number.isFinite(v)) onCommit(v);
    }}
    onKeyDown={(e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const v = Number.parseInt((e.target as HTMLInputElement).value, 10);
        if (Number.isFinite(v)) onCommit(v);
      }
    }}
    step={step}
    style={{
      border: '1px solid rgba(15,23,42,0.18)',
      borderRadius: 6,
      fontSize: 13,
      padding: '6px 8px',
      width: '100%',
    }}
    type="number"
  />
);
