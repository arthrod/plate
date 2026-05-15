import { A as HEADER_KEY, C as BaseFirstPageHeaderPlugin, D as FIRST_PAGE_HEADER_KEY, E as FIRST_PAGE_FOOTER_KEY, O as FOOTER_KEY, S as BaseFooterPlugin, T as allocateFootnotes, b as BasePageBreakPlugin, j as PAGINATION_KEY, k as FOOTNOTE_DEFINITION_KEY, n as BasePaginationPlugin, p as resolvePaginationOptions, t as paginate, w as BaseFirstPageFooterPlugin, x as BaseHeaderPlugin, y as setEditorPages } from "../paginate-D-Fq-G4v.js";
import { c } from "react-compiler-runtime";
import * as React from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { toPlatePlugin, toTPlatePlugin, useEditorRef, useEditorValue, usePluginOption, useSelected } from "platejs/react";
import { PlateStatic, createStaticEditor } from "platejs/static";
import { layout, prepare } from "@chenglou/pretext";
import { measureRichInlineStats, prepareRichInline } from "@chenglou/pretext/rich-inline";
import { FootnoteDefinitionPlugin, FootnoteInputPlugin, FootnoteReferencePlugin } from "@platejs/footnote/react";

//#region src/react/chrome-shell.tsx
/**
* Default human-readable label per chrome kind.
*
* Consumers can override via `<ChromeShell label="Custom label" ...>` when a
* design system has its own copy.
*/
const DEFAULT_LABEL = {
	firstPageFooter: "First-page footer",
	firstPageHeader: "First-page header",
	footer: "Footer",
	header: "Header"
};
/**
* Selection-aware wrapper for header/footer chrome regions.
*
* Renders children plain in the unselected state. Once the user's selection
* lands inside the chrome (detected via slate-react's `useSelected`), shows
* a dotted focus border, a label badge, and an optional "Exit chrome"
* button. Plain reading mode (no selection) is visually unchanged so the
* paged view stays clean.
*
* Author wiring (registry kit):
* ```tsx
* import { PlateElement } from 'platejs/react';
* import { ChromeShell } from '@platejs/pagination/react';
*
* export const HeaderElement = (props) => (
*   <ChromeShell kind="header" onExit={() => props.editor.tf.blur()}>
*     <PlateElement {...props} />
*   </ChromeShell>
* );
* ```
*/
const ChromeShell = (t0) => {
	const $ = c(14);
	const { children, className, kind, label, onExit, style } = t0;
	const selected = useSelected();
	const resolvedLabel = label ?? DEFAULT_LABEL[kind];
	let t1;
	if ($[0] !== selected || $[1] !== style) {
		t1 = selected ? {
			border: "1px dashed rgba(59,130,246,0.6)",
			borderRadius: 4,
			margin: -3,
			padding: 2,
			position: "relative",
			...style
		} : {
			position: "relative",
			...style
		};
		$[0] = selected;
		$[1] = style;
		$[2] = t1;
	} else t1 = $[2];
	const wrapperStyle = t1;
	const t2 = selected ? "" : void 0;
	let t3;
	if ($[3] !== onExit || $[4] !== resolvedLabel || $[5] !== selected) {
		t3 = selected ? /* @__PURE__ */ React.createElement("div", {
			"data-plate-pagination-chrome-toolbar": "",
			contentEditable: false,
			style: {
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				color: "rgba(59,130,246,0.95)",
				fontSize: 11,
				left: 0,
				padding: "0 4px",
				pointerEvents: "none",
				position: "absolute",
				right: 0,
				top: -16,
				userSelect: "none"
			}
		}, /* @__PURE__ */ React.createElement("span", {
			"data-plate-pagination-chrome-label": "",
			style: {
				background: "rgba(59,130,246,0.08)",
				borderRadius: 3,
				padding: "0 4px",
				pointerEvents: "auto"
			}
		}, resolvedLabel), onExit ? /* @__PURE__ */ React.createElement("button", {
			"data-plate-pagination-chrome-exit": "",
			onClick: onExit,
			onMouseDown: _temp$3,
			style: {
				background: "transparent",
				border: "none",
				color: "rgba(59,130,246,0.95)",
				cursor: "pointer",
				fontSize: 11,
				padding: "0 4px",
				pointerEvents: "auto"
			},
			type: "button"
		}, "Exit") : null) : null;
		$[3] = onExit;
		$[4] = resolvedLabel;
		$[5] = selected;
		$[6] = t3;
	} else t3 = $[6];
	let t4;
	if ($[7] !== children || $[8] !== className || $[9] !== kind || $[10] !== t2 || $[11] !== t3 || $[12] !== wrapperStyle) {
		t4 = /* @__PURE__ */ React.createElement("div", {
			"data-plate-pagination-chrome": kind,
			"data-plate-pagination-chrome-focused": t2,
			className,
			style: wrapperStyle
		}, t3, children);
		$[7] = children;
		$[8] = className;
		$[9] = kind;
		$[10] = t2;
		$[11] = t3;
		$[12] = wrapperStyle;
		$[13] = t4;
	} else t4 = $[13];
	return t4;
};
function _temp$3(e) {
	return e.preventDefault();
}

//#endregion
//#region src/react/first-page-footer-plugin.ts
const FirstPageFooterPlugin = toPlatePlugin(BaseFirstPageFooterPlugin);

//#endregion
//#region src/react/first-page-header-plugin.ts
const FirstPageHeaderPlugin = toPlatePlugin(BaseFirstPageHeaderPlugin);

//#endregion
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
* Built-in page-size presets in CSS pixels (96 dpi).
*
* Width/height are stored as the literal `{ width, height }` shape because
* `BasePaginationOptions.pageSize` accepts either a preset key or a literal.
* We reconstruct the literal client-side for predictable rendering even if
* the host's `resolvePageRect` would also accept the preset key.
*/
const SIZE_PRESETS = {
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
/**
* Page Setup dialog — full BasePaginationOptions surface.
*
* Replaces the v1 four-margin dialog with: page-size presets, per-axis
* margins (with unit toggle), header/footer heights, footnote placement
* toggle, first-page-different toggle, and the page-number slot config
* (region/align/format/startAt/hideOnFirst).
*
* All edits flow through `editor.tf.pagination.*` transforms — no direct
* `setOption` calls — so consumers that override transforms see the same
* behavior they get from the toolbar buttons.
*
* The host opens this from the toolbar's `Page Setup…` button. v1 ships a
* native `<dialog>`; the host may swap for a shadcn/Radix Dialog while
* keeping this state-management contract.
*/
const PageSetupDialog = (t0) => {
	const $ = c(145);
	const { onClose, open } = t0;
	const editor = useEditorRef();
	const margins = usePluginOption(BasePaginationPlugin, "margins");
	const headerHeight = usePluginOption(BasePaginationPlugin, "headerHeight");
	const footerHeight = usePluginOption(BasePaginationPlugin, "footerHeight");
	const footnotePlacement = usePluginOption(BasePaginationPlugin, "footnotePlacement");
	const pageSize = usePluginOption(BasePaginationPlugin, "pageSize");
	const pageNumber = usePluginOption(BasePaginationPlugin, "pageNumber");
	const firstPageDifferent = usePluginOption(BasePaginationPlugin, "firstPageDifferent");
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
	if (!margins || !pageNumber) return null;
	const tf = editor.tf;
	let t3;
	if ($[3] !== tf.pagination || $[4] !== unit) {
		t3 = (side, valueRaw) => {
			const v = Number.parseFloat(valueRaw);
			if (!Number.isFinite(v)) return;
			tf.pagination.setMargins({ [side]: Math.round(v * PX_PER_UNIT[unit]) });
		};
		$[3] = tf.pagination;
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
	const sizeKey = typeof pageSize === "string" && pageSize in SIZE_PRESETS ? pageSize : "custom";
	const sizeLiteral = typeof pageSize === "object" ? pageSize : SIZE_PRESETS[typeof pageSize === "string" && pageSize in SIZE_PRESETS ? pageSize : "A4"];
	let t5;
	if ($[8] !== sizeLiteral || $[9] !== tf.pagination) {
		t5 = (next) => {
			if (next === "custom") {
				tf.pagination.setPageSize(sizeLiteral);
				return;
			}
			tf.pagination.setPageSize(next);
		};
		$[8] = sizeLiteral;
		$[9] = tf.pagination;
		$[10] = t5;
	} else t5 = $[10];
	const setSize = t5;
	let t6;
	if ($[11] !== sizeLiteral || $[12] !== tf.pagination || $[13] !== unit) {
		t6 = (axis, valueRaw_0) => {
			const v_0 = Number.parseFloat(valueRaw_0);
			if (!Number.isFinite(v_0)) return;
			const px_0 = Math.round(v_0 * PX_PER_UNIT[unit]);
			tf.pagination.setPageSize({
				...sizeLiteral,
				[axis]: px_0
			});
		};
		$[11] = sizeLiteral;
		$[12] = tf.pagination;
		$[13] = unit;
		$[14] = t6;
	} else t6 = $[14];
	const setSizeAxis = t6;
	let t7;
	if ($[15] !== tf.pagination || $[16] !== unit) {
		t7 = (key, valueRaw_1) => {
			const v_1 = Number.parseFloat(valueRaw_1);
			if (!Number.isFinite(v_1) || v_1 < 0) return;
			const px_1 = Math.round(v_1 * PX_PER_UNIT[unit]);
			if (key === "headerHeight") tf.pagination.setHeaderHeight(px_1);
			else tf.pagination.setFooterHeight(px_1);
		};
		$[15] = tf.pagination;
		$[16] = unit;
		$[17] = t7;
	} else t7 = $[17];
	const setHeight = t7;
	let t8;
	if ($[18] === Symbol.for("react.memo_cache_sentinel")) {
		t8 = {
			border: "1px solid rgba(15,23,42,0.18)",
			borderRadius: 8,
			boxShadow: "0 24px 64px rgba(15,23,42,0.18)",
			maxHeight: "85vh",
			maxWidth: 480,
			overflowY: "auto",
			padding: 16
		};
		$[18] = t8;
	} else t8 = $[18];
	let t10;
	let t9;
	if ($[19] === Symbol.for("react.memo_cache_sentinel")) {
		t9 = {
			display: "grid",
			gap: 14
		};
		t10 = /* @__PURE__ */ React.createElement("div", { style: {
			fontSize: 14,
			fontWeight: 600
		} }, "Page Setup");
		$[19] = t10;
		$[20] = t9;
	} else {
		t10 = $[19];
		t9 = $[20];
	}
	let t11;
	let t12;
	let t13;
	let t14;
	let t15;
	let t16;
	if ($[21] === Symbol.for("react.memo_cache_sentinel")) {
		t11 = (e) => setUnit(e.target.value);
		t12 = { flex: 1 };
		t13 = /* @__PURE__ */ React.createElement("option", { value: "px" }, "Pixels");
		t14 = /* @__PURE__ */ React.createElement("option", { value: "in" }, "Inches");
		t15 = /* @__PURE__ */ React.createElement("option", { value: "cm" }, "Centimeters");
		t16 = /* @__PURE__ */ React.createElement("option", { value: "mm" }, "Millimeters");
		$[21] = t11;
		$[22] = t12;
		$[23] = t13;
		$[24] = t14;
		$[25] = t15;
		$[26] = t16;
	} else {
		t11 = $[21];
		t12 = $[22];
		t13 = $[23];
		t14 = $[24];
		t15 = $[25];
		t16 = $[26];
	}
	let t17;
	if ($[27] !== unit) {
		t17 = /* @__PURE__ */ React.createElement(Section, { title: "Units" }, /* @__PURE__ */ React.createElement(Row, { label: "Unit" }, /* @__PURE__ */ React.createElement("select", {
			value: unit,
			onChange: t11,
			style: t12
		}, t13, t14, t15, t16)));
		$[27] = unit;
		$[28] = t17;
	} else t17 = $[28];
	let t18;
	if ($[29] !== setSize) {
		t18 = (e_0) => setSize(e_0.target.value);
		$[29] = setSize;
		$[30] = t18;
	} else t18 = $[30];
	let t19;
	let t20;
	let t21;
	let t22;
	let t23;
	if ($[31] === Symbol.for("react.memo_cache_sentinel")) {
		t19 = { flex: 1 };
		t20 = /* @__PURE__ */ React.createElement("option", { value: "A4" }, "A4");
		t21 = /* @__PURE__ */ React.createElement("option", { value: "Letter" }, "Letter");
		t22 = /* @__PURE__ */ React.createElement("option", { value: "Legal" }, "Legal");
		t23 = /* @__PURE__ */ React.createElement("option", { value: "custom" }, "Custom…");
		$[31] = t19;
		$[32] = t20;
		$[33] = t21;
		$[34] = t22;
		$[35] = t23;
	} else {
		t19 = $[31];
		t20 = $[32];
		t21 = $[33];
		t22 = $[34];
		t23 = $[35];
	}
	let t24;
	if ($[36] !== sizeKey || $[37] !== t18) {
		t24 = /* @__PURE__ */ React.createElement(Row, { label: "Preset" }, /* @__PURE__ */ React.createElement("select", {
			value: sizeKey,
			onChange: t18,
			style: t19
		}, t20, t21, t22, t23));
		$[36] = sizeKey;
		$[37] = t18;
		$[38] = t24;
	} else t24 = $[38];
	let t25;
	if ($[39] !== setSizeAxis || $[40] !== sizeKey || $[41] !== sizeLiteral || $[42] !== toUnit || $[43] !== unit) {
		t25 = sizeKey === "custom" ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Row, { label: "Width" }, /* @__PURE__ */ React.createElement(NumberInput, {
			onCommit: (v_2) => setSizeAxis("width", v_2),
			value: toUnit(sizeLiteral.width),
			inputKey: `${unit}-w-${sizeLiteral.width}`
		})), /* @__PURE__ */ React.createElement(Row, { label: "Height" }, /* @__PURE__ */ React.createElement(NumberInput, {
			onCommit: (v_3) => setSizeAxis("height", v_3),
			value: toUnit(sizeLiteral.height),
			inputKey: `${unit}-h-${sizeLiteral.height}`
		}))) : null;
		$[39] = setSizeAxis;
		$[40] = sizeKey;
		$[41] = sizeLiteral;
		$[42] = toUnit;
		$[43] = unit;
		$[44] = t25;
	} else t25 = $[44];
	let t26;
	if ($[45] !== t24 || $[46] !== t25) {
		t26 = /* @__PURE__ */ React.createElement(Section, { title: "Page size" }, t24, t25);
		$[45] = t24;
		$[46] = t25;
		$[47] = t26;
	} else t26 = $[47];
	let t27;
	if ($[48] !== margins || $[49] !== setSide || $[50] !== toUnit || $[51] !== unit) {
		t27 = /* @__PURE__ */ React.createElement(Section, { title: "Margins" }, [
			"top",
			"right",
			"bottom",
			"left"
		].map((side_0) => /* @__PURE__ */ React.createElement(Row, {
			key: side_0,
			label: side_0[0].toUpperCase() + side_0.slice(1)
		}, /* @__PURE__ */ React.createElement(NumberInput, {
			onCommit: (v_4) => setSide(side_0, v_4),
			value: toUnit(margins[side_0]),
			inputKey: `${unit}-${side_0}-${margins[side_0]}`
		}))));
		$[48] = margins;
		$[49] = setSide;
		$[50] = toUnit;
		$[51] = unit;
		$[52] = t27;
	} else t27 = $[52];
	let t28;
	if ($[53] !== setHeight) {
		t28 = (v_5) => setHeight("headerHeight", v_5);
		$[53] = setHeight;
		$[54] = t28;
	} else t28 = $[54];
	const t29 = headerHeight ?? 0;
	let t30;
	if ($[55] !== t29 || $[56] !== toUnit) {
		t30 = toUnit(t29);
		$[55] = t29;
		$[56] = toUnit;
		$[57] = t30;
	} else t30 = $[57];
	const t31 = `${unit}-h-${headerHeight}`;
	let t32;
	if ($[58] !== t28 || $[59] !== t30 || $[60] !== t31) {
		t32 = /* @__PURE__ */ React.createElement(Row, { label: "Header" }, /* @__PURE__ */ React.createElement(NumberInput, {
			onCommit: t28,
			value: t30,
			inputKey: t31
		}));
		$[58] = t28;
		$[59] = t30;
		$[60] = t31;
		$[61] = t32;
	} else t32 = $[61];
	let t33;
	if ($[62] !== setHeight) {
		t33 = (v_6) => setHeight("footerHeight", v_6);
		$[62] = setHeight;
		$[63] = t33;
	} else t33 = $[63];
	const t34 = footerHeight ?? 0;
	let t35;
	if ($[64] !== t34 || $[65] !== toUnit) {
		t35 = toUnit(t34);
		$[64] = t34;
		$[65] = toUnit;
		$[66] = t35;
	} else t35 = $[66];
	const t36 = `${unit}-f-${footerHeight}`;
	let t37;
	if ($[67] !== t33 || $[68] !== t35 || $[69] !== t36) {
		t37 = /* @__PURE__ */ React.createElement(Row, { label: "Footer" }, /* @__PURE__ */ React.createElement(NumberInput, {
			onCommit: t33,
			value: t35,
			inputKey: t36
		}));
		$[67] = t33;
		$[68] = t35;
		$[69] = t36;
		$[70] = t37;
	} else t37 = $[70];
	let t38;
	if ($[71] !== t32 || $[72] !== t37) {
		t38 = /* @__PURE__ */ React.createElement(Section, { title: "Chrome heights" }, t32, t37);
		$[71] = t32;
		$[72] = t37;
		$[73] = t38;
	} else t38 = $[73];
	let t39;
	if ($[74] !== tf.pagination) {
		t39 = (e_1) => tf.pagination.setPageNumber({ region: e_1.target.value });
		$[74] = tf.pagination;
		$[75] = t39;
	} else t39 = $[75];
	let t40;
	let t41;
	let t42;
	if ($[76] === Symbol.for("react.memo_cache_sentinel")) {
		t40 = { flex: 1 };
		t41 = /* @__PURE__ */ React.createElement("option", { value: "header" }, "Header");
		t42 = /* @__PURE__ */ React.createElement("option", { value: "footer" }, "Footer");
		$[76] = t40;
		$[77] = t41;
		$[78] = t42;
	} else {
		t40 = $[76];
		t41 = $[77];
		t42 = $[78];
	}
	let t43;
	if ($[79] !== pageNumber.region || $[80] !== t39) {
		t43 = /* @__PURE__ */ React.createElement(Row, { label: "Region" }, /* @__PURE__ */ React.createElement("select", {
			value: pageNumber.region,
			onChange: t39,
			style: t40
		}, t41, t42));
		$[79] = pageNumber.region;
		$[80] = t39;
		$[81] = t43;
	} else t43 = $[81];
	let t44;
	if ($[82] !== tf.pagination) {
		t44 = (e_2) => tf.pagination.setPageNumber({ align: e_2.target.value });
		$[82] = tf.pagination;
		$[83] = t44;
	} else t44 = $[83];
	let t45;
	let t46;
	let t47;
	let t48;
	if ($[84] === Symbol.for("react.memo_cache_sentinel")) {
		t45 = { flex: 1 };
		t46 = /* @__PURE__ */ React.createElement("option", { value: "left" }, "Left");
		t47 = /* @__PURE__ */ React.createElement("option", { value: "center" }, "Center");
		t48 = /* @__PURE__ */ React.createElement("option", { value: "right" }, "Right");
		$[84] = t45;
		$[85] = t46;
		$[86] = t47;
		$[87] = t48;
	} else {
		t45 = $[84];
		t46 = $[85];
		t47 = $[86];
		t48 = $[87];
	}
	let t49;
	if ($[88] !== pageNumber.align || $[89] !== t44) {
		t49 = /* @__PURE__ */ React.createElement(Row, { label: "Align" }, /* @__PURE__ */ React.createElement("select", {
			value: pageNumber.align,
			onChange: t44,
			style: t45
		}, t46, t47, t48));
		$[88] = pageNumber.align;
		$[89] = t44;
		$[90] = t49;
	} else t49 = $[90];
	let t50;
	if ($[91] !== tf.pagination) {
		t50 = (e_3) => tf.pagination.setPageNumber({ format: e_3.target.value });
		$[91] = tf.pagination;
		$[92] = t50;
	} else t50 = $[92];
	let t51;
	let t52;
	let t53;
	let t54;
	if ($[93] === Symbol.for("react.memo_cache_sentinel")) {
		t51 = { flex: 1 };
		t52 = /* @__PURE__ */ React.createElement("option", { value: "1" }, "1");
		t53 = /* @__PURE__ */ React.createElement("option", { value: "1/N" }, "1/N");
		t54 = /* @__PURE__ */ React.createElement("option", { value: "Page 1 of N" }, "Page 1 of N");
		$[93] = t51;
		$[94] = t52;
		$[95] = t53;
		$[96] = t54;
	} else {
		t51 = $[93];
		t52 = $[94];
		t53 = $[95];
		t54 = $[96];
	}
	let t55;
	if ($[97] !== pageNumber.format || $[98] !== t50) {
		t55 = /* @__PURE__ */ React.createElement(Row, { label: "Format" }, /* @__PURE__ */ React.createElement("select", {
			value: pageNumber.format,
			onChange: t50,
			style: t51
		}, t52, t53, t54));
		$[97] = pageNumber.format;
		$[98] = t50;
		$[99] = t55;
	} else t55 = $[99];
	const t56 = `pn-start-${pageNumber.startAt}`;
	let t57;
	if ($[100] !== tf.pagination) {
		t57 = (v_7) => {
			const n = Number.parseInt(v_7, 10);
			if (!Number.isFinite(n) || n < 1) return;
			tf.pagination.setPageNumber({ startAt: n });
		};
		$[100] = tf.pagination;
		$[101] = t57;
	} else t57 = $[101];
	const t58 = String(pageNumber.startAt);
	let t59;
	if ($[102] !== t56 || $[103] !== t57 || $[104] !== t58) {
		t59 = /* @__PURE__ */ React.createElement(Row, { label: "Start at" }, /* @__PURE__ */ React.createElement(NumberInput, {
			inputKey: t56,
			min: 1,
			onCommit: t57,
			value: t58
		}));
		$[102] = t56;
		$[103] = t57;
		$[104] = t58;
		$[105] = t59;
	} else t59 = $[105];
	let t60;
	if ($[106] !== tf.pagination) {
		t60 = (e_4) => tf.pagination.setPageNumber({ hideOnFirst: e_4.target.checked });
		$[106] = tf.pagination;
		$[107] = t60;
	} else t60 = $[107];
	let t61;
	if ($[108] !== pageNumber.hideOnFirst || $[109] !== t60) {
		t61 = /* @__PURE__ */ React.createElement(Row, { label: "Hide on first" }, /* @__PURE__ */ React.createElement("input", {
			checked: pageNumber.hideOnFirst,
			onChange: t60,
			type: "checkbox"
		}));
		$[108] = pageNumber.hideOnFirst;
		$[109] = t60;
		$[110] = t61;
	} else t61 = $[110];
	let t62;
	if ($[111] !== t43 || $[112] !== t49 || $[113] !== t55 || $[114] !== t59 || $[115] !== t61) {
		t62 = /* @__PURE__ */ React.createElement(Section, { title: "Page numbers" }, t43, t49, t55, t59, t61);
		$[111] = t43;
		$[112] = t49;
		$[113] = t55;
		$[114] = t59;
		$[115] = t61;
		$[116] = t62;
	} else t62 = $[116];
	const t63 = firstPageDifferent ?? false;
	let t64;
	if ($[117] !== tf.pagination) {
		t64 = (e_5) => tf.pagination.setFirstPageDifferent(e_5.target.checked);
		$[117] = tf.pagination;
		$[118] = t64;
	} else t64 = $[118];
	let t65;
	if ($[119] !== t63 || $[120] !== t64) {
		t65 = /* @__PURE__ */ React.createElement(Section, { title: "First page" }, /* @__PURE__ */ React.createElement(Row, { label: "Different first page" }, /* @__PURE__ */ React.createElement("input", {
			checked: t63,
			onChange: t64,
			type: "checkbox"
		})));
		$[119] = t63;
		$[120] = t64;
		$[121] = t65;
	} else t65 = $[121];
	const t66 = footnotePlacement ?? "footer";
	let t67;
	if ($[122] !== tf.pagination) {
		t67 = (e_6) => tf.pagination.setFootnotePlacement(e_6.target.value);
		$[122] = tf.pagination;
		$[123] = t67;
	} else t67 = $[123];
	let t68;
	let t69;
	let t70;
	if ($[124] === Symbol.for("react.memo_cache_sentinel")) {
		t68 = { flex: 1 };
		t69 = /* @__PURE__ */ React.createElement("option", { value: "footer" }, "Page footer");
		t70 = /* @__PURE__ */ React.createElement("option", { value: "documentEnd" }, "End of document");
		$[124] = t68;
		$[125] = t69;
		$[126] = t70;
	} else {
		t68 = $[124];
		t69 = $[125];
		t70 = $[126];
	}
	let t71;
	if ($[127] !== t66 || $[128] !== t67) {
		t71 = /* @__PURE__ */ React.createElement(Section, { title: "Footnotes" }, /* @__PURE__ */ React.createElement(Row, { label: "Placement" }, /* @__PURE__ */ React.createElement("select", {
			value: t66,
			onChange: t67,
			style: t68
		}, t69, t70)));
		$[127] = t66;
		$[128] = t67;
		$[129] = t71;
	} else t71 = $[129];
	let t72;
	if ($[130] === Symbol.for("react.memo_cache_sentinel")) {
		t72 = {
			display: "flex",
			gap: 8,
			justifyContent: "flex-end"
		};
		$[130] = t72;
	} else t72 = $[130];
	let t73;
	if ($[131] !== onClose) {
		t73 = /* @__PURE__ */ React.createElement("div", { style: t72 }, /* @__PURE__ */ React.createElement("button", {
			onClick: onClose,
			type: "button"
		}, "Done"));
		$[131] = onClose;
		$[132] = t73;
	} else t73 = $[132];
	let t74;
	if ($[133] !== t17 || $[134] !== t26 || $[135] !== t27 || $[136] !== t38 || $[137] !== t62 || $[138] !== t65 || $[139] !== t71 || $[140] !== t73) {
		t74 = /* @__PURE__ */ React.createElement("form", {
			method: "dialog",
			style: t9
		}, t10, t17, t26, t27, t38, t62, t65, t71, t73);
		$[133] = t17;
		$[134] = t26;
		$[135] = t27;
		$[136] = t38;
		$[137] = t62;
		$[138] = t65;
		$[139] = t71;
		$[140] = t73;
		$[141] = t74;
	} else t74 = $[141];
	let t75;
	if ($[142] !== onClose || $[143] !== t74) {
		t75 = /* @__PURE__ */ React.createElement("dialog", {
			ref: dialogRef,
			"data-plate-pagination-page-setup-dialog": "",
			onClose,
			style: t8
		}, t74);
		$[142] = onClose;
		$[143] = t74;
		$[144] = t75;
	} else t75 = $[144];
	return t75;
};
/**
* Backwards-compatible alias for the v1 dialog name.
*
* Existing imports `import { MarginsDialog } from '@platejs/pagination/react'`
* keep working; the alias renders the full Page Setup form, which is a
* superset of the original margin-only UI.
*/
const MarginsDialog = PageSetupDialog;
const Section = (t0) => {
	const $ = c(7);
	const { children, title } = t0;
	let t1;
	let t2;
	if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
		t1 = {
			display: "grid",
			gap: 6
		};
		t2 = {
			color: "rgba(15,23,42,0.65)",
			fontSize: 11,
			fontWeight: 600,
			letterSpacing: .4,
			textTransform: "uppercase"
		};
		$[0] = t1;
		$[1] = t2;
	} else {
		t1 = $[0];
		t2 = $[1];
	}
	let t3;
	if ($[2] !== title) {
		t3 = /* @__PURE__ */ React.createElement("div", { style: t2 }, title);
		$[2] = title;
		$[3] = t3;
	} else t3 = $[3];
	let t4;
	if ($[4] !== children || $[5] !== t3) {
		t4 = /* @__PURE__ */ React.createElement("div", { style: t1 }, t3, children);
		$[4] = children;
		$[5] = t3;
		$[6] = t4;
	} else t4 = $[6];
	return t4;
};
const Row = (t0) => {
	const $ = c(7);
	const { children, label } = t0;
	let t1;
	let t2;
	if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
		t1 = {
			alignItems: "center",
			display: "flex",
			gap: 6
		};
		t2 = {
			fontSize: 13,
			width: 110
		};
		$[0] = t1;
		$[1] = t2;
	} else {
		t1 = $[0];
		t2 = $[1];
	}
	let t3;
	if ($[2] !== label) {
		t3 = /* @__PURE__ */ React.createElement("span", { style: t2 }, label);
		$[2] = label;
		$[3] = t3;
	} else t3 = $[3];
	let t4;
	if ($[4] !== children || $[5] !== t3) {
		t4 = /* @__PURE__ */ React.createElement("div", { style: t1 }, t3, children);
		$[4] = children;
		$[5] = t3;
		$[6] = t4;
	} else t4 = $[6];
	return t4;
};
/**
* Numeric input with commit-on-blur, auto-select-on-focus, and external-sync.
*
* `inputKey` should encode every external piece of state that should reset
* the input back to `value` (e.g. `${unit}-${margins.top}`). When that key
* changes React remounts this subtree so the user's stale typed string is
* replaced with the freshly-resolved option value — without that, switching
* units or clicking a margin preset leaves the input lying.
*
* `onFocus` selects the entire current value so users replace rather than
* append. The previous `defaultValue` shape silently appended typed digits
* to existing values, producing pathological margins (e.g. `96 → 96300`).
*/
const NumberInput = (t0) => {
	const $ = c(8);
	const { inputKey, min, onCommit, value } = t0;
	let t1;
	if ($[0] !== onCommit) {
		t1 = (e) => onCommit(e.target.value);
		$[0] = onCommit;
		$[1] = t1;
	} else t1 = $[1];
	let t2;
	if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
		t2 = { flex: 1 };
		$[2] = t2;
	} else t2 = $[2];
	let t3;
	if ($[3] !== inputKey || $[4] !== min || $[5] !== t1 || $[6] !== value) {
		t3 = /* @__PURE__ */ React.createElement("input", {
			defaultValue: value,
			key: inputKey,
			min,
			onBlur: t1,
			onFocus: _temp$2,
			onKeyDown: _temp2,
			style: t2,
			type: "number"
		});
		$[3] = inputKey;
		$[4] = min;
		$[5] = t1;
		$[6] = value;
		$[7] = t3;
	} else t3 = $[7];
	return t3;
};
function _temp$2(e_0) {
	return e_0.target.select();
}
function _temp2(e_1) {
	if (e_1.key === "Enter") {
		e_1.preventDefault();
		e_1.target.blur();
	}
}

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
	const $ = c(54);
	const { chrome, documentFooter, documentHeader, editor, footnotesInFooter, page, top, totalPages } = t0;
	const { rect } = page;
	const headerOffset = chrome.headerHeight;
	const footnoteWellTop = rect.height - chrome.footerHeight - chrome.footnoteWell;
	const footerTop = rect.height - chrome.footerHeight;
	let t1;
	if ($[0] !== editor) {
		t1 = getElementOnlyStaticPlugins(editor);
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
	if ($[9] !== chrome.headerHeight || $[10] !== chrome.margins.left || $[11] !== chrome.margins.right || $[12] !== chrome.pageNumber || $[13] !== documentHeader || $[14] !== page.pageIndex || $[15] !== staticPlugins || $[16] !== totalPages) {
		t3 = chrome.headerHeight > 0 ? /* @__PURE__ */ React.createElement("div", {
			"data-plate-pagination-slot": "header",
			style: {
				borderBottom: "1px dashed rgba(15,23,42,0.1)",
				color: "rgba(15,23,42,0.55)",
				fontSize: 12,
				height: chrome.headerHeight,
				left: 0,
				overflow: "hidden",
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
		}) : null, chrome.pageNumber.region === "header" ? /* @__PURE__ */ React.createElement(PageNumberSlot, {
			config: chrome.pageNumber,
			pageIndex: page.pageIndex,
			totalPages
		}) : null) : null;
		$[9] = chrome.headerHeight;
		$[10] = chrome.margins.left;
		$[11] = chrome.margins.right;
		$[12] = chrome.pageNumber;
		$[13] = documentHeader;
		$[14] = page.pageIndex;
		$[15] = staticPlugins;
		$[16] = totalPages;
		$[17] = t3;
	} else t3 = $[17];
	let t4;
	if ($[18] !== chrome.footnoteWell || $[19] !== chrome.margins.left || $[20] !== chrome.margins.right || $[21] !== footnoteWellTop || $[22] !== footnotesInFooter || $[23] !== page.footnotes || $[24] !== staticPlugins) {
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
		$[18] = chrome.footnoteWell;
		$[19] = chrome.margins.left;
		$[20] = chrome.margins.right;
		$[21] = footnoteWellTop;
		$[22] = footnotesInFooter;
		$[23] = page.footnotes;
		$[24] = staticPlugins;
		$[25] = t4;
	} else t4 = $[25];
	let t5;
	if ($[26] !== chrome.footerHeight || $[27] !== chrome.margins.left || $[28] !== chrome.margins.right || $[29] !== chrome.pageNumber || $[30] !== documentFooter || $[31] !== footerTop || $[32] !== page.pageIndex || $[33] !== staticPlugins || $[34] !== totalPages) {
		t5 = chrome.footerHeight > 0 ? /* @__PURE__ */ React.createElement("div", {
			"data-plate-pagination-slot": "footer",
			style: {
				borderTop: "1px dashed rgba(15,23,42,0.1)",
				color: "rgba(15,23,42,0.55)",
				fontSize: 12,
				height: chrome.footerHeight,
				left: 0,
				overflow: "hidden",
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
		}) : null, chrome.pageNumber.region === "footer" ? /* @__PURE__ */ React.createElement(PageNumberSlot, {
			config: chrome.pageNumber,
			pageIndex: page.pageIndex,
			totalPages
		}) : null) : null;
		$[26] = chrome.footerHeight;
		$[27] = chrome.margins.left;
		$[28] = chrome.margins.right;
		$[29] = chrome.pageNumber;
		$[30] = documentFooter;
		$[31] = footerTop;
		$[32] = page.pageIndex;
		$[33] = staticPlugins;
		$[34] = totalPages;
		$[35] = t5;
	} else t5 = $[35];
	const t6 = headerOffset + chrome.margins.top;
	let t7;
	if ($[36] !== chrome.margins.left || $[37] !== chrome.margins.right || $[38] !== rect.contentHeight || $[39] !== t6) {
		t7 = {
			height: rect.contentHeight,
			left: chrome.margins.left,
			overflow: "hidden",
			position: "absolute",
			right: chrome.margins.right,
			top: t6
		};
		$[36] = chrome.margins.left;
		$[37] = chrome.margins.right;
		$[38] = rect.contentHeight;
		$[39] = t6;
		$[40] = t7;
	} else t7 = $[40];
	let t8;
	if ($[41] !== page.nodes || $[42] !== staticPlugins) {
		t8 = /* @__PURE__ */ React.createElement(StaticPageValue, {
			plugins: staticPlugins,
			value: page.nodes
		});
		$[41] = page.nodes;
		$[42] = staticPlugins;
		$[43] = t8;
	} else t8 = $[43];
	let t9;
	if ($[44] !== t7 || $[45] !== t8) {
		t9 = /* @__PURE__ */ React.createElement("div", {
			"data-plate-pagination-slot": "content",
			style: t7
		}, t8);
		$[44] = t7;
		$[45] = t8;
		$[46] = t9;
	} else t9 = $[46];
	let t10;
	if ($[47] !== page.pageIndex || $[48] !== t2 || $[49] !== t3 || $[50] !== t4 || $[51] !== t5 || $[52] !== t9) {
		t10 = /* @__PURE__ */ React.createElement("div", {
			"data-page-index": page.pageIndex,
			"data-plate-pagination-page": "",
			style: t2
		}, t3, t4, t5, t9);
		$[47] = page.pageIndex;
		$[48] = t2;
		$[49] = t3;
		$[50] = t4;
		$[51] = t5;
		$[52] = t9;
		$[53] = t10;
	} else t10 = $[53];
	return t10;
};
/**
* Page-number slot painted inside the chosen chrome band.
*
* Pure derivation: `pageIndex + startAt` is the displayed number; format
* controls layout (`1` / `1/N` / `Page 1 of N`); align is realized through
* a flexbox row that wraps the slot. `hideOnFirst` returns `null` for page
* index 0 so cover pages stay clean.
*/
const PageNumberSlot = (t0) => {
	const $ = c(7);
	const { config, pageIndex, totalPages } = t0;
	if (config.hideOnFirst && pageIndex === 0) return null;
	const displayed = pageIndex + config.startAt;
	const label = config.format === "1/N" ? `${displayed}/${totalPages}` : config.format === "Page 1 of N" ? `Page ${displayed} of ${totalPages}` : `${displayed}`;
	const justify = config.align === "left" ? "flex-start" : config.align === "center" ? "center" : "flex-end";
	let t1;
	if ($[0] !== justify) {
		t1 = {
			display: "flex",
			justifyContent: justify,
			marginTop: 4,
			width: "100%"
		};
		$[0] = justify;
		$[1] = t1;
	} else t1 = $[1];
	let t2;
	if ($[2] !== label) {
		t2 = /* @__PURE__ */ React.createElement("span", null, label);
		$[2] = label;
		$[3] = t2;
	} else t2 = $[3];
	let t3;
	if ($[4] !== t1 || $[5] !== t2) {
		t3 = /* @__PURE__ */ React.createElement("div", {
			"data-plate-pagination-slot-page-number": "",
			style: t1
		}, t2);
		$[4] = t1;
		$[5] = t2;
		$[6] = t3;
	} else t3 = $[6];
	return t3;
};
const StaticPageValue = (t0) => {
	const $ = c(7);
	const { plugins, value } = t0;
	let t1;
	if ($[0] !== plugins || $[1] !== value) {
		let t2$1;
		if ($[3] !== plugins) {
			t2$1 = (node, i) => /* @__PURE__ */ React.createElement(PlateStaticBoundary, {
				key: `n-${i}`,
				plugins,
				value: [node]
			}, /* @__PURE__ */ React.createElement(FallbackPageText, { value: [node] }));
			$[3] = plugins;
			$[4] = t2$1;
		} else t2$1 = $[4];
		t1 = value.map(t2$1);
		$[0] = plugins;
		$[1] = value;
		$[2] = t1;
	} else t1 = $[2];
	let t2;
	if ($[5] !== t1) {
		t2 = /* @__PURE__ */ React.createElement("div", { "data-plate-pagination-static-stack": "" }, t1);
		$[5] = t1;
		$[6] = t2;
	} else t2 = $[6];
	return t2;
};
const TryPlateStatic = (t0) => {
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
var PlateStaticBoundary = class extends React.Component {
	constructor(props) {
		super(props);
		this.state = { error: null };
	}
	static getDerivedStateFromError(error) {
		return { error };
	}
	componentDidCatch(error) {
		console.warn("[plate-pagination] PlateStatic crashed; falling back to plain text", error.message);
	}
	render() {
		if (this.state.error !== null) return this.props.children;
		try {
			return /* @__PURE__ */ React.createElement(TryPlateStatic, {
				plugins: this.props.plugins,
				value: this.props.value
			});
		} catch {
			return this.props.children;
		}
	}
};
const FallbackPageText = (t0) => {
	const $ = c(5);
	const { value } = t0;
	let t1;
	if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
		t1 = {
			fontSize: 14,
			lineHeight: 1.5,
			whiteSpace: "pre-wrap"
		};
		$[0] = t1;
	} else t1 = $[0];
	let t2;
	if ($[1] !== value) {
		t2 = value.map(_temp$1);
		$[1] = value;
		$[2] = t2;
	} else t2 = $[2];
	let t3;
	if ($[3] !== t2) {
		t3 = /* @__PURE__ */ React.createElement("div", {
			"data-plate-pagination-fallback": "",
			style: t1
		}, t2);
		$[3] = t2;
		$[4] = t3;
	} else t3 = $[4];
	return t3;
};
const collectPlainText$1 = (node) => {
	let out = "";
	const walk = (n) => {
		if (typeof n.text === "string") {
			out += n.text;
			return;
		}
		if (!Array.isArray(n.children)) return;
		for (const child of n.children) walk(child);
	};
	walk(node);
	return out;
};
/**
* Static-safe subset of the live editor's plugins.
*
* Keeps plugins that have `node.type` (element / leaf renderers) AND a
* `node.component` (the renderer itself). Skips:
* - the pagination plugin (would recurse — see comment in `PageFrame`)
* - any plugin marked `editOnly` (won't run in static mode anyway)
* - chrome-only plugins (no `node.type`) which tend to depend on live
*   editor state and crash PlateStatic
*
* All render slots (`afterEditable`, `beforeEditable`, etc.) are wiped so
* PlateStatic does not re-fire pagination's `afterEditable` from inside a
* page (which would mount another PageOverlay → infinite recursion).
*/
const getElementOnlyStaticPlugins = (editor) => {
	const out = [];
	for (const plugin of editor.meta.pluginList) {
		if (plugin.key === PAGINATION_KEY) continue;
		if (plugin.editOnly) continue;
		if (!plugin.node?.type) continue;
		if (!plugin.node.component) continue;
		out.push({
			...plugin,
			__extensions: [],
			inject: plugin.inject?.nodeProps?.transformProps ? {
				...plugin.inject,
				nodeProps: {
					...plugin.inject.nodeProps,
					transformProps: void 0
				}
			} : plugin.inject,
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
		});
	}
	return out;
};
function _temp$1(node, i) {
	return /* @__PURE__ */ React.createElement("p", {
		key: `pt-${i}`,
		style: { margin: "0 0 0.6em 0" }
	}, collectPlainText$1(node));
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
	try {
		if (hasMixedMarks(node)) {
			const stats = measureRichInlineStats(prepareRichInline(collectLeaves(node).map((leaf) => ({
				font: applyLeafMarks(metrics.font, leaf.marks),
				text: leaf.text
			}))), width);
			return Math.max(1, stats.lineCount) * metrics.lineHeightPx;
		}
		return layout(prepare(text, metrics.font), width, metrics.lineHeightPx).height;
	} catch {
		return metrics.lineHeightPx;
	}
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
const MAX_PAGES_RENDERED = 12;
/**
* Paged view (variant A — additive, NOT a takeover).
*
* - `mode === 'standard'`: renders nothing besides the {@link FootnotePortal}
*   (which only acts when footnote sub-plugins are wired). The editor stays
*   in continuous-flow mode with no chrome.
* - `mode === 'paged'`: renders a paginated stack of {@link PageFrame}
*   instances BELOW the live `<Editable />`. Each frame uses `PlateStatic`
*   to render that page's slice of the document. The live editor is NOT
*   hidden — hiding it via `display:none` causes Plate plugins (cursor,
*   AI, comments, suggestions) to fire layout-zero callbacks in a tight
*   loop, which crashes the renderer. Keeping the editor mounted and
*   visible above the paged stack is the only stable option for variant A
*   without first re-architecting every consumer's chrome layout.
*
* Wrapped in an error boundary so a runaway PlateStatic subtree on one page
* cannot take the entire app down. Pages past MAX_PAGES_RENDERED are
* elided with a "+N more" badge — the paginator may produce arbitrary
* counts but rendering hundreds of static editors is not viable in browser.
*/
const PageOverlay = () => {
	const [mounted, setMounted] = React.useState(false);
	React.useEffect(() => {
		setMounted(true);
	}, []);
	const editor = useEditorRef();
	const mode = usePluginOption(BasePaginationPlugin, "mode");
	const firstPageDifferent = usePluginOption(BasePaginationPlugin, "firstPageDifferent");
	if (typeof window !== "undefined") {
		const w = window;
		w.__plateOverlayRenders = (w.__plateOverlayRenders ?? 0) + 1;
		w.__plateOverlayLastMode = mode;
	}
	const pageSize = usePluginOption(BasePaginationPlugin, "pageSize");
	const pageBorder = usePluginOption(BasePaginationPlugin, "pageBorder");
	const pageNumber = usePluginOption(BasePaginationPlugin, "pageNumber");
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
		firstPageDifferent,
		footerHeight,
		footnotePlacement,
		footnoteWell,
		headerHeight,
		includeFootnoteSubPlugins,
		margins,
		mode,
		pageBorder,
		pageNumber,
		pageSize,
		previewVisible,
		previewWidth
	}), [
		firstPageDifferent,
		footerHeight,
		footnotePlacement,
		footnoteWell,
		headerHeight,
		includeFootnoteSubPlugins,
		margins,
		mode,
		pageBorder,
		pageNumber,
		pageSize,
		previewVisible,
		previewWidth
	]);
	const pages = usePageLayout(editor, value, safeOptions);
	if (typeof window !== "undefined") {
		const w_0 = window;
		w_0.__plateOverlayPages = pages.length;
	}
	const isPaged = mode === "paged";
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
	const firstPageHeaderType = editor.getType(FIRST_PAGE_HEADER_KEY);
	const firstPageFooterType = editor.getType(FIRST_PAGE_FOOTER_KEY);
	const documentHeader = value.find((n) => n.type === headerType);
	const documentFooter = value.find((n_0) => n_0.type === footerType);
	const firstPageHeader = safeOptions.firstPageDifferent ? value.find((n_1) => n_1.type === firstPageHeaderType) : void 0;
	const firstPageFooter = safeOptions.firstPageDifferent ? value.find((n_2) => n_2.type === firstPageFooterType) : void 0;
	const visiblePages = pages.slice(0, MAX_PAGES_RENDERED);
	const truncatedCount = Math.max(0, pages.length - visiblePages.length);
	let runningTop = 0;
	const pageRows = visiblePages.map((page) => {
		const top = runningTop;
		runningTop += page.rect.height + PAGE_GAP;
		return {
			page,
			top
		};
	});
	const stackHeight = Math.max(0, runningTop - PAGE_GAP);
	const pageWidth = visiblePages[0]?.rect.width ?? 0;
	return /* @__PURE__ */ React.createElement(PaginationErrorBoundary, { fallback: footnotePortal }, footnotePortal, /* @__PURE__ */ React.createElement("div", {
		"aria-label": "Paginated document view",
		"data-plate-pagination-paged-view": "",
		role: "region",
		style: {
			background: "rgba(248, 250, 252, 1)",
			marginTop: 24,
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
	}, pageRows.map(({ page: page_0, top: top_0 }) => {
		const useFirstPage = safeOptions.firstPageDifferent && page_0.pageIndex === 0;
		const headerForPage = useFirstPage && firstPageHeader ? firstPageHeader : documentHeader;
		const footerForPage = useFirstPage && firstPageFooter ? firstPageFooter : documentFooter;
		return /* @__PURE__ */ React.createElement(PageFrame, {
			key: `page-${page_0.pageIndex}`,
			chrome: {
				footerHeight: safeOptions.footerHeight,
				footnoteWell: safeOptions.footnoteWell,
				headerHeight: safeOptions.headerHeight,
				margins: safeOptions.margins,
				pageBorder: safeOptions.pageBorder,
				pageNumber: safeOptions.pageNumber
			},
			documentFooter: footerForPage,
			documentHeader: headerForPage,
			editor,
			footnotesInFooter,
			page: page_0,
			top: top_0,
			totalPages: pages.length
		});
	})), truncatedCount > 0 ? /* @__PURE__ */ React.createElement("div", {
		"data-plate-pagination-truncation": "",
		style: {
			color: "rgba(15,23,42,0.6)",
			fontSize: 12,
			padding: "12px 0",
			textAlign: "center"
		}
	}, `+${truncatedCount} more page${truncatedCount === 1 ? "" : "s"} not shown`) : null));
};
/**
* Catches render errors inside the paged stack so a single bad page does
* not take down the editor. Falls back to the same `footnotePortal` the
* happy path returns when there is nothing else to render.
*/
var PaginationErrorBoundary = class extends React.Component {
	constructor(props) {
		super(props);
		this.state = { error: null };
	}
	static getDerivedStateFromError(error) {
		return { error };
	}
	componentDidCatch(error, info) {
		console.error("[plate-pagination] paged-view crashed", error, info);
	}
	render() {
		if (this.state.error !== null) return this.props.fallback;
		return this.props.children;
	}
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
	render: { afterEditable: () => React.createElement(PageOverlay) }
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
export { ChromeShell, FirstPageFooterPlugin, FirstPageHeaderPlugin, FooterPlugin, FootnotePortal, HeaderPlugin, MarginsDialog, PageBreakPlugin, PageFrame, PageOverlay, PageSetupDialog, PaginationPlugin, PaginationToolbar, StandardFooterAndPanel, StandardHeaderRail, usePretextMeasurer };
//# sourceMappingURL=index.js.map