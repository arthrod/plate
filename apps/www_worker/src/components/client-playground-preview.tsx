'use client';

import type { ComponentPropsWithoutRef } from 'react';

import dynamic from 'next/dynamic';

const PlaygroundPreview = dynamic(
  () => import('./playground-preview').then((mod) => mod.PlaygroundPreview),
  {
    loading: () => (
      <div className="flex min-h-[350px] items-center justify-center rounded-lg border bg-background text-muted-foreground text-sm">
        Loading preview...
      </div>
    ),
    ssr: false,
  }
);

export function ClientPlaygroundPreview(
  props: ComponentPropsWithoutRef<'div'> & { block?: any }
) {
  return <PlaygroundPreview {...props} />;
}
