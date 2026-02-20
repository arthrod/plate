// lib/writers/html-writer.ts:97
function simpleWriter() {
  var fragments = [];

  function open(tagName, attributes) {
    var attributeString = generateAttributeString(attributes);
    fragments.push('<' + tagName + attributeString + '>');
  }

  function close(tagName) {
    fragments.push('</' + tagName + '>');
  }

  function selfClosing(tagName, attributes) {
    var attributeString = generateAttributeString(attributes);
    fragments.push('<' + tagName + attributeString + ' />');
  }

  function generateAttributeString(attributes) {
    attributes = attributes || {};
    return Object.keys(attributes)
      .map(
        (key) => ' ' + key + '="' + escapeHtmlAttribute(attributes[key]) + '"'
      )
      .join('');
  }

  function text(value) {
    fragments.push(escapeHtmlText(value));
  }

  function append(html) {
    fragments.push(html);
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
    _append: append,
  };
}
