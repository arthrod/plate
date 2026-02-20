// Lines 2913-2920 in old_implementation.js
function elementWithTag(tag, children) {
  return {
    type: 'element',
    tag,
    children: children || [],
  };
}
