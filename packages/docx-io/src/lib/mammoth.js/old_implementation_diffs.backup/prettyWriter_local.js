// lib/writers/html-writer.ts:18
function prettyWriter() {
  var indentationLevel = 0;
  var indentation = '  ';
  var stack = [];
  var start = true;
  var inText = false;

  var writer = simpleWriter();

  function open(tagName, attributes) {
    if (indentedElements[tagName]) {
      indent();
    }
    stack.push(tagName);
    writer.open(tagName, attributes);
    if (indentedElements[tagName]) {
      indentationLevel++;
    }
    start = false;
  }

  function close(tagName) {
    if (indentedElements[tagName]) {
      indentationLevel--;
      indent();
    }
    stack.pop();
    writer.close(tagName);
  }

  function text(value) {
    startText();
    var currentIndent = '';
    for (var i = 0; i < indentationLevel; i++) {
      currentIndent += indentation;
    }
    var text = isInPre() ? value : value.replace(/\n/g, '\n' + currentIndent);
    writer.text(text);
  }

  function selfClosing(tagName, attributes) {
    indent();
    writer.selfClosing(tagName, attributes);
  }

  function insideIndentedElement() {
    return stack.length === 0 || indentedElements[stack[stack.length - 1]];
  }

  function startText() {
    if (!inText) {
      indent();
      inText = true;
    }
  }

  function indent() {
    inText = false;
    if (!start && insideIndentedElement() && !isInPre()) {
      writer._append('\n');
      for (var i = 0; i < indentationLevel; i++) {
        writer._append(indentation);
      }
    }
  }

  function isInPre() {
    return stack.some((tagName) => tagName === 'pre');
  }

  return {
    asString: writer.asString,
    open,
    close,
    text,
    selfClosing,
  };
}
