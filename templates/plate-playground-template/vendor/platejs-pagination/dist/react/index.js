import { C as FOOTNOTE_DEFINITION_KEY, S as FOOTER_KEY, _ as setEditorPages, b as BaseFooterPlugin, n as BasePaginationPlugin, t as paginate, v as BasePageBreakPlugin, w as HEADER_KEY, x as allocateFootnotes, y as BaseHeaderPlugin } from "../paginate-BP3Ay61_.js";
import { toPlatePlugin, toTPlatePlugin, useEditorRef, useEditorValue, usePluginOption } from "platejs/react";
import { c } from "react-compiler-runtime";
import * as React from "react";
import { useEffect, useLayoutEffect } from "react";
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
    [data-slate-node="element"][data-slate-type="${FOOTNOTE_DEFINITION_KEY}"] {
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
const HEADING_TYPE_RE = /^h([1-6])$/;
const HEADING_SIZES = [
	0,
	28,
	22,
	18,
	16,
	14,
	13
];
/**
* Single page chrome rendered by the overlay: header band, content rect,
* footnote well, footer band — with content rendered by a small recursive
* preview renderer that mirrors the live block types and inline marks.
*
* The thumbnail is intentionally lossy (no plugin parity), but it preserves
* heading hierarchy and basic mark styling (bold, italic, code, underline,
* strikethrough) so the preview reads as a faithful map of the document
* rather than a flattened text dump.
*/
const PageFrame = (t0) => {
	const $ = c(39);
	const { chrome, documentFooter, documentHeader, page, top } = t0;
	const { rect } = page;
	const headerOffset = chrome.headerHeight;
	const footnoteWellTop = rect.height - chrome.footerHeight - chrome.footnoteWell;
	const footerTop = rect.height - chrome.footerHeight;
	const t1 = page.pageIndex;
	let t2;
	if ($[0] !== rect.height || $[1] !== rect.width || $[2] !== top) {
		t2 = {
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
		$[3] = t2;
	} else t2 = $[3];
	let t3;
	if ($[4] !== chrome.headerHeight || $[5] !== chrome.margins.left || $[6] !== chrome.margins.right || $[7] !== documentHeader) {
		t3 = chrome.headerHeight > 0 ? /* @__PURE__ */ React.createElement("div", {
			"data-plate-pagination-slot": "header",
			style: {
				borderBottom: "1px dashed rgba(15,23,42,0.1)",
				color: "rgba(15,23,42,0.55)",
				fontSize: 12,
				height: chrome.headerHeight,
				left: 0,
				paddingBottom: 8,
				paddingLeft: chrome.margins.left,
				paddingRight: chrome.margins.right,
				paddingTop: 8,
				position: "absolute",
				right: 0,
				top: 0
			}
		}, documentHeader ? /* @__PURE__ */ React.createElement(BlockPreview, { node: documentHeader }) : null) : null;
		$[4] = chrome.headerHeight;
		$[5] = chrome.margins.left;
		$[6] = chrome.margins.right;
		$[7] = documentHeader;
		$[8] = t3;
	} else t3 = $[8];
	let t4;
	if ($[9] !== chrome.footnoteWell || $[10] !== chrome.margins.left || $[11] !== chrome.margins.right || $[12] !== footnoteWellTop || $[13] !== page.footnotes) {
		t4 = chrome.footnoteWell > 0 && page.footnotes.length > 0 ? /* @__PURE__ */ React.createElement("div", {
			"data-plate-pagination-slot": "footnote-well",
			style: {
				borderTop: "1px solid rgba(15,23,42,0.1)",
				color: "rgba(15,23,42,0.7)",
				fontSize: 11,
				height: chrome.footnoteWell,
				left: chrome.margins.left,
				overflow: "hidden",
				padding: "4px 0",
				position: "absolute",
				right: chrome.margins.right,
				top: footnoteWellTop
			}
		}, page.footnotes.map(_temp$2)) : null;
		$[9] = chrome.footnoteWell;
		$[10] = chrome.margins.left;
		$[11] = chrome.margins.right;
		$[12] = footnoteWellTop;
		$[13] = page.footnotes;
		$[14] = t4;
	} else t4 = $[14];
	let t5;
	if ($[15] !== chrome.footerHeight || $[16] !== chrome.margins.left || $[17] !== chrome.margins.right || $[18] !== documentFooter || $[19] !== footerTop || $[20] !== page.pageIndex) {
		t5 = chrome.footerHeight > 0 ? /* @__PURE__ */ React.createElement("div", {
			"data-plate-pagination-slot": "footer",
			style: {
				borderTop: "1px dashed rgba(15,23,42,0.1)",
				color: "rgba(15,23,42,0.55)",
				fontSize: 12,
				height: chrome.footerHeight,
				left: 0,
				paddingBottom: 8,
				paddingLeft: chrome.margins.left,
				paddingRight: chrome.margins.right,
				paddingTop: 8,
				position: "absolute",
				right: 0,
				top: footerTop
			}
		}, /* @__PURE__ */ React.createElement("span", null, documentFooter ? /* @__PURE__ */ React.createElement(InlinePreview, { node: documentFooter }) : null), /* @__PURE__ */ React.createElement("span", { style: { float: "right" } }, `${page.pageIndex + 1}`)) : null;
		$[15] = chrome.footerHeight;
		$[16] = chrome.margins.left;
		$[17] = chrome.margins.right;
		$[18] = documentFooter;
		$[19] = footerTop;
		$[20] = page.pageIndex;
		$[21] = t5;
	} else t5 = $[21];
	const t6 = headerOffset + chrome.margins.top;
	let t7;
	if ($[22] !== chrome.margins.left || $[23] !== chrome.margins.right || $[24] !== rect.contentHeight || $[25] !== t6) {
		t7 = {
			height: rect.contentHeight,
			left: chrome.margins.left,
			overflow: "hidden",
			position: "absolute",
			right: chrome.margins.right,
			top: t6
		};
		$[22] = chrome.margins.left;
		$[23] = chrome.margins.right;
		$[24] = rect.contentHeight;
		$[25] = t6;
		$[26] = t7;
	} else t7 = $[26];
	let t8;
	if ($[27] !== page.nodes) {
		t8 = page.nodes.map(_temp2$1);
		$[27] = page.nodes;
		$[28] = t8;
	} else t8 = $[28];
	let t9;
	if ($[29] !== t7 || $[30] !== t8) {
		t9 = /* @__PURE__ */ React.createElement("div", {
			"data-plate-pagination-slot": "content",
			style: t7
		}, t8);
		$[29] = t7;
		$[30] = t8;
		$[31] = t9;
	} else t9 = $[31];
	let t10;
	if ($[32] !== page.pageIndex || $[33] !== t2 || $[34] !== t3 || $[35] !== t4 || $[36] !== t5 || $[37] !== t9) {
		t10 = /* @__PURE__ */ React.createElement("div", {
			"aria-hidden": "true",
			"data-page-index": t1,
			"data-plate-pagination-page": "",
			style: t2
		}, t3, t4, t5, t9);
		$[32] = page.pageIndex;
		$[33] = t2;
		$[34] = t3;
		$[35] = t4;
		$[36] = t5;
		$[37] = t9;
		$[38] = t10;
	} else t10 = $[38];
	return t10;
};
/** Renders a single block with type-aware styling and mark-aware inlines. */
const BlockPreview = (t0) => {
	const $ = c(22);
	const { node } = t0;
	const type = node.type;
	if (typeof type === "string" && HEADING_TYPE_RE.test(type)) {
		const t1$1 = HEADING_SIZES[Number.parseInt(type.slice(1), 10)] ?? 16;
		let t2$1;
		if ($[0] !== t1$1) {
			t2$1 = {
				fontSize: t1$1,
				fontWeight: 700,
				lineHeight: 1.25,
				margin: "12px 0 8px"
			};
			$[0] = t1$1;
			$[1] = t2$1;
		} else t2$1 = $[1];
		let t3;
		if ($[2] !== node) {
			t3 = /* @__PURE__ */ React.createElement(InlinePreview, { node });
			$[2] = node;
			$[3] = t3;
		} else t3 = $[3];
		let t4;
		if ($[4] !== t2$1 || $[5] !== t3) {
			t4 = /* @__PURE__ */ React.createElement("div", { style: t2$1 }, t3);
			$[4] = t2$1;
			$[5] = t3;
			$[6] = t4;
		} else t4 = $[6];
		return t4;
	}
	if (type === "blockquote") {
		let t1$1;
		if ($[7] === Symbol.for("react.memo_cache_sentinel")) {
			t1$1 = {
				borderLeft: "3px solid rgba(15,23,42,0.2)",
				color: "rgba(15,23,42,0.7)",
				fontSize: 14,
				fontStyle: "italic",
				lineHeight: 1.5,
				margin: "8px 0",
				paddingLeft: 12
			};
			$[7] = t1$1;
		} else t1$1 = $[7];
		let t2$1;
		if ($[8] !== node) {
			t2$1 = /* @__PURE__ */ React.createElement("div", { style: t1$1 }, /* @__PURE__ */ React.createElement(InlinePreview, { node }));
			$[8] = node;
			$[9] = t2$1;
		} else t2$1 = $[9];
		return t2$1;
	}
	if (type === "code_block") {
		let t1$1;
		if ($[10] === Symbol.for("react.memo_cache_sentinel")) {
			t1$1 = {
				background: "rgba(15,23,42,0.05)",
				fontFamily: "ui-monospace, monospace",
				fontSize: 12,
				lineHeight: 1.4,
				margin: "8px 0",
				padding: 8,
				whiteSpace: "pre-wrap"
			};
			$[10] = t1$1;
		} else t1$1 = $[10];
		let t2$1;
		if ($[11] !== node) {
			t2$1 = /* @__PURE__ */ React.createElement("div", { style: t1$1 }, /* @__PURE__ */ React.createElement(InlinePreview, { node }));
			$[11] = node;
			$[12] = t2$1;
		} else t2$1 = $[12];
		return t2$1;
	}
	if (type === "ul" || type === "ol") {
		const Tag = type === "ol" ? "ol" : "ul";
		let t1$1;
		if ($[13] === Symbol.for("react.memo_cache_sentinel")) {
			t1$1 = {
				fontSize: 14,
				lineHeight: 1.5,
				margin: "6px 0",
				paddingLeft: 24
			};
			$[13] = t1$1;
		} else t1$1 = $[13];
		const t2$1 = node.children;
		let t3;
		if ($[14] !== t2$1) {
			t3 = t2$1.map(_temp3);
			$[14] = t2$1;
			$[15] = t3;
		} else t3 = $[15];
		let t4;
		if ($[16] !== Tag || $[17] !== t3) {
			t4 = /* @__PURE__ */ React.createElement(Tag, { style: t1$1 }, t3);
			$[16] = Tag;
			$[17] = t3;
			$[18] = t4;
		} else t4 = $[18];
		return t4;
	}
	let t1;
	if ($[19] === Symbol.for("react.memo_cache_sentinel")) {
		t1 = {
			fontSize: 14,
			lineHeight: 1.5,
			margin: "6px 0"
		};
		$[19] = t1;
	} else t1 = $[19];
	let t2;
	if ($[20] !== node) {
		t2 = /* @__PURE__ */ React.createElement("div", { style: t1 }, /* @__PURE__ */ React.createElement(InlinePreview, { node }));
		$[20] = node;
		$[21] = t2;
	} else t2 = $[21];
	return t2;
};
/**
* Renders the inline content of `node` with mark-aware styling. Text leaves
* apply bold/italic/underline/strikethrough/code; nested elements (links,
* mentions, etc.) recurse so styled inlines flow into the parent line box.
*/
const InlinePreview = (t0) => {
	const $ = c(6);
	const { node } = t0;
	let t1;
	if ($[0] !== node.children) {
		t1 = node.children ?? [];
		$[0] = node.children;
		$[1] = t1;
	} else t1 = $[1];
	const children = t1;
	let t2;
	if ($[2] !== children) {
		t2 = children.map(_temp4);
		$[2] = children;
		$[3] = t2;
	} else t2 = $[3];
	let t3;
	if ($[4] !== t2) {
		t3 = /* @__PURE__ */ React.createElement(React.Fragment, null, t2);
		$[4] = t2;
		$[5] = t3;
	} else t3 = $[5];
	return t3;
};
const Leaf = (t0) => {
	const $ = c(11);
	const { leaf } = t0;
	const text = leaf.text || "";
	if (!text) return null;
	let element = text;
	if (leaf.code) {
		let t1;
		if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
			t1 = {
				background: "rgba(15,23,42,0.06)",
				borderRadius: 2,
				fontFamily: "ui-monospace, monospace",
				fontSize: "0.92em",
				padding: "0 2px"
			};
			$[0] = t1;
		} else t1 = $[0];
		let t2;
		if ($[1] !== element) {
			t2 = /* @__PURE__ */ React.createElement("code", { style: t1 }, element);
			$[1] = element;
			$[2] = t2;
		} else t2 = $[2];
		element = t2;
	}
	if (leaf.bold) {
		let t1;
		if ($[3] !== element) {
			t1 = /* @__PURE__ */ React.createElement("strong", null, element);
			$[3] = element;
			$[4] = t1;
		} else t1 = $[4];
		element = t1;
	}
	if (leaf.italic) {
		let t1;
		if ($[5] !== element) {
			t1 = /* @__PURE__ */ React.createElement("em", null, element);
			$[5] = element;
			$[6] = t1;
		} else t1 = $[6];
		element = t1;
	}
	if (leaf.underline) {
		let t1;
		if ($[7] !== element) {
			t1 = /* @__PURE__ */ React.createElement("u", null, element);
			$[7] = element;
			$[8] = t1;
		} else t1 = $[8];
		element = t1;
	}
	if (leaf.strikethrough) {
		let t1;
		if ($[9] !== element) {
			t1 = /* @__PURE__ */ React.createElement("s", null, element);
			$[9] = element;
			$[10] = t1;
		} else t1 = $[10];
		element = t1;
	}
	return element;
};
function _temp$2(def, i) {
	return /* @__PURE__ */ React.createElement("div", { key: def.id ?? i }, `[${def.identifier ?? i + 1}] `, /* @__PURE__ */ React.createElement(InlinePreview, { node: def }));
}
function _temp2$1(node, i_0) {
	return /* @__PURE__ */ React.createElement(BlockPreview, {
		key: node.id ?? i_0,
		node
	});
}
function _temp3(child, i) {
	return /* @__PURE__ */ React.createElement("li", { key: child.id ?? i }, /* @__PURE__ */ React.createElement(InlinePreview, { node: child }));
}
function _temp4(child, i) {
	if (typeof child.text === "string") return /* @__PURE__ */ React.createElement(Leaf, {
		key: i,
		leaf: child
	});
	return /* @__PURE__ */ React.createElement(InlinePreview, {
		key: i,
		node: child
	});
}

//#endregion
//#region src/lib/internal/page-size-presets.ts
/** Page presets resolved at 96 DPI. */
const PAGE_PRESETS = {
	A4: {
		height: 1123,
		width: 794
	},
	Legal: {
		height: 1344,
		width: 816
	},
	Letter: {
		height: 1056,
		width: 816
	}
};
const isLiteralSize = (s) => typeof s === "object" && s !== null && "width" in s && "height" in s;
const resolvePageSize = (pageSize) => {
	if (isLiteralSize(pageSize)) return pageSize;
	return PAGE_PRESETS[pageSize] ?? PAGE_PRESETS.A4;
};
const resolvePageRect = (pageSize, margins, reservations) => {
	const preset = resolvePageSize(pageSize);
	const contentWidth = preset.width - margins.left - margins.right;
	const contentHeight = preset.height - margins.top - margins.bottom - reservations.header - reservations.footer - reservations.footnoteWell;
	return {
		contentHeight: Math.max(contentHeight, 0),
		contentWidth: Math.max(contentWidth, 0),
		height: preset.height,
		width: preset.width
	};
};

//#endregion
//#region src/lib/internal/measure-cache.ts
const DEFAULT_MAX_ENTRIES = 5e3;
const createMeasureCache = (maxEntries = DEFAULT_MAX_ENTRIES) => {
	const store = /* @__PURE__ */ new Map();
	const composeKey = (k) => `${k.nodeId} ${k.marksFingerprint} ${k.font} ${k.width} ${k.contentHash}`;
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
/**
* djb2 hash of a string — small, fast, no deps, plenty of entropy for
* cache key disambiguation.
*/
const hashString = (s) => {
	let h = 5381;
	for (let i = 0; i < s.length; i++) h = (h << 5) + h + s.charCodeAt(i) | 0;
	return h.toString(36);
};

//#endregion
//#region src/react/use-pretext-measurer.ts
const FONT_SIZE_RE = /(\d+(?:\.\d+)?)(px|pt)(?:\/((?:\d+(?:\.\d+)?(?:px|pt)?)|(?:\d+(?:\.\d+)?)))?/;
const PX_SUFFIX_RE = /px$/;
const PT_SUFFIX_RE = /pt$/;
const FONT_SIZE_UNIT_RE = /(\d+(?:\.\d+)?)(px|pt)/;
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
			const key = {
				contentHash: hashString(`${node.type ?? ""}|${collectPlainText(node)}`),
				font: ctx.font,
				marksFingerprint: ctx.marksFingerprint,
				nodeId,
				width: ctx.width
			};
			const cached = cache.get(key);
			if (cached !== void 0) return cached;
			const height = estimateBlockHeight(node, ctx, ctx2d);
			cache.set(key, height);
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
const scaleFont = (font, scale) => font.replace(FONT_SIZE_UNIT_RE, (_m, n, unit) => `${Math.round(Number.parseFloat(n) * scale * 100) / 100}${unit}`);
const collectPlainText = (node) => {
	let out = "";
	walkText(node, (t) => {
		out += t;
		return true;
	});
	return out;
};

//#endregion
//#region src/react/internal/use-page-layout.ts
/**
* Isomorphic `useLayoutEffect`: client-side it runs synchronously before
* paint (so `editor.api.pagination.getPages()` sees fresh data on the same
* tick); SSR falls back to `useEffect` to dodge React's layout-effect
* warning when there is no DOM yet.
*/
const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;
/**
* Project the editor's children into the derived page sequence for variant A.
*
* Wraps `paginate()` + `allocateFootnotes()` in a `useMemo` keyed on the
* `value` snapshot and the resolved options. The latest snapshot is mirrored
* to the LIVE editor instance so `editor.api.pagination.getPages()` resolves
* without a hook — without this, callers outside the overlay subtree would
* never see populated pages.
*/
const usePageLayout = (editor, value, options) => {
	const $ = c(12);
	const measurer = usePretextMeasurer(editor.id);
	let t0;
	if ($[0] !== measurer || $[1] !== options.footerHeight || $[2] !== options.footnoteWell || $[3] !== options.headerHeight || $[4] !== options.margins || $[5] !== options.pageSize || $[6] !== value) {
		const rect = resolvePageRect(options.pageSize, options.margins, {
			footer: options.footerHeight,
			footnoteWell: options.footnoteWell,
			header: options.headerHeight
		});
		t0 = allocateFootnotes(paginate(value, rect, {
			font: "",
			marksFingerprint: "",
			width: rect.contentWidth
		}, measurer), value.filter(_temp$1));
		$[0] = measurer;
		$[1] = options.footerHeight;
		$[2] = options.footnoteWell;
		$[3] = options.headerHeight;
		$[4] = options.margins;
		$[5] = options.pageSize;
		$[6] = value;
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
	useIsomorphicLayoutEffect(t1, t2);
	return pages;
};
function _temp$1(n) {
	return n.type === FOOTNOTE_DEFINITION_KEY;
}

//#endregion
//#region src/react/page-overlay.tsx
const STACK_GAP = 12;
/**
* Render-overlay shell mounted via `render.afterEditable`.
*
* Variant A — CodeRabbit Design Choice 1: pages are derived at render time
* and painted as a side-panel preview on top of the live editor. The Slate
* document is never mutated by this component.
*
* Visibility is controlled by the plugin option `previewVisible`, toggled
* via `editor.tf.pagination.togglePreview()`. When hidden the component
* still mounts (so the toggle stays reactive) but renders nothing.
*
* Updates reactively as the document changes via `useEditorValue`.
*
* Hydration: the underlying measurer falls back to font-derived heights on
* SSR which can disagree with client-side layout, so the panel waits for
* `useEffect` (client-only) before painting. This avoids React #418 hydration
* mismatches when the page count differs between server and client.
*/
const PageOverlay = () => {
	const $ = c(36);
	const [mounted, setMounted] = React.useState(false);
	let t0;
	let t1;
	if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
		t0 = () => {
			setMounted(true);
		};
		t1 = [];
		$[0] = t0;
		$[1] = t1;
	} else {
		t0 = $[0];
		t1 = $[1];
	}
	React.useEffect(t0, t1);
	const editor = useEditorRef();
	const visible = usePluginOption(BasePaginationPlugin, "previewVisible");
	const pageSize = usePluginOption(BasePaginationPlugin, "pageSize");
	const margins = usePluginOption(BasePaginationPlugin, "margins");
	const footerHeight = usePluginOption(BasePaginationPlugin, "footerHeight");
	const footnoteWell = usePluginOption(BasePaginationPlugin, "footnoteWell");
	const headerHeight = usePluginOption(BasePaginationPlugin, "headerHeight");
	const includeFootnoteSubPlugins = usePluginOption(BasePaginationPlugin, "includeFootnoteSubPlugins");
	const value = useEditorValue();
	let t2;
	if ($[2] !== footerHeight || $[3] !== footnoteWell || $[4] !== headerHeight || $[5] !== includeFootnoteSubPlugins || $[6] !== margins || $[7] !== pageSize || $[8] !== visible) {
		t2 = {
			footerHeight,
			footnoteWell,
			headerHeight,
			includeFootnoteSubPlugins,
			margins,
			pageSize,
			previewVisible: visible
		};
		$[2] = footerHeight;
		$[3] = footnoteWell;
		$[4] = headerHeight;
		$[5] = includeFootnoteSubPlugins;
		$[6] = margins;
		$[7] = pageSize;
		$[8] = visible;
		$[9] = t2;
	} else t2 = $[9];
	const safeOptions = useResolvedOptions(t2);
	const pages = usePageLayout(editor, value, safeOptions);
	if (!mounted) return null;
	if (!visible || pages.length === 0) {
		let t3$1;
		if ($[10] === Symbol.for("react.memo_cache_sentinel")) {
			t3$1 = /* @__PURE__ */ React.createElement(FootnotePortal, null);
			$[10] = t3$1;
		} else t3$1 = $[10];
		return t3$1;
	}
	const t3 = value;
	let t4;
	if ($[11] !== t3) {
		t4 = t3.find(_temp);
		$[11] = t3;
		$[12] = t4;
	} else t4 = $[12];
	const documentHeader = t4;
	const t5 = value;
	let t6;
	if ($[13] !== t5) {
		t6 = t5.find(_temp2);
		$[13] = t5;
		$[14] = t6;
	} else t6 = $[14];
	const documentFooter = t6;
	let t7;
	if ($[15] === Symbol.for("react.memo_cache_sentinel")) {
		t7 = /* @__PURE__ */ React.createElement(FootnotePortal, null);
		$[15] = t7;
	} else t7 = $[15];
	let t10;
	let t8;
	let t9;
	if ($[16] === Symbol.for("react.memo_cache_sentinel")) {
		t8 = {
			background: "rgba(248, 250, 252, 0.96)",
			border: "1px solid rgba(15,23,42,0.12)",
			borderRadius: 8,
			bottom: 16,
			boxShadow: "0 8px 24px rgba(15,23,42,0.12)",
			color: "rgba(15,23,42,0.85)",
			fontFamily: "system-ui, sans-serif",
			fontSize: 12,
			maxHeight: "calc(100vh - 96px)",
			overflowY: "auto",
			padding: 12,
			position: "fixed",
			right: 16,
			top: 80,
			width: 220,
			zIndex: 50
		};
		t9 = {
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
		t10 = /* @__PURE__ */ React.createElement("span", null, "Pages");
		$[16] = t10;
		$[17] = t8;
		$[18] = t9;
	} else {
		t10 = $[16];
		t8 = $[17];
		t9 = $[18];
	}
	const t11 = `${pages.length}`;
	let t12;
	if ($[19] !== t11) {
		t12 = /* @__PURE__ */ React.createElement("div", { style: t9 }, t10, /* @__PURE__ */ React.createElement("span", null, t11));
		$[19] = t11;
		$[20] = t12;
	} else t12 = $[20];
	let t13;
	if ($[21] === Symbol.for("react.memo_cache_sentinel")) {
		t13 = {
			display: "flex",
			flexDirection: "column",
			gap: STACK_GAP
		};
		$[21] = t13;
	} else t13 = $[21];
	let t14;
	if ($[22] !== documentFooter || $[23] !== documentHeader || $[24] !== pages || $[25] !== safeOptions) {
		let t15$1;
		if ($[27] !== documentFooter || $[28] !== documentHeader || $[29] !== safeOptions) {
			t15$1 = (page) => {
				const scale = computeThumbScale(page.rect.width);
				const previewHeight = page.rect.height * scale;
				const previewWidth = page.rect.width * scale;
				return /* @__PURE__ */ React.createElement("div", {
					key: `page-${page.pageIndex}`,
					style: { width: "100%" }
				}, /* @__PURE__ */ React.createElement("div", { style: {
					color: "rgba(15,23,42,0.55)",
					fontSize: 10,
					marginBottom: 4
				} }, `Page ${page.pageIndex + 1}`), /* @__PURE__ */ React.createElement("div", { style: {
					height: previewHeight,
					overflow: "hidden",
					position: "relative",
					width: previewWidth
				} }, /* @__PURE__ */ React.createElement("div", { style: {
					height: page.rect.height,
					transform: `scale(${scale})`,
					transformOrigin: "top left",
					width: page.rect.width
				} }, /* @__PURE__ */ React.createElement(PageFrame, {
					chrome: {
						footerHeight: safeOptions.footerHeight,
						footnoteWell: safeOptions.footnoteWell,
						headerHeight: safeOptions.headerHeight,
						margins: safeOptions.margins
					},
					documentFooter,
					documentHeader,
					page,
					top: 0
				}))));
			};
			$[27] = documentFooter;
			$[28] = documentHeader;
			$[29] = safeOptions;
			$[30] = t15$1;
		} else t15$1 = $[30];
		t14 = pages.map(t15$1);
		$[22] = documentFooter;
		$[23] = documentHeader;
		$[24] = pages;
		$[25] = safeOptions;
		$[26] = t14;
	} else t14 = $[26];
	let t15;
	if ($[31] !== t14) {
		t15 = /* @__PURE__ */ React.createElement("div", { style: t13 }, t14);
		$[31] = t14;
		$[32] = t15;
	} else t15 = $[32];
	let t16;
	if ($[33] !== t12 || $[34] !== t15) {
		t16 = /* @__PURE__ */ React.createElement(React.Fragment, null, t7, /* @__PURE__ */ React.createElement("div", {
			"data-plate-pagination-overlay": "",
			style: t8
		}, t12, t15));
		$[33] = t12;
		$[34] = t15;
		$[35] = t16;
	} else t16 = $[35];
	return t16;
};
const useResolvedOptions = (options) => {
	const $ = c(10);
	const t0 = options.footerHeight ?? 48;
	const t1 = options.footnoteWell ?? 0;
	const t2 = options.headerHeight ?? 48;
	const t3 = options.includeFootnoteSubPlugins ?? true;
	let t4;
	if ($[0] !== options.margins) {
		t4 = options.margins ?? {
			bottom: 72,
			left: 72,
			right: 72,
			top: 72
		};
		$[0] = options.margins;
		$[1] = t4;
	} else t4 = $[1];
	const t5 = options.pageSize ?? "A4";
	const t6 = options.previewVisible ?? true;
	let t7;
	if ($[2] !== t0 || $[3] !== t1 || $[4] !== t2 || $[5] !== t3 || $[6] !== t4 || $[7] !== t5 || $[8] !== t6) {
		t7 = {
			footerHeight: t0,
			footnoteWell: t1,
			headerHeight: t2,
			includeFootnoteSubPlugins: t3,
			margins: t4,
			pageSize: t5,
			previewVisible: t6
		};
		$[2] = t0;
		$[3] = t1;
		$[4] = t2;
		$[5] = t3;
		$[6] = t4;
		$[7] = t5;
		$[8] = t6;
		$[9] = t7;
	} else t7 = $[9];
	return t7;
};
const MAX_THUMB_SCALE = .18;
const PANEL_INNER_WIDTH = 196;
const computeThumbScale = (pageWidth) => {
	if (pageWidth <= 0) return MAX_THUMB_SCALE;
	return Math.min(MAX_THUMB_SCALE, PANEL_INNER_WIDTH / pageWidth);
};
function _temp(n) {
	return n.type === HEADER_KEY;
}
function _temp2(n_0) {
	return n_0.type === FOOTER_KEY;
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
export { FooterPlugin, FootnotePortal, HeaderPlugin, PageBreakPlugin, PageFrame, PageOverlay, PaginationPlugin, computeThumbScale, usePretextMeasurer };
//# sourceMappingURL=index.js.map