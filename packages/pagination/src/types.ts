export type PageDom = {
  outer: HTMLDivElement;
  content: HTMLDivElement;
};

export type PaginationRuntime = {
  markDirty: (pageIndex: number) => void;
  consumeDirtyMin: () => number | null;
  subscribe: (fn: () => void) => () => void;
};

export type ReflowOptions = {
  enabled: boolean;
  debounceMs: number;
  maxPagesPerIdle: number;
  maxMovesPerPage: number;
  underflow: boolean;
  allowTextSplit: boolean;
  overflowThresholdPx: number;
  underflowThresholdPx: number; // Hysteresis buffer
};

export type ReflowContext = {
  pageDom: PageDom;
  nextPageDom: PageDom | undefined;
  opts: ReflowOptions;
};

export type CollaborationOptions = {
  mode: 'all' | 'leader';
  isLeader?: () => boolean;
};

export type DocumentSettings = {
  sizes: { width: number; height: number };
  margins: { top: number; right: number; bottom: number; left: number };
};
export type LeaderElection = {
  amILeader: () => boolean;
  subscribe: (callback: () => void) => () => void;
  destroy: () => void;
};

export type ViewMode = 'paginated' | 'continuous';
