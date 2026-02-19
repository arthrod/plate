import { createFileRoute } from '@tanstack/react-router';
import { Suspense, lazy } from 'react';

const PlateEditor = lazy(() => import('@/registry/blocks/editor-ai/components/editor/plate-editor').then(m => ({ default: m.PlateEditor })));

export const Route = createFileRoute('/editor/$docId')({
  component: EditorPage,
});

function EditorPage() {
  const { docId } = Route.useParams();
  return (
    <div className="h-screen w-full">
      <Suspense fallback={<EditorSkeleton />}>
        <PlateEditor docId={docId} />
      </Suspense>
    </div>
  );
}

function EditorSkeleton() {
  return (
    <div className="h-screen w-full animate-pulse">
      <div className="h-12 border-b bg-muted/30" />
      <div className="mx-auto mt-8 max-w-3xl space-y-3 px-6">
        <div className="h-8 w-3/4 rounded bg-muted/20" />
        <div className="h-4 w-full rounded bg-muted/10" />
        <div className="h-4 w-5/6 rounded bg-muted/10" />
        <div className="h-4 w-full rounded bg-muted/10" />
      </div>
    </div>
  );
}
