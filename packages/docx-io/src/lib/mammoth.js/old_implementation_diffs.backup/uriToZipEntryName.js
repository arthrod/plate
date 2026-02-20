// Lines 2881-2889 in old_implementation.js
function uriToZipEntryName(base, uri) {
  if (uri.charAt(0) === '/') {
    return uri.substring(1);
  }
  // In general, we should check first and second for trailing and leading slashes,
  // but in our specific case this seems to be sufficient
  return base + '/' + uri;
}
