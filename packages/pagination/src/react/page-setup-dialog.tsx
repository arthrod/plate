import * as React from 'react';

import { useEditorRef, usePluginOption } from 'platejs/react';

import type {
  BasePaginationTransforms,
  FootnotePlacement,
  PageMargins,
  PageNumberAlign,
  PageNumberConfig,
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

const PAGE_SIZE_PRESETS: ReadonlyArray<{ label: string; value: PageSize }> = [
  { label: 'A4 (210 × 297 mm)', value: 'A4' },
  { label: 'Letter (8.5 × 11 in)', value: 'Letter' },
  { label: 'Legal (8.5 × 14 in)', value: 'Legal' },
];

const FOOTNOTE_PLACEMENTS: ReadonlyArray<{
  description: string;
  label: string;
  value: FootnotePlacement;
}> = [
  {
    description:
      'Footer well of the page that holds the reference (Word default).',
    label: 'Page bottom',
    value: 'pageBottom',
  },
  {
    description:
      'Directly below the paragraph that holds the reference. Falls back to page bottom in v1.',
    label: 'Beneath text',
    value: 'beneathText',
  },
  {
    description:
      "Accumulated at the section's last page. Falls back to document end in v1.",
    label: 'Section end',
    value: 'sectEnd',
  },
  {
    description: "Accumulated on the document's last page.",
    label: 'Document end',
    value: 'docEnd',
  },
];

const PAGE_NUMBER_FORMATS: ReadonlyArray<{
  label: string;
  value: PageNumberFormat;
}> = [
  { label: '1, 2, 3 (decimal)', value: 'decimal' },
  { label: 'I, II, III (roman)', value: 'roman' },
  { label: 'A, B, C (letter)', value: 'letter' },
  { label: '1/N', value: '1/N' },
  { label: 'Page 1 of N', value: 'page-of-n' },
];

const PAGE_NUMBER_REGIONS: ReadonlyArray<{
  label: string;
  value: PageNumberRegion;
}> = [
  { label: 'Header', value: 'header' },
  { label: 'Footer', value: 'footer' },
];

const PAGE_NUMBER_ALIGNS: ReadonlyArray<{
  label: string;
  value: PageNumberAlign;
}> = [
  { label: 'Left', value: 'left' },
  { label: 'Center', value: 'center' },
  { label: 'Right', value: 'right' },
];

const DEFAULT_PAGE_NUMBER: PageNumberConfig = {
  align: 'right',
  format: 'decimal',
  hideOnFirst: false,
  region: 'footer',
  startAt: 1,
};

const isPresetSize = (size: PageSize): size is 'A4' | 'Legal' | 'Letter' =>
  typeof size === 'string' &&
  (size === 'A4' || size === 'Letter' || size === 'Legal');

/**
 * Comprehensive Page Setup dialog covering every option a user can tune
 * about the paged view.
 *
 * Reads / writes through the `editor.tf.pagination.*` transform surface so
 * the dialog stays decoupled from any specific state-management choice.
 *
 * Replaces the older `MarginsDialog` (still exported as an alias for
 * back-compat). v1 ships a minimal native `<dialog>`; consumers may swap
 * for a shadcn/Radix Dialog while keeping this state-management contract.
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
  const pageNumber = usePluginOption(BasePaginationPlugin, 'pageNumber');
  const firstPageDifferent = usePluginOption(
    BasePaginationPlugin,
    'firstPageDifferent'
  );
  const chromeFocusDimsBody = usePluginOption(
    BasePaginationPlugin,
    'chromeFocusDimsBody'
  );

  const [unit, setUnit] = React.useState<Unit>('px');
  const dialogRef = React.useRef<HTMLDialogElement | null>(null);

  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  if (!margins) return null;

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

  const updatePageNumber = (patch: Partial<PageNumberConfig>): void => {
    const next: PageNumberConfig = {
      ...DEFAULT_PAGE_NUMBER,
      ...pageNumber,
      ...patch,
    };
    tf.pagination.setPageNumber(next);
  };

  const togglePageNumber = (enabled: boolean): void => {
    tf.pagination.setPageNumber(enabled ? DEFAULT_PAGE_NUMBER : null);
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
        maxWidth: 480,
        padding: 16,
      }}
    >
      <form method="dialog" style={{ display: 'grid', gap: 16 }}>
        <div style={{ fontSize: 16, fontWeight: 600 }}>Page setup</div>

        <fieldset
          style={{ border: 'none', display: 'grid', gap: 8, padding: 0 }}
        >
          <legend style={{ fontWeight: 600 }}>Margins</legend>
          <label style={{ alignItems: 'center', display: 'flex', gap: 6 }}>
            <span style={{ width: 70 }}>Unit</span>
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
          </label>
          {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
            <label
              key={side}
              style={{ alignItems: 'center', display: 'flex', gap: 6 }}
            >
              <span style={{ textTransform: 'capitalize', width: 70 }}>
                {side}
              </span>
              <input
                defaultValue={toUnit(margins[side])}
                onBlur={(e) => setSide(side, e.target.value)}
                style={{ flex: 1 }}
                type="number"
              />
            </label>
          ))}
        </fieldset>

        <fieldset
          style={{ border: 'none', display: 'grid', gap: 8, padding: 0 }}
        >
          <legend style={{ fontWeight: 600 }}>Page size</legend>
          <select
            value={isPresetSize(pageSize) ? pageSize : ''}
            onChange={(e) =>
              tf.pagination.setPageSize(e.target.value as PageSize)
            }
          >
            {PAGE_SIZE_PRESETS.map((preset) => (
              <option
                key={preset.value as string}
                value={preset.value as string}
              >
                {preset.label}
              </option>
            ))}
            {isPresetSize(pageSize) ? null : <option value="">Custom</option>}
          </select>
        </fieldset>

        <fieldset
          style={{ border: 'none', display: 'grid', gap: 8, padding: 0 }}
        >
          <legend style={{ fontWeight: 600 }}>Chrome heights</legend>
          <label style={{ alignItems: 'center', display: 'flex', gap: 6 }}>
            <span style={{ width: 70 }}>Header</span>
            <input
              defaultValue={String(headerHeight ?? 0)}
              onBlur={(e) => {
                const v = Number.parseFloat(e.target.value);
                if (Number.isFinite(v)) {
                  // headerHeight is a plain option without a dedicated transform
                  // (yet). Use the back-door write via editor option; keep it
                  // discoverable so a future `setHeaderHeight` can replace it.
                  (editor.setOption as (key: string, value: unknown) => void)(
                    'headerHeight',
                    Math.max(0, Math.round(v))
                  );
                }
              }}
              style={{ flex: 1 }}
              type="number"
            />
          </label>
          <label style={{ alignItems: 'center', display: 'flex', gap: 6 }}>
            <span style={{ width: 70 }}>Footer</span>
            <input
              defaultValue={String(footerHeight ?? 0)}
              onBlur={(e) => {
                const v = Number.parseFloat(e.target.value);
                if (Number.isFinite(v)) {
                  (editor.setOption as (key: string, value: unknown) => void)(
                    'footerHeight',
                    Math.max(0, Math.round(v))
                  );
                }
              }}
              style={{ flex: 1 }}
              type="number"
            />
          </label>
        </fieldset>

        <fieldset
          style={{ border: 'none', display: 'grid', gap: 8, padding: 0 }}
        >
          <legend style={{ fontWeight: 600 }}>First page</legend>
          <label style={{ alignItems: 'center', display: 'flex', gap: 6 }}>
            <input
              checked={firstPageDifferent === true}
              onChange={(e) =>
                tf.pagination.setFirstPageDifferent(e.target.checked)
              }
              type="checkbox"
            />
            <span>Different first-page header / footer</span>
          </label>
        </fieldset>

        <fieldset
          style={{ border: 'none', display: 'grid', gap: 8, padding: 0 }}
        >
          <legend style={{ fontWeight: 600 }}>Page number</legend>
          <label style={{ alignItems: 'center', display: 'flex', gap: 6 }}>
            <input
              checked={pageNumber !== null && pageNumber !== undefined}
              onChange={(e) => togglePageNumber(e.target.checked)}
              type="checkbox"
            />
            <span>Show page number</span>
          </label>
          {pageNumber ? (
            <div style={{ display: 'grid', gap: 6, paddingLeft: 24 }}>
              <label style={{ alignItems: 'center', display: 'flex', gap: 6 }}>
                <span style={{ width: 70 }}>Region</span>
                <select
                  value={pageNumber.region}
                  onChange={(e) =>
                    updatePageNumber({
                      region: e.target.value as PageNumberRegion,
                    })
                  }
                  style={{ flex: 1 }}
                >
                  {PAGE_NUMBER_REGIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>
              <label style={{ alignItems: 'center', display: 'flex', gap: 6 }}>
                <span style={{ width: 70 }}>Align</span>
                <select
                  value={pageNumber.align}
                  onChange={(e) =>
                    updatePageNumber({
                      align: e.target.value as PageNumberAlign,
                    })
                  }
                  style={{ flex: 1 }}
                >
                  {PAGE_NUMBER_ALIGNS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>
              <label style={{ alignItems: 'center', display: 'flex', gap: 6 }}>
                <span style={{ width: 70 }}>Format</span>
                <select
                  value={pageNumber.format}
                  onChange={(e) =>
                    updatePageNumber({
                      format: e.target.value as PageNumberFormat,
                    })
                  }
                  style={{ flex: 1 }}
                >
                  {PAGE_NUMBER_FORMATS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>
              <label style={{ alignItems: 'center', display: 'flex', gap: 6 }}>
                <span style={{ width: 70 }}>Start at</span>
                <input
                  defaultValue={String(pageNumber.startAt)}
                  onBlur={(e) => {
                    const v = Number.parseInt(e.target.value, 10);
                    if (Number.isFinite(v)) {
                      updatePageNumber({ startAt: Math.max(1, v) });
                    }
                  }}
                  style={{ flex: 1 }}
                  type="number"
                />
              </label>
              <label style={{ alignItems: 'center', display: 'flex', gap: 6 }}>
                <input
                  checked={pageNumber.hideOnFirst}
                  onChange={(e) =>
                    updatePageNumber({ hideOnFirst: e.target.checked })
                  }
                  type="checkbox"
                />
                <span>Hide on first page</span>
              </label>
            </div>
          ) : null}
        </fieldset>

        <fieldset
          style={{ border: 'none', display: 'grid', gap: 8, padding: 0 }}
        >
          <legend style={{ fontWeight: 600 }}>Footnotes</legend>
          <select
            value={footnotePlacement}
            onChange={(e) =>
              tf.pagination.setFootnotePlacement(
                e.target.value as FootnotePlacement
              )
            }
          >
            {FOOTNOTE_PLACEMENTS.map((opt) => (
              <option key={opt.value} value={opt.value} title={opt.description}>
                {opt.label}
              </option>
            ))}
          </select>
        </fieldset>

        <fieldset
          style={{ border: 'none', display: 'grid', gap: 8, padding: 0 }}
        >
          <legend style={{ fontWeight: 600 }}>Editing UX</legend>
          <label style={{ alignItems: 'center', display: 'flex', gap: 6 }}>
            <input
              checked={chromeFocusDimsBody !== false}
              onChange={(e) =>
                tf.pagination.setChromeFocusDimsBody(e.target.checked)
              }
              type="checkbox"
            />
            <span>Dim body when editing header / footer</span>
          </label>
        </fieldset>

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
 * Backwards-compatible alias for the old margins-only dialog. New code
 * should import {@link PageSetupDialog}.
 *
 * @deprecated Use {@link PageSetupDialog} instead.
 */
export const MarginsDialog = PageSetupDialog;
