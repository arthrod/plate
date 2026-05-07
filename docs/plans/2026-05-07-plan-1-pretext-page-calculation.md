# Plan 1: Pretext / Page-Calculation Accuracy

## Problem

The `usePretextMeasurer` hook (`packages/pagination/src/react/use-pretext-measurer.ts:31-34`) is a canvas-based estimator acting as a placeholder. The comment states the interface is designed to mirror a future `@chenglou/pretext`-backed measurer, but that library does not yet exist in this repo. The current canvas path accumulates estimation error for headings, list items, and blocks with complex inline styling, which causes pages to overflow or under-fill in the preview.

## Current State

| Component | File | Notes |
|---|---|---|
| `usePretextMeasurer` | `packages/pagination/src/react/use-pretext-measurer.ts` | Canvas fallback + 500-entry LRU cache |
| `Measurer` interface | `packages/pagination/src/lib/types.ts:84-86` | `measure(node, ctx) => number` |
| Cache key | `use-pretext-measurer.ts:51-57` | `(node.id, marksFingerprint, font, width, contentHash)` |
| `paginate()` | `packages/pagination/src/lib/paginate.ts` | Consumes `Measurer`; no knowledge of implementation |
| `MeasureCache` | `packages/pagination/src/lib/internal/measure-cache.ts` | LRU eviction at 500 entries |

The `paginate()` function is decoupled from measurement — it receives a `Measurer` and calls `measurer.measure(node, ctx)`. No change to `paginate.ts` is needed.

## Goal

Improve measurement accuracy so the side-panel preview correctly reflects how a Word- or browser-rendered page would look. The path has two tracks:

1. **Near-term (no new dependencies):** Tune the canvas estimator.
2. **Long-term (when pretext is available):** Swap internals while keeping the public `Measurer` contract unchanged.

---

## Phase 1 — Tune the Canvas Estimator

### 1.1 Fix heading height calculation

**File:** `packages/pagination/src/react/use-pretext-measurer.ts`

Current multipliers (`h1=2.0, h2=1.5, h3=1.25, h4/h5/h6=1.1`) over-estimate body text and do not match CSS computed values on the actual editor DOM. Replace with values derived from the editor's computed styles.

**Steps:**
1. At hook mount time, read `getComputedStyle` of a hidden probe element for each heading type.
2. Store the resolved `fontSize` + `lineHeight` per type in a ref so they update when the editor font changes.
3. Pass this resolved map into `estimateBlockHeight()` instead of using the hard-coded scale factors.

### 1.2 Account for paragraph spacing

The current estimator ignores `margin-top` and `margin-bottom` on block elements. This causes cumulative drift for long documents.

**Steps:**
1. Extend `PageContext` with an optional `blockSpacing?: { before: number; after: number }` field (non-breaking — existing callers pass `undefined`).
2. In `estimateBlockHeight()`, add `blockSpacing.before + blockSpacing.after` to the computed height.
3. Populate `blockSpacing` in `usePageLayout` from a style probe.

### 1.3 Improve list-item indentation

Nested lists currently measure as if they are body text at full width, ignoring the indentation offset.

**Steps:**
1. Detect list-item depth via `node.indent` (already present on Plate list nodes).
2. Subtract `depth * indentWidth` from the effective `width` passed into `estimateLineCount()`.

### 1.4 Add content-hash to cache key (already done in PR #374)

Cache key already includes `contentHash` — no additional work needed.

---

## Phase 2 — Pretext Integration (when available)

### 2.1 Add `@chenglou/pretext` as a peer dependency

When the library is published, add it to `packages/pagination/package.json`:

```json
{
  "peerDependencies": {
    "@chenglou/pretext": ">=0.1"
  },
  "peerDependenciesMeta": {
    "@chenglou/pretext": { "optional": true }
  }
}
```

Mark it optional so existing canvas-only setups continue to work.

### 2.2 Feature-detect and swap measurer

**File:** `packages/pagination/src/react/use-pretext-measurer.ts`

```ts
// At the top of usePretextMeasurer:
let pretextAvailable: boolean;
try {
  require.resolve('@chenglou/pretext');
  pretextAvailable = true;
} catch {
  pretextAvailable = false;
}

// Inside useMemo:
if (pretextAvailable) {
  const { measure } = await import('@chenglou/pretext');
  // wire measure() → Measurer.measure contract
} else {
  // existing canvas path
}
```

Because `useMemo` is synchronous, the swap needs to be done at module level or via a separate `usePretextBackend` hook that returns the right implementation.

### 2.3 Map pretext output to `Measurer` contract

The `Measurer.measure(node: TElement, ctx: PageContext) => number` interface returns a height in CSS pixels. The pretext library is expected to return a similar numeric height. The adapter layer must:

1. Convert `TElement` to a pretext-compatible node descriptor.
2. Pass `ctx.width` as the layout constraint.
3. Apply the same `MeasureCache` LRU wrapping so pretext calls are cached identically.

### 2.4 Expose a `measurer` option on `PaginationPlugin`

Allow consumers to inject their own `Measurer` implementation without forking the hook:

```ts
// types.ts — add to BasePaginationOptions
measurer?: Measurer;
```

In `pagination-plugin.ts`, if `options.measurer` is set, pass it directly to `usePageLayout` instead of calling `usePretextMeasurer()`.

---

## Phase 3 — Accuracy Validation

### 3.1 Golden-file tests

Add a `packages/pagination/src/lib/paginate.spec.ts` case that uses a deterministic mock `Measurer` to pin the page layout output for a standard 1000-word document:

```ts
const fixedMeasurer: Measurer = { measure: () => 24 }; // 24px per block
const pages = paginate(doc, rect, ctx, fixedMeasurer);
expect(pages.length).toBe(expectedCount);
```

### 3.2 Drift detection

Add a CI script that renders a known document with the canvas measurer and checks that page count stays within ±1 of the expected value. This catches regressions from estimator tuning.

---

## Files Touched

| File | Change |
|---|---|
| `packages/pagination/src/react/use-pretext-measurer.ts` | Phase 1 tuning: probe-based heading sizes, paragraph spacing, list indentation |
| `packages/pagination/src/lib/types.ts` | Add optional `blockSpacing` to `PageContext`; add optional `measurer` to `BasePaginationOptions` |
| `packages/pagination/src/react/internal/use-page-layout.ts` | Pass injected measurer if provided |
| `packages/pagination/src/react/pagination-plugin.ts` | Wire `options.measurer` into `usePageLayout` |
| `packages/pagination/package.json` | Phase 2: add optional `@chenglou/pretext` peer dep |
| `packages/pagination/src/lib/paginate.spec.ts` | Phase 3: golden-file and drift tests |

## Non-Goals

- Changing the `paginate()` algorithm — accuracy is a measurer concern.
- Breaking the `Measurer` interface — all phases keep `measure(node, ctx) => number`.
- Requiring `@chenglou/pretext` — it stays optional.