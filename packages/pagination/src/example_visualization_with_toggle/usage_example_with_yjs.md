// ============================================================
// Usage Example (with Yjs)
// ============================================================
import { YjsPlugin } from '@platejs/yjs/react';
import { Plate, PlateContent } from 'platejs/react';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';
import {
  PaginationPlugin,
  PaginationRegistryProvider,
  YjsPaginationBridge,
} from '../index';

const ydoc = new Y.Doc();
const provider = new WebsocketProvider(
  'wss://your-server.com',
  'room-id',
  ydoc
);

export function CollaborativeEditor() {
  return (
    <PaginationRegistryProvider>
      <Plate
        plugins={[
          YjsPlugin.configure({
            options: {
              ydoc,
              providers: [provider],
            },
          }),
          PaginationPlugin.configure({
            options: {
              collaboration: {
                mode: 'leader', // Use leader election
              },
              reflow: {
                enabled: true,
                debounceMs: 150, // Slightly longer for network latency
              },
            },
          }),
          // ... other plugins
        ]}
      >
        <YjsPaginationBridge />
        <PlateContent className="min-h-screen bg-gray-100 py-8" />
      </Plate>
    </PaginationRegistryProvider>
  );
}
