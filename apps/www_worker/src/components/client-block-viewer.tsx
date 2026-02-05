'use client';

import type { ComponentProps } from 'react';

import dynamic from 'next/dynamic';

const BlockViewer = dynamic(
  () => import('./block-viewer').then((mod) => mod.BlockViewer),
  {
    loading: () => (
      <div className="flex min-h-[350px] items-center justify-center text-sm text-muted-foreground">
        Loading block...
      </div>
    ),
    ssr: false,
  }
);

export function ClientBlockViewer(
  props: ComponentProps<typeof BlockViewer>
) {
  return <BlockViewer {...props} />;
}
