'use client';

import type { ChromeTextStyle, PageSetupConfig } from '@platejs/pagination';
import {
  BoldIcon,
  ItalicIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from 'lucide-react';
import * as React from 'react';

import {
  ColorDropdownMenuItems,
  DEFAULT_COLORS,
} from '@/components/ui/font-color-toolbar-button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarSeparator,
} from '@/components/ui/toolbar';
import { cn } from '@/lib/utils';

type Band = 'footer' | 'header';
/** Which region the typography controls target. */
type StyleRegion = 'footer' | 'footnote' | 'header' | 'pageNumber';

const FONTS = [
  { label: 'Sans', value: 'ui-sans-serif, system-ui, sans-serif' },
  { label: 'Serif', value: 'Georgia, "Times New Roman", serif' },
  { label: 'Mono', value: 'ui-monospace, "Courier New", monospace' },
];
const SIZES = [9, 10, 11, 12, 14, 16, 18, 24];
const REGIONS: { label: string; value: StyleRegion }[] = [
  { label: 'Header text', value: 'header' },
  { label: 'Footer text', value: 'footer' },
  { label: 'Page number', value: 'pageNumber' },
  { label: 'Footnote', value: 'footnote' },
];

function textCss(style: ChromeTextStyle | undefined): React.CSSProperties {
  return {
    color: style?.color,
    fontFamily: style?.fontFamily,
    fontSize: style?.fontSize,
    fontStyle: style?.italic ? 'italic' : undefined,
    fontWeight: style?.bold ? 600 : undefined,
  };
}

/**
 * Google-Docs-style margins mode. The header and footer become editable regions
 * inside the page's margins — a dimmed body, a hairline + corner label per band,
 * full-width single-line editable header/footer. A floating toolbar styles the
 * selected region (header / footer / page number / footnote) with inline marks +
 * font/size/color. Persists to the page_setup node. Click outside to exit.
 */
export function MarginsMode({
  onChange,
  onExit,
  value,
}: {
  onChange: (patch: Partial<PageSetupConfig>) => void;
  onExit: () => void;
  value: PageSetupConfig;
}) {
  const headerRef = React.useRef<HTMLDivElement>(null);
  const footerRef = React.useRef<HTMLDivElement>(null);
  const [activeBand, setActiveBand] = React.useState<Band>('header');
  const [region, setRegion] = React.useState<StyleRegion>('header');

  const seededRef = React.useRef(false);
  React.useEffect(() => {
    if (seededRef.current) return;
    seededRef.current = true;
    if (headerRef.current) {
      headerRef.current.innerHTML =
        value.header?.html ?? value.header?.text ?? '';
    }
    if (footerRef.current) {
      footerRef.current.innerHTML =
        value.footer?.html ?? value.footer?.text ?? '';
    }
  }, [value]);

  React.useEffect(() => {
    const onDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target?.closest('[data-margins-ui]')) onExit();
    };
    document.addEventListener('pointerdown', onDown, true);

    return () => document.removeEventListener('pointerdown', onDown, true);
  }, [onExit]);

  const saveBand = (band: Band) => {
    const html =
      (band === 'header' ? headerRef : footerRef).current?.innerHTML ?? '';
    onChange({ [band]: { ...value[band], html } } as Partial<PageSetupConfig>);
  };

  const exec = (command: string) => {
    document.execCommand(command);
    saveBand(activeBand);
  };

  const regionStyle: ChromeTextStyle | undefined =
    region === 'pageNumber'
      ? value.pageNumberStyle
      : region === 'footnote'
        ? value.footnoteStyle
        : value[region]?.style;

  const setRegionStyle = (patch: Partial<ChromeTextStyle>) => {
    const next = { ...regionStyle, ...patch };
    if (region === 'pageNumber') onChange({ pageNumberStyle: next });
    else if (region === 'footnote') onChange({ footnoteStyle: next });
    else
      onChange({
        [region]: { ...value[region], style: next },
      } as Partial<PageSetupConfig>);
  };

  const marksDisabled = region === 'footnote' || region === 'pageNumber';

  const band = (which: Band) => {
    const ref = which === 'header' ? headerRef : footerRef;
    const heightPx =
      which === 'header' ? value.margins.topPx : value.margins.bottomPx;

    return (
      <div
        className={cn(
          'absolute z-10 flex items-center px-1 transition-colors',
          which === 'header'
            ? 'border-border border-b'
            : 'border-border border-t',
          activeBand === which ? 'bg-background' : 'bg-background/90'
        )}
        data-margins-ui=""
        style={{
          height: heightPx,
          left: value.margins.leftPx,
          right: value.margins.rightPx,
          ...(which === 'header' ? { top: 0 } : { bottom: 0 }),
        }}
      >
        <span
          className={cn(
            'pointer-events-none absolute top-1 left-1 select-none text-[10px] uppercase leading-none tracking-[0.08em] transition-colors',
            activeBand === which
              ? 'text-foreground/65'
              : 'text-muted-foreground/55'
          )}
        >
          {which}
        </span>
        {/* Full-width single-line editable header/footer (the page number is its
            own band, configured in Page setup). */}
        <div
          className={cn(
            'flex h-full w-full items-center rounded-sm px-1.5 text-left outline-none transition-[box-shadow] focus:ring-2 focus:ring-ring/60',
            activeBand === which && 'ring-1 ring-ring/35'
          )}
          contentEditable
          data-testid={`margins-${which}`}
          onFocus={() => {
            setActiveBand(which);
            setRegion(which);
          }}
          onInput={() => saveBand(which)}
          ref={ref}
          style={textCss(value[which]?.style)}
          suppressContentEditableWarning
        />
      </div>
    );
  };

  return (
    <>
      {/* Dim the body so the page chrome reads as the active surface. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute z-[5] bg-background/60 backdrop-blur-[0.5px]"
        data-print-hide=""
        style={{
          bottom: value.margins.bottomPx,
          left: 0,
          right: 0,
          top: value.margins.topPx,
        }}
      />

      <div
        className="fixed left-1/2 z-40 -translate-x-1/2"
        data-margins-ui=""
        data-testid="margins-toolbar"
        onMouseDown={(e) => e.preventDefault()}
        style={{ top: 60 }}
      >
        <Toolbar className="gap-0.5 rounded-lg border bg-popover px-1 py-1 text-popover-foreground shadow-lg ring-1 ring-black/[0.02]">
          <ToolbarGroup>
            <Select
              onValueChange={(v) => setRegion(v as StyleRegion)}
              value={region}
            >
              <SelectTrigger
                className="h-8 w-[130px] border-0 text-sm"
                data-testid="mm-region"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {REGIONS.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </ToolbarGroup>
          <ToolbarSeparator />
          <ToolbarGroup>
            <ToolbarButton
              data-testid="mm-bold"
              disabled={marksDisabled}
              onClick={() => exec('bold')}
              tooltip="Bold"
            >
              <BoldIcon />
            </ToolbarButton>
            <ToolbarButton
              data-testid="mm-italic"
              disabled={marksDisabled}
              onClick={() => exec('italic')}
              tooltip="Italic"
            >
              <ItalicIcon />
            </ToolbarButton>
            <ToolbarButton
              data-testid="mm-underline"
              disabled={marksDisabled}
              onClick={() => exec('underline')}
              tooltip="Underline"
            >
              <UnderlineIcon />
            </ToolbarButton>
            <ToolbarButton
              data-testid="mm-strike"
              disabled={marksDisabled}
              onClick={() => exec('strikeThrough')}
              tooltip="Strikethrough"
            >
              <StrikethroughIcon />
            </ToolbarButton>
          </ToolbarGroup>
          <ToolbarSeparator />
          <ToolbarGroup>
            <Select
              onValueChange={(v) => setRegionStyle({ fontFamily: v })}
              value={regionStyle?.fontFamily ?? FONTS[0].value}
            >
              <SelectTrigger
                className="h-8 w-[88px] border-0 text-sm"
                data-testid="mm-font"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FONTS.map((f) => (
                  <SelectItem key={f.value} value={f.value}>
                    {f.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              onValueChange={(v) => setRegionStyle({ fontSize: Number(v) })}
              value={String(regionStyle?.fontSize ?? 11)}
            >
              <SelectTrigger
                className="h-8 w-[64px] border-0 text-sm"
                data-testid="mm-size"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SIZES.map((s) => (
                  <SelectItem key={s} value={String(s)}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <ToolbarButton data-testid="mm-color" tooltip="Text color">
                  <span
                    className="size-4 rounded-full border"
                    style={{ background: regionStyle?.color ?? 'currentColor' }}
                  />
                </ToolbarButton>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2" data-margins-ui="">
                <ColorDropdownMenuItems
                  color={regionStyle?.color}
                  colors={DEFAULT_COLORS}
                  updateColor={(c: string) => setRegionStyle({ color: c })}
                />
              </PopoverContent>
            </Popover>
          </ToolbarGroup>
          <ToolbarSeparator />
          <span className="flex select-none items-center gap-1.5 pr-2 pl-1 text-muted-foreground text-xs">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-foreground/40"
            />
            {REGIONS.find((r) => r.value === region)?.label ?? region}
          </span>
        </Toolbar>
      </div>

      {band('header')}
      {band('footer')}
    </>
  );
}
