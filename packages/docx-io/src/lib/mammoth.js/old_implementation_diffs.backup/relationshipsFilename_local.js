// lib/docx/docx-reader.ts:282
function relationshipsFilename(filename) {
  var split = zipfile.splitPath(filename);
  return zipfile.joinPath(split.dirname, '_rels', split.basename + '.rels');
}
