// ============================================================
// pagination/index.ts (React plugin)
// ============================================================
import { toPlatePlugin } from 'platejs/react';
import { BasePaginationPlugin } from './BasePaginationPlugin';
import { PageElement } from './PageElement';

export const PaginationPlugin = toPlatePlugin(BasePaginationPlugin, {
  render: {
    node: PageElement,
  },
});

export {
  createAlwaysLeader,
  createAwarenessLeaderElection,
} from './leaderElection';
export { PaginationCoordinator } from './PaginationCoordinator';
export { PaginationRegistryProvider, usePaginationRegistry } from './registry';
export type {
  DocumentSettings,
  LeaderElection,
  PageDom,
  ReflowOptions,
} from './types';
export { YjsPaginationBridge } from './YjsIntegration';
