import * as platejs_react0 from "platejs/react";
import * as platejs0 from "platejs";
import { PluginConfig } from "platejs";
import React from "react";
import { Awareness } from "y-protocols/awareness";
import * as Y from "yjs";

//#region src/types.d.ts
type PageDom = {
  outer: HTMLDivElement;
  content: HTMLDivElement;
};
type ReflowOptions = {
  enabled: boolean;
  debounceMs: number;
  maxPagesPerIdle: number;
  maxMovesPerPage: number;
  underflow: boolean;
  allowTextSplit: boolean;
  overflowThresholdPx: number;
  underflowThresholdPx: number;
};
type CollaborationOptions = {
  mode: 'all' | 'leader';
  isLeader?: () => boolean;
};
type DocumentSettings = {
  sizes: {
    width: number;
    height: number;
  };
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
};
type LeaderElection = {
  amILeader: () => boolean;
  subscribe: (callback: () => void) => () => void;
  destroy: () => void;
};
type ViewMode = 'paginated' | 'continuous';
//#endregion
//#region src/BasePaginationPlugin.d.ts
type PaginationConfig = PluginConfig<'pagination', {
  documentSettings: DocumentSettings;
  reflow: ReflowOptions;
  collaboration: CollaborationOptions;
  defaultBlockType: string;
  viewMode: ViewMode;
}, {}>;
declare const BasePaginationPlugin: platejs0.SlatePlugin<PaginationConfig>;
//#endregion
//#region src/leaderElection.d.ts
declare function createAwarenessLeaderElection(awareness: Awareness, ydoc: Y.Doc): LeaderElection;
declare function createAlwaysLeader(): LeaderElection;
//#endregion
//#region src/PaginationCoordinator.d.ts
type CoordinatorProps = {
  leaderElection?: LeaderElection;
  canProcess?: boolean;
};
declare function PaginationCoordinator({
  leaderElection,
  canProcess
}: CoordinatorProps): null;
//#endregion
//#region src/registry.d.ts
type Registry = {
  registerPage: (pageIndex: number, dom: PageDom) => () => void;
  getPageDom: (pageIndex: number) => PageDom | undefined;
  getKnownPages: () => number[];
};
declare function PaginationRegistryProvider({
  children
}: {
  children: React.ReactNode;
}): React.JSX.Element;
declare function usePaginationRegistry(): Registry | null;
//#endregion
//#region src/YjsIntegration.d.ts
declare function YjsPaginationBridge(): React.JSX.Element;
//#endregion
//#region src/index.d.ts
declare const PaginationPlugin: platejs_react0.PlatePlugin<platejs0.PluginConfig<"pagination", {
  documentSettings: DocumentSettings;
  reflow: ReflowOptions;
  collaboration: CollaborationOptions;
  defaultBlockType: string;
  viewMode: ViewMode;
}, {}, {}, {}>>;
//#endregion
export { BasePaginationPlugin, type DocumentSettings, type LeaderElection, type PageDom, PaginationCoordinator, PaginationPlugin, PaginationRegistryProvider, type ReflowOptions, YjsPaginationBridge, createAlwaysLeader, createAwarenessLeaderElection, usePaginationRegistry };
//# sourceMappingURL=index.d.ts.map