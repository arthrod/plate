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

import { measureBlockHeight, measureTextLines } from '../pretext';

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

describe('measureBlockHeight', () => {
  it('is the wrapped line count times the line height', () => {
    // "alpha beta gamma delta" wraps to 3 lines at 100px → 3 * 20 = 60.
    expect(
      measureBlockHeight('alpha beta gamma delta', '16px monospace', 100, 20)
    ).toBe(60);
  });

  it('treats empty text as a single line tall', () => {
    expect(measureBlockHeight('', '16px monospace', 100, 20)).toBe(20);
  });

  it('returns a single line height when text fits on one line', () => {
    // "hi" = 2 chars * 10px = 20px < 100px width → 1 line * 24px = 24.
    expect(measureBlockHeight('hi', '16px monospace', 100, 24)).toBe(24);
  });

  it('scales with lineHeightPx (different line height)', () => {
    // "alpha beta gamma delta" wraps to 3 lines; at lineHeightPx=30 → 90.
    expect(
      measureBlockHeight('alpha beta gamma delta', '16px monospace', 100, 30)
    ).toBe(90);
  });
});

describe('measureTextLines — structural guarantees', () => {
  it('returns at least one line for any non-empty text', () => {
    const lines = measureTextLines('x', '16px monospace', 1000, 20);
    expect(lines.length).toBeGreaterThanOrEqual(1);
  });

  it('each line has a non-negative widthPx', () => {
    const lines = measureTextLines('hello world', '16px monospace', 200, 20);
    for (const line of lines) {
      expect(line.widthPx).toBeGreaterThanOrEqual(0);
    }
  });

  it('each line carries a text property', () => {
    const lines = measureTextLines('hello world', '16px monospace', 200, 20);
    for (const line of lines) {
      expect(typeof line.text).toBe('string');
    }
  });

  it('more lines are produced when the width is narrower', () => {
    const wideLines = measureTextLines(
      'alpha beta gamma delta',
      '16px monospace',
      1000,
      20
    );
    const narrowLines = measureTextLines(
      'alpha beta gamma delta',
      '16px monospace',
      100,
      20
    );
    expect(narrowLines.length).toBeGreaterThan(wideLines.length);
  });
});
