// Lines 4161-4175 in old_implementation.js
function visitDescendants(element, visit) {
  if (element.children) {
    element.children.forEach((child) => {
      visitDescendants(child, visit);
      visit(child);
    });
  }
}

},{"underscore":104}],32:[function(require,module,exports){
var htmlPaths = require('./styles/html-paths');
var Html = require('./html');

exports.element = element;
