// lib/docx/relationships-reader.ts:20
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
