// lib/writers/markdown-writer.ts:21
function markdownImage(attributes) {
  var src = attributes.src || '';
  var altText = attributes.alt || '';
  if (src || altText) {
    return { start: '![' + altText + '](' + src + ')' };
  }
  return {};
}
