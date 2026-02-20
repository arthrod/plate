// lib/documents.ts:234
function Table(children, properties) {
  properties = properties || {};
  return {
    type: types.table,
    children,
    styleId: properties.styleId || null,
    styleName: properties.styleName || null,
  };
}
