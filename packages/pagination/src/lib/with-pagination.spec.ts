import { createSlateEditor } from 'platejs';

import { BasePaginationPlugin } from './base-pagination-plugin';

describe('withPagination', () => {
  it('enforceSectionInvariants is a no-op when autoEnforceSections is false', () => {
    const editor = createSlateEditor({
      plugins: [
        BasePaginationPlugin.configure({
          options: {
            autoEnforceSections: false,
          },
        }),
      ],
      value: [
        {
          children: [{ text: 'one' }],
          type: 'p',
        },
        {
          children: [{ text: 'two' }],
          type: 'p',
        },
      ],
    });

    expect(editor.children).toMatchObject([
      { children: [{ text: 'one' }], type: 'p' },
      { children: [{ text: 'two' }], type: 'p' },
    ]);
  });
});
