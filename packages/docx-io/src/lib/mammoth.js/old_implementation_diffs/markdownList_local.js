// lib/writers/markdown-writer.ts:30
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
