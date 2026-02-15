import {
  type NodeEntry,
  type NodeOf,
  type Path,
  type QueryNodeOptions,
  type TNode,
  NodeApi,
  queryNode,
} from '@platejs/slate';

export type ApplyDeepToNodesOptions<N extends TNode> = {
  // Function to call on each node following the query.
  apply: (
    node: NodeOf<N>,
    source: (() => Record<string, any>) | Record<string, any>
  ) => void;
  // The destination node object.
  node: N;
  // The source object. Can be a factory.
  source: (() => Record<string, any>) | Record<string, any>;
  path?: Path;
  // Query to filter the nodes.
  query?: QueryNodeOptions;
};

// biome-ignore lint/nursery/useMaxParams: Performance optimization
const _applyDeepToNodes = <N extends TNode>(
  node: N,
  source: (() => Record<string, any>) | Record<string, any>,
  path: Path,
  apply: (
    node: NodeOf<N>,
    source: (() => Record<string, any>) | Record<string, any>
  ) => void,
  query?: QueryNodeOptions
) => {
  const entry: NodeEntry<N> = [node, path];

  if (queryNode<N>(entry, query)) {
    if (typeof source === 'function') {
      apply(node, source());
    } else {
      apply(node, source);
    }
  }

  if (!NodeApi.isAncestor(node)) return;

  const children = node.children;
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    _applyDeepToNodes(child as any, source, path.concat([i]), apply, query);
  }
};

/** Recursively apply an operation to children nodes with a query. */
export const applyDeepToNodes = <N extends TNode>({
  apply,
  node,
  path = [],
  query,
  source,
}: ApplyDeepToNodesOptions<N>) => {
  _applyDeepToNodes(node, source, path, apply, query);
};
