var documents = require('../documents');
var Result = require('../results').Result;

function createCommentsExtendedReader(bodyReader) {
  function readCommentsExtendedXml(element) {
    var mappings = {};
    console.log(
      '[DOCX DEBUG] commentsExtended children count:',
      element.children.length
    );

    function readAttribute(attributes, localName) {
      if (!attributes) return null;
      var direct =
        attributes['w15:' + localName] || attributes['wordml:' + localName];
      if (direct) return direct;
      var key = Object.keys(attributes).find(
        (attrName) =>
          attrName.endsWith(':' + localName) ||
          attrName.endsWith('}' + localName)
      );
      return key ? attributes[key] : null;
    }

    element.children.forEach((child) => {
      if (
        child.name === 'w15:commentEx' ||
        child.name === 'wordml:commentEx' ||
        (typeof child.name === 'string' && child.name.endsWith('commentEx'))
      ) {
        var paraId = readAttribute(child.attributes, 'paraId');
        var parentParaId = readAttribute(child.attributes, 'paraIdParent');
        var done = readAttribute(child.attributes, 'done');
        console.log('[DOCX DEBUG] commentEx:', {
          paraId,
          parentParaId,
          done,
          allAttrs: JSON.stringify(child.attributes),
        });
        if (paraId && parentParaId) {
          mappings[paraId] = parentParaId;
        }
      }
    });
    console.log(
      '[DOCX DEBUG] commentsExtended mappings:',
      JSON.stringify(mappings)
    );
    return new Result(mappings);
  }

  return readCommentsExtendedXml;
}

exports.createCommentsExtendedReader = createCommentsExtendedReader;
