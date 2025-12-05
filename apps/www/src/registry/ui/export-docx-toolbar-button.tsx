'use client';

import * as React from 'react';

import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu';

import { DocxExportPlugin } from '@platejs/docx-export';
import { FileTextIcon } from 'lucide-react';
import { useEditorRef } from 'platejs/react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { ToolbarButton } from './toolbar';

export interface ExportDocxToolbarButtonProps extends DropdownMenuProps {
  /** Custom filename for the downloaded file (without extension) */
  filename?: string;
}

/**
 * Toolbar button for exporting editor content to DOCX format.
 *
 * Uses the DocxExportPlugin to convert Plate content to a Word document.
 */
export function ExportDocxToolbarButton({
  filename = 'document',
  ...props
}: ExportDocxToolbarButtonProps) {
  const editor = useEditorRef<{
    api: { docxExport: { export: typeof DocxExportPlugin.api.export } };
  }>();
  const [open, setOpen] = React.useState(false);
  const [isExporting, setIsExporting] = React.useState(false);

  const downloadDocx = async (blob: Blob, name: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${name}.docx`;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const exportToDocx = async () => {
    if (isExporting) return;

    setIsExporting(true);

    try {
      const docx = await editor.api.docxExport.export({
        documentOptions: {
          title: filename,
        },
      });

      // In browser, docx is a Blob
      const blob = docx as Blob;
      await downloadDocx(blob, filename);
    } catch (error) {
      console.error('Failed to export DOCX:', error);
    } finally {
      setIsExporting(false);
      setOpen(false);
    }
  };

  const exportToDocxWithOptions = async (options: 'portrait' | 'landscape') => {
    if (isExporting) return;

    setIsExporting(true);

    try {
      const docx = await editor.api.docxExport.export({
        documentOptions: {
          orientation: options,
          title: filename,
        },
      });

      const blob = docx as Blob;
      await downloadDocx(blob, filename);
    } catch (error) {
      console.error('Failed to export DOCX:', error);
    } finally {
      setIsExporting(false);
      setOpen(false);
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false} {...props}>
      <DropdownMenuTrigger asChild>
        <ToolbarButton pressed={open} tooltip="Export to DOCX" isDropdown>
          <FileTextIcon className="size-4" />
        </ToolbarButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start">
        <DropdownMenuGroup>
          <DropdownMenuItem
            disabled={isExporting}
            onSelect={(e) => {
              e.preventDefault();
              void exportToDocx();
            }}
          >
            {isExporting ? 'Exporting...' : 'Export as DOCX'}
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={isExporting}
            onSelect={(e) => {
              e.preventDefault();
              void exportToDocxWithOptions('portrait');
            }}
          >
            Export as DOCX (Portrait)
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={isExporting}
            onSelect={(e) => {
              e.preventDefault();
              void exportToDocxWithOptions('landscape');
            }}
          >
            Export as DOCX (Landscape)
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
