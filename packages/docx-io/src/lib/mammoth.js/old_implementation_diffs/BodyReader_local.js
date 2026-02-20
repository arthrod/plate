// lib/docx/body-reader.ts:24
function BodyReader(options) {
  var complexFieldStack = [];
  var currentInstrText = [];

  // When a paragraph is marked as deleted, its contents should be combined
  // with the following paragraph. See 17.13.5.15 del (Deleted Paragraph) of
  // ECMA-376 4th edition Part 1.
  var deletedParagraphContents = [];

  var relationships = options.relationships;
  var contentTypes = options.contentTypes;
  var docxFile = options.docxFile;
  var files = options.files;
  var numbering = options.numbering;
  var styles = options.styles;

  function readXmlElements(elements) {
    var results = elements.map(readXmlElement);
    return combineResults(results);
  }

  function readXmlElement(element) {
    if (element.type === 'element') {
      var handler = xmlElementReaders[element.name];
      if (handler) {
        return handler(element);
      }
      if (!Object.hasOwn(ignoreElements, element.name)) {
        var message = warning(
          'An unrecognised element was ignored: ' + element.name
        );
        return emptyResultWithMessages([message]);
      }
    }
    return emptyResult();
  }

  function readParagraphProperties(element) {
    return readParagraphStyle(element).map((style) => ({
      type: 'paragraphProperties',
      styleId: style.styleId,
      styleName: style.name,
      alignment: element.firstOrEmpty('w:jc').attributes['w:val'],
      numbering: readNumberingProperties(
        style.styleId,
        element.firstOrEmpty('w:numPr'),
        numbering
      ),
      indent: readParagraphIndent(element.firstOrEmpty('w:ind')),
    }));
  }

  function readParagraphIndent(element) {
    return {
      start: element.attributes['w:start'] || element.attributes['w:left'],
      end: element.attributes['w:end'] || element.attributes['w:right'],
      firstLine: element.attributes['w:firstLine'],
      hanging: element.attributes['w:hanging'],
    };
  }

  function readRunProperties(element) {
    return readRunStyle(element).map((style) => {
      var fontSizeString = element.firstOrEmpty('w:sz').attributes['w:val'];
      // w:sz gives the font size in half points, so halve the value to get the size in points
      var fontSize = /^[0-9]+$/.test(fontSizeString)
        ? Number.parseInt(fontSizeString, 10) / 2
        : null;

      return {
        type: 'runProperties',
        styleId: style.styleId,
        styleName: style.name,
        verticalAlignment:
          element.firstOrEmpty('w:vertAlign').attributes['w:val'],
        font: element.firstOrEmpty('w:rFonts').attributes['w:ascii'],
        fontSize,
        isBold: readBooleanElement(element.first('w:b')),
        isUnderline: readUnderline(element.first('w:u')),
        isItalic: readBooleanElement(element.first('w:i')),
        isStrikethrough: readBooleanElement(element.first('w:strike')),
        isAllCaps: readBooleanElement(element.first('w:caps')),
        isSmallCaps: readBooleanElement(element.first('w:smallCaps')),
        highlight: readHighlightValue(
          element.firstOrEmpty('w:highlight').attributes['w:val']
        ),
      };
    });
  }

  function readUnderline(element) {
    if (element) {
      var value = element.attributes['w:val'];
      return (
        value !== undefined &&
        value !== 'false' &&
        value !== '0' &&
        value !== 'none'
      );
    }
