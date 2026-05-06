import { createSlatePlugin, createTSlatePlugin } from "platejs";

//#region src/lib/internal/keys.ts
/**
* Plugin keys hard-coded inside the package so the published `platejs`
* `KEYS` object isn't required to know about them. The workspace `KEYS`
* also exposes these (`KEYS.pagination`, `KEYS.pageBreak`) for downstream
* consumers that prefer the central registry — keep these strings in sync.
*/
const PAGINATION_KEY = "pagination";
const PAGE_BREAK_KEY = "pageBreak";
const HEADER_KEY = "header";
const FOOTER_KEY = "footer";
const FOOTNOTE_REFERENCE_KEY = "footnoteReference";
const FOOTNOTE_DEFINITION_KEY = "footnoteDefinition";

//#endregion
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
	if (node.type === FOOTNOTE_REFERENCE_KEY && typeof node.identifier === "string") {
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
	key: FOOTER_KEY,
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
	key: HEADER_KEY,
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
	key: PAGE_BREAK_KEY,
	node: {
		isElement: true,
		isVoid: true
	}
});

//#endregion
//#region src/lib/internal/page-state.ts
/**
* The latest pagination snapshot is stored on the editor instance under a
* non-enumerable slot so `editor.api.pagination.*` queries can resolve
* without going through React. `usePageLayout` writes the slot after each
* pagination cycle; `BasePaginationPlugin.api.pagination.getPages` reads it.
*
* Writing onto the editor avoids a WeakMap allocation and keeps the read
* path zero-overhead — the API just dereferences a property.
*
* Lives under `lib/internal` so the base (Slate-only) plugin can import it
* without React depending on `lib`.
*/
const SLOT = "__pagination_pages__";
const setEditorPages = (editor, pages) => {
	editor[SLOT] = pages;
};
const getEditorPages = (editor) => {
	const slot = editor[SLOT];
	return Array.isArray(slot) ? slot : [];
};

//#endregion
//#region src/lib/base-pagination-plugin.ts
/**
* Base orchestrator plugin for paginated layout.
*
* Variant A — render-time overlay; pages derived; pretext as height oracle.
* The Slate document is unchanged; pagination is a render-only projection
* layered onto the live editor via the Plate `render.afterEditable` slot.
*
* Header/footer presence is derived from `editor.children` (single source of
* truth) — undo and paste survive correctly because we don't mirror the
* presence to a plugin option that lives outside Slate history.
*
* The page-chrome element family (header, footer, page break) is composed
* here on the Slate base so a Slate-only consumer registering
* `BasePaginationPlugin` already gets the element schema. React-only deltas
* (footnote sub-plugins, overlay rendering) live in `src/react`.
*/
const BasePaginationPlugin = createTSlatePlugin({
	key: PAGINATION_KEY,
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
		pageSize: "A4",
		previewVisible: true
	},
	plugins: [
		BaseHeaderPlugin,
		BaseFooterPlugin,
		BasePageBreakPlugin
	]
}).overrideEditor(({ editor, tf: { normalizeNode } }) => ({ transforms: { normalizeNode: (entry) => {
	const [, path] = entry;
	if (path.length === 0) enforceHeaderFooterInvariants(editor);
	return normalizeNode(entry);
} } })).extendEditorApi(({ editor }) => ({ pagination: {
	getFootnotes: (pageIndex) => {
		return getEditorPages(editor)[pageIndex]?.footnotes ?? [];
	},
	getPageOf: (path) => {
		if (path.length === 0) return -1;
		const top = editor.children[path[0]];
		if (!top) return -1;
		const pages = getEditorPages(editor);
		for (let i = 0; i < pages.length; i++) if (pages[i].nodes.includes(top)) return i;
		return -1;
	},
	getPages: () => getEditorPages(editor),
	hasFooter: () => editor.children.some((n) => n.type === FOOTER_KEY),
	hasHeader: () => editor.children.some((n) => n.type === HEADER_KEY)
} })).extendEditorTransforms(({ editor, getOptions, setOption }) => ({ pagination: {
	insertPageBreak: () => {
		editor.tf.insertNodes({
			children: [{ text: "" }],
			type: PAGE_BREAK_KEY
		});
	},
	setFooter: (content) => {
		replaceFooter(editor, content);
	},
	setHeader: (content) => {
		replaceHeader(editor, content);
	},
	setMargins: (margins) => {
		setOption("margins", margins);
	},
	setPageSize: (size) => {
		setOption("pageSize", size);
	},
	toggleFooter: () => {
		const ed = editor;
		const present = ed.children.some((n) => n.type === FOOTER_KEY);
		if (present) removeByType(ed, FOOTER_KEY);
		else ensureFooter(ed);
		return !present;
	},
	toggleHeader: () => {
		const ed = editor;
		const present = ed.children.some((n) => n.type === HEADER_KEY);
		if (present) removeByType(ed, HEADER_KEY);
		else ensureHeader(ed);
		return !present;
	},
	togglePreview: () => {
		const next = !(getOptions().previewVisible ?? true);
		setOption("previewVisible", next);
		return next;
	}
} }));
const replaceHeader = (editor, content) => {
	const idx = editor.children.findIndex((n) => n.type === HEADER_KEY);
	if (idx >= 0) editor.tf.removeNodes({ at: [idx] });
	editor.tf.insertNodes({
		children: content,
		type: HEADER_KEY
	}, { at: [0] });
};
const replaceFooter = (editor, content) => {
	const idx = editor.children.findIndex((n) => n.type === FOOTER_KEY);
	if (idx >= 0) editor.tf.removeNodes({ at: [idx] });
	editor.tf.insertNodes({
		children: content,
		type: FOOTER_KEY
	}, { at: [editor.children.length] });
};
const ensureHeader = (editor) => {
	if (editor.children.some((n) => n.type === HEADER_KEY)) return;
	editor.tf.insertNodes({
		children: [{ text: "Header" }],
		type: HEADER_KEY
	}, { at: [0] });
};
const ensureFooter = (editor) => {
	if (editor.children.some((n) => n.type === FOOTER_KEY)) return;
	editor.tf.insertNodes({
		children: [{ text: "Footer" }],
		type: FOOTER_KEY
	}, { at: [editor.children.length] });
};
const removeByType = (editor, type) => {
	for (let i = editor.children.length - 1; i >= 0; i--) if (editor.children[i].type === type) editor.tf.removeNodes({ at: [i] });
};
/**
* Single header at index 0; single footer at the last index. Anything else
* is normalized away — keeps paste/undo from producing duplicates.
*/
const enforceHeaderFooterInvariants = (editor) => {
	const headerIdxs = [];
	const footerIdxs = [];
	editor.children.forEach((n, i) => {
		if (n.type === HEADER_KEY) headerIdxs.push(i);
		else if (n.type === FOOTER_KEY) footerIdxs.push(i);
	});
	if (headerIdxs.length > 1) for (let i = headerIdxs.length - 1; i >= 1; i--) editor.tf.removeNodes({ at: [headerIdxs[i]] });
	if (headerIdxs[0] !== void 0 && headerIdxs[0] !== 0) editor.tf.moveNodes({
		at: [headerIdxs[0]],
		to: [0]
	});
	if (footerIdxs.length > 1) for (let i = footerIdxs.length - 2; i >= 0; i--) editor.tf.removeNodes({ at: [footerIdxs[i]] });
	const lastFooter = footerIdxs.at(-1);
	const target = editor.children.length - 1;
	if (lastFooter !== void 0 && lastFooter !== target) editor.tf.moveNodes({
		at: [lastFooter],
		to: [target]
	});
};

//#endregion
//#region src/lib/internal/marks-fingerprint.ts
/**
* Stable, JSON-shape-independent fingerprint of the marks/styles attached to a
* block's leaves. Used as part of the measure-cache key so a node with the
* same text but different bold/italic runs gets remeasured.
*/
const marksFingerprint = (node) => {
	const segments = [];
	walkLeaves(node, (leaf) => {
		const keys = Object.keys(leaf).filter((k) => k !== "text").sort();
		if (keys.length === 0) return;
		const segment = keys.map((k) => `${k}=${formatMark(leaf[k])}`).join(",");
		segments.push(segment);
	});
	return segments.join("|");
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
		if (node.type === PAGE_BREAK_KEY) {
			flush();
			continue;
		}
		if (node.type === HEADER_KEY || node.type === FOOTER_KEY || node.type === FOOTNOTE_DEFINITION_KEY) continue;
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
export { BaseHeaderPlugin as a, FOOTER_KEY as c, BasePageBreakPlugin as i, FOOTNOTE_DEFINITION_KEY as l, BasePaginationPlugin as n, BaseFooterPlugin as o, setEditorPages as r, allocateFootnotes as s, paginate as t, HEADER_KEY as u };
//# sourceMappingURL=paginate-c73WStbw.js.map