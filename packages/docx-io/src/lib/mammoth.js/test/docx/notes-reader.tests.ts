var assert = require("assert");

var createFootnotesReader = require("../../lib/docx/notes-reader.ts").createFootnotesReader;
var createBodyReader = require("../../lib/docx/body-reader.ts").createBodyReader;
var stylesReader = require("../../lib/docx/styles-reader.ts");
var documents = require("../../lib/documents.ts");
var XmlElement = require("../../lib/xml/index.ts").Element;
var test = require("../test.ts")(module);


test('ID and body of footnote are read', function() {
    var bodyReader = new createBodyReader({styles: stylesReader.defaultStyles});
    var footnoteBody = [new XmlElement("w:p", {}, [])];
    var footnotes = createFootnotesReader(bodyReader)(
        new XmlElement("w:footnotes", {}, [
            new XmlElement("w:footnote", {"w:id": "1"}, footnoteBody)
        ])
    );
    assert.equal(footnotes.value.length, 1);
    assert.deepEqual(footnotes.value[0].body, [new documents.Paragraph([])]);
    assert.deepEqual(footnotes.value[0].noteId, "1");
});

footnoteTypeIsIgnored('continuationSeparator');
footnoteTypeIsIgnored('separator');

function footnoteTypeIsIgnored(type) {
    test('footnotes of type ' + type + ' are ignored', function() {
        var footnotes = createFootnotesReader()(
            new XmlElement("w:footnotes", {}, [
                new XmlElement("w:footnote", {"w:id": "1", "w:type": type}, [])
            ])
        );
        assert.equal(footnotes.value.length, 0);
    });
}
