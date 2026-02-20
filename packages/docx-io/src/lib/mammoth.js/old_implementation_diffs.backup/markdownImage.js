// Lines 4377-4385 in old_implementation.js
function markdownImage(attributes) {
  var src = attributes.src || '';
  var altText = attributes.alt || '';
  if (src || altText) {
    return { start: '![' + altText + '](' + src + ')' };
  }
  return {};
}
