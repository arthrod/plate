import * as React from 'react';

import type { AnyEditorPlugin, TElement } from 'platejs';
import type { PlateEditor } from 'platejs/react';
import { PlateStatic, createStaticEditor } from 'platejs/static';

import { PAGINATION_KEY } from '../lib/internal/keys';

export type PageContentPreviewProps = {
  /** Live editor whose plugin list backs the static render. */
  editor: PlateEditor;
  /** Content nodes (typically `Page.nodes`) to render. */
  nodes: TElement[];
  /** CSS scale factor; `top left` origin so the thumbnail stays anchored. */
  scale?: number;
  /** Optional max-height clip for thumbnail rectangles. */
  height?: number;
  /** Optional fixed width for thumbnail rectangles. */
  width?: number;
};

/**
 * Render a slice of page content using `PlateStatic`, optionally scaled.
 *
 * Reuses the live editor's plugin list (minus pagination + chrome render
 * hooks that would recurse) so previews show authored plugin output —
 * comments, suggestions, drag handles all surface here when their
 * respective plugins ship a static-safe leaf or component.
 *
 * Wrap callers in {@link PageContentPreviewBoundary} when feeding rich
 * nodes that may crash PlateStatic; the side-panel and thumbnail flows do
 * this by iterating per-node.
 */
export const PageContentPreview = ({
  editor,
  height,
  nodes,
  scale = 1,
  width,
}: PageContentPreviewProps): React.JSX.Element => {
  const plugins = React.useMemo(
    () => getStaticPreviewPlugins(editor),
    [editor]
  );
  const staticEditor = React.useMemo(
    () => createStaticEditor({ plugins, value: nodes }),
    [plugins, nodes]
  );

  return (
    <div
      data-plate-pagination-content-preview=""
      style={{
        height,
        overflow: 'hidden',
        width,
      }}
    >
      <div
        style={{
          transform: scale === 1 ? undefined : `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        <PlateStatic
          className="slate-editor"
          editor={staticEditor}
          style={{ fontSize: 'inherit', lineHeight: 'inherit' }}
          value={nodes}
        />
      </div>
    </div>
  );
};

/**
 * Static-safe subset of the live editor's plugins.
 *
 * Drops:
 * - the pagination plugin (would re-mount the overlay → infinite recursion)
 * - any plugin marked `editOnly`
 * - chrome render hooks (`afterEditable`, `beforeContainer`, etc.) that
 *   would re-fire pagination's `afterEditable` from inside a page
 *
 * Keeps `node.component` so element/leaf renderers (incl. comments,
 * suggestions when wired) still surface their output in previews.
 */
const getStaticPreviewPlugins = (editor: PlateEditor): AnyEditorPlugin[] => {
  const out: AnyEditorPlugin[] = [];

  for (const plugin of editor.meta.pluginList) {
    if (plugin.key === PAGINATION_KEY) continue;
    if (plugin.editOnly) continue;

    out.push({
      ...plugin,
      __extensions: [],
      inject: plugin.inject?.nodeProps?.transformProps
        ? {
            ...plugin.inject,
            nodeProps: {
              ...plugin.inject.nodeProps,
              transformProps: undefined,
            },
          }
        : plugin.inject,
      render: {
        ...plugin.render,
        aboveEditable: undefined,
        aboveNodes: undefined,
        aboveSlate: undefined,
        afterContainer: undefined,
        afterEditable: undefined,
        beforeContainer: undefined,
        beforeEditable: undefined,
        belowNodes: undefined,
        belowRootNodes: undefined,
        node: undefined,
      },
    } as AnyEditorPlugin);
  }

  return out;
};
