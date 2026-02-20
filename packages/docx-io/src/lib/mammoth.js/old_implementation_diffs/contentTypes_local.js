// lib/docx/content-types-reader.ts:43
function contentTypes(overrides, extensionDefaults) {
  return {
    findContentType(path) {
      if (!path) return null;

      var overrideContentType = overrides[path];
      if (overrideContentType) {
        return overrideContentType;
      }
      var pathParts = path.split('.');
      var extension = pathParts[pathParts.length - 1];
      var extensionLower = extension.toLowerCase();
      if (
        Object.hasOwn(extensionDefaults, extension) ||
        Object.hasOwn(extensionDefaults, extensionLower)
      ) {
        return (
          extensionDefaults[extension] || extensionDefaults[extensionLower]
        );
      }
      var fallback = fallbackContentTypes[extensionLower];
      if (fallback) {
        return 'image/' + fallback;
      }
      return null;
    },
  };
}
