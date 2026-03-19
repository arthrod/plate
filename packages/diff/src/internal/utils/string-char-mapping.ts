/**
 * This Apache-2.0 licensed file has been modified by Udecode and other
 * contributors. See /packages/diff/LICENSE for more information.
 */

import type { Descendant } from 'platejs';

import { unusedCharGenerator } from './unused-char-generator';

/**
 * Recursively sort keys of an object to produce a stable JSON string.
 */
function stableStringify(obj: any): string {
  if (obj === null || typeof obj !== 'object') {
    return JSON.stringify(obj);
  }

  if (Array.isArray(obj)) {
    return `[${obj.map((item) => stableStringify(item)).join(',')}]`;
  }

  const keys = Object.keys(obj).sort();
  const parts: string[] = [];

  for (const key of keys) {
    if (obj[key] !== undefined) {
      parts.push(`${JSON.stringify(key)}:${stableStringify(obj[key])}`);
    }
  }

  return `{${parts.join(',')}}`;
}

export class StringCharMapping {
  private readonly _charGenerator = unusedCharGenerator();

  // O(1) mappings for character <-> node lookups
  private readonly _charToNode = new Map<string, Descendant>();
  private readonly _nodeByRefToChar = new Map<Descendant, string>();
  private readonly _nodeByKeyToChar = new Map<string, string>();

  charToNode(c: string): Descendant {
    const node = this._charToNode.get(c);

    if (!node) throw new Error(`No node found for char ${c}`);

    return node;
  }

  nodesToString(nodes: Descendant[]): string {
    return nodes.map(this.nodeToChar.bind(this)).join('');
  }

  nodeToChar(node: Descendant): string {
    // 1. Check for reference equality (fastest)
    const refChar = this._nodeByRefToChar.get(node);
    if (refChar !== undefined) {
      return refChar;
    }

    // 2. Check for structural equality via stable JSON key (replaces O(N) lodash/isEqual)
    const nodeKey = stableStringify(node);
    const keyChar = this._nodeByKeyToChar.get(nodeKey);
    if (keyChar !== undefined) {
      // Map this reference so future lookups are faster
      this._nodeByRefToChar.set(node, keyChar);
      return keyChar;
    }

    // 3. Generate a new character and map it
    const c = this._charGenerator.next().value;

    this._charToNode.set(c, node);
    this._nodeByRefToChar.set(node, c);
    this._nodeByKeyToChar.set(nodeKey, c);

    return c;
  }

  stringToNodes(s: string): Descendant[] {
    return s.split('').map(this.charToNode.bind(this));
  }
}
