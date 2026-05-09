'use client';

import dynamic from 'next/dynamic';
import { Toaster } from 'sonner';

const PlateEditor = dynamic(
  () =>
    import('@/registry/blocks/editor-ai/components/editor/plate-editor').then(
      (mod) => mod.PlateEditor
    ),
  { ssr: false }
);

export default function Page() {
  return (
    <div className="h-screen w-full">
      <PlateEditor />

      <Toaster />
    </div>
  );
}
