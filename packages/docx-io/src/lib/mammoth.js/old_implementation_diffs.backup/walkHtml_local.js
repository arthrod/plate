// lib/document-to-html.ts:551
function walkHtml(nodes, callback) {
  nodes.forEach((node) => {
    callback(node);
    if (node.children) {
      walkHtml(node.children, callback);
    }
  });
}
