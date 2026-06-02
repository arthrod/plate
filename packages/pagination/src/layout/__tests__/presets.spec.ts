import { getPresetPageSpec } from '../presets';

// Page presets resolve to px @ 96dpi. A4 must match the engine's historical
// default (794×1123) so swapping in the helper is behavior-preserving.
describe('getPresetPageSpec', () => {
  it('resolves US Letter to 8.5×11in at 96dpi', () => {
    expect(getPresetPageSpec('letter')).toEqual({
      heightPx: 1056,
      preset: 'letter',
      widthPx: 816,
    });
  });

  it('resolves A4 to the engine default (794×1123)', () => {
    expect(getPresetPageSpec('a4')).toEqual({
      heightPx: 1123,
      preset: 'a4',
      widthPx: 794,
    });
  });
});
