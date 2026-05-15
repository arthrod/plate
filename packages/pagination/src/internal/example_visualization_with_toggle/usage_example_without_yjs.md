// ============================================================
// Usage Example (without Yjs)
// ============================================================
import { Plate, PlateContent } from 'platejs/react';
import {
  PaginationCoordinator,
  PaginationPlugin,
  PaginationRegistryProvider,
} from '../index';

export function Editor() {
  return (
    <PaginationRegistryProvider>
      <Plate
        plugins={[
          PaginationPlugin.configure({
            options: {
              documentSettings: {
                sizes: { width: 816, height: 1056 },
                margins: { top: 96, right: 96, bottom: 96, left: 96 },
              },
              reflow: {
                enabled: true,
                debounceMs: 100,
                underflowThresholdPx: 80,
              },
            },
          }),
          // ... other plugins
        ]}
        initialValue={[
          { type: 'page', children: [{ type: 'p', children: [{ text: '' }] }] },
        ]}
      >
        <PaginationCoordinator />
        <PlateContent className="min-h-screen bg-gray-100 py-8" />
      </Plate>
    </PaginationRegistryProvider>
  );
}
