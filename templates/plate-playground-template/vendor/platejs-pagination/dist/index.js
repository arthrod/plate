import { toPlatePlugin, useComposedRef, useEditorRef, usePath, usePluginOption } from "platejs/react";
import { createTSlatePlugin } from "platejs";
import { c } from "react-compiler-runtime";
import React, { createContext, useCallback, useContext, useEffect, useRef } from "react";
import { Editor, Element, Node, Transforms } from "slate";
import { HistoryEditor } from "slate-history";
import { ReactEditor } from "slate-react";
import { YjsPlugin } from "@platejs/yjs/react";

//#region src/runtime.ts
function createPaginationRuntime() {
	const dirty = /* @__PURE__ */ new Set();
	const subscribers = /* @__PURE__ */ new Set();
	const notify = () => {
		subscribers.forEach((fn) => {
			fn();
		});
	};
	return {
		markDirty(pageIndex) {
			if (!Number.isFinite(pageIndex) || pageIndex < 0) return;
			dirty.add(pageIndex);
			notify();
		},
		consumeDirtyMin() {
			if (dirty.size === 0) return null;
			const min = Math.min(...dirty);
			dirty.clear();
			return min;
		},
		subscribe(fn) {
			subscribers.add(fn);
			return () => subscribers.delete(fn);
		}
	};
}
function getPageIndexFromOp(op) {
	const anyOp = op;
	const indices = [];
	if (Array.isArray(anyOp.path) && anyOp.path.length > 0) indices.push(anyOp.path[0]);
	if (Array.isArray(anyOp.newPath) && anyOp.newPath.length > 0) indices.push(anyOp.newPath[0]);
	if (indices.length === 0) return null;
	return Math.min(...indices);
}

//#endregion
//#region src/BasePaginationPlugin.ts
const PAGINATION_KEY = "pagination";
const DEFAULT_DOCUMENT_SETTINGS = {
	sizes: {
		width: 816,
		height: 1056
	},
	margins: {
		top: 96,
		right: 96,
		bottom: 96,
		left: 96
	}
};
const DEFAULT_REFLOW_OPTIONS = {
	enabled: true,
	debounceMs: 100,
	maxPagesPerIdle: 6,
	maxMovesPerPage: 50,
	underflow: true,
	allowTextSplit: true,
	overflowThresholdPx: 0,
	underflowThresholdPx: 80
};
const DEFAULT_COLLABORATION_OPTIONS = { mode: "all" };
const withPagination = ({ editor, type, tf: { apply, normalizeNode } }) => {
	const runtime = createPaginationRuntime();
	editor.__paginationRuntime = runtime;
	return { transforms: {
		apply(op) {
			apply(op);
			if (editor.__paginationMutating) return;
			const pageIndex = getPageIndexFromOp(op);
			if (pageIndex !== null && runtime) runtime.markDirty(pageIndex);
		},
		normalizeNode(entry) {
			const [node, path] = entry;
			if (node?.type === type && path.length !== 1) {
				editor.tf.unwrapNodes({ at: path });
				return;
			}
			if (path.length === 0) {
				if (normalizeRootChildren(editor, type)) return;
			}
			normalizeNode(entry);
		}
	} };
};
const BasePaginationPlugin = createTSlatePlugin({
	key: PAGINATION_KEY,
	node: {
		isElement: true,
		isContainer: true,
		type: "page"
	},
	handlers: { onNodeChange: ({ editor }) => {
		if (editor.__paginationMutating) return;
		if (editor.meta?.isNormalizing) return;
		const pageType = editor.getType?.(PAGINATION_KEY) ?? "page";
		const children = editor.children;
		if (!Array.isArray(children) || children.length === 0) return;
		if (!children.some((child) => child?.type !== pageType)) return;
		if (normalizeRootChildren(editor, pageType)) getPaginationRuntime(editor)?.markDirty(0);
	} },
	normalizeInitialValue: ({ editor, type }) => {
		normalizeRootChildren(editor, type);
	},
	options: {
		documentSettings: DEFAULT_DOCUMENT_SETTINGS,
		reflow: DEFAULT_REFLOW_OPTIONS,
		collaboration: DEFAULT_COLLABORATION_OPTIONS,
		defaultBlockType: "p",
		viewMode: "paginated"
	}
}).overrideEditor(withPagination);
function withPaginationMutations(editor, fn) {
	const prev = editor.__paginationMutating;
	editor.__paginationMutating = true;
	try {
		fn();
	} finally {
		editor.__paginationMutating = prev;
	}
}
function wrapRootRange(editor, type, start, end) {
	withPaginationMutations(editor, () => {
		editor.tf.withoutNormalizing(() => {
			const pagePath = [start];
			editor.tf.insertNodes({
				type,
				children: []
			}, { at: pagePath });
			const count = end - start + 1;
			for (let i = 0; i < count; i++) editor.tf.moveNodes({
				at: [start + 1],
				to: pagePath.concat([i])
			});
		});
	});
}
function normalizeRootChildren(editor, type) {
	const children = editor.children;
	if (!Array.isArray(children) || children.length === 0) return false;
	let segStart = null;
	for (let i = 0; i < children.length; i++) {
		const isPage = children[i]?.type === type;
		if (!isPage && segStart === null) segStart = i;
		if (isPage && segStart !== null) {
			wrapRootRange(editor, type, segStart, i - 1);
			return true;
		}
	}
	if (segStart !== null) {
		wrapRootRange(editor, type, segStart, children.length - 1);
		return true;
	}
	return false;
}
function getPaginationRuntime(editor) {
	return editor.__paginationRuntime;
}

//#endregion
//#region src/registry.tsx
const PaginationRegistryContext = createContext(null);
function PaginationRegistryProvider(t0) {
	const $ = c(4);
	const { children } = t0;
	let t1;
	if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
		t1 = /* @__PURE__ */ new Map();
		$[0] = t1;
	} else t1 = $[0];
	const pagesRef = useRef(t1);
	let t2;
	if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
		t2 = {
			registerPage(pageIndex, dom) {
				pagesRef.current.set(pageIndex, dom);
				return () => {
					if (pagesRef.current.get(pageIndex)?.outer === dom.outer) pagesRef.current.delete(pageIndex);
				};
			},
			getPageDom(pageIndex_0) {
				return pagesRef.current.get(pageIndex_0);
			},
			getKnownPages() {
				return Array.from(pagesRef.current.keys()).sort(_temp);
			}
		};
		$[1] = t2;
	} else t2 = $[1];
	const value = t2;
	let t3;
	if ($[2] !== children) {
		t3 = /* @__PURE__ */ React.createElement(PaginationRegistryContext.Provider, { value }, children);
		$[2] = children;
		$[3] = t3;
	} else t3 = $[3];
	return t3;
}
function _temp(a, b) {
	return a - b;
}
function usePaginationRegistry() {
	return useContext(PaginationRegistryContext);
}

//#endregion
//#region src/PageElement.tsx
function PageElement(t0) {
	const $ = c(23);
	const { children, attributes } = t0;
	const registry = usePaginationRegistry();
	const outerRef = useRef(null);
	const contentRef = useRef(null);
	const composedRef = useComposedRef(attributes.ref, outerRef);
	const settings = usePluginOption(BasePaginationPlugin, "documentSettings");
	const viewMode = usePluginOption(BasePaginationPlugin, "viewMode");
	const { sizes, margins } = settings;
	const path = usePath(BasePaginationPlugin.key);
	let t1;
	if ($[0] !== path) {
		t1 = typeof path?.[0] === "number" && Number.isFinite(path[0]) ? path[0] : null;
		$[0] = path;
		$[1] = t1;
	} else t1 = $[1];
	const pageIndex = t1;
	let t2;
	let t3;
	if ($[2] !== pageIndex || $[3] !== registry) {
		t2 = () => {
			if (!registry || pageIndex === null || !outerRef.current || !contentRef.current) return;
			return registry.registerPage(pageIndex, {
				outer: outerRef.current,
				content: contentRef.current
			});
		};
		t3 = [registry, pageIndex];
		$[2] = pageIndex;
		$[3] = registry;
		$[4] = t2;
		$[5] = t3;
	} else {
		t2 = $[4];
		t3 = $[5];
	}
	useEffect(t2, t3);
	const contentHeight = sizes.height - margins.top - margins.bottom;
	const contentWidth = sizes.width - margins.left - margins.right;
	const isPaginated = viewMode === "paginated";
	const t4 = isPaginated ? "relative mx-auto my-6 bg-white shadow-lg" : "relative mx-auto my-6 bg-white";
	const t5 = isPaginated ? sizes.width : "100%";
	const t6 = isPaginated ? void 0 : sizes.width;
	const t7 = isPaginated ? sizes.height : "auto";
	const t8 = `${margins.top}px ${margins.right}px ${margins.bottom}px ${margins.left}px`;
	let t9;
	if ($[6] !== t5 || $[7] !== t6 || $[8] !== t7 || $[9] !== t8) {
		t9 = {
			width: t5,
			maxWidth: t6,
			height: t7,
			padding: t8,
			boxSizing: "border-box"
		};
		$[6] = t5;
		$[7] = t6;
		$[8] = t7;
		$[9] = t8;
		$[10] = t9;
	} else t9 = $[10];
	const t10 = isPaginated ? contentWidth : "100%";
	const t11 = isPaginated ? contentHeight : "auto";
	let t12;
	if ($[11] !== t10 || $[12] !== t11) {
		t12 = {
			width: t10,
			height: t11,
			display: "flex",
			flexDirection: "column",
			overflow: "visible"
		};
		$[11] = t10;
		$[12] = t11;
		$[13] = t12;
	} else t12 = $[13];
	let t13;
	if ($[14] !== children || $[15] !== t12) {
		t13 = /* @__PURE__ */ React.createElement("div", {
			ref: contentRef,
			className: "plate-page-content",
			style: t12
		}, children);
		$[14] = children;
		$[15] = t12;
		$[16] = t13;
	} else t13 = $[16];
	let t14;
	if ($[17] !== attributes || $[18] !== composedRef || $[19] !== t13 || $[20] !== t4 || $[21] !== t9) {
		t14 = /* @__PURE__ */ React.createElement("div", {
			...attributes,
			ref: composedRef,
			className: t4,
			style: t9
		}, t13);
		$[17] = attributes;
		$[18] = composedRef;
		$[19] = t13;
		$[20] = t4;
		$[21] = t9;
		$[22] = t14;
	} else t14 = $[22];
	return t14;
}

//#endregion
//#region src/leaderElection.ts
function createAwarenessLeaderElection(awareness, ydoc) {
	const clientId = ydoc.clientID;
	const subscribers = /* @__PURE__ */ new Set();
	const getLeaderClientId = () => {
		const states = awareness.getStates();
		const activeClients = [];
		states.forEach((state, id) => {
			if (state?.pagination?.ready === true) activeClients.push(id);
		});
		if (activeClients.length === 0) return clientId;
		return Math.min(...activeClients);
	};
	const amILeader = () => getLeaderClientId() === clientId;
	const handleChange = () => {
		subscribers.forEach((fn) => {
			fn();
		});
	};
	awareness.on("change", handleChange);
	return {
		amILeader,
		subscribe(callback) {
			subscribers.add(callback);
			return () => subscribers.delete(callback);
		},
		destroy() {
			awareness.off("change", handleChange);
			subscribers.clear();
		}
	};
}
function createAlwaysLeader() {
	return {
		amILeader: () => true,
		subscribe: () => () => {},
		destroy: () => {}
	};
}

//#endregion
//#region src/reflowEngine.ts
function withoutSaving(editor, fn) {
	if (HistoryEditor.isHistoryEditor(editor)) HistoryEditor.withoutSaving(editor, fn);
	else fn();
}
function parseRowGap(el) {
	const gap = getComputedStyle(el).rowGap;
	return Number.parseFloat(gap) || 0;
}
function reflowPageBoundary(editor, pageIndex, context) {
	const { pageDom, nextPageDom, opts } = context;
	const pagePath = [pageIndex];
	const nextPagePath = [pageIndex + 1];
	const contentEl = pageDom.content;
	const maxHeight = contentEl.clientHeight;
	const currentHeight = contentEl.scrollHeight;
	if (currentHeight > maxHeight + opts.overflowThresholdPx) {
		const splitIndex = findOverflowSplitIndex(contentEl, maxHeight);
		if (splitIndex === null) return {
			changed: false,
			nextPageToContinue: null
		};
		const childCount = Node.get(editor, pagePath).children.length;
		if (splitIndex === 0 && childCount === 1) {
			if (opts.allowTextSplit) {
				if (splitOversizedBlock(editor, pagePath, contentEl, maxHeight)) return {
					changed: true,
					nextPageToContinue: pageIndex
				};
			}
			return {
				changed: false,
				nextPageToContinue: null
			};
		}
		if (!Node.has(editor, nextPagePath)) {
			const pageType = editor.getType?.(BasePaginationPlugin.key) ?? "page";
			const defaultBlockType = editor.getOption?.(BasePaginationPlugin, "defaultBlockType") ?? "p";
			withoutSaving(editor, () => {
				Editor.withoutNormalizing(editor, () => {
					Transforms.insertNodes(editor, {
						type: pageType,
						children: [{
							type: defaultBlockType,
							children: [{ text: "" }]
						}]
					}, { at: nextPagePath });
				});
			});
		}
		const nodesToMove = childCount - splitIndex;
		withoutSaving(editor, () => {
			Editor.withoutNormalizing(editor, () => {
				for (let i = nodesToMove - 1; i >= 0; i--) {
					const sourceIndex = splitIndex + i;
					Transforms.moveNodes(editor, {
						at: pagePath.concat([sourceIndex]),
						to: nextPagePath.concat([0])
					});
				}
			});
		});
		return {
			changed: true,
			nextPageToContinue: pageIndex + 1
		};
	}
	if (!opts.underflow) return {
		changed: false,
		nextPageToContinue: null
	};
	if (!Node.has(editor, nextPagePath)) return {
		changed: false,
		nextPageToContinue: null
	};
	if (Node.get(editor, nextPagePath).children.length === 0) {
		withoutSaving(editor, () => {
			Editor.withoutNormalizing(editor, () => {
				Transforms.removeNodes(editor, { at: nextPagePath });
			});
		});
		return {
			changed: true,
			nextPageToContinue: null
		};
	}
	const availableSpace = maxHeight - currentHeight;
	if (availableSpace <= opts.underflowThresholdPx) return {
		changed: false,
		nextPageToContinue: null
	};
	if (!nextPageDom) return {
		changed: false,
		nextPageToContinue: null
	};
	const firstChildEl = nextPageDom.content.children[0];
	if (!firstChildEl) return {
		changed: false,
		nextPageToContinue: null
	};
	const gap = parseRowGap(contentEl);
	if (firstChildEl.offsetHeight + (contentEl.children.length > 0 ? gap : 0) > availableSpace - 20) return {
		changed: false,
		nextPageToContinue: null
	};
	const targetIndex = Node.get(editor, pagePath).children.length;
	withoutSaving(editor, () => {
		Editor.withoutNormalizing(editor, () => {
			Transforms.moveNodes(editor, {
				at: nextPagePath.concat([0]),
				to: pagePath.concat([targetIndex])
			});
		});
	});
	return {
		changed: true,
		nextPageToContinue: pageIndex
	};
}
function findOverflowSplitIndex(contentEl, maxHeight) {
	const children = Array.from(contentEl.children);
	let left = 0;
	let right = children.length - 1;
	let result = null;
	while (left <= right) {
		const mid = Math.floor((left + right) / 2);
		const child = children[mid];
		if (child.offsetTop + child.offsetHeight > maxHeight) {
			result = mid;
			right = mid - 1;
		} else left = mid + 1;
	}
	return result;
}
function splitOversizedBlock(editor, pagePath, contentEl, maxHeight) {
	if (!editor.hasEditableTarget) return false;
	const blockPath = pagePath.concat([0]);
	try {
		const fullText = Editor.string(editor, blockPath);
		if (!fullText || fullText.length < 2) return false;
		const start = Editor.start(editor, blockPath);
		const maxBottom = contentEl.getBoundingClientRect().top + maxHeight - 1;
		const pointAtOffset = (offset) => {
			let remaining = offset;
			for (const [textNode, textPath] of Editor.nodes(editor, {
				at: blockPath,
				match: (n) => typeof n.text === "string"
			})) {
				const text = textNode.text;
				if (remaining <= text.length) return {
					path: textPath,
					offset: remaining
				};
				remaining -= text.length;
			}
			return Editor.end(editor, blockPath);
		};
		let lo = 1;
		let hi = fullText.length - 1;
		let best = 0;
		while (lo <= hi) {
			const mid = Math.floor((lo + hi) / 2);
			const range = {
				anchor: start,
				focus: pointAtOffset(mid)
			};
			let domRange;
			try {
				const toDOMRange = ReactEditor.toDOMRange;
				if (!toDOMRange) return false;
				domRange = toDOMRange(editor, range);
			} catch {
				return false;
			}
			if (domRange.getBoundingClientRect().bottom <= maxBottom) {
				best = mid;
				lo = mid + 1;
			} else hi = mid - 1;
		}
		if (best <= 0) return false;
		const splitPoint = pointAtOffset(best);
		const nextPagePath = [pagePath[0] + 1];
		const pageType = editor.getType?.(BasePaginationPlugin.key) ?? "page";
		const defaultBlockType = editor.getOption?.(BasePaginationPlugin, "defaultBlockType") ?? "p";
		withoutSaving(editor, () => {
			withPaginationMutations(editor, () => {
				Editor.withoutNormalizing(editor, () => {
					if (!Node.has(editor, nextPagePath)) Transforms.insertNodes(editor, {
						type: pageType,
						children: [{
							type: defaultBlockType,
							children: [{ text: "" }]
						}]
					}, { at: nextPagePath });
					Transforms.splitNodes(editor, {
						at: splitPoint,
						match: (n) => Element.isElement(n) && Editor.isBlock(editor, n)
					});
					Transforms.moveNodes(editor, {
						at: pagePath.concat([1]),
						to: nextPagePath.concat([0])
					});
				});
			});
		});
		return true;
	} catch (e) {
		console.error("Text split failed:", e);
		return false;
	}
}

//#endregion
//#region src/PaginationCoordinator.tsx
function PaginationCoordinator({ leaderElection, canProcess }) {
	const editor = useEditorRef();
	const registry = usePaginationRegistry();
	const reflowOpts = usePluginOption(BasePaginationPlugin, "reflow");
	const collabOpts = usePluginOption(BasePaginationPlugin, "collaboration");
	const viewMode = usePluginOption(BasePaginationPlugin, "viewMode");
	const runtime = getPaginationRuntime(editor);
	const leader = leaderElection ?? createAlwaysLeader();
	const isLeaderRef = useRef(leader.amILeader());
	const scheduledRef = useRef(null);
	const runningRef = useRef(false);
	const pendingStartRef = useRef(null);
	useEffect(() => {
		if (collabOpts.mode !== "leader") return;
		return leader.subscribe(() => {
			isLeaderRef.current = leader.amILeader();
		});
	}, [leader, collabOpts.mode]);
	const shouldProcess = useCallback(() => {
		if (canProcess === false) return false;
		if (!reflowOpts.enabled) return false;
		if (collabOpts.mode === "leader" && !isLeaderRef.current) return false;
		return true;
	}, [
		canProcess,
		reflowOpts.enabled,
		collabOpts.mode
	]);
	const scheduleReflowFromRef = useRef(() => {});
	const runReflow = useCallback(async (startPage) => {
		if (!shouldProcess() || !registry) return;
		if (runningRef.current) {
			scheduleReflowFromRef.current(startPage);
			return;
		}
		runningRef.current = true;
		try {
			await new Promise((r) => requestAnimationFrame(r));
			let page = Math.max(0, startPage);
			let pagesProcessed = 0;
			while (pagesProcessed < reflowOpts.maxPagesPerIdle) {
				const pageDom = registry.getPageDom(page);
				if (!pageDom) break;
				const nextPageDom = registry.getPageDom(page + 1);
				const result = reflowPageBoundary(editor, page, {
					pageDom,
					nextPageDom,
					opts: reflowOpts
				});
				pagesProcessed++;
				if (result.changed) {
					if (result.nextPageToContinue !== null) scheduleReflowFromRef.current(result.nextPageToContinue);
					break;
				}
				page++;
			}
		} finally {
			runningRef.current = false;
		}
	}, [
		editor,
		registry,
		reflowOpts,
		shouldProcess
	]);
	const scheduleReflowFrom = useCallback((startPage_0) => {
		if (!shouldProcess()) return;
		pendingStartRef.current = pendingStartRef.current === null ? startPage_0 : Math.min(pendingStartRef.current, startPage_0);
		if (scheduledRef.current !== null) return;
		scheduledRef.current = window.setTimeout(() => {
			scheduledRef.current = null;
			const start = pendingStartRef.current ?? 0;
			pendingStartRef.current = null;
			(window.requestIdleCallback ?? ((cb) => setTimeout(cb, 0)))(() => runReflow(start));
		}, reflowOpts.debounceMs);
	}, [
		runReflow,
		shouldProcess,
		reflowOpts.debounceMs
	]);
	scheduleReflowFromRef.current = scheduleReflowFrom;
	useEffect(() => {
		if (!runtime) return;
		return runtime.subscribe(() => {
			const min = runtime.consumeDirtyMin();
			if (min !== null) scheduleReflowFrom(min);
		});
	}, [runtime, scheduleReflowFrom]);
	useEffect(() => {
		if (!reflowOpts.enabled) return;
		const onResize = () => scheduleReflowFrom(0);
		window.addEventListener("resize", onResize);
		return () => window.removeEventListener("resize", onResize);
	}, [reflowOpts.enabled, scheduleReflowFrom]);
	useEffect(() => {
		scheduleReflowFrom(0);
	}, [scheduleReflowFrom]);
	useEffect(() => {
		if (!reflowOpts.enabled) return;
		scheduleReflowFrom(0);
	}, [
		reflowOpts.enabled,
		scheduleReflowFrom,
		viewMode
	]);
	return null;
}

//#endregion
//#region src/YjsIntegration.tsx
function YjsPaginationBridge() {
	const $ = c(19);
	const editor = useEditorRef();
	let t0;
	if ($[0] !== editor) {
		t0 = getPaginationRuntime(editor);
		$[0] = editor;
		$[1] = t0;
	} else t0 = $[1];
	const runtime = t0;
	const awareness = usePluginOption(YjsPlugin, "awareness");
	const ydoc = usePluginOption(YjsPlugin, "ydoc");
	const isConnected = usePluginOption(YjsPlugin, "_isConnected");
	const isSynced = usePluginOption(YjsPlugin, "_isSynced");
	const canProcess = Boolean(isConnected && isSynced);
	let t1;
	bb0: {
		if (!awareness || !ydoc) {
			t1 = null;
			break bb0;
		}
		const t2$1 = awareness;
		const t3$1 = ydoc;
		let t4$1;
		if ($[2] !== t2$1 || $[3] !== t3$1) {
			t4$1 = createAwarenessLeaderElection(t2$1, t3$1);
			$[2] = t2$1;
			$[3] = t3$1;
			$[4] = t4$1;
		} else t4$1 = $[4];
		t1 = t4$1;
	}
	const leaderElection = t1;
	let t2;
	let t3;
	if ($[5] !== canProcess || $[6] !== runtime) {
		t2 = () => {
			if (!canProcess || !runtime) return;
			runtime.markDirty(0);
		};
		t3 = [canProcess, runtime];
		$[5] = canProcess;
		$[6] = runtime;
		$[7] = t2;
		$[8] = t3;
	} else {
		t2 = $[7];
		t3 = $[8];
	}
	useEffect(t2, t3);
	let t4;
	let t5;
	if ($[9] !== awareness || $[10] !== canProcess) {
		t4 = () => {
			if (!awareness) return;
			awareness.setLocalStateField("pagination", { ready: canProcess });
		};
		t5 = [awareness, canProcess];
		$[9] = awareness;
		$[10] = canProcess;
		$[11] = t4;
		$[12] = t5;
	} else {
		t4 = $[11];
		t5 = $[12];
	}
	useEffect(t4, t5);
	let t6;
	let t7;
	if ($[13] !== leaderElection) {
		t6 = () => {
			if (!leaderElection) return;
			return () => leaderElection.destroy();
		};
		t7 = [leaderElection];
		$[13] = leaderElection;
		$[14] = t6;
		$[15] = t7;
	} else {
		t6 = $[14];
		t7 = $[15];
	}
	useEffect(t6, t7);
	const t8 = leaderElection ?? void 0;
	let t9;
	if ($[16] !== canProcess || $[17] !== t8) {
		t9 = /* @__PURE__ */ React.createElement(PaginationCoordinator, {
			leaderElection: t8,
			canProcess
		});
		$[16] = canProcess;
		$[17] = t8;
		$[18] = t9;
	} else t9 = $[18];
	return t9;
}

//#endregion
//#region src/index.ts
const PaginationPlugin = toPlatePlugin(BasePaginationPlugin, { render: { node: PageElement } });

//#endregion
export { BasePaginationPlugin, PaginationCoordinator, PaginationPlugin, PaginationRegistryProvider, YjsPaginationBridge, createAlwaysLeader, createAwarenessLeaderElection, usePaginationRegistry };
//# sourceMappingURL=index.js.map