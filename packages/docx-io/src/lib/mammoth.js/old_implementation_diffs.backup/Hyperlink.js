// Lines 828-837 in old_implementation.js
function Hyperlink(children, options) {
  return {
    type: types.hyperlink,
    children,
    href: options.href,
    anchor: options.anchor,
    targetFrame: options.targetFrame,
  };
}
