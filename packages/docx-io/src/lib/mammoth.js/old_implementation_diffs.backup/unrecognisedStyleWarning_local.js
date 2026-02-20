// lib/document-to-html.ts:534
function unrecognisedStyleWarning(type, element) {
  return results.warning(
    'Unrecognised ' +
      type +
      " style: '" +
      element.styleName +
      "'" +
      ' (Style ID: ' +
      element.styleId +
      ')'
  );
}
