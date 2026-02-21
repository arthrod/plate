// @ts-nocheck
var htmlPaths = require('./styles/html-paths.ts');
var Html = require('./html/index.ts');

exports.element = element;

function element(name) {
  return (html) => Html.elementWithTag(htmlPaths.element(name), [html]);
}
