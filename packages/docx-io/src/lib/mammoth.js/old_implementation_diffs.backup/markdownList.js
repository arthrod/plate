// Lines 4386-4397 in old_implementation.js
function markdownList(options) {
  return (attributes, list) => ({
    start: list ? '\n' : '',
    end: list ? '' : '\n',
    list: {
      isOrdered: options.isOrdered,
      indent: list ? list.indent + 1 : 0,
      count: 0,
    },
  });
}
