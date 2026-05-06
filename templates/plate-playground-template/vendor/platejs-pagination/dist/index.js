import { a as replaceHeader, b as BaseFooterPlugin, c as insertPageBreak, d as enforceHeaderFooterInvariants, f as hasFooterBlock, g as getPageOfPath, h as getPaginationPages, i as toggleFooter, l as ensureHeader, m as getPaginationFootnotes, n as BasePaginationPlugin, o as replaceFooter, p as hasHeaderBlock, r as toggleHeader, s as removeNodesByType, t as paginate, u as ensureFooter, v as BasePageBreakPlugin, x as allocateFootnotes, y as BaseHeaderPlugin } from "./paginate-BP3Ay61_.js";

//#region src/lib/internal/units.ts
/**
* CSS-pixel ↔ physical-unit conversions at the standard 96 DPI used by
* browser layout (CSS spec). 1in = 96px; 1cm = 96 / 2.54 ≈ 37.795px.
*
* Keeps the wire format (margins, page rect) in CSS pixels while letting UI
* forms accept cm or in input — convert on blur with these helpers, never
* inside the plugin internals.
*/
const PX_PER_IN = 96;
const PX_PER_CM = 96 / 2.54;
const cmToPx = (cm) => Math.round(cm * PX_PER_CM);
const inToPx = (inches) => Math.round(inches * PX_PER_IN);
const pxToCm = (px) => px / PX_PER_CM;
const pxToIn = (px) => px / PX_PER_IN;

//#endregion
export { BaseFooterPlugin, BaseHeaderPlugin, BasePageBreakPlugin, BasePaginationPlugin, allocateFootnotes, cmToPx, enforceHeaderFooterInvariants, ensureFooter, ensureHeader, getPageOfPath, getPaginationFootnotes, getPaginationPages, hasFooterBlock, hasHeaderBlock, inToPx, insertPageBreak, paginate, pxToCm, pxToIn, removeNodesByType, replaceFooter, replaceHeader, toggleFooter, toggleHeader };
//# sourceMappingURL=index.js.map