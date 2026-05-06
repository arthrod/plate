import { KEYS, createSlatePlugin, createTSlatePlugin } from "platejs";

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
//#region src/lib/queries/getPageOfPath.ts
/**
* Map a top-level Slate path to its derived page index. Returns `-1` when
* the path is empty or the top block is not present in the page snapshot.
*/
const getPageOfPath = (editor, path) => {
	if (path.length === 0) return -1;
	const top = editor.children[path[0]];
	if (!top) return -1;
	const pages = getEditorPages(editor);
	for (let i = 0; i < pages.length; i++) if (pages[i].nodes.includes(top)) return i;
	return -1;
};

//#endregion
//#region src/lib/queries/getPaginationPages.ts
/**
* Read the latest derived page sequence stored on the editor by the React
* pagination overlay. Returns an empty array when no pagination cycle has
* run yet.
*/
const getPaginationPages = (editor) => getEditorPages(editor);
/** Return the footnotes allocated to a given page index. */
const getPaginationFootnotes = (editor, pageIndex) => getEditorPages(editor)[pageIndex]?.footnotes ?? [];

//#endregion
//#region src/lib/queries/hasChromeBlock.ts
/** Whether a top-level `header` block currently exists in the doc. */
const hasHeaderBlock = (editor) => {
	const headerType = editor.getType(KEYS.header);
	return editor.children.some((n) => n.type === headerType);
};
/** Whether a top-level `footer` block currently exists in the doc. */
const hasFooterBlock = (editor) => {
	const footerType = editor.getType(KEYS.footer);
	return editor.children.some((n) => n.type === footerType);
};

//#endregion
//#region src/lib/transforms/enforceHeaderFooterInvariants.ts
/**
* Single header at index 0; single footer at the last index. Anything else
* is normalized away — keeps paste/undo from producing duplicates.
*
* Performs at most one mutation per call and returns `true` when something
* was changed. The caller (`normalizeNode` override) re-queues by short-
* circuiting so Slate triggers the next iteration with fresh indices —
* this prevents stale-index loops and infinite normalization passes.
*/
const enforceHeaderFooterInvariants = (editor) => {
	const headerType = editor.getType(KEYS.header);
	const footerType = editor.getType(KEYS.footer);
	const headerIdxs = [];
	const footerIdxs = [];
	editor.children.forEach((n, i) => {
		if (n.type === headerType) headerIdxs.push(i);
		else if (n.type === footerType) footerIdxs.push(i);
	});
	if (headerIdxs.length > 1) {
		editor.tf.removeNodes({ at: [headerIdxs.at(-1)] });
		return true;
	}
	if (headerIdxs[0] !== void 0 && headerIdxs[0] !== 0) {
		editor.tf.moveNodes({
			at: [headerIdxs[0]],
			to: [0]
		});
		return true;
	}
	if (footerIdxs.length > 1) {
		editor.tf.removeNodes({ at: [footerIdxs[0]] });
		return true;
	}
	const target = editor.children.length - 1;
	const lastFooter = footerIdxs.at(-1);
	if (lastFooter !== void 0 && lastFooter !== target) {
		editor.tf.moveNodes({
			at: [lastFooter],
			to: [target]
		});
		return true;
	}
	return false;
};

//#endregion
//#region src/lib/transforms/ensureFooter.ts
/** Insert a default footer at the last index when none exists. */
const ensureFooter = (editor) => {
	const footerType = editor.getType(KEYS.footer);
	if (editor.children.some((n) => n.type === footerType)) return;
	editor.tf.insertNodes({
		children: [{ text: "Footer" }],
		type: footerType
	}, { at: [editor.children.length] });
};

//#endregion
//#region src/lib/transforms/ensureHeader.ts
/** Insert a default header at index 0 when none exists. */
const ensureHeader = (editor) => {
	const headerType = editor.getType(KEYS.header);
	if (editor.children.some((n) => n.type === headerType)) return;
	editor.tf.insertNodes({
		children: [{ text: "Header" }],
		type: headerType
	}, { at: [0] });
};

//#endregion
//#region src/lib/transforms/insertPageBreak.ts
/** Insert a hard page-break void at the current selection. */
const insertPageBreak = (editor) => {
	editor.tf.insertNodes({
		children: [{ text: "" }],
		type: editor.getType(KEYS.pageBreak)
	});
};

//#endregion
//#region src/lib/transforms/removeNodesByType.ts
/**
* Remove every top-level child whose `type` matches `type`. Iterates from the
* end so removed indices don't invalidate the loop.
*/
const removeNodesByType = (editor, type) => {
	const children = editor.children;
	for (let i = children.length - 1; i >= 0; i--) if (children[i].type === type) editor.tf.removeNodes({ at: [i] });
};

//#endregion
//#region src/lib/transforms/replaceFooter.ts
/**
* Replace the top-level footer block with `content`, removing any existing
* footer first and reinserting at the end of the doc.
*
* Wrapped in `withoutNormalizing` so the remove + insert lands as one atomic
* step — otherwise the intermediate "no footer" state can fight with the
* `enforceHeaderFooterInvariants` normalizer and stall.
*/
const replaceFooter = (editor, content) => {
	editor.tf.withoutNormalizing(() => {
		const footerType = editor.getType(KEYS.footer);
		const idx = editor.children.findIndex((n) => n.type === footerType);
		if (idx >= 0) editor.tf.removeNodes({ at: [idx] });
		editor.tf.insertNodes({
			children: content,
			type: footerType
		}, { at: [editor.children.length] });
	});
};

//#endregion
//#region src/lib/transforms/replaceHeader.ts
/**
* Replace the top-level header block with `content`, removing any existing
* header first and reinserting at index 0.
*
* Wrapped in `withoutNormalizing` so the remove + insert lands as one atomic
* step — otherwise the intermediate "no header" state can fight with the
* `enforceHeaderFooterInvariants` normalizer and stall.
*/
const replaceHeader = (editor, content) => {
	editor.tf.withoutNormalizing(() => {
		const headerType = editor.getType(KEYS.header);
		const idx = editor.children.findIndex((n) => n.type === headerType);
		if (idx >= 0) editor.tf.removeNodes({ at: [idx] });
		editor.tf.insertNodes({
			children: content,
			type: headerType
		}, { at: [0] });
	});
};

//#endregion
//#region src/lib/transforms/toggleFooter.ts
/** Toggle the document-level footer block; returns new presence. */
const toggleFooter = (editor) => {
	const footerType = editor.getType(KEYS.footer);
	const present = editor.children.some((n) => n.type === footerType);
	if (present) removeNodesByType(editor, footerType);
	else ensureFooter(editor);
	return !present;
};

//#endregion
//#region src/lib/transforms/toggleHeader.ts
/** Toggle the document-level header block; returns new presence. */
const toggleHeader = (editor) => {
	const headerType = editor.getType(KEYS.header);
	const present = editor.children.some((n) => n.type === headerType);
	if (present) removeNodesByType(editor, headerType);
	else ensureHeader(editor);
	return !present;
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
	if (path.length === 0 && enforceHeaderFooterInvariants(editor)) return;
	normalizeNode(entry);
} } })).extendEditorApi(({ editor }) => ({ pagination: {
	getFootnotes: (pageIndex) => getPaginationFootnotes(editor, pageIndex),
	getPageOf: (path) => getPageOfPath(editor, path),
	getPages: () => getPaginationPages(editor),
	hasFooter: () => hasFooterBlock(editor),
	hasHeader: () => hasHeaderBlock(editor)
} })).extendEditorTransforms(({ editor, getOptions, setOption }) => ({ pagination: {
	insertPageBreak: () => insertPageBreak(editor),
	setFooter: (content) => replaceFooter(editor, content),
	setHeader: (content) => replaceHeader(editor, content),
	setMargins: (patch) => {
		setOption("margins", {
			...getOptions().margins,
			...patch
		});
	},
	setPageSize: (size) => {
		setOption("pageSize", size);
	},
	toggleFooter: () => toggleFooter(editor),
	toggleHeader: () => toggleHeader(editor),
	togglePreview: () => {
		const next = !(getOptions().previewVisible ?? true);
		setOption("previewVisible", next);
		return next;
	}
} }));

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
export { FOOTNOTE_DEFINITION_KEY as C, FOOTER_KEY as S, setEditorPages as _, replaceHeader as a, BaseFooterPlugin as b, insertPageBreak as c, enforceHeaderFooterInvariants as d, hasFooterBlock as f, getPageOfPath as g, getPaginationPages as h, toggleFooter as i, ensureHeader as l, getPaginationFootnotes as m, BasePaginationPlugin as n, replaceFooter as o, hasHeaderBlock as p, toggleHeader as r, removeNodesByType as s, paginate as t, ensureFooter as u, BasePageBreakPlugin as v, HEADER_KEY as w, allocateFootnotes as x, BaseHeaderPlugin as y };
//# sourceMappingURL=paginate-1hlE8RNf.js.map