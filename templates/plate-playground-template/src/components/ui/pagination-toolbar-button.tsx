'use client';

import { BasePaginationPlugin } from '@platejs/pagination';
import { LayoutTemplateIcon } from 'lucide-react';
import {
  useEditorRef,
  useEditorValue,
  usePluginOption,
} from 'platejs/react';
import * as React from 'react';
import { toast } from 'sonner';

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

type PageSize = 'A4' | 'Legal' | 'Letter';
type Margins = { bottom: number; left: number; right: number; top: number };

type PaginationOptions = {
  footerVisible?: boolean;
  headerVisible?: boolean;
  margins?: Margins;
  pageSize?: PageSize | { height: number; width: number };
  previewVisible?: boolean;
};

type PaginationTransforms = {
  setMargins?: (m: Margins) => void;
  setPageSize?: (s: PageSize) => void;
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

const resolveSizeKey = (
  size: PaginationOptions['pageSize']
): string => {
  if (typeof size === 'string') return size;
  if (size && typeof size === 'object') return 'Custom';

  return 'A4';
};

export function PaginationToolbarButton() {
  const editor = useEditorRef();
  const [open, setOpen] = React.useState(false);

  const previewVisible = usePluginOption(
    BasePaginationPlugin,
    'previewVisible'
  ) as boolean | undefined;
  const pageSize = usePluginOption(
    BasePaginationPlugin,
    'pageSize'
  ) as PaginationOptions['pageSize'];
  const margins = usePluginOption(
    BasePaginationPlugin,
    'margins'
  ) as Margins | undefined;

  const value = useEditorValue();
  const headerPresent = (value as Array<{ type?: string }>).some(
    (n) => n.type === 'header'
  );
  const footerPresent = (value as Array<{ type?: string }>).some(
    (n) => n.type === 'footer'
  );

  const tf = (
    editor.tf as unknown as { pagination?: PaginationTransforms }
  ).pagination;

  if (!tf) {
    return (
      <ToolbarButton
        data-plate-prevent-overlay
        onClick={() => toast('Pagination plugin not available')}
        tooltip="Pagination"
      >
        <LayoutTemplateIcon />
      </ToolbarButton>
    );
  }

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
          onValueChange={(v) => tf.setPageSize?.(v as PageSize)}
          value={resolveSizeKey(pageSize)}
        >
          <DropdownMenuRadioItem value="A4">A4 (210×297 mm)</DropdownMenuRadioItem>
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
