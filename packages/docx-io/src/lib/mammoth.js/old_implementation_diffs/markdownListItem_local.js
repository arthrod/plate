// lib/writers/markdown-writer.ts:42
function markdownListItem(attributes, list, listItem) {
  list = list || { indent: 0, isOrdered: false, count: 0 };
  list.count++;
  listItem.hasClosed = false;

  var bullet = list.isOrdered ? list.count + '.' : '-';
  var start = repeatString('\t', list.indent) + bullet + ' ';

  return {
    start,
    end() {
      if (!listItem.hasClosed) {
        listItem.hasClosed = true;
        return '\n';
      }
    },
  };
}
