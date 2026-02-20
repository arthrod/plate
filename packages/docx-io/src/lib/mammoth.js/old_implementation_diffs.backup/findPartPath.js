// Lines 2325-2344 in old_implementation.js
function findPartPath(options) {
  var docxFile = options.docxFile;
  var relationships = options.relationships;
  var relationshipType = options.relationshipType;
  var basePath = options.basePath;
  var fallbackPath = options.fallbackPath;

  var targets = relationships.findTargetsByType(relationshipType);
  var normalisedTargets = targets.map((target) =>
    stripPrefix(zipfile.joinPath(basePath, target), '/')
  );
  var validTargets = normalisedTargets.filter((target) =>
    docxFile.exists(target)
  );
  if (validTargets.length === 0) {
    return fallbackPath;
  }
  return validTargets[0];
}
