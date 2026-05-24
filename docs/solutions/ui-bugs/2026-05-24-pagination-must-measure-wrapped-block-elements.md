---
module: Pagination
date: 2026-05-24
problem_type: ui_bug
component: tooling
symptoms:
  - "The minimal pagination demo rendered page markers, but the full playground editor rendered none"
  - "Template /editor showed zero pagination break lines and labels on load"
  - "The full editor content was taller than one page, but pagination composed it as one page"
root_cause: logic_error
resolution_type: code_fix
severity: medium
tags:
  - pagination
  - pretext
  - dom-measurement
  - block-wrappers
  - registry
---

# Pagination must measure wrapped block elements

## Problem

Pagination worked in the focused `/dev/pagination2` demo but did not render page markers in the full playground editor.

The two surfaces used the same pagination pipeline. The difference was the editor DOM shape.

## Root Cause

`topLevelBlockElements` queried only direct editable children:

```ts
editable.querySelectorAll(':scope > [data-slate-node="element"]');
```

That matched the focused demo, where Slate elements were direct children of the editable.

The full playground block UI wraps each top-level Slate element in an outer UI wrapper. In that DOM shape, the direct-child query returns no blocks. Pagination then falls back to synthetic one-line measurements and can compose the whole document as a single page.

There was also an integration issue: the playground template configured `PaginationPlugin` with `enabled: false`, so even a correct layout could stay invisible on first load.

## Fix

Resolve one top-level Slate element per editable child:

- use the child itself when it is a Slate element
- otherwise use the first nested Slate element inside that child
- preserve document order and avoid querying all descendants as independent blocks

Enable pagination in the editor kit integration by default and register the pagination toolbar control with the registry source.

## Why This Works

Pagination needs the same top-level block sequence that Slate renders, not a flat list of every descendant element.

Looking through each editable child preserves that top-level sequence while tolerating wrapper components added by block UI chrome.

## Verification

These checks passed:

```bash
bun test --coverage packages/pagination/src
pnpm turbo build --filter=./packages/pagination
pnpm turbo typecheck --filter=./packages/pagination
pnpm lint:fix
PLAYWRIGHT_BASE_URL=http://localhost:3002 pnpm exec playwright test tooling/e2e/pagination.spec.ts --browser=chromium --workers=1
```

Template `/editor` browser proof after refreshing the local pagination vendor package:

```json
{
  "lineCount": 1,
  "labels": ["Page 1 of 2", "Page 2 of 2"],
  "errors": []
}
```

## Prevention

Do not use direct-child-only selectors for Plate editor block measurement when block UI wrappers can sit between the editable and Slate elements.

Pagination browser checks should cover both the minimal demo route and a full editor route with block wrappers.

When verifying a generated template against local package code, rebuild the package, refresh the template's vendored package copy, and reinstall the template dependency graph before testing the page.
