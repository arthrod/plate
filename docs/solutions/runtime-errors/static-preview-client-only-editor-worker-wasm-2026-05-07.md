---
title: Static preview plugins and client-only editor shells for Worker deploys
date: 2026-05-07
category: runtime-errors
module: pagination
problem_type: runtime_error
component: tooling
symptoms:
  - Deployed editor route shows the Next error page.
  - Browser console reports `TypeError: e is not iterable`.
  - Cloudflare Worker logs report `WebAssembly.compile(): Wasm code generation disallowed by embedder`.
root_cause: wrong_api
resolution_type: code_fix
severity: high
tags: [pagination, plate-static, cloudflare-worker, wasm, use-element-selector]
---

# Static preview plugins and client-only editor shells for Worker deploys

## Problem

Pagination preview rendered the deployed playground through a static editor that reused live editor plugin objects. The Worker route also imported the full editor during server rendering, pulling WASM-backed code paths into Cloudflare.

## Symptoms

- The deployed `/editor` route returned the Next error page.
- Browser stacks pointed into table hooks with `TypeError: e is not iterable`.
- Cloudflare logs showed `WebAssembly.compile(): Wasm code generation disallowed by embedder`.
- Local development could render enough of the editor to hide the Worker-only server/runtime issue.

## What Didn't Work

- Only removing editor chrome render hooks from the static plugin graph was not enough. `withComponent` extensions can rehydrate node components during plugin resolution.
- Patching the installed template package was useful for deployment proof, but template source and vendor output are CI-controlled and should not be committed.
- Checking CSS imports did not explain the failure. The deployed HTML included the app stylesheet, and the runtime error came from plugin execution, not missing styles.

## Solution

Keep pagination's static preview plugin graph static-safe, and keep the playground editor out of Worker server execution.

```ts
const toStaticPreviewPlugin = (
  plugin: AnyEditorPlugin
): AnyEditorPlugin | null => {
  if (plugin.key === PAGINATION_KEY || plugin.editOnly) return null;

  return {
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
    node: {
      ...plugin.node,
      component: undefined,
    },
    render: {
      ...plugin.render,
      aboveEditable: undefined,
      aboveNodes: undefined,
      beforeEditable: undefined,
      belowNodes: undefined,
      belowRootNodes: undefined,
      node: undefined,
    },
  } as AnyEditorPlugin;
};
```

The registry page uses a client-only dynamic editor import so packages with browser/WASM assumptions stay out of the Worker render path:

```tsx
'use client';

import dynamic from 'next/dynamic';

const PlateEditor = dynamic(
  () =>
    import('@/registry/blocks/editor-ai/components/editor/plate-editor').then(
      (mod) => mod.PlateEditor
    ),
  { ssr: false }
);
```

Table selectors also guard nullable entries from static or transitional render paths:

```ts
const colSizes = useElementSelector((entry) => {
  const [tableNode] = entry ?? [];

  if (!tableNode) return [];

  return getTableOverriddenColSizes(tableNode, colSizeOverrides);
});
```

## Why This Works

`PlateStatic` can render semantic content safely only when the plugin graph does not reintroduce live React node components, hooks, DnD wrappers, or node-prop transforms. Clearing render hooks, node components, and pending plugin extensions prevents static preview resolution from recreating the live editor surface.

Cloudflare Workers disallow runtime WASM code generation. A client-only editor shell keeps the heavy editor module graph, including code-block diagram tooling, out of the Worker server execution path.

## Prevention

- Treat static preview plugin graphs as a separate runtime boundary from live editing.
- Strip `__extensions` when cloning plugins for static-only rendering if those extensions can reattach components or hooks.
- Guard `useElementSelector` callbacks against nullable entries when components can render during static, transitional, or provider-missing states.
- For Worker-hosted registry demos, dynamically import browser-heavy editors with `ssr: false`.
- Verify deployed Worker logs as well as browser errors when a route imports diagram, code-block, or other WASM-capable packages.

## Related Issues

- Related code paths: `packages/pagination/src/react/page-frame.tsx`, `apps/www/src/registry/blocks/editor-ai/page.tsx`, `packages/table/src/react/components/TableElement/useTableColSizes.ts`.
