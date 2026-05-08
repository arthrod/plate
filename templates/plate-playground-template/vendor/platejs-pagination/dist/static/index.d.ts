import * as React from "react";
import { SlateElementProps } from "platejs/static";

//#region src/static/footer-element-static.d.ts

/**
 * Static (server-safe) renderer for the page-footer element.
 *
 * Authored once per document; when serialising to HTML the footer block
 * is rendered as a `<footer>` landmark so screen readers and crawlers can
 * identify it correctly. The interactive overlay that repeats it on every
 * page chrome lives in `src/react` and is not imported here.
 */
declare function FooterElementStatic({
  children,
  style,
  ...props
}: SlateElementProps): React.JSX.Element;
//#endregion
//#region src/static/header-element-static.d.ts
/**
 * Static (server-safe) renderer for the page-header element.
 *
 * Authored once per document; when serialising to HTML the header block
 * is rendered as a `<header>` landmark so screen readers and crawlers can
 * identify it correctly. The interactive overlay that repeats it on every
 * page chrome lives in `src/react` and is not imported here.
 */
declare function HeaderElementStatic({
  children,
  style,
  ...props
}: SlateElementProps): React.JSX.Element;
//#endregion
//#region src/static/page-break-element-static.d.ts
/**
 * Static (server-safe) renderer for the hard page-break element.
 *
 * In a printed/exported document a page break is rendered as a visible
 * separator so the reader knows content was split across pages. In screen
 * CSS a `page-break-after: always` rule is injected so PDF/print output
 * honours the break.
 *
 * The element is void — its `children` prop must still be rendered (Slate
 * requires it) but it produces no visible content.
 */
declare function PageBreakElementStatic(props: SlateElementProps): React.JSX.Element;
//#endregion
export { FooterElementStatic, HeaderElementStatic, PageBreakElementStatic };
//# sourceMappingURL=index.d.ts.map