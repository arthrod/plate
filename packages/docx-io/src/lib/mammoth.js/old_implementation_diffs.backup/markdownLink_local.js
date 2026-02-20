// lib/writers/markdown-writer.ts:9
function markdownLink(attributes) {
  var href = attributes.href || '';
  if (href) {
    return {
      start: '[',
      end: '](' + href + ')',
      anchorPosition: 'before',
    };
  }
  return {};
}
