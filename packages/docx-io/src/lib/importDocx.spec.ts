import { afterAll, afterEach, describe, expect, it, mock } from 'bun:test';

const cleanDocxMock = mock((html: string) => html);
const convertToHtmlMock = mock();

mock.module('@platejs/docx', () => ({
  cleanDocx: cleanDocxMock,
}));

mock.module('mammoth', () => ({
  default: {
    convertToHtml: convertToHtmlMock,
  },
}));

const loadModule = async () =>
  import(`./importDocx?test=${Math.random().toString(36).slice(2)}`);

describe('importDocx', () => {
  afterEach(() => {
    cleanDocxMock.mockReset();
    convertToHtmlMock.mockReset();
  });

  afterAll(() => {
    mock.restore();
  });

  it('converts mammoth html, cleans it, deserializes nodes, and returns warnings', async () => {
    const { importDocx } = await loadModule();
    const deserialize = mock(() => [
      { type: 'p', children: [{ text: 'Hello' }] },
    ]);

    convertToHtmlMock.mockImplementation(async () => ({
      messages: [{ message: 'warn-1' }],
      value: '<p>Hello</p>',
    }));

    const result = await importDocx(
      {
        api: {
          html: {
            deserialize,
          },
        },
      } as any,
      new ArrayBuffer(8),
      { rtf: '{\\\\rtf1}' }
    );

    expect(convertToHtmlMock).toHaveBeenCalledWith(
      { arrayBuffer: expect.any(ArrayBuffer) },
      { styleMap: ['comment-reference => sup'] }
    );
    expect(cleanDocxMock).toHaveBeenCalledWith('<p>Hello</p>', '{\\\\rtf1}');
    expect(deserialize).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      comments: [],
      nodes: [{ type: 'p', children: [{ text: 'Hello' }] }],
      warnings: ['warn-1'],
    });
  });
});

describe('liftBlocksOutOfParagraphs', () => {
  const noopEditor = { api: { isBlock: () => false } } as any;

  it('lifts a block-void child out of a paragraph', async () => {
    const { liftBlocksOutOfParagraphs } = await import('./importDocx');
    const result = liftBlocksOutOfParagraphs(noopEditor, [
      {
        type: 'p',
        children: [{ type: 'img', url: 'a.png', children: [{ text: '' }] }],
      },
    ]);
    expect(result).toEqual([
      { type: 'img', url: 'a.png', children: [{ text: '' }] },
    ]);
  });

  it('splits a paragraph around an inline-block child', async () => {
    const { liftBlocksOutOfParagraphs } = await import('./importDocx');
    const result = liftBlocksOutOfParagraphs(noopEditor, [
      {
        align: 'center',
        type: 'p',
        children: [
          { text: 'before' },
          { type: 'img', url: 'a.png', children: [{ text: '' }] },
          { text: 'after' },
        ],
      },
    ]);
    expect(result).toEqual([
      { type: 'p', align: 'center', children: [{ text: 'before' }] },
      { type: 'img', url: 'a.png', children: [{ text: '' }] },
      { type: 'p', align: 'center', children: [{ text: 'after' }] },
    ]);
  });

  it('flattens nested paragraphs', async () => {
    const { liftBlocksOutOfParagraphs } = await import('./importDocx');
    const result = liftBlocksOutOfParagraphs(noopEditor, [
      {
        type: 'p',
        children: [{ type: 'p', children: [{ text: 'nested' }] }],
      },
    ]);
    expect(result).toEqual([{ type: 'p', children: [{ text: 'nested' }] }]);
  });

  it('lifts a block-void child out of a list-item-content (lic)', async () => {
    const { liftBlocksOutOfParagraphs } = await import('./importDocx');
    const result = liftBlocksOutOfParagraphs(noopEditor, [
      {
        type: 'lic',
        children: [{ type: 'img', url: 'a.png', children: [{ text: '' }] }],
      },
    ]);
    expect(result).toEqual([
      { type: 'img', url: 'a.png', children: [{ text: '' }] },
    ]);
  });

  it('leaves block containers (table/tr/td) untouched', async () => {
    const { liftBlocksOutOfParagraphs } = await import('./importDocx');
    const input = [
      {
        type: 'table',
        children: [
          {
            type: 'tr',
            children: [
              {
                type: 'td',
                children: [{ type: 'p', children: [{ text: 'cell' }] }],
              },
            ],
          },
        ],
      },
    ];
    const result = liftBlocksOutOfParagraphs(noopEditor, input);
    expect(result).toEqual(input);
  });

  it('does not propagate uniqueness-bearing properties on split', async () => {
    const { liftBlocksOutOfParagraphs } = await import('./importDocx');
    const result = liftBlocksOutOfParagraphs(noopEditor, [
      {
        commentId: 'c1',
        listId: 'list1',
        type: 'p',
        children: [
          { text: 'before' },
          { type: 'img', url: 'a.png', children: [{ text: '' }] },
          { text: 'after' },
        ],
      } as any,
    ]);
    // commentId/listId must NOT appear on either split half.
    expect(result.every((n) => !('commentId' in n) && !('listId' in n))).toBe(
      true
    );
  });

  it('falls back to FALLBACK_BLOCK_VOIDS when editor.api.isBlock is missing', async () => {
    const { liftBlocksOutOfParagraphs } = await import('./importDocx');
    const result = liftBlocksOutOfParagraphs(undefined, [
      {
        type: 'p',
        children: [{ type: 'hr', children: [{ text: '' }] }],
      },
    ]);
    expect(result).toEqual([{ type: 'hr', children: [{ text: '' }] }]);
  });

  it('uses editor.api.isBlock to lift custom block types not in the fallback sets', async () => {
    const { liftBlocksOutOfParagraphs } = await import('./importDocx');
    const isBlock = mock((node: any) => node?.type === 'custom_void');
    const editor = { api: { isBlock } } as any;
    const result = liftBlocksOutOfParagraphs(editor, [
      {
        type: 'p',
        children: [
          { text: 'before' },
          { type: 'custom_void', children: [{ text: '' }] },
          { text: 'after' },
        ],
      },
    ]);
    expect(result).toEqual([
      { type: 'p', children: [{ text: 'before' }] },
      { type: 'custom_void', children: [{ text: '' }] },
      { type: 'p', children: [{ text: 'after' }] },
    ]);
    expect(isBlock).toHaveBeenCalled();
  });
});
