// Lines 2981-2990 in old_implementation.js
function generateElementString(writer, node) {
  if (ast.isVoidElement(node)) {
    writer.selfClosing(node.tag.tagName, node.tag.attributes);
  } else {
    writer.open(node.tag.tagName, node.tag.attributes);
    write(writer, node.children);
    writer.close(node.tag.tagName);
  }
}
