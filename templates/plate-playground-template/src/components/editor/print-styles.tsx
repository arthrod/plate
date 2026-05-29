'use client';

import type { PageSetupConfig } from '@platejs/pagination';

/** CSS @page size token from the page setup (named preset, else inch dims). */
function pageSizeToken(setup: PageSetupConfig): string {
  if (setup.page.preset === 'letter') return 'letter';
  if (setup.page.preset === 'a4') return 'A4';

  const toIn = (px: number) => `${(px / 96).toFixed(3)}in`;

  return `${toIn(setup.page.widthPx)} ${toIn(setup.page.heightPx)}`;
}

/**
 * Print stylesheet derived from the document's page setup. Sets the physical
 * @page size + margins so the browser paginates the continuous editor into real
 * pages, and hides the on-screen chrome (toolbars, advisory break lines, desk
 * background). Anything tagged data-print-hide is removed from the printout.
 */
export function PrintStyles({ setup }: { setup: PageSetupConfig }) {
  const toIn = (px: number) => `${(px / 96).toFixed(3)}in`;
  const m = setup.margins;
  const css = `
@page {
  size: ${pageSizeToken(setup)};
  margin: ${toIn(m.topPx)} ${toIn(m.rightPx)} ${toIn(m.bottomPx)} ${toIn(m.leftPx)};
}
@media print {
  [data-print-hide] { display: none !important; }
  [data-slot="pagination-break-lines"] { display: none !important; }
  [data-testid="pagination-desk"] {
    background: #fff !important;
    min-height: 0 !important;
    overflow: visible !important;
    padding: 0 !important;
  }
  [data-testid="pagination-stack"] {
    box-shadow: none !important;
    margin: 0 !important;
    padding: 0 !important;
    width: auto !important;
  }
}
`;

  return <style>{css}</style>;
}
