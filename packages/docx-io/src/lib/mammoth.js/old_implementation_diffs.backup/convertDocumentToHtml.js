// Lines 3179-3192 in old_implementation.js
function convertDocumentToHtml(documentResult, options) {
  var styleMapResult = parseStyleMap(options.readStyleMap());
  var parsedOptions = _.extend({}, options, {
    styleMap: styleMapResult.value,
  });
  var documentConverter = new DocumentConverter(parsedOptions);

  return documentResult.flatMapThen((document) =>
    styleMapResult.flatMapThen((styleMap) =>
      documentConverter.convertToHtml(document)
    )
  );
}
