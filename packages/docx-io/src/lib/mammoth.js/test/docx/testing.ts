var createBodyReader = require("../../lib/docx/body-reader.ts").createBodyReader;
var defaultNumbering = require("../../lib/docx/numbering-xml.ts").defaultNumbering;
var Styles = require("../../lib/docx/styles-reader.ts").Styles;

function createBodyReaderForTests(options) {
    options = Object.create(options || {});
    options.styles = options.styles || new Styles({}, {});
    options.numbering = options.numbering || defaultNumbering;
    return createBodyReader(options);
}

exports.createBodyReaderForTests = createBodyReaderForTests;
