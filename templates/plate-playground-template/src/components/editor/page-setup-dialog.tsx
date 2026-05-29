'use client';

import {
  type FootnoteMode,
  getPresetPageSpec,
  type LengthUnit,
  lengthToPx,
  type PageNumberPosition,
  type PageSetupConfig,
  pxToLength,
} from '@platejs/pagination';
import type * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const UNITS: { label: string; value: LengthUnit }[] = [
  { label: 'inches', value: 'in' },
  { label: 'cm', value: 'cm' },
  { label: 'px', value: 'px' },
];

const PRESETS = [
  { label: 'US Letter', value: 'letter' },
  { label: 'A4', value: 'a4' },
  { label: 'Custom', value: 'custom' },
] as const;

const PAGE_NUMBER_POSITIONS: { label: string; value: PageNumberPosition }[] = [
  { label: 'None', value: 'none' },
  { label: 'Header — left', value: 'header-left' },
  { label: 'Header — center', value: 'header-center' },
  { label: 'Header — right', value: 'header-right' },
  { label: 'Footer — left', value: 'footer-left' },
  { label: 'Footer — center', value: 'footer-center' },
  { label: 'Footer — right', value: 'footer-right' },
];

const FOOTNOTE_MODES: { label: string; value: FootnoteMode }[] = [
  { label: 'Off', value: 'off' },
  { label: 'Footnotes (per page)', value: 'footnote' },
  { label: 'Endnotes (document end)', value: 'endnote' },
];

/** Round a unit value for display (2 dp; px shows whole numbers). */
function display(px: number, unit: LengthUnit): number {
  const v = pxToLength(px, unit);
  return unit === 'px' ? Math.round(v) : Math.round(v * 100) / 100;
}

function Field({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-medium text-muted-foreground text-xs">{label}</span>
      {children}
    </div>
  );
}

export type PageSetupDialogProps = {
  onChange: (patch: Partial<PageSetupConfig>) => void;
  onOpenChange: (open: boolean) => void;
  onPrint: () => void;
  open: boolean;
  value: PageSetupConfig;
};

export function PageSetupDialog({
  onChange,
  onOpenChange,
  onPrint,
  open,
  value,
}: PageSetupDialogProps) {
  const unit = value.unit;
  const preset = value.page.preset ?? 'custom';

  const setMargin = (key: keyof PageSetupConfig['margins'], n: number) =>
    onChange({
      margins: { ...value.margins, [key]: lengthToPx(n, unit) },
    });

  const setPageDim = (key: 'heightPx' | 'widthPx', n: number) =>
    onChange({
      // Editing a dimension switches the page to a custom size (no preset).
      page: { ...value.page, [key]: lengthToPx(n, unit), preset: undefined },
    });

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-w-lg" data-testid="page-setup-dialog">
        <DialogHeader>
          <DialogTitle>Page setup</DialogTitle>
          <DialogDescription>
            Margins, page size, page numbers, and footnotes. Stored in the
            document.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 py-2">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Page size">
              <Select
                onValueChange={(v) => {
                  if (v === 'custom') return;
                  onChange({ page: getPresetPageSpec(v as 'a4' | 'letter') });
                }}
                value={preset}
              >
                <SelectTrigger data-testid="page-preset">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRESETS.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Unit">
              <Select
                onValueChange={(v) => onChange({ unit: v as LengthUnit })}
                value={unit}
              >
                <SelectTrigger data-testid="page-unit">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {UNITS.map((u) => (
                    <SelectItem key={u.value} value={u.value}>
                      {u.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label={`Width (${unit})`}>
              <Input
                data-testid="page-width"
                onChange={(e) =>
                  setPageDim('widthPx', Number(e.target.value) || 0)
                }
                step="any"
                type="number"
                value={display(value.page.widthPx, unit)}
              />
            </Field>
            <Field label={`Height (${unit})`}>
              <Input
                data-testid="page-height"
                onChange={(e) =>
                  setPageDim('heightPx', Number(e.target.value) || 0)
                }
                step="any"
                type="number"
                value={display(value.page.heightPx, unit)}
              />
            </Field>
          </div>

          <div>
            <span className="font-medium text-muted-foreground text-xs">
              {`Margins (${unit})`}
            </span>
            <div className="mt-1 grid grid-cols-4 gap-2">
              {(
                [
                  ['Top', 'topPx'],
                  ['Right', 'rightPx'],
                  ['Bottom', 'bottomPx'],
                  ['Left', 'leftPx'],
                ] as const
              ).map(([label, key]) => (
                <Field key={key} label={label}>
                  <Input
                    data-testid={`margin-${key}`}
                    onChange={(e) =>
                      setMargin(key, Number(e.target.value) || 0)
                    }
                    step="any"
                    type="number"
                    value={display(value.margins[key], unit)}
                  />
                </Field>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Page numbers">
              <Select
                onValueChange={(v) =>
                  onChange({ pageNumber: v as PageNumberPosition })
                }
                value={value.pageNumber}
              >
                <SelectTrigger data-testid="page-number-pos">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAGE_NUMBER_POSITIONS.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Footnotes / endnotes">
              <Select
                onValueChange={(v) =>
                  onChange({ footnotes: v as FootnoteMode })
                }
                value={value.footnotes}
              >
                <SelectTrigger data-testid="footnote-mode">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FOOTNOTE_MODES.map((f) => (
                    <SelectItem key={f.value} value={f.value}>
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
        </div>

        <DialogFooter>
          <Button
            data-testid="print-view"
            onClick={onPrint}
            type="button"
            variant="secondary"
          >
            Print view
          </Button>
          <Button onClick={() => onOpenChange(false)} type="button">
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
