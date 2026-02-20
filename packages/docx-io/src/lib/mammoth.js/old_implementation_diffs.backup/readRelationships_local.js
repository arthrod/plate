// lib/docx/relationships-reader.ts:5
function readRelationships(element) {
  var relationships = [];
  element.children.forEach((child) => {
    if (child.name === 'relationships:Relationship') {
      var relationship = {
        relationshipId: child.attributes.Id,
        target: child.attributes.Target,
        type: child.attributes.Type,
      };
      relationships.push(relationship);
    }
  });
  return new Relationships(relationships);
}
