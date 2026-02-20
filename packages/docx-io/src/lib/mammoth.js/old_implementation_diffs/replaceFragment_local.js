// lib/docx/uris.ts:13
function replaceFragment(uri, fragment) {
  var hashIndex = uri.indexOf('#');
  if (hashIndex !== -1) {
    uri = uri.substring(0, hashIndex);
  }
  return uri + '#' + fragment;
}
