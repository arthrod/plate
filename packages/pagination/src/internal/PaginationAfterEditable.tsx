import type { EditableSiblingComponent } from 'platejs/react';
import React from 'react';

import { PaginationCoordinator } from '../PaginationCoordinator';

/**
 * Editable-sibling wrapper that mounts the reflow {@link PaginationCoordinator}.
 *
 * `PaginationCoordinator` takes optional collaboration props and is not shaped
 * as an `EditableSiblingComponent`, so this thin wrapper adapts it to the
 * `render.afterEditable` slot and ignores the editable props it receives.
 */
export const PaginationAfterEditable: EditableSiblingComponent = () => (
  <PaginationCoordinator />
);
