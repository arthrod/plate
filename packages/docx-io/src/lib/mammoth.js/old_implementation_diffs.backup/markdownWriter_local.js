// lib/writers/markdown-writer.ts:86
function markdownWriter() {
  var fragments = [];
  var elementStack = [];
  var list = null;
  var listItem = {};

  function open(tagName, attributes) {
    attributes = attributes || {};

    var createElement = htmlToMarkdown[tagName] || (() => ({}));
    var element = createElement(attributes, list, listItem);
    elementStack.push({ end: element.end, list });

    if (element.list) {
      list = element.list;
    }

    var anchorBeforeStart = element.anchorPosition === 'before';
    if (anchorBeforeStart) {
      writeAnchor(attributes);
    }

    fragments.push(element.start || '');
    if (!anchorBeforeStart) {
      writeAnchor(attributes);
    }
  }

  function writeAnchor(attributes) {
    if (attributes.id) {
      fragments.push('<a id="' + attributes.id + '"></a>');
    }
  }

  function close(tagName) {
    var element = elementStack.pop();
    list = element.list;
    var end = typeof element.end === 'function' ? element.end() : element.end;
    fragments.push(end || '');
  }

  function selfClosing(tagName, attributes) {
    open(tagName, attributes);
    close(tagName);
  }

  function text(value) {
    fragments.push(escapeMarkdown(value));
  }

  function asString() {
    return fragments.join('');
  }

  return {
    asString,
    open,
    close,
    text,
    selfClosing,
  };
}
