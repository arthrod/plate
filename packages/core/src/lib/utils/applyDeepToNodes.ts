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

/** Recursively apply an operation to children nodes with a query. */
export const applyDeepToNodes = <N extends TNode>({
  apply,
  node,
  path = [],
  query,
  source,
}: ApplyDeepToNodesOptions<N>) => {
  const _recurse = (currentNode: TNode, currentPath: Path) => {
    const entry: NodeEntry<TNode> = [currentNode, currentPath];

    if (queryNode(entry, query)) {
      if (typeof source === 'function') {
        apply(currentNode as any, source());
      } else {
        apply(currentNode as any, source);
      }
    }

    if (!NodeApi.isAncestor(currentNode)) return;

    const children = currentNode.children;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      _recurse(child as any, currentPath.concat([i]));
    }
  };

  _recurse(node, path);
};
