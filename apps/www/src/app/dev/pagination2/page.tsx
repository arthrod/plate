import { PaginationView } from './pagination2-view';

// Browser-only: the layout engine measures real DOM, so don't prerender.
export const dynamic = 'force-dynamic';

export default function Page() {
  return <PaginationView />;
}
