import * as React from 'react';

import type { PageNumberConfig } from '../lib/types';

import { formatPageNumber } from '../lib/internal/format-page-number';

export type PageNumberProps = {
  /** Resolved configuration; pass `null` to render nothing. */
  config: PageNumberConfig | null | undefined;
  /** Zero-based index of the page being painted. */
  pageIndex: number;
  /** Total page count (used by `1/N` and `page-of-n` formats). */
  totalPages: number;
};

/**
 * Non-editable, structurally inert page-number renderer.
 *
 * Painted into a chrome region by `PageFrame` based on
 * {@link PageNumberConfig.region} and `align`. Rendered as a plain `<span>`
 * (not a Slate void) so body selection cannot delete or move it.
 *
 * Returns `null` when:
 * - `config` is unset (page numbers disabled),
 * - `config.hideOnFirst` is true and `pageIndex === 0`.
 */
export const PageNumber = ({
  config,
  pageIndex,
  totalPages,
}: PageNumberProps): React.JSX.Element | null => {
  if (!config) return null;
  if (config.hideOnFirst && pageIndex === 0) return null;

  const printed = (config.startAt ?? 1) + pageIndex;
  const text = formatPageNumber(config.format, printed, totalPages);

  if (text.length === 0) return null;

  return (
    <span
      data-plate-pagination-page-number=""
      data-pagination-align={config.align}
      style={{
        display: 'inline-block',
        flex: '0 0 auto',
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      {text}
    </span>
  );
};
