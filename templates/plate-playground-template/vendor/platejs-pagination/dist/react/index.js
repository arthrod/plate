import { C as allocateFootnotes, D as PAGINATION_KEY, E as HEADER_KEY, S as BaseFooterPlugin, T as FOOTNOTE_DEFINITION_KEY, b as BasePageBreakPlugin, n as BasePaginationPlugin, p as resolvePaginationOptions, t as paginate, w as FOOTER_KEY, x as BaseHeaderPlugin, y as setEditorPages } from "../paginate-Cla4sKzV.js";
import { toPlatePlugin, toTPlatePlugin, useEditorRef, useEditorValue, usePluginOption } from "platejs/react";
import { c } from "react-compiler-runtime";
import * as React from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { PlateStatic, createStaticEditor } from "platejs/static";
import { layout, prepare } from "@chenglou/pretext";
import { measureRichInlineStats, prepareRichInline } from "@chenglou/pretext/rich-inline";
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
const FootnotePortal = (t0) => {
	const $ = c(2);
	const { enabled, footnoteDefinitionType } = t0;
	if (!enabled) return null;
	const t1 = `
    [data-slate-node="element"][data-slate-type="${footnoteDefinitionType}"] {
      visibility: hidden;
      pointer-events: none;
      position: absolute;
      left: -9999px;
      width: 1px;
      height: 1px;
      overflow: hidden;
    }
  `;
	let t2;
	if ($[0] !== t1) {
		t2 = /* @__PURE__ */ React.createElement("style", { "data-plate-pagination-footnote-style": "" }, t1);
		$[0] = t1;
		$[1] = t2;
	} else t2 = $[1];
	return t2;
};

//#endregion
//#region src/react/header-plugin.ts
const HeaderPlugin = toPlatePlugin(BaseHeaderPlugin);

//#endregion
//#region src/react/margins-dialog.tsx
const PX_PER_UNIT = {
	cm: 96 / 2.54,
	in: 96,
	mm: 96 / 25.4,
	px: 1
};
/**
* Dialog UI for editing the four-sided margin box.
*
* Reads / writes through `editor.tf.pagination.setMargins(patch)`. The unit
* selector is purely presentational — internally the plugin always stores
* margins in CSS pixels (matching `<w:pgMar>` semantics for export).
*
* The host opens this dialog from the toolbar when the user picks
* `Custom…`. v1 ships a minimal native `<dialog>`; the host may swap for a
* shadcn/Radix Dialog while keeping this state-management contract.
*/
const MarginsDialog = (t0) => {
	const $ = c(36);
	const { onClose, open } = t0;
	const editor = useEditorRef();
	const margins = usePluginOption(BasePaginationPlugin, "margins");
	const [unit, setUnit] = React.useState("px");
	const dialogRef = React.useRef(null);
	let t1;
	let t2;
	if ($[0] !== open) {
		t1 = () => {
			const dialog = dialogRef.current;
			if (!dialog) return;
			if (open && !dialog.open) dialog.showModal();
			if (!open && dialog.open) dialog.close();
		};
		t2 = [open];
		$[0] = open;
		$[1] = t1;
		$[2] = t2;
	} else {
		t1 = $[1];
		t2 = $[2];
	}
	React.useEffect(t1, t2);
	if (!margins) return null;
	let t3;
	if ($[3] !== editor || $[4] !== unit) {
		t3 = (side, valueRaw) => {
			const v = Number.parseFloat(valueRaw);
			if (!Number.isFinite(v)) return;
			editor.tf.pagination.setMargins({ [side]: Math.round(v * PX_PER_UNIT[unit]) });
		};
		$[3] = editor;
		$[4] = unit;
		$[5] = t3;
	} else t3 = $[5];
	const setSide = t3;
	let t4;
	if ($[6] !== unit) {
		t4 = (px) => (px / PX_PER_UNIT[unit]).toFixed(unit === "px" ? 0 : 2);
		$[6] = unit;
		$[7] = t4;
	} else t4 = $[7];
	const toUnit = t4;
	let t5;
	if ($[8] === Symbol.for("react.memo_cache_sentinel")) {
		t5 = {
			border: "1px solid rgba(15,23,42,0.18)",
			borderRadius: 8,
			boxShadow: "0 24px 64px rgba(15,23,42,0.18)",
			maxWidth: 360,
			padding: 16
		};
		$[8] = t5;
	} else t5 = $[8];
	let t6;
	let t7;
	let t8;
	let t9;
	if ($[9] === Symbol.for("react.memo_cache_sentinel")) {
		t6 = {
			display: "grid",
			gap: 12
		};
		t7 = /* @__PURE__ */ React.createElement("div", { style: {
			fontSize: 14,
			fontWeight: 600
		} }, "Page margins");
		t8 = {
			alignItems: "center",
			display: "flex",
			gap: 6
		};
		t9 = /* @__PURE__ */ React.createElement("span", { style: { width: 60 } }, "Unit");
		$[9] = t6;
		$[10] = t7;
		$[11] = t8;
		$[12] = t9;
	} else {
		t6 = $[9];
		t7 = $[10];
		t8 = $[11];
		t9 = $[12];
	}
	let t10;
	let t11;
	let t12;
	let t13;
	let t14;
	let t15;
	if ($[13] === Symbol.for("react.memo_cache_sentinel")) {
		t10 = (e) => setUnit(e.target.value);
		t11 = { flex: 1 };
		t12 = /* @__PURE__ */ React.createElement("option", { value: "px" }, "Pixels");
		t13 = /* @__PURE__ */ React.createElement("option", { value: "in" }, "Inches");
		t14 = /* @__PURE__ */ React.createElement("option", { value: "cm" }, "Centimeters");
		t15 = /* @__PURE__ */ React.createElement("option", { value: "mm" }, "Millimeters");
		$[13] = t10;
		$[14] = t11;
		$[15] = t12;
		$[16] = t13;
		$[17] = t14;
		$[18] = t15;
	} else {
		t10 = $[13];
		t11 = $[14];
		t12 = $[15];
		t13 = $[16];
		t14 = $[17];
		t15 = $[18];
	}
	let t16;
	if ($[19] !== unit) {
		t16 = /* @__PURE__ */ React.createElement("label", { style: t8 }, t9, /* @__PURE__ */ React.createElement("select", {
			value: unit,
			onChange: t10,
			style: t11
		}, t12, t13, t14, t15));
		$[19] = unit;
		$[20] = t16;
	} else t16 = $[20];
	let t17;
	if ($[21] === Symbol.for("react.memo_cache_sentinel")) {
		t17 = [
			"top",
			"right",
			"bottom",
			"left"
		];
		$[21] = t17;
	} else t17 = $[21];
	let t18;
	if ($[22] !== margins || $[23] !== setSide || $[24] !== toUnit) {
		t18 = t17.map((side_0) => /* @__PURE__ */ React.createElement("label", {
			key: side_0,
			style: {
				alignItems: "center",
				display: "flex",
				gap: 6
			}
		}, /* @__PURE__ */ React.createElement("span", { style: {
			textTransform: "capitalize",
			width: 60
		} }, side_0), /* @__PURE__ */ React.createElement("input", {
			defaultValue: toUnit(margins[side_0]),
			onBlur: (e_0) => setSide(side_0, e_0.target.value),
			style: { flex: 1 },
			type: "number"
		})));
		$[22] = margins;
		$[23] = setSide;
		$[24] = toUnit;
		$[25] = t18;
	} else t18 = $[25];
	let t19;
	if ($[26] === Symbol.for("react.memo_cache_sentinel")) {
		t19 = {
			display: "flex",
			gap: 8,
			justifyContent: "flex-end"
		};
		$[26] = t19;
	} else t19 = $[26];
	let t20;
	if ($[27] !== onClose) {
		t20 = /* @__PURE__ */ React.createElement("div", { style: t19 }, /* @__PURE__ */ React.createElement("button", {
			onClick: onClose,
			type: "button"
		}, "Done"));
		$[27] = onClose;
		$[28] = t20;
	} else t20 = $[28];
	let t21;
	if ($[29] !== t16 || $[30] !== t18 || $[31] !== t20) {
		t21 = /* @__PURE__ */ React.createElement("form", {
			method: "dialog",
			style: t6
		}, t7, t16, t18, t20);
		$[29] = t16;
		$[30] = t18;
		$[31] = t20;
		$[32] = t21;
	} else t21 = $[32];
	let t22;
	if ($[33] !== onClose || $[34] !== t21) {
		t22 = /* @__PURE__ */ React.createElement("dialog", {
			ref: dialogRef,
			"data-plate-pagination-margins-dialog": "",
			onClose,
			style: t5
		}, t21);
		$[33] = onClose;
		$[34] = t21;
		$[35] = t22;
	} else t22 = $[35];
	return t22;
};

//#endregion
//#region src/react/page-break-plugin.ts
const PageBreakPlugin = toPlatePlugin(BasePageBreakPlugin);

//#endregion
//#region src/react/page-frame.tsx
/**
* Single page chrome rendered by the overlay: header band, content rect,
* footnote well, footer band — with content rendered through `PlateStatic`
* using the live editor's plugin list, minus editor-chrome render hooks.
*/
const PageFrame = (t0) => {
	const $ = c(49);
	const { chrome, documentFooter, documentHeader, editor, footnotesInFooter, page, top } = t0;
	const { rect } = page;
	const headerOffset = chrome.headerHeight;
	const footnoteWellTop = rect.height - chrome.footerHeight - chrome.footnoteWell;
	const footerTop = rect.height - chrome.footerHeight;
	let t1;
	if ($[0] !== editor) {
		t1 = getStaticPreviewPlugins(editor);
		$[0] = editor;
		$[1] = t1;
	} else t1 = $[1];
	const staticPlugins = t1;
	const pageBorder = chrome.pageBorder;
	const border = pageBorder.style === "none" || pageBorder.width === 0 ? "none" : `${pageBorder.width}px ${pageBorder.style} ${pageBorder.color}`;
	let t2;
	if ($[2] !== border || $[3] !== pageBorder.radius || $[4] !== pageBorder.shadow || $[5] !== rect.height || $[6] !== rect.width || $[7] !== top) {
		t2 = {
			background: "#ffffff",
			border,
			borderRadius: pageBorder.radius,
			boxShadow: pageBorder.shadow,
			height: rect.height,
			left: 0,
			position: "absolute",
			top,
			width: rect.width
		};
		$[2] = border;
		$[3] = pageBorder.radius;
		$[4] = pageBorder.shadow;
		$[5] = rect.height;
		$[6] = rect.width;
		$[7] = top;
		$[8] = t2;
	} else t2 = $[8];
	let t3;
	if ($[9] !== chrome.headerHeight || $[10] !== chrome.margins.left || $[11] !== chrome.margins.right || $[12] !== documentHeader || $[13] !== staticPlugins) {
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
		}, documentHeader ? /* @__PURE__ */ React.createElement(StaticPageValue, {
			plugins: staticPlugins,
			value: [documentHeader]
		}) : null) : null;
		$[9] = chrome.headerHeight;
		$[10] = chrome.margins.left;
		$[11] = chrome.margins.right;
		$[12] = documentHeader;
		$[13] = staticPlugins;
		$[14] = t3;
	} else t3 = $[14];
	let t4;
	if ($[15] !== chrome.footnoteWell || $[16] !== chrome.margins.left || $[17] !== chrome.margins.right || $[18] !== footnoteWellTop || $[19] !== footnotesInFooter || $[20] !== page.footnotes || $[21] !== staticPlugins) {
		t4 = footnotesInFooter && chrome.footnoteWell > 0 && page.footnotes.length > 0 ? /* @__PURE__ */ React.createElement("div", {
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
		}, /* @__PURE__ */ React.createElement(StaticPageValue, {
			plugins: staticPlugins,
			value: page.footnotes
		})) : null;
		$[15] = chrome.footnoteWell;
		$[16] = chrome.margins.left;
		$[17] = chrome.margins.right;
		$[18] = footnoteWellTop;
		$[19] = footnotesInFooter;
		$[20] = page.footnotes;
		$[21] = staticPlugins;
		$[22] = t4;
	} else t4 = $[22];
	let t5;
	if ($[23] !== chrome.footerHeight || $[24] !== chrome.margins.left || $[25] !== chrome.margins.right || $[26] !== documentFooter || $[27] !== footerTop || $[28] !== page.pageIndex || $[29] !== staticPlugins) {
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
		}, documentFooter ? /* @__PURE__ */ React.createElement(StaticPageValue, {
			plugins: staticPlugins,
			value: [documentFooter]
		}) : null, /* @__PURE__ */ React.createElement("span", { style: { float: "right" } }, `${page.pageIndex + 1}`)) : null;
		$[23] = chrome.footerHeight;
		$[24] = chrome.margins.left;
		$[25] = chrome.margins.right;
		$[26] = documentFooter;
		$[27] = footerTop;
		$[28] = page.pageIndex;
		$[29] = staticPlugins;
		$[30] = t5;
	} else t5 = $[30];
	const t6 = headerOffset + chrome.margins.top;
	let t7;
	if ($[31] !== chrome.margins.left || $[32] !== chrome.margins.right || $[33] !== rect.contentHeight || $[34] !== t6) {
		t7 = {
			height: rect.contentHeight,
			left: chrome.margins.left,
			overflow: "hidden",
			position: "absolute",
			right: chrome.margins.right,
			top: t6
		};
		$[31] = chrome.margins.left;
		$[32] = chrome.margins.right;
		$[33] = rect.contentHeight;
		$[34] = t6;
		$[35] = t7;
	} else t7 = $[35];
	let t8;
	if ($[36] !== page.nodes || $[37] !== staticPlugins) {
		t8 = /* @__PURE__ */ React.createElement(StaticPageValue, {
			plugins: staticPlugins,
			value: page.nodes
		});
		$[36] = page.nodes;
		$[37] = staticPlugins;
		$[38] = t8;
	} else t8 = $[38];
	let t9;
	if ($[39] !== t7 || $[40] !== t8) {
		t9 = /* @__PURE__ */ React.createElement("div", {
			"data-plate-pagination-slot": "content",
			style: t7
		}, t8);
		$[39] = t7;
		$[40] = t8;
		$[41] = t9;
	} else t9 = $[41];
	let t10;
	if ($[42] !== page.pageIndex || $[43] !== t2 || $[44] !== t3 || $[45] !== t4 || $[46] !== t5 || $[47] !== t9) {
		t10 = /* @__PURE__ */ React.createElement("div", {
			"data-page-index": page.pageIndex,
			"data-plate-pagination-page": "",
			style: t2
		}, t3, t4, t5, t9);
		$[42] = page.pageIndex;
		$[43] = t2;
		$[44] = t3;
		$[45] = t4;
		$[46] = t5;
		$[47] = t9;
		$[48] = t10;
	} else t10 = $[48];
	return t10;
};
const StaticPageValue = (t0) => {
	const $ = c(7);
	const { plugins, value } = t0;
	let t1;
	if ($[0] !== plugins || $[1] !== value) {
		t1 = createStaticEditor({
			plugins,
			value
		});
		$[0] = plugins;
		$[1] = value;
		$[2] = t1;
	} else t1 = $[2];
	const editor = t1;
	let t2;
	if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
		t2 = {
			fontSize: "inherit",
			lineHeight: "inherit"
		};
		$[3] = t2;
	} else t2 = $[3];
	let t3;
	if ($[4] !== editor || $[5] !== value) {
		t3 = /* @__PURE__ */ React.createElement(PlateStatic, {
			className: "slate-editor",
			editor,
			style: t2,
			value
		});
		$[4] = editor;
		$[5] = value;
		$[6] = t3;
	} else t3 = $[6];
	return t3;
};
const getStaticPreviewPlugins = (editor) => editor.meta.pluginList.map(toStaticPreviewPlugin).filter((plugin) => plugin !== null);
const toStaticPreviewPlugin = (plugin) => {
	if (plugin.key === PAGINATION_KEY || plugin.editOnly) return null;
	return {
		...plugin,
		__extensions: [],
		inject: plugin.inject?.nodeProps?.transformProps ? {
			...plugin.inject,
			nodeProps: {
				...plugin.inject.nodeProps,
				transformProps: void 0
			}
		} : plugin.inject,
		node: {
			...plugin.node,
			component: void 0
		},
		render: {
			...plugin.render,
			aboveEditable: void 0,
			aboveNodes: void 0,
			aboveSlate: void 0,
			afterContainer: void 0,
			afterEditable: void 0,
			beforeContainer: void 0,
			beforeEditable: void 0,
			belowNodes: void 0,
			belowRootNodes: void 0,
			node: void 0
		}
	};
};

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
	const composeKey = (k) => `${k.nodeId}\x1f${k.marksFingerprint}\x1f${k.font}\x1f${k.width}\x1f${k.contentHash}`;
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
const FALLBACK_FONT_SIZE_PX = 16;
const FALLBACK_LINE_HEIGHT_PX = 24;
const FALLBACK_FONT = `400 ${FALLBACK_FONT_SIZE_PX}px "Inter"`;
const SYSTEM_UI_FAMILY_RE = /\b(system-ui|-apple-system|BlinkMacSystemFont|"Segoe UI"|Segoe UI)\b/i;
const FONT_WEIGHT_TOKEN_RE = /\b([1-9]00|normal|bold)\b/;
const FONT_STYLE_TOKEN_RE = /\b(normal|italic|oblique)\b/;
/**
* Returns a {@link Measurer} backed by `@chenglou/pretext` and a per-instance
* height cache.
*
* For each block the measurer scrapes the rendered DOM element via
* `editor.api.toDOMNode(node)` and reads `getComputedStyle(...).font`. The
* `system-ui` family is rewritten to `Inter` because pretext's accuracy
* tables cover named families only. Mixed-mark blocks fall through to
* `prepareRichInline()` so per-run font weights/styles measure correctly.
*
* Cache key is `(node.id, marksFingerprint, font, width, contentHash)`. The
* `contentHash` invalidates the entry when text changes without the
* `node.id` rotating (Slate mutates `children` in place).
*/
const usePretextMeasurer = (editor) => {
	const $ = c(3);
	let t0;
	if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
		t0 = createMeasureCache();
		$[0] = t0;
	} else t0 = $[0];
	const cache = t0;
	let t1;
	if ($[1] !== editor) {
		t1 = { measure: (node, ctx) => {
			const metrics = scrapeBlockMetrics(editor, node, ctx.font);
			const nodeId = node.id?.toString() ?? fallbackNodeId(node);
			const text = collectPlainText(node);
			const cacheKey = {
				contentHash: hashString(`${node.type ?? ""}|${text}`),
				font: metrics.font,
				marksFingerprint: ctx.marksFingerprint,
				nodeId,
				width: ctx.width
			};
			const cached = cache.get(cacheKey);
			if (cached !== void 0) return cached;
			const total = measureBlockHeight(node, text, metrics, ctx.width) + blockSpacingPx(node.type, metrics.sizePx);
			cache.set(cacheKey, total);
			return total;
		} };
		$[1] = editor;
		$[2] = t1;
	} else t1 = $[2];
	return t1;
};
const measureBlockHeight = (node, text, metrics, width) => {
	if (text.length === 0) return metrics.lineHeightPx;
	if (hasMixedMarks(node)) {
		const stats = measureRichInlineStats(prepareRichInline(collectLeaves(node).map((leaf) => ({
			font: applyLeafMarks(metrics.font, leaf.marks),
			text: leaf.text
		}))), width);
		return Math.max(1, stats.lineCount) * metrics.lineHeightPx;
	}
	return layout(prepare(text, metrics.font), width, metrics.lineHeightPx).height;
};
const scrapeBlockMetrics = (editor, node, fallbackFont) => {
	if (typeof window === "undefined") return fallbackMetrics(fallbackFont);
	try {
		const dom = editor.api.toDOMNode(node);
		if (!(dom instanceof HTMLElement)) return fallbackMetrics(fallbackFont);
		return readComputedFont(window.getComputedStyle(dom));
	} catch {
		return fallbackMetrics(fallbackFont);
	}
};
const fallbackMetrics = (fallbackFont) => ({
	font: fallbackFont || FALLBACK_FONT,
	lineHeightPx: FALLBACK_LINE_HEIGHT_PX,
	sizePx: FALLBACK_FONT_SIZE_PX
});
const readComputedFont = (cs) => {
	const sizePx = Number.parseFloat(cs.fontSize) || FALLBACK_FONT_SIZE_PX;
	let lineHeightPx;
	if (!cs.lineHeight || cs.lineHeight === "normal") lineHeightPx = sizePx * 1.5;
	else {
		const parsed = Number.parseFloat(cs.lineHeight);
		lineHeightPx = Number.isFinite(parsed) ? parsed : sizePx * 1.5;
	}
	const family = snapSystemUi(cs.fontFamily || "\"Inter\"");
	const weight = cs.fontWeight || "400";
	const style = cs.fontStyle || "normal";
	return {
		font: `${style === "normal" ? "" : `${style} `}${weight} ${roundPx(sizePx)}px ${family}`,
		lineHeightPx,
		sizePx
	};
};
const snapSystemUi = (family) => SYSTEM_UI_FAMILY_RE.test(family) ? family.replace(SYSTEM_UI_FAMILY_RE, "\"Inter\"") : family;
const roundPx = (n) => Math.round(n * 100) / 100;
const collectLeaves = (node) => {
	const out = [];
	const walk = (n) => {
		if (n === null || typeof n !== "object") return;
		const obj = n;
		if (typeof obj.text === "string") {
			const { text, ...marks } = obj;
			out.push({
				marks,
				text
			});
			return;
		}
		const children = obj.children;
		if (!Array.isArray(children)) return;
		for (const child of children) walk(child);
	};
	walk(node);
	return out;
};
const collectPlainText = (node) => {
	let out = "";
	for (const leaf of collectLeaves(node)) out += leaf.text;
	return out;
};
const hasMixedMarks = (node) => {
	const leaves = collectLeaves(node);
	if (leaves.length <= 1) return false;
	const first = serializeMarks(leaves[0].marks);
	for (let i = 1; i < leaves.length; i++) if (serializeMarks(leaves[i].marks) !== first) return true;
	return false;
};
const serializeMarks = (marks) => {
	const keys = Object.keys(marks).sort();
	if (keys.length === 0) return "";
	return keys.map((k) => `${k}=${formatMark(marks[k])}`).join(",");
};
const formatMark = (value) => {
	if (value === true) return "1";
	if (value === false) return "0";
	if (value == null) return "";
	if (typeof value === "object") return JSON.stringify(value);
	return String(value);
};
const applyLeafMarks = (baseFont, marks) => {
	let font = baseFont;
	if (marks.bold === true) font = FONT_WEIGHT_TOKEN_RE.test(font) ? font.replace(FONT_WEIGHT_TOKEN_RE, "700") : `700 ${font}`;
	if (marks.italic === true) font = FONT_STYLE_TOKEN_RE.test(font) ? font.replace(FONT_STYLE_TOKEN_RE, "italic") : `italic ${font}`;
	return font;
};
const fallbackNodeId = (node) => {
	let acc = "";
	const walk = (n) => {
		if (n === null || typeof n !== "object") return true;
		const obj = n;
		if (typeof obj.text === "string") {
			acc += obj.text;
			return acc.length < 64;
		}
		const children = obj.children;
		if (!Array.isArray(children)) return true;
		for (const child of children) if (!walk(child)) return false;
		return true;
	};
	walk(node);
	return `t:${acc.slice(0, 64)}`;
};
const HEADING_SPACING_FACTOR = 1.2;
const QUOTE_OR_CODE_SPACING_FACTOR = 1;
const BODY_SPACING_FACTOR = .5;
const HEADING_TYPES = new Set([
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6"
]);
const QUOTE_OR_CODE_TYPES = new Set(["blockquote", "code_block"]);
const blockSpacingPx = (type, sizePx) => {
	if (type !== void 0) {
		if (HEADING_TYPES.has(type)) return sizePx * HEADING_SPACING_FACTOR;
		if (QUOTE_OR_CODE_TYPES.has(type)) return sizePx * QUOTE_OR_CODE_SPACING_FACTOR;
	}
	return sizePx * BODY_SPACING_FACTOR;
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
* rAF-coalesce the input value: rapid edits/resizes feed the latest snapshot
* to the next animation frame instead of triggering a paginate per change.
* Initial render returns the input synchronously so first paint is correct.
*/
const useRafCoalesced = (value) => {
	const $ = c(3);
	const [coalesced, setCoalesced] = useState(value);
	const latestRef = useRef(value);
	const rafIdRef = useRef(null);
	let t0;
	let t1;
	if ($[0] !== value) {
		t0 = () => {
			latestRef.current = value;
			if (typeof window === "undefined") {
				setCoalesced(value);
				return;
			}
			if (rafIdRef.current !== null) return;
			rafIdRef.current = window.requestAnimationFrame(() => {
				rafIdRef.current = null;
				setCoalesced(latestRef.current);
			});
			return () => {
				if (rafIdRef.current !== null) {
					window.cancelAnimationFrame(rafIdRef.current);
					rafIdRef.current = null;
				}
			};
		};
		t1 = [value];
		$[0] = value;
		$[1] = t0;
		$[2] = t1;
	} else {
		t0 = $[1];
		t1 = $[2];
	}
	useEffect(t0, t1);
	return coalesced;
};
/**
* Project the editor's children into the derived page sequence for variant A.
*
* `value` and `options` are rAF-coalesced before pagination so a burst of
* keystrokes or a resize storm trigger at most one `paginate()` per frame.
* Pretext's `prepare()` is cached per `(node.id, marksFingerprint, font,
* width)` inside the measurer, so unchanged blocks skip the expensive pass
* even on repeated cycles.
*
* The latest snapshot is mirrored to the LIVE editor instance so
* `editor.api.pagination.getPages()` resolves without a hook — without this,
* callers outside the overlay subtree would never see populated pages.
*/
const usePageLayout = (editor, value, options) => {
	const $ = c(18);
	const measurer = usePretextMeasurer(editor);
	const coalescedValue = useRafCoalesced(value);
	const coalescedOptions = useRafCoalesced(options);
	let t0;
	if ($[0] !== coalescedOptions.footerHeight || $[1] !== coalescedOptions.footnotePlacement || $[2] !== coalescedOptions.footnoteWell || $[3] !== coalescedOptions.headerHeight || $[4] !== coalescedOptions.margins || $[5] !== coalescedOptions.pageSize || $[6] !== coalescedValue || $[7] !== editor || $[8] !== measurer) {
		bb0: {
			const rect = resolvePageRect(coalescedOptions.pageSize, coalescedOptions.margins, {
				footer: coalescedOptions.footerHeight,
				footnoteWell: coalescedOptions.footnoteWell,
				header: coalescedOptions.headerHeight
			});
			const raw = paginate({
				ctx: {
					font: "",
					marksFingerprint: "",
					width: rect.contentWidth
				},
				doc: coalescedValue,
				footnotePlacement: coalescedOptions.footnotePlacement,
				measurer,
				rect
			});
			if (coalescedOptions.footnotePlacement === "documentEnd") {
				t0 = raw;
				break bb0;
			}
			let t1$1;
			if ($[10] !== editor) {
				t1$1 = editor.getType(FOOTNOTE_DEFINITION_KEY);
				$[10] = editor;
				$[11] = t1$1;
			} else t1$1 = $[11];
			const footnoteDefinitionType = t1$1;
			let t2$1;
			if ($[12] !== footnoteDefinitionType) {
				t2$1 = (n) => n.type === footnoteDefinitionType;
				$[12] = footnoteDefinitionType;
				$[13] = t2$1;
			} else t2$1 = $[13];
			t0 = allocateFootnotes(raw, coalescedValue.filter(t2$1));
		}
		$[0] = coalescedOptions.footerHeight;
		$[1] = coalescedOptions.footnotePlacement;
		$[2] = coalescedOptions.footnoteWell;
		$[3] = coalescedOptions.headerHeight;
		$[4] = coalescedOptions.margins;
		$[5] = coalescedOptions.pageSize;
		$[6] = coalescedValue;
		$[7] = editor;
		$[8] = measurer;
		$[9] = t0;
	} else t0 = $[9];
	const pages = t0;
	let t1;
	let t2;
	if ($[14] !== editor || $[15] !== pages) {
		t1 = () => {
			setEditorPages(editor, pages);
		};
		t2 = [editor, pages];
		$[14] = editor;
		$[15] = pages;
		$[16] = t1;
		$[17] = t2;
	} else {
		t1 = $[16];
		t2 = $[17];
	}
	useIsomorphicLayoutEffect(t1, t2);
	return pages;
};

//#endregion
//#region src/react/page-overlay.tsx
const PAGE_GAP = 24;
/**
* Paged view (variant A — full takeover).
*
* - `mode === 'paged'`: hides the live `<Editable />` via a global
*   `data-plate-pagination-mode="paged"` attribute on `<body>` (consumer
*   stylesheet uses `body[data-plate-pagination-mode='paged'] [data-slate-editor] { display: none }`)
*   and stacks `PageFrame`s vertically. Content inside each frame is
*   rendered via `PlateStatic` (read-only) so users see the document laid
*   out exactly as it will print.
* - `mode === 'standard'`: renders absolutely nothing (besides the
*   {@link FootnotePortal} which hides in-flow footnote definitions when
*   the option opts in). The editor stays in continuous-flow mode.
*
* The `afterEditable` slot is the right home for the paged view because
* it sits inside the Plate provider (so `usePluginOption`/`useEditorRef`
* work) and runs after the Editable mounts, so the global attribute hook
* applies before the live editor would otherwise show through.
*/
const PageOverlay = () => {
	const [mounted, setMounted] = React.useState(false);
	React.useEffect(() => {
		setMounted(true);
	}, []);
	const editor = useEditorRef();
	const mode = usePluginOption(BasePaginationPlugin, "mode");
	const pageSize = usePluginOption(BasePaginationPlugin, "pageSize");
	const pageBorder = usePluginOption(BasePaginationPlugin, "pageBorder");
	const margins = usePluginOption(BasePaginationPlugin, "margins");
	const footerHeight = usePluginOption(BasePaginationPlugin, "footerHeight");
	const footnotePlacement = usePluginOption(BasePaginationPlugin, "footnotePlacement");
	const footnoteWell = usePluginOption(BasePaginationPlugin, "footnoteWell");
	const headerHeight = usePluginOption(BasePaginationPlugin, "headerHeight");
	const includeFootnoteSubPlugins = usePluginOption(BasePaginationPlugin, "includeFootnoteSubPlugins");
	const previewVisible = usePluginOption(BasePaginationPlugin, "previewVisible");
	const previewWidth = usePluginOption(BasePaginationPlugin, "previewWidth");
	const value = useEditorValue();
	const safeOptions = React.useMemo(() => resolvePaginationOptions({
		footerHeight,
		footnotePlacement,
		footnoteWell,
		headerHeight,
		includeFootnoteSubPlugins,
		margins,
		mode,
		pageBorder,
		pageSize,
		previewVisible,
		previewWidth
	}), [
		footerHeight,
		footnotePlacement,
		footnoteWell,
		headerHeight,
		includeFootnoteSubPlugins,
		margins,
		mode,
		pageBorder,
		pageSize,
		previewVisible,
		previewWidth
	]);
	const pages = usePageLayout(editor, value, safeOptions);
	const isPaged = mode === "paged";
	React.useEffect(() => {
		const body = document.body;
		if (isPaged) body.dataset.platePaginationMode = "paged";
		else delete body.dataset.platePaginationMode;
		return () => {
			delete body.dataset.platePaginationMode;
		};
	}, [isPaged]);
	if (!mounted) return null;
	const footnoteDefinitionType = editor.getType(FOOTNOTE_DEFINITION_KEY);
	const footnotesInFooter = safeOptions.footnotePlacement === "footer";
	const footnotePortal = /* @__PURE__ */ React.createElement(FootnotePortal, {
		enabled: footnotesInFooter,
		footnoteDefinitionType
	});
	if (!isPaged) return footnotePortal;
	if (pages.length === 0) return footnotePortal;
	const headerType = editor.getType(HEADER_KEY);
	const footerType = editor.getType(FOOTER_KEY);
	const documentHeader = value.find((n) => n.type === headerType);
	const documentFooter = value.find((n_0) => n_0.type === footerType);
	let runningTop = 0;
	const pageRows = pages.map((page) => {
		const top = runningTop;
		runningTop += page.rect.height + PAGE_GAP;
		return {
			page,
			top
		};
	});
	const stackHeight = Math.max(0, runningTop - PAGE_GAP);
	const pageWidth = pages[0]?.rect.width ?? 0;
	return /* @__PURE__ */ React.createElement(React.Fragment, null, footnotePortal, /* @__PURE__ */ React.createElement("style", { "data-plate-pagination-style": "" }, `body[data-plate-pagination-mode="paged"] [data-slate-editor]{display:none!important;}`), /* @__PURE__ */ React.createElement("div", {
		"aria-label": "Paginated document view",
		"data-plate-pagination-paged-view": "",
		role: "region",
		style: {
			background: "rgba(248, 250, 252, 1)",
			minHeight: "100vh",
			padding: "24px 0",
			position: "relative",
			width: "100%"
		}
	}, /* @__PURE__ */ React.createElement("div", {
		"data-plate-pagination-stack": "",
		style: {
			height: stackHeight,
			margin: "0 auto",
			position: "relative",
			width: pageWidth
		}
	}, pageRows.map(({ page: page_0, top: top_0 }) => /* @__PURE__ */ React.createElement(PageFrame, {
		key: `page-${page_0.pageIndex}`,
		chrome: {
			footerHeight: safeOptions.footerHeight,
			footnoteWell: safeOptions.footnoteWell,
			headerHeight: safeOptions.headerHeight,
			margins: safeOptions.margins,
			pageBorder: safeOptions.pageBorder
		},
		documentFooter,
		documentHeader,
		editor,
		footnotesInFooter,
		page: page_0,
		top: top_0
	})))));
};

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
//#region src/react/pagination-toolbar.tsx
const CHOICES = [
	{
		label: "Standard",
		mode: "standard",
		value: "standard"
	},
	{
		label: "A4",
		mode: "paged",
		size: "A4",
		value: "A4"
	},
	{
		label: "US Letter",
		mode: "paged",
		size: "Letter",
		value: "Letter"
	},
	{
		label: "Legal",
		mode: "paged",
		size: "Legal",
		value: "Legal"
	},
	{
		label: "Custom…",
		mode: "paged",
		value: "custom"
	}
];
/**
* Single toolbar dropdown that owns BOTH the visualisation mode and the
* paper preset. Picking a paper preset implies paged mode; picking
* `Standard` flips to continuous flow.
*
* `Custom…` opens the margins dialog (toggled by raising the
* `onCustomRequested` callback). The dialog itself is rendered by the host
* application — keeping this component portable across UI libraries.
*/
const PaginationToolbar = (t0) => {
	const $ = c(10);
	const { onCustomRequested } = t0;
	const editor = useEditorRef();
	const mode = usePluginOption(BasePaginationPlugin, "mode");
	const pageSize = usePluginOption(BasePaginationPlugin, "pageSize");
	let t1;
	bb0: {
		if (mode === "standard") {
			t1 = "standard";
			break bb0;
		}
		if (typeof pageSize === "string") {
			t1 = pageSize;
			break bb0;
		}
		t1 = "custom";
	}
	const currentValue = t1;
	let t2;
	if ($[0] !== editor.tf || $[1] !== onCustomRequested) {
		t2 = (event) => {
			const value = event.target.value;
			const tf = editor.tf;
			if (value === "custom") {
				tf.pagination.setMode("paged");
				onCustomRequested?.();
				return;
			}
			const choice = CHOICES.find((c$1) => c$1.value === value);
			if (!choice) return;
			tf.pagination.setMode(choice.mode);
			if (choice.size !== void 0) tf.pagination.setPageSize(choice.size);
		};
		$[0] = editor.tf;
		$[1] = onCustomRequested;
		$[2] = t2;
	} else t2 = $[2];
	const handleChange = t2;
	let t3;
	let t4;
	if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
		t3 = {
			alignItems: "center",
			display: "inline-flex",
			fontSize: 13,
			gap: 6
		};
		t4 = /* @__PURE__ */ React.createElement("span", { style: { color: "rgba(15,23,42,0.6)" } }, "Page");
		$[3] = t3;
		$[4] = t4;
	} else {
		t3 = $[3];
		t4 = $[4];
	}
	let t5;
	let t6;
	if ($[5] === Symbol.for("react.memo_cache_sentinel")) {
		t5 = {
			background: "#fff",
			border: "1px solid rgba(15,23,42,0.18)",
			borderRadius: 4,
			padding: "4px 8px"
		};
		t6 = CHOICES.map(_temp);
		$[5] = t5;
		$[6] = t6;
	} else {
		t5 = $[5];
		t6 = $[6];
	}
	let t7;
	if ($[7] !== currentValue || $[8] !== handleChange) {
		t7 = /* @__PURE__ */ React.createElement("label", {
			"data-plate-pagination-toolbar": "",
			style: t3
		}, t4, /* @__PURE__ */ React.createElement("select", {
			"aria-label": "Page mode and size",
			onChange: handleChange,
			value: currentValue,
			style: t5
		}, t6));
		$[7] = currentValue;
		$[8] = handleChange;
		$[9] = t7;
	} else t7 = $[9];
	return t7;
};
function _temp(choice_0) {
	return /* @__PURE__ */ React.createElement("option", {
		key: choice_0.value,
		value: choice_0.value
	}, choice_0.label);
}

//#endregion
//#region src/react/standard-frame.tsx
/**
* `render.beforeEditable` slot — intentionally empty.
*
* Standard mode (`mode === 'standard'`) shows NO chrome anywhere: the editor
* is presented as a continuous flow with no header band, no footer band, no
* footnote well — exactly as if pagination were disabled.
*
* Paged mode (`mode === 'paged'`) renders all chrome inside per-page
* `PageFrame` components painted by the `afterEditable` slot, so this slot
* stays empty in both modes. Kept exported so the plugin's render contract
* can grow without breaking imports.
*/
const StandardHeaderRail = () => {
	usePluginOption(BasePaginationPlugin, "mode");
	return null;
};
/**
* `render.afterEditable` slot — also empty when the plugin uses its own
* paged view via `PageOverlay`.
*
* The playground / consumer composition is expected to register
* `PageOverlay` directly on `afterEditable` when it wants the paged view.
* The plugin keeps this slot empty by default to avoid double-rendering
* chrome when a host overrides the slot.
*/
const StandardFooterAndPanel = () => {
	usePluginOption(BasePaginationPlugin, "mode");
	return null;
};

//#endregion
export { FooterPlugin, FootnotePortal, HeaderPlugin, MarginsDialog, PageBreakPlugin, PageFrame, PageOverlay, PaginationPlugin, PaginationToolbar, StandardFooterAndPanel, StandardHeaderRail, usePretextMeasurer };
//# sourceMappingURL=index.js.map