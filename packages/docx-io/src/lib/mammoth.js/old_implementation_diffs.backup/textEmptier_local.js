// lib/html/simplify.ts:81
function textEmptier(node) {
  if (node.value.length === 0) {
    return [];
  }
  return [node];
}
