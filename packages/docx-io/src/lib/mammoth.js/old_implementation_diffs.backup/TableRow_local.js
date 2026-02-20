// lib/documents.ts:244
function TableRow(children, options) {
  options = options || {};
  return {
    type: types.tableRow,
    children,
    isHeader: options.isHeader || false,
  };
}
