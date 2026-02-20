// lib/html/index.ts:27
function generateElementString(writer, node) {
  if (ast.isVoidElement(node)) {
    writer.selfClosing(node.tag.tagName, node.tag.attributes);
  } else {
    writer.open(node.tag.tagName, node.tag.attributes);
    write(writer, node.children);
    writer.close(node.tag.tagName);
  }
}
