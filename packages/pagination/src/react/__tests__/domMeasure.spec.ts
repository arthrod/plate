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

import { createDomMeasure, topLevelBlockElements } from '../domMeasure';

const block = (index: number, text: string) => ({
  id: `b${index}`,
  path: [index],
  text,
  type: 'p',
});

const attach = (editable: HTMLElement) => {
  document.body.appendChild(editable);

  return editable;
};

describe('topLevelBlockElements', () => {
  it('returns direct Slate element children', () => {
    const editable = document.createElement('div');
    editable.innerHTML = `
      <h1 data-slate-node="element">Title</h1>
      <p data-slate-node="element">Body</p>
    `;

    expect(topLevelBlockElements(editable).map((el) => el.textContent)).toEqual(
      ['Title', 'Body']
    );
  });

  it('returns Slate elements wrapped by block UI chrome', () => {
    const editable = document.createElement('div');
    editable.innerHTML = `
      <div class="relative group">
        <div contenteditable="false">drag handle</div>
        <h1 data-slate-node="element">Title</h1>
      </div>
      <div class="relative group">
        <div contenteditable="false">drag handle</div>
        <p data-slate-node="element">
          Body <a data-slate-node="element">link</a>
        </p>
      </div>
    `;

    expect(
      topLevelBlockElements(editable).map((el) => el.textContent?.trim())
    ).toEqual(['Title', 'Body link']);
  });
});

describe('createDomMeasure', () => {
  it('returns null when the block DOM cannot be resolved', () => {
    const editable = document.createElement('div');

    expect(createDomMeasure(editable)(block(0, 'Missing'))).toBeNull();
  });

  it('measures direct top-level blocks', () => {
    const editable = document.createElement('div');
    editable.innerHTML = '<p data-slate-node="element">Body text</p>';
    const element = editable.firstElementChild as HTMLElement;
    element.style.cssText = [
      'border-bottom: 6px solid black',
      'border-top: 5px solid black',
      'font-family: sans-serif',
      'font-size: 16px',
      'line-height: 20px',
      'margin-bottom: 2px',
      'margin-top: 1px',
      'padding-bottom: 4px',
      'padding-left: 11px',
      'padding-right: 7px',
      'padding-top: 3px',
    ].join(';');
    Object.defineProperty(element, 'clientWidth', {
      configurable: true,
      value: 200,
    });

    const metrics = createDomMeasure(attach(editable))(block(0, 'Body text'));

    expect(metrics?.lineHeightPx).toBe(20);
    expect(metrics?.boxSpacingPx).toBe(21);
    expect(metrics?.heightPx).toBeGreaterThan(0);
  });

  it('measures blocks nested inside top-level UI wrappers', () => {
    const editable = document.createElement('div');
    editable.innerHTML = `
      <div class="relative group">
        <p data-slate-node="element">First</p>
      </div>
      <div class="relative group">
        <p data-slate-node="element">Second</p>
      </div>
    `;
    attach(editable);
    const second = topLevelBlockElements(editable)[1];
    second.style.cssText = 'font-size: 16px; line-height: 24px';
    Object.defineProperty(second, 'clientWidth', {
      configurable: true,
      value: 200,
    });

    const metrics = createDomMeasure(editable)(block(1, 'Second'));

    expect(metrics?.lineHeightPx).toBe(24);
    expect(metrics?.heightPx).toBeGreaterThan(0);
  });
});
