'use client';

import * as React from 'react';

import { FileDownIcon } from 'lucide-react';
import { useEditorRef } from 'platejs/react';

import { ToolbarButton } from './toolbar';

export interface ExportDocxToolbarButtonProps {
  /** Default filename for the downloaded document */
  filename?: string;
}

export function ExportDocxToolbarButton({
  filename = 'document.docx',
}: ExportDocxToolbarButtonProps) {
  const editor = useEditorRef();
  const [isExporting, setIsExporting] = React.useState(false);

  const handleExport = React.useCallback(async () => {
    if (isExporting) return;

    setIsExporting(true);

    try {
      // Use the editor's downloadDocx API if available
      if ('downloadDocx' in editor.api) {
        await (editor.api as { downloadDocx: (options?: object, filename?: string) => Promise<void> }).downloadDocx({}, filename);
      } else {
        console.warn('ExportDocxPlugin is not installed. Add ExportDocxKit to your editor plugins.');
      }
    } catch (error) {
      console.error('Failed to export DOCX:', error);
    } finally {
      setIsExporting(false);
    }
  }, [editor, filename, isExporting]);

  return (
    <ToolbarButton
      onClick={handleExport}
      data-plate-prevent-overlay
      data-testid="export-docx"
      disabled={isExporting}
      tooltip="Export to Word"
    >
      <FileDownIcon className={isExporting ? 'animate-pulse' : ''} />
    </ToolbarButton>
  );
}
