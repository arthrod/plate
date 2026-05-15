// ============================================================
// paginationTransforms.spec.ts — TDD Cycle 4: Transforms API
// ============================================================
import { createSlateEditor } from 'platejs';
import { BasePaginationPlugin } from '../BasePaginationPlugin';

const pageType = 'page';

type PaginationTransforms = {
  togglePreview?: () => boolean;
  setPageSize?: (size: 'A4' | 'Legal' | 'Letter') => void;
  setMargins?: (margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  }) => void;
  toggleHeader?: () => boolean;
  toggleFooter?: () => boolean;
};

function getTf(editor: any): PaginationTransforms | undefined {
  return (editor.tf as any).pagination;
}

describe('Pagination Transforms API', () => {
  describe('togglePreview', () => {
    it("toggles viewMode from 'paginated' to 'continuous'", () => {
      const editor = createSlateEditor({
        plugins: [BasePaginationPlugin],
        value: [
          { type: pageType, children: [{ type: 'p', children: [{ text: '' }] }] },
        ],
      });

      const tf = getTf(editor);
      expect(tf).toBeDefined();
      expect(tf!.togglePreview).toBeDefined();

      const result = tf!.togglePreview!();
      expect(result).toBe(true);
      expect(editor.getOptions(BasePaginationPlugin).viewMode).toBe('continuous');
    });

    it("toggles viewMode from 'continuous' to 'paginated'", () => {
      const editor = createSlateEditor({
        plugins: [
          BasePaginationPlugin.configure({ options: { viewMode: 'continuous' } }),
        ],
        value: [
          { type: pageType, children: [{ type: 'p', children: [{ text: '' }] }] },
        ],
      });

      const tf = getTf(editor);
      const result = tf!.togglePreview!();
      expect(result).toBe(false);
      expect(editor.getOptions(BasePaginationPlugin).viewMode).toBe('paginated');
    });
  });

  describe('setPageSize', () => {
    it('sets size to A4 (794x1123)', () => {
      const editor = createSlateEditor({
        plugins: [BasePaginationPlugin],
        value: [
          { type: pageType, children: [{ type: 'p', children: [{ text: '' }] }] },
        ],
      });

      getTf(editor)!.setPageSize!('A4');
      expect(editor.getOptions(BasePaginationPlugin).documentSettings.sizes).toEqual(
        { width: 794, height: 1123 }
      );
    });

    it('sets size to Letter (816x1056)', () => {
      const editor = createSlateEditor({
        plugins: [BasePaginationPlugin],
        value: [
          { type: pageType, children: [{ type: 'p', children: [{ text: '' }] }] },
        ],
      });

      getTf(editor)!.setPageSize!('Letter');
      expect(editor.getOptions(BasePaginationPlugin).documentSettings.sizes).toEqual(
        { width: 816, height: 1056 }
      );
    });

    it('sets size to Legal (816x1344)', () => {
      const editor = createSlateEditor({
        plugins: [BasePaginationPlugin],
        value: [
          { type: pageType, children: [{ type: 'p', children: [{ text: '' }] }] },
        ],
      });

      getTf(editor)!.setPageSize!('Legal');
      expect(editor.getOptions(BasePaginationPlugin).documentSettings.sizes).toEqual(
        { width: 816, height: 1344 }
      );
    });
  });

  describe('setMargins', () => {
    it('updates all four margins', () => {
      const editor = createSlateEditor({
        plugins: [BasePaginationPlugin],
        value: [
          { type: pageType, children: [{ type: 'p', children: [{ text: '' }] }] },
        ],
      });

      getTf(editor)!.setMargins!({ top: 48, right: 48, bottom: 48, left: 48 });
      expect(
        editor.getOptions(BasePaginationPlugin).documentSettings.margins
      ).toEqual({ top: 48, right: 48, bottom: 48, left: 48 });
    });

    it('updates margins asymmetrically', () => {
      const editor = createSlateEditor({
        plugins: [BasePaginationPlugin],
        value: [
          { type: pageType, children: [{ type: 'p', children: [{ text: '' }] }] },
        ],
      });

      getTf(editor)!.setMargins!({ top: 72, right: 48, bottom: 96, left: 64 });
      expect(
        editor.getOptions(BasePaginationPlugin).documentSettings.margins
      ).toEqual({ top: 72, right: 48, bottom: 96, left: 64 });
    });
  });

  describe('toggleHeader', () => {
    it('inserts header as first child of every page when no headers exist', () => {
      const editor = createSlateEditor({
        plugins: [BasePaginationPlugin],
        value: [
          {
            type: pageType,
            children: [
              { type: 'p', children: [{ text: 'page one' }] },
            ],
          },
          {
            type: pageType,
            children: [
              { type: 'p', children: [{ text: 'page two' }] },
            ],
          },
        ],
      });

      const result = getTf(editor)!.toggleHeader!();
      expect(result).toBe(true);

      const page0 = editor.children[0] as any;
      const page1 = editor.children[1] as any;

      expect(page0.children).toHaveLength(2);
      expect(page0.children[0]).toMatchObject({
        type: 'header',
        children: [{ type: 'p', children: [{ text: '' }] }],
      });
      expect(page0.children[1]).toMatchObject({
        type: 'p',
        children: [{ text: 'page one' }],
      });

      expect(page1.children).toHaveLength(2);
      expect(page1.children[0]).toMatchObject({
        type: 'header',
        children: [{ type: 'p', children: [{ text: '' }] }],
      });
      expect(page1.children[1]).toMatchObject({
        type: 'p',
        children: [{ text: 'page two' }],
      });
    });

    it('removes headers from all pages when headers exist', () => {
      const editor = createSlateEditor({
        plugins: [BasePaginationPlugin],
        value: [
          {
            type: pageType,
            children: [
              {
                type: 'header',
                children: [{ type: 'p', children: [{ text: 'header' }] }],
              },
              { type: 'p', children: [{ text: 'page one' }] },
            ],
          },
          {
            type: pageType,
            children: [
              {
                type: 'header',
                children: [{ type: 'p', children: [{ text: 'header' }] }],
              },
              { type: 'p', children: [{ text: 'page two' }] },
            ],
          },
        ],
      });

      const result = getTf(editor)!.toggleHeader!();
      expect(result).toBe(false);

      const page0 = editor.children[0] as any;
      const page1 = editor.children[1] as any;

      expect(page0.children).toHaveLength(1);
      expect(page0.children[0]).toMatchObject({
        type: 'p',
        children: [{ text: 'page one' }],
      });

      expect(page1.children).toHaveLength(1);
      expect(page1.children[0]).toMatchObject({
        type: 'p',
        children: [{ text: 'page two' }],
      });
    });
  });

  describe('toggleFooter', () => {
    it('inserts footer as last child of every page when no footers exist', () => {
      const editor = createSlateEditor({
        plugins: [BasePaginationPlugin],
        value: [
          {
            type: pageType,
            children: [
              { type: 'p', children: [{ text: 'page one' }] },
            ],
          },
          {
            type: pageType,
            children: [
              { type: 'p', children: [{ text: 'page two' }] },
            ],
          },
        ],
      });

      const result = getTf(editor)!.toggleFooter!();
      expect(result).toBe(true);

      const page0 = editor.children[0] as any;
      const page1 = editor.children[1] as any;

      expect(page0.children).toHaveLength(2);
      expect(page0.children[1]).toMatchObject({
        type: 'footer',
        children: [{ type: 'p', children: [{ text: '' }] }],
      });

      expect(page1.children).toHaveLength(2);
      expect(page1.children[1]).toMatchObject({
        type: 'footer',
        children: [{ type: 'p', children: [{ text: '' }] }],
      });
    });

    it('removes footers from all pages when footers exist', () => {
      const editor = createSlateEditor({
        plugins: [BasePaginationPlugin],
        value: [
          {
            type: pageType,
            children: [
              { type: 'p', children: [{ text: 'page one' }] },
              {
                type: 'footer',
                children: [{ type: 'p', children: [{ text: 'footer' }] }],
              },
            ],
          },
          {
            type: pageType,
            children: [
              { type: 'p', children: [{ text: 'page two' }] },
              {
                type: 'footer',
                children: [{ type: 'p', children: [{ text: 'footer' }] }],
              },
            ],
          },
        ],
      });

      const result = getTf(editor)!.toggleFooter!();
      expect(result).toBe(false);

      const page0 = editor.children[0] as any;
      const page1 = editor.children[1] as any;

      expect(page0.children).toHaveLength(1);
      expect(page0.children[0]).toMatchObject({
        type: 'p',
        children: [{ text: 'page one' }],
      });

      expect(page1.children).toHaveLength(1);
      expect(page1.children[0]).toMatchObject({
        type: 'p',
        children: [{ text: 'page two' }],
      });
    });
  });

  describe('dirty marking', () => {
    it('toggleHeader marks pages as dirty after mutation', () => {
      const editor = createSlateEditor({
        plugins: [BasePaginationPlugin],
        value: [
          {
            type: pageType,
            children: [{ type: 'p', children: [{ text: '' }] }],
          },
        ],
      });

      const rt = (editor as any).__paginationRuntime;
      rt.consumeDirtyMin(); // clear initial

      getTf(editor)!.toggleHeader!();
      expect(rt.consumeDirtyMin()).not.toBeNull();
    });

    it('toggleFooter marks pages as dirty after mutation', () => {
      const editor = createSlateEditor({
        plugins: [BasePaginationPlugin],
        value: [
          {
            type: pageType,
            children: [{ type: 'p', children: [{ text: '' }] }],
          },
        ],
      });

      const rt = (editor as any).__paginationRuntime;
      rt.consumeDirtyMin(); // clear initial

      getTf(editor)!.toggleFooter!();
      expect(rt.consumeDirtyMin()).not.toBeNull();
    });
  });
});
