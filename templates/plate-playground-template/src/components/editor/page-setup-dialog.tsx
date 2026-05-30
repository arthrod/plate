'use client';

import {
  type FootnoteMode,
  getPresetPageSpec,
  type LengthUnit,
  lengthToPx,
  normalizePageNumber,
  PAGE_NUMBER_CUSTOM_MAX,
  type PageNumberAlign,
  type PageNumberConfig,
  type PageNumberFormat,
  type PageNumberLocation,
  type PageSetupConfig,
  pxToLength,
} from '@platejs/pagination';
import type * as React from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Separator } from '@/components/ui/separator';

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

const PAGE_NUMBER_FORMATS: { label: string; value: PageNumberFormat }[] = [
  { label: 'None', value: 'none' },
  { label: 'Arabic (1, 2, 3)', value: 'arabic' },
  { label: 'Roman upper (I, II)', value: 'roman-upper' },
  { label: 'Roman lower (i, ii)', value: 'roman-lower' },
  { label: 'Custom text', value: 'custom' },
];

const PAGE_NUMBER_LOCATIONS: { label: string; value: PageNumberLocation }[] = [
  { label: 'None', value: 'none' },
  { label: 'Top (above header)', value: 'top' },
  { label: 'Bottom (below footer)', value: 'bottom' },
];

const PAGE_NUMBER_ALIGNS: { label: string; value: PageNumberAlign }[] = [
  { label: 'Left', value: 'left' },
  { label: 'Center', value: 'center' },
  { label: 'Right', value: 'right' },
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
      <span className="font-medium text-muted-foreground text-xs tracking-wide">
        {label}
      </span>
      {children}
    </div>
  );
}

/** A titled group of fields — tier 1 of the dialog's two-tier label hierarchy. */
function Section({
  children,
  title,
}: {
  children: React.ReactNode;
  title: React.ReactNode;
}) {
  return (
    <section className="grid gap-3">
      <h3 className="font-medium text-foreground text-sm leading-none">
        {title}
      </h3>
      {children}
    </section>
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

  // Patch the page number, auto-filling format/location reciprocally.
  const setPageNumber = (patch: Partial<PageNumberConfig>) =>
    onChange({
      pageNumber: normalizePageNumber({ ...value.pageNumber, ...patch }),
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

        <div className="grid gap-6 py-1">
          <Section title="Page">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Size">
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
          </Section>

          <Separator className="bg-border/60" />

          <Section
            title={
              <>
                Margins
                <span className="ml-1.5 font-normal text-muted-foreground text-xs">
                  ({unit})
                </span>
              </>
            }
          >
            <div className="grid grid-cols-4 gap-2">
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
                    onChange={(e) => setMargin(key, Number(e.target.value) || 0)}
                    step="any"
                    type="number"
                    value={display(value.margins[key], unit)}
                  />
                </Field>
              ))}
            </div>
          </Section>

          <Separator className="bg-border/60" />

          <Section title="Page numbers">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Format">
                <Select
                  onValueChange={(v) =>
                    setPageNumber({ format: v as PageNumberFormat })
                  }
                  value={value.pageNumber.format}
                >
                  <SelectTrigger data-testid="page-number-format">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAGE_NUMBER_FORMATS.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Location">
                <Select
                  onValueChange={(v) =>
                    setPageNumber({ location: v as PageNumberLocation })
                  }
                  value={value.pageNumber.location}
                >
                  <SelectTrigger data-testid="page-number-location">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAGE_NUMBER_LOCATIONS.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Align">
                <Select
                  onValueChange={(v) =>
                    setPageNumber({ align: v as PageNumberAlign })
                  }
                  value={value.pageNumber.align}
                >
                  <SelectTrigger data-testid="page-number-align">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAGE_NUMBER_ALIGNS.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            {value.pageNumber.format === 'custom' && (
              <Field label="Custom text — use {n} and {total}">
                <Input
                  data-testid="page-number-custom"
                  maxLength={PAGE_NUMBER_CUSTOM_MAX}
                  onChange={(e) =>
                    setPageNumber({
                      customText: e.target.value.slice(
                        0,
                        PAGE_NUMBER_CUSTOM_MAX
                      ),
                    })
                  }
                  value={value.pageNumber.customText ?? ''}
                />
              </Field>
            )}

            <label className="flex items-center gap-2.5 text-foreground text-sm">
              <Checkbox
                checked={Boolean(value.pageNumber.differentFirstPage)}
                data-testid="page-number-first"
                onCheckedChange={(c) =>
                  setPageNumber({ differentFirstPage: c === true })
                }
              />
              Different first page
              <span className="text-muted-foreground">
                (no page number on page 1)
              </span>
            </label>
          </Section>

          <Separator className="bg-border/60" />

          <Section title="Footnotes">
            <Field label="Mode">
              <Select
                onValueChange={(v) => onChange({ footnotes: v as FootnoteMode })}
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
          </Section>
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
