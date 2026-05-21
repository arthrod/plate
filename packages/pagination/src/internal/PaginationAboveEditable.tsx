import React from 'react';

import { PaginationCoordinator } from '../PaginationCoordinator';
import { PaginationRegistryProvider } from '../registry';

/**
 * Above-editable wrapper that provides the page registry AND mounts the reflow
 * coordinator inside it.
 *
 * Both must share a single {@link PaginationRegistryProvider}: `PageElement`s
 * (rendered inside the editable) register their DOM with the registry, and
 * {@link PaginationCoordinator} reads that same registry to reflow. Splitting
 * the provider and coordinator into different render slots gives them separate
 * (empty) registries, so reflow never runs.
 */
export function PaginationAboveEditable({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PaginationRegistryProvider>
      {children}
      <PaginationCoordinator />
    </PaginationRegistryProvider>
  );
}
