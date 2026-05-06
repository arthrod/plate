'use client';

import type { AnyPlatePlugin } from 'platejs/react';

/**
 * Pagination kit — PLACEHOLDER STUB.
 *
 * The real `@platejs/pagination` package is not yet published to npm.
 * Tracked in PRs #357 and #358. Until those land, this kit exports an
 * empty plugin array so the editor wiring stays valid and the toolbar
 * button has a stable integration point.
 *
 * When the upstream package ships:
 * 1. Add `@platejs/pagination` (and any React entry) to dependencies.
 * 2. Replace `PaginationKit` below with the real plugin(s).
 * 3. Replace `triggerPaginationStub` in `pagination-toolbar-button.tsx`
 *    with the real transform/api call exposed by the plugin.
 */
export const PaginationKit: AnyPlatePlugin[] = [];

/** Stub action triggered by the pagination toolbar button. */
export const triggerPaginationStub = () => {
  // biome-ignore lint/suspicious/noConsole: intentional placeholder log
  console.log('TODO: replace stub when @platejs/pagination publishes');
};
