// Lines 975-984 in old_implementation.js
function TableCell(children, options) {
  options = options || {};
  return {
    type: types.tableCell,
    children,
    colSpan: options.colSpan == null ? 1 : options.colSpan,
    rowSpan: options.rowSpan == null ? 1 : options.rowSpan,
  };
}
