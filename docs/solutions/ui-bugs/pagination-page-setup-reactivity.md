---
title: Pagination page_setup chrome stays stale / never repaginates on geometry change
module: "@platejs/pagination"
problem_type: ui_bug
component: hotwire_turbo
symptoms:
  - "header/footer chrome does not appear after enabling a page number"
  - "changing margins or page size does not change the page break count"
  - "usePluginOption throws OPTION_UNDEFINED: chrome option is not defined in plugin pagination"
root_cause: scope_issue
tags:
  - pagination
  - react-compiler
  - usePluginOption
  - useEditorValue
  - useEditorSelector
  - contenteditable
  - page_setup
severity: high
---

## Problem

Wiring document-level page setup (a `page_setup` node read by the pagination
overlay) produced three runtime failures that unit tests did not catch — all
found only via `dev-browser`:

1. **`usePluginOption(PaginationPlugin, 'chrome')` threw `OPTION_UNDEFINED`** for
   a plugin instance with no chrome configured (the bare demo). A configured
   editor (PaginationKit) worked, hiding it.
2. **Chrome never re-rendered after a `page_setup` change.** The overlay read
   `const setup = getPageSetup(editor)` during render. `editor` is a stable ref
   and Slate mutates `editor.children` in place, so the **React Compiler
   memoized the read** and never re-derived it.
3. **Page breaks never recomputed on geometry change.** The layout recompute was
   gated to width changes (ResizeObserver) / `enabled` toggle / mount
   (deliberate per-keystroke perf gate). A `set_node` on the `page_setup`
   config re-rendered the overlay but did not re-run the recompute effect, so
   margins/page-size/chrome edits did not change the page count.

## Solution

1. **Declare every option you read.** Add the option to `DEFAULT_OPTIONS` (even
   as `undefined`) so `usePluginOption` resolves a value instead of throwing.
2. **Read document state reactively in render**, never via a helper that closes
   over the stable `editor`. Use `useEditorValue()` (returns a fresh ref on
   change) and derive from the value: `pageSetupFromValue(useEditorValue())`.
   A `getPageSetup(editor)` read is safe **inside an effect body** (effects
   re-run), but not in the render path under the React Compiler.
3. **Trigger geometry recompute with a selector, not the whole value.**
   `useEditorSelector(ed => JSON.stringify(geometrySignature(ed)))` re-renders
   only when the page/margins/chrome signature changes — not on text edits — so
   an `invalidateLayoutRegistry` in a `[geometryKey]` effect repaginates on
   geometry changes while preserving the no-recompute-per-keystroke contract.

## Prevention

- Any overlay/projection that reads `editor.children` in render must subscribe
  to a reactive source (`useEditorValue` / `useEditorSelector` / `useEditorVersion`).
  A bare `editor`-closure read will be memoized stale by the React Compiler.
- Browser-test plugin options on a **bare** plugin instance, not only on the
  fully-configured kit — undeclared options throw at runtime, never in unit tests.

## Related: page count froze as the document grew

The same recompute-trigger gap caused a second bug: typing past the initial
pages did not add pages. The layout recompute fired only on width change
(ResizeObserver) / `enabled` toggle / mount / the geometry-signature watcher —
**not on content edits** (CR#442 deliberately avoids per-keystroke pretext). So
content edits invalidated the registry but nothing re-ran the recompute. Fix: a
**debounced `MutationObserver`** on the editable (`childList` + `characterData`
only — NOT `attributes`, since `alignContent` writes block `margin-top` and
attribute mutations would loop) that invalidates + forces a recompute ~250ms
after edits settle. Pretext still never runs per keystroke (debounced + the
measure cache reuses unchanged blocks).

## Related: vendored package can't depend on new central `KEYS`

The playground deploys a **vendored** build of `@platejs/pagination` into a
template that runs on **published** `platejs`. A node-type key registered in the
monorepo `KEYS` (`packages/utils`) is `undefined` in the template's published
`platejs` at runtime. So the pagination package keeps a **local `'page_setup'`
literal** for its node type rather than `KEYS.pageSetup`, even though central-KEYS
registration is the upstream-idiomatic choice. Register in `KEYS` for upstream
consistency, but do not make a vendored package's runtime depend on it.

## Print view = PlateStatic, not window.print()

A "view-only print view" should render the document read-only via `PlateStatic`
(`platejs/static`) + `createSlateEditor({ plugins: BaseEditorKit, value })`, not
open the browser print dialog. Discrete pages must be sliced **client-side** from
`getLayoutRegistry(editor).output.pages` (each page's `frames[].fragments[].path`
→ block indices → `editor.children` slice → one `<PlateStatic value={slice}/>`
per page): server-side discrete pages are infeasible because pretext measurement
needs a canvas/DOM. Whole-block granularity only (line-level fragment splits
collapse to whole blocks).
