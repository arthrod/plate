// Lines 4365-4376 in old_implementation.js
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
