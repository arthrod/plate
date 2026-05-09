'use client';

import * as React from 'react';

import {
  BasePaginationPlugin,
  type FootnotePlacement,
  type PageBorder,
  type PageMargins,
  type PageNumberConfig,
  type PageSize,
} from '@platejs/pagination';
import { PageSetupDialog } from '@platejs/pagination/react';
import {
  FileStackIcon,
  LayoutTemplateIcon,
  PanelRightIcon,
  ScissorsIcon,
  SettingsIcon,
} from 'lucide-react';
import { useEditorRef, useEditorValue, usePluginOption } from 'platejs/react';
import { toast } from 'sonner';

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { ToolbarButton } from './toolbar';

type PaginationTransforms = {
  insertPageBreak: () => void;
  setFirstPageDifferent: (next: boolean) => void;
  setFooterHeight: (px: number) => void;
  setFootnotePlacement: (placement: FootnotePlacement) => void;
  setHeaderHeight: (px: number) => void;
  setMargins: (margins: Partial<PageMargins>) => void;
  setPageBorder: (border: Partial<PageBorder>) => void;
  setPageNumber: (patch: Partial<PageNumberConfig>) => void;
  setPageSize: (size: PageSize) => void;
  toggleFooter: () => boolean;
  toggleHeader: () => boolean;
  togglePreview: () => boolean;
};

const MARGIN_PRESETS: Array<{
  label: string;
  value: PageMargins;
}> = [
  {
    label: 'Narrow',
    value: { bottom: 48, left: 48, right: 48, top: 48 },
  },
  {
    label: 'Document',
    value: { bottom: 96, left: 72, right: 72, top: 96 },
  },
  {
    label: 'Wide',
    value: { bottom: 128, left: 128, right: 128, top: 128 },
  },
];

const BORDER_PRESETS: Array<{
  label: string;
  value: PageBorder;
}> = [
  {
    label: 'Subtle',
    value: {
      color: 'rgba(15,23,42,0.15)',
      radius: 2,
      shadow: '0 1px 2px rgba(15,23,42,0.08)',
      style: 'solid',
      width: 1,
    },
  },
  {
    label: 'Strong',
    value: {
      color: 'rgba(15,23,42,0.35)',
      radius: 4,
      shadow: '0 8px 24px rgba(15,23,42,0.14)',
      style: 'solid',
      width: 2,
    },
  },
  {
    label: 'None',
    value: {
      color: 'transparent',
      radius: 0,
      shadow: 'none',
      style: 'none',
      width: 0,
    },
  },
];

const FOOTER_KEY = 'footer';
const HEADER_KEY = 'header';

const marginsEqual = (a: PageMargins | undefined, b: PageMargins): boolean =>
  !!a &&
  a.top === b.top &&
  a.right === b.right &&
  a.bottom === b.bottom &&
  a.left === b.left;

const resolveSizeKey = (size: PageSize | undefined): string => {
  if (typeof size === 'string') return size;
  if (size && typeof size === 'object') return 'Custom';

  return 'A4';
};

const resolveBorderKey = (border: PageBorder | undefined): string => {
  const match = BORDER_PRESETS.find(
    ({ value }) =>
      border?.style === value.style &&
      border.width === value.width &&
      border.color === value.color
  );

  return match?.label ?? 'Custom';
};

export function PaginationToolbarButton() {
  const editor = useEditorRef();
  const [open, setOpen] = React.useState(false);
  const [setupOpen, setSetupOpen] = React.useState(false);
  const value = useEditorValue();
  const previewVisible = usePluginOption(
    BasePaginationPlugin,
    'previewVisible'
  );
  const footnotePlacement = usePluginOption(
    BasePaginationPlugin,
    'footnotePlacement'
  );
  const pageSize = usePluginOption(BasePaginationPlugin, 'pageSize');
  const pageBorder = usePluginOption(BasePaginationPlugin, 'pageBorder');
  const margins = usePluginOption(BasePaginationPlugin, 'margins');
  const headerType = editor.getType(HEADER_KEY);
  const footerType = editor.getType(FOOTER_KEY);
  const nodes = value as Array<{ type?: string }>;
  const headerPresent = nodes.some(({ type }) => type === headerType);
  const footerPresent = nodes.some(({ type }) => type === footerType);
  const tf = (
    editor.tf as typeof editor.tf & { pagination?: PaginationTransforms }
  ).pagination;

  if (!tf) {
    return (
      <ToolbarButton
        data-plate-prevent-overlay
        onClick={() => toast('Pagination plugin is not enabled')}
        tooltip="Pagination"
      >
        <LayoutTemplateIcon />
      </ToolbarButton>
    );
  }

  return (
    <>
      <DropdownMenu modal={false} onOpenChange={setOpen} open={open}>
        <DropdownMenuTrigger asChild>
          <ToolbarButton
            data-plate-prevent-overlay
            isDropdown
            pressed={!!previewVisible}
            tooltip="Pagination"
          >
            <LayoutTemplateIcon />
          </ToolbarButton>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>Pages</DropdownMenuLabel>
          <DropdownMenuItem
            onSelect={() => {
              setSetupOpen(true);
            }}
          >
            <SettingsIcon />
            Page Setup…
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              tf.insertPageBreak();
              editor.tf.focus();
            }}
          >
            <ScissorsIcon />
            Split section
          </DropdownMenuItem>
          <DropdownMenuCheckboxItem
            checked={!!previewVisible}
            onCheckedChange={() => tf.togglePreview()}
          >
            <PanelRightIcon />
            Page preview
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={headerPresent}
            onCheckedChange={() => tf.toggleHeader()}
          >
            Header
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={footerPresent}
            onCheckedChange={() => tf.toggleFooter()}
          >
            Footer
          </DropdownMenuCheckboxItem>

          <DropdownMenuSeparator />

          <DropdownMenuLabel>Page size</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            onValueChange={(next) => tf.setPageSize(next as PageSize)}
            value={resolveSizeKey(pageSize)}
          >
            <DropdownMenuRadioItem value="A4">A4</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="Letter">Letter</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="Legal">Legal</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>

          <DropdownMenuSeparator />

          <DropdownMenuLabel>Margins</DropdownMenuLabel>
          {MARGIN_PRESETS.map(({ label, value }) => (
            <DropdownMenuCheckboxItem
              checked={marginsEqual(margins, value)}
              key={label}
              onCheckedChange={() => tf.setMargins(value)}
            >
              {label}
            </DropdownMenuCheckboxItem>
          ))}

          <DropdownMenuSeparator />

          <DropdownMenuLabel>Border</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            onValueChange={(label) => {
              const preset = BORDER_PRESETS.find((p) => p.label === label);

              if (preset) tf.setPageBorder(preset.value);
            }}
            value={resolveBorderKey(pageBorder)}
          >
            {BORDER_PRESETS.map(({ label }) => (
              <DropdownMenuRadioItem key={label} value={label}>
                {label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>

          <DropdownMenuSeparator />

          <DropdownMenuLabel>Footnotes</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            onValueChange={(next) =>
              tf.setFootnotePlacement(next as FootnotePlacement)
            }
            value={footnotePlacement ?? 'footer'}
          >
            <DropdownMenuRadioItem value="footer">
              <FileStackIcon />
              Page footer
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="documentEnd">
              End of document
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <PageSetupDialog onClose={() => setSetupOpen(false)} open={setupOpen} />
    </>
  );
}
