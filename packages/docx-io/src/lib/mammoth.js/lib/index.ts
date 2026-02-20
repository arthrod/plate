import * as docxReader from './docx/docx-reader';
import * as docxStyleMap from './docx/style-map';
import { DocumentConverter } from './document-to-html';
import { convertElementToRawText } from './raw-text';
import { readStyle } from './style-reader';
import { readOptions } from './options-reader';
import * as unzip from './unzip';
import { Result } from './results';
import * as images from './images';
import * as transforms from './transforms';
import * as underline from './underline';

export {
  convertToHtml,
  convertToMarkdown,
  convert,
  extractRawText,
  images,
  transforms,
  underline,
  embedStyleMap,
  readEmbeddedStyleMap,
};

function convertToHtml(input, options) {
  return withDone(convert(input, options));
}

function convertToMarkdown(input, options) {
  var markdownOptions = Object.create(options || {});
  markdownOptions.outputFormat = 'markdown';
  return withDone(convert(input, markdownOptions));
}

function convert(input, options) {
  options = readOptions(options);

  return withDone(
    unzip
    .openZip(input)
    .then((docxFile) =>
      docxStyleMap.readStyleMap(docxFile).then((styleMap) => {
        options.embeddedStyleMap = styleMap;
        return docxFile;
      })
    )
    .then((docxFile) =>
      docxReader
        .read(docxFile, input, options)
        .then((documentResult) => documentResult.map(options.transformDocument))
        .then((documentResult) =>
          convertDocumentToHtml(documentResult, options)
        )
    )
  );
}

function readEmbeddedStyleMap(input) {
  return withDone(unzip.openZip(input).then(docxStyleMap.readStyleMap));
}

function convertDocumentToHtml(documentResult, options) {
  var styleMapResult = parseStyleMap(options.readStyleMap());
  var parsedOptions = Object.assign({}, options, {
    styleMap: styleMapResult.value,
  });
  var documentConverter = new DocumentConverter(parsedOptions);

  return documentResult.flatMapThen((document) =>
    styleMapResult.flatMapThen((styleMap) =>
      documentConverter.convertToHtml(document)
    )
  );
}

function parseStyleMap(styleMap) {
  return Result.combine((styleMap || []).map(readStyle)).map((styleMap) =>
    styleMap.filter((styleMapping) => !!styleMapping)
  );
}

function extractRawText(input) {
  return withDone(
    unzip
    .openZip(input)
    .then(docxReader.read)
    .then((documentResult) => documentResult.map(convertElementToRawText))
  );
}

function embedStyleMap(input, styleMap) {
  return withDone(
    unzip
    .openZip(input)
    .then((docxFile) =>
      Promise.resolve(docxStyleMap.writeStyleMap(docxFile, styleMap)).then(
        () => docxFile
      )
    )
    .then((docxFile) => docxFile.toArrayBuffer())
    .then((arrayBuffer) => ({
      toArrayBuffer() {
        return arrayBuffer;
      },
      toBuffer() {
        return Buffer.from(arrayBuffer);
      },
    }))
  );
}

export const styleMapping = () => {
  throw new Error(
    'Use a raw string instead of mammoth.styleMapping e.g. "p[style-name=\'Title\'] => h1" instead of mammoth.styleMapping("p[style-name=\'Title\'] => h1")'
  );
};

function withDone(promise) {
  if (!promise || typeof promise.done === 'function') {
    return promise;
  }

  Object.defineProperty(promise, 'done', {
    configurable: true,
    enumerable: false,
    value: function (onFulfilled, onRejected) {
      promise
        .then(onFulfilled, onRejected)
        .catch(function (error) {
          setTimeout(function () {
            throw error;
          }, 0);
        });
    },
    writable: true,
  });

  return promise;
}
