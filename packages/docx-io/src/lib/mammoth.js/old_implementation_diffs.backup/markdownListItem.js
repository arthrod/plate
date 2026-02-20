// Lines 4398-4437 in old_implementation.js
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

var htmlToMarkdown = {
  p: markdownElement('', '\n\n'),
  br: markdownElement('', '  \n'),
  ul: markdownList({ isOrdered: false }),
  ol: markdownList({ isOrdered: true }),
  li: markdownListItem,
  strong: symmetricMarkdownElement('__'),
  em: symmetricMarkdownElement('*'),
  a: markdownLink,
  img: markdownImage,
};

(() => {
  for (var i = 1; i <= 6; i++) {
    htmlToMarkdown['h' + i] = markdownElement(
      repeatString('#', i) + ' ',
      '\n\n'
    );
  }
})();
