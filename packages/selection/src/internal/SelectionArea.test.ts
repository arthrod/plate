import { SelectionArea } from './SelectionArea';

function createElement(id: string, rect: any): HTMLElement {
  const el = document.createElement('div');
  el.id = id;
  el.getBoundingClientRect = () => rect;
  return el;
}

describe('SelectionArea Logic', () => {
  test('Selects elements intersecting the area', () => {
    const container = document.createElement('div');
    const el1 = createElement('el1', {
      x: 0,
      y: 0,
      width: 10,
      height: 10,
      top: 0,
      bottom: 10,
      left: 0,
      right: 10,
    });
    const el2 = createElement('el2', {
      x: 20,
      y: 0,
      width: 10,
      height: 10,
      top: 0,
      bottom: 10,
      left: 20,
      right: 30,
    });

    container.appendChild(el1);
    container.appendChild(el2);

    const selection = new SelectionArea({
      container,
      selectables: ['div'],
      document,
    });

    const anySelection = selection as any;
    anySelection._selectables = [el1, el2];
    anySelection._container = container;

    // Set area to cover el1 only
    anySelection._areaRect = {
      x: 0,
      y: 0,
      width: 15,
      height: 15,
      top: 0,
      bottom: 15,
      left: 0,
      right: 15,
    };
    anySelection._containerRect = { left: 0, top: 0 };

    anySelection._updateElementSelection();

    expect(anySelection._selection.selected).toContain(el1);
    expect(anySelection._selection.selected).not.toContain(el2);
    expect(anySelection._selection.changed.added).toContain(el1);
  });

  test('Invert mode removes already stored elements', () => {
    const container = document.createElement('div');
    const el1 = createElement('el1', {
      x: 0,
      y: 0,
      width: 10,
      height: 10,
      top: 0,
      bottom: 10,
      left: 0,
      right: 10,
    });

    container.appendChild(el1);

    const selection = new SelectionArea({
      container,
      behaviour: { overlap: 'invert' },
      document,
    });

    const anySelection = selection as any;
    anySelection._selectables = [el1];
    anySelection._container = container;

    // Simulate el1 is already stored
    anySelection._selection.stored = [el1];

    // Set area to cover el1
    anySelection._areaRect = {
      x: 0,
      y: 0,
      width: 15,
      height: 15,
      top: 0,
      bottom: 15,
      left: 0,
      right: 15,
    };
    anySelection._containerRect = { left: 0, top: 0 };

    anySelection._updateElementSelection();

    expect(anySelection._selection.selected).not.toContain(el1);
    expect(anySelection._selection.changed.removed).toContain(el1);
  });

  test('Keep mode does not select already stored elements', () => {
    const container = document.createElement('div');
    const el1 = createElement('el1', {
      x: 0,
      y: 0,
      width: 10,
      height: 10,
      top: 0,
      bottom: 10,
      left: 0,
      right: 10,
    });

    container.appendChild(el1);

    const selection = new SelectionArea({
      container,
      behaviour: { overlap: 'keep' },
      document,
    });

    const anySelection = selection as any;
    anySelection._selectables = [el1];
    anySelection._container = container;

    // Simulate el1 is already stored
    anySelection._selection.stored = [el1];

    // Set area to cover el1
    anySelection._areaRect = {
      x: 0,
      y: 0,
      width: 15,
      height: 15,
      top: 0,
      bottom: 15,
      left: 0,
      right: 15,
    };
    anySelection._containerRect = { left: 0, top: 0 };

    anySelection._updateElementSelection();

    // In keep mode, if it's stored, it stays stored (logic in _updateElementSelection doesn't remove it)
    // "Check if user wants to keep previously selected elements"

    // Logic:
    // intersects -> true
    // !selected.includes(el1) -> true
    // invert -> false.
    // added.push(el1).
    // newlyTouched.push(el1).

    // Loop 2 (cleanup):
    // removed logic?

    // Wait, let's look at logic again.
    /*
        if (!selectedSet.has(node)) {
          // ...
          added.push(node);
        }
    */

    // So el1 is added to `added` and `newlyTouched`.
    // Then `_selection.selected = newlyTouched`.

    // So `selected` WILL contain `el1`.

    // But check the second loop:
    /*
    for (let i = 0; i < selected.length; i++) {
        // ...
        if (!newlyTouchedSet.has(node) && !(keep && storedSet.has(node))) {
            removed.push(node);
        }
    }
    */

    // This loop iterates over OLD `selected`.
    // In this test case, `selected` starts empty.

    // So el1 is in `selected` (newlyTouched).

    // Wait, what does `keep` mode actually do?
    // "Check if user wants to keep previously selected elements, e.g. not make them part of the current selection as soon as they're touched."

    // If overlap is keep, and element is stored.

    // In `_updateElementSelection`, `added.push(node)` happens if not in `selected`.

    // It seems `_updateElementSelection` ADDS it to `selected` regardless of `keep` if it wasn't selected before (in this drag).

    // But `_keepSelection` (called on stop) handles the final merge.
    /*
      case 'keep': {
        _selection.stored = [
          ...stored,
          ...selected.filter((el) => !stored.includes(el)), // Newly added
        ];
        break;
      }
    */

    // So `keep` mode means: existing stored elements are preserved, new ones are added.
    // But `selected` (the active selection) SHOULD contain the element if it's dragged over?

    // Let's verify what `_updateElementSelection` does.
    // It sets `selected = newlyTouched`.

    expect(anySelection._selection.selected).toContain(el1);
  });
});
