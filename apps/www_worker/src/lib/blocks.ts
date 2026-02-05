'use server';

import registry from 'registry';
import { z } from 'zod';

// Minimal schema for registry items — avoids importing from 'shadcn/registry'
// which pulls in ts-morph/typescript and breaks the Cloudflare worker bundle.
const registryItemSchema = z
  .object({
    name: z.string(),
    type: z.string(),
    title: z.string().optional(),
    author: z.string().optional(),
    description: z.string().optional(),
    dependencies: z.array(z.string()).optional(),
    devDependencies: z.array(z.string()).optional(),
    registryDependencies: z.array(z.string()).optional(),
    files: z.array(z.any()).optional(),
    css: z.record(z.string(), z.any()).optional(),
    meta: z.record(z.string(), z.any()).optional(),
    docs: z.string().optional(),
    categories: z.array(z.string()).optional(),
  })
  .passthrough();

// SYNC

// const BLOCKS_WHITELIST_PREFIXES = ['sidebar', 'login'];
const REGISTRY_BLOCK_TYPES = new Set(['registry:block']);

export async function getAllBlocks() {
  const blocks = _getAllBlocks();

  return blocks;
}

function _getAllBlocks() {
  // Parse and validate the registry items
  const items = z.array(registryItemSchema).parse(registry.items);

  return items.filter(
    (block) =>
      REGISTRY_BLOCK_TYPES.has(block.type) &&
      block.categories?.includes('Editors')
  );
}
