// lib/documents.ts:35
function Paragraph(children, properties) {
  properties = properties || {};
  var indent = properties.indent || {};
  return {
    type: types.paragraph,
    children,
    styleId: properties.styleId || null,
    styleName: properties.styleName || null,
    numbering: properties.numbering || null,
    alignment: properties.alignment || null,
    indent: {
      start: indent.start || null,
      end: indent.end || null,
      firstLine: indent.firstLine || null,
      hanging: indent.hanging || null,
    },
    paraId: properties.paraId || null,
  };
}
