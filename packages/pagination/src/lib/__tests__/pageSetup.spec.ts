import { createSlateEditor } from 'platejs';

import { BasePageSetupPlugin } from '../BasePageSetupPlugin';
import {
  DEFAULT_PAGE_SETUP,
  getPageSetup,
  PAGE_SETUP_KEY,
  setPageSetup,
} from '../pageSetup';

const p = (text: string) => ({ children: [{ text }], type: 'p' });

function makeEditor(value: unknown[] = [p('hello')]) {
  return createSlateEditor({
    plugins: [BasePageSetupPlugin],
    value: value as any,
  });
}

describe('getPageSetup', () => {
  it('returns null when the document has no page_setup node', () => {
    expect(getPageSetup(makeEditor())).toBeNull();
  });

  it('returns the config when a page_setup node leads the document', () => {
    const editor = makeEditor([
      {
        children: [{ text: '' }],
        config: { ...DEFAULT_PAGE_SETUP, unit: 'cm' },
        type: PAGE_SETUP_KEY,
      },
      p('hi'),
    ]);

    expect(getPageSetup(editor)?.unit).toBe('cm');
  });
});

describe('setPageSetup', () => {
  it('inserts a page_setup node at index 0 with defaults when absent', () => {
    const editor = makeEditor();

    setPageSetup(editor, { unit: 'px' });

    expect((editor.children[0] as any).type).toBe(PAGE_SETUP_KEY);
    expect(getPageSetup(editor)?.unit).toBe('px'); // patched
    expect(getPageSetup(editor)?.page.preset).toBe('letter'); // default filled
  });

  it('merges a patch into the existing page_setup node (no duplicates)', () => {
    const editor = makeEditor();

    setPageSetup(editor, { unit: 'in' });
    setPageSetup(editor, { footnotes: 'endnote' });

    const cfg = getPageSetup(editor);
    expect(cfg?.unit).toBe('in'); // preserved across the second call
    expect(cfg?.footnotes).toBe('endnote'); // merged
    expect(
      editor.children.filter((n: any) => n.type === PAGE_SETUP_KEY)
    ).toHaveLength(1);
  });

  it('keeps real content as later siblings of the page_setup node', () => {
    const editor = makeEditor([p('body')]);

    setPageSetup(editor, {});

    expect((editor.children[0] as any).type).toBe(PAGE_SETUP_KEY);
    expect((editor.children[1] as any).children[0].text).toBe('body');
  });
});

describe('page_setup normalization', () => {
  it('promotes a stray page_setup node to index 0', () => {
    const editor = makeEditor([
      p('a'),
      {
        children: [{ text: '' }],
        config: DEFAULT_PAGE_SETUP,
        type: PAGE_SETUP_KEY,
      },
    ]);

    editor.tf.normalize({ force: true });

    expect((editor.children[0] as any).type).toBe(PAGE_SETUP_KEY);
  });

  it('collapses duplicate page_setup nodes to a single leading node', () => {
    const editor = makeEditor([
      {
        children: [{ text: '' }],
        config: DEFAULT_PAGE_SETUP,
        type: PAGE_SETUP_KEY,
      },
      p('a'),
      {
        children: [{ text: '' }],
        config: { ...DEFAULT_PAGE_SETUP, unit: 'cm' },
        type: PAGE_SETUP_KEY,
      },
    ]);

    editor.tf.normalize({ force: true });

    expect(
      editor.children.filter((n: any) => n.type === PAGE_SETUP_KEY)
    ).toHaveLength(1);
    expect((editor.children[0] as any).type).toBe(PAGE_SETUP_KEY);
  });
});
