var hamjest = require("hamjest");

var documents = require("../../lib/documents");


exports.isEmptyRun = isRun({children: []});
exports.isRun = isRun;
exports.isText = isText;
exports.isCheckbox = isCheckbox;
exports.isHyperlink = isHyperlink;
exports.isTable = isTable;
exports.isRow = isRow;


function isRun(properties) {
    return isDocumentElement(documents.types.run, properties);
}

function isText(text) {
    return isDocumentElement(documents.types.text, {value: text});
}

function isCheckbox(properties) {
    return isDocumentElement(documents.types.checkbox, properties);
}

function isHyperlink(properties) {
    return isDocumentElement(documents.types.hyperlink, properties);
}

function isTable(options) {
    return isDocumentElement(documents.types.table, options);
}

function isRow(options) {
    return isDocumentElement(documents.types.tableRow, options);
}

function isDocumentElement(type, properties) {
    return hamjest.hasProperties(Object.assign({type: hamjest.equalTo(type)}, properties));
}
