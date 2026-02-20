// lib/html/index.ts:17
function writeNode(writer, node) {
  toStrings[node.type](writer, node);
}
