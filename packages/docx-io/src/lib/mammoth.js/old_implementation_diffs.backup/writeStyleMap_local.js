// lib/docx/style-map.ts:11
function writeStyleMap(docxFile, styleMap) {
  docxFile.write(styleMapPath, styleMap);
  return updateRelationships(docxFile).then(() => updateContentTypes(docxFile));
}
