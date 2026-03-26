/**
 * @license GPL-3.0-only
 * html-to-docx-with-style — Ritápolis, Minas Gerais, Brasil
 * Copyright (c) 2026 Arthur Rodrigues
 * https://github.com/arthrod/html-to-docx-with-style
 * @preserve
 */
import { decode } from "html-entities";
import JSZip from "jszip";
import { create, fragment } from "xmlbuilder2/lib/xmlbuilder2.min.js";
import { cloneDeep } from "es-toolkit";
import { nanoid } from "nanoid";
import { FragmentContext, JustHTML } from "justjshtml/src/index.js";
import colorNames from "color-name";
//#region src/constants.ts
const applicationName = "html-to-docx";
const defaultOrientation = "portrait";
const landscapeWidth = 15840;
const landscapeHeight = 12240;
const landscapeMargins = {
	bottom: 1800,
	footer: 720,
	gutter: 0,
	header: 720,
	left: 1440,
	right: 1440,
	top: 1800
};
const portraitMargins = {
	bottom: 1440,
	footer: 720,
	gutter: 0,
	header: 720,
	left: 1800,
	right: 1800,
	top: 1440
};
const defaultFont = "Times New Roman";
const defaultFontSize = 22;
const defaultLang = "en-US";
const defaultDirection = "ltr";
const defaultTableBorderOptions = {
	color: "000000",
	size: 0,
	stroke: "nil"
};
const defaultTableBorderAttributeOptions = {
	size: 1,
	stroke: "single"
};
const SVG_UNIT_TO_PIXEL_CONVERSIONS = {
	"%": 1,
	cm: 37.7952755906,
	em: 16,
	in: 96,
	mm: 3.77952755906,
	pc: 16,
	pt: 1.33333333333,
	px: 1,
	rem: 16
};
const defaultHeadingOptions = {
	heading1: {
		bold: true,
		font: defaultFont,
		fontSize: 48,
		keepLines: true,
		keepNext: true,
		outlineLevel: 0,
		spacing: {
			before: 480,
			after: 0
		}
	},
	heading2: {
		bold: true,
		font: defaultFont,
		fontSize: 36,
		keepLines: true,
		keepNext: true,
		outlineLevel: 1,
		spacing: {
			before: 360,
			after: 80
		}
	},
	heading3: {
		bold: true,
		font: defaultFont,
		fontSize: 28,
		keepLines: true,
		keepNext: true,
		outlineLevel: 2,
		spacing: {
			before: 280,
			after: 80
		}
	},
	heading4: {
		bold: true,
		font: defaultFont,
		fontSize: 24,
		keepLines: true,
		keepNext: true,
		outlineLevel: 3,
		spacing: {
			before: 240,
			after: 40
		}
	},
	heading5: {
		bold: true,
		font: defaultFont,
		fontSize: 22,
		keepLines: true,
		keepNext: true,
		outlineLevel: 4,
		spacing: {
			before: 220,
			after: 40
		}
	},
	heading6: {
		bold: true,
		font: defaultFont,
		fontSize: 20,
		keepLines: true,
		keepNext: true,
		outlineLevel: 5,
		spacing: {
			before: 200,
			after: 40
		}
	}
};
const defaultDocumentOptions = {
	complexScriptFontSize: 22,
	createdAt: /* @__PURE__ */ new Date(),
	creator: applicationName,
	decodeUnicode: false,
	defaultLang,
	description: "",
	direction: "ltr",
	font: defaultFont,
	fontSize: 22,
	footer: false,
	footerType: "default",
	header: false,
	headerType: "default",
	heading: defaultHeadingOptions,
	imageProcessing: {
		downloadTimeout: 5e3,
		maxCacheEntries: 100,
		maxCacheSize: 20 * 1024 * 1024,
		maxImageSize: 10 * 1024 * 1024,
		maxRetries: 2,
		maxTimeout: 3e4,
		minImageSize: 1024,
		minTimeout: 1e3,
		retryDelayBase: 500,
		suppressSharpWarning: false,
		svgHandling: "convert",
		svgSanitization: true,
		verboseLogging: false
	},
	keywords: [applicationName],
	lastModifiedBy: applicationName,
	lineNumber: false,
	lineNumberOptions: {
		countBy: 1,
		restart: "continuous",
		start: 0
	},
	margins: cloneDeep(portraitMargins),
	modifiedAt: /* @__PURE__ */ new Date(),
	numbering: { defaultOrderedListStyleType: "decimal" },
	orientation: defaultOrientation,
	pageNumber: false,
	pageSize: {
		height: landscapeWidth,
		width: landscapeHeight
	},
	revision: 1,
	skipFirstHeaderFooter: false,
	subject: "",
	table: {
		addSpacingAfter: true,
		borderOptions: defaultTableBorderOptions,
		row: { cantSplit: false }
	},
	title: ""
};
const defaultHTMLString = "<p></p>";
const relsFolderName = "_rels";
const headerFileName = "header1";
const footerFileName = "footer1";
const themeFileName = "theme1";
const documentFileName = "document";
const headerType = "header";
const footerType = "footer";
const themeType = "theme";
const commentsType = "comments";
const commentsExtendedType = "commentsExtended";
const commentsIdsType = "commentsIds";
const commentsExtensibleType = "commentsExtensible";
const peopleType = "people";
const commentsExtendedContentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.commentsExtended+xml";
const commentsIdsContentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.commentsIds+xml";
const commentsExtensibleContentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.commentsExtensible+xml";
const peopleContentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.people+xml";
const commentsExtendedRelationshipType = "http://schemas.microsoft.com/office/2011/relationships/commentsExtended";
const commentsIdsRelationshipType = "http://schemas.microsoft.com/office/2016/09/relationships/commentsIds";
const commentsExtensibleRelationshipType = "http://schemas.microsoft.com/office/2018/08/relationships/commentsExtensible";
const peopleRelationshipType = "http://schemas.microsoft.com/office/2011/relationships/people";
const hyperlinkType = "hyperlink";
const imageType = "image";
const internalRelationship = "Internal";
const wordFolder = "word";
const themeFolder = "theme";
const paragraphBordersObject = {
	bottom: {
		color: "FFFFFF",
		size: 0,
		spacing: 3
	},
	left: {
		color: "FFFFFF",
		size: 0,
		spacing: 3
	},
	right: {
		color: "FFFFFF",
		size: 0,
		spacing: 3
	},
	top: {
		color: "FFFFFF",
		size: 0,
		spacing: 3
	}
};
const colorlessColors = ["transparent", "auto"];
const verticalAlignValues = [
	"top",
	"middle",
	"bottom"
];
//#endregion
//#region src/comment-templates.ts
/**
* XML template string constants for DOCX comment-related files.
*
* Each template is the exact root element shell (with 30+ namespace
* declarations) extracted from Word-generated DOCX files. Child elements
* are appended at runtime via xmlbuilder2.
*
* Do NOT simplify these -- the full namespace set and mc:Ignorable list
* are required for maximum Word compatibility.
*/
/** Root element shell for word/comments.xml */
const COMMENTS_TEMPLATE = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:comments xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:cx="http://schemas.microsoft.com/office/drawing/2014/chartex" xmlns:cx1="http://schemas.microsoft.com/office/drawing/2015/9/8/chartex" xmlns:cx2="http://schemas.microsoft.com/office/drawing/2015/10/21/chartex" xmlns:cx3="http://schemas.microsoft.com/office/drawing/2016/5/9/chartex" xmlns:cx4="http://schemas.microsoft.com/office/drawing/2016/5/10/chartex" xmlns:cx5="http://schemas.microsoft.com/office/drawing/2016/5/11/chartex" xmlns:cx6="http://schemas.microsoft.com/office/drawing/2016/5/12/chartex" xmlns:cx7="http://schemas.microsoft.com/office/drawing/2016/5/13/chartex" xmlns:cx8="http://schemas.microsoft.com/office/drawing/2016/5/14/chartex" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:aink="http://schemas.microsoft.com/office/drawing/2016/ink" xmlns:am3d="http://schemas.microsoft.com/office/drawing/2017/model3d" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:oel="http://schemas.microsoft.com/office/2019/extlst" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml" xmlns:w16cex="http://schemas.microsoft.com/office/word/2018/wordml/cex" xmlns:w16cid="http://schemas.microsoft.com/office/word/2016/wordml/cid" xmlns:w16="http://schemas.microsoft.com/office/word/2018/wordml" xmlns:w16du="http://schemas.microsoft.com/office/word/2023/wordml/word16du" xmlns:w16sdtdh="http://schemas.microsoft.com/office/word/2020/wordml/sdtdatahash" xmlns:w16sdtfl="http://schemas.microsoft.com/office/word/2024/wordml/sdtformatlock" xmlns:w16se="http://schemas.microsoft.com/office/word/2015/wordml/symex" xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup" xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk" xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml" xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape" mc:Ignorable="w14 w15 w16se w16cid w16 w16cex w16sdtdh w16sdtfl w16du wp14">
</w:comments>`;
/** Root element shell for word/commentsExtended.xml */
const COMMENTS_EXTENDED_TEMPLATE = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w15:commentsEx xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:cx="http://schemas.microsoft.com/office/drawing/2014/chartex" xmlns:cx1="http://schemas.microsoft.com/office/drawing/2015/9/8/chartex" xmlns:cx2="http://schemas.microsoft.com/office/drawing/2015/10/21/chartex" xmlns:cx3="http://schemas.microsoft.com/office/drawing/2016/5/9/chartex" xmlns:cx4="http://schemas.microsoft.com/office/drawing/2016/5/10/chartex" xmlns:cx5="http://schemas.microsoft.com/office/drawing/2016/5/11/chartex" xmlns:cx6="http://schemas.microsoft.com/office/drawing/2016/5/12/chartex" xmlns:cx7="http://schemas.microsoft.com/office/drawing/2016/5/13/chartex" xmlns:cx8="http://schemas.microsoft.com/office/drawing/2016/5/14/chartex" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:aink="http://schemas.microsoft.com/office/drawing/2016/ink" xmlns:am3d="http://schemas.microsoft.com/office/drawing/2017/model3d" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:oel="http://schemas.microsoft.com/office/2019/extlst" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml" xmlns:w16cex="http://schemas.microsoft.com/office/word/2018/wordml/cex" xmlns:w16cid="http://schemas.microsoft.com/office/word/2016/wordml/cid" xmlns:w16="http://schemas.microsoft.com/office/word/2018/wordml" xmlns:w16du="http://schemas.microsoft.com/office/word/2023/wordml/word16du" xmlns:w16sdtdh="http://schemas.microsoft.com/office/word/2020/wordml/sdtdatahash" xmlns:w16sdtfl="http://schemas.microsoft.com/office/word/2024/wordml/sdtformatlock" xmlns:w16se="http://schemas.microsoft.com/office/word/2015/wordml/symex" xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup" xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk" xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml" xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape" mc:Ignorable="w14 w15 w16se w16cid w16 w16cex w16sdtdh w16sdtfl w16du wp14">
</w15:commentsEx>`;
/** Root element shell for word/commentsIds.xml */
const COMMENTS_IDS_TEMPLATE = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w16cid:commentsIds xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:cx="http://schemas.microsoft.com/office/drawing/2014/chartex" xmlns:cx1="http://schemas.microsoft.com/office/drawing/2015/9/8/chartex" xmlns:cx2="http://schemas.microsoft.com/office/drawing/2015/10/21/chartex" xmlns:cx3="http://schemas.microsoft.com/office/drawing/2016/5/9/chartex" xmlns:cx4="http://schemas.microsoft.com/office/drawing/2016/5/10/chartex" xmlns:cx5="http://schemas.microsoft.com/office/drawing/2016/5/11/chartex" xmlns:cx6="http://schemas.microsoft.com/office/drawing/2016/5/12/chartex" xmlns:cx7="http://schemas.microsoft.com/office/drawing/2016/5/13/chartex" xmlns:cx8="http://schemas.microsoft.com/office/drawing/2016/5/14/chartex" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:aink="http://schemas.microsoft.com/office/drawing/2016/ink" xmlns:am3d="http://schemas.microsoft.com/office/drawing/2017/model3d" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:oel="http://schemas.microsoft.com/office/2019/extlst" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml" xmlns:w16cex="http://schemas.microsoft.com/office/word/2018/wordml/cex" xmlns:w16cid="http://schemas.microsoft.com/office/word/2016/wordml/cid" xmlns:w16="http://schemas.microsoft.com/office/word/2018/wordml" xmlns:w16du="http://schemas.microsoft.com/office/word/2023/wordml/word16du" xmlns:w16sdtdh="http://schemas.microsoft.com/office/word/2020/wordml/sdtdatahash" xmlns:w16sdtfl="http://schemas.microsoft.com/office/word/2024/wordml/sdtformatlock" xmlns:w16se="http://schemas.microsoft.com/office/word/2015/wordml/symex" xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup" xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk" xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml" xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape" mc:Ignorable="w14 w15 w16se w16cid w16 w16cex w16sdtdh w16sdtfl w16du wp14">
</w16cid:commentsIds>`;
/** Root element shell for word/commentsExtensible.xml (includes extra xmlns:cr namespace) */
const COMMENTS_EXTENSIBLE_TEMPLATE = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w16cex:commentsExtensible xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:cx="http://schemas.microsoft.com/office/drawing/2014/chartex" xmlns:cx1="http://schemas.microsoft.com/office/drawing/2015/9/8/chartex" xmlns:cx2="http://schemas.microsoft.com/office/drawing/2015/10/21/chartex" xmlns:cx3="http://schemas.microsoft.com/office/drawing/2016/5/9/chartex" xmlns:cx4="http://schemas.microsoft.com/office/drawing/2016/5/10/chartex" xmlns:cx5="http://schemas.microsoft.com/office/drawing/2016/5/11/chartex" xmlns:cx6="http://schemas.microsoft.com/office/drawing/2016/5/12/chartex" xmlns:cx7="http://schemas.microsoft.com/office/drawing/2016/5/13/chartex" xmlns:cx8="http://schemas.microsoft.com/office/drawing/2016/5/14/chartex" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:aink="http://schemas.microsoft.com/office/drawing/2016/ink" xmlns:am3d="http://schemas.microsoft.com/office/drawing/2017/model3d" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:oel="http://schemas.microsoft.com/office/2019/extlst" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml" xmlns:w16cex="http://schemas.microsoft.com/office/word/2018/wordml/cex" xmlns:w16cid="http://schemas.microsoft.com/office/word/2016/wordml/cid" xmlns:w16="http://schemas.microsoft.com/office/word/2018/wordml" xmlns:w16du="http://schemas.microsoft.com/office/word/2023/wordml/word16du" xmlns:w16sdtdh="http://schemas.microsoft.com/office/word/2020/wordml/sdtdatahash" xmlns:w16sdtfl="http://schemas.microsoft.com/office/word/2024/wordml/sdtformatlock" xmlns:w16se="http://schemas.microsoft.com/office/word/2015/wordml/symex" xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup" xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk" xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml" xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape" xmlns:cr="http://schemas.microsoft.com/office/comments/2020/reactions" mc:Ignorable="w14 w15 w16se w16cid w16 w16cex w16sdtdh w16sdtfl cr w16du wp14">
</w16cex:commentsExtensible>`;
/** Root element shell for word/people.xml (minimal namespaces, matches Word output) */
const PEOPLE_TEMPLATE = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w15:people xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml">
</w15:people>`;
//#endregion
//#region \0@oxc-project+runtime@0.115.0/helpers/typeof.js
function _typeof(o) {
	"@babel/helpers - typeof";
	return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof(o);
}
//#endregion
//#region \0@oxc-project+runtime@0.115.0/helpers/toPrimitive.js
function toPrimitive(t, r) {
	if ("object" != _typeof(t) || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != _typeof(i)) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
//#endregion
//#region \0@oxc-project+runtime@0.115.0/helpers/toPropertyKey.js
function toPropertyKey(t) {
	var i = toPrimitive(t, "string");
	return "symbol" == _typeof(i) ? i : i + "";
}
//#endregion
//#region \0@oxc-project+runtime@0.115.0/helpers/defineProperty.js
function _defineProperty(e, r, t) {
	return (r = toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
		value: t,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[r] = t, e;
}
//#endregion
//#region src/vdom/index.ts
/**
* Virtual DOM classes - EXACT implementation matching virtual-dom@2.x
*
* This is a faithful reproduction of virtual-dom's VNode and VText classes
* to eliminate the security vulnerability (CVE-2025-57352) in virtual-dom's
* transitive dependency min-document, while maintaining 100% API compatibility.
*
* Based on: https://github.com/Matt-Esch/virtual-dom
*/
const version = "2";
const noProperties = {};
const noChildren = [];
/**
* Helper to check if something is a VNode (internal)
*/
function _isVNode(x) {
	return x && x.type === "VirtualNode";
}
/**
* Helper to check if something is a Widget
*/
function isWidget(x) {
	return x && x.type === "Widget";
}
/**
* Helper to check if something is a Thunk
*/
function isThunk(x) {
	return x && x.type === "Thunk";
}
/**
* Helper to check if something is a VHook
*/
function isVHook(x) {
	return x && (typeof x.hook === "function" && !Object.hasOwn(x, "hook") || typeof x.unhook === "function" && !Object.hasOwn(x, "unhook"));
}
/**
* VNode - Represents an HTML element in the virtual DOM tree
* EXACT copy of virtual-dom/vnode/vnode.js
*/
var VNode = class {
	constructor(tagName, properties, children, key, namespace) {
		_defineProperty(this, "tagName", void 0);
		_defineProperty(this, "properties", void 0);
		_defineProperty(this, "children", void 0);
		_defineProperty(this, "key", void 0);
		_defineProperty(this, "namespace", void 0);
		_defineProperty(this, "count", void 0);
		_defineProperty(this, "hasWidgets", void 0);
		_defineProperty(this, "hasThunks", void 0);
		_defineProperty(this, "hooks", void 0);
		_defineProperty(this, "descendantHooks", void 0);
		const vnodeProperties = properties || noProperties;
		const vnodeChildren = children || noChildren;
		this.tagName = tagName;
		this.properties = vnodeProperties;
		this.children = vnodeChildren;
		this.key = key != null ? String(key) : void 0;
		this.namespace = typeof namespace === "string" ? namespace : null;
		const count = vnodeChildren && vnodeChildren.length || 0;
		let descendants = 0;
		let hasWidgets = false;
		let hasThunks = false;
		let descendantHooks = false;
		let hooks;
		for (const propName in vnodeProperties) if (Object.hasOwn(vnodeProperties, propName)) {
			const property = vnodeProperties[propName];
			if (isVHook(property) && property.unhook) {
				if (!hooks) hooks = {};
				hooks[propName] = property;
			}
		}
		for (let i = 0; i < count; i += 1) {
			const child = vnodeChildren[i];
			if (_isVNode(child)) {
				descendants += child.count || 0;
				if (!hasWidgets && child.hasWidgets) hasWidgets = true;
				if (!hasThunks && child.hasThunks) hasThunks = true;
				if (!descendantHooks && (child.hooks || child.descendantHooks)) descendantHooks = true;
			} else if (!hasWidgets && isWidget(child)) {
				if (typeof child.destroy === "function") hasWidgets = true;
			} else if (!hasThunks && isThunk(child)) hasThunks = true;
		}
		this.count = count + descendants;
		this.hasWidgets = hasWidgets;
		this.hasThunks = hasThunks;
		this.hooks = hooks;
		this.descendantHooks = descendantHooks;
	}
};
VNode.prototype.version = version;
VNode.prototype.type = "VirtualNode";
/**
* VText - Represents a text node in the virtual DOM tree
* EXACT copy of virtual-dom/vnode/vtext.js
*/
var VText = class {
	constructor(text) {
		_defineProperty(this, "text", void 0);
		this.text = String(text);
	}
};
VText.prototype.version = version;
VText.prototype.type = "VirtualText";
/**
* Check if a value is a VNode (exported for compatibility)
*/
function isVNode(vnode) {
	return vnode && vnode.type === "VirtualNode";
}
/**
* Check if a value is a VText (exported for compatibility)
*/
function isVText(vtext) {
	return vtext && vtext.type === "VirtualText";
}
//#endregion
//#region src/helpers/html-parser.ts
/**
* HTML to Virtual DOM Parser
*
* Converts HTML strings to virtual DOM trees using justjshtml for parsing.
* This implementation replaces the unmaintained html-to-v package while
* maintaining full API compatibility.
*
* Based on React's HTML DOM property configuration and HTML parser libraries.
*/
const MUST_USE_ATTRIBUTE = 1;
const MUST_USE_PROPERTY = 2;
const HAS_BOOLEAN_VALUE = 4;
const HAS_NUMERIC_VALUE = 8;
const HAS_POSITIVE_NUMERIC_VALUE = 24;
const HAS_OVERLOADED_BOOLEAN_VALUE = 32;
const Properties = {
	accept: null,
	acceptCharset: null,
	accessKey: null,
	action: null,
	allowFullScreen: MUST_USE_ATTRIBUTE | HAS_BOOLEAN_VALUE,
	allowTransparency: MUST_USE_ATTRIBUTE,
	alt: null,
	async: HAS_BOOLEAN_VALUE,
	autoComplete: null,
	autoFocus: HAS_BOOLEAN_VALUE,
	autoPlay: HAS_BOOLEAN_VALUE,
	capture: MUST_USE_ATTRIBUTE | HAS_BOOLEAN_VALUE,
	cellPadding: null,
	cellSpacing: null,
	charSet: MUST_USE_ATTRIBUTE,
	challenge: MUST_USE_ATTRIBUTE,
	checked: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
	classID: MUST_USE_ATTRIBUTE,
	className: MUST_USE_ATTRIBUTE,
	cols: MUST_USE_ATTRIBUTE | HAS_POSITIVE_NUMERIC_VALUE,
	colSpan: null,
	content: null,
	contentEditable: null,
	contextMenu: MUST_USE_ATTRIBUTE,
	controls: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
	coords: null,
	crossOrigin: null,
	data: null,
	dateTime: MUST_USE_ATTRIBUTE,
	defer: HAS_BOOLEAN_VALUE,
	dir: null,
	disabled: MUST_USE_ATTRIBUTE | HAS_BOOLEAN_VALUE,
	download: HAS_OVERLOADED_BOOLEAN_VALUE,
	draggable: null,
	encType: null,
	form: MUST_USE_ATTRIBUTE,
	formAction: MUST_USE_ATTRIBUTE,
	formEncType: MUST_USE_ATTRIBUTE,
	formMethod: MUST_USE_ATTRIBUTE,
	formNoValidate: HAS_BOOLEAN_VALUE,
	formTarget: MUST_USE_ATTRIBUTE,
	frameBorder: MUST_USE_ATTRIBUTE,
	headers: null,
	height: MUST_USE_ATTRIBUTE,
	hidden: MUST_USE_ATTRIBUTE | HAS_BOOLEAN_VALUE,
	high: null,
	href: null,
	hrefLang: null,
	htmlFor: null,
	httpEquiv: null,
	icon: null,
	id: MUST_USE_PROPERTY,
	is: MUST_USE_ATTRIBUTE,
	keyParams: MUST_USE_ATTRIBUTE,
	keyType: MUST_USE_ATTRIBUTE,
	label: null,
	lang: null,
	list: MUST_USE_ATTRIBUTE,
	loop: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
	low: null,
	manifest: MUST_USE_ATTRIBUTE,
	marginHeight: null,
	marginWidth: null,
	max: null,
	maxLength: MUST_USE_ATTRIBUTE,
	media: MUST_USE_ATTRIBUTE,
	mediaGroup: null,
	method: null,
	min: null,
	minLength: MUST_USE_ATTRIBUTE,
	multiple: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
	muted: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
	name: null,
	noValidate: HAS_BOOLEAN_VALUE,
	open: HAS_BOOLEAN_VALUE,
	optimum: null,
	pattern: null,
	placeholder: null,
	poster: null,
	preload: null,
	radioGroup: null,
	readOnly: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
	rel: null,
	required: HAS_BOOLEAN_VALUE,
	role: MUST_USE_ATTRIBUTE,
	rows: MUST_USE_ATTRIBUTE | HAS_POSITIVE_NUMERIC_VALUE,
	rowSpan: null,
	sandbox: null,
	scope: null,
	scoped: HAS_BOOLEAN_VALUE,
	scrolling: null,
	seamless: MUST_USE_ATTRIBUTE | HAS_BOOLEAN_VALUE,
	selected: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
	shape: null,
	size: MUST_USE_ATTRIBUTE | HAS_POSITIVE_NUMERIC_VALUE,
	sizes: MUST_USE_ATTRIBUTE,
	span: HAS_POSITIVE_NUMERIC_VALUE,
	spellCheck: null,
	src: null,
	srcDoc: MUST_USE_PROPERTY,
	srcSet: MUST_USE_ATTRIBUTE,
	start: HAS_NUMERIC_VALUE,
	step: null,
	style: null,
	tabIndex: null,
	target: null,
	title: null,
	type: null,
	useMap: null,
	value: MUST_USE_PROPERTY,
	width: MUST_USE_ATTRIBUTE,
	wmode: MUST_USE_ATTRIBUTE,
	autoCapitalize: null,
	autoCorrect: null,
	itemProp: MUST_USE_ATTRIBUTE,
	itemScope: MUST_USE_ATTRIBUTE | HAS_BOOLEAN_VALUE,
	itemType: MUST_USE_ATTRIBUTE,
	itemID: MUST_USE_ATTRIBUTE,
	itemRef: MUST_USE_ATTRIBUTE,
	property: null,
	unselectable: MUST_USE_ATTRIBUTE
};
const PropertyToAttributeMapping = {
	className: "class",
	htmlFor: "for",
	httpEquiv: "http-equiv",
	acceptCharset: "accept-charset"
};
function checkMask(value, bitmask) {
	return (value & bitmask) === bitmask;
}
const propInfoByAttributeName = {};
Object.keys(Properties).forEach((propName) => {
	const propConfig = Properties[propName] || 0;
	const attributeName = PropertyToAttributeMapping[propName] || propName.toLowerCase();
	propInfoByAttributeName[attributeName] = {
		attributeName,
		propertyName: propName,
		mustUseAttribute: checkMask(propConfig, MUST_USE_ATTRIBUTE),
		mustUseProperty: checkMask(propConfig, MUST_USE_PROPERTY),
		hasBooleanValue: checkMask(propConfig, HAS_BOOLEAN_VALUE),
		hasNumericValue: checkMask(propConfig, HAS_NUMERIC_VALUE),
		hasPositiveNumericValue: checkMask(propConfig, HAS_POSITIVE_NUMERIC_VALUE),
		hasOverloadedBooleanValue: checkMask(propConfig, HAS_OVERLOADED_BOOLEAN_VALUE)
	};
});
function getPropertyInfo(attributeName) {
	const lowerCased = attributeName.toLowerCase();
	if (Object.hasOwn(propInfoByAttributeName, lowerCased)) return propInfoByAttributeName[lowerCased];
	return {
		attributeName,
		mustUseAttribute: true,
		isCustomAttribute: true
	};
}
/**
* Parse CSS style string into object
*/
function parseStyles(input) {
	return input.split(";").reduce((object, attribute) => {
		const entry = attribute.split(/:(.*)/);
		if (entry[0] && entry[1]) object[entry[0].trim()] = entry[1].trim();
		return object;
	}, {});
}
const propertyValueConversions = {
	style: parseStyles,
	placeholder: decode,
	title: decode,
	alt: decode
};
function propertyIsTrue(propInfo, value) {
	const propertyValue = typeof value === "string" ? value : String(value);
	if (propInfo.hasBooleanValue) return propertyValue === "" || propertyValue.toLowerCase() === propInfo.attributeName;
	if (propInfo.hasOverloadedBooleanValue) return propertyValue === "";
	return false;
}
function getPropertyValue(propInfo, value) {
	const isTrue = propertyIsTrue(propInfo, value);
	if (propInfo.hasBooleanValue) return !!isTrue;
	if (propInfo.hasOverloadedBooleanValue) return isTrue ? true : value;
	if (propInfo.hasNumericValue || propInfo.hasPositiveNumericValue) return Number(value);
	return value;
}
function setVNodeProperty(properties, propInfo, value) {
	const propName = propInfo.propertyName;
	let valueConverter;
	if (!propName) return;
	if (Object.hasOwn(propertyValueConversions, propName)) {
		valueConverter = propertyValueConversions[propName];
		value = valueConverter(typeof value === "string" ? value : String(value));
	}
	properties[propInfo.propertyName] = getPropertyValue(propInfo, value);
}
function getAttributeValue(propInfo, value) {
	if (propInfo.hasBooleanValue) return "";
	return value;
}
function setVNodeAttribute(properties, propInfo, value) {
	properties.attributes[propInfo.attributeName] = getAttributeValue(propInfo, value);
}
function getPropertySetter(propInfo) {
	if (propInfo.mustUseAttribute) return { set: setVNodeAttribute };
	return { set: setVNodeProperty };
}
/**
* Convert tag attributes to VNode properties
*/
function convertTagAttributes(tag) {
	const attributes = tag.attrs || {};
	const vNodeProperties = { attributes: {} };
	Object.keys(attributes).forEach((attributeName) => {
		const value = attributes[attributeName];
		const propInfo = getPropertyInfo(attributeName);
		getPropertySetter(propInfo).set(vNodeProperties, propInfo, value);
	});
	return vNodeProperties;
}
function createConverter(VNodeClass, VTextClass) {
	const isElementNode = (node) => !node.name.startsWith("#") && node.name !== "!doctype";
	const converter = {
		convert(node, getVNodeKey) {
			if (isElementNode(node)) return converter.convertTag(node, getVNodeKey);
			if (node.name === "#text") return new VTextClass(decode(node.data || ""));
			return new VTextClass("");
		},
		convertTag(tag, getVNodeKey) {
			const attributes = convertTagAttributes(tag);
			let key;
			if (getVNodeKey) key = getVNodeKey(attributes);
			const children = (tag.children || []).map((node) => converter.convert(node, getVNodeKey));
			return new VNodeClass(tag.name, attributes, children, key);
		}
	};
	return converter;
}
const HTML_TAG_PATTERN = /<\s*html\b/i;
const HEAD_TAG_PATTERN = /<\s*head\b/i;
const BODY_TAG_PATTERN = /<\s*body\b/i;
const DOCTYPE_PATTERN = /<\s*!doctype\b/i;
const TBODY_PATTERN = /<\s*tbody\b/i;
const LEADING_TRIVIA_PATTERN = /^\s*(?:<!--[\s\S]*?-->\s*)*/;
function getFragmentContextTagName(html) {
	const trimmed = html.replace(LEADING_TRIVIA_PATTERN, "");
	if (/^<(?:td|th)\b/i.test(trimmed)) return "tr";
	if (/^<tr\b/i.test(trimmed)) return "tbody";
	if (/^<(?:tbody|thead|tfoot|caption|colgroup)\b/i.test(trimmed)) return "table";
	if (/^<col\b/i.test(trimmed)) return "colgroup";
	return "body";
}
function normalizeDocumentRootNodes(rootChildren, hasExplicitHead, hasExplicitBody) {
	const normalizedNodes = [];
	rootChildren.forEach((rootNode) => {
		if (rootNode.name !== "html") {
			normalizedNodes.push(rootNode);
			return;
		}
		const htmlChildren = rootNode.children || [];
		const headNode = htmlChildren.find((child) => child.name === "head");
		const bodyNode = htmlChildren.find((child) => child.name === "body");
		if (hasExplicitHead && headNode) normalizedNodes.push(headNode);
		if (hasExplicitBody && bodyNode) normalizedNodes.push(bodyNode);
		if (!hasExplicitHead && !hasExplicitBody) {
			normalizedNodes.push(...bodyNode?.children || []);
			return;
		}
		if (hasExplicitHead && !hasExplicitBody) normalizedNodes.push(...bodyNode?.children || []);
		if (hasExplicitBody && !hasExplicitHead) normalizedNodes.push(...headNode?.children || []);
	});
	return normalizedNodes;
}
function flattenImplicitTableBodies(nodes, shouldFlatten) {
	if (!shouldFlatten) return;
	nodes.forEach((node) => {
		const children = node.children || [];
		flattenImplicitTableBodies(children, shouldFlatten);
		if (node.name !== "table" || children.length === 0) return;
		const elementChildren = children.filter((child) => !child.name.startsWith("#"));
		if (elementChildren.length > 0 && elementChildren.every((child) => child.name === "tbody")) node.children = children.flatMap((child) => child.name === "tbody" ? child.children || [] : [child]);
	});
}
/**
* Parse HTML string into DOM nodes.
*
* justjshtml always parses as a full HTML document, while the previous
* htmlparser2 integration behaved like fragment parsing for most inputs.
* We normalize root nodes to preserve previous behavior expected by tests:
* - fragments resolve to body children
* - explicit <html> preserves the html root element
* - explicit <head>/<body> keeps those roots
*/
function parseHTML(html) {
	const hasExplicitHtml = HTML_TAG_PATTERN.test(html);
	const hasExplicitHead = HEAD_TAG_PATTERN.test(html);
	const hasExplicitBody = BODY_TAG_PATTERN.test(html);
	const hasDoctype = DOCTYPE_PATTERN.test(html);
	let parsedNodes;
	if (hasExplicitHtml || hasExplicitHead || hasExplicitBody || hasDoctype) {
		const rootChildren = new JustHTML(html).root?.children || [];
		parsedNodes = hasExplicitHtml ? rootChildren : normalizeDocumentRootNodes(rootChildren, hasExplicitHead, hasExplicitBody);
	} else parsedNodes = new JustHTML(html, { fragmentContext: new FragmentContext(getFragmentContextTagName(html)) }).root?.children || [];
	flattenImplicitTableBodies(parsedNodes, !TBODY_PATTERN.test(html));
	return parsedNodes;
}
function convertHTML$2(optionsOrHTML, html) {
	const opts = typeof optionsOrHTML === "object" ? optionsOrHTML : void 0;
	const htmlString = (typeof optionsOrHTML === "string" ? optionsOrHTML : html) || "";
	const converter = createConverter(VNode, VText);
	const tags = parseHTML(htmlString);
	let convertedHTML;
	if (tags.length === 0) convertedHTML = new VText("");
	else if (tags.length > 1) convertedHTML = tags.map((tag) => converter.convert(tag, opts && opts.getVNodeKey));
	else convertedHTML = converter.convert(tags[0], opts && opts.getVNodeKey);
	return convertedHTML;
}
/**
* Factory function for HTML to VNode conversion
*/
function createHTMLtoVDOM() {
	return convertHTML$2;
}
//#endregion
//#region src/namespaces.ts
const namespaces = {
	a: "http://schemas.openxmlformats.org/drawingml/2006/main",
	b: "http://schemas.openxmlformats.org/officeDocument/2006/bibliography",
	cdr: "http://schemas.openxmlformats.org/drawingml/2006/chartDrawing",
	contentTypes: "http://schemas.openxmlformats.org/package/2006/content-types",
	coreProperties: "http://schemas.openxmlformats.org/package/2006/metadata/core-properties",
	corePropertiesRelation: "http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties",
	dc: "http://purl.org/dc/elements/1.1/",
	dcmitype: "http://purl.org/dc/dcmitype/",
	dcterms: "http://purl.org/dc/terms/",
	comments: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/comments",
	fontTable: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/fontTable",
	footers: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer",
	headers: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/header",
	hyperlinks: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink",
	images: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/image",
	m: "http://schemas.openxmlformats.org/officeDocument/2006/math",
	numbering: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering",
	o: "urn:schemas-microsoft-com:office:office",
	officeDocumentRelation: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument",
	pic: "http://schemas.openxmlformats.org/drawingml/2006/picture",
	r: "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
	relationship: "http://schemas.openxmlformats.org/package/2006/relationships",
	settingsRelation: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings",
	sl: "http://schemas.openxmlformats.org/schemaLibrary/2006/main",
	styles: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles",
	themes: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme",
	v: "urn:schemas-microsoft-com:vml",
	ve: "http://schemas.openxmlformats.org/markup-compatibility/2006",
	vt: "http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes",
	w: "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
	w10: "urn:schemas-microsoft-com:office:word",
	w14: "http://schemas.microsoft.com/office/word/2010/wordml",
	w15: "http://schemas.microsoft.com/office/word/2012/wordml",
	w16cid: "http://schemas.microsoft.com/office/word/2016/wordml/cid",
	w16cex: "http://schemas.microsoft.com/office/word/2018/wordml/cex",
	webSettingsRelation: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/webSettings",
	wne: "http://schemas.microsoft.com/office/word/2006/wordml",
	wp: "http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing",
	xsd: "http://www.w3.org/2001/XMLSchema",
	xsi: "http://www.w3.org/2001/XMLSchema-instance"
};
//#endregion
//#region src/utils/image-dimensions.ts
/**
* Get image dimensions from a buffer
* Supports PNG, JPEG, GIF, BMP, WebP
*/
function getImageDimensions(buffer) {
	const uint8 = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
	if (uint8[0] === 137 && uint8[1] === 80 && uint8[2] === 78 && uint8[3] === 71) return {
		width: uint8[16] << 24 | uint8[17] << 16 | uint8[18] << 8 | uint8[19],
		height: uint8[20] << 24 | uint8[21] << 16 | uint8[22] << 8 | uint8[23],
		type: "png"
	};
	if (uint8[0] === 255 && uint8[1] === 216 && uint8[2] === 255) {
		let offset = 2;
		while (offset < uint8.length) {
			if (uint8[offset] !== 255) {
				offset++;
				continue;
			}
			const marker = uint8[offset + 1];
			if (marker === 192 || marker === 193 || marker === 194) return {
				height: uint8[offset + 5] << 8 | uint8[offset + 6],
				width: uint8[offset + 7] << 8 | uint8[offset + 8],
				type: "jpg"
			};
			const length = uint8[offset + 2] << 8 | uint8[offset + 3];
			offset += 2 + length;
		}
		return {
			width: 100,
			height: 100,
			type: "jpg"
		};
	}
	if (uint8[0] === 71 && uint8[1] === 73 && uint8[2] === 70 && uint8[3] === 56) return {
		width: uint8[6] | uint8[7] << 8,
		height: uint8[8] | uint8[9] << 8,
		type: "gif"
	};
	if (uint8[0] === 66 && uint8[1] === 77) return {
		width: uint8[18] | uint8[19] << 8 | uint8[20] << 16 | uint8[21] << 24,
		height: uint8[22] | uint8[23] << 8 | uint8[24] << 16 | uint8[25] << 24,
		type: "bmp"
	};
	if (uint8[0] === 82 && uint8[1] === 73 && uint8[2] === 70 && uint8[3] === 70 && uint8[8] === 87 && uint8[9] === 69 && uint8[10] === 66 && uint8[11] === 80) {
		if (uint8[12] === 86 && uint8[13] === 80 && uint8[14] === 56) {
			if (uint8[15] === 32) return {
				width: (uint8[26] | uint8[27] << 8) & 16383,
				height: (uint8[28] | uint8[29] << 8) & 16383,
				type: "webp"
			};
			if (uint8[15] === 76) {
				const bits = uint8[21] | uint8[22] << 8 | uint8[23] << 16 | uint8[24] << 24;
				return {
					width: (bits & 16383) + 1,
					height: (bits >> 14 & 16383) + 1,
					type: "webp"
				};
			}
		}
		return {
			width: 100,
			height: 100,
			type: "webp"
		};
	}
	return {
		width: 100,
		height: 100,
		type: "unknown"
	};
}
//#endregion
//#region src/utils/image-to-base64.ts
const toBase64 = (bytes) => {
	if (typeof Buffer !== "undefined") return Buffer.from(bytes).toString("base64");
	let binary = "";
	for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
	return globalThis.btoa(binary);
};
const logVerbose = (enabled, message, ...args) => {
	if (enabled) console.log(message, ...args);
};
const guessMimeTypeFromBytes = (bytes) => {
	if (bytes.length >= 4) {
		if (bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) return "image/jpeg";
		if (bytes[0] === 137 && bytes[1] === 80 && bytes[2] === 78 && bytes[3] === 71) return "image/png";
		if (bytes[0] === 71 && bytes[1] === 73 && bytes[2] === 70) return "image/gif";
		if (bytes[0] === 82 && bytes[1] === 73 && bytes[2] === 70 && bytes[3] === 70 && bytes.length >= 12 && bytes[8] === 87 && bytes[9] === 69 && bytes[10] === 66 && bytes[11] === 80) return "image/webp";
		if (bytes[0] === 66 && bytes[1] === 77) return "image/bmp";
	}
	const asText = typeof Buffer !== "undefined" ? Buffer.from(bytes.subarray(0, 256)).toString("utf-8") : new TextDecoder().decode(bytes.subarray(0, 256));
	if (/^\s*<svg[\s>]/i.test(asText)) return "image/svg+xml";
	return "image/jpeg";
};
const downloadImage = async (imageUrl, { timeout = 5e3, maxSize = 10 * 1024 * 1024 } = {}) => {
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), timeout);
	try {
		const response = await fetch(imageUrl, { signal: controller.signal });
		if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		const arrayBuffer = await response.arrayBuffer();
		const bytes = new Uint8Array(arrayBuffer);
		if (!bytes.length) throw new Error("Empty image response");
		if (bytes.length > maxSize) throw new Error(`Image exceeds max size (${bytes.length} > ${maxSize})`);
		const mimeType = response.headers.get("content-type")?.split(";")[0]?.trim() || guessMimeTypeFromBytes(bytes);
		return {
			base64: toBase64(bytes),
			mimeType
		};
	} catch (error) {
		if (error instanceof Error && error.name === "AbortError") throw new Error(`Request timeout after ${timeout}ms`, { cause: error });
		throw error;
	} finally {
		clearTimeout(timeoutId);
	}
};
function parseDataUrl(dataUrl) {
	const match = dataUrl.match(/^data:([A-Za-z-+./]+);base64,(.+)$/);
	if (!match || match.length !== 3) return null;
	return {
		mimeType: match[1],
		base64: match[2]
	};
}
const sleep = async (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const downloadAndCacheImage = async (docxDocumentInstance, imageSource, options = {}) => {
	const maxRetries = options.maxRetries ?? docxDocumentInstance.imageProcessing?.maxRetries ?? defaultDocumentOptions.imageProcessing.maxRetries;
	const verboseLogging = options.verboseLogging ?? docxDocumentInstance.imageProcessing?.verboseLogging ?? defaultDocumentOptions.imageProcessing.verboseLogging;
	if (!docxDocumentInstance._imageCache) docxDocumentInstance._imageCache = /* @__PURE__ */ new Map();
	if (!docxDocumentInstance._retryStats) docxDocumentInstance._retryStats = {
		totalAttempts: 0,
		successAfterRetry: 0,
		finalFailures: 0
	};
	if (docxDocumentInstance._imageCache.has(imageSource)) {
		const cached = docxDocumentInstance._imageCache.get(imageSource);
		if (!cached || cached === "FAILED") {
			logVerbose(verboseLogging, `[CACHE] Skipping previously failed image in this document: ${imageSource}`);
			return null;
		}
		logVerbose(verboseLogging, `[CACHE] Using cached image data for: ${imageSource}`);
		return cached;
	}
	let lastError = null;
	for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
		docxDocumentInstance._retryStats.totalAttempts += 1;
		try {
			const timeoutMs = (options.downloadTimeout ?? docxDocumentInstance.imageProcessing?.downloadTimeout ?? defaultDocumentOptions.imageProcessing.downloadTimeout) * attempt;
			const maxSize = options.maxImageSize ?? docxDocumentInstance.imageProcessing?.maxImageSize ?? defaultDocumentOptions.imageProcessing.maxImageSize;
			logVerbose(verboseLogging, `[RETRY] Attempt ${attempt}/${maxRetries} for: ${imageSource}`);
			const { base64, mimeType } = await downloadImage(imageSource, {
				timeout: timeoutMs,
				maxSize
			});
			if (mimeType === "image/webp") {
				docxDocumentInstance._imageCache.set(imageSource, "FAILED");
				return null;
			}
			if (attempt > 1) docxDocumentInstance._retryStats.successAfterRetry += 1;
			const dataUri = `data:${mimeType};base64,${base64}`;
			docxDocumentInstance._imageCache.set(imageSource, dataUri);
			return dataUri;
		} catch (error) {
			lastError = error;
			if (attempt < maxRetries) await sleep((options.retryDelayBase ?? docxDocumentInstance.imageProcessing?.retryDelayBase ?? defaultDocumentOptions.imageProcessing.retryDelayBase) * attempt);
		}
	}
	docxDocumentInstance._retryStats.finalFailures += 1;
	docxDocumentInstance._imageCache.set(imageSource, "FAILED");
	if (lastError) console.error(`[ERROR] downloadAndCacheImage: ${lastError.message} for ${imageSource}`);
	return null;
};
//#endregion
//#region src/utils/svg-sanitizer.ts
/**
* SVG Sanitizer - security-focused whitelist sanitizer for inline SVG content.
*/
const ALLOWED_ELEMENTS = new Set([
	"svg",
	"g",
	"defs",
	"symbol",
	"marker",
	"clipPath",
	"mask",
	"pattern",
	"circle",
	"ellipse",
	"line",
	"path",
	"polygon",
	"polyline",
	"rect",
	"text",
	"tspan",
	"textPath",
	"linearGradient",
	"radialGradient",
	"stop",
	"filter",
	"feBlend",
	"feColorMatrix",
	"feComponentTransfer",
	"feComposite",
	"feConvolveMatrix",
	"feDiffuseLighting",
	"feDisplacementMap",
	"feDistantLight",
	"feDropShadow",
	"feFlood",
	"feFuncA",
	"feFuncB",
	"feFuncG",
	"feFuncR",
	"feGaussianBlur",
	"feImage",
	"feMerge",
	"feMergeNode",
	"feMorphology",
	"feOffset",
	"fePointLight",
	"feSpecularLighting",
	"feSpotLight",
	"feTile",
	"feTurbulence",
	"image",
	"use",
	"title",
	"desc",
	"metadata",
	"switch",
	"a"
]);
const ALLOWED_ATTRIBUTES = new Set([
	"xmlns",
	"xmlns:xlink",
	"id",
	"class",
	"style",
	"tabindex",
	"width",
	"height",
	"x",
	"y",
	"x1",
	"y1",
	"x2",
	"y2",
	"cx",
	"cy",
	"r",
	"rx",
	"ry",
	"dx",
	"dy",
	"viewBox",
	"preserveAspectRatio",
	"d",
	"points",
	"pathLength",
	"transform",
	"fill",
	"fill-opacity",
	"fill-rule",
	"stroke",
	"stroke-width",
	"stroke-opacity",
	"stroke-linecap",
	"stroke-linejoin",
	"stroke-miterlimit",
	"stroke-dasharray",
	"stroke-dashoffset",
	"opacity",
	"visibility",
	"display",
	"overflow",
	"clip-path",
	"clip-rule",
	"mask",
	"filter",
	"font-family",
	"font-size",
	"font-weight",
	"font-style",
	"font-variant",
	"font-stretch",
	"text-anchor",
	"text-decoration",
	"text-rendering",
	"letter-spacing",
	"word-spacing",
	"writing-mode",
	"direction",
	"dominant-baseline",
	"alignment-baseline",
	"baseline-shift",
	"gradientUnits",
	"gradientTransform",
	"spreadMethod",
	"offset",
	"stop-color",
	"stop-opacity",
	"in",
	"in2",
	"result",
	"type",
	"values",
	"mode",
	"stdDeviation",
	"edgeMode",
	"kernelMatrix",
	"divisor",
	"bias",
	"targetX",
	"targetY",
	"surfaceScale",
	"specularConstant",
	"specularExponent",
	"diffuseConstant",
	"scale",
	"xChannelSelector",
	"yChannelSelector",
	"k1",
	"k2",
	"k3",
	"k4",
	"operator",
	"radius",
	"baseFrequency",
	"numOctaves",
	"seed",
	"stitchTiles",
	"order",
	"kernelUnitLength",
	"pointsAtX",
	"pointsAtY",
	"pointsAtZ",
	"limitingConeAngle",
	"z",
	"azimuth",
	"elevation",
	"href",
	"xlink:href",
	"target",
	"markerWidth",
	"markerHeight",
	"refX",
	"refY",
	"orient",
	"markerUnits",
	"patternUnits",
	"patternContentUnits",
	"patternTransform",
	"clipPathUnits",
	"maskUnits",
	"maskContentUnits"
]);
const DISALLOWED_ELEMENTS = new Set([
	"script",
	"foreignObject",
	"iframe",
	"embed",
	"object",
	"applet",
	"frame",
	"frameset"
]);
const DANGEROUS_ATTRIBUTES = /^on[a-z]/i;
const DANGEROUS_PROTOCOLS = /^\s*(javascript|data|vbscript|file|about):/i;
const hasDangerousProtocol = (value) => {
	if (!value || typeof value !== "string") return false;
	const trimmedValue = value.trim();
	if (trimmedValue.startsWith("#") || trimmedValue.startsWith("http://") || trimmedValue.startsWith("https://")) return false;
	return DANGEROUS_PROTOCOLS.test(trimmedValue);
};
const sanitizeSVGVNode = (vNode, options = {}) => {
	const { verboseLogging = false, enabled = true } = options;
	if (!enabled) return vNode;
	if (!vNode || !vNode.tagName) return null;
	const { tagName } = vNode;
	const lowerTagName = tagName.toLowerCase();
	if (DISALLOWED_ELEMENTS.has(lowerTagName)) {
		if (verboseLogging) console.warn(`[SVG SANITIZER] Blocked dangerous element: <${tagName}>`);
		return null;
	}
	if (!ALLOWED_ELEMENTS.has(tagName) && !ALLOWED_ELEMENTS.has(lowerTagName)) {
		if (verboseLogging) console.warn(`[SVG SANITIZER] Removed non-whitelisted element: <${tagName}>`);
		return null;
	}
	const sanitizedVNode = {
		...vNode,
		children: vNode.children ? [...vNode.children] : [],
		properties: vNode.properties ? { ...vNode.properties } : {}
	};
	if (vNode.properties) {
		const attributes = vNode.properties.attributes || {};
		const sanitizedAttributes = {};
		let removedCount = 0;
		Object.entries(attributes).forEach(([key, value]) => {
			const lowerKey = key.toLowerCase();
			if (DANGEROUS_ATTRIBUTES.test(lowerKey)) {
				if (verboseLogging) console.warn(`[SVG SANITIZER] Removed event handler: ${key}="${value}"`);
				removedCount += 1;
				return;
			}
			if ((lowerKey === "href" || lowerKey === "xlink:href") && hasDangerousProtocol(value)) {
				if (verboseLogging) console.warn(`[SVG SANITIZER] Blocked dangerous protocol in ${key}: ${value}`);
				removedCount += 1;
				return;
			}
			if (ALLOWED_ATTRIBUTES.has(lowerKey) || lowerKey.startsWith("data-") || lowerKey.startsWith("aria-")) sanitizedAttributes[key] = value;
			else {
				if (verboseLogging) console.warn(`[SVG SANITIZER] Removed non-whitelisted attribute: ${key}="${value}"`);
				removedCount += 1;
			}
		});
		sanitizedVNode.properties = {
			...sanitizedVNode.properties,
			attributes: sanitizedAttributes
		};
		if (removedCount > 0 && verboseLogging) console.log(`[SVG SANITIZER] Removed ${removedCount} unsafe attribute(s) from <${tagName}>`);
	}
	if (vNode.children && vNode.children.length > 0) {
		const sanitizedChildren = vNode.children.map((child) => {
			if (typeof child === "string" || typeof child === "object" && "text" in child) return child;
			return sanitizeSVGVNode(child, options);
		}).filter(Boolean);
		sanitizedVNode.children = sanitizedChildren;
		if (sanitizedChildren.length < vNode.children.length && verboseLogging) {
			const removed = vNode.children.length - sanitizedChildren.length;
			console.log(`[SVG SANITIZER] Removed ${removed} child element(s) from <${tagName}>`);
		}
	}
	return sanitizedVNode;
};
const validateSVGString = (svgString) => {
	const warnings = [];
	if (!svgString || typeof svgString !== "string") return {
		valid: false,
		warnings: ["Invalid or empty SVG string"]
	};
	if (/<script[\s>]/i.test(svgString)) warnings.push("Contains <script> tag");
	if (/\son[a-z]+\s*=/i.test(svgString)) warnings.push("Contains event handler attributes (onclick, onload, etc.)");
	if (/javascript:/i.test(svgString)) warnings.push("Contains javascript: protocol");
	if (/<foreignObject[\s>]/i.test(svgString)) warnings.push("Contains <foreignObject> element");
	if (/data:text\/html/i.test(svgString)) warnings.push("Contains data:text/html URI (potential XSS vector)");
	return {
		valid: warnings.length === 0,
		warnings
	};
};
//#endregion
//#region src/utils/vnode.ts
const vNodeHasChildren = (vNode) => Boolean(vNode?.children && Array.isArray(vNode.children) && vNode.children.length);
//#endregion
//#region src/tracking.ts
/**
* DOCX Tracked Changes and Comments Export Support
*
* This module provides token-based tracking for exporting Plate editor
* suggestions and comments to Word's tracked changes and comments format.
*
* Token Format:
* - Insertions: [[DOCX_INS_START:{payload}]] ... [[DOCX_INS_END:id]]
* - Deletions: [[DOCX_DEL_START:{payload}]] ... [[DOCX_DEL_END:id]]
* - Comments: [[DOCX_CMT_START:{payload}]] ... [[DOCX_CMT_END:id]]
*/
/** biome-ignore-all lint/style/useConsistentTypeDefinitions: legacy code */
/** Document-wide set of allocated hex IDs to ensure uniqueness (per R12). */
const allocatedIds = /* @__PURE__ */ new Set();
/** Reset allocated IDs between documents. */
function resetAllocatedIds() {
	allocatedIds.clear();
}
/** Generate a unique 8-char uppercase hex ID < 0x7FFFFFFF per OOXML spec. */
function generateHexId() {
	let id;
	do
		id = (Math.floor(Math.random() * 2147483646) + 1).toString(16).toUpperCase().padStart(8, "0");
	while (allocatedIds.has(id));
	allocatedIds.add(id);
	return id;
}
const DOCX_INSERTION_START_TOKEN_PREFIX = "[[DOCX_INS_START:";
const DOCX_INSERTION_END_TOKEN_PREFIX = "[[DOCX_INS_END:";
const DOCX_INSERTION_TOKEN_SUFFIX = "]]";
const DOCX_DELETION_START_TOKEN_PREFIX = "[[DOCX_DEL_START:";
const DOCX_DELETION_END_TOKEN_PREFIX = "[[DOCX_DEL_END:";
const DOCX_DELETION_TOKEN_SUFFIX = "]]";
const DOCX_COMMENT_START_TOKEN_PREFIX = "[[DOCX_CMT_START:";
const DOCX_COMMENT_END_TOKEN_PREFIX = "[[DOCX_CMT_END:";
const DOCX_COMMENT_TOKEN_SUFFIX = "]]";
/** Regex to match all DOCX tracking tokens */
const DOCX_TOKEN_REGEX = /\[\[DOCX_(INS|DEL|CMT)_(START|END):(.+?)\]\]/g;
/**
* Parse a single DOCX token into a structured object.
*/
function parseDocxToken(kind, position, rawPayload) {
	try {
		const decoded = decodeURIComponent(rawPayload);
		if (position === "END") {
			if (!decoded) return null;
			if (kind === "CMT") return {
				type: "commentEnd",
				id: decoded
			};
			if (kind === "DEL") return {
				type: "delEnd",
				id: decoded
			};
			return {
				type: "insEnd",
				id: decoded
			};
		}
		const data = JSON.parse(decoded);
		if (kind === "CMT") return {
			type: "commentStart",
			data
		};
		if (kind === "DEL") return {
			type: "delStart",
			data
		};
		return {
			type: "insStart",
			data
		};
	} catch {
		return null;
	}
}
/**
* Split text into an array of text segments and parsed tokens.
*/
function splitDocxTrackingTokens(text) {
	const parts = [];
	let lastIndex = 0;
	const tokenRegex = new RegExp(DOCX_TOKEN_REGEX);
	let match;
	while ((match = tokenRegex.exec(text)) !== null) {
		if (match.index > lastIndex) parts.push({
			type: "text",
			value: text.slice(lastIndex, match.index)
		});
		const token = parseDocxToken(match[1], match[2], match[3]);
		if (token) parts.push(token);
		else parts.push({
			type: "text",
			value: match[0]
		});
		lastIndex = match.index + match[0].length;
	}
	if (lastIndex < text.length) parts.push({
		type: "text",
		value: text.slice(lastIndex)
	});
	return parts;
}
/**
* Check if text contains any DOCX tracking tokens.
*/
function hasTrackingTokens(text) {
	return /\[\[DOCX_(INS|DEL|CMT)_(START|END):(.+?)\]\]/.test(text);
}
/**
* Collect all tracking token strings from text.
*/
function findDocxTrackingTokens(text) {
	const tokens = [];
	const tokenRegex = new RegExp(DOCX_TOKEN_REGEX);
	let match;
	while ((match = tokenRegex.exec(text)) !== null) tokens.push(match[0]);
	return tokens;
}
/**
* Ensure tracking state is initialized on the document instance.
*/
function ensureTrackingState(docxDocumentInstance) {
	if (!docxDocumentInstance._trackingState) docxDocumentInstance._trackingState = {
		suggestionStack: [],
		replyIdsByParent: /* @__PURE__ */ new Map()
	};
	return docxDocumentInstance._trackingState;
}
/**
* Build a text element for normal text.
*/
function buildTextElement(text) {
	return fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", "t").att("@xml", "space", "preserve").txt(text).up();
}
/**
* Build a deleted text element (w:delText) for deletions.
*/
function buildDeletedTextElement(text) {
	return fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", "delText").att("@xml", "space", "preserve").txt(text).up();
}
/**
* Build a comment range start marker.
*/
function buildCommentRangeStart(id) {
	return fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", "commentRangeStart").att("@w", "id", String(id)).up();
}
/**
* Build a comment range end marker.
*/
function buildCommentRangeEnd(id) {
	return fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", "commentRangeEnd").att("@w", "id", String(id)).up();
}
/**
* Build a comment reference run (appears after commentRangeEnd).
*/
function buildCommentReferenceRun(id) {
	return fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", "r").ele("@w", "commentReference").att("@w", "id", String(id)).up().up();
}
/**
* Wrap a run fragment with a suggestion (w:ins or w:del).
*/
function wrapRunWithSuggestion(runFragment, suggestion) {
	const tagName = suggestion.type === "remove" ? "del" : "ins";
	const wrapper = fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", tagName);
	wrapper.att("@w", "id", String(suggestion.revisionId));
	if (suggestion.author) wrapper.att("@w", "author", suggestion.author);
	if (suggestion.date) wrapper.att("@w", "date", suggestion.date);
	wrapper.import(runFragment);
	wrapper.up();
	return wrapper;
}
/**
* Build a suggestion start token string.
*/
function buildSuggestionStartToken(payload, type) {
	const encoded = encodeURIComponent(JSON.stringify(payload));
	return `${type === "remove" ? DOCX_DELETION_START_TOKEN_PREFIX : DOCX_INSERTION_START_TOKEN_PREFIX}${encoded}${type === "remove" ? "]]" : "]]"}`;
}
/**
* Build a suggestion end token string.
*/
function buildSuggestionEndToken(id, type) {
	return `${type === "remove" ? DOCX_DELETION_END_TOKEN_PREFIX : DOCX_INSERTION_END_TOKEN_PREFIX}${encodeURIComponent(id)}${type === "remove" ? "]]" : "]]"}`;
}
/**
* Build a comment start token string.
*/
function buildCommentStartToken(payload) {
	return `${DOCX_COMMENT_START_TOKEN_PREFIX}${encodeURIComponent(JSON.stringify(payload))}]]`;
}
/**
* Build a comment end token string.
*/
function buildCommentEndToken(id) {
	return `${DOCX_COMMENT_END_TOKEN_PREFIX}${encodeURIComponent(id)}]]`;
}
//#endregion
//#region src/utils/color-conversion.ts
const rgbRegex = /rgb\((\d+),\s*([\d.]+),\s*([\d.]+)\)/i;
const hslRegex = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/i;
const hexRegex = /#([0-9A-F]{6})/i;
const hex3Regex = /#([0-9A-F])([0-9A-F])([0-9A-F])/i;
const rgbToHex = (red, green, blue) => {
	return [
		red,
		green,
		blue
	].map((x) => {
		const hex = Number.parseInt(String(x), 10).toString(16);
		return hex.length === 1 ? `0${hex}` : hex;
	}).join("");
};
const hslToHex = (hue, saturation, luminosity) => {
	const h = hue / 360;
	const s = saturation / 100;
	const l = luminosity / 100;
	let red;
	let green;
	let blue;
	if (s === 0) red = green = blue = l;
	else {
		const hue2rgb = (p, q, t) => {
			let tNorm = t;
			if (tNorm < 0) tNorm += 1;
			if (tNorm > 1) tNorm -= 1;
			if (tNorm < 1 / 6) return p + (q - p) * 6 * tNorm;
			if (tNorm < 1 / 2) return q;
			if (tNorm < 2 / 3) return p + (q - p) * (2 / 3 - tNorm) * 6;
			return p;
		};
		const q = l < .5 ? l * (1 + s) : l + s - l * s;
		const p = 2 * l - q;
		red = hue2rgb(p, q, h + 1 / 3);
		green = hue2rgb(p, q, h);
		blue = hue2rgb(p, q, h - 1 / 3);
	}
	return [
		red,
		green,
		blue
	].map((x) => {
		const hex = Math.round(x * 255).toString(16);
		return hex.length === 1 ? `0${hex}` : hex;
	}).join("");
};
const hex3ToHex = (red, green, blue) => {
	return [
		red,
		green,
		blue
	].map((x) => `${x}${x}`).join("");
};
//#endregion
//#region src/utils/unit-conversion.ts
const pixelRegex = /([\d.]+)px/i;
const percentageRegex = /([\d.]+)%/i;
const pointRegex = /([\d.]+)pt/i;
const cmRegex = /([\d.]+)cm/i;
const inchRegex = /([\d.]+)in/i;
const pixelToEMU = (pixelValue) => Math.round(pixelValue * 9525);
const TWIPToEMU = (TWIPValue) => Math.round(TWIPValue * 635);
const EMUToTWIP = (EMUValue) => Math.round(EMUValue / 635);
const pointToTWIP = (pointValue) => Math.round(pointValue * 20);
const pointToHIP = (pointValue) => Math.round(pointValue * 2);
const HIPToPoint = (HIPValue) => Math.round(HIPValue / 2);
const HIPToTWIP = (HIPValue) => Math.round(HIPValue * 10);
const TWIPToHIP = (TWIPValue) => Math.round(TWIPValue / 10);
const pixelToTWIP = (pixelValue) => EMUToTWIP(pixelToEMU(pixelValue));
const pixelToHIP = (pixelValue) => TWIPToHIP(EMUToTWIP(pixelToEMU(pixelValue)));
const inchToPoint = (inchValue) => Math.round(inchValue * 72);
const inchToTWIP = (inchValue) => pointToTWIP(inchToPoint(inchValue));
const cmToInch = (cmValue) => cmValue * .3937008;
const cmToTWIP = (cmValue) => inchToTWIP(cmToInch(cmValue));
const pixelToPoint = (pixelValue) => HIPToPoint(pixelToHIP(pixelValue));
const pointToEIP = (PointValue) => Math.round(PointValue * 8);
const pixelToEIP = (pixelValue) => pointToEIP(pixelToPoint(pixelValue));
//#endregion
//#region src/helpers/xml-builder.ts
/** biome-ignore-all lint/style/useAtIndex: legacy code */
const base64ToUint8Array$1 = (base64) => {
	if (typeof Buffer !== "undefined") return Buffer.from(base64, "base64");
	const binaryString = globalThis.atob(base64);
	const bytes = new Uint8Array(binaryString.length);
	for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
	return bytes;
};
const fixupColorCode = (colorCodeString) => {
	if (Object.hasOwn(colorNames, colorCodeString.toLowerCase())) {
		const [red, green, blue] = colorNames[colorCodeString.toLowerCase()];
		return rgbToHex(red, green, blue);
	}
	if (rgbRegex.test(colorCodeString)) {
		const matchedParts = colorCodeString.match(rgbRegex);
		if (matchedParts) {
			const red = matchedParts[1];
			const green = matchedParts[2];
			const blue = matchedParts[3];
			return rgbToHex(Number.parseInt(red, 10), Number.parseInt(green, 10), Number.parseInt(blue, 10));
		}
	}
	if (hslRegex.test(colorCodeString)) {
		const matchedParts = colorCodeString.match(hslRegex);
		if (matchedParts) {
			const hue = matchedParts[1];
			const saturation = matchedParts[2];
			const luminosity = matchedParts[3];
			return hslToHex(Number.parseInt(hue, 10), Number.parseInt(saturation, 10), Number.parseInt(luminosity, 10));
		}
	}
	if (hexRegex.test(colorCodeString)) {
		const matchedParts = colorCodeString.match(hexRegex);
		if (matchedParts) return matchedParts[1];
	}
	if (hex3Regex.test(colorCodeString)) {
		const matchedParts = colorCodeString.match(hex3Regex);
		if (matchedParts) {
			const red = matchedParts[1];
			const green = matchedParts[2];
			const blue = matchedParts[3];
			return hex3ToHex(red, green, blue);
		}
	}
	return "000000";
};
const buildRunFontFragment = (fontName = defaultFont) => fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", "rFonts").att("@w", "ascii", fontName).att("@w", "hAnsi", fontName).up();
const buildRunStyleFragment = (type = "Hyperlink") => fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", "rStyle").att("@w", "val", type).up();
const buildTableRowHeight = (tableRowHeight) => fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", "trHeight").att("@w", "val", String(tableRowHeight)).att("@w", "hRule", "atLeast").up();
const buildVerticalAlignment = (verticalAlignment) => {
	if (verticalAlignment.toLowerCase() === "middle") verticalAlignment = "center";
	return fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", "vAlign").att("@w", "val", verticalAlignment).up();
};
const buildVerticalMerge = (verticalMerge = "continue") => fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", "vMerge").att("@w", "val", verticalMerge).up();
const buildColor = (colorCode) => fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", "color").att("@w", "val", colorCode).up();
const buildFontSize = (fontSize) => fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", "sz").att("@w", "val", String(fontSize)).up();
const buildShading = (colorCode) => fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", "shd").att("@w", "val", "clear").att("@w", "fill", colorCode).up();
const buildHighlight = (color = "yellow") => fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", "highlight").att("@w", "val", color).up();
const buildVertAlign = (type = "baseline") => fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", "vertAlign").att("@w", "val", type).up();
const buildStrike = () => fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", "strike").att("@w", "val", "true").up();
const buildBold = () => fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", "b").up();
const buildItalics = () => fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", "i").up();
const buildUnderline = (type = "single") => fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", "u").att("@w", "val", type).up();
const buildLineBreak = (type = "textWrapping") => fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", "br").att("@w", "type", type).up();
const buildBorder = (borderSide = "top", borderSize = 0, borderSpacing = 0, borderColor = fixupColorCode("black"), borderStroke = "single") => fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", borderSide).att("@w", "val", borderStroke).att("@w", "sz", String(borderSize)).att("@w", "space", String(borderSpacing)).att("@w", "color", borderColor).up();
const buildTextElement$1 = (text) => fragment({ namespaceAlias: {
	w: namespaces.w,
	xml: "http://www.w3.org/XML/1998/namespace"
} }).ele("@w", "t").att("@xml", "space", "preserve").txt(text).up();
/**
* Build a text run fragment with run properties.
* Used for building runs within tracked changes.
*/
const buildTextRunFragment = (text, attributes, options) => {
	const runFragment = fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", "r");
	const runPropertiesFragment = buildRunProperties(cloneDeep(attributes));
	runFragment.import(runPropertiesFragment);
	runFragment.import(options?.deleted ? buildDeletedTextElement(text) : buildTextElement$1(text));
	runFragment.up();
	return runFragment;
};
/**
* Build runs from text that may contain DOCX tracking tokens.
* Handles insertions, deletions, and comments by parsing tokens
* and generating appropriate XML structures.
*
* Returns null if text has no tracking tokens (use normal processing).
*/
const buildRunsFromTextWithTokens = (text, attributes, docxDocumentInstance) => {
	if (!docxDocumentInstance.ensureComment || !docxDocumentInstance.getCommentId || !docxDocumentInstance.getRevisionId) return null;
	const parts = splitDocxTrackingTokens(text);
	if (parts.length === 1 && parts[0].type === "text") return null;
	const fragments = [];
	const trackingState = ensureTrackingState(docxDocumentInstance);
	for (const part of parts) {
		if (part.type === "text") {
			if (!part.value) continue;
			const activeSuggestion = trackingState.suggestionStack[trackingState.suggestionStack.length - 1];
			const runFragment = buildTextRunFragment(part.value, attributes, { deleted: activeSuggestion?.type === "remove" });
			fragments.push(activeSuggestion ? wrapRunWithSuggestion(runFragment, activeSuggestion) : runFragment);
			continue;
		}
		if (part.type === "commentStart") {
			const data = part.data;
			const parentCommentId = docxDocumentInstance.ensureComment({
				id: data.id,
				authorName: data.authorName,
				authorInitials: data.authorInitials,
				date: data.date,
				paraId: data.paraId,
				text: data.text
			});
			fragments.push(buildCommentRangeStart(parentCommentId));
			if (data.replies && data.replies.length > 0 && docxDocumentInstance.comments && docxDocumentInstance.ensureComment) {
				const parentParaId = docxDocumentInstance.comments.find((c) => c.id === parentCommentId)?.paraId;
				data.replies.forEach((reply, idx) => {
					const replyId = reply.id ? `${data.id}-reply-${reply.id}` : `${data.id}-reply-${idx}`;
					const existingReplies = trackingState.replyIdsByParent.get(data.id) ?? [];
					if (!existingReplies.includes(replyId)) {
						existingReplies.push(replyId);
						trackingState.replyIdsByParent.set(data.id, existingReplies);
					}
					const replyCommentId = docxDocumentInstance.ensureComment({
						id: replyId,
						authorName: reply.authorName,
						authorInitials: reply.authorInitials,
						date: reply.date,
						paraId: reply.paraId,
						text: reply.text
					}, parentParaId);
					fragments.push(buildCommentRangeStart(replyCommentId));
				});
			}
			continue;
		}
		if (part.type === "commentEnd") {
			const commentId = docxDocumentInstance.getCommentId(part.id);
			fragments.push(buildCommentRangeEnd(commentId));
			fragments.push(buildCommentReferenceRun(commentId));
			const replyIds = [];
			const trackedReplies = trackingState.replyIdsByParent.get(part.id) || [];
			if (docxDocumentInstance.commentIdMap) {
				if (trackedReplies.length > 0) for (const replyKey of trackedReplies) {
					const numId = docxDocumentInstance.commentIdMap.get(replyKey);
					if (numId !== void 0) replyIds.push(numId);
				}
				else for (const [key, numId] of docxDocumentInstance.commentIdMap.entries()) if (key.startsWith(`${part.id}-reply-`)) replyIds.push(numId);
			}
			if (trackedReplies.length === 0) replyIds.sort((a, b) => a - b);
			for (const replyNumId of replyIds) {
				fragments.push(buildCommentRangeEnd(replyNumId));
				fragments.push(buildCommentReferenceRun(replyNumId));
			}
			continue;
		}
		if (part.type === "insStart" || part.type === "delStart") {
			const data = part.data;
			const revisionId = docxDocumentInstance.getRevisionId(data.id);
			const suggestionId = data.id || `suggestion-${revisionId}`;
			const suggestion = {
				id: suggestionId,
				type: part.type === "delStart" ? "remove" : "insert",
				author: data.author,
				date: data.date,
				revisionId
			};
			trackingState.suggestionStack = trackingState.suggestionStack.filter((item) => item.id !== suggestionId);
			trackingState.suggestionStack.push(suggestion);
			continue;
		}
		if (part.type === "insEnd" || part.type === "delEnd") trackingState.suggestionStack = trackingState.suggestionStack.filter((item) => item.id !== part.id);
	}
	return fragments;
};
const fixupLineHeight = (lineHeight, fontSize) => {
	if (Number.isNaN(lineHeight)) return 240;
	if (fontSize) return HIPToTWIP(+lineHeight * fontSize);
	return +lineHeight * 240;
};
const fixupFontSize$1 = (fontSizeString) => {
	if (pointRegex.test(fontSizeString)) {
		const matchedParts = fontSizeString.match(pointRegex);
		if (matchedParts) return pointToHIP(Number.parseFloat(matchedParts[1]));
	}
	if (pixelRegex.test(fontSizeString)) {
		const matchedParts = fontSizeString.match(pixelRegex);
		if (matchedParts) return pixelToHIP(Number.parseFloat(matchedParts[1]));
	}
};
const fixupRowHeight = (rowHeightString) => {
	if (pointRegex.test(rowHeightString)) {
		const matchedParts = rowHeightString.match(pointRegex);
		if (matchedParts) return pointToTWIP(Number.parseFloat(matchedParts[1]));
	}
	if (pixelRegex.test(rowHeightString)) {
		const matchedParts = rowHeightString.match(pixelRegex);
		if (matchedParts) return pixelToTWIP(Number.parseFloat(matchedParts[1]));
	}
	if (cmRegex.test(rowHeightString)) {
		const matchedParts = rowHeightString.match(cmRegex);
		if (matchedParts) return cmToTWIP(Number.parseFloat(matchedParts[1]));
	}
	if (inchRegex.test(rowHeightString)) {
		const matchedParts = rowHeightString.match(inchRegex);
		if (matchedParts) return inchToTWIP(Number.parseFloat(matchedParts[1]));
	}
};
const fixupColumnWidth = (columnWidthString) => {
	if (!columnWidthString) return null;
	if (pointRegex.test(columnWidthString)) {
		const matchedParts = columnWidthString.match(pointRegex);
		if (matchedParts) return {
			value: pointToTWIP(Number.parseFloat(matchedParts[1])),
			type: "dxa"
		};
	}
	if (pixelRegex.test(columnWidthString)) {
		const matchedParts = columnWidthString.match(pixelRegex);
		if (matchedParts) return {
			value: pixelToTWIP(Number.parseFloat(matchedParts[1])),
			type: "dxa"
		};
	}
	if (cmRegex.test(columnWidthString)) {
		const matchedParts = columnWidthString.match(cmRegex);
		if (matchedParts) return {
			value: cmToTWIP(Number.parseFloat(matchedParts[1])),
			type: "dxa"
		};
	}
	if (inchRegex.test(columnWidthString)) {
		const matchedParts = columnWidthString.match(inchRegex);
		if (matchedParts) return {
			value: inchToTWIP(Number.parseFloat(matchedParts[1])),
			type: "dxa"
		};
	}
	if (percentageRegex.test(columnWidthString)) {
		const matchedParts = columnWidthString.match(percentageRegex);
		if (matchedParts) return {
			value: Number.parseFloat(matchedParts[1]) * 50,
			type: "pct"
		};
	}
	return null;
};
const fixupMargin = (marginString) => {
	if (pointRegex.test(marginString)) {
		const matchedParts = marginString.match(pointRegex);
		if (matchedParts) return pointToTWIP(Number.parseFloat(matchedParts[1]));
	}
	if (pixelRegex.test(marginString)) {
		const matchedParts = marginString.match(pixelRegex);
		if (matchedParts) return pixelToTWIP(Number.parseFloat(matchedParts[1]));
	}
};
const modifiedStyleAttributesBuilder = (docxDocumentInstance, vNode, attributes, options) => {
	const modifiedAttributes = { ...attributes };
	if (isVNode(vNode) && vNode.properties && vNode.properties.style) {
		const style = vNode.properties.style;
		if (style.color && !colorlessColors.includes(style.color)) modifiedAttributes.color = fixupColorCode(style.color);
		const backgroundColor = style["background-color"] ?? style.backgroundColor;
		if (backgroundColor && !colorlessColors.includes(backgroundColor)) modifiedAttributes.backgroundColor = fixupColorCode(backgroundColor);
		if (style["vertical-align"] && verticalAlignValues.includes(style["vertical-align"])) modifiedAttributes.verticalAlign = style["vertical-align"];
		if (style["text-align"] && [
			"left",
			"right",
			"center",
			"justify"
		].includes(style["text-align"])) modifiedAttributes.textAlign = style["text-align"];
		if (style["font-weight"] && style["font-weight"] === "bold") modifiedAttributes.strong = style["font-weight"];
		if (style["font-family"] && docxDocumentInstance) modifiedAttributes.font = docxDocumentInstance.createFont(style["font-family"]);
		if (style["font-size"]) modifiedAttributes.fontSize = fixupFontSize$1(style["font-size"]);
		if (style["line-height"]) modifiedAttributes.lineHeight = fixupLineHeight(Number.parseFloat(style["line-height"]), style["font-size"] ? fixupFontSize$1(style["font-size"]) || null : null);
		if (style["margin-left"] || style["margin-right"]) {
			const leftMargin = style["margin-left"] ? fixupMargin(style["margin-left"]) : void 0;
			const rightMargin = style["margin-right"] ? fixupMargin(style["margin-right"]) : void 0;
			const indentation = {};
			if (leftMargin) indentation.left = leftMargin;
			if (rightMargin) indentation.right = rightMargin;
			if (leftMargin || rightMargin) modifiedAttributes.indentation = indentation;
		}
		if (style.display) modifiedAttributes.display = style.display;
		if (style.width) modifiedAttributes.width = style.width;
	}
	if (options?.isParagraph) {
		if (isVNode(vNode) && vNode.tagName === "blockquote") {
			modifiedAttributes.indentation = { left: 284 };
			modifiedAttributes.blockquoteBorder = true;
		} else if (isVNode(vNode) && vNode.tagName === "code") modifiedAttributes.highlightColor = "lightGray";
		else if (isVNode(vNode) && vNode.tagName === "pre") modifiedAttributes.font = "Courier";
	}
	return modifiedAttributes;
};
const buildFormatting = (htmlTag, options) => {
	switch (htmlTag) {
		case "strong":
		case "b": return buildBold();
		case "em":
		case "i": return buildItalics();
		case "ins":
		case "u": return buildUnderline();
		case "strike":
		case "del":
		case "s": return buildStrike();
		case "sub": return buildVertAlign("subscript");
		case "sup": return buildVertAlign("superscript");
		case "mark": return buildHighlight();
		case "code":
		case "kbd": return buildHighlight("lightGray");
		case "highlightColor": return buildHighlight(options?.color ? options.color : "lightGray");
		case "font": return buildRunFontFragment(options?.font);
		case "pre": return buildRunFontFragment("Courier");
		case "color": return buildColor(options?.color ? options.color : "black");
		case "backgroundColor": return buildShading(options?.color ? options.color : "black");
		case "fontSize": return buildFontSize(options?.fontSize ? options.fontSize : 10);
		case "hyperlink": return buildRunStyleFragment("Hyperlink");
	}
	return null;
};
const buildRunProperties = (attributes) => {
	const runPropertiesFragment = fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", "rPr");
	if (attributes && attributes.constructor === Object) Object.keys(attributes).forEach((key) => {
		const value = attributes[key];
		if (value === void 0) return;
		const options = {};
		if (key === "color" || key === "backgroundColor" || key === "highlightColor") options.color = value;
		if (key === "fontSize" || key === "font") options[key] = value;
		const formattingFragment = buildFormatting(key, options);
		if (formattingFragment) runPropertiesFragment.import(formattingFragment);
	});
	runPropertiesFragment.up();
	return runPropertiesFragment;
};
const buildRun = async (vNode, attributes, docxDocumentInstance) => {
	const runFragment = fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", "r");
	const runPropertiesFragment = buildRunProperties(cloneDeep(attributes));
	if (isVNode(vNode) && vNode.tagName === "span") return buildRunOrRuns(vNode, attributes, docxDocumentInstance);
	if (isVNode(vNode) && [
		"strong",
		"b",
		"em",
		"i",
		"u",
		"ins",
		"strike",
		"del",
		"s",
		"sub",
		"sup",
		"mark",
		"blockquote",
		"code",
		"kbd",
		"pre"
	].includes(vNode.tagName || "")) {
		const runFragmentsArray = [];
		let vNodes = [vNode];
		let tempAttributes = cloneDeep(attributes);
		let tempRunFragment = fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", "r");
		while (vNodes.length) {
			const tempVNode = vNodes.shift();
			if (isVText(tempVNode)) {
				const textContent = tempVNode.text;
				const mergedAttributes = {
					...attributes,
					...tempAttributes
				};
				if (docxDocumentInstance && hasTrackingTokens(textContent)) {
					const trackingFragments = buildRunsFromTextWithTokens(textContent, mergedAttributes, docxDocumentInstance);
					if (trackingFragments) {
						runFragmentsArray.push(...trackingFragments);
						tempAttributes = cloneDeep(attributes);
						tempRunFragment = fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", "r");
						continue;
					}
				}
				const textFragment = buildTextElement$1(textContent);
				const tempRunPropertiesFragment = buildRunProperties(mergedAttributes);
				tempRunFragment.import(tempRunPropertiesFragment);
				tempRunFragment.import(textFragment);
				runFragmentsArray.push(tempRunFragment);
				tempAttributes = cloneDeep(attributes);
				tempRunFragment = fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", "r");
			} else if (isVNode(tempVNode)) {
				const tempVn = tempVNode;
				if ([
					"strong",
					"b",
					"em",
					"i",
					"u",
					"ins",
					"strike",
					"del",
					"s",
					"sub",
					"sup",
					"mark",
					"code",
					"kbd",
					"pre"
				].includes(tempVn.tagName || "")) {
					tempAttributes = {};
					switch (tempVn.tagName) {
						case "strong":
						case "b":
							tempAttributes.strong = true;
							break;
						case "em":
						case "i":
							tempAttributes.i = true;
							break;
						case "ins":
						case "u":
							tempAttributes.u = true;
							break;
						case "strike":
						case "del":
						case "s":
							tempAttributes.strike = true;
							break;
						case "sub":
							tempAttributes.sub = true;
							break;
						case "sup":
							tempAttributes.sup = true;
							break;
						case "mark":
							tempAttributes.mark = true;
							break;
						case "code":
							tempAttributes.code = true;
							break;
						case "kbd":
							tempAttributes.kbd = true;
							break;
					}
					const formattingFragment = buildFormatting(tempVn.tagName || "");
					if (formattingFragment) runPropertiesFragment.import(formattingFragment);
				} else if (tempVn.tagName === "span") {
					const spanFragment = await buildRunOrRuns(tempVn, {
						...attributes,
						...tempAttributes
					}, docxDocumentInstance);
					if (Array.isArray(spanFragment)) {
						spanFragment.flat(Number.POSITIVE_INFINITY);
						runFragmentsArray.push(...spanFragment);
					} else runFragmentsArray.push(spanFragment);
					continue;
				}
			}
			const tempVn = tempVNode;
			if (tempVn.children?.length) {
				if (tempVn.children.length > 1) attributes = {
					...attributes,
					...tempAttributes
				};
				vNodes = tempVn.children.slice().concat(vNodes);
			}
		}
		if (runFragmentsArray.length) return runFragmentsArray;
	}
	runFragment.import(runPropertiesFragment);
	if (isVText(vNode)) {
		const textContent = vNode.text;
		if (docxDocumentInstance && hasTrackingTokens(textContent)) {
			const trackingFragments = buildRunsFromTextWithTokens(textContent, attributes, docxDocumentInstance);
			if (trackingFragments) return trackingFragments;
		}
		const textFragment = buildTextElement$1(textContent);
		runFragment.import(textFragment);
	} else if (attributes && attributes.type === "picture") {
		let response = null;
		const vn = vNode;
		let mediaSource = decodeURIComponent(vn.properties?.src || "");
		if (docxDocumentInstance && mediaSource && (mediaSource.startsWith("http://") || mediaSource.startsWith("https://"))) {
			const cachedImage = await downloadAndCacheImage(docxDocumentInstance, mediaSource, docxDocumentInstance.imageProcessing);
			if (!cachedImage) {
				runFragment.up();
				return runFragment;
			}
			mediaSource = cachedImage;
			if (vn.properties) vn.properties.src = mediaSource;
		}
		if (mediaSource && docxDocumentInstance) response = await docxDocumentInstance.createMediaFile(mediaSource);
		if (response && docxDocumentInstance) {
			docxDocumentInstance.zip.folder("word").folder("media").file(response.fileNameWithExtension, base64ToUint8Array$1(response.fileContent), { createFolders: false });
			const documentRelsId = docxDocumentInstance.createDocumentRelationships(docxDocumentInstance.relationshipFilename, imageType, `media/${response.fileNameWithExtension}`, internalRelationship);
			attributes.inlineOrAnchored = true;
			attributes.relationshipId = documentRelsId;
			attributes.id = response.id;
			attributes.fileContent = response.fileContent;
			attributes.fileNameWithExtension = response.fileNameWithExtension;
			attributes.isSVG = response.isSVG;
		}
		const { type, inlineOrAnchored, ...otherAttributes } = attributes;
		const imageFragment = buildDrawing(inlineOrAnchored || false, type || "picture", otherAttributes);
		runFragment.import(imageFragment);
	} else if (isVNode(vNode) && vNode.tagName === "br") {
		const lineBreakFragment = buildLineBreak();
		runFragment.import(lineBreakFragment);
	}
	runFragment.up();
	return runFragment;
};
const buildRunOrRuns = async (vNode, attributes, docxDocumentInstance) => {
	if (isVNode(vNode) && vNode.properties && vNode.properties.attributes && vNode.properties.attributes["data-equation-omml"]) {
		const ommlString = vNode.properties.attributes["data-equation-omml"];
		try {
			return fragment().ele(ommlString);
		} catch {
			console.warn("Failed to parse OMML, falling back to text");
		}
	}
	if (isVNode(vNode) && vNode.tagName === "span") {
		let runFragments = [];
		const vn = vNode;
		for (let index = 0; index < (vn.children || []).length; index++) {
			const childVNode = (vn.children || [])[index];
			const tempRunFragments = await buildRun(childVNode, modifiedStyleAttributesBuilder(docxDocumentInstance, vNode, attributes), docxDocumentInstance);
			runFragments = runFragments.concat(Array.isArray(tempRunFragments) ? tempRunFragments : [tempRunFragments]);
		}
		return runFragments;
	}
	return await buildRun(vNode, attributes, docxDocumentInstance);
};
const buildRunOrHyperLink = async (vNode, attributes, docxDocumentInstance) => {
	if (isVNode(vNode) && vNode.tagName === "a") {
		const vn = vNode;
		const href = vn.properties?.href ? vn.properties.href : "";
		const isInternalLink = href.startsWith("#");
		let hyperlinkFragment;
		if (isInternalLink) {
			const anchorName = href.substring(1);
			hyperlinkFragment = fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", "hyperlink").att("@w", "anchor", anchorName);
		} else {
			const relationshipId = docxDocumentInstance ? docxDocumentInstance.createDocumentRelationships(docxDocumentInstance.relationshipFilename, hyperlinkType, href) : 0;
			hyperlinkFragment = fragment({ namespaceAlias: {
				w: namespaces.w,
				r: namespaces.r
			} }).ele("@w", "hyperlink").att("@r", "id", `rId${relationshipId}`);
		}
		const modifiedAttributes = { ...attributes };
		modifiedAttributes.hyperlink = true;
		const runFragments = await buildRunOrRuns((vn.children || [])[0], modifiedAttributes, docxDocumentInstance);
		if (Array.isArray(runFragments)) for (let index = 0; index < runFragments.length; index++) {
			const runFragment = runFragments[index];
			hyperlinkFragment.import(runFragment);
		}
		else hyperlinkFragment.import(runFragments);
		hyperlinkFragment.up();
		return hyperlinkFragment;
	}
	return await buildRunOrRuns(vNode, attributes, docxDocumentInstance);
};
const buildNumberingProperties = (levelId, numberingId) => fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", "numPr").ele("@w", "ilvl").att("@w", "val", String(levelId)).up().ele("@w", "numId").att("@w", "val", String(numberingId)).up().up();
const buildSpacing = (lineSpacing, beforeSpacing, afterSpacing) => {
	const spacingFragment = fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", "spacing");
	if (lineSpacing) spacingFragment.att("@w", "line", String(lineSpacing));
	if (beforeSpacing) spacingFragment.att("@w", "before", String(beforeSpacing));
	if (afterSpacing) spacingFragment.att("@w", "after", String(afterSpacing));
	spacingFragment.att("@w", "lineRule", "auto").up();
	return spacingFragment;
};
const buildIndentation = ({ left, right }) => {
	const indentationFragment = fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", "ind");
	if (left) indentationFragment.att("@w", "left", String(left));
	if (right) indentationFragment.att("@w", "right", String(right));
	indentationFragment.up();
	return indentationFragment;
};
const buildPStyle = (style = "Normal") => fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", "pStyle").att("@w", "val", style).up();
const buildHorizontalAlignment = (horizontalAlignment) => {
	if (horizontalAlignment === "justify") horizontalAlignment = "both";
	return fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", "jc").att("@w", "val", horizontalAlignment).up();
};
const buildParagraphBorder = () => {
	const paragraphBorderFragment = fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", "pBdr");
	const bordersObject = cloneDeep(paragraphBordersObject);
	Object.keys(bordersObject).forEach((borderName) => {
		const border = bordersObject[borderName];
		if (border) {
			const { size, spacing, color } = border;
			const borderFragment = buildBorder(borderName, size, spacing, color);
			paragraphBorderFragment.import(borderFragment);
		}
	});
	paragraphBorderFragment.up();
	return paragraphBorderFragment;
};
const buildParagraphProperties = (attributes) => {
	const paragraphPropertiesFragment = fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", "pPr");
	if (attributes && attributes.constructor === Object) {
		if (attributes.paragraphStyle !== void 0) {
			const pStyleFragment = buildPStyle(attributes.paragraphStyle);
			paragraphPropertiesFragment.import(pStyleFragment);
			attributes.paragraphStyle = void 0;
		}
		if (attributes.numbering !== void 0) {
			const { levelId, numberingId } = attributes.numbering;
			const numberingPropertiesFragment = buildNumberingProperties(levelId, numberingId);
			paragraphPropertiesFragment.import(numberingPropertiesFragment);
			attributes.numbering = void 0;
		}
		if (attributes.blockquoteBorder !== void 0) {
			const borderFragment = fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", "pBdr").ele("@w", "left").att("@w", "val", "single").att("@w", "sz", "18").att("@w", "space", "4").att("@w", "color", "CCCCCC").up().up();
			paragraphPropertiesFragment.import(borderFragment);
			attributes.blockquoteBorder = void 0;
		} else if (attributes.backgroundColor !== void 0 && attributes.display === "block") {
			const paragraphBorderFragment = buildParagraphBorder();
			paragraphPropertiesFragment.import(paragraphBorderFragment);
		}
		if (attributes.backgroundColor !== void 0 && attributes.display === "block") {
			const shadingFragment = buildShading(attributes.backgroundColor);
			paragraphPropertiesFragment.import(shadingFragment);
			attributes.backgroundColor = void 0;
		}
		const spacingFragment = buildSpacing(attributes.lineHeight, attributes.beforeSpacing, attributes.afterSpacing);
		attributes.lineHeight = void 0;
		attributes.beforeSpacing = void 0;
		attributes.afterSpacing = void 0;
		paragraphPropertiesFragment.import(spacingFragment);
		if (attributes.indentation !== void 0) {
			const indentationFragment = buildIndentation(attributes.indentation);
			paragraphPropertiesFragment.import(indentationFragment);
			attributes.indentation = void 0;
		}
		if (attributes.textAlign !== void 0) {
			const horizontalAlignmentFragment = buildHorizontalAlignment(attributes.textAlign);
			paragraphPropertiesFragment.import(horizontalAlignmentFragment);
			attributes.textAlign = void 0;
		}
	}
	paragraphPropertiesFragment.up();
	return paragraphPropertiesFragment;
};
const computeImageDimensions = (vNode, attributes) => {
	const { maximumWidth, originalWidth, originalHeight } = attributes;
	if (!originalWidth || !originalHeight || !maximumWidth) return;
	const aspectRatio = originalWidth / originalHeight;
	const maximumWidthInEMU = TWIPToEMU(maximumWidth);
	let originalWidthInEMU = pixelToEMU(originalWidth);
	let originalHeightInEMU = pixelToEMU(originalHeight);
	if (originalWidthInEMU > maximumWidthInEMU) {
		originalWidthInEMU = maximumWidthInEMU;
		originalHeightInEMU = Math.round(originalWidthInEMU / aspectRatio);
	}
	let modifiedHeight;
	let modifiedWidth;
	const attributeWidth = vNode.properties?.attributes?.width ?? vNode.properties?.width;
	const attributeHeight = vNode.properties?.attributes?.height ?? vNode.properties?.height;
	if (attributeWidth !== void 0) {
		const parsedWidth = Number.parseFloat(String(attributeWidth));
		if (!Number.isNaN(parsedWidth) && parsedWidth > 0) modifiedWidth = pixelToEMU(parsedWidth);
	}
	if (attributeHeight !== void 0) {
		const parsedHeight = Number.parseFloat(String(attributeHeight));
		if (!Number.isNaN(parsedHeight) && parsedHeight > 0) modifiedHeight = pixelToEMU(parsedHeight);
	}
	if (vNode.properties?.style) {
		const style = vNode.properties.style;
		if (style.width) {
			if (style.width !== "auto") {
				if (pixelRegex.test(style.width)) {
					const match = style.width.match(pixelRegex);
					if (match) modifiedWidth = pixelToEMU(Number.parseFloat(match[1]));
				} else if (percentageRegex.test(style.width)) {
					const match = style.width.match(percentageRegex);
					if (match) {
						const percentageValue = Number.parseFloat(match[1]);
						modifiedWidth = Math.round(percentageValue / 100 * originalWidthInEMU);
					}
				}
			} else if (style.height && style.height === "auto") {
				modifiedWidth = originalWidthInEMU;
				modifiedHeight = originalHeightInEMU;
			}
		}
		if (style.height) if (style.height !== "auto") {
			if (pixelRegex.test(style.height)) {
				const match = style.height.match(pixelRegex);
				if (match) modifiedHeight = pixelToEMU(Number.parseFloat(match[1]));
			} else if (percentageRegex.test(style.height)) {
				const match = style.width?.match(percentageRegex);
				if (match) {
					const percentageValue = Number.parseFloat(match[1]);
					modifiedHeight = Math.round(percentageValue / 100 * originalHeightInEMU);
					if (!modifiedWidth) modifiedWidth = Math.round(modifiedHeight * aspectRatio);
				}
			}
		} else if (modifiedWidth) {
			if (!modifiedHeight) modifiedHeight = Math.round(modifiedWidth / aspectRatio);
		} else {
			modifiedHeight = originalHeightInEMU;
			modifiedWidth = originalWidthInEMU;
		}
		if (modifiedWidth && !modifiedHeight) modifiedHeight = Math.round(modifiedWidth / aspectRatio);
		else if (modifiedHeight && !modifiedWidth) modifiedWidth = Math.round(modifiedHeight * aspectRatio);
	} else if (!modifiedWidth && !modifiedHeight) {
		modifiedWidth = originalWidthInEMU;
		modifiedHeight = originalHeightInEMU;
	}
	if (modifiedWidth && !modifiedHeight) modifiedHeight = Math.round(modifiedWidth / aspectRatio);
	else if (modifiedHeight && !modifiedWidth) modifiedWidth = Math.round(modifiedHeight * aspectRatio);
	attributes.width = modifiedWidth;
	attributes.height = modifiedHeight;
};
let globalBookmarkIdCounter = 0;
const buildParagraph = async (vNode, attributes, docxDocumentInstance) => {
	const paragraphFragment = fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", "p");
	const modifiedAttributes = modifiedStyleAttributesBuilder(docxDocumentInstance, vNode, attributes, { isParagraph: true });
	const paragraphPropertiesFragment = buildParagraphProperties(modifiedAttributes);
	paragraphFragment.import(paragraphPropertiesFragment);
	const bookmarkId = attributes?.bookmarkId;
	let bookmarkNumericId = null;
	if (bookmarkId) {
		bookmarkNumericId = globalBookmarkIdCounter++;
		const bookmarkStartFragment = fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", "bookmarkStart").att("@w", "id", String(bookmarkNumericId)).att("@w", "name", bookmarkId).up();
		paragraphFragment.import(bookmarkStartFragment);
	}
	if (isVNode(vNode) && vNodeHasChildren(vNode)) {
		const vn = vNode;
		if ([
			"span",
			"strong",
			"b",
			"em",
			"i",
			"u",
			"ins",
			"strike",
			"del",
			"s",
			"sub",
			"sup",
			"mark",
			"a",
			"code",
			"pre"
		].includes(vn.tagName || "")) {
			const runOrHyperlinkFragments = await buildRunOrHyperLink(vNode, modifiedAttributes, docxDocumentInstance);
			if (Array.isArray(runOrHyperlinkFragments)) for (let iteratorIndex = 0; iteratorIndex < runOrHyperlinkFragments.length; iteratorIndex++) {
				const runOrHyperlinkFragment = runOrHyperlinkFragments[iteratorIndex];
				paragraphFragment.import(runOrHyperlinkFragment);
			}
			else paragraphFragment.import(runOrHyperlinkFragments);
		} else if (vn.tagName === "blockquote") {
			const runFragmentOrFragments = await buildRun(vNode, attributes);
			if (Array.isArray(runFragmentOrFragments)) for (let index = 0; index < runFragmentOrFragments.length; index++) paragraphFragment.import(runFragmentOrFragments[index]);
			else paragraphFragment.import(runFragmentOrFragments);
		} else for (let index = 0; index < (vn.children || []).length; index++) {
			const childVNode = (vn.children || [])[index];
			if (childVNode.tagName === "img") {
				const imageSource = childVNode.properties?.src;
				if (imageSource && (imageSource.includes(".webp") || imageSource.includes("image/webp"))) continue;
				let dataUri = imageSource ? decodeURIComponent(imageSource) : "";
				if (docxDocumentInstance && imageSource && (imageSource.startsWith("http://") || imageSource.startsWith("https://"))) {
					const cachedImage = await downloadAndCacheImage(docxDocumentInstance, imageSource, docxDocumentInstance.imageProcessing);
					if (!cachedImage) continue;
					dataUri = cachedImage;
				}
				const parsedDataUrl = parseDataUrl(dataUri);
				if (!parsedDataUrl) continue;
				if (childVNode.properties) childVNode.properties.src = dataUri;
				const imageProperties = getImageDimensions(base64ToUint8Array$1(parsedDataUrl.base64));
				modifiedAttributes.maximumWidth = modifiedAttributes.maximumWidth || docxDocumentInstance?.availableDocumentSpace;
				modifiedAttributes.originalWidth = imageProperties.width;
				modifiedAttributes.originalHeight = imageProperties.height;
				computeImageDimensions(childVNode, modifiedAttributes);
			}
			const runOrHyperlinkFragments = await buildRunOrHyperLink(childVNode, isVNode(childVNode) && childVNode.tagName === "img" ? {
				...modifiedAttributes,
				type: "picture",
				description: childVNode.properties?.alt
			} : modifiedAttributes, docxDocumentInstance);
			if (Array.isArray(runOrHyperlinkFragments)) for (let iteratorIndex = 0; iteratorIndex < runOrHyperlinkFragments.length; iteratorIndex++) {
				const runOrHyperlinkFragment = runOrHyperlinkFragments[iteratorIndex];
				paragraphFragment.import(runOrHyperlinkFragment);
			}
			else paragraphFragment.import(runOrHyperlinkFragments);
		}
	} else {
		if (isVNode(vNode) && vNode.tagName === "img") {
			const vn = vNode;
			const imageSource = vn.properties?.src;
			if (imageSource && (imageSource.includes(".webp") || imageSource.includes("image/webp"))) {
				paragraphFragment.up();
				return paragraphFragment;
			}
			let dataUri = imageSource ? decodeURIComponent(imageSource) : "";
			if (docxDocumentInstance && imageSource && (imageSource.startsWith("http://") || imageSource.startsWith("https://"))) {
				const cachedImage = await downloadAndCacheImage(docxDocumentInstance, imageSource, docxDocumentInstance.imageProcessing);
				if (!cachedImage) {
					paragraphFragment.up();
					return paragraphFragment;
				}
				dataUri = cachedImage;
			}
			const parsedDataUrl = parseDataUrl(dataUri);
			if (parsedDataUrl) {
				if (vn.properties) vn.properties.src = dataUri;
				const imageProperties = getImageDimensions(base64ToUint8Array$1(parsedDataUrl.base64));
				modifiedAttributes.maximumWidth = modifiedAttributes.maximumWidth || docxDocumentInstance?.availableDocumentSpace;
				modifiedAttributes.originalWidth = imageProperties.width;
				modifiedAttributes.originalHeight = imageProperties.height;
				computeImageDimensions(vn, modifiedAttributes);
			}
		}
		const runFragments = await buildRunOrRuns(vNode, modifiedAttributes, docxDocumentInstance);
		if (Array.isArray(runFragments)) for (let index = 0; index < runFragments.length; index++) {
			const runFragment = runFragments[index];
			paragraphFragment.import(runFragment);
		}
		else paragraphFragment.import(runFragments);
	}
	if (bookmarkId && bookmarkNumericId !== null) {
		const bookmarkEndFragment = fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", "bookmarkEnd").att("@w", "id", String(bookmarkNumericId)).up();
		paragraphFragment.import(bookmarkEndFragment);
	}
	paragraphFragment.up();
	return paragraphFragment;
};
const buildGridSpanFragment = (spanValue) => fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", "gridSpan").att("@w", "val", String(spanValue)).up();
const buildTableCellSpacing = (cellSpacing = 0) => fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", "tblCellSpacing").att("@w", "w", String(cellSpacing)).att("@w", "type", "dxa").up();
const tcBorderOrder = [
	"top",
	"left",
	"bottom",
	"right"
];
const buildTableCellBorders = (tableCellBorder) => {
	const tableCellBordersFragment = fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", "tcBorders");
	const { color, stroke } = tableCellBorder;
	const borderValues = {
		top: tableCellBorder.top,
		left: tableCellBorder.left,
		bottom: tableCellBorder.bottom,
		right: tableCellBorder.right
	};
	for (const border of tcBorderOrder) {
		const borderValue = borderValues[border];
		if (borderValue !== void 0 && borderValue > 0) {
			const borderFragment = buildBorder(borderNameMap[border] || border, borderValue, 0, color, stroke);
			tableCellBordersFragment.import(borderFragment);
		}
	}
	tableCellBordersFragment.up();
	return tableCellBordersFragment;
};
const buildTableCellWidth = (tableCellWidth) => {
	const widthInfo = fixupColumnWidth(tableCellWidth);
	if (!widthInfo) return null;
	return fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", "tcW").att("@w", "w", String(widthInfo.value)).att("@w", "type", widthInfo.type).up();
};
const buildTableCellProperties = (attributes) => {
	const tableCellPropertiesFragment = fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", "tcPr");
	if (attributes && attributes.constructor === Object) {
		if (attributes.width !== void 0) {
			const widthFragment = buildTableCellWidth(attributes.width != null ? String(attributes.width) : void 0);
			if (widthFragment) tableCellPropertiesFragment.import(widthFragment);
			attributes.width = void 0;
		}
		if (attributes.colSpan !== void 0) {
			const gridSpanFragment = buildGridSpanFragment(attributes.colSpan);
			tableCellPropertiesFragment.import(gridSpanFragment);
			attributes.colSpan = void 0;
		}
		if (attributes.rowSpan !== void 0) {
			const verticalMergeFragment = buildVerticalMerge(attributes.rowSpan);
			tableCellPropertiesFragment.import(verticalMergeFragment);
			attributes.rowSpan = void 0;
		}
		if (attributes.tableCellBorder !== void 0) {
			const border = attributes.tableCellBorder;
			if (Object.entries(border).some(([k, v]) => k !== "color" && k !== "stroke" && typeof v === "number" && v > 0)) {
				const tableCellBorderFragment = buildTableCellBorders(border);
				tableCellPropertiesFragment.import(tableCellBorderFragment);
			}
			attributes.tableCellBorder = void 0;
		}
		if (attributes.backgroundColor !== void 0) {
			const shadingFragment = buildShading(attributes.backgroundColor);
			tableCellPropertiesFragment.import(shadingFragment);
			attributes.backgroundColor = void 0;
		}
		if (attributes.verticalAlign !== void 0) {
			const verticalAlignmentFragment = buildVerticalAlignment(attributes.verticalAlign);
			tableCellPropertiesFragment.import(verticalAlignmentFragment);
			attributes.verticalAlign = void 0;
		}
	}
	tableCellPropertiesFragment.up();
	return tableCellPropertiesFragment;
};
const fixupTableCellBorder = (vNode, attributes) => {
	const style = vNode.properties?.style;
	if (!style) return;
	if (Object.hasOwn(style, "border")) if (style.border === "none" || style.border === "0") attributes.tableCellBorder = {};
	else {
		const [borderSize, borderStroke, borderColor] = cssBorderParser(style.border);
		attributes.tableCellBorder = {
			top: borderSize,
			left: borderSize,
			bottom: borderSize,
			right: borderSize,
			color: borderColor,
			stroke: borderStroke
		};
	}
	if (style["border-top"] && style["border-top"] === "0") attributes.tableCellBorder = {
		...attributes.tableCellBorder,
		top: 0
	};
	else if (style["border-top"] && style["border-top"] !== "0") {
		const [borderSize, borderStroke, borderColor] = cssBorderParser(style["border-top"]);
		attributes.tableCellBorder = {
			...attributes.tableCellBorder,
			top: borderSize,
			color: borderColor,
			stroke: borderStroke
		};
	}
	if (style["border-left"] && style["border-left"] === "0") attributes.tableCellBorder = {
		...attributes.tableCellBorder,
		left: 0
	};
	else if (style["border-left"] && style["border-left"] !== "0") {
		const [borderSize, borderStroke, borderColor] = cssBorderParser(style["border-left"]);
		attributes.tableCellBorder = {
			...attributes.tableCellBorder,
			left: borderSize,
			color: borderColor,
			stroke: borderStroke
		};
	}
	if (style["border-bottom"] && style["border-bottom"] === "0") attributes.tableCellBorder = {
		...attributes.tableCellBorder,
		bottom: 0
	};
	else if (style["border-bottom"] && style["border-bottom"] !== "0") {
		const [borderSize, borderStroke, borderColor] = cssBorderParser(style["border-bottom"]);
		attributes.tableCellBorder = {
			...attributes.tableCellBorder,
			bottom: borderSize,
			color: borderColor,
			stroke: borderStroke
		};
	}
	if (style["border-right"] && style["border-right"] === "0") attributes.tableCellBorder = {
		...attributes.tableCellBorder,
		right: 0
	};
	else if (style["border-right"] && style["border-right"] !== "0") {
		const [borderSize, borderStroke, borderColor] = cssBorderParser(style["border-right"]);
		attributes.tableCellBorder = {
			...attributes.tableCellBorder,
			right: borderSize,
			color: borderColor,
			stroke: borderStroke
		};
	}
};
const buildTableCell = async (vNode, attributes, rowSpanMap, columnIndex, docxDocumentInstance) => {
	const tableCellFragment = fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", "tc");
	let modifiedAttributes = { ...attributes };
	if (isVNode(vNode) && vNode.properties) {
		const vn = vNode;
		if (vn.properties?.rowSpan) {
			rowSpanMap.set(columnIndex.index, {
				rowSpan: vn.properties.rowSpan - 1,
				colSpan: 0
			});
			modifiedAttributes.rowSpan = "restart";
		} else {
			const previousSpanObject = rowSpanMap.get(columnIndex.index);
			rowSpanMap.set(columnIndex.index, {
				...previousSpanObject,
				rowSpan: 0,
				colSpan: previousSpanObject?.colSpan || 0
			});
		}
		if (vn.properties?.colSpan || vn.properties?.style?.["column-span"]) {
			modifiedAttributes.colSpan = vn.properties?.colSpan || Number.parseInt(vn.properties?.style?.["column-span"] || "0", 10);
			const previousSpanObject = rowSpanMap.get(columnIndex.index);
			rowSpanMap.set(columnIndex.index, {
				...previousSpanObject,
				colSpan: Number.parseInt(String(modifiedAttributes.colSpan), 10) || 0,
				rowSpan: previousSpanObject?.rowSpan || 0
			});
			columnIndex.index += Number.parseInt(String(modifiedAttributes.colSpan), 10) - 1;
		}
		if (vn.properties?.style) {
			modifiedAttributes = {
				...modifiedAttributes,
				...modifiedStyleAttributesBuilder(docxDocumentInstance, vNode, attributes)
			};
			fixupTableCellBorder(vn, modifiedAttributes);
		}
	}
	const tableCellPropertiesFragment = buildTableCellProperties(modifiedAttributes);
	tableCellFragment.import(tableCellPropertiesFragment);
	const paragraphAttributes = { ...modifiedAttributes };
	paragraphAttributes.backgroundColor = void 0;
	if (vNodeHasChildren(vNode)) {
		const vn = vNode;
		for (let index = 0; index < (vn.children || []).length; index++) {
			const childVNode = (vn.children || [])[index];
			if (isVNode(childVNode) && childVNode.tagName === "img") {
				const imageFragment = await buildImage(docxDocumentInstance, childVNode, modifiedAttributes.maximumWidth || null);
				if (imageFragment) tableCellFragment.import(imageFragment);
			} else if (isVNode(childVNode) && childVNode.tagName === "figure") {
				const figureVn = childVNode;
				if (vNodeHasChildren(figureVn)) for (let iteratorIndex = 0; iteratorIndex < (figureVn.children || []).length; iteratorIndex++) {
					const grandChildVNode = (figureVn.children || [])[iteratorIndex];
					if (grandChildVNode.tagName === "img") {
						const imageFragment = await buildImage(docxDocumentInstance, grandChildVNode, modifiedAttributes.maximumWidth || null);
						if (imageFragment) tableCellFragment.import(imageFragment);
					}
				}
			} else if (isVNode(childVNode) && ["ul", "ol"].includes(childVNode.tagName || "")) {
				const listVn = childVNode;
				if (vNodeHasChildren(listVn)) await buildList(listVn, docxDocumentInstance, tableCellFragment);
			} else if (isVNode(childVNode) && childVNode.tagName === "div") {
				const divVn = childVNode;
				if (vNodeHasChildren(divVn)) for (let divIndex = 0; divIndex < (divVn.children || []).length; divIndex++) {
					const divChild = (divVn.children || [])[divIndex];
					if (isVNode(divChild) && divChild.tagName === "img") {
						const imageFragment = await buildImage(docxDocumentInstance, divChild, modifiedAttributes.maximumWidth || null);
						if (imageFragment) tableCellFragment.import(imageFragment);
					} else if (isVNode(divChild) && ["ul", "ol"].includes(divChild.tagName || "")) {
						const listVn = divChild;
						if (vNodeHasChildren(listVn)) await buildList(listVn, docxDocumentInstance, tableCellFragment);
					} else {
						const paragraphFragment = await buildParagraph(divChild, paragraphAttributes, docxDocumentInstance);
						tableCellFragment.import(paragraphFragment);
					}
				}
			} else {
				const paragraphFragment = await buildParagraph(childVNode, paragraphAttributes, docxDocumentInstance);
				tableCellFragment.import(paragraphFragment);
			}
		}
	} else {
		const paragraphFragment = fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", "p").up();
		tableCellFragment.import(paragraphFragment);
	}
	tableCellFragment.up();
	return tableCellFragment;
};
const buildRowSpanCell = (rowSpanMap, columnIndex, attributes) => {
	const rowSpanCellFragments = [];
	let spanObject = rowSpanMap.get(columnIndex.index);
	while (spanObject?.rowSpan) {
		const rowSpanCellFragment = fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", "tc");
		const tableCellPropertiesFragment = buildTableCellProperties({
			...attributes,
			rowSpan: "continue",
			colSpan: spanObject.colSpan ? spanObject.colSpan : 0
		});
		rowSpanCellFragment.import(tableCellPropertiesFragment);
		const paragraphFragment = fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", "p").up();
		rowSpanCellFragment.import(paragraphFragment);
		rowSpanCellFragment.up();
		rowSpanCellFragments.push(rowSpanCellFragment);
		if (spanObject.rowSpan - 1 === 0) rowSpanMap.delete(columnIndex.index);
		else rowSpanMap.set(columnIndex.index, {
			rowSpan: spanObject.rowSpan - 1,
			colSpan: spanObject.colSpan || 0
		});
		columnIndex.index += spanObject.colSpan || 1;
		spanObject = rowSpanMap.get(columnIndex.index);
	}
	return rowSpanCellFragments;
};
const buildTableRowProperties = (attributes) => {
	const tableRowPropertiesFragment = fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", "trPr");
	if (attributes && attributes.constructor === Object) Object.keys(attributes).forEach((key) => {
		switch (key) {
			case "tableRowHeight":
				if (attributes[key] != null) {
					const tableRowHeightFragment = buildTableRowHeight(attributes[key]);
					tableRowPropertiesFragment.import(tableRowHeightFragment);
				}
				attributes.tableRowHeight = void 0;
				break;
			case "rowCantSplit":
				if (attributes.rowCantSplit) {
					const cantSplitFragment = fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", "cantSplit").up();
					tableRowPropertiesFragment.import(cantSplitFragment);
					attributes.rowCantSplit = void 0;
				}
				break;
		}
	});
	tableRowPropertiesFragment.up();
	return tableRowPropertiesFragment;
};
const buildTableRow = async (vNode, attributes, rowSpanMap, docxDocumentInstance) => {
	const tableRowFragment = fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", "tr");
	const modifiedAttributes = { ...attributes };
	if (isVNode(vNode) && vNode.properties) {
		const firstChild = (vNode.children || [])[0];
		if (vNode.properties.style?.height || firstChild && isVNode(firstChild) && firstChild.properties?.style && firstChild.properties.style.height) {
			const heightValue = vNode.properties.style?.height || (firstChild && isVNode(firstChild) && firstChild.properties?.style && firstChild.properties.style.height ? firstChild.properties.style.height : void 0);
			if (heightValue) modifiedAttributes.tableRowHeight = fixupRowHeight(heightValue);
		}
		if (vNode.properties.style) fixupTableCellBorder(vNode, modifiedAttributes);
	}
	const tableRowPropertiesFragment = buildTableRowProperties(modifiedAttributes);
	tableRowFragment.import(tableRowPropertiesFragment);
	const columnIndex = { index: 0 };
	if (vNodeHasChildren(vNode)) {
		const tableColumns = (vNode.children || []).filter((childVNode) => ["td", "th"].includes(childVNode.tagName || ""));
		const maximumColumnWidth = docxDocumentInstance.availableDocumentSpace / tableColumns.length;
		for (const column of tableColumns) {
			const rowSpanCellFragments = buildRowSpanCell(rowSpanMap, columnIndex, modifiedAttributes);
			if (Array.isArray(rowSpanCellFragments)) for (let iteratorIndex = 0; iteratorIndex < rowSpanCellFragments.length; iteratorIndex++) {
				const rowSpanCellFragment = rowSpanCellFragments[iteratorIndex];
				tableRowFragment.import(rowSpanCellFragment);
			}
			const tableCellFragment = await buildTableCell(column, {
				...modifiedAttributes,
				maximumWidth: maximumColumnWidth
			}, rowSpanMap, columnIndex, docxDocumentInstance);
			columnIndex.index++;
			tableRowFragment.import(tableCellFragment);
		}
	}
	if (columnIndex.index < rowSpanMap.size) {
		const rowSpanCellFragments = buildRowSpanCell(rowSpanMap, columnIndex, modifiedAttributes);
		if (Array.isArray(rowSpanCellFragments)) for (let iteratorIndex = 0; iteratorIndex < rowSpanCellFragments.length; iteratorIndex++) {
			const rowSpanCellFragment = rowSpanCellFragments[iteratorIndex];
			tableRowFragment.import(rowSpanCellFragment);
		}
	}
	tableRowFragment.up();
	return tableRowFragment;
};
const buildTableGridCol = (gridWidth) => fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", "gridCol").att("@w", "w", String(gridWidth));
const buildTableGrid = (vNode, attributes) => {
	const tableGridFragment = fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", "tblGrid");
	if (vNodeHasChildren(vNode)) {
		const gridColumns = (vNode.children || []).filter((childVNode) => childVNode.tagName === "col");
		const gridWidth = (attributes.maximumWidth || 0) / gridColumns.length;
		for (let index = 0; index < gridColumns.length; index++) {
			const tableGridColFragment = buildTableGridCol(gridWidth);
			tableGridFragment.import(tableGridColFragment);
		}
	}
	tableGridFragment.up();
	return tableGridFragment;
};
const buildTableGridFromTableRow = (vNode, attributes) => {
	const tableGridFragment = fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", "tblGrid");
	if (vNodeHasChildren(vNode)) {
		const numberOfGridColumns = (vNode.children || []).reduce((accumulator, childVNode) => {
			const child = childVNode;
			const colSpan = child.properties?.colSpan || child.properties?.style?.["column-span"];
			return accumulator + (colSpan ? Number.parseInt(String(colSpan), 10) : 1);
		}, 0);
		const gridWidth = (attributes.maximumWidth || 0) / numberOfGridColumns;
		for (let index = 0; index < numberOfGridColumns; index++) {
			const tableGridColFragment = buildTableGridCol(gridWidth);
			tableGridFragment.import(tableGridColFragment);
		}
	}
	tableGridFragment.up();
	return tableGridFragment;
};
const borderNameMap = {
	left: "start",
	right: "end"
};
const tblBorderOrder = [
	"top",
	"left",
	"bottom",
	"right",
	"insideH",
	"insideV"
];
const buildTableBorders = (tableBorder) => {
	const tableBordersFragment = fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", "tblBorders");
	const { color, stroke, ...borders } = tableBorder;
	const borderValues = {
		top: borders.top,
		left: borders.left,
		bottom: borders.bottom,
		right: borders.right,
		insideH: borders.insideH,
		insideV: borders.insideV
	};
	for (const border of tblBorderOrder) {
		const borderValue = borderValues[border];
		if (borderValue !== void 0 && borderValue > 0) {
			const borderFragment = buildBorder(borderNameMap[border] || border, borderValue, 0, color, stroke);
			tableBordersFragment.import(borderFragment);
		}
	}
	tableBordersFragment.up();
	return tableBordersFragment;
};
const buildTableWidth = (tableWidth) => fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", "tblW").att("@w", "type", "dxa").att("@w", "w", String(tableWidth)).up();
const buildCellMargin = (side, margin) => fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", side).att("@w", "type", "dxa").att("@w", "w", String(margin)).up();
const buildTableCellMargins = (margin) => {
	const tableCellMarFragment = fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", "tblCellMar");
	const sides = [
		["top", margin / 2],
		["start", margin],
		["bottom", margin / 2],
		["end", margin]
	];
	for (const [side, value] of sides) {
		const marginFragment = buildCellMargin(side, value);
		tableCellMarFragment.import(marginFragment);
	}
	return tableCellMarFragment;
};
const buildTableProperties = (attributes) => {
	const tablePropertiesFragment = fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", "tblPr");
	if (attributes && attributes.constructor === Object) {
		if (attributes.width) {
			const tableWidthFragment = buildTableWidth(attributes.width);
			tablePropertiesFragment.import(tableWidthFragment);
			attributes.width = void 0;
		}
		const alignmentFragment = buildHorizontalAlignment("center");
		tablePropertiesFragment.import(alignmentFragment);
		if (attributes.tableCellSpacing !== void 0) {
			const tableCellSpacingFragment = buildTableCellSpacing(attributes.tableCellSpacing);
			tablePropertiesFragment.import(tableCellSpacingFragment);
			attributes.tableCellSpacing = void 0;
		}
		if (attributes.tableBorder) {
			const border = attributes.tableBorder;
			if (Object.entries(border).some(([k, v]) => k !== "color" && k !== "stroke" && v && v > 0)) {
				const tableBordersFragment = buildTableBorders(border);
				tablePropertiesFragment.import(tableBordersFragment);
			}
			attributes.tableBorder = void 0;
		}
		const tableCellMarginFragment = buildTableCellMargins(160);
		tablePropertiesFragment.import(tableCellMarginFragment);
	} else {
		const alignmentFragment = buildHorizontalAlignment("center");
		tablePropertiesFragment.import(alignmentFragment);
		const tableCellMarginFragment = buildTableCellMargins(160);
		tablePropertiesFragment.import(tableCellMarginFragment);
	}
	tablePropertiesFragment.up();
	return tablePropertiesFragment;
};
const cssBorderParser = (borderString) => {
	if (borderString === "none" || borderString === "0" || borderString === "0px") return [
		0,
		"single",
		"000000"
	];
	const [size, stroke, color] = borderString.split(" ");
	if (size === "none" || size === "0") return [
		0,
		"single",
		"000000"
	];
	let sizeNum;
	if (pointRegex.test(size)) {
		const matchedParts = size.match(pointRegex);
		sizeNum = matchedParts ? pointToEIP(Number.parseFloat(matchedParts[1])) : 0;
	} else if (pixelRegex.test(size)) {
		const matchedParts = size.match(pixelRegex);
		sizeNum = matchedParts ? pixelToEIP(Number.parseFloat(matchedParts[1])) : 0;
	} else sizeNum = 0;
	const strokeResult = stroke && [
		"dashed",
		"dotted",
		"double"
	].includes(stroke) ? stroke : "single";
	const colorResult = color ? fixupColorCode(color).toUpperCase() : "000000";
	return [
		sizeNum,
		strokeResult,
		colorResult
	];
};
const buildTable = async (vNode, attributes, docxDocumentInstance) => {
	const tableFragment = fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", "tbl");
	const modifiedAttributes = { ...attributes };
	if (isVNode(vNode) && vNode.properties) {
		const tableAttributes = vNode.properties.attributes || {};
		const tableStyles = vNode.properties.style || {};
		const tableBorders = {};
		const tableCellBorders = {};
		let [borderSize, borderStrike, borderColor] = [
			2,
			"single",
			"000000"
		];
		const borderAttr = tableAttributes.border;
		if (borderAttr && !Number.isNaN(Number.parseInt(borderAttr, 10))) borderSize = Number.parseInt(borderAttr, 10);
		if (tableStyles.border) {
			const [cssSize, cssStroke, cssColor] = cssBorderParser(tableStyles.border);
			borderSize = cssSize !== void 0 && cssSize !== null ? cssSize : borderSize;
			borderColor = cssColor || borderColor;
			borderStrike = cssStroke || borderStrike;
		}
		tableBorders.top = borderSize;
		tableBorders.bottom = borderSize;
		tableBorders.left = borderSize;
		tableBorders.right = borderSize;
		tableBorders.stroke = borderStrike;
		tableBorders.color = borderColor;
		if (tableStyles["border-collapse"] === "collapse") {
			tableBorders.insideV = borderSize;
			tableBorders.insideH = borderSize;
		} else {
			tableBorders.insideV = 0;
			tableBorders.insideH = 0;
			if (borderSize > 0) {
				tableCellBorders.top = 1;
				tableCellBorders.bottom = 1;
				tableCellBorders.left = 1;
				tableCellBorders.right = 1;
			}
		}
		modifiedAttributes.tableBorder = tableBorders;
		modifiedAttributes.tableCellSpacing = 0;
		if (Object.keys(tableCellBorders).length) modifiedAttributes.tableCellBorder = tableCellBorders;
		let minimumWidth;
		let maximumWidth;
		let width;
		if (tableStyles["min-width"] && pixelRegex.test(tableStyles["min-width"])) {
			const match = tableStyles["min-width"].match(pixelRegex);
			if (match) minimumWidth = pixelToTWIP(Number.parseFloat(match[1]));
		} else if (tableStyles["min-width"] && percentageRegex.test(tableStyles["min-width"])) {
			const match = tableStyles["min-width"].match(percentageRegex);
			if (match) {
				const percentageValue = Number.parseFloat(match[1]);
				minimumWidth = Math.round(percentageValue / 100 * (attributes.maximumWidth || 0));
			}
		}
		if (tableStyles["max-width"] && pixelRegex.test(tableStyles["max-width"])) {
			pixelRegex.lastIndex = 0;
			const match = tableStyles["max-width"].match(pixelRegex);
			if (match) maximumWidth = pixelToTWIP(Number.parseFloat(match[1]));
		} else if (tableStyles["max-width"] && percentageRegex.test(tableStyles["max-width"])) {
			percentageRegex.lastIndex = 0;
			const match = tableStyles["max-width"].match(percentageRegex);
			if (match) {
				const percentageValue = Number.parseFloat(match[1]);
				maximumWidth = Math.round(percentageValue / 100 * (attributes.maximumWidth || 0));
			}
		}
		if (tableStyles.width && pixelRegex.test(tableStyles.width)) {
			pixelRegex.lastIndex = 0;
			const match = tableStyles.width.match(pixelRegex);
			if (match) width = pixelToTWIP(Number.parseFloat(match[1]));
		} else if (tableStyles.width && percentageRegex.test(tableStyles.width)) {
			percentageRegex.lastIndex = 0;
			const match = tableStyles.width.match(percentageRegex);
			if (match) {
				const percentageValue = Number.parseFloat(match[1]);
				width = Math.round(percentageValue / 100 * (attributes.maximumWidth || 0));
			}
		}
		if (width) {
			modifiedAttributes.width = width;
			if (maximumWidth) modifiedAttributes.width = Math.min(modifiedAttributes.width, maximumWidth);
			if (minimumWidth) modifiedAttributes.width = Math.max(modifiedAttributes.width, minimumWidth);
		} else if (minimumWidth) modifiedAttributes.width = minimumWidth;
		if (modifiedAttributes.width) modifiedAttributes.width = Math.min(modifiedAttributes.width, attributes.maximumWidth || 0);
	}
	const tablePropertiesFragment = buildTableProperties(modifiedAttributes);
	tableFragment.import(tablePropertiesFragment);
	let tblGridEmitted = false;
	const rowSpanMap = /* @__PURE__ */ new Map();
	if (vNodeHasChildren(vNode)) {
		for (const childVNode of vNode.children || []) if (childVNode.tagName === "colgroup" && !tblGridEmitted) {
			const tableGridFragment = buildTableGrid(childVNode, modifiedAttributes);
			tableFragment.import(tableGridFragment);
			tblGridEmitted = true;
		}
		if (!tblGridEmitted) for (const childVNode of vNode.children || []) {
			if (tblGridEmitted) break;
			if (childVNode.tagName === "tr") {
				const tableGridFragment = buildTableGridFromTableRow(childVNode, modifiedAttributes);
				tableFragment.import(tableGridFragment);
				tblGridEmitted = true;
			} else if (childVNode.tagName === "thead" || childVNode.tagName === "tbody") {
				for (const grandChildVNode of childVNode.children || []) if (grandChildVNode.tagName === "tr") {
					const tableGridFragment = buildTableGridFromTableRow(grandChildVNode, modifiedAttributes);
					tableFragment.import(tableGridFragment);
					tblGridEmitted = true;
					break;
				}
			}
		}
		for (const childVNode of vNode.children || []) if (childVNode.tagName === "colgroup") {} else if (childVNode.tagName === "thead" || childVNode.tagName === "tbody") {
			for (const grandChildVNode of childVNode.children || []) if (grandChildVNode.tagName === "tr") {
				const tableRowFragment = await buildTableRow(grandChildVNode, modifiedAttributes, rowSpanMap, docxDocumentInstance);
				tableFragment.import(tableRowFragment);
			}
		} else if (childVNode.tagName === "tr") {
			const tableRowFragment = await buildTableRow(childVNode, modifiedAttributes, rowSpanMap, docxDocumentInstance);
			tableFragment.import(tableRowFragment);
		}
	}
	tableFragment.up();
	return tableFragment;
};
const drawingNamespaces = {
	asvg: "http://schemas.microsoft.com/office/drawing/2016/SVG/main",
	w: namespaces.w,
	wp: namespaces.wp,
	a: namespaces.a,
	pic: namespaces.pic,
	r: namespaces.r
};
const buildPresetGeometry = () => fragment({ namespaceAlias: drawingNamespaces }).ele(namespaces.a, "prstGeom").att("prst", "rect").up();
const buildExtents = ({ width, height }) => {
	const defaultSize = 952500;
	const cx = typeof width === "number" && width > 0 && !Number.isNaN(width) ? width : defaultSize;
	const cy = typeof height === "number" && height > 0 && !Number.isNaN(height) ? height : defaultSize;
	return fragment({ namespaceAlias: drawingNamespaces }).ele(namespaces.a, "ext").att("cx", String(cx)).att("cy", String(cy)).up();
};
const buildOffset = () => fragment({ namespaceAlias: drawingNamespaces }).ele(namespaces.a, "off").att("x", "0").att("y", "0").up();
const buildGraphicFrameTransform = (attributes) => {
	const graphicFrameTransformFragment = fragment({ namespaceAlias: drawingNamespaces }).ele(namespaces.a, "xfrm");
	const offsetFragment = buildOffset();
	graphicFrameTransformFragment.import(offsetFragment);
	const extentsFragment = buildExtents(attributes);
	graphicFrameTransformFragment.import(extentsFragment);
	graphicFrameTransformFragment.up();
	return graphicFrameTransformFragment;
};
const buildShapeProperties = (attributes) => {
	const shapeProperties = fragment({ namespaceAlias: drawingNamespaces }).ele(namespaces.pic, "spPr");
	const graphicFrameTransformFragment = buildGraphicFrameTransform(attributes);
	shapeProperties.import(graphicFrameTransformFragment);
	const presetGeometryFragment = buildPresetGeometry();
	shapeProperties.import(presetGeometryFragment);
	shapeProperties.up();
	return shapeProperties;
};
const buildFillRect = () => fragment({ namespaceAlias: drawingNamespaces }).ele(namespaces.a, "fillRect").up();
const buildStretch = () => {
	const stretchFragment = fragment({ namespaceAlias: drawingNamespaces }).ele(namespaces.a, "stretch");
	const fillRectFragment = buildFillRect();
	stretchFragment.import(fillRectFragment);
	stretchFragment.up();
	return stretchFragment;
};
const buildSrcRectFragment = () => fragment({ namespaceAlias: drawingNamespaces }).ele(namespaces.a, "srcRect").att("b", "0").att("l", "0").att("r", "0").att("t", "0").up();
const buildBinaryLargeImageOrPicture = (relationshipId, isSVG = false) => {
	const blipFragment = fragment({ namespaceAlias: drawingNamespaces }).ele(namespaces.a, "blip").att(namespaces.r, "embed", `rId${relationshipId}`).att("cstate", "print");
	if (isSVG) {
		const svgBlipExtension = fragment({ namespaceAlias: drawingNamespaces }).ele(namespaces.a, "extLst").ele(namespaces.a, "ext").att("uri", "{96DAC541-7B7A-43C3-8B79-37D633B846F1}").ele(drawingNamespaces.asvg, "svgBlip").att("xmlns:asvg", drawingNamespaces.asvg).att(namespaces.r, "embed", `rId${relationshipId}`).up().up().up();
		blipFragment.import(svgBlipExtension);
	}
	return blipFragment.up();
};
const buildBinaryLargeImageOrPictureFill = (relationshipId, isSVG = false) => {
	const binaryLargeImageOrPictureFillFragment = fragment({ namespaceAlias: drawingNamespaces }).ele(namespaces.pic, "blipFill");
	const binaryLargeImageOrPictureFragment = buildBinaryLargeImageOrPicture(relationshipId, isSVG);
	binaryLargeImageOrPictureFillFragment.import(binaryLargeImageOrPictureFragment);
	const srcRectFragment = buildSrcRectFragment();
	binaryLargeImageOrPictureFillFragment.import(srcRectFragment);
	const stretchFragment = buildStretch();
	binaryLargeImageOrPictureFillFragment.import(stretchFragment);
	binaryLargeImageOrPictureFillFragment.up();
	return binaryLargeImageOrPictureFillFragment;
};
const buildNonVisualPictureDrawingProperties = () => fragment({ namespaceAlias: drawingNamespaces }).ele(namespaces.pic, "cNvPicPr").up();
const buildNonVisualDrawingProperties = (pictureId, pictureNameWithExtension, pictureDescription = "") => fragment({ namespaceAlias: drawingNamespaces }).ele(namespaces.pic, "cNvPr").att("id", String(pictureId)).att("name", pictureNameWithExtension).att("descr", pictureDescription).up();
const buildNonVisualPictureProperties = (pictureId, pictureNameWithExtension, pictureDescription) => {
	const nonVisualPicturePropertiesFragment = fragment({ namespaceAlias: drawingNamespaces }).ele(namespaces.pic, "nvPicPr");
	const nonVisualDrawingPropertiesFragment = buildNonVisualDrawingProperties(pictureId, pictureNameWithExtension, pictureDescription);
	nonVisualPicturePropertiesFragment.import(nonVisualDrawingPropertiesFragment);
	const nonVisualPictureDrawingPropertiesFragment = buildNonVisualPictureDrawingProperties();
	nonVisualPicturePropertiesFragment.import(nonVisualPictureDrawingPropertiesFragment);
	nonVisualPicturePropertiesFragment.up();
	return nonVisualPicturePropertiesFragment;
};
const buildPicture = ({ id, fileNameWithExtension, description, relationshipId, width, height, isSVG }) => {
	const pictureFragment = fragment({ namespaceAlias: drawingNamespaces }).ele(namespaces.pic, "pic");
	const nonVisualPicturePropertiesFragment = buildNonVisualPictureProperties(id || 0, fileNameWithExtension || "", description);
	pictureFragment.import(nonVisualPicturePropertiesFragment);
	const binaryLargeImageOrPictureFill = buildBinaryLargeImageOrPictureFill(relationshipId || 0, isSVG);
	pictureFragment.import(binaryLargeImageOrPictureFill);
	const shapeProperties = buildShapeProperties({
		width,
		height
	});
	pictureFragment.import(shapeProperties);
	pictureFragment.up();
	return pictureFragment;
};
const buildGraphicData = (graphicType, attributes) => {
	const graphicDataFragment = fragment({ namespaceAlias: drawingNamespaces }).ele(namespaces.a, "graphicData").att("uri", "http://schemas.openxmlformats.org/drawingml/2006/picture");
	if (graphicType === "picture") {
		const pictureFragment = buildPicture(attributes);
		graphicDataFragment.import(pictureFragment);
	}
	graphicDataFragment.up();
	return graphicDataFragment;
};
const buildGraphic = (graphicType, attributes) => {
	const graphicFragment = fragment({ namespaceAlias: drawingNamespaces }).ele(namespaces.a, "graphic");
	const graphicDataFragment = buildGraphicData(graphicType, attributes);
	graphicFragment.import(graphicDataFragment);
	graphicFragment.up();
	return graphicFragment;
};
const buildDrawingObjectNonVisualProperties = (pictureId, pictureName) => fragment({ namespaceAlias: drawingNamespaces }).ele(namespaces.wp, "docPr").att("id", String(pictureId)).att("name", pictureName).up();
const buildWrapSquare = () => fragment({ namespaceAlias: drawingNamespaces }).ele(namespaces.wp, "wrapSquare").att("wrapText", "bothSides").att("distB", "228600").att("distT", "228600").att("distL", "228600").att("distR", "228600").up();
const buildEffectExtentFragment = () => fragment({ namespaceAlias: drawingNamespaces }).ele(namespaces.wp, "effectExtent").att("b", "0").att("l", "0").att("r", "0").att("t", "0").up();
const buildExtent = ({ width, height }) => {
	const defaultSize = 952500;
	const cx = typeof width === "number" && width > 0 && !Number.isNaN(width) ? width : defaultSize;
	const cy = typeof height === "number" && height > 0 && !Number.isNaN(height) ? height : defaultSize;
	return fragment({ namespaceAlias: drawingNamespaces }).ele(namespaces.wp, "extent").att("cx", String(cx)).att("cy", String(cy)).up();
};
const buildPositionV = () => fragment({ namespaceAlias: drawingNamespaces }).ele(namespaces.wp, "positionV").att("relativeFrom", "paragraph").ele(namespaces.wp, "posOffset").txt("19050").up().up();
const buildPositionH = () => fragment({ namespaceAlias: drawingNamespaces }).ele(namespaces.wp, "positionH").att("relativeFrom", "column").ele(namespaces.wp, "posOffset").txt("19050").up().up();
const buildSimplePos = () => fragment({ namespaceAlias: drawingNamespaces }).ele(namespaces.wp, "simplePos").att("x", "0").att("y", "0").up();
const buildAnchoredDrawing = (graphicType, attributes) => {
	const anchoredDrawingFragment = fragment({ namespaceAlias: drawingNamespaces }).ele(namespaces.wp, "anchor").att("distB", "0").att("distL", "0").att("distR", "0").att("distT", "0").att("relativeHeight", "0").att("behindDoc", "false").att("locked", "true").att("layoutInCell", "true").att("allowOverlap", "false").att("simplePos", "false");
	const simplePosFragment = buildSimplePos();
	anchoredDrawingFragment.import(simplePosFragment);
	const positionHFragment = buildPositionH();
	anchoredDrawingFragment.import(positionHFragment);
	const positionVFragment = buildPositionV();
	anchoredDrawingFragment.import(positionVFragment);
	const extentFragment = buildExtent({
		width: attributes.width,
		height: attributes.height
	});
	anchoredDrawingFragment.import(extentFragment);
	const effectExtentFragment = buildEffectExtentFragment();
	anchoredDrawingFragment.import(effectExtentFragment);
	const wrapSquareFragment = buildWrapSquare();
	anchoredDrawingFragment.import(wrapSquareFragment);
	const drawingObjectNonVisualPropertiesFragment = buildDrawingObjectNonVisualProperties(attributes.id || 0, attributes.fileNameWithExtension || "");
	anchoredDrawingFragment.import(drawingObjectNonVisualPropertiesFragment);
	const graphicFragment = buildGraphic(graphicType, attributes);
	anchoredDrawingFragment.import(graphicFragment);
	anchoredDrawingFragment.up();
	return anchoredDrawingFragment;
};
const buildInlineDrawing = (graphicType, attributes) => {
	const inlineDrawingFragment = fragment({ namespaceAlias: drawingNamespaces }).ele(namespaces.wp, "inline").att("distB", "0").att("distL", "0").att("distR", "0").att("distT", "0");
	const extentFragment = buildExtent({
		width: attributes.width,
		height: attributes.height
	});
	inlineDrawingFragment.import(extentFragment);
	const effectExtentFragment = buildEffectExtentFragment();
	inlineDrawingFragment.import(effectExtentFragment);
	const drawingObjectNonVisualPropertiesFragment = buildDrawingObjectNonVisualProperties(attributes.id || 0, attributes.fileNameWithExtension || "");
	inlineDrawingFragment.import(drawingObjectNonVisualPropertiesFragment);
	const graphicFragment = buildGraphic(graphicType, attributes);
	inlineDrawingFragment.import(graphicFragment);
	inlineDrawingFragment.up();
	return inlineDrawingFragment;
};
const buildDrawing = (inlineOrAnchored, graphicType, attributes) => {
	const drawingFragment = fragment({ namespaceAlias: drawingNamespaces }).ele("@w", "drawing");
	const inlineOrAnchoredDrawingFragment = inlineOrAnchored ? buildInlineDrawing(graphicType, attributes) : buildAnchoredDrawing(graphicType, attributes);
	drawingFragment.import(inlineOrAnchoredDrawingFragment);
	drawingFragment.up();
	return drawingFragment;
};
//#endregion
//#region src/helpers/render-document-file.ts
const base64ToUint8Array = (base64) => {
	if (typeof Buffer !== "undefined") return Buffer.from(base64, "base64");
	const binaryString = globalThis.atob(base64);
	const bytes = new Uint8Array(binaryString.length);
	for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
	return bytes;
};
const MARGIN_NUMBER_REGEX = /(\d+)/;
const INLINE_ELEMENTS = [
	"span",
	"strong",
	"b",
	"em",
	"i",
	"u",
	"ins",
	"strike",
	"del",
	"s",
	"sub",
	"sup",
	"mark",
	"a",
	"code"
];
const isInlineElement = (node) => isVText(node) || isVNode(node) && INLINE_ELEMENTS.includes(node.tagName || "");
const SPECIAL_BLOCK_ELEMENTS = [
	"img",
	"table",
	"figure",
	"ul",
	"ol",
	"blockquote",
	"pre",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"hr",
	"video",
	"audio",
	"iframe"
];
const containsSpecialElements = (node) => {
	if (!isVNode(node)) return false;
	const vNode = node;
	if (SPECIAL_BLOCK_ELEMENTS.includes(vNode.tagName || "")) return true;
	if (vNodeHasChildren(vNode)) return (vNode.children || []).some((child) => containsSpecialElements(child));
	return false;
};
const serializeVNodeToSVG = (node, isRoot = false) => {
	if (node.text) return node.text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
	const vNode = node;
	if (!vNode.tagName) return "";
	const attributes = vNode.properties?.attributes || {};
	const style = vNode.properties?.style || {};
	let svg = `<${vNode.tagName}`;
	if (isRoot && vNode.tagName === "svg" && !attributes.xmlns) svg += " xmlns=\"http://www.w3.org/2000/svg\"";
	Object.entries(attributes).forEach(([key, value]) => {
		if (value) {
			const escapedValue = String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
			svg += ` ${key}="${escapedValue}"`;
		}
	});
	if (Object.keys(style).length > 0) {
		const styleString = Object.entries(style).map(([key, value]) => `${key}:${value}`).join(";");
		svg += ` style="${styleString}"`;
	}
	const children = vNode.children || [];
	if (children.length === 0) {
		svg += " />";
		return svg;
	}
	svg += ">";
	children.forEach((child) => {
		svg += serializeVNodeToSVG(child, false);
	});
	svg += `</${vNode.tagName}>`;
	return svg;
};
const convertHTML$1 = createHTMLtoVDOM();
const buildImage = async (docxDocumentInstance, vNode, maximumWidth = null) => {
	let response = null;
	let base64Uri = null;
	try {
		const imageSource = vNode.properties?.src;
		if (imageSource && (imageSource.includes(".webp") || imageSource.includes("image/webp"))) return null;
		if (imageSource?.startsWith("http://") || imageSource?.startsWith("https://")) base64Uri = await downloadAndCacheImage(docxDocumentInstance, imageSource, docxDocumentInstance.imageProcessing);
		else if (imageSource) base64Uri = decodeURIComponent(imageSource);
		if (base64Uri) response = await docxDocumentInstance.createMediaFile(base64Uri);
	} catch (_error) {}
	if (response) {
		docxDocumentInstance.zip.folder("word").folder("media").file(response.fileNameWithExtension, base64ToUint8Array(response.fileContent), { createFolders: false });
		const documentRelsId = docxDocumentInstance.createDocumentRelationships(docxDocumentInstance.relationshipFilename, imageType, `media/${response.fileNameWithExtension}`, internalRelationship);
		const imageProperties = getImageDimensions(base64ToUint8Array(response.fileContent));
		return await buildParagraph(vNode, {
			type: "picture",
			inlineOrAnchored: true,
			relationshipId: documentRelsId,
			...response,
			description: vNode.properties?.alt,
			maximumWidth: maximumWidth || docxDocumentInstance.availableDocumentSpace,
			originalWidth: imageProperties.width,
			originalHeight: imageProperties.height
		}, docxDocumentInstance);
	}
	return null;
};
const buildList = async (vNode, docxDocumentInstance, xmlFragment, existingNumberingId = null, baseIndentLevel = 0) => {
	const listElements = [];
	let vNodeObjects = [{
		node: vNode,
		level: baseIndentLevel,
		type: vNode.tagName || "",
		numberingId: existingNumberingId || docxDocumentInstance.createNumbering(vNode.tagName || "ul", vNode.properties)
	}];
	while (vNodeObjects.length) {
		const tempVNodeObject = vNodeObjects.shift();
		if (isVText(tempVNodeObject.node) || isVNode(tempVNodeObject.node) && ![
			"ul",
			"ol",
			"li"
		].includes(tempVNodeObject.node.tagName || "")) {
			const paragraphFragment = await buildParagraph(tempVNodeObject.node, { numbering: {
				levelId: tempVNodeObject.level,
				numberingId: tempVNodeObject.numberingId
			} }, docxDocumentInstance);
			xmlFragment.import(paragraphFragment);
		}
		const tempNode = tempVNodeObject.node;
		if (tempNode.children && tempNode.children.length && [
			"ul",
			"ol",
			"li"
		].includes(tempNode.tagName || "")) vNodeObjects = tempNode.children.reduce((accumulator, childVNode) => {
			const childNode = childVNode;
			if (["ul", "ol"].includes(childNode.tagName || "")) accumulator.push({
				node: childVNode,
				level: tempVNodeObject.level + 1,
				type: childNode.tagName || "",
				numberingId: docxDocumentInstance.createNumbering(childNode.tagName || "ul", childNode.properties)
			});
			else if (accumulator.length > 0 && isVNode(accumulator[accumulator.length - 1].node) && (accumulator[accumulator.length - 1].node.tagName || "").toLowerCase() === "p" && (childNode.tagName || "").toLowerCase() !== "li") {
				const lastNode = accumulator[accumulator.length - 1].node;
				if (lastNode.children) lastNode.children.push(childVNode);
			} else {
				const paragraphVNode = new VNode("p", null, isVText(childVNode) ? [childVNode] : isVNode(childVNode) ? (childNode.tagName || "").toLowerCase() === "li" ? [...childNode.children || []] : [childVNode] : []);
				accumulator.push({
					node: isVNode(childVNode) ? (childNode.tagName || "").toLowerCase() === "li" ? childVNode : (childNode.tagName || "").toLowerCase() !== "p" ? paragraphVNode : childVNode : paragraphVNode,
					level: tempVNodeObject.level,
					type: tempVNodeObject.type,
					numberingId: tempVNodeObject.numberingId
				});
			}
			return accumulator;
		}, []).concat(vNodeObjects);
	}
	return listElements;
};
async function findXMLEquivalent(docxDocumentInstance, vNode, xmlFragment) {
	const hasListChildren = vNodeHasChildren(vNode) && (vNode.children || []).some((child) => isVNode(child) && ["ul", "ol"].includes(child.tagName || ""));
	if (![
		"ol",
		"ul",
		"html",
		"body",
		"div",
		"section",
		"article",
		"main"
	].includes(vNode.tagName || "") && !hasListChildren) resetListTracking();
	if (vNode.tagName === "div" && (vNode.properties?.attributes?.class === "page-break" || vNode.properties?.style && vNode.properties.style["page-break-after"])) {
		const paragraphFragment = fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", "p").ele("@w", "r").ele("@w", "br").att("@w", "type", "page").up().up().up();
		xmlFragment.import(paragraphFragment);
		return;
	}
	if (vNode.tagName === "div" && vNode.properties && vNode.properties.attributes && vNode.properties.attributes["data-equation-omml"]) {
		const ommlString = vNode.properties.attributes["data-equation-omml"];
		try {
			const paragraphFragment = fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", "p").ele("@w", "pPr").ele("@w", "jc").att("@w", "val", "center").up().up();
			const ommlFragment = fragment().ele(ommlString);
			paragraphFragment.first().import(ommlFragment);
			paragraphFragment.first().up();
			xmlFragment.import(paragraphFragment);
			return;
		} catch {
			console.warn("Failed to parse OMML for block equation");
		}
	}
	if (vNode.tagName === "div" && vNodeHasChildren(vNode)) if ((vNode.children || []).some((child) => containsSpecialElements(child))) {} else {
		if ((vNode.children || []).every((child) => isInlineElement(child)) && (vNode.children || []).length > 0) {
			const paragraphFragment = await buildParagraph(new VNode("p", vNode.properties, vNode.children), {}, docxDocumentInstance);
			xmlFragment.import(paragraphFragment);
			return;
		}
		const groups = [];
		let currentInlineGroup = [];
		for (const child of vNode.children || []) if (isInlineElement(child)) currentInlineGroup.push(child);
		else {
			if (currentInlineGroup.length > 0) {
				groups.push({
					type: "inline",
					children: currentInlineGroup
				});
				currentInlineGroup = [];
			}
			groups.push({
				type: "block",
				node: child
			});
		}
		if (currentInlineGroup.length > 0) groups.push({
			type: "inline",
			children: currentInlineGroup
		});
		for (const group of groups) if (group.type === "inline" && group.children) {
			const paragraphFragment = await buildParagraph(new VNode("p", null, group.children), {}, docxDocumentInstance);
			xmlFragment.import(paragraphFragment);
		} else if (group.node) await convertVTreeToXML(docxDocumentInstance, group.node, xmlFragment);
		return;
	}
	switch (vNode.tagName) {
		case "h1":
		case "h2":
		case "h3":
		case "h4":
		case "h5":
		case "h6": {
			let bookmarkId = null;
			let headingVNode = vNode;
			if (vNodeHasChildren(vNode) && (vNode.children || []).length > 0) {
				const firstChild = (vNode.children || [])[0];
				const anchorId = firstChild.properties?.id || firstChild.properties?.attributes?.id;
				const hasHref = firstChild.properties?.href || firstChild.properties?.attributes?.href;
				if (isVNode(firstChild) && (firstChild.tagName === "a" || firstChild.tagName === "span") && anchorId && !hasHref) {
					bookmarkId = anchorId;
					headingVNode = new VNode(vNode.tagName, vNode.properties, (vNode.children || []).slice(1));
				}
			}
			const headingFragment = await buildParagraph(headingVNode, {
				paragraphStyle: `Heading${vNode.tagName[1]}`,
				bookmarkId
			}, docxDocumentInstance);
			xmlFragment.import(headingFragment);
			return;
		}
		case "hr": {
			const hrFragment = fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", "p").ele("@w", "pPr").ele("@w", "pBdr").ele("@w", "bottom").att("@w", "val", "single").att("@w", "sz", "6").att("@w", "space", "1").att("@w", "color", "auto").up().up().up().up();
			xmlFragment.import(hrFragment);
			return;
		}
		case "span":
		case "strong":
		case "b":
		case "em":
		case "i":
		case "u":
		case "ins":
		case "strike":
		case "del":
		case "s":
		case "sub":
		case "sup":
		case "mark":
		case "p": {
			if (vNodeHasChildren(vNode)) {
				const listChildren = (vNode.children || []).filter((child) => isVNode(child) && ["ul", "ol"].includes(child.tagName || ""));
				if (listChildren.length > 0) {
					const nonListChildren = (vNode.children || []).filter((child) => !isVNode(child) || !["ul", "ol"].includes(child.tagName || ""));
					if (nonListChildren.length > 0) {
						const paragraphFragment = await buildParagraph(new VNode(vNode.tagName, vNode.properties, nonListChildren), {}, docxDocumentInstance);
						xmlFragment.import(paragraphFragment);
					}
					const indentLevel = getIndentLevel(vNode);
					for (const listChild of listChildren) {
						const listNode = listChild;
						const { lastListNumberingId: existingId } = getListTracking(listNode.tagName || "", indentLevel);
						let numberingId;
						if (existingId !== null) numberingId = existingId;
						else numberingId = docxDocumentInstance.createNumbering(listNode.tagName || "ul", listNode.properties);
						setListTracking(listNode.tagName || "", numberingId, indentLevel);
						await buildList(listNode, docxDocumentInstance, xmlFragment, numberingId, indentLevel);
					}
					return;
				}
			}
			const paragraphFragment = await buildParagraph(vNode, {}, docxDocumentInstance);
			xmlFragment.import(paragraphFragment);
			return;
		}
		case "a":
		case "blockquote":
		case "code":
		case "pre": {
			const paragraphFragment = await buildParagraph(vNode, {}, docxDocumentInstance);
			xmlFragment.import(paragraphFragment);
			return;
		}
		case "figure":
			if (vNodeHasChildren(vNode)) {
				const processImageInNode = async (node) => {
					if (!isVNode(node)) return;
					const vn = node;
					if (vn.tagName === "img") {
						const imageFragment = await buildImage(docxDocumentInstance, vn);
						if (imageFragment) xmlFragment.import(imageFragment);
						return;
					}
					if (vNodeHasChildren(vn)) for (const child of vn.children || []) await processImageInNode(child);
				};
				for (let index = 0; index < (vNode.children || []).length; index++) {
					const childVNode = (vNode.children || [])[index];
					if (childVNode.tagName === "table") {
						const tableFragment = await buildTable(childVNode, {
							maximumWidth: docxDocumentInstance.availableDocumentSpace,
							rowCantSplit: docxDocumentInstance.tableRowCantSplit
						}, docxDocumentInstance);
						xmlFragment.import(tableFragment);
						const emptyParagraphFragment = await buildParagraph(null, {});
						xmlFragment.import(emptyParagraphFragment);
					} else if (childVNode.tagName === "img") {
						const imageFragment = await buildImage(docxDocumentInstance, childVNode);
						if (imageFragment) xmlFragment.import(imageFragment);
					} else if (childVNode.tagName === "figcaption") {
						const captionFragment = await buildParagraph(childVNode, {}, docxDocumentInstance);
						xmlFragment.import(captionFragment);
					} else if (childVNode.tagName === "div") {
						await processImageInNode(childVNode);
						if (vNodeHasChildren(childVNode)) {
							for (const divChild of childVNode.children || []) if (isVNode(divChild) && divChild.tagName === "figcaption") {
								const captionFragment = await buildParagraph(divChild, {}, docxDocumentInstance);
								xmlFragment.import(captionFragment);
							}
						}
					}
				}
			}
			return;
		case "table": {
			const tableFragment = await buildTable(vNode, {
				maximumWidth: docxDocumentInstance.availableDocumentSpace,
				rowCantSplit: docxDocumentInstance.tableRowCantSplit
			}, docxDocumentInstance);
			xmlFragment.import(tableFragment);
			const emptyParagraphFragment = await buildParagraph(null, {});
			xmlFragment.import(emptyParagraphFragment);
			return;
		}
		case "ol":
		case "ul": {
			const indentLevel = getIndentLevel(vNode);
			const { lastListNumberingId: existingId } = getListTracking(vNode.tagName, indentLevel);
			let numberingId;
			if (existingId !== null) numberingId = existingId;
			else numberingId = docxDocumentInstance.createNumbering(vNode.tagName, vNode.properties);
			setListTracking(vNode.tagName, numberingId, indentLevel);
			await buildList(vNode, docxDocumentInstance, xmlFragment, numberingId, indentLevel);
			return;
		}
		case "img": {
			const imageFragment = await buildImage(docxDocumentInstance, vNode);
			if (imageFragment) xmlFragment.import(imageFragment);
			return;
		}
		case "svg": {
			const svgSanitization = docxDocumentInstance.imageProcessing?.svgSanitization ?? defaultDocumentOptions.imageProcessing.svgSanitization;
			const verboseLogging = docxDocumentInstance.imageProcessing?.verboseLogging ?? defaultDocumentOptions.imageProcessing.verboseLogging;
			const sanitizedVNode = svgSanitization ? sanitizeSVGVNode(vNode, {
				enabled: true,
				verboseLogging
			}) : vNode;
			if (!sanitizedVNode) return;
			const svgString = serializeVNodeToSVG(sanitizedVNode, true);
			if (!svgString.trim()) return;
			if (svgSanitization && verboseLogging) {
				const validation = validateSVGString(svgString);
				if (!validation.valid) console.warn("[SVG] Validation warnings:", validation.warnings);
			}
			const base64SVG = typeof Buffer !== "undefined" ? Buffer.from(svgString, "utf-8").toString("base64") : globalThis.btoa(svgString);
			const imageFragment = await buildImage(docxDocumentInstance, {
				tagName: "img",
				properties: {
					alt: vNode.properties?.attributes?.title || "SVG image",
					src: `data:image/svg+xml;base64,${base64SVG}`
				}
			});
			if (imageFragment) xmlFragment.import(imageFragment);
			return;
		}
		case "br": {
			const linebreakFragment = await buildParagraph(null, {});
			xmlFragment.import(linebreakFragment);
			return;
		}
		case "head": return;
	}
	if (vNodeHasChildren(vNode)) for (let index = 0; index < (vNode.children || []).length; index++) {
		const childVNode = (vNode.children || [])[index];
		await convertVTreeToXML(docxDocumentInstance, childVNode, xmlFragment);
	}
}
const listNumberingByLevel = /* @__PURE__ */ new Map();
function getIndentLevel(vNode, parentVNode = null) {
	const marginLeft = vNode?.properties?.style?.["margin-left"] || parentVNode?.properties?.style?.["margin-left"];
	if (marginLeft) {
		const match = marginLeft.match(MARGIN_NUMBER_REGEX);
		if (match) {
			const px = Number.parseInt(match[1], 10);
			const plateIndent = Math.round(px / 24);
			return Math.max(0, plateIndent - 1);
		}
	}
	return 0;
}
async function convertVTreeToXML(docxDocumentInstance, vTree, xmlFragment) {
	if (!vTree) return "";
	if (Array.isArray(vTree) && vTree.length) for (let index = 0; index < vTree.length; index++) {
		const vNode = vTree[index];
		await convertVTreeToXML(docxDocumentInstance, vNode, xmlFragment);
	}
	else if (isVNode(vTree)) await findXMLEquivalent(docxDocumentInstance, vTree, xmlFragment);
	else if (isVText(vTree)) {
		const text = vTree.text;
		if (!text || !text.trim()) return xmlFragment;
		const paragraphFragment = await buildParagraph(vTree, {}, docxDocumentInstance);
		xmlFragment.import(paragraphFragment);
	}
	return xmlFragment;
}
function resetListTracking() {
	listNumberingByLevel.clear();
}
function getListTracking(listType, indentLevel = 0) {
	const key = `${listType}_${indentLevel}`;
	return { lastListNumberingId: listNumberingByLevel.get(key) || null };
}
function setListTracking(type, numberingId, indentLevel = 0) {
	const key = `${type}_${indentLevel}`;
	listNumberingByLevel.set(key, numberingId);
}
async function renderDocumentFile(docxDocumentInstance) {
	resetListTracking();
	if (!docxDocumentInstance._imageCache) docxDocumentInstance._imageCache = /* @__PURE__ */ new Map();
	if (!docxDocumentInstance._retryStats) docxDocumentInstance._retryStats = {
		finalFailures: 0,
		successAfterRetry: 0,
		totalAttempts: 0
	};
	return await convertVTreeToXML(docxDocumentInstance, convertHTML$1(docxDocumentInstance.htmlString), fragment({ namespaceAlias: { w: namespaces.w } }));
}
//#endregion
//#region src/schemas/content-types.ts
const contentTypesXML = `
    <?xml version="1.0" encoding="UTF-8" standalone="yes"?>

    <Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
        <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml" />
        <Default Extension="jpeg" ContentType="image/jpeg"/>
        <Default Extension="png" ContentType="image/png"/>
        <Default Extension="xml" ContentType="application/xml"/>
        <Override PartName="/_rels/.rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
        <Override PartName="/word/_rels/document.xml.rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
        <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
        <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
        <Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/>
        <Override PartName="/word/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/>
        <Override PartName="/word/fontTable.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.fontTable+xml"/>
        <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
        <Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/>
        <Override PartName="/word/webSettings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.webSettings+xml"/>
    </Types>
`;
//#endregion
//#region src/schemas/core.ts
/**
* Format a Date as local time with Z suffix.
* Word uses local time with a trailing 'Z' in dcterms:created/modified
* (non-standard but expected by the OOXML ecosystem).
*/
function toLocalWithZ(d) {
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}T${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}Z`;
}
const generateCoreXML = (title = "", subject = "", creator = applicationName, keywords = [applicationName], description = "", lastModifiedBy = applicationName, revision = 1, createdAt = /* @__PURE__ */ new Date(), modifiedAt = /* @__PURE__ */ new Date()) => `
        <?xml version="1.0" encoding="UTF-8" standalone="yes"?>

        <cp:coreProperties
          xmlns:cp="${namespaces.coreProperties}"
          xmlns:dc="${namespaces.dc}"
          xmlns:dcterms="${namespaces.dcterms}"
          xmlns:dcmitype="${namespaces.dcmitype}"
          xmlns:xsi="${namespaces.xsi}"
          >
            <dc:title>${title}</dc:title>
            <dc:subject>${subject}</dc:subject>
            <dc:creator>${creator}</dc:creator>
            ${keywords && Array.isArray(keywords) ? `<cp:keywords>${keywords.join(", ")}</cp:keywords>` : ""}
            <dc:description>${description}</dc:description>
            <cp:lastModifiedBy>${lastModifiedBy}</cp:lastModifiedBy>
            <cp:revision>${revision}</cp:revision>
            <dcterms:created xsi:type="dcterms:W3CDTF">${createdAt instanceof Date ? toLocalWithZ(createdAt) : toLocalWithZ(/* @__PURE__ */ new Date())}</dcterms:created>
            <dcterms:modified xsi:type="dcterms:W3CDTF">${modifiedAt instanceof Date ? toLocalWithZ(modifiedAt) : toLocalWithZ(/* @__PURE__ */ new Date())}</dcterms:modified>
        </cp:coreProperties>
    `;
//#endregion
//#region src/schemas/document-rels.ts
const documentRelsXML = `
  <?xml version="1.0" encoding="UTF-8" standalone="yes"?>

  <Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
    <Relationship Id="rId1" Type="${namespaces.numbering}" Target="numbering.xml"/>
    <Relationship Id="rId2" Type="${namespaces.styles}" Target="styles.xml"/>
    <Relationship Id="rId3" Type="${namespaces.settingsRelation}" Target="settings.xml"/>
    <Relationship Id="rId4" Type="${namespaces.webSettingsRelation}" Target="webSettings.xml"/>
    <Relationship Id="rId5" Type="${namespaces.fontTable}" Target="fontTable.xml"/>
  </Relationships>
`;
//#endregion
//#region src/schemas/document.template.ts
const generateDocumentTemplate = (width, height, orientation, margins) => `
  <?xml version="1.0" encoding="UTF-8" standalone="yes"?>

    <w:document
        xmlns:a="${namespaces.a}"
        xmlns:cdr="${namespaces.cdr}"
        xmlns:m="${namespaces.m}"
        xmlns:o="${namespaces.o}"
        xmlns:pic="${namespaces.pic}"
        xmlns:r="${namespaces.r}"
        xmlns:v="${namespaces.v}"
        xmlns:ve="${namespaces.ve}"
        xmlns:vt="${namespaces.vt}"
        xmlns:w="${namespaces.w}"
        xmlns:w10="${namespaces.w10}"
        xmlns:wp="${namespaces.wp}"
        xmlns:wne="${namespaces.wne}"
        >
        <w:body>
            <w:sectPr>
                <w:pgSz w:w="${width}" w:h="${height}" w:orient="${orientation}" />
                <w:pgMar w:top="${margins.top}"
                        w:right="${margins.right}"
                        w:bottom="${margins.bottom}"
                        w:left="${margins.left}"
                        w:header="${margins.header}"
                        w:footer="${margins.footer}"
                        w:gutter="${margins.gutter}"/>
            </w:sectPr>
        </w:body>
    </w:document>
  `;
//#endregion
//#region src/schemas/font-table.ts
const fontTableXML = `
    <?xml version="1.0" encoding="UTF-8" standalone="yes"?>

    <w:fonts
      xmlns:r="${namespaces.r}"
      xmlns:w="${namespaces.w}"
      >
        <w:font w:name="Arial">
            <w:panose1 w:val="020B0604020202020204"/>
            <w:charset w:val="00"/>
            <w:family w:val="auto"/>
            <w:pitch w:val="variable"/>
            <w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/>
        </w:font>
        <w:font w:name="Calibri">
            <w:panose1 w:val="020F0502020204030204"/>
            <w:charset w:val="00"/>
            <w:family w:val="swiss"/>
            <w:pitch w:val="variable"/>
            <w:sig w:usb0="E4002EFF" w:usb1="C000247B" w:usb2="00000009" w:usb3="00000000" w:csb0="000001FF" w:csb1="00000000"/>
        </w:font>
        <w:font w:name="Calibri Light">
            <w:panose1 w:val="020F0302020204030204"/>
            <w:charset w:val="00"/>
            <w:family w:val="swiss"/>
            <w:pitch w:val="variable"/>
            <w:sig w:usb0="E4002EFF" w:usb1="C000247B" w:usb2="00000009" w:usb3="00000000" w:csb0="000001FF" w:csb1="00000000"/>
        </w:font>
        <w:font w:name="Courier New">
            <w:panose1 w:val="02070309020205020404"/>
            <w:charset w:val="00"/>
            <w:family w:val="auto"/>
            <w:pitch w:val="variable"/>
            <w:sig w:usb0="00000003" w:usb1="00000000" w:usb2="00000000" w:usb3="00000000" w:csb0="00000001" w:csb1="00000000"/>
        </w:font>
        <w:font w:name="Symbol">
            <w:panose1 w:val="05050102010706020507"/>
            <w:charset w:val="02"/>
            <w:family w:val="decorative"/>
            <w:pitch w:val="variable"/>
            <w:sig w:usb0="00000000" w:usb1="10000000" w:usb2="00000000" w:usb3="00000000" w:csb0="80000000" w:csb1="00000000"/>
        </w:font>
        <w:font w:name="Times New Roman">
            <w:panose1 w:val="02020603050405020304"/>
            <w:charset w:val="00"/>
            <w:family w:val="roman"/>
            <w:pitch w:val="variable"/>
            <w:sig w:usb0="E0002EFF" w:usb1="C000785B" w:usb2="00000009" w:usb3="00000000" w:csb0="000001FF" w:csb1="00000000"/>
        </w:font>
    </w:fonts>
`;
//#endregion
//#region src/schemas/generic-rels.ts
const genericRelsXML = `
    <?xml version="1.0" encoding="UTF-8" standalone="yes"?>

    <Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
    </Relationships>
`;
//#endregion
//#region src/schemas/numbering.ts
const generateNumberingXMLTemplate = () => `
        <?xml version="1.0" encoding="UTF-8" standalone="yes"?>

        <w:numbering
        xmlns:w="${namespaces.w}"
        xmlns:ve="${namespaces.ve}"
        xmlns:o="${namespaces.o}"
        xmlns:r="${namespaces.r}"
        xmlns:v="${namespaces.v}"
        xmlns:wp="${namespaces.wp}"
        xmlns:w10="${namespaces.w10}"
        xmlns:wne="${namespaces.wne}">
        </w:numbering>
    `;
//#endregion
//#region src/schemas/rels.ts
const relsXML = `
    <?xml version="1.0" encoding="UTF-8" standalone="yes"?>

    <Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
        <Relationship Id="rId1" Type="${namespaces.officeDocumentRelation}" Target="word/document.xml"/>
        <Relationship Id="rId2" Type="${namespaces.corePropertiesRelation}" Target="docProps/core.xml"/>
    </Relationships>
`;
//#endregion
//#region src/schemas/settings.ts
const settingsXML = `
    <?xml version="1.0" encoding="UTF-8" standalone="yes"?>

    <w:settings xmlns:w="${namespaces.w}" xmlns:o="${namespaces.o}" xmlns:r="${namespaces.r}" xmlns:v="${namespaces.v}" xmlns:w10="${namespaces.w10}" xmlns:sl="${namespaces.sl}">
        <w:zoom w:percent="100"/>
        <w:defaultTabStop w:val="720"/>
        <w:decimalSymbol w:val="."/>
        <w:listSeparator w:val=","/>
    </w:settings>
`;
//#endregion
//#region src/schemas/styles.ts
const escapeXml = (value) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
const generateHeadingStyleXML = (headingId, heading) => {
	const headingNumber = Number.parseInt(headingId.replace("Heading", ""), 10);
	const fontXml = heading.font && heading.font !== "Times New Roman" ? `<w:rFonts w:ascii="${escapeXml(heading.font)}" w:eastAsiaTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi" w:cstheme="minorBidi" />` : "";
	const fontSizeXml = heading.fontSize !== void 0 && heading.fontSize !== 22 && heading.fontSize > 0 ? `<w:sz w:val="${heading.fontSize}" /><w:szCs w:val="${heading.fontSize}" />` : "";
	const boldXml = heading.bold ? "<w:b />" : "";
	const keepLinesXml = heading.keepLines ? "<w:keepLines />" : "";
	const keepNextXml = heading.keepNext ? "<w:keepNext />" : "";
	let spacingAfterXml = "";
	let spacingXml = "";
	if (heading.spacing) {
		const spacingBeforeXml = heading.spacing.before !== void 0 ? `w:before="${heading.spacing.before}"` : "";
		spacingAfterXml = heading.spacing.after !== void 0 ? `w:after="${heading.spacing.after}"` : "";
		spacingXml = spacingBeforeXml || spacingAfterXml ? `<w:spacing ${spacingBeforeXml} ${spacingAfterXml} />` : "";
	}
	const outlineXml = `<w:outlineLvl w:val="${Math.max(0, Math.min(5, heading.outlineLevel || 0))}" />`;
	return `
		<w:style w:type="paragraph" w:styleId="${headingId}">
		  <w:name w:val="heading ${headingNumber}" />
		  <w:basedOn w:val="Normal" />
		  <w:next w:val="Normal" />
		  <w:uiPriority w:val="9" />
		  ${headingNumber === 2 ? "<w:unhideWhenUsed />" : ""}
		  ${headingNumber >= 3 ? "<w:semiHidden /><w:unhideWhenUsed />" : ""}
		  <w:qFormat />
		  <w:pPr>
			${keepNextXml}
			${keepLinesXml}
			${spacingXml}
			${outlineXml}
		  </w:pPr>
		  <w:rPr>
			${fontXml}
			${boldXml}
			${fontSizeXml}
		  </w:rPr>
		</w:style>`;
};
const generateStylesXML = (font = defaultFont, fontSize = 22, complexScriptFontSize = 22, lang = defaultLang, headingConfig = defaultHeadingOptions) => {
	const config = Object.fromEntries(Object.entries(defaultHeadingOptions).map(([key, defaultValue]) => [key, headingConfig?.[key] ? {
		...defaultValue,
		...headingConfig[key]
	} : defaultValue]));
	return `
  <?xml version="1.0" encoding="UTF-8" standalone="yes"?>

  <w:styles xmlns:w="${namespaces.w}" xmlns:r="${namespaces.r}">
		<w:docDefaults>
		  <w:rPrDefault>
			<w:rPr>
			  <w:rFonts w:ascii="${font}" w:eastAsiaTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi" w:cstheme="minorBidi" />
			  <w:sz w:val="${fontSize}" />
			  <w:szCs w:val="${complexScriptFontSize}" />
			  <w:lang w:val="${lang}" w:eastAsia="${lang}" w:bidi="ar-SA" />
			</w:rPr>
		  </w:rPrDefault>
		  <w:pPrDefault>
			<w:pPr>
			  <w:spacing w:after="120" w:line="240" w:lineRule="atLeast" />
			</w:pPr>
		  </w:pPrDefault>
		</w:docDefaults>
		<w:style w:type="paragraph" w:styleId="Normal" w:default="1">
		  <w:name w:val="normal" />
		</w:style>
		<w:style w:type="character" w:styleId="Hyperlink">
		  <w:name w:val="Hyperlink" />
		  <w:rPr>
			<w:color w:val="0000FF" />
			<w:u w:val="single" />
		  </w:rPr>
		</w:style>
		${Object.entries(config).filter(([key]) => key.startsWith("heading")).sort(([a], [b]) => a.localeCompare(b)).map(([key, value]) => generateHeadingStyleXML(key.charAt(0).toUpperCase() + key.slice(1), value)).join("")}
  </w:styles>
  `;
};
//#endregion
//#region src/schemas/theme.ts
const generateThemeXML = (font = defaultFont) => `
    <?xml version="1.0" encoding="UTF-8" standalone="yes"?>

    <a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="Office Theme">
    <a:themeElements>
      <a:clrScheme name="Office">
        <a:dk1>
          <a:sysClr val="windowText" lastClr="000000"/>
        </a:dk1>
        <a:lt1>
          <a:sysClr val="window" lastClr="FFFFFF"/>
        </a:lt1>
        <a:dk2>
          <a:srgbClr val="44546A"/>
        </a:dk2>
        <a:lt2>
          <a:srgbClr val="E7E6E6"/>
        </a:lt2>
        <a:accent1>
          <a:srgbClr val="4472C4"/>
        </a:accent1>
        <a:accent2>
          <a:srgbClr val="ED7D31"/>
        </a:accent2>
        <a:accent3>
          <a:srgbClr val="A5A5A5"/>
        </a:accent3>
        <a:accent4>
          <a:srgbClr val="FFC000"/>
        </a:accent4>
        <a:accent5>
          <a:srgbClr val="5B9BD5"/>
        </a:accent5>
        <a:accent6>
          <a:srgbClr val="70AD47"/>
        </a:accent6>
        <a:hlink>
          <a:srgbClr val="0563C1"/>
        </a:hlink>
        <a:folHlink>
          <a:srgbClr val="954F72"/>
        </a:folHlink>
      </a:clrScheme>
      <a:fontScheme name="Office">
        <a:majorFont>
          <a:latin typeface="${font}"/>
          <a:ea typeface="${font}"/>
          <a:cs typeface=""/>
        </a:majorFont>
        <a:minorFont>
          <a:latin typeface="${font}"/>
          <a:ea typeface="${font}"/>
          <a:cs typeface=""/>
        </a:minorFont>
      </a:fontScheme>
      <a:fmtScheme name="Office">
        <a:fillStyleLst>
          <a:solidFill>
            <a:schemeClr val="phClr"/>
          </a:solidFill>
          <a:gradFill rotWithShape="1">
            <a:gsLst>
              <a:gs pos="0">
                <a:schemeClr val="phClr">
                  <a:lumMod val="110000"/>
                  <a:satMod val="105000"/>
                  <a:tint val="67000"/>
                </a:schemeClr>
              </a:gs>
              <a:gs pos="50000">
                <a:schemeClr val="phClr">
                  <a:lumMod val="105000"/>
                  <a:satMod val="103000"/>
                  <a:tint val="73000"/>
                </a:schemeClr>
              </a:gs>
              <a:gs pos="100000">
                <a:schemeClr val="phClr">
                  <a:lumMod val="105000"/>
                  <a:satMod val="109000"/>
                  <a:tint val="81000"/>
                </a:schemeClr>
              </a:gs>
            </a:gsLst>
            <a:lin ang="5400000" scaled="0"/>
          </a:gradFill>
          <a:gradFill rotWithShape="1">
            <a:gsLst>
              <a:gs pos="0">
                <a:schemeClr val="phClr">
                  <a:satMod val="103000"/>
                  <a:lumMod val="102000"/>
                  <a:tint val="94000"/>
                </a:schemeClr>
              </a:gs>
              <a:gs pos="50000">
                <a:schemeClr val="phClr">
                  <a:satMod val="110000"/>
                  <a:lumMod val="100000"/>
                  <a:shade val="100000"/>
                </a:schemeClr>
              </a:gs>
              <a:gs pos="100000">
                <a:schemeClr val="phClr">
                  <a:lumMod val="99000"/>
                  <a:satMod val="120000"/>
                  <a:shade val="78000"/>
                </a:schemeClr>
              </a:gs>
            </a:gsLst>
            <a:lin ang="5400000" scaled="0"/>
          </a:gradFill>
        </a:fillStyleLst>
        <a:lnStyleLst>
          <a:ln w="6350" cap="flat" cmpd="sng" algn="ctr">
            <a:solidFill>
              <a:schemeClr val="phClr"/>
            </a:solidFill>
            <a:prstDash val="solid"/>
            <a:miter lim="800000"/>
          </a:ln>
          <a:ln w="12700" cap="flat" cmpd="sng" algn="ctr">
            <a:solidFill>
              <a:schemeClr val="phClr"/>
            </a:solidFill>
            <a:prstDash val="solid"/>
            <a:miter lim="800000"/>
          </a:ln>
          <a:ln w="19050" cap="flat" cmpd="sng" algn="ctr">
            <a:solidFill>
              <a:schemeClr val="phClr"/>
            </a:solidFill>
            <a:prstDash val="solid"/>
            <a:miter lim="800000"/>
          </a:ln>
        </a:lnStyleLst>
        <a:effectStyleLst>
          <a:effectStyle>
            <a:effectLst/>
          </a:effectStyle>
          <a:effectStyle>
            <a:effectLst/>
          </a:effectStyle>
          <a:effectStyle>
            <a:effectLst>
              <a:outerShdw blurRad="57150" dist="19050" dir="5400000" algn="ctr" rotWithShape="0">
                <a:srgbClr val="000000">
                  <a:alpha val="63000"/>
                </a:srgbClr>
              </a:outerShdw>
            </a:effectLst>
          </a:effectStyle>
        </a:effectStyleLst>
        <a:bgFillStyleLst>
          <a:solidFill>
            <a:schemeClr val="phClr"/>
          </a:solidFill>
          <a:solidFill>
            <a:schemeClr val="phClr">
              <a:tint val="95000"/>
              <a:satMod val="170000"/>
            </a:schemeClr>
          </a:solidFill>
          <a:gradFill rotWithShape="1">
            <a:gsLst>
              <a:gs pos="0">
                <a:schemeClr val="phClr">
                  <a:tint val="93000"/>
                  <a:satMod val="150000"/>
                  <a:shade val="98000"/>
                  <a:lumMod val="102000"/>
                </a:schemeClr>
              </a:gs>
              <a:gs pos="50000">
                <a:schemeClr val="phClr">
                  <a:tint val="98000"/>
                  <a:satMod val="130000"/>
                  <a:shade val="90000"/>
                  <a:lumMod val="103000"/>
                </a:schemeClr>
              </a:gs>
              <a:gs pos="100000">
                <a:schemeClr val="phClr">
                  <a:shade val="63000"/>
                  <a:satMod val="120000"/>
                </a:schemeClr>
              </a:gs>
            </a:gsLst>
            <a:lin ang="5400000" scaled="0"/>
          </a:gradFill>
        </a:bgFillStyleLst>
      </a:fmtScheme>
    </a:themeElements>
  </a:theme>
`;
//#endregion
//#region src/schemas/web-settings.ts
const webSettingsXML = `
    <?xml version="1.0" encoding="UTF-8" standalone="yes"?>

    <w:webSettings xmlns:w="${namespaces.w}" xmlns:r="${namespaces.r}">
    </w:webSettings>
`;
//#endregion
//#region src/utils/font-family-conversion.ts
const removeSimpleOrDoubleQuotes = /(["'])(.*?)\1/;
const fontFamilyToTableObject = (fontFamilyString, fallbackFont) => {
	const fontFamilyElements = fontFamilyString ? fontFamilyString.split(",").map((fontName) => {
		const trimmedFontName = fontName.trim();
		if (removeSimpleOrDoubleQuotes.test(trimmedFontName)) {
			const match = trimmedFontName.match(removeSimpleOrDoubleQuotes);
			return match ? match[2] : trimmedFontName;
		}
		return trimmedFontName;
	}) : [fallbackFont];
	return {
		fontName: fontFamilyElements[0],
		genericFontName: fontFamilyElements[fontFamilyElements.length - 1] || fontFamilyElements[0]
	};
};
//#endregion
//#region src/utils/image-browser.ts
/**
* Checks whether input MIME type or extension indicates SVG content.
*/
const isSVG = (mimeTypeOrExtension) => {
	if (!mimeTypeOrExtension) return false;
	const normalized = mimeTypeOrExtension.toLowerCase().trim();
	return normalized === "image/svg+xml" || normalized === "image/svg" || normalized === ".svg" || normalized === "svg" || normalized.endsWith(".svg");
};
const convertSVGUnitToPixels = (value, unit) => {
	const factor = SVG_UNIT_TO_PIXEL_CONVERSIONS[unit] || 1;
	return Math.round(value * factor);
};
/**
* Extract SVG width/height in pixels, supporting units and viewBox fallback.
*/
const parseSVGDimensions = (svgString) => {
	const widthMatch = svgString.match(/width\s*=\s*["']?([0-9.]+)([a-z%]*)/i);
	const heightMatch = svgString.match(/height\s*=\s*["']?([0-9.]+)([a-z%]*)/i);
	let width;
	let height;
	if (widthMatch) width = convertSVGUnitToPixels(Number.parseFloat(widthMatch[1]), widthMatch[2]?.toLowerCase() || "px");
	if (heightMatch) height = convertSVGUnitToPixels(Number.parseFloat(heightMatch[1]), heightMatch[2]?.toLowerCase() || "px");
	if (!width || !height) {
		const viewBoxMatch = svgString.match(/viewBox\s*=\s*["']?([0-9.\s-]+)["']?/i);
		if (viewBoxMatch) {
			const parts = viewBoxMatch[1].trim().split(/\s+/);
			if (parts.length === 4) {
				const vbW = Number.parseFloat(parts[2]);
				const vbH = Number.parseFloat(parts[3]);
				if (!width && height && vbW && vbH) width = Math.round(height * vbW / vbH);
				else if (width && !height && vbW && vbH) height = Math.round(width * vbH / vbW);
				else if (!width && !height) {
					width = Math.round(vbW);
					height = Math.round(vbH);
				}
			}
		}
	}
	return {
		width: width || 300,
		height: height || 150
	};
};
/**
* Converts SVG base64 content to PNG base64 using browser Canvas APIs only.
* Returns null when canvas APIs are unavailable.
*/
const convertSVGtoPNGCanvas = (svgBase64, width, height) => {
	const CanvasClass = typeof OffscreenCanvas !== "undefined" ? OffscreenCanvas : null;
	if (!CanvasClass) return Promise.resolve(null);
	return new Promise((resolve) => {
		const svgDataUrl = `data:image/svg+xml;base64,${svgBase64}`;
		const canvas = new CanvasClass(width, height);
		const ctx = canvas.getContext("2d");
		if (!ctx) {
			resolve(null);
			return;
		}
		fetch(svgDataUrl).then((res) => res.blob()).then((blob) => createImageBitmap(blob, {
			resizeWidth: width,
			resizeHeight: height
		})).then((bitmap) => {
			ctx.drawImage(bitmap, 0, 0, width, height);
			return canvas.convertToBlob({ type: "image/png" });
		}).then((blob) => blob.arrayBuffer()).then((arrayBuffer) => {
			if (typeof Buffer !== "undefined") resolve(Buffer.from(arrayBuffer).toString("base64"));
			else {
				const bytes = new Uint8Array(arrayBuffer);
				let binary = "";
				for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]);
				resolve(globalThis.btoa(binary));
			}
		}).catch(() => {
			resolve(null);
		});
	});
};
/**
* Converts SVG base64 to PNG base64.
* Uses only browser APIs and never attempts Node-native processing.
* Returns null when conversion is unavailable — SVG will be embedded natively.
*/
const convertSVGtoPNG = async (svgBase64, width, height) => {
	return convertSVGtoPNGCanvas(svgBase64, width, height);
};
//#endregion
//#region src/utils/list.ts
var ListStyleBuilder = class {
	constructor(defaults) {
		_defineProperty(this, "defaults", void 0);
		this.defaults = defaults || { defaultOrderedListStyleType: "decimal" };
	}
	getListStyleType(listType) {
		switch (listType) {
			case "upper-roman": return "upperRoman";
			case "lower-roman": return "lowerRoman";
			case "upper-alpha":
			case "upper-alpha-bracket-end": return "upperLetter";
			case "lower-alpha":
			case "lower-alpha-bracket-end": return "lowerLetter";
			case "decimal":
			case "decimal-bracket": return "decimal";
			default: return this.defaults.defaultOrderedListStyleType;
		}
	}
	getListPrefixSuffix(style, lvl) {
		let listType = this.defaults.defaultOrderedListStyleType;
		if (style?.["list-style-type"]) listType = style["list-style-type"];
		switch (listType) {
			case "upper-roman":
			case "lower-roman":
			case "upper-alpha":
			case "lower-alpha": return `%${lvl + 1}.`;
			case "upper-alpha-bracket-end":
			case "lower-alpha-bracket-end":
			case "decimal-bracket-end": return `%${lvl + 1})`;
			case "decimal-bracket": return `(%${lvl + 1})`;
			default: return `%${lvl + 1}.`;
		}
	}
	getUnorderedListPrefixSuffix(style) {
		switch (style?.["list-style-type"] || "") {
			case "square": return "";
			case "circle": return "o";
			default: return "";
		}
	}
};
//#endregion
//#region src/docx-document.ts
function generateContentTypesFragments(contentTypesXML, type, objects) {
	if (objects && Array.isArray(objects)) objects.forEach((object) => {
		const id = type === "header" ? object.headerId : object.footerId;
		const contentTypesFragment = fragment({ defaultNamespace: { ele: namespaces.contentTypes } }).ele("Override").att("PartName", `/word/${type}${id}.xml`).att("ContentType", `application/vnd.openxmlformats-officedocument.wordprocessingml.${type}+xml`).up();
		contentTypesXML.root().import(contentTypesFragment);
	});
}
function generateSectionReferenceXML(documentXML, documentSectionType, objects, isEnabled) {
	if (isEnabled && objects && Array.isArray(objects) && objects.length > 0) {
		const xmlFragment = fragment();
		objects.forEach(({ relationshipId, type }) => {
			const objectFragment = fragment({ namespaceAlias: {
				w: namespaces.w,
				r: namespaces.r
			} }).ele("@w", `${documentSectionType}Reference`).att("@r", "id", `rId${relationshipId}`).att("@w", "type", type).up();
			xmlFragment.import(objectFragment);
		});
		documentXML.root().first().first().import(xmlFragment);
	}
}
function generateXMLString(xmlString, direction) {
	const xmlDocumentString = create({
		encoding: "UTF-8",
		standalone: true
	}, xmlString);
	if (direction === "rtl") {
		const rtlStyle = fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", "style").att("@w", "type", "paragraph").att("@w", "styleId", "RTLDefault").ele("@w", "name").att("@w", "val", "RTL Default").up().ele("@w", "pPr").ele("@w", "jc").att("@w", "val", "right").up().ele("@w", "bidi").up().up().up();
		xmlDocumentString.root().import(rtlStyle);
	}
	return xmlDocumentString.toString({ prettyPrint: true });
}
async function generateSectionXML(vTree, type = "header") {
	const sectionXML = create({
		encoding: "UTF-8",
		standalone: true,
		namespaceAlias: {
			w: namespaces.w,
			ve: namespaces.ve,
			o: namespaces.o,
			r: namespaces.r,
			v: namespaces.v,
			wp: namespaces.wp,
			w10: namespaces.w10
		}
	}).ele("@w", type === "header" ? "hdr" : "ftr");
	const XMLFragment = fragment();
	await convertVTreeToXML(this, vTree, XMLFragment);
	if (type === "footer" && XMLFragment.first().node.tagName === "p" && this.pageNumber) XMLFragment.first().import(fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", "fldSimple").att("@w", "instr", "PAGE").ele("@w", "r").up().up());
	sectionXML.root().import(XMLFragment);
	const lastIdKey = `last${type === "header" ? "Header" : "Footer"}Id`;
	this[lastIdKey] += 1;
	if (type === "header") return {
		headerId: this.lastHeaderId,
		headerXML: sectionXML
	};
	return {
		footerId: this.lastFooterId,
		footerXML: sectionXML
	};
}
var DocxDocument = class {
	constructor(properties) {
		_defineProperty(this, "availableDocumentSpace", void 0);
		_defineProperty(this, "complexScriptFontSize", void 0);
		_defineProperty(this, "createdAt", void 0);
		_defineProperty(this, "creator", void 0);
		_defineProperty(this, "description", void 0);
		_defineProperty(this, "direction", void 0);
		_defineProperty(this, "documentXML", void 0);
		_defineProperty(this, "font", void 0);
		_defineProperty(this, "fontSize", void 0);
		_defineProperty(this, "footer", void 0);
		_defineProperty(this, "footerObjects", void 0);
		_defineProperty(this, "footerType", void 0);
		_defineProperty(this, "header", void 0);
		_defineProperty(this, "headerObjects", void 0);
		_defineProperty(this, "headerType", void 0);
		_defineProperty(this, "heading", void 0);
		_defineProperty(this, "height", void 0);
		_defineProperty(this, "htmlString", void 0);
		_defineProperty(this, "imageProcessing", void 0);
		_defineProperty(this, "keywords", void 0);
		_defineProperty(this, "lang", void 0);
		_defineProperty(this, "lastFooterId", void 0);
		_defineProperty(this, "lastHeaderId", void 0);
		_defineProperty(this, "lastMediaId", void 0);
		_defineProperty(this, "lastModifiedBy", void 0);
		_defineProperty(this, "lastNumberingId", void 0);
		_defineProperty(this, "lineNumber", void 0);
		_defineProperty(this, "ListStyleBuilder", void 0);
		_defineProperty(this, "margins", void 0);
		_defineProperty(this, "mediaFiles", void 0);
		_defineProperty(this, "modifiedAt", void 0);
		_defineProperty(this, "numberingObjects", void 0);
		_defineProperty(this, "fontTableObjects", void 0);
		_defineProperty(this, "orientation", void 0);
		_defineProperty(this, "pageNumber", void 0);
		_defineProperty(this, "pageSize", void 0);
		_defineProperty(this, "relationshipFilename", void 0);
		_defineProperty(this, "relationships", void 0);
		_defineProperty(this, "revision", void 0);
		_defineProperty(this, "skipFirstHeaderFooter", void 0);
		_defineProperty(this, "stylesObjects", void 0);
		_defineProperty(this, "subject", void 0);
		_defineProperty(this, "tableRowCantSplit", void 0);
		_defineProperty(this, "title", void 0);
		_defineProperty(this, "width", void 0);
		_defineProperty(this, "zip", void 0);
		_defineProperty(this, "_imageCache", void 0);
		_defineProperty(this, "_retryStats", void 0);
		_defineProperty(this, "_trackingState", void 0);
		_defineProperty(this, "comments", void 0);
		_defineProperty(this, "commentIdMap", void 0);
		_defineProperty(this, "lastCommentId", void 0);
		_defineProperty(this, "revisionIdMap", void 0);
		_defineProperty(this, "lastRevisionId", void 0);
		_defineProperty(this, "generateSectionXML", void 0);
		this.zip = properties.zip;
		this.htmlString = properties.htmlString;
		this.orientation = properties.orientation || "portrait";
		this.pageSize = properties.pageSize || defaultDocumentOptions.pageSize;
		const isPortraitOrientation = this.orientation === defaultOrientation;
		const height = this.pageSize.height ? this.pageSize.height : landscapeHeight;
		const width = this.pageSize.width ? this.pageSize.width : landscapeWidth;
		this.width = isPortraitOrientation ? width : height;
		this.height = isPortraitOrientation ? height : width;
		const marginsObject = properties.margins;
		const defaultMargins = isPortraitOrientation ? portraitMargins : landscapeMargins;
		this.margins = marginsObject && Object.keys(marginsObject).length > 0 ? {
			...defaultMargins,
			...marginsObject
		} : defaultMargins;
		this.availableDocumentSpace = this.width - this.margins.left - this.margins.right;
		this.title = properties.title || "";
		this.subject = properties.subject || "";
		this.creator = properties.creator || "html-to-docx";
		this.keywords = properties.keywords || ["html-to-docx"];
		this.description = properties.description || "";
		this.lastModifiedBy = properties.lastModifiedBy || "html-to-docx";
		this.revision = properties.revision || 1;
		this.createdAt = properties.createdAt || /* @__PURE__ */ new Date();
		this.modifiedAt = properties.modifiedAt || /* @__PURE__ */ new Date();
		this.headerType = properties.headerType || "default";
		this.header = properties.header || false;
		this.footerType = properties.footerType || "default";
		this.footer = properties.footer || false;
		this.font = properties.font || "Times New Roman";
		this.fontSize = properties.fontSize ?? 22;
		this.complexScriptFontSize = properties.complexScriptFontSize ?? 22;
		this.lang = properties.lang || "en-US";
		this.direction = properties.direction || "ltr";
		this.heading = properties.heading || defaultDocumentOptions.heading;
		this.imageProcessing = properties.imageProcessing || defaultDocumentOptions.imageProcessing;
		this.tableRowCantSplit = properties.table?.row?.cantSplit || false;
		this.pageNumber = properties.pageNumber || false;
		this.skipFirstHeaderFooter = properties.skipFirstHeaderFooter || false;
		this.lineNumber = properties.lineNumber ? properties.lineNumberOptions || null : null;
		this.lastNumberingId = 0;
		this.lastMediaId = 0;
		this.lastHeaderId = 0;
		this.lastFooterId = 0;
		this.stylesObjects = [];
		this.numberingObjects = [];
		this.fontTableObjects = [];
		this.relationshipFilename = documentFileName;
		this.relationships = [{
			fileName: documentFileName,
			lastRelsId: 5,
			rels: []
		}];
		this.mediaFiles = [];
		this.headerObjects = [];
		this.footerObjects = [];
		this.documentXML = null;
		this.comments = [];
		this.commentIdMap = /* @__PURE__ */ new Map();
		this.lastCommentId = 0;
		this.revisionIdMap = /* @__PURE__ */ new Map();
		this.lastRevisionId = 0;
		this.generateContentTypesXML = this.generateContentTypesXML.bind(this);
		this.generateDocumentXML = this.generateDocumentXML.bind(this);
		this.generateCoreXML = this.generateCoreXML.bind(this);
		this.generateSettingsXML = this.generateSettingsXML.bind(this);
		this.generateWebSettingsXML = this.generateWebSettingsXML.bind(this);
		this.generateStylesXML = this.generateStylesXML.bind(this);
		this.generateFontTableXML = this.generateFontTableXML.bind(this);
		this.generateThemeXML = this.generateThemeXML.bind(this);
		this.generateNumberingXML = this.generateNumberingXML.bind(this);
		this.generateRelsXML = this.generateRelsXML.bind(this);
		this.createMediaFile = this.createMediaFile.bind(this);
		this.createDocumentRelationships = this.createDocumentRelationships.bind(this);
		this.generateHeaderXML = this.generateHeaderXML.bind(this);
		this.generateFooterXML = this.generateFooterXML.bind(this);
		this.generateSectionXML = generateSectionXML.bind(this);
		this.generateCommentsXML = this.generateCommentsXML.bind(this);
		this.ensureComment = this.ensureComment.bind(this);
		this.getCommentId = this.getCommentId.bind(this);
		this.getRevisionId = this.getRevisionId.bind(this);
		this.ListStyleBuilder = new ListStyleBuilder(properties.numbering);
	}
	generateContentTypesXML() {
		const contentTypesXML$1 = create({
			encoding: "UTF-8",
			standalone: true
		}, contentTypesXML);
		generateContentTypesFragments(contentTypesXML$1, "header", this.headerObjects);
		generateContentTypesFragments(contentTypesXML$1, "footer", this.footerObjects);
		if (this.mediaFiles.some((m) => m.isSVG)) {
			const svgFrag = fragment({ defaultNamespace: { ele: namespaces.contentTypes } }).ele("Default").att("Extension", "svg").att("ContentType", "image/svg+xml").up();
			contentTypesXML$1.root().import(svgFrag);
		}
		if (this.comments.length > 0) [
			{
				contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml",
				partName: "/word/comments.xml"
			},
			{
				contentType: commentsExtendedContentType,
				partName: "/word/commentsExtended.xml"
			},
			{
				contentType: commentsIdsContentType,
				partName: "/word/commentsIds.xml"
			},
			{
				contentType: commentsExtensibleContentType,
				partName: "/word/commentsExtensible.xml"
			},
			{
				contentType: peopleContentType,
				partName: "/word/people.xml"
			}
		].forEach(({ contentType, partName }) => {
			const frag = fragment({ defaultNamespace: { ele: namespaces.contentTypes } }).ele("Override").att("PartName", partName).att("ContentType", contentType).up();
			contentTypesXML$1.root().import(frag);
		});
		return contentTypesXML$1.toString({ prettyPrint: true });
	}
	generateDocumentXML() {
		const documentXML = create({
			encoding: "UTF-8",
			standalone: true
		}, generateDocumentTemplate(this.width, this.height, this.orientation, this.margins));
		documentXML.root().first().import(this.documentXML);
		generateSectionReferenceXML(documentXML, "header", this.headerObjects, this.header);
		generateSectionReferenceXML(documentXML, "footer", this.footerObjects, this.footer);
		if ((this.header || this.footer) && this.skipFirstHeaderFooter) documentXML.root().first().first().import(fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", "titlePg"));
		if (this.lineNumber) {
			const { countBy, start, restart } = this.lineNumber;
			documentXML.root().first().first().import(fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", "lnNumType").att("@w", "countBy", String(countBy)).att("@w", "start", String(start)).att("@w", "restart", restart));
		}
		let xmlString = documentXML.toString({ prettyPrint: true });
		[
			"inline",
			"anchor",
			"simplePos",
			"positionH",
			"positionV",
			"posOffset",
			"extent",
			"effectExtent",
			"wrapNone",
			"wrapSquare",
			"wrapTight",
			"wrapThrough",
			"docPr"
		].forEach((el) => {
			xmlString = xmlString.replace(new RegExp(`<w:${el}([ />])`, "g"), `<wp:${el}$1`);
			xmlString = xmlString.replace(new RegExp(`</w:${el}>`, "g"), `</wp:${el}>`);
		});
		[
			"graphic",
			"graphicData",
			"blip",
			"srcRect",
			"stretch",
			"fillRect",
			"xfrm",
			"off",
			"ext",
			"prstGeom"
		].forEach((el) => {
			xmlString = xmlString.replace(new RegExp(`<w:${el}([ />])`, "g"), `<a:${el}$1`);
			xmlString = xmlString.replace(new RegExp(`</w:${el}>`, "g"), `</a:${el}>`);
		});
		[
			"pic",
			"nvPicPr",
			"cNvPr",
			"cNvPicPr",
			"blipFill",
			"spPr"
		].forEach((el) => {
			xmlString = xmlString.replace(new RegExp(`<w:${el}([ />])`, "g"), `<pic:${el}$1`);
			xmlString = xmlString.replace(new RegExp(`</w:${el}>`, "g"), `</pic:${el}>`);
		});
		xmlString = xmlString.replace(/<w:svgBlip([ />])/g, "<asvg:svgBlip$1").replace(/<\/w:svgBlip>/g, "</asvg:svgBlip>");
		xmlString = xmlString.replace(/(<w:body>)\s*(<w:sectPr[\s\S]*?<\/w:sectPr>)([\s\S]*?)(<\/w:body>)/, "$1$3$2$4");
		xmlString = xmlString.replace(/(<w:sectPr[^>]*>)([\s\S]*?)(<\/w:sectPr>)/g, (_match, open, inner, close) => {
			const refs = [];
			const rest = inner.replace(/<w:(header|footer)Reference[^/]*\/>/g, (refMatch) => {
				refs.push(refMatch);
				return "";
			});
			return `${open}${refs.join("")}${rest}${close}`;
		});
		const deadTokens = findDocxTrackingTokens(xmlString);
		if (deadTokens.length > 0) {
			const uniqueTokens = Array.from(new Set(deadTokens));
			const sample = uniqueTokens.slice(0, 3).join(", ");
			const suffix = uniqueTokens.length > 3 ? ` (+${uniqueTokens.length - 3} more)` : "";
			console.warn(`[docx] dead tracking tokens in document.xml: ${sample}${suffix}`);
		}
		return xmlString;
	}
	generateCoreXML() {
		return generateXMLString(generateCoreXML(this.title, this.subject, this.creator, this.keywords, this.description, this.lastModifiedBy, this.revision, this.createdAt, this.modifiedAt));
	}
	generateSettingsXML() {
		return generateXMLString(settingsXML);
	}
	generateWebSettingsXML() {
		return generateXMLString(webSettingsXML);
	}
	generateStylesXML() {
		return generateXMLString(generateStylesXML(this.font, this.fontSize, this.complexScriptFontSize, this.lang, this.heading), this.direction);
	}
	generateFontTableXML() {
		const fontTableXML$1 = create({
			encoding: "UTF-8",
			standalone: true
		}, fontTableXML);
		const fontNames = [
			"Arial",
			"Calibri",
			"Calibri Light",
			"Courier New",
			"Symbol",
			"Times New Roman"
		];
		this.fontTableObjects.forEach(({ fontName, genericFontName }) => {
			if (!fontNames.includes(fontName)) {
				fontNames.push(fontName);
				const fontFragment = fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", "font").att("@w", "name", fontName);
				switch (genericFontName) {
					case "serif":
						fontFragment.ele("@w", "altName").att("@w", "val", "Times New Roman");
						fontFragment.ele("@w", "family").att("@w", "val", "roman");
						fontFragment.ele("@w", "pitch").att("@w", "val", "variable");
						break;
					case "sans-serif":
						fontFragment.ele("@w", "altName").att("@w", "val", "Arial");
						fontFragment.ele("@w", "family").att("@w", "val", "swiss");
						fontFragment.ele("@w", "pitch").att("@w", "val", "variable");
						break;
					case "monospace":
						fontFragment.ele("@w", "altName").att("@w", "val", "Courier New");
						fontFragment.ele("@w", "family").att("@w", "val", "modern");
						fontFragment.ele("@w", "pitch").att("@w", "val", "fixed");
						break;
					default: break;
				}
				fontTableXML$1.root().import(fontFragment);
			}
		});
		return fontTableXML$1.toString({ prettyPrint: true });
	}
	generateThemeXML() {
		return generateXMLString(generateThemeXML(this.font));
	}
	generateNumberingXML() {
		const numberingXML = create({
			encoding: "UTF-8",
			standalone: true
		}, generateNumberingXMLTemplate());
		const abstractNumberingFragments = fragment();
		const numberingFragments = fragment();
		this.numberingObjects.forEach(({ numberingId, type, properties }) => {
			const abstractNumberingFragment = fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", "abstractNum").att("@w", "abstractNumId", String(numberingId));
			let startValue = 1;
			if (properties.attributes?.["data-start"]) startValue = Number.parseInt(properties.attributes["data-start"], 10);
			else if (properties.start) startValue = properties.start;
			Array.from({ length: 9 }, (_, level) => level).forEach((level) => {
				const levelFragment = fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", "lvl").att("@w", "ilvl", String(level)).ele("@w", "start").att("@w", "val", String(type === "ol" ? startValue : 1)).up().ele("@w", "numFmt").att("@w", "val", type === "ol" ? this.ListStyleBuilder.getListStyleType(properties.style?.["list-style-type"]) : "bullet").up().ele("@w", "lvlText").att("@w", "val", type === "ol" ? this.ListStyleBuilder.getListPrefixSuffix(properties.style, level) : this.ListStyleBuilder.getUnorderedListPrefixSuffix(properties.style)).up().ele("@w", "lvlJc").att("@w", "val", "left").up().ele("@w", "pPr").ele("@w", "tabs").ele("@w", "tab").att("@w", "val", "num").att("@w", "pos", String((level + 1) * 720)).up().up().ele("@w", "ind").att("@w", "left", String((level + 1) * 720)).att("@w", "hanging", "360").up().up().up();
				if (type === "ul") levelFragment.last().import(fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", "rPr").ele("@w", "rFonts").att("@w", "ascii", "Symbol").att("@w", "hAnsi", "Symbol").att("@w", "hint", "default").up().up());
				abstractNumberingFragment.import(levelFragment);
			});
			abstractNumberingFragment.up();
			abstractNumberingFragments.import(abstractNumberingFragment);
			numberingFragments.import(fragment({ namespaceAlias: { w: namespaces.w } }).ele("@w", "num").att("@w", "numId", String(numberingId)).ele("@w", "abstractNumId").att("@w", "val", String(numberingId)).up().up());
		});
		numberingXML.root().import(abstractNumberingFragments);
		numberingXML.root().import(numberingFragments);
		return numberingXML.toString({ prettyPrint: true });
	}
	appendRelationships(xmlFragment, relationships) {
		relationships.forEach(({ relationshipId, type, target, targetMode }) => {
			xmlFragment.import(fragment({ defaultNamespace: { ele: namespaces.relationship } }).ele("Relationship").att("Id", `rId${relationshipId}`).att("Type", type).att("Target", target).att("TargetMode", targetMode).up());
		});
	}
	generateRelsXML() {
		return this.relationships.map(({ fileName, rels }) => {
			const xmlFragment = create({
				encoding: "UTF-8",
				standalone: true
			}, fileName === "document" ? documentRelsXML : genericRelsXML);
			this.appendRelationships(xmlFragment.root(), rels);
			return {
				fileName,
				xmlString: xmlFragment.toString({ prettyPrint: true })
			};
		});
	}
	createNumbering(type, properties) {
		this.lastNumberingId += 1;
		this.numberingObjects.push({
			numberingId: this.lastNumberingId,
			type,
			properties
		});
		return this.lastNumberingId;
	}
	createFont(fontFamily) {
		const fontTableObject = fontFamilyToTableObject(fontFamily, this.font);
		this.fontTableObjects.push(fontTableObject);
		return fontTableObject.fontName;
	}
	async createMediaFile(base64String) {
		const parsed = parseDataUrl(base64String);
		if (!parsed) throw new Error("Invalid base64 string");
		let base64FileContent = parsed.base64;
		let mimeType = parsed.mimeType;
		const mimeTypePart = mimeType.match(/\/(.*?)$/);
		let fileExtension = !mimeTypePart || mimeTypePart[1] === "octet-stream" ? "png" : mimeTypePart[1];
		if (isSVG(mimeType)) if ((this.imageProcessing?.svgHandling ?? "convert") === "convert") try {
			const { width, height } = parseSVGDimensions(typeof Buffer !== "undefined" ? Buffer.from(base64FileContent, "base64").toString("utf-8") : globalThis.atob(base64FileContent));
			const pngBase64 = await convertSVGtoPNG(base64FileContent, width, height);
			if (pngBase64) {
				base64FileContent = pngBase64;
				fileExtension = "png";
				mimeType = "image/png";
			} else fileExtension = "svg";
		} catch {
			fileExtension = "svg";
		}
		else fileExtension = "svg";
		const fileNameWithExtension = `image-${nanoid()}.${fileExtension}`;
		this.lastMediaId += 1;
		const mediaFile = {
			id: this.lastMediaId,
			fileContent: base64FileContent,
			fileNameWithExtension,
			isSVG: fileExtension === "svg"
		};
		this.mediaFiles.push(mediaFile);
		return mediaFile;
	}
	createDocumentRelationships(fileName, type, target, targetMode = "External") {
		let relationshipObject = this.relationships.find((relationship) => relationship.fileName === fileName);
		let lastRelsId = 1;
		if (relationshipObject) {
			lastRelsId = relationshipObject.lastRelsId + 1;
			relationshipObject.lastRelsId = lastRelsId;
		} else {
			relationshipObject = {
				fileName,
				lastRelsId,
				rels: []
			};
			this.relationships.push(relationshipObject);
		}
		let relationshipType;
		switch (type) {
			case hyperlinkType:
				relationshipType = namespaces.hyperlinks;
				break;
			case imageType:
				relationshipType = namespaces.images;
				break;
			case commentsType:
				relationshipType = namespaces.comments;
				break;
			case headerType:
				relationshipType = namespaces.headers;
				break;
			case footerType:
				relationshipType = namespaces.footers;
				break;
			case themeType:
				relationshipType = namespaces.themes;
				break;
			default:
				relationshipType = type;
				break;
		}
		relationshipObject.rels.push({
			relationshipId: lastRelsId,
			type: relationshipType,
			target,
			targetMode
		});
		return lastRelsId;
	}
	generateHeaderXML(vTree) {
		return this.generateSectionXML(vTree, "header");
	}
	generateFooterXML(vTree) {
		return this.generateSectionXML(vTree, "footer");
	}
	/**
	* Get a revision ID for a suggestion. Creates a new one if needed.
	* Ensures consistent IDs for the same suggestion across multiple occurrences.
	*/
	getRevisionId(id) {
		if (!id) {
			this.lastRevisionId += 1;
			return this.lastRevisionId;
		}
		const existing = this.revisionIdMap.get(id);
		if (existing !== void 0) return existing;
		this.lastRevisionId += 1;
		this.revisionIdMap.set(id, this.lastRevisionId);
		return this.lastRevisionId;
	}
	/**
	* Ensure a comment exists in the document and return its numeric ID.
	* Updates metadata if the comment already exists but had missing fields.
	*/
	ensureComment(data, parentParaId) {
		const { id, authorName, authorInitials, date, text } = data;
		const commentId = id !== void 0 ? id : `comment-${this.lastCommentId + 1}`;
		let numericId = this.commentIdMap.get(commentId);
		if (numericId === void 0) {
			this.lastCommentId += 1;
			numericId = this.lastCommentId;
			this.commentIdMap.set(commentId, numericId);
		}
		const existing = this.comments.find((item) => item.id === numericId);
		if (existing) {
			if (!existing.authorName && authorName) existing.authorName = authorName;
			if (!existing.authorInitials && authorInitials) existing.authorInitials = authorInitials;
			if (!existing.date && date) existing.date = date;
			if (!existing.text && text) existing.text = text;
			if (!existing.parentParaId && parentParaId) existing.parentParaId = parentParaId;
			return numericId;
		}
		let paraId;
		if (data.paraId) {
			paraId = data.paraId;
			allocatedIds.add(paraId);
		} else paraId = generateHexId();
		const entry = {
			id: numericId,
			authorName: authorName || "unknown",
			authorInitials: authorInitials || "",
			date,
			durableId: generateHexId(),
			paraId,
			parentParaId,
			text: text || "Imported comment"
		};
		this.comments.push(entry);
		return numericId;
	}
	/**
	* Get the numeric ID for a comment, creating it if necessary.
	*/
	getCommentId(id) {
		if (id === void 0 || id === null) return this.ensureComment({ id: void 0 });
		return this.ensureComment({ id });
	}
	/**
	* Generate the comments.xml file content.
	* Matches reference library structure: w14:paraId on paragraphs,
	* CommentReference style on first run, text runs with formatting.
	*/
	generateCommentsXML() {
		const w = namespaces.w;
		const commentsXML = create(COMMENTS_TEMPLATE);
		const root = commentsXML.root();
		this.comments.forEach((comment) => {
			const commentElement = root.ele(w, "comment").att(w, "id", String(comment.id)).att(w, "author", comment.authorName || "unknown");
			if (comment.authorInitials) commentElement.att(w, "initials", comment.authorInitials);
			if (comment.date) commentElement.att(w, "date", comment.date);
			String(comment.text || "").split(/\r?\n/).forEach((line, pIdx) => {
				const pElement = commentElement.ele(w, "p");
				pElement.att(namespaces.w14, "paraId", comment.paraId);
				pElement.att(namespaces.w14, "textId", "77777777");
				pElement.ele(w, "pPr").ele(w, "pStyle").att(w, "val", "CommentText").up().up();
				if (pIdx === 0) {
					const refRun = pElement.ele(w, "r");
					refRun.ele(w, "rPr").ele(w, "rStyle").att(w, "val", "CommentReference").up().up();
					refRun.ele(w, "annotationRef").up();
					refRun.up();
				}
				const textRun = pElement.ele(w, "r");
				textRun.ele(w, "rPr").ele(w, "color").att(w, "val", "000000").up().ele(w, "sz").att(w, "val", "20").up().ele(w, "szCs").att(w, "val", "20").up().up();
				textRun.ele(w, "t").att("http://www.w3.org/XML/1998/namespace", "space", "preserve").txt(line).up();
				textRun.up();
				pElement.up();
			});
			commentElement.up();
		});
		return commentsXML.end({ prettyPrint: true });
	}
	/**
	* Generate word/commentsExtended.xml.
	* Links comments via paraId and establishes parent-child threading via paraIdParent.
	*/
	generateCommentsExtendedXML() {
		const doc = create(COMMENTS_EXTENDED_TEMPLATE);
		const root = doc.root();
		this.comments.forEach((comment) => {
			const el = root.ele(namespaces.w15, "commentEx");
			el.att(namespaces.w15, "paraId", comment.paraId);
			el.att(namespaces.w15, "done", "0");
			if (comment.parentParaId) el.att(namespaces.w15, "paraIdParent", comment.parentParaId);
			el.up();
		});
		return doc.end({ prettyPrint: true });
	}
	/**
	* Generate word/commentsIds.xml.
	* Maps paraId to durableId for each comment.
	*/
	generateCommentsIdsXML() {
		const doc = create(COMMENTS_IDS_TEMPLATE);
		const root = doc.root();
		this.comments.forEach((comment) => {
			const el = root.ele(namespaces.w16cid, "commentId");
			el.att(namespaces.w16cid, "paraId", comment.paraId);
			el.att(namespaces.w16cid, "durableId", comment.durableId);
			el.up();
		});
		return doc.end({ prettyPrint: true });
	}
	/**
	* Generate word/commentsExtensible.xml.
	* Links durableId to dateUtc for each comment.
	*/
	generateCommentsExtensibleXML() {
		const doc = create(COMMENTS_EXTENSIBLE_TEMPLATE);
		const root = doc.root();
		this.comments.forEach((comment) => {
			const el = root.ele(namespaces.w16cex, "commentExtensible");
			el.att(namespaces.w16cex, "durableId", comment.durableId);
			if (comment.date) {
				const fakeMs = new Date(comment.date).getTime();
				const tzMs = new Date(comment.date).getTimezoneOffset() * 6e4;
				const realUtc = new Date(fakeMs + tzMs);
				el.att(namespaces.w16cex, "dateUtc", Number.isNaN(realUtc.getTime()) ? comment.date : realUtc.toISOString());
			}
			el.up();
		});
		return doc.end({ prettyPrint: true });
	}
	/**
	* Generate word/people.xml.
	* Contains unique author entries with presence info.
	*/
	generatePeopleXML() {
		const doc = create(PEOPLE_TEMPLATE);
		const root = doc.root();
		const uniqueAuthors = /* @__PURE__ */ new Set();
		this.comments.forEach((comment) => {
			if (comment.authorName) uniqueAuthors.add(comment.authorName);
		});
		uniqueAuthors.forEach((author) => {
			const personEl = root.ele(namespaces.w15, "person");
			personEl.att(namespaces.w15, "author", author);
			personEl.ele(namespaces.w15, "presenceInfo").att(namespaces.w15, "providerId", "None").att(namespaces.w15, "userId", author).up();
			personEl.up();
		});
		return doc.end({ prettyPrint: true });
	}
};
//#endregion
//#region src/html-to-docx.ts
const convertHTML = createHTMLtoVDOM();
const fixupFontSize = (fontSize) => {
	let normalizedFontSize;
	if (typeof fontSize === "string" && pointRegex.test(fontSize)) {
		const matchedParts = fontSize.match(pointRegex);
		if (matchedParts) normalizedFontSize = pointToHIP(Number.parseFloat(matchedParts[1]));
		else normalizedFontSize = null;
	} else if (fontSize !== void 0) normalizedFontSize = typeof fontSize === "number" ? fontSize : Number.parseInt(fontSize, 10);
	else normalizedFontSize = null;
	return normalizedFontSize;
};
const normalizeUnits = (dimensioningObject, defaultDimensionsProperty) => {
	let normalizedUnitResult = {};
	if (typeof dimensioningObject === "object" && dimensioningObject !== null) Object.keys(dimensioningObject).forEach((key) => {
		const value = dimensioningObject[key];
		const defaultValue = defaultDimensionsProperty[key];
		if (typeof value === "string" && pixelRegex.test(value)) {
			const matchedParts = value.match(pixelRegex);
			if (matchedParts) normalizedUnitResult[key] = pixelToTWIP(Number.parseFloat(matchedParts[1]));
		} else if (typeof value === "string" && cmRegex.test(value)) {
			const matchedParts = value.match(cmRegex);
			if (matchedParts) normalizedUnitResult[key] = cmToTWIP(Number.parseFloat(matchedParts[1]));
		} else if (typeof value === "string" && inchRegex.test(value)) {
			const matchedParts = value.match(inchRegex);
			if (matchedParts) normalizedUnitResult[key] = inchToTWIP(Number.parseFloat(matchedParts[1]));
		} else if (value !== void 0 && value !== null && value !== 0 && value !== "0") normalizedUnitResult[key] = typeof value === "number" ? value : Number.parseInt(value, 10);
		else normalizedUnitResult[key] = defaultValue;
	});
	else return null;
	return normalizedUnitResult;
};
const normalizeDocumentOptions = (documentOptions) => {
	const result = {};
	if (documentOptions.createdAt !== void 0) result.createdAt = documentOptions.createdAt;
	if (documentOptions.creator !== void 0) result.creator = documentOptions.creator;
	if (documentOptions.decodeUnicode !== void 0) result.decodeUnicode = documentOptions.decodeUnicode;
	if (documentOptions.defaultLang !== void 0) result.defaultLang = documentOptions.defaultLang;
	if (documentOptions.description !== void 0) result.description = documentOptions.description;
	if (documentOptions.direction !== void 0) result.direction = documentOptions.direction;
	if (documentOptions.font !== void 0) result.font = documentOptions.font;
	if (documentOptions.footer !== void 0) result.footer = documentOptions.footer;
	if (documentOptions.footerType !== void 0) result.footerType = documentOptions.footerType;
	if (documentOptions.header !== void 0) result.header = documentOptions.header;
	if (documentOptions.headerType !== void 0) result.headerType = documentOptions.headerType;
	if (documentOptions.heading !== void 0) result.heading = documentOptions.heading;
	if (documentOptions.imageProcessing !== void 0) result.imageProcessing = documentOptions.imageProcessing;
	if (documentOptions.keywords !== void 0) result.keywords = documentOptions.keywords;
	if (documentOptions.lastModifiedBy !== void 0) result.lastModifiedBy = documentOptions.lastModifiedBy;
	if (documentOptions.lineNumber !== void 0) result.lineNumber = documentOptions.lineNumber;
	if (documentOptions.lineNumberOptions !== void 0) result.lineNumberOptions = documentOptions.lineNumberOptions;
	if (documentOptions.modifiedAt !== void 0) result.modifiedAt = documentOptions.modifiedAt;
	if (documentOptions.numbering !== void 0) result.numbering = documentOptions.numbering;
	if (documentOptions.orientation !== void 0) result.orientation = documentOptions.orientation;
	if (documentOptions.pageNumber !== void 0) result.pageNumber = documentOptions.pageNumber;
	if (documentOptions.revision !== void 0) result.revision = documentOptions.revision;
	if (documentOptions.skipFirstHeaderFooter !== void 0) result.skipFirstHeaderFooter = documentOptions.skipFirstHeaderFooter;
	if (documentOptions.subject !== void 0) result.subject = documentOptions.subject;
	if (documentOptions.table !== void 0) result.table = documentOptions.table;
	if (documentOptions.title !== void 0) result.title = documentOptions.title;
	if (documentOptions.pageSize !== void 0) result.pageSize = normalizeUnits(documentOptions.pageSize, defaultDocumentOptions.pageSize);
	if (documentOptions.margins !== void 0) result.margins = normalizeUnits(documentOptions.margins, defaultDocumentOptions.margins);
	if (documentOptions.fontSize !== void 0) result.fontSize = fixupFontSize(documentOptions.fontSize);
	if (documentOptions.complexScriptFontSize !== void 0) result.complexScriptFontSize = fixupFontSize(documentOptions.complexScriptFontSize);
	return result;
};
async function addFilesToContainer(zip, htmlString, suppliedDocumentOptions, headerHTMLString, footerHTMLString) {
	const normalizedDocumentOptions = normalizeDocumentOptions(suppliedDocumentOptions);
	const documentOptions = {
		...defaultDocumentOptions,
		...normalizedDocumentOptions
	};
	let headerHTML = headerHTMLString;
	let contentHTML = htmlString;
	let footerHTML = footerHTMLString;
	if (documentOptions.header && !headerHTML) headerHTML = defaultHTMLString;
	if (documentOptions.footer && !footerHTML) footerHTML = defaultHTMLString;
	if (documentOptions.decodeUnicode) {
		headerHTML = decode(headerHTML);
		contentHTML = decode(contentHTML);
		footerHTML = decode(footerHTML);
	}
	const docxDocument = new DocxDocument({
		zip,
		htmlString: contentHTML,
		...documentOptions
	});
	docxDocument.documentXML = await renderDocumentFile(docxDocument);
	if (docxDocument.comments.length > 0) docxDocument.createDocumentRelationships(documentFileName, commentsType, "comments.xml", internalRelationship);
	zip.folder(relsFolderName).file(".rels", create({
		encoding: "UTF-8",
		standalone: true
	}, relsXML).toString({ prettyPrint: true }), { createFolders: false });
	zip.folder("docProps").file("core.xml", docxDocument.generateCoreXML(), { createFolders: false });
	if (docxDocument.header && headerHTML) {
		const vTree = convertHTML(headerHTML);
		docxDocument.relationshipFilename = headerFileName;
		const { headerId, headerXML } = await docxDocument.generateHeaderXML(vTree);
		docxDocument.relationshipFilename = documentFileName;
		const fileNameWithExt = `${headerType}${headerId}.xml`;
		const relationshipId = docxDocument.createDocumentRelationships(docxDocument.relationshipFilename, headerType, fileNameWithExt, internalRelationship);
		zip.folder(wordFolder).file(fileNameWithExt, headerXML.toString({ prettyPrint: true }), { createFolders: false });
		docxDocument.headerObjects.push({
			headerId,
			relationshipId,
			type: docxDocument.headerType
		});
	}
	if (docxDocument.footer && footerHTML) {
		const vTree = convertHTML(footerHTML);
		docxDocument.relationshipFilename = footerFileName;
		const { footerId, footerXML } = await docxDocument.generateFooterXML(vTree);
		docxDocument.relationshipFilename = documentFileName;
		const fileNameWithExt = `${footerType}${footerId}.xml`;
		const relationshipId = docxDocument.createDocumentRelationships(docxDocument.relationshipFilename, footerType, fileNameWithExt, internalRelationship);
		zip.folder(wordFolder).file(fileNameWithExt, footerXML.toString({ prettyPrint: true }), { createFolders: false });
		docxDocument.footerObjects.push({
			footerId,
			relationshipId,
			type: docxDocument.footerType
		});
	}
	const themeFileNameWithExt = `${themeFileName}.xml`;
	docxDocument.createDocumentRelationships(docxDocument.relationshipFilename, themeType, `${themeFolder}/${themeFileNameWithExt}`, internalRelationship);
	zip.folder(wordFolder).folder(themeFolder).file(themeFileNameWithExt, docxDocument.generateThemeXML(), { createFolders: false });
	zip.folder(wordFolder).file("document.xml", docxDocument.generateDocumentXML(), { createFolders: false }).file("fontTable.xml", docxDocument.generateFontTableXML(), { createFolders: false }).file("styles.xml", docxDocument.generateStylesXML(), { createFolders: false }).file("numbering.xml", docxDocument.generateNumberingXML(), { createFolders: false }).file("settings.xml", docxDocument.generateSettingsXML(), { createFolders: false }).file("webSettings.xml", docxDocument.generateWebSettingsXML(), { createFolders: false });
	if (docxDocument.comments.length > 0) {
		zip.folder(wordFolder).file("comments.xml", docxDocument.generateCommentsXML(), { createFolders: false }).file("commentsExtended.xml", docxDocument.generateCommentsExtendedXML(), { createFolders: false }).file("commentsIds.xml", docxDocument.generateCommentsIdsXML(), { createFolders: false }).file("commentsExtensible.xml", docxDocument.generateCommentsExtensibleXML(), { createFolders: false }).file("people.xml", docxDocument.generatePeopleXML(), { createFolders: false });
		docxDocument.createDocumentRelationships(documentFileName, commentsExtendedRelationshipType, "commentsExtended.xml", internalRelationship);
		docxDocument.createDocumentRelationships(documentFileName, commentsIdsRelationshipType, "commentsIds.xml", internalRelationship);
		docxDocument.createDocumentRelationships(documentFileName, commentsExtensibleRelationshipType, "commentsExtensible.xml", internalRelationship);
		docxDocument.createDocumentRelationships(documentFileName, peopleRelationshipType, "people.xml", internalRelationship);
	}
	const relationshipXMLs = docxDocument.generateRelsXML();
	if (relationshipXMLs && Array.isArray(relationshipXMLs)) relationshipXMLs.forEach(({ fileName, xmlString }) => {
		zip.folder(wordFolder).folder(relsFolderName).file(`${fileName}.xml.rels`, xmlString, { createFolders: false });
	});
	zip.file("[Content_Types].xml", docxDocument.generateContentTypesXML(), { createFolders: false });
	return zip;
}
const DOCX_MIME_TYPE = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const resolveRuntime = () => {
	if (typeof globalThis !== "undefined") return globalThis;
	if (typeof self !== "undefined") return self;
	if (typeof window !== "undefined") return window;
	if (typeof global !== "undefined") return global;
	return {};
};
const isNodeRuntime = (runtime) => Boolean(runtime && runtime.process && runtime.process.versions && runtime.process.versions.node);
async function generateContainer(htmlString, headerHTMLString, documentOptions = {}, footerHTMLString) {
	const zip = new JSZip();
	await addFilesToContainer(zip, htmlString, documentOptions, headerHTMLString, footerHTMLString);
	const buffer = await zip.generateAsync({ type: "arraybuffer" });
	const runtime = resolveRuntime();
	const hasBuffer = Boolean(runtime?.Buffer && typeof runtime.Buffer.from === "function");
	const hasBlob = typeof runtime?.Blob === "function";
	if (isNodeRuntime(runtime) && hasBuffer) return runtime.Buffer.from(new Uint8Array(buffer));
	if (hasBlob) return new runtime.Blob([buffer], { type: DOCX_MIME_TYPE });
	if (hasBuffer) return runtime.Buffer.from(new Uint8Array(buffer));
	throw new Error("Add blob support using a polyfill eg https://github.com/bjornstar/blob-polyfill");
}
//#endregion
export { DOCX_COMMENT_END_TOKEN_PREFIX, DOCX_COMMENT_START_TOKEN_PREFIX, DOCX_COMMENT_TOKEN_SUFFIX, DOCX_DELETION_END_TOKEN_PREFIX, DOCX_DELETION_START_TOKEN_PREFIX, DOCX_DELETION_TOKEN_SUFFIX, DOCX_INSERTION_END_TOKEN_PREFIX, DOCX_INSERTION_START_TOKEN_PREFIX, DOCX_INSERTION_TOKEN_SUFFIX, generateContainer as HTMLtoDOCX, generateContainer as default, SVG_UNIT_TO_PIXEL_CONVERSIONS, allocatedIds, applicationName, buildCommentEndToken, buildCommentRangeEnd, buildCommentRangeStart, buildCommentReferenceRun, buildCommentStartToken, buildDeletedTextElement, buildSuggestionEndToken, buildSuggestionStartToken, buildTextElement, colorlessColors, commentsExtendedContentType, commentsExtendedRelationshipType, commentsExtendedType, commentsExtensibleContentType, commentsExtensibleRelationshipType, commentsExtensibleType, commentsIdsContentType, commentsIdsRelationshipType, commentsIdsType, commentsType, defaultDirection, defaultDocumentOptions, defaultFont, defaultFontSize, defaultHTMLString, defaultHeadingOptions, defaultLang, defaultOrientation, defaultTableBorderAttributeOptions, defaultTableBorderOptions, documentFileName, ensureTrackingState, findDocxTrackingTokens, footerFileName, footerType, generateHexId, hasTrackingTokens, headerFileName, headerType, hyperlinkType, imageType, internalRelationship, landscapeHeight, landscapeMargins, landscapeWidth, namespaces, paragraphBordersObject, peopleContentType, peopleRelationshipType, peopleType, portraitMargins, relsFolderName, resetAllocatedIds, splitDocxTrackingTokens, themeFileName, themeFolder, themeType, verticalAlignValues, wordFolder, wrapRunWithSuggestion };

//# sourceMappingURL=browser.js.map
