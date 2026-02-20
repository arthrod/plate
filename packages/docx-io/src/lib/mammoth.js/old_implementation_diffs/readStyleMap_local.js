// lib/main.ts:71
function readStyleMap(styleMapPath) {
  if (styleMapPath) {
    return promises.nfcall(fs.readFile, styleMapPath, 'utf8');
  }
  return promises.resolve(null);
}
