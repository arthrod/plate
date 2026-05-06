import { KEYS, createSlatePlugin, createTSlatePlugin } from "platejs";

//#region src/lib/allocate-footnotes.ts
/**
* Greedy assignment of footnote definitions to per-page footer wells.
*
* Walks each page's blocks, collects every inline `footnoteReference` by its
* `identifier` field, then attaches the matching definition (looked up in
* the document-level definition list) to that page. Definitions referenced
* on multiple pages attach to the first page that references them.
*
* Returns a new array of {@link Page} objects with `footnotes` populated.
* The original `pages` argument is not mutated.
*/
const allocateFootnotes = (pages, footnotes) => {
	if (footnotes.length === 0) return pages;
	const byId = /* @__PURE__ */ new Map();
	for (const def of footnotes) {
		const id = def.identifier;
		if (typeof id === "string") byId.set(id, def);
	}
	if (byId.size === 0) return pages;
	const claimed = /* @__PURE__ */ new Set();
	return pages.map((page) => {
		const allocated = [];
		for (const node of page.nodes) collectReferenceIds(node, (id) => {
			if (claimed.has(id)) return;
			const def = byId.get(id);
			if (!def) return;
			claimed.add(id);
			allocated.push(def);
		});
		return allocated.length > 0 ? {
			...page,
			footnotes: allocated
		} : page;
	});
};
const collectReferenceIds = (node, visit) => {
	if (node.type === KEYS.footnoteReference && typeof node.identifier === "string") {
		visit(node.identifier);
		return;
	}
	if (!Array.isArray(node.children)) return;
	for (const child of node.children) if (typeof child === "object" && child !== null) collectReferenceIds(child, visit);
};

//#endregion
//#region src/lib/base-footer-plugin.ts
/**
* Block-level page-footer element.
*
* Authored once per document; the render-overlay clones it onto every page
* and runs the footnote-well allocator above it.
*/
const BaseFooterPlugin = createSlatePlugin({
	key: KEYS.footer,
	node: { isElement: true }
});

//#endregion
//#region src/lib/base-header-plugin.ts
/**
* Block-level page-header element.
*
* Authored once per document; the render-overlay clones it onto every page.
*/
const BaseHeaderPlugin = createSlatePlugin({
	key: KEYS.header,
	node: { isElement: true }
});

//#endregion
//#region src/lib/base-page-break-plugin.ts
/**
* Hard page-break element.
*
* The render-overlay paginator splits a page boundary at every break node.
*/
const BasePageBreakPlugin = createSlatePlugin({
	key: KEYS.pageBreak,
	node: {
		isElement: true,
		isVoid: true
	}
});

//#endregion
//#region src/lib/base-pagination-plugin.ts
/**
* Base orchestrator plugin for paginated layout.
*
* Variant A — render-time overlay; pages derived; pretext as height oracle.
* The Slate document is unchanged; pagination is a render-only projection
* layered onto the live editor via the Plate `render.afterEditable` slot.
*
* The page-chrome element family (header, footer, page break) is composed
* here on the Slate base so a Slate-only consumer registering
* `BasePaginationPlugin` already gets the element schema. React-only deltas
* (footnote sub-plugins, overlay rendering) live in `src/react`.
*
* The API/transforms surface bridges to the per-editor `WeakMap` populated
* by `usePageLayout` on the React side; in a pure-Slate environment the API
* resolves to `[]`/`-1` until a measurer-equipped consumer wires pages in.
*/
const BasePaginationPlugin = createTSlatePlugin({
	key: KEYS.pagination,
	options: {
		footerHeight: 48,
		footnoteWell: 0,
		headerHeight: 48,
		includeFootnoteSubPlugins: true,
		margins: {
			bottom: 72,
			left: 72,
			right: 72,
			top: 72
		},
		pageSize: "A4"
	},
	plugins: [
		BaseHeaderPlugin,
		BaseFooterPlugin,
		BasePageBreakPlugin
	]
}).extendEditorApi(({ editor }) => ({ pagination: {
	getFootnotes: (pageIndex) => {
		return readPages(editor)[pageIndex]?.footnotes ?? [];
	},
	getPageOf: (path) => {
		if (path.length === 0) return -1;
		const top = editor.children[path[0]];
		if (!top) return -1;
		const pages = readPages(editor);
		for (let i = 0; i < pages.length; i++) if (pages[i].nodes.includes(top)) return i;
		return -1;
	},
	getPages: () => readPages(editor)
} })).extendEditorTransforms(({ editor }) => ({ pagination: {
	insertPageBreak: () => {
		editor.tf.insertNodes({
			children: [{ text: "" }],
			type: KEYS.pageBreak
		});
	},
	setFooter: (content) => {
		replaceTopLevelByType(editor, KEYS.footer, content);
	},
	setHeader: (content) => {
		replaceTopLevelByType(editor, KEYS.header, content);
	}
} }));
const readPages = (editor) => {
	const slot = editor.__pagination_pages__;
	return Array.isArray(slot) ? slot : [];
};
const replaceTopLevelByType = (editor, type, content) => {
	const idx = editor.children.findIndex((n) => n.type === type);
	if (idx >= 0) editor.tf.removeNodes({ at: [idx] });
	editor.tf.insertNodes({
		children: content,
		type
	}, { at: [idx >= 0 ? idx : 0] });
};

//#endregion
//#region src/lib/internal/marks-fingerprint.ts
/**
* Stable, JSON-shape-independent fingerprint of the marks/styles attached to a
* block's leaves. Used as part of the measure-cache key so a node with the
* same text but different bold/italic runs gets remeasured.
*/
const marksFingerprint = (node) => {
	const sorted = [];
	walkLeaves(node, (leaf) => {
		const keys = Object.keys(leaf).filter((k) => k !== "text").sort();
		if (keys.length === 0) return;
		const segment = keys.map((k) => `${k}=${formatMark(leaf[k])}`).join(",");
		sorted.push(segment);
	});
	return sorted.join("|");
};
const formatMark = (value) => {
	if (value === true) return "1";
	if (value === false) return "0";
	if (value == null) return "";
	if (typeof value === "object") return JSON.stringify(value);
	return String(value);
};
const walkLeaves = (node, visit) => {
	if (typeof node.text === "string") {
		visit(node);
		return;
	}
	if (!Array.isArray(node.children)) return;
	for (const child of node.children) walkLeaves(child, visit);
};

//#endregion
//#region src/lib/paginate.ts
/**
* Derive the page sequence from a flat list of top-level blocks.
*
* Variant A — render-overlay paginator. Walks the doc, calls
* `measurer.measure(node, ctx)` per block, and bin-packs into page rects
* honoring the `rect.contentHeight` budget. Page-break voids
* (`type === KEYS.pageBreak`) are hard splits. Pages are derived; this
* never mutates Slate state.
*
* Top-level `header`, `footer`, and `footnoteDefinition` blocks are
* skipped — they render via the page chrome / footer well, not the body.
*
* @param doc Top-level Slate blocks (`editor.children`).
* @param rect Resolved page geometry (see `resolvePageRect`).
* @param ctx Per-document measurement context. `ctx.marksFingerprint` is
*   the doc-level fallback when a block has no own marks.
* @param measurer Pluggable height oracle. Inject a fake monospace one
*   in tests; the React layer wires the DOM-backed measurer.
*/
const paginate = (doc, rect, ctx, measurer) => {
	const pages = [];
	let current = [];
	let used = 0;
	let pageIndex = 0;
	const flush = () => {
		if (current.length === 0 && pages.length > 0) return;
		pages.push({
			footnotes: [],
			nodes: current,
			pageIndex,
			rect
		});
		current = [];
		used = 0;
		pageIndex += 1;
	};
	for (const node of doc) {
		if (node.type === KEYS.pageBreak) {
			flush();
			continue;
		}
		if (node.type === KEYS.header || node.type === KEYS.footer || node.type === KEYS.footnoteDefinition) continue;
		const nodeFingerprint = marksFingerprint(node) || ctx.marksFingerprint;
		const height = measurer.measure(node, {
			font: ctx.font,
			marksFingerprint: nodeFingerprint,
			width: rect.contentWidth
		});
		if (height > rect.contentHeight && current.length === 0) {
			current.push(node);
			flush();
			continue;
		}
		if (used + height > rect.contentHeight && current.length > 0) flush();
		current.push(node);
		used += height;
	}
	flush();
	if (pages.length === 0) pages.push({
		footnotes: [],
		nodes: [],
		pageIndex: 0,
		rect
	});
	return pages;
};

//#endregion
export { BaseFooterPlugin as a, BaseHeaderPlugin as i, BasePaginationPlugin as n, allocateFootnotes as o, BasePageBreakPlugin as r, paginate as t };
//# sourceMappingURL=paginate-BwWv3TAR.js.map