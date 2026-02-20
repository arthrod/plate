// Lines 665-679 in old_implementation.js
function extractTextFromElements(elements) {
  var text = '';
  for (var i = 0; i < elements.length; i++) {
    var element = elements[i];
    if (element.type === 'text') {
      text += element.value;
    } else if (element.type === 'paragraph') {
      text += extractTextFromElements(element.children || []) + '\n';
    } else if (element.children) {
      text += extractTextFromElements(element.children);
    }
  }
  return text;
}
