// lib/html/ast.ts:15
function elementWithTag(tag, children) {
  return {
    type: 'element',
    tag,
    children: children || [],
  };
}
