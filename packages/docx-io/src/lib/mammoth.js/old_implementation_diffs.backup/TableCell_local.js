// lib/documents.ts:253
function TableCell(children, options) {
  options = options || {};
  return {
    type: types.tableCell,
    children,
    colSpan: options.colSpan == null ? 1 : options.colSpan,
    rowSpan: options.rowSpan == null ? 1 : options.rowSpan,
  };
}
