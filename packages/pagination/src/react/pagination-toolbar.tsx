import * as React from 'react';

import { useEditorRef, usePluginOption } from 'platejs/react';

import type {
  BasePaginationTransforms,
  PageSize,
  PaginationMode,
} from '../lib/types';

import { BasePaginationPlugin } from '../lib/base-pagination-plugin';

type DropdownChoice = {
  description?: string;
  label: string;
  mode: PaginationMode;
  size?: PageSize;
  value: string;
};

const CHOICES: readonly DropdownChoice[] = [
  { label: 'Standard', mode: 'standard', value: 'standard' },
  { label: 'A4', mode: 'paged', size: 'A4', value: 'A4' },
  { label: 'US Letter', mode: 'paged', size: 'Letter', value: 'Letter' },
  { label: 'Legal', mode: 'paged', size: 'Legal', value: 'Legal' },
  { label: 'Custom…', mode: 'paged', value: 'custom' },
];

/**
 * Single toolbar dropdown that owns BOTH the visualisation mode and the
 * paper preset. Picking a paper preset implies paged mode; picking
 * `Standard` flips to continuous flow.
 *
 * `Custom…` opens the margins dialog (toggled by raising the
 * `onCustomRequested` callback). The dialog itself is rendered by the host
 * application — keeping this component portable across UI libraries.
 */
export const PaginationToolbar = ({
  onCustomRequested,
}: {
  onCustomRequested?: () => void;
}): React.JSX.Element => {
  const editor = useEditorRef();
  const mode = usePluginOption(BasePaginationPlugin, 'mode');
  const pageSize = usePluginOption(BasePaginationPlugin, 'pageSize');

  const currentValue = React.useMemo(() => {
    if (mode === 'standard') return 'standard';

    if (typeof pageSize === 'string') return pageSize;

    return 'custom';
  }, [mode, pageSize]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const value = event.target.value;
    const tf = editor.tf as unknown as BasePaginationTransforms;

    if (value === 'custom') {
      tf.pagination.setMode('paged');
      onCustomRequested?.();

      return;
    }

    const choice = CHOICES.find((c) => c.value === value);
    if (!choice) return;

    tf.pagination.setMode(choice.mode);

    if (choice.size !== undefined) {
      tf.pagination.setPageSize(choice.size);
    }
  };

  return (
    <label
      data-plate-pagination-toolbar=""
      style={{
        alignItems: 'center',
        display: 'inline-flex',
        fontSize: 13,
        gap: 6,
      }}
    >
      <span style={{ color: 'rgba(15,23,42,0.6)' }}>Page</span>
      <select
        aria-label="Page mode and size"
        onChange={handleChange}
        value={currentValue}
        style={{
          background: '#fff',
          border: '1px solid rgba(15,23,42,0.18)',
          borderRadius: 4,
          padding: '4px 8px',
        }}
      >
        {CHOICES.map((choice) => (
          <option key={choice.value} value={choice.value}>
            {choice.label}
          </option>
        ))}
      </select>
    </label>
  );
};
