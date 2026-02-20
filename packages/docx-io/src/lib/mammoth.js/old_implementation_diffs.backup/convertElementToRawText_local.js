// lib/raw-text.ts:3
function convertElementToRawText(element) {
  if (element.type === 'text') {
    return element.value;
  }
  if (element.type === documents.types.tab) {
    return '\t';
  }
  var tail = element.type === 'paragraph' ? '\n\n' : '';
  return (element.children || []).map(convertElementToRawText).join('') + tail;
}
