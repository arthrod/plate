// Found in: /index.ts:17
// Lines 3206-3298 in old_implementation.js
function embedStyleMap(input, styleMap) {
  return unzip
    .openZip(input)
    .tap((docxFile) => docxStyleMap.writeStyleMap(docxFile, styleMap))
    .then((docxFile) => docxFile.toArrayBuffer())
    .then((arrayBuffer) => ({
      toArrayBuffer() {
        return arrayBuffer;
      },
      toBuffer() {
        return Buffer.from(arrayBuffer);
      },
    }));
}

exports.styleMapping = () => {
  throw new Error(
    'Use a raw string instead of mammoth.styleMapping e.g. "p[style-name=\'Title\'] => h1" instead of mammoth.styleMapping("p[style-name=\'Title\'] => h1")'
  );
};

}).call(this)}).call(this,require("buffer").Buffer)
},{"./document-to-html":3,"./docx/docx-reader":10,"./docx/style-map":15,"./images":21,"./options-reader":23,"./raw-text":25,"./results":26,"./style-reader":27,"./transforms":31,"./underline":32,"./unzip":2,"buffer":84,"underscore":104}],23:[function(require,module,exports){
exports.readOptions = readOptions;

var _ = require('underscore');

var defaultStyleMap = (exports._defaultStyleMap = [
  'p.Heading1 => h1:fresh',
  'p.Heading2 => h2:fresh',
  'p.Heading3 => h3:fresh',
  'p.Heading4 => h4:fresh',
  'p.Heading5 => h5:fresh',
  'p.Heading6 => h6:fresh',
  "p[style-name='Heading 1'] => h1:fresh",
  "p[style-name='Heading 2'] => h2:fresh",
  "p[style-name='Heading 3'] => h3:fresh",
  "p[style-name='Heading 4'] => h4:fresh",
  "p[style-name='Heading 5'] => h5:fresh",
  "p[style-name='Heading 6'] => h6:fresh",
  "p[style-name='heading 1'] => h1:fresh",
  "p[style-name='heading 2'] => h2:fresh",
  "p[style-name='heading 3'] => h3:fresh",
  "p[style-name='heading 4'] => h4:fresh",
  "p[style-name='heading 5'] => h5:fresh",
  "p[style-name='heading 6'] => h6:fresh",

  // Apple Pages
  'p.Heading => h1:fresh',
  "p[style-name='Heading'] => h1:fresh",

  "r[style-name='Strong'] => strong",

  "p[style-name='footnote text'] => p:fresh",
  "r[style-name='footnote reference'] =>",
  "p[style-name='endnote text'] => p:fresh",
  "r[style-name='endnote reference'] =>",
  "p[style-name='annotation text'] => p:fresh",
  "r[style-name='annotation reference'] =>",

  // LibreOffice
  "p[style-name='Footnote'] => p:fresh",
  "r[style-name='Footnote anchor'] =>",
  "p[style-name='Endnote'] => p:fresh",
  "r[style-name='Endnote anchor'] =>",

  'p:unordered-list(1) => ul > li:fresh',
  'p:unordered-list(2) => ul|ol > li > ul > li:fresh',
  'p:unordered-list(3) => ul|ol > li > ul|ol > li > ul > li:fresh',
  'p:unordered-list(4) => ul|ol > li > ul|ol > li > ul|ol > li > ul > li:fresh',
  'p:unordered-list(5) => ul|ol > li > ul|ol > li > ul|ol > li > ul|ol > li > ul > li:fresh',
  'p:ordered-list(1) => ol > li:fresh',
  'p:ordered-list(2) => ul|ol > li > ol > li:fresh',
  'p:ordered-list(3) => ul|ol > li > ul|ol > li > ol > li:fresh',
  'p:ordered-list(4) => ul|ol > li > ul|ol > li > ul|ol > li > ol > li:fresh',
  'p:ordered-list(5) => ul|ol > li > ul|ol > li > ul|ol > li > ul|ol > li > ol > li:fresh',

  "r[style-name='Hyperlink'] =>",

  "p[style-name='Normal'] => p:fresh",

  // Apple Pages
  'p.Body => p:fresh',
  "p[style-name='Body'] => p:fresh",
]);

var standardOptions = (exports._standardOptions = {
  externalFileAccess: false,
  transformDocument: identity,
  includeDefaultStyleMap: true,
  includeEmbeddedStyleMap: true,
});
