var documents = require('../documents');
var Result = require('../results').Result;

function createCommentsExtendedReader(bodyReader) {
  function readCommentsExtendedXml(element) {
    var mappings = {};
    console.log(
      '[DOCX DEBUG] commentsExtended children count:',
      element.children.length
    );
    element.children.forEach((child) => {
      console.log(
        '[DOCX DEBUG] commentsExtended child:',
        child.name,
        child.type,
        JSON.stringify(child.attributes || {}).slice(0, 200)
      );
      if (child.name === 'w15:commentEx') {
        var paraId = child.attributes['w15:paraId'];
        var parentParaId = child.attributes['w15:paraIdParent'];
        var done = child.attributes['w15:done'];
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
