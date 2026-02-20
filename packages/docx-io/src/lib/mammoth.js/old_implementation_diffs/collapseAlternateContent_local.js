// lib/docx/office-xml-reader.ts:63
function collapseAlternateContent(node) {
  if (node.type === 'element') {
    if (node.name === 'mc:AlternateContent') {
      return node.firstOrEmpty('mc:Fallback').children;
    }
    node.children = node.children.flatMap(collapseAlternateContent);
    return [node];
  }
  return [node];
}
