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

type ApplyDeepToNodesContext<N extends TNode> = {
  apply: (
    node: NodeOf<N>,
    source: (() => Record<string, any>) | Record<string, any>
  ) => void;
  source: (() => Record<string, any>) | Record<string, any>;
  query?: QueryNodeOptions;
};

const _applyDeepToNodes = <N extends TNode>(
  node: N,
  path: Path,
  context: ApplyDeepToNodesContext<N>
) => {
  const { apply, source, query } = context;
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
    _applyDeepToNodes(child as any, path.concat([i]), context);
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
  const context: ApplyDeepToNodesContext<N> = {
    apply,
    source,
    query,
  };
  _applyDeepToNodes(node, path, context);
};
