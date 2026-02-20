// lib/index.ts:71
function parseStyleMap(styleMap) {
  return Result.combine((styleMap || []).map(readStyle)).map((styleMap) =>
    styleMap.filter((styleMapping) => !!styleMapping)
  );
}
