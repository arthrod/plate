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
	const target = editor;
	if (Object.getOwnPropertyDescriptor(target, SLOT)?.writable) {
		target[SLOT] = pages;
		return;
	}
	Object.defineProperty(target, SLOT, {
		configurable: true,
		enumerable: false,
		value: pages,
		writable: true
	});
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
	const headerType = editor.getType(HEADER_KEY);
	return editor.children.some((n) => n.type === headerType);
};
/** Whether a top-level `footer` block currently exists in the doc. */
const hasFooterBlock = (editor) => {
	const footerType = editor.getType(FOOTER_KEY);
	return editor.children.some((n) => n.type === footerType);
};

//#endregion
//#region src/lib/resolve-options.ts
/**
* Defaults for pagination options. Single source of truth for the option
* shape consumed by `paginate()`, `resolvePageRect()`, and the React
* overlay. The base plugin spreads these into its `options` block; the
* React wrapper consumes them via {@link resolvePaginationOptions}
* instead of re-defining defaults inside a hook.
*/
const PAGINATION_OPTION_DEFAULTS = {
	footerHeight: 48,
	footnotePlacement: "footer",
	footnoteWell: 0,
	headerHeight: 48,
	includeFootnoteSubPlugins: true,
	margins: {
		bottom: 72,
		left: 72,
		right: 72,
		top: 72
	},
	mode: "standard",
	pageSize: "A4",
	pageBorder: {
		color: "rgba(15,23,42,0.15)",
		radius: 2,
		shadow: "0 1px 2px rgba(15,23,42,0.08)",
		style: "solid",
		width: 1
	},
	previewWidth: 220,
	previewVisible: true
};
/**
* Resolve a partial options bag against {@link PAGINATION_OPTION_DEFAULTS}.
* Used by the React overlay/layout hook so defaults live in `src/lib`
* rather than being redefined inside a React wrapper.
*/
const resolvePaginationOptions = (partial) => {
	const p = partial ?? {};
	return {
		footerHeight: p.footerHeight ?? PAGINATION_OPTION_DEFAULTS.footerHeight,
		footnotePlacement: p.footnotePlacement ?? PAGINATION_OPTION_DEFAULTS.footnotePlacement,
		footnoteWell: p.footnoteWell ?? PAGINATION_OPTION_DEFAULTS.footnoteWell,
		headerHeight: p.headerHeight ?? PAGINATION_OPTION_DEFAULTS.headerHeight,
		includeFootnoteSubPlugins: p.includeFootnoteSubPlugins ?? PAGINATION_OPTION_DEFAULTS.includeFootnoteSubPlugins,
		margins: p.margins ?? PAGINATION_OPTION_DEFAULTS.margins,
		mode: p.mode ?? PAGINATION_OPTION_DEFAULTS.mode,
		pageBorder: p.pageBorder ?? PAGINATION_OPTION_DEFAULTS.pageBorder,
		pageSize: p.pageSize ?? PAGINATION_OPTION_DEFAULTS.pageSize,
		previewWidth: p.previewWidth ?? PAGINATION_OPTION_DEFAULTS.previewWidth,
		previewVisible: p.previewVisible ?? PAGINATION_OPTION_DEFAULTS.previewVisible
	};
};

//#endregion
//#region src/lib/transforms/enforceHeaderFooterInvariants.ts
/**
* Single header at index 0; single footer somewhere in the doc. Dedupes
* stray copies and pulls a misplaced header to the top — keeps paste/undo
* from producing duplicates without fighting other plugins (notably any
* trailing-block plugin that requires the last child to be a paragraph).
*
* Performs at most one mutation per call and returns `true` when something
* was changed. The caller (`normalizeNode` override) re-queues by short-
* circuiting so Slate triggers the next iteration with fresh indices —
* this prevents stale-index loops and infinite normalization passes.
*
* Footer position is intentionally unconstrained: pagination's `paginate()`
* locates the footer by type, not by tree index, so a trailing paragraph
* after the footer does not break correctness — and trying to keep the
* footer "last" would loop with plugins that always append a trailing block.
*/
const enforceHeaderFooterInvariants = (editor) => {
	const headerType = editor.getType(HEADER_KEY);
	const footerType = editor.getType(FOOTER_KEY);
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
	return false;
};

//#endregion
//#region src/lib/transforms/ensureFooter.ts
/** Insert a default footer at the last index when none exists. */
const ensureFooter = (editor) => {
	const footerType = editor.getType(FOOTER_KEY);
	if (editor.children.some((n) => n.type === footerType)) return;
	editor.tf.insertNodes({
		children: [{ text: "Footer" }],
		type: footerType
	}, { at: [editor.children.length] });
};

//#endregion
//#region src/lib/transforms/ensureHeader.ts
/**
* Insert a default header at index 0 when none exists.
*
* Uses the package-local `HEADER_KEY` constant rather than `KEYS.header`
* from `platejs` — older published versions of `platejs` are missing the
* pagination keys in their `KEYS` export, which would silently produce
* `editor.getType(undefined) === ''` and insert nodes with an empty type.
*/
const ensureHeader = (editor) => {
	const headerType = editor.getType(HEADER_KEY);
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
		type: editor.getType(PAGE_BREAK_KEY)
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
* footer(s) first and reinserting at the end of the doc.
*
* Wrapped in `withoutNormalizing` so the remove + insert lands as one atomic
* step — otherwise the intermediate "no footer" state can fight with the
* `enforceHeaderFooterInvariants` normalizer and stall.
*/
const replaceFooter = (editor, content) => {
	editor.tf.withoutNormalizing(() => {
		const footerType = editor.getType(FOOTER_KEY);
		removeNodesByType(editor, footerType);
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
* header(s) first and reinserting at index 0.
*
* Wrapped in `withoutNormalizing` so the remove + insert lands as one atomic
* step — otherwise the intermediate "no header" state can fight with the
* `enforceHeaderFooterInvariants` normalizer and stall.
*/
const replaceHeader = (editor, content) => {
	editor.tf.withoutNormalizing(() => {
		const headerType = editor.getType(HEADER_KEY);
		removeNodesByType(editor, headerType);
		editor.tf.insertNodes({
			children: content,
			type: headerType
		}, { at: [0] });
	});
};

//#endregion
//#region src/lib/transforms/toggleFooter.ts
/**
* Toggle the document-level footer block; returns new presence.
*
* Runs the insert/remove inside `withoutNormalizing` so the final tree shape
* is committed in one pass — that gives the `enforceHeaderFooterInvariants`
* normalizer a stable input to evaluate, instead of a half-applied state.
*/
const toggleFooter = (editor) => {
	const footerType = editor.getType(FOOTER_KEY);
	const present = editor.children.some((n) => n.type === footerType);
	editor.tf.withoutNormalizing(() => {
		if (present) removeNodesByType(editor, footerType);
		else ensureFooter(editor);
	});
	return !present;
};

//#endregion
//#region src/lib/transforms/toggleHeader.ts
/**
* Toggle the document-level header block; returns new presence.
*
* Runs the insert/remove inside `withoutNormalizing` so the final tree shape
* is committed in one pass — that gives the `enforceHeaderFooterInvariants`
* normalizer a stable input to evaluate, instead of a half-applied state.
*/
const toggleHeader = (editor) => {
	const headerType = editor.getType(HEADER_KEY);
	const present = editor.children.some((n) => n.type === headerType);
	editor.tf.withoutNormalizing(() => {
		if (present) removeNodesByType(editor, headerType);
		else ensureHeader(editor);
	});
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
	options: PAGINATION_OPTION_DEFAULTS,
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
	setFootnotePlacement: (placement) => {
		setOption("footnotePlacement", placement);
		setOption("footnoteWell", placement === "footer" ? getOptions().footnoteWell || 96 : 0);
	},
	setFooter: (content) => replaceFooter(editor, content),
	setHeader: (content) => replaceHeader(editor, content),
	setMargins: (patch) => {
		setOption("margins", {
			...getOptions().margins,
			...patch
		});
	},
	setMode: (mode) => {
		setOption("mode", mode);
	},
	setPageBorder: (patch) => {
		setOption("pageBorder", {
			...getOptions().pageBorder,
			...patch
		});
	},
	setPageSize: (size) => {
		setOption("pageSize", size);
	},
	setPreviewWidth: (width) => {
		setOption("previewWidth", width);
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
* Top-level `header` and `footer` blocks are skipped because they render via
* the page chrome. `footnoteDefinition` blocks are skipped only when
* footnotes render in page footer wells.
*
* @param doc Top-level Slate blocks (`editor.children`).
* @param rect Resolved page geometry (see `resolvePageRect`).
* @param ctx Per-document measurement context. `ctx.marksFingerprint` is
*   the doc-level fallback when a block has no own marks.
* @param measurer Pluggable height oracle. Inject a fake monospace one
*   in tests; the React layer wires the DOM-backed measurer.
*/
const paginate = ({ ctx, doc, footnotePlacement = "footer", measurer, rect }) => {
	const pages = [];
	let current = [];
	let used = 0;
	let pageIndex = 0;
	const flush = (forceBlankPage = false) => {
		if (current.length === 0 && pages.length > 0 && !forceBlankPage) return;
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
			flush(true);
			continue;
		}
		if (node.type === HEADER_KEY || node.type === FOOTER_KEY || footnotePlacement === "footer" && node.type === FOOTNOTE_DEFINITION_KEY) continue;
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
export { allocateFootnotes as C, PAGINATION_KEY as D, HEADER_KEY as E, BaseFooterPlugin as S, FOOTNOTE_DEFINITION_KEY as T, getPaginationPages as _, replaceHeader as a, BasePageBreakPlugin as b, insertPageBreak as c, enforceHeaderFooterInvariants as d, PAGINATION_OPTION_DEFAULTS as f, getPaginationFootnotes as g, hasHeaderBlock as h, toggleFooter as i, ensureHeader as l, hasFooterBlock as m, BasePaginationPlugin as n, replaceFooter as o, resolvePaginationOptions as p, toggleHeader as r, removeNodesByType as s, paginate as t, ensureFooter as u, getPageOfPath as v, FOOTER_KEY as w, BaseHeaderPlugin as x, setEditorPages as y };
//# sourceMappingURL=paginate-Cla4sKzV.js.map