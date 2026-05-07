import * as React from 'react';

/**
 * Variant A — CodeRabbit Design Choice 2: footnote definitions stay in the
 * Slate tree so editing/selection/keyboard nav are unaffected, but in-flow
 * appearances are hidden via CSS while the visible representation lives in
 * the per-page footer well painted by `PageFrame`.
 *
 * This component injects the global stylesheet rule that hides
 * footnote-definition blocks from the editor body. The visible copy in the
 * footer well is a snapshot rendered by `PageFrame`; bidirectional editing
 * inside the well is intentionally out of scope for variant A — `print`
 * mode (follow-up) renders real DOM in the well via a `createPortal`.
 */
export const FootnotePortal = ({
  enabled,
  footnoteDefinitionType,
}: {
  enabled: boolean;
  footnoteDefinitionType: string;
}): React.JSX.Element | null => {
  if (!enabled) return null;

  return (
    <style data-plate-pagination-footnote-style="">{`
    [data-slate-node="element"][data-slate-type="${footnoteDefinitionType}"] {
      visibility: hidden;
      pointer-events: none;
      position: absolute;
      left: -9999px;
      width: 1px;
      height: 1px;
      overflow: hidden;
    }
  `}</style>
  );
};
