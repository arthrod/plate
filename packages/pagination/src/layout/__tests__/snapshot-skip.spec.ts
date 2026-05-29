import { buildSnapshot } from '../snapshot';

// A leading non-content node (the page-setup metadata node) must be excluded
// from the paginated snapshot, while real content blocks keep their true Slate
// paths so projection/selection map back correctly.
const pageSetup = { children: [{ text: '' }], type: 'page_setup' };
const p = (text: string) => ({ children: [{ text }], type: 'p' });

describe('buildSnapshot — skipTypes', () => {
  it('excludes skipped node types from the snapshot', () => {
    const out = buildSnapshot([pageSetup, p('one'), p('two')], {
      skipTypes: ['page_setup'],
    });

    expect(out.blocks).toHaveLength(2);
    expect(out.blocks.map((b) => b.text)).toEqual(['one', 'two']);
  });

  it('keeps real Slate paths for the surviving blocks', () => {
    const out = buildSnapshot([pageSetup, p('one'), p('two')], {
      skipTypes: ['page_setup'],
    });

    // page_setup is value[0]; the paragraphs stay at their real indices 1 and 2.
    expect(out.blocks[0].path).toEqual([1]);
    expect(out.blocks[1].path).toEqual([2]);
  });

  it('paginates every block when no skipTypes are given', () => {
    const out = buildSnapshot([p('a'), p('b')], {});

    expect(out.blocks).toHaveLength(2);
    expect(out.blocks[0].path).toEqual([0]);
  });
});
