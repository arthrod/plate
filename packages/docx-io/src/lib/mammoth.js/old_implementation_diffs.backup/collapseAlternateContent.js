// Lines 2637-2654 in old_implementation.js
function collapseAlternateContent(node) {
  if (node.type === 'element') {
    if (node.name === 'mc:AlternateContent') {
      return node.firstOrEmpty('mc:Fallback').children;
    }
    node.children = _.flatten(
      node.children.map(collapseAlternateContent, true)
    );
    return [node];
  }
  return [node];
}

},{"../promises":24,"../xml":36,"underscore":104}],14:[function(require,module,exports){
exports.readRelationships = readRelationships;
exports.defaultValue = new Relationships([]);
exports.Relationships = Relationships;
