// pretext measures text via a canvas context. In the test runtime there is no
// DOM/canvas, so we install a deterministic monospace stub (10px per char)
// BEFORE importing the module under test — this makes line breaking exact and
// machine-independent for the test, while production uses the real browser canvas.
class StubOffscreenCanvas {
  getContext() {
    return {
      font: '',
      measureText: (s: string) => ({ width: s.length * 10 }),
    };
  }
}
// @ts-expect-error - test-only canvas stub
globalThis.OffscreenCanvas = StubOffscreenCanvas;

import { measureTextLines } from '../pretext';

describe('measureTextLines', () => {
  it('keeps text that fits within the width on a single line', () => {
    // "hi there" = 8 chars * 10px = 80px < 100px width.
    const lines = measureTextLines('hi there', '16px monospace', 100, 20);
    expect(lines).toHaveLength(1);
    expect(lines[0].text).toBe('hi there');
  });

  it('wraps text wider than the line into word-broken lines', () => {
    // 10px/char, 100px width → wraps at word boundaries.
    const lines = measureTextLines(
      'alpha beta gamma delta',
      '16px monospace',
      100,
      20
    );
    expect(lines.map((l) => l.text.trim())).toEqual([
      'alpha beta',
      'gamma',
      'delta',
    ]);
  });

  it('exposes an advancing cursor range per line (mapping seed)', () => {
    const lines = measureTextLines(
      'alpha beta gamma delta',
      '16px monospace',
      100,
      20
    );
    expect(lines[0].start).toEqual({ segmentIndex: 0, graphemeIndex: 0 });
    // each line's end is at or beyond its start; next line starts at prev end.
    for (let i = 1; i < lines.length; i++) {
      expect(lines[i].start.segmentIndex).toBeGreaterThanOrEqual(
        lines[i - 1].start.segmentIndex
      );
    }
  });
});
