// Found in: /docx/relationships-reader.ts:1
// Lines 2670-2706 in old_implementation.js
function Relationships(relationships) {
  var targetsByRelationshipId = {};
  relationships.forEach((relationship) => {
    targetsByRelationshipId[relationship.relationshipId] = relationship.target;
  });

  var targetsByType = {};
  relationships.forEach((relationship) => {
    if (!targetsByType[relationship.type]) {
      targetsByType[relationship.type] = [];
    }
    targetsByType[relationship.type].push(relationship.target);
  });

  return {
    findTargetByRelationshipId(relationshipId) {
      return targetsByRelationshipId[relationshipId];
    },
    findTargetsByType(type) {
      return targetsByType[type] || [];
    },
  };
}

},{}],15:[function(require,module,exports){
var _ = require('underscore');

var promises = require('../promises');
var xml = require('../xml');

exports.writeStyleMap = writeStyleMap;
exports.readStyleMap = readStyleMap;

var schema = 'http://schemas.zwobble.org/mammoth/style-map';
var styleMapPath = 'mammoth/style-map';
var styleMapAbsolutePath = '/' + styleMapPath;
