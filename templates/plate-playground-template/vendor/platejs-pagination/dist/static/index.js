import * as React from "react";
import { SlateElement } from "platejs/static";

//#region src/static/footer-element-static.tsx
/**
* Static (server-safe) renderer for the page-footer element.
*
* Authored once per document; when serialising to HTML the footer block
* is rendered as a `<footer>` landmark so screen readers and crawlers can
* identify it correctly. The interactive overlay that repeats it on every
* page chrome lives in `src/react` and is not imported here.
*/
function FooterElementStatic({ children, style, ...props }) {
	return /* @__PURE__ */ React.createElement(SlateElement, {
		...props,
		as: "footer",
		style: {
			borderTop: "1px solid rgba(0,0,0,0.12)",
			padding: "8px 0",
			...style
		}
	}, children);
}

//#endregion
//#region src/static/header-element-static.tsx
/**
* Static (server-safe) renderer for the page-header element.
*
* Authored once per document; when serialising to HTML the header block
* is rendered as a `<header>` landmark so screen readers and crawlers can
* identify it correctly. The interactive overlay that repeats it on every
* page chrome lives in `src/react` and is not imported here.
*/
function HeaderElementStatic({ children, style, ...props }) {
	return /* @__PURE__ */ React.createElement(SlateElement, {
		...props,
		as: "header",
		style: {
			borderBottom: "1px solid rgba(0,0,0,0.12)",
			padding: "8px 0",
			...style
		}
	}, children);
}

//#endregion
//#region src/static/page-break-element-static.tsx
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
function PageBreakElementStatic(props) {
	return /* @__PURE__ */ React.createElement(SlateElement, props, /* @__PURE__ */ React.createElement("div", {
		contentEditable: false,
		style: {
			alignItems: "center",
			display: "flex",
			gap: 8,
			pageBreakAfter: "always",
			breakAfter: "page",
			padding: "8px 0",
			userSelect: "none"
		}
	}, /* @__PURE__ */ React.createElement("hr", { style: {
		border: "none",
		borderTop: "1px dashed rgba(0,0,0,0.3)",
		flex: 1,
		margin: 0
	} }), /* @__PURE__ */ React.createElement("span", { style: {
		color: "rgba(0,0,0,0.4)",
		fontSize: 11,
		letterSpacing: "0.05em",
		textTransform: "uppercase",
		whiteSpace: "nowrap"
	} }, "Page Break"), /* @__PURE__ */ React.createElement("hr", { style: {
		border: "none",
		borderTop: "1px dashed rgba(0,0,0,0.3)",
		flex: 1,
		margin: 0
	} })), props.children);
}

//#endregion
export { FooterElementStatic, HeaderElementStatic, PageBreakElementStatic };
//# sourceMappingURL=index.js.map