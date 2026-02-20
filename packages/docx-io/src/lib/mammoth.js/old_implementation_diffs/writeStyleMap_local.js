// Found in: /docx/style-map.ts:4
// Lines 2707-2711 in old_implementation.js
function writeStyleMap(docxFile, styleMap) {
  docxFile.write(styleMapPath, styleMap);
  return updateRelationships(docxFile).then(() => updateContentTypes(docxFile));
}
