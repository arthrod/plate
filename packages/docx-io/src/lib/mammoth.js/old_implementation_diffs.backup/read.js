// Lines 2127-2270 in old_implementation.js
function read(docxFile, input, options) {
  input = input || {};
  options = options || {};

  var files = new Files({
    externalFileAccess: options.externalFileAccess,
    relativeToFile: input.path,
  });

  return promises
    .props({
      contentTypes: readContentTypesFromZipFile(docxFile),
      partPaths: findPartPaths(docxFile),
      docxFile,
      files,
    })
    .also((result) => ({
      styles: readStylesFromZipFile(docxFile, result.partPaths.styles),
    }))
    .also((result) => ({
      numbering: readNumberingFromZipFile(
        docxFile,
        result.partPaths.numbering,
        result.styles
      ),
    }))
    .also((result) => ({
      commentsExtended: readXmlFromZipFile(
        result.docxFile,
        result.partPaths.commentsExtended
      ).then((xml) => {
        if (xml) {
          return commentsExtendedReader.createCommentsExtendedReader()(xml);
        }
        return new Result({});
      }),
      // Read commentsIds.xml (paraId → durableId) and
      // commentsExtensible.xml (durableId → dateUtc) to build
      // a paraId → dateUtc map for correcting Word's fake-Z dates.
      dateUtcMap: promises
        .props({
          idsXml: readXmlFromZipFile(
            result.docxFile,
            result.partPaths.commentsIds || 'word/commentsIds.xml'
          ),
          extXml: readXmlFromZipFile(
            result.docxFile,
            result.partPaths.commentsExtensible || 'word/commentsExtensible.xml'
          ),
        })
        .then((r) => {
          var paraIdToDurable = {};
          if (r.idsXml) {
            r.idsXml.children.forEach((child) => {
              if (child.name === 'w16cid:commentId') {
                var pid = child.attributes['w16cid:paraId'];
                var did = child.attributes['w16cid:durableId'];
                if (pid && did) paraIdToDurable[pid] = did;
              }
            });
          }
          var durableToDateUtc = {};
          if (r.extXml) {
            r.extXml.children.forEach((child) => {
              if (child.name === 'w16cex:commentExtensible') {
                var did = child.attributes['w16cex:durableId'];
                var utc = child.attributes['w16cex:dateUtc'];
                if (did && utc) durableToDateUtc[did] = utc;
              }
            });
          }
          // Combine: paraId → durableId → dateUtc
          var map = {};
          Object.keys(paraIdToDurable).forEach((pid) => {
            var did = paraIdToDurable[pid];
            if (durableToDateUtc[did]) {
              map[pid] = durableToDateUtc[did];
            }
          });
          return new Result(map);
        }),
    }))
    .also((result) => ({
      footnotes: readXmlFileWithBody(
        result.partPaths.footnotes,
        result,
        (bodyReader, xml) => {
          if (xml) {
            return notesReader.createFootnotesReader(bodyReader)(xml);
          }
          return new Result([]);
        }
      ),
      endnotes: readXmlFileWithBody(
        result.partPaths.endnotes,
        result,
        (bodyReader, xml) => {
          if (xml) {
            return notesReader.createEndnotesReader(bodyReader)(xml);
          }
          return new Result([]);
        }
      ),
      comments: readXmlFileWithBody(
        result.partPaths.comments,
        result,
        (bodyReader, xml) => {
          if (xml) {
            return commentsReader.createCommentsReader(
              bodyReader,
              result.commentsExtended.value || {},
              result.dateUtcMap.value || {}
            )(xml);
          }
          return new Result([]);
        }
      ),
    }))
    .also((result) => ({
      notes: result.footnotes.flatMap((footnotes) =>
        result.endnotes.map(
          (endnotes) => new documents.Notes(footnotes.concat(endnotes))
        )
      ),
    }))
    .then((result) =>
      readXmlFileWithBody(
        result.partPaths.mainDocument,
        result,
        (bodyReader, xml) =>
          result.notes.flatMap((notes) =>
            result.comments.flatMap((comments) => {
              var reader = new DocumentXmlReader({
                bodyReader,
                notes,
                comments,
              });
              return reader.convertXmlToDocument(xml);
            })
          )
      )
    );
}
