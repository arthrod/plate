// Lines 966-974 in old_implementation.js
function TableRow(children, options) {
  options = options || {};
  return {
    type: types.tableRow,
    children,
    isHeader: options.isHeader || false,
  };
}
