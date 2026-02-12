import { JSDOM } from 'jsdom';
import type { TNode } from 'platejs';

/** Normalize HTML by parsing through DOM and collapsing whitespace. */
export function normalizeHtml(html: string): string {
  const dom = new JSDOM(html);
  return dom.window.document.body.innerHTML.replace(/\s+/g, ' ').trim();
}

/** Validate field preservation in Plate nodes (paraId, replies, etc). */
export function validateFields(
  nodes: TNode[],
  errors: string[],
  path = 'root'
): void {
  for (const [idx, node] of nodes.entries()) {
    const nodePath = `${path}[${idx}]`;
    const n = node as Record<string, unknown>;

    if (
      (n.type === 'discussion' || n.type === 'comment') &&
      n.replies &&
      Array.isArray(n.replies)
    ) {
      for (const [rIdx, reply] of (
        n.replies as Record<string, unknown>[]
      ).entries()) {
        if (!reply.id) {
          errors.push(`Missing reply.id at ${nodePath}.replies[${rIdx}]`);
        }
      }
    }

    if (n.children && Array.isArray(n.children)) {
      validateFields(n.children as TNode[], errors, nodePath);
    }
  }
}
