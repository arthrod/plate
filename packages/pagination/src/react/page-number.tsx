import * as React from 'react';

import type { PageNumberConfig } from '../lib/types';

export type PageNumberProps = {
  config: PageNumberConfig | undefined;
  pageIndex: number;
  totalPages: number;
};

/**
 * Page-number renderer driven by `BasePaginationOptions.pageNumber`.
 *
 * Returns null when disabled (`config === undefined`) or when
 * `hideOnFirst` is true on `pageIndex === 0`. Numbering counts from
 * `config.startAt` so a contents page can begin at "iii" or page 5.
 */
export const PageNumber = ({
  config,
  pageIndex,
  totalPages,
}: PageNumberProps): React.JSX.Element | null => {
  if (!config) return null;
  if (config.hideOnFirst && pageIndex === 0) return null;

  const current = pageIndex + config.startAt;
  let text: string;

  switch (config.format) {
    case '1/N': {
      text = `${current}/${totalPages}`;
      break;
    }
    case 'Page 1 of N': {
      text = `Page ${current} of ${totalPages}`;
      break;
    }
    default: {
      text = `${current}`;
      break;
    }
  }

  return (
    <div
      data-plate-pagination-page-number=""
      style={{
        pointerEvents: 'none',
        textAlign: config.align,
        width: '100%',
      }}
    >
      {text}
    </div>
  );
};
