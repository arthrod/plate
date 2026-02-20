// Lines 4279-4324 in old_implementation.js
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
    return _.map(
      attributes,
      (value, key) => ' ' + key + '="' + escapeHtmlAttribute(value) + '"'
    ).join('');
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
