import { a as BaseFooterPlugin, i as BaseHeaderPlugin, n as BasePaginationPlugin, o as allocateFootnotes, r as BasePageBreakPlugin, t as paginate } from "../paginate-BwWv3TAR.js";
import { KEYS } from "platejs";
import { toPlatePlugin, toTPlatePlugin, useEditorRef } from "platejs/react";
import { c } from "react-compiler-runtime";
import * as React from "react";
import { useEffect } from "react";
import { FootnoteDefinitionPlugin, FootnoteInputPlugin, FootnoteReferencePlugin } from "@platejs/footnote/react";

//#region src/react/footer-plugin.ts
const FooterPlugin = toPlatePlugin(BaseFooterPlugin);

//#endregion
//#region src/react/footnote-portal.tsx
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
const FootnotePortal = () => {
	const $ = c(1);
	let t0;
	if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
		t0 = /* @__PURE__ */ React.createElement("style", { "data-plate-pagination-footnote-style": "" }, `
    [data-slate-node="element"][data-slate-type="${KEYS.footnoteDefinition}"] {
      visibility: hidden;
      pointer-events: none;
      position: absolute;
      left: -9999px;
      width: 1px;
      height: 1px;
      overflow: hidden;
    }
  `);
		$[0] = t0;
	} else t0 = $[0];
	return t0;
};

//#endregion
//#region src/react/header-plugin.ts
const HeaderPlugin = toPlatePlugin(BaseHeaderPlugin);

//#endregion
//#region src/react/page-break-plugin.ts
const PageBreakPlugin = toPlatePlugin(BasePageBreakPlugin);

//#endregion
//#region src/react/page-frame.tsx
/**
* Single page chrome rendered by the overlay: header band, content rect
* outline, footnote well, footer band.
*
* Variant A renders this purely as an overlay; it never wraps the live
* editor children, so editing remains uninterrupted.
*/
const PageFrame = (t0) => {
	const $ = c(26);
	const { chrome, documentFooter, documentHeader, page, top } = t0;
	const { rect } = page;
	const headerOffset = chrome.headerHeight;
	const footnoteWellTop = rect.height - chrome.footerHeight - chrome.footnoteWell;
	const footerTop = rect.height - chrome.footerHeight;
	let t1;
	if ($[0] !== rect.height || $[1] !== rect.width || $[2] !== top) {
		t1 = {
			background: "#ffffff",
			border: "1px solid rgba(15,23,42,0.15)",
			borderRadius: 2,
			boxShadow: "0 1px 2px rgba(15,23,42,0.08)",
			height: rect.height,
			left: 0,
			pointerEvents: "none",
			position: "absolute",
			top,
			width: rect.width
		};
		$[0] = rect.height;
		$[1] = rect.width;
		$[2] = top;
		$[3] = t1;
	} else t1 = $[3];
	let t2;
	if ($[4] !== chrome.headerHeight || $[5] !== documentHeader) {
		t2 = chrome.headerHeight > 0 ? /* @__PURE__ */ React.createElement("div", {
			"data-plate-pagination-slot": "header",
			style: {
				borderBottom: "1px dashed rgba(15,23,42,0.1)",
				color: "rgba(15,23,42,0.55)",
				fontSize: 12,
				height: chrome.headerHeight,
				left: 0,
				padding: "8px 16px",
				position: "absolute",
				right: 0,
				top: 0
			}
		}, documentHeader ? collectInlineText(documentHeader) : null) : null;
		$[4] = chrome.headerHeight;
		$[5] = documentHeader;
		$[6] = t2;
	} else t2 = $[6];
	let t3;
	if ($[7] !== chrome.footnoteWell || $[8] !== footnoteWellTop || $[9] !== page.footnotes) {
		t3 = chrome.footnoteWell > 0 && page.footnotes.length > 0 ? /* @__PURE__ */ React.createElement("div", {
			"data-plate-pagination-slot": "footnote-well",
			style: {
				borderTop: "1px solid rgba(15,23,42,0.1)",
				color: "rgba(15,23,42,0.7)",
				fontSize: 11,
				height: chrome.footnoteWell,
				left: 16,
				overflow: "hidden",
				padding: "4px 0",
				position: "absolute",
				right: 16,
				top: footnoteWellTop
			}
		}, page.footnotes.map(_temp$2)) : null;
		$[7] = chrome.footnoteWell;
		$[8] = footnoteWellTop;
		$[9] = page.footnotes;
		$[10] = t3;
	} else t3 = $[10];
	let t4;
	if ($[11] !== chrome.footerHeight || $[12] !== documentFooter || $[13] !== footerTop || $[14] !== page.pageIndex) {
		t4 = chrome.footerHeight > 0 ? /* @__PURE__ */ React.createElement("div", {
			"data-plate-pagination-slot": "footer",
			style: {
				borderTop: "1px dashed rgba(15,23,42,0.1)",
				color: "rgba(15,23,42,0.55)",
				fontSize: 12,
				height: chrome.footerHeight,
				left: 0,
				padding: "8px 16px",
				position: "absolute",
				right: 0,
				top: footerTop
			}
		}, /* @__PURE__ */ React.createElement("span", null, documentFooter ? collectInlineText(documentFooter) : null), /* @__PURE__ */ React.createElement("span", { style: { float: "right" } }, `${page.pageIndex + 1}`)) : null;
		$[11] = chrome.footerHeight;
		$[12] = documentFooter;
		$[13] = footerTop;
		$[14] = page.pageIndex;
		$[15] = t4;
	} else t4 = $[15];
	let t5;
	if ($[16] !== headerOffset || $[17] !== rect.contentHeight) {
		t5 = /* @__PURE__ */ React.createElement("div", {
			"data-plate-pagination-slot": "content",
			style: {
				height: rect.contentHeight,
				left: 0,
				position: "absolute",
				right: 0,
				top: headerOffset
			}
		});
		$[16] = headerOffset;
		$[17] = rect.contentHeight;
		$[18] = t5;
	} else t5 = $[18];
	let t6;
	if ($[19] !== page.pageIndex || $[20] !== t1 || $[21] !== t2 || $[22] !== t3 || $[23] !== t4 || $[24] !== t5) {
		t6 = /* @__PURE__ */ React.createElement("div", {
			"aria-hidden": "true",
			"data-page-index": page.pageIndex,
			"data-plate-pagination-page": "",
			style: t1
		}, t2, t3, t4, t5);
		$[19] = page.pageIndex;
		$[20] = t1;
		$[21] = t2;
		$[22] = t3;
		$[23] = t4;
		$[24] = t5;
		$[25] = t6;
	} else t6 = $[25];
	return t6;
};
const collectInlineText = (node) => {
	if (!node) return "";
	let out = "";
	walk(node, (t) => {
		out += t;
	});
	return out;
};
const walk = (node, visit) => {
	if (typeof node.text === "string") {
		visit(node.text);
		return;
	}
	if (!Array.isArray(node.children)) return;
	for (const child of node.children) walk(child, visit);
};
function _temp$2(def, i) {
	return /* @__PURE__ */ React.createElement("div", { key: def.id ?? i }, `[${def.identifier ?? i + 1}] `, collectInlineText(def));
}

//#endregion
//#region src/lib/internal/page-size-presets.ts
/** Page presets resolved at 96 DPI. */
const PAGE_PRESETS = {
	A4: {
		height: 1123,
		width: 794
	},
	Letter: {
		height: 1056,
		width: 816
	},
	Legal: {
		height: 1344,
		width: 816
	}
};
const resolvePageRect = (pageSize, margins, reservations) => {
	const preset = PAGE_PRESETS[pageSize] ?? PAGE_PRESETS.A4;
	const contentWidth = preset.width - margins.left - margins.right;
	return {
		contentHeight: preset.height - margins.top - margins.bottom - reservations.header - reservations.footer - reservations.footnoteWell,
		contentWidth,
		height: preset.height,
		width: preset.width
	};
};

//#endregion
//#region src/react/internal/page-state.ts
/**
* The latest pagination snapshot is stored on the editor instance under a
* non-enumerable slot so `editor.api.pagination.*` queries can resolve
* without going through React. `usePageLayout` writes the slot after each
* pagination cycle; `BasePaginationPlugin.api.pagination.getPages` reads it.
*
* Writing onto the editor avoids a WeakMap allocation and keeps the read
* path zero-overhead — the API just dereferences a property.
*/
const SLOT = "__pagination_pages__";
const setEditorPages = (editor, pages) => {
	editor[SLOT] = pages;
};

//#endregion
//#region src/lib/internal/measure-cache.ts
const DEFAULT_MAX_ENTRIES = 5e3;
const createMeasureCache = (maxEntries = DEFAULT_MAX_ENTRIES) => {
	const store = /* @__PURE__ */ new Map();
	const composeKey = (k) => `${k.nodeId} ${k.marksFingerprint} ${k.font} ${k.width}`;
	return {
		clear: () => store.clear(),
		get: (key) => store.get(composeKey(key)),
		set: (key, value) => {
			const composed = composeKey(key);
			if (store.has(composed)) store.delete(composed);
			else if (store.size >= maxEntries) {
				const oldest = store.keys().next().value;
				if (oldest !== void 0) store.delete(oldest);
			}
			store.set(composed, value);
		},
		size: () => store.size
	};
};

//#endregion
//#region src/react/use-pretext-measurer.ts
const FONT_SIZE_RE = /(\d+(?:\.\d+)?)(px|pt)(?:\/((?:\d+(?:\.\d+)?(?:px|pt)?)|(?:\d+(?:\.\d+)?)))?/;
const PX_SUFFIX_RE = /px$/;
const PT_SUFFIX_RE = /pt$/;
const FONT_SIZE_PX_RE = /(\d+(?:\.\d+)?)px/;
const WHITESPACE_RE = /\s+/;
/**
* Returns a {@link Measurer} backed by a canvas-based text-width oracle plus
* the per-instance {@link MeasureCache}.
*
* Cache key matches CodeRabbit Design Choice 3:
* `(node.id, marks-fingerprint, font, width)`. The hook owns the cache so
* measured heights survive React re-renders. The cache resets when the
* editor instance changes (the hook receives a new `editorId` per editor).
*
* The interface mirrors the future `@chenglou/pretext`-backed measurer; only
* the internals change when pretext is wired in. Until then, this DOM-based
* estimator is more than accurate enough for paginating typical prose.
*/
const usePretextMeasurer = (editorId) => {
	const $ = c(2);
	let t0;
	if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
		t0 = createMeasureCache();
		$[0] = t0;
	} else t0 = $[0];
	const cache = t0;
	let t1;
	if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
		const ctx2d = createCanvasContext();
		t1 = { measure: (node, ctx) => {
			const nodeId = node.id?.toString() ?? fallbackNodeId(node);
			const cached = cache.get({
				font: ctx.font,
				marksFingerprint: ctx.marksFingerprint,
				nodeId,
				width: ctx.width
			});
			if (cached !== void 0) return cached;
			const height = estimateBlockHeight(node, ctx, ctx2d);
			cache.set({
				font: ctx.font,
				marksFingerprint: ctx.marksFingerprint,
				nodeId,
				width: ctx.width
			}, height);
			return height;
		} };
		$[1] = t1;
	} else t1 = $[1];
	return t1;
};
const createCanvasContext = () => {
	if (typeof document === "undefined") return null;
	return document.createElement("canvas").getContext("2d");
};
const fallbackNodeId = (node) => {
	let text = "";
	walkText(node, (t) => {
		text += t;
		if (text.length > 64) return false;
		return true;
	});
	return `t:${text.slice(0, 64)}`;
};
const walkText = (node, visit) => {
	if (typeof node.text === "string") return visit(node.text);
	if (!Array.isArray(node.children)) return true;
	for (const child of node.children) if (!walkText(child, visit)) return false;
	return true;
};
const estimateBlockHeight = (node, ctx, canvas) => {
	const { fontSizePx, lineHeightPx } = parseFont(ctx.font);
	const scale = blockScale(node.type);
	const headingPx = scale === 1 ? 0 : Math.max(0, scale * fontSizePx - fontSizePx);
	const blockSpacingPx = blockSpacing(node.type, fontSizePx);
	const text = collectPlainText(node);
	if (text.length === 0) return Math.max(lineHeightPx, scale * lineHeightPx) + blockSpacingPx;
	return (canvas ? estimateLineCountFromCanvas(text, canvas, ctx, scale) : estimateLineCountFallback(text, ctx.width, fontSizePx * scale)) * (scale === 1 ? lineHeightPx : scale * lineHeightPx) + headingPx + blockSpacingPx;
};
const estimateLineCountFromCanvas = (text, canvas, ctx, scale) => {
	canvas.font = scale === 1 ? ctx.font : scaleFont(ctx.font, scale);
	const words = text.split(WHITESPACE_RE).filter(Boolean);
	if (words.length === 0) return 1;
	const spaceWidth = canvas.measureText(" ").width;
	let lineWidth = 0;
	let lines = 1;
	for (const word of words) {
		const wordWidth = canvas.measureText(word).width;
		if (lineWidth === 0) {
			lineWidth = wordWidth;
			continue;
		}
		if (lineWidth + spaceWidth + wordWidth > ctx.width) {
			lines += 1;
			lineWidth = wordWidth;
		} else lineWidth += spaceWidth + wordWidth;
	}
	return lines;
};
const estimateLineCountFallback = (text, width, fontSizePx) => {
	const charsPerLine = Math.max(1, Math.floor(width / (fontSizePx * .5)));
	return Math.max(1, Math.ceil(text.length / charsPerLine));
};
const blockScale = (type) => {
	switch (type) {
		case "h1": return 2;
		case "h2": return 1.5;
		case "h3": return 1.25;
		case "h4":
		case "h5":
		case "h6": return 1.1;
		default: return 1;
	}
};
const blockSpacing = (type, fontSizePx) => {
	switch (type) {
		case "h1":
		case "h2":
		case "h3":
		case "h4":
		case "h5":
		case "h6": return fontSizePx * 1.2;
		case "blockquote":
		case "code_block": return fontSizePx;
		default: return fontSizePx * .5;
	}
};
const parseFont = (font) => {
	const sizeMatch = font.match(FONT_SIZE_RE);
	if (!sizeMatch) return {
		fontSizePx: 16,
		lineHeightPx: 24
	};
	const fontSizePx = sizeMatch[2] === "pt" ? Number.parseFloat(sizeMatch[1]) * (96 / 72) : Number.parseFloat(sizeMatch[1]);
	const lhRaw = sizeMatch[3];
	let lineHeightPx = fontSizePx * 1.5;
	if (lhRaw) if (PX_SUFFIX_RE.test(lhRaw)) lineHeightPx = Number.parseFloat(lhRaw);
	else if (PT_SUFFIX_RE.test(lhRaw)) lineHeightPx = Number.parseFloat(lhRaw) * (96 / 72);
	else lineHeightPx = Number.parseFloat(lhRaw) * fontSizePx;
	return {
		fontSizePx,
		lineHeightPx
	};
};
const scaleFont = (font, scale) => font.replace(FONT_SIZE_PX_RE, (_m, n) => `${Math.round(Number.parseFloat(n) * scale * 100) / 100}px`);
const collectPlainText = (node) => {
	let out = "";
	walkText(node, (t) => {
		out += `${t} `;
		return true;
	});
	return out.trim();
};

//#endregion
//#region src/react/internal/use-page-layout.ts
/**
* Project the editor's children into the derived page sequence for variant A.
*
* Wraps `paginate()` + `allocateFootnotes()` in a `useMemo` keyed on the
* editor children reference and the resolved options. The latest snapshot
* is mirrored to the per-editor `WeakMap` so `editor.api.pagination.*`
* queries resolve without a hook.
*/
const usePageLayout = (editor, options) => {
	const $ = c(12);
	const measurer = usePretextMeasurer(editor.id);
	let t0;
	if ($[0] !== editor.children || $[1] !== measurer || $[2] !== options.footerHeight || $[3] !== options.footnoteWell || $[4] !== options.headerHeight || $[5] !== options.margins || $[6] !== options.pageSize) {
		const rect = resolvePageRect(options.pageSize, options.margins, {
			footer: options.footerHeight,
			footnoteWell: options.footnoteWell,
			header: options.headerHeight
		});
		t0 = allocateFootnotes(paginate(editor.children, rect, {
			font: "",
			marksFingerprint: "",
			width: rect.contentWidth
		}, measurer), editor.children.filter(_temp$1));
		$[0] = editor.children;
		$[1] = measurer;
		$[2] = options.footerHeight;
		$[3] = options.footnoteWell;
		$[4] = options.headerHeight;
		$[5] = options.margins;
		$[6] = options.pageSize;
		$[7] = t0;
	} else t0 = $[7];
	const pages = t0;
	let t1;
	let t2;
	if ($[8] !== editor || $[9] !== pages) {
		t1 = () => {
			setEditorPages(editor, pages);
		};
		t2 = [editor, pages];
		$[8] = editor;
		$[9] = pages;
		$[10] = t1;
		$[11] = t2;
	} else {
		t1 = $[10];
		t2 = $[11];
	}
	useEffect(t1, t2);
	return pages;
};
function _temp$1(n) {
	return n.type === KEYS.footnoteDefinition;
}

//#endregion
//#region src/react/page-overlay.tsx
/**
* Render-overlay shell mounted via `render.afterEditable`.
*
* Variant A — CodeRabbit Design Choice 1: pages are derived at render time
* and painted as an overlay panel on top of the live editor. The Slate
* document is never mutated by this component.
*
* The overlay is a fixed-position card on the right of the viewport showing
* a stack of `PageFrame` thumbnails plus a "Page n of m" indicator. This
* makes pagination visible without fighting the editor's text rendering.
*/
const PageOverlay = () => {
	const $ = c(27);
	const editor = useEditorRef();
	let t0;
	if ($[0] !== editor) {
		t0 = editor.getOptions(BasePaginationPlugin);
		$[0] = editor;
		$[1] = t0;
	} else t0 = $[1];
	const safeOptions = useResolvedOptions(t0);
	const pages = usePageLayout(editor, safeOptions);
	if (pages.length === 0) return null;
	let t1;
	if ($[2] !== editor.children) {
		t1 = editor.children.find(_temp);
		$[2] = editor.children;
		$[3] = t1;
	} else t1 = $[3];
	const documentHeader = t1;
	let t2;
	if ($[4] !== editor.children) {
		t2 = editor.children.find(_temp2);
		$[4] = editor.children;
		$[5] = t2;
	} else t2 = $[5];
	const documentFooter = t2;
	let t3;
	if ($[6] === Symbol.for("react.memo_cache_sentinel")) {
		t3 = /* @__PURE__ */ React.createElement(FootnotePortal, null);
		$[6] = t3;
	} else t3 = $[6];
	let t4;
	let t5;
	let t6;
	if ($[7] === Symbol.for("react.memo_cache_sentinel")) {
		t4 = {
			background: "rgba(248, 250, 252, 0.96)",
			border: "1px solid rgba(15,23,42,0.12)",
			borderRadius: 8,
			bottom: 16,
			boxShadow: "0 8px 24px rgba(15,23,42,0.12)",
			color: "rgba(15,23,42,0.85)",
			fontFamily: "system-ui, sans-serif",
			fontSize: 12,
			maxHeight: "calc(100vh - 32px)",
			overflowY: "auto",
			padding: 12,
			position: "fixed",
			right: 16,
			top: 16,
			width: 220,
			zIndex: 50
		};
		t5 = {
			alignItems: "center",
			color: "rgba(15,23,42,0.55)",
			display: "flex",
			fontSize: 11,
			fontWeight: 600,
			justifyContent: "space-between",
			letterSpacing: .4,
			marginBottom: 8,
			textTransform: "uppercase"
		};
		t6 = /* @__PURE__ */ React.createElement("span", null, "Pages");
		$[7] = t4;
		$[8] = t5;
		$[9] = t6;
	} else {
		t4 = $[7];
		t5 = $[8];
		t6 = $[9];
	}
	const t7 = `${pages.length}`;
	let t8;
	if ($[10] !== t7) {
		t8 = /* @__PURE__ */ React.createElement("div", { style: t5 }, t6, /* @__PURE__ */ React.createElement("span", null, t7));
		$[10] = t7;
		$[11] = t8;
	} else t8 = $[11];
	let t9;
	if ($[12] === Symbol.for("react.memo_cache_sentinel")) {
		t9 = {
			display: "flex",
			flexDirection: "column",
			gap: 12
		};
		$[12] = t9;
	} else t9 = $[12];
	let t10;
	if ($[13] !== documentFooter || $[14] !== documentHeader || $[15] !== pages || $[16] !== safeOptions) {
		let t11$1;
		if ($[18] !== documentFooter || $[19] !== documentHeader || $[20] !== safeOptions) {
			t11$1 = (page) => {
				const previewHeight = page.rect.height * .18;
				return /* @__PURE__ */ React.createElement("div", {
					key: page.pageIndex,
					style: {
						position: "relative",
						width: "100%"
					}
				}, /* @__PURE__ */ React.createElement("div", { style: {
					color: "rgba(15,23,42,0.55)",
					fontSize: 10,
					marginBottom: 4
				} }, `Page ${page.pageIndex + 1}`), /* @__PURE__ */ React.createElement("div", { style: {
					height: previewHeight,
					overflow: "hidden",
					position: "relative"
				} }, /* @__PURE__ */ React.createElement("div", { style: {
					transform: "scale(0.18)",
					transformOrigin: "top left"
				} }, /* @__PURE__ */ React.createElement(PageFrame, {
					chrome: {
						footerHeight: safeOptions.footerHeight,
						footnoteWell: safeOptions.footnoteWell,
						headerHeight: safeOptions.headerHeight
					},
					documentFooter,
					documentHeader,
					page,
					top: 0
				}))));
			};
			$[18] = documentFooter;
			$[19] = documentHeader;
			$[20] = safeOptions;
			$[21] = t11$1;
		} else t11$1 = $[21];
		t10 = pages.map(t11$1);
		$[13] = documentFooter;
		$[14] = documentHeader;
		$[15] = pages;
		$[16] = safeOptions;
		$[17] = t10;
	} else t10 = $[17];
	let t11;
	if ($[22] !== t10) {
		t11 = /* @__PURE__ */ React.createElement("div", { style: t9 }, t10);
		$[22] = t10;
		$[23] = t11;
	} else t11 = $[23];
	let t12;
	if ($[24] !== t11 || $[25] !== t8) {
		t12 = /* @__PURE__ */ React.createElement(React.Fragment, null, t3, /* @__PURE__ */ React.createElement("div", {
			"data-plate-pagination-overlay": "",
			style: t4
		}, t8, t11));
		$[24] = t11;
		$[25] = t8;
		$[26] = t12;
	} else t12 = $[26];
	return t12;
};
const useResolvedOptions = (options) => {
	const $ = c(9);
	options?.footerHeight;
	options?.footnoteWell;
	options?.headerHeight;
	options?.includeFootnoteSubPlugins;
	options?.margins;
	options?.pageSize;
	const t0 = options?.footerHeight ?? 48;
	const t1 = options?.footnoteWell ?? 0;
	const t2 = options?.headerHeight ?? 48;
	const t3 = options?.includeFootnoteSubPlugins ?? true;
	let t4;
	if ($[0] !== options?.margins) {
		t4 = options?.margins ?? {
			bottom: 72,
			left: 72,
			right: 72,
			top: 72
		};
		$[0] = options?.margins;
		$[1] = t4;
	} else t4 = $[1];
	const t5 = options?.pageSize ?? "A4";
	let t6;
	if ($[2] !== t0 || $[3] !== t1 || $[4] !== t2 || $[5] !== t3 || $[6] !== t4 || $[7] !== t5) {
		t6 = {
			footerHeight: t0,
			footnoteWell: t1,
			headerHeight: t2,
			includeFootnoteSubPlugins: t3,
			margins: t4,
			pageSize: t5
		};
		$[2] = t0;
		$[3] = t1;
		$[4] = t2;
		$[5] = t3;
		$[6] = t4;
		$[7] = t5;
		$[8] = t6;
	} else t6 = $[8];
	return t6;
};
function _temp(n) {
	return n.type === KEYS.header;
}
function _temp2(n_0) {
	return n_0.type === KEYS.footer;
}

//#endregion
//#region src/react/pagination-plugin.ts
const FOOTNOTE_SUB_PLUGINS = [
	FootnoteDefinitionPlugin,
	FootnoteReferencePlugin,
	FootnoteInputPlugin
];
/**
* React-side pagination plugin (variant A).
*
* - Lifts the page-chrome element plugins (header, footer, page break) to the
*   React surface. The Slate-side composition lives on `BasePaginationPlugin`.
* - Optionally bundles the footnote sub-plugins (default `true`); set
*   `options.includeFootnoteSubPlugins = false` to opt out of footnote
*   coupling.
* - Mounts the {@link PageOverlay} via `render.afterEditable` so pages are
*   painted as a derived overlay on top of the live editor (CodeRabbit
*   Design Choice 1).
* - Mounts {@link FootnotePortal} alongside the overlay to hide in-flow
*   `footnoteDefinition` blocks (CodeRabbit Design Choice 2). The visible
*   copy is rendered inside each page's footnote well by `PageFrame`.
*/
const PaginationPlugin = toTPlatePlugin(BasePaginationPlugin).extend(({ getOptions }) => ({
	plugins: [
		HeaderPlugin,
		FooterPlugin,
		PageBreakPlugin,
		...getOptions().includeFootnoteSubPlugins === false ? [] : FOOTNOTE_SUB_PLUGINS
	],
	render: { afterEditable: PageOverlay }
}));

//#endregion
export { FooterPlugin, FootnotePortal, HeaderPlugin, PageBreakPlugin, PageFrame, PageOverlay, PaginationPlugin, usePretextMeasurer };
//# sourceMappingURL=index.js.map