import type { UnistNode } from '@/types/unist';
import type { z } from 'zod';

import { registryItemSchema } from 'shadcn/registry';

export function fixImport(content: string) {
  const regex =
    /@\/(.+?)\/((?:.*?\/)?(?:components|ui|hooks|lib|example))\/([\w-]+)/g;

  const replacement = (
    match: string,
    _path: string,
    type: string,
    component: string
  ) => {
    if (type.endsWith('components') || type.endsWith('example')) {
      return `@/components/${component}`;
    }
    if (type.endsWith('ui')) {
      return `@/components/ui/${component}`;
    }
    if (type.endsWith('hooks')) {
      return `@/hooks/${component}`;
    }
    if (type.endsWith('lib')) {
      return `@/lib/${component}`;
    }

    return match;
  };

  return content.replaceAll(regex, replacement);
}

export function getNodeAttributeByName(node: UnistNode, name: string) {
  return node.attributes?.find((attribute) => attribute.name === name);
}

export type FileTree = {
  name: string;
  children?: FileTree[];
  path?: string;
};

export function createFileTreeForRegistryItemFiles(
  files?: { path: string; target?: string }[]
) {
  if (!files) {
    return null;
  }

  const root: FileTree[] = [];

  for (const file of files) {
    const path = file.target ?? file.path;
    const parts = path.split('/');
    let currentLevel = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isFile = i === parts.length - 1;
      const existingNode = currentLevel.find((node) => node.name === part);

      if (existingNode) {
        if (isFile) {
          // Update existing file node with full path
          existingNode.path = path;
        } else {
          // Move to next level in the tree
          currentLevel = existingNode.children!;
        }
      } else {
        const newNode: FileTree = isFile
          ? { name: part, path }
          : { children: [], name: part };

        currentLevel.push(newNode);

        if (!isFile) {
          currentLevel = newNode.children!;
        }
      }
    }
  }

  return root;
}
