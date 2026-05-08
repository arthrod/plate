import * as React from 'react';

import { useEditorRef, usePluginOption } from 'platejs/react';

import type { BasePaginationTransforms, PageMargins } from '../lib/types';

import { BasePaginationPlugin } from '../lib/base-pagination-plugin';

type Unit = 'cm' | 'in' | 'mm' | 'px';

const PX_PER_UNIT: Record<Unit, number> = {
  cm: 96 / 2.54,
  in: 96,
  mm: 96 / 25.4,
  px: 1,
};

/**
 * Dialog UI for editing the four-sided margin box.
 *
 * Reads / writes through `editor.tf.pagination.setMargins(patch)`. The unit
 * selector is purely presentational — internally the plugin always stores
 * margins in CSS pixels (matching `<w:pgMar>` semantics for export).
 *
 * The host opens this dialog from the toolbar when the user picks
 * `Custom…`. v1 ships a minimal native `<dialog>`; the host may swap for a
 * shadcn/Radix Dialog while keeping this state-management contract.
 */
export const MarginsDialog = ({
  onClose,
  open,
}: {
  onClose: () => void;
  open: boolean;
}): React.JSX.Element | null => {
  const editor = useEditorRef();
  const margins = usePluginOption(BasePaginationPlugin, 'margins');
  const [unit, setUnit] = React.useState<Unit>('px');

  const dialogRef = React.useRef<HTMLDialogElement | null>(null);

  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  if (!margins) return null;

  const setSide = (side: keyof PageMargins, valueRaw: string): void => {
    const v = Number.parseFloat(valueRaw);

    if (!Number.isFinite(v)) return;

    const tf = editor.tf as unknown as BasePaginationTransforms;

    tf.pagination.setMargins({
      [side]: Math.round(v * PX_PER_UNIT[unit]),
    } as Partial<PageMargins>);
  };

  const toUnit = (px: number): string =>
    (px / PX_PER_UNIT[unit]).toFixed(unit === 'px' ? 0 : 2);

  return (
    <dialog
      ref={dialogRef}
      data-plate-pagination-margins-dialog=""
      onClose={onClose}
      style={{
        border: '1px solid rgba(15,23,42,0.18)',
        borderRadius: 8,
        boxShadow: '0 24px 64px rgba(15,23,42,0.18)',
        maxWidth: 360,
        padding: 16,
      }}
    >
      <form method="dialog" style={{ display: 'grid', gap: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 600 }}>Page margins</div>

        <label style={{ alignItems: 'center', display: 'flex', gap: 6 }}>
          <span style={{ width: 60 }}>Unit</span>
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
            <span style={{ textTransform: 'capitalize', width: 60 }}>
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

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={onClose} type="button">
            Done
          </button>
        </div>
      </form>
    </dialog>
  );
};
