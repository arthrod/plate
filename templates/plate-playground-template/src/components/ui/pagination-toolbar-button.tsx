'use client';

import type { DocumentSettings, ViewMode } from '@platejs/pagination';
import { BasePaginationPlugin } from '@platejs/pagination';
import { LayoutTemplateIcon } from 'lucide-react';
import { useEditorRef, useEditorValue, usePluginOption } from 'platejs/react';
import * as React from 'react';

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { ToolbarButton } from './toolbar';

type Margins = { bottom: number; left: number; right: number; top: number };

type PaginationTransforms = {
  setMargins?: (m: Margins) => void;
  setPageSize?: (s: 'A4' | 'Legal' | 'Letter') => void;
  toggleFooter?: () => boolean;
  toggleHeader?: () => boolean;
  togglePreview?: () => boolean;
};

const MARGIN_PRESETS: Array<{ label: string; value: Margins }> = [
  {
    label: 'Narrow (48px)',
    value: { bottom: 48, left: 48, right: 48, top: 48 },
  },
  {
    label: 'Default (96px)',
    value: { bottom: 96, left: 72, right: 72, top: 96 },
  },
  {
    label: 'Wide (128px)',
    value: { bottom: 128, left: 128, right: 128, top: 128 },
  },
];

const marginsEqual = (a: Margins | undefined, b: Margins): boolean =>
  !!a &&
  a.top === b.top &&
  a.right === b.right &&
  a.bottom === b.bottom &&
  a.left === b.left;

const PAGE_SIZES: Record<string, { width: number; height: number }> = {
  A4: { width: 794, height: 1123 },
  Letter: { width: 816, height: 1056 },
  Legal: { width: 816, height: 1344 },
};

const resolveSizeKey = (
  sizes: { width: number; height: number } | undefined
): string => {
  if (!sizes) return 'A4';
  for (const [key, dims] of Object.entries(PAGE_SIZES)) {
    if (dims.width === sizes.width && dims.height === sizes.height) return key;
  }

  return 'Custom';
};

export function PaginationToolbarButton() {
  const editor = useEditorRef();
  const [open, setOpen] = React.useState(false);

  const viewMode = usePluginOption(BasePaginationPlugin, 'viewMode') as
    | ViewMode
    | undefined;
  const previewVisible = viewMode === 'paginated';
  const documentSettings = usePluginOption(
    BasePaginationPlugin,
    'documentSettings'
  ) as DocumentSettings | undefined;
  const margins = documentSettings?.margins;
  const pageSize = resolveSizeKey(documentSettings?.sizes);

  const value = useEditorValue();
  const headerPresent = (
    value as Array<{ type?: string; children?: Array<{ type?: string }> }>
  ).some(
    (page) => page.type === 'page' && page.children?.[0]?.type === 'header'
  );
  const footerPresent = (
    value as Array<{ type?: string; children?: Array<{ type?: string }> }>
  ).some((page) => {
    if (page.type !== 'page' || !page.children) return false;
    const last = page.children.at(-1);

    return last?.type === 'footer';
  });

  const tf =
    (editor.tf as unknown as { pagination?: PaginationTransforms })
      .pagination ?? {};

  return (
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
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Display</DropdownMenuLabel>
        <DropdownMenuCheckboxItem
          checked={!!previewVisible}
          onCheckedChange={() => tf.togglePreview?.()}
        >
          Page preview
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={headerPresent}
          onCheckedChange={() => tf.toggleHeader?.()}
        >
          Header
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={footerPresent}
          onCheckedChange={() => tf.toggleFooter?.()}
        >
          Footer
        </DropdownMenuCheckboxItem>

        <DropdownMenuSeparator />

        <DropdownMenuLabel>Page size</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          onValueChange={(v) =>
            tf.setPageSize?.(v as 'A4' | 'Letter' | 'Legal')
          }
          value={pageSize}
        >
          <DropdownMenuRadioItem value="A4">
            A4 (210×297 mm)
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="Letter">
            Letter (8.5×11 in)
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="Legal">
            Legal (8.5×14 in)
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>

        <DropdownMenuSeparator />

        <DropdownMenuLabel>Margins</DropdownMenuLabel>
        {MARGIN_PRESETS.map((p) => (
          <DropdownMenuCheckboxItem
            checked={marginsEqual(margins, p.value)}
            key={p.label}
            onCheckedChange={() => tf.setMargins?.(p.value)}
          >
            {p.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
