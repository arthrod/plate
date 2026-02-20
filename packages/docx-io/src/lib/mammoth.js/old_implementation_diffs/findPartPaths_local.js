// lib/docx/docx-reader.ts:170
function findPartPaths(docxFile) {
  return readPackageRelationships(docxFile).then((packageRelationships) => {
    var mainDocumentPath = findPartPath({
      docxFile,
      relationships: packageRelationships,
      relationshipType:
        'http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument',
      basePath: '',
      fallbackPath: 'word/document.xml',
    });

    if (!docxFile.exists(mainDocumentPath)) {
      throw new Error(
        'Could not find main document part. Are you sure this is a valid .docx file?'
      );
    }

    return xmlFileReader({
      filename: relationshipsFilename(mainDocumentPath),
      readElement: relationshipsReader.readRelationships,
      defaultValue: relationshipsReader.defaultValue,
    })(docxFile).then((documentRelationships) => {
      function findPartRelatedToMainDocument(name) {
        return findPartPath({
          docxFile,
          relationships: documentRelationships,
          relationshipType:
            'http://schemas.openxmlformats.org/officeDocument/2006/relationships/' +
            name,
          basePath: zipfile.splitPath(mainDocumentPath).dirname,
          fallbackPath: 'word/' + name + '.xml',
        });
      }

      return {
        mainDocument: mainDocumentPath,
        comments: findPartRelatedToMainDocument('comments'),
        commentsExtended: findPartPath({
          docxFile,
          relationships: documentRelationships,
          relationshipType:
            'http://schemas.microsoft.com/office/2011/relationships/commentsExtended',
          basePath: zipfile.splitPath(mainDocumentPath).dirname,
          fallbackPath: 'word/commentsExtended.xml',
        }),
        endnotes: findPartRelatedToMainDocument('endnotes'),
        footnotes: findPartRelatedToMainDocument('footnotes'),
        numbering: findPartRelatedToMainDocument('numbering'),
        styles: findPartRelatedToMainDocument('styles'),
      };
    });
  });
}
