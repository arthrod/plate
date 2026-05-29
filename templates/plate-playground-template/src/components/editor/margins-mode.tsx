'use client';

import type { ChromeTextStyle, PageSetupConfig } from '@platejs/pagination';
import * as React from 'react';

type Band = 'footer' | 'header';

const FONTS = [
  { label: 'Sans', value: 'ui-sans-serif, system-ui, sans-serif' },
  { label: 'Serif', value: 'Georgia, "Times New Roman", serif' },
  { label: 'Mono', value: 'ui-monospace, "Courier New", monospace' },
];

function bandStyle(style: ChromeTextStyle | undefined): React.CSSProperties {
  return {
    color: style?.color,
    fontFamily: style?.fontFamily,
    fontSize: style?.fontSize,
  };
}

/**
 * Google-Docs-style margins mode: the header and footer become editable regions
 * inside the page's top/bottom margins, with a floating toolbar. Inline bold /
 * italic apply to the selection; font / size / color apply to the whole region.
 * Edits persist to the page_setup node. Rendered INSIDE the relatively-positioned
 * page container. Exit by clicking outside any margins-mode surface (or the
 * toggle, handled by the parent).
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
  const [active, setActive] = React.useState<Band>('header');

  // Seed each region's html once on enter; onInput keeps the node in sync after.
  // A ref guard runs the seed exactly once (re-seeding on every value change
  // would fight the caret) while keeping `value` in the dependency list.
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

  // Click-outside to exit (#5). Any margins-mode surface is tagged
  // data-margins-ui; a pointerdown outside all of them leaves the mode.
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
    saveBand(active);
  };

  const setStyle = (patch: Partial<ChromeTextStyle>) =>
    onChange({
      [active]: {
        ...value[active],
        style: { ...value[active]?.style, ...patch },
      },
    } as Partial<PageSetupConfig>);

  const activeStyle = value[active]?.style;

  return (
    <>
      <div
        data-margins-ui
        data-testid="margins-toolbar"
        // Keep the editor selection when pressing toolbar controls.
        onMouseDown={(e) => e.preventDefault()}
        style={{
          alignItems: 'center',
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: 8,
          boxShadow: '0 4px 14px rgba(15,23,42,0.14)',
          display: 'flex',
          gap: 6,
          left: '50%',
          padding: '6px 8px',
          position: 'absolute',
          top: -56,
          transform: 'translateX(-50%)',
          zIndex: 10,
        }}
      >
        <button
          className="rounded px-2 py-1 font-bold text-sm hover:bg-slate-100"
          data-testid="mm-bold"
          onClick={() => exec('bold')}
          type="button"
        >
          B
        </button>
        <button
          className="rounded px-2 py-1 text-sm italic hover:bg-slate-100"
          data-testid="mm-italic"
          onClick={() => exec('italic')}
          type="button"
        >
          I
        </button>
        <select
          className="rounded border px-1 py-1 text-sm"
          data-testid="mm-font"
          onChange={(e) => setStyle({ fontFamily: e.target.value })}
          value={activeStyle?.fontFamily ?? FONTS[0].value}
        >
          {FONTS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
        <input
          className="w-14 rounded border px-1 py-1 text-sm"
          data-testid="mm-size"
          min={6}
          onChange={(e) =>
            setStyle({ fontSize: Number(e.target.value) || undefined })
          }
          type="number"
          value={activeStyle?.fontSize ?? 11}
        />
        <input
          aria-label="Text color"
          data-testid="mm-color"
          onChange={(e) => setStyle({ color: e.target.value })}
          type="color"
          value={activeStyle?.color ?? '#475569'}
        />
        <span className="px-1 text-slate-400 text-xs">editing {active}</span>
      </div>

      <div
        contentEditable
        data-margins-ui
        data-testid="margins-header"
        onFocus={() => setActive('header')}
        onInput={() => saveBand('header')}
        ref={headerRef}
        style={{
          ...bandStyle(value.header?.style),
          alignItems: 'center',
          display: 'flex',
          height: value.margins.topPx,
          left: value.margins.leftPx,
          outline:
            active === 'header' ? '2px solid #3b82f6' : '1px dashed #93c5fd',
          position: 'absolute',
          right: value.margins.rightPx,
          top: 0,
        }}
        suppressContentEditableWarning
      />

      <div
        contentEditable
        data-margins-ui
        data-testid="margins-footer"
        onFocus={() => setActive('footer')}
        onInput={() => saveBand('footer')}
        ref={footerRef}
        style={{
          ...bandStyle(value.footer?.style),
          alignItems: 'center',
          bottom: 0,
          display: 'flex',
          height: value.margins.bottomPx,
          left: value.margins.leftPx,
          outline:
            active === 'footer' ? '2px solid #3b82f6' : '1px dashed #93c5fd',
          position: 'absolute',
          right: value.margins.rightPx,
        }}
        suppressContentEditableWarning
      />
    </>
  );
}
