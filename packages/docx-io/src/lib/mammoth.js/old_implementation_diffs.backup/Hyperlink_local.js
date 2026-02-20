// lib/documents.ts:102
function Hyperlink(children, options) {
  return {
    type: types.hyperlink,
    children,
    href: options.href,
    anchor: options.anchor,
    targetFrame: options.targetFrame,
  };
}
