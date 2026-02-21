// @ts-nocheck
var nodes = require('./nodes.ts');

exports.Element = nodes.Element;
exports.element = nodes.element;
exports.emptyElement = nodes.emptyElement;
exports.text = nodes.text;
exports.readString = require('./reader.ts').readString;
exports.writeString = require('./writer.ts').writeString;
