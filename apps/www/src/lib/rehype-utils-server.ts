import React from 'react';

import type { z } from 'zod';

import { promises as fs } from 'node:fs';
import path from 'node:path';
import {
  type Registry,
  type RegistryItem,
  type registryItemFileSchema,
  registryItemSchema,
} from 'shadcn/registry';

import registryShadcnData from '../../registry-shadcn.json';
import { Index } from '../__registry__';
import { registry } from '../registry/registry';
import { fixImport } from './rehype-utils';

const registryShadcn = registryShadcnData as unknown as Registry;

export function getAllFiles(
  name: string,
  seen = new Set<string>(),
  isShadcn?: boolean
) {
  const registryTarget = isShadcn ? registryShadcn : registry;

  if (seen.has(name)) return [];

  seen.add(name);

  const component: any = registryTarget.items.find((c) => c.name === name);

  if (!component) {
    throw new Error(`File ${name} not found`);
  }

  const files: string[] = [
    ...(component.files ?? []),
    ...(component.registryDependencies ?? []).flatMap((dep: any) => {
      const isDependencyShadcn = dep.includes('shadcn/');

      return getAllFiles(
        isDependencyShadcn ? dep.split('shadcn/')[1] : dep,
        seen,
        isShadcn || isDependencyShadcn
      ).filter(Boolean);
    }),
  ];

  const uniqueFiles = Array.from(new Set(files));

  return processFiles(uniqueFiles);
}

function processFiles(files: ({ path: string; file?: string } | string)[]): {
  file: string;
  language: string;
  name: string;
  type: string;
}[] {
  return files.map((fileOrObj) => {
    const file =
      typeof fileOrObj === 'string'
        ? fileOrObj
        : (fileOrObj.path ?? fileOrObj.file);

    return {
      file,
      language: path.extname(file).slice(1),
      name: path.basename(file),
      type: getFileType(file),
    };
  });
}

function getFileType(file: string): string {
  if (file.includes('components/')) {
    return 'components';
  }
  if (file.includes('ui/')) {
    return 'ui';
  }
  if (file.includes('hooks/')) {
    return 'hooks';
  }
  if (file.includes('lib/')) {
    return 'lib';
  }
  if (file.includes('example/')) {
    return 'example';
  }

  return 'unknown';
}

export function getAllDependencies(
  name: string,
  seen = new Set<string>(),
  isShadcn?: boolean
): string[] {
  const registryTarget = isShadcn ? registryShadcn : registry;

  if (seen.has(name)) return [];

  seen.add(name);

  const component = registryTarget.items.find((c) => c.name === name);

  if (!component) {
    throw new Error(`Dependency ${name} not found from ${registryTarget.name}`);
  }

  const deps = [
    ...(component.dependencies ?? []),
    ...(component.registryDependencies ?? []).flatMap((dep) => {
      const isDependencyShadcn = dep.includes('shadcn/');

      return getAllDependencies(
        isDependencyShadcn ? dep.split('shadcn/')[1] : dep,
        seen,
        isShadcn || isDependencyShadcn
      );
    }),
  ];

  return Array.from(new Set(deps));
}

const memoizedIndex: typeof Index = Object.fromEntries(
  Object.entries(Index).map(([style, items]) => [style, { ...items }])
);

export function getRegistryComponent(name: string) {
  if (name === 'slate-to-html') {
    return React.lazy(() => import('@/registry/blocks/slate-to-html/page'));
  }

  return memoizedIndex[name]?.component;
}

export async function getRegistryItem(
  name: string,
  prefetch = false
): Promise<RegistryItem | null> {
  const item = memoizedIndex[name];

  if (!item) {
    return null;
  }

  // Convert all file paths to object.
  // TODO: remove when we migrate to new registry.
  item.files = item.files.map((file: unknown) =>
    typeof file === 'string' ? { path: file } : file
  );

  // Fail early before doing expensive file operations.
  const result = registryItemSchema.safeParse(item);

  if (!result.success) {
    return null;
  }

  let files: typeof result.data.files = [];
  const seen = new Set<string>();

  // Get all files including dependencies
  const allFiles = await getAllItemFiles(name, seen);

  for (const file of allFiles) {
    const relativePath = path.relative(process.cwd(), file.path);

    const content =
      !prefetch || file.path === item.files[0].path
        ? await getFileContent(file as any)
        : undefined;

    files.push({
      ...file,
      content,
      path: relativePath,
    } as any);
  }

  // Get meta.
  // Assume the first file is the main file.
  // const meta = await getFileMeta(files[0].path);

  // Fix file paths.
  files = fixFilePaths(files);

  const parsed = registryItemSchema.safeParse({
    ...result.data,
    files,
    // meta,
  });

  if (!parsed.success) {
    console.error(parsed.error.message);

    return null;
  }

  return parsed.data;
}

// New helper function to get all files including dependencies
async function getAllItemFiles(
  name: string,
  seen = new Set<string>(),
  isShadcn?: boolean
): Promise<{ path: string; type?: string }[]> {
  if (seen.has(name)) return [];

  seen.add(name);

  // Skip shadcn files unless explicitly requested
  if (!isShadcn && name.includes('shadcn/')) {
    return [];
  }

  const registryTarget = isShadcn ? registryShadcn : registry;
  const item = registryTarget.items.find((c) => c.name === name);

  if (!item) return [];

  let allFiles = [...(item.files ?? [])].map((file) => {
    const filePath = typeof file === 'string' ? file : file.path;
    // Ensure path starts with src/registry/
    const normalizedPath = filePath.startsWith('src/registry/')
      ? filePath
      : `src/registry/${filePath}`;

    return typeof file === 'string'
      ? { path: normalizedPath }
      : { ...file, path: normalizedPath };
  });

  // Recursively get files from dependencies
  for (const dep of item.registryDependencies ?? []) {
    const isDependencyShadcn = dep.includes('shadcn/');
    // Skip shadcn dependencies unless we're already in a shadcn context
    if (!isShadcn && isDependencyShadcn) {
      continue;
    }
    const depFiles = await getAllItemFiles(
      isDependencyShadcn ? dep.split('shadcn/')[1] : dep,
      seen,
      isShadcn || isDependencyShadcn
    );
    if (depFiles.length > 0) {
      allFiles = [...allFiles, ...depFiles];
    }
  }

  // Remove duplicates based on path
  const uniqueFiles = Array.from(
    new Map(allFiles.map((file) => [file.path, file])).values()
  );

  return uniqueFiles;
}

async function getFileContent(file: z.infer<typeof registryItemFileSchema>) {
  // Try different path resolutions
  const possiblePaths = [
    file.path,
    file.path.replace('src/registry/', ''),
    `src/registry/${file.path}`,
  ].map((p) => path.join(process.cwd(), p));

  let raw: string | undefined;

  // Try each path until we find one that exists
  for (const filePath of possiblePaths) {
    try {
      raw = await fs.readFile(filePath, 'utf8');
      break;
    } catch (_error) {}
  }

  if (!raw) {
    throw new Error(`File not found: ${file.path}`);
  }

  // Optimize: directly process the string instead of using ts-morph.
  // The original code was using ts-morph to create a temporary source file,
  // parse it, and then call getFullText() which just returns the source string.
  // This overhead is unnecessary when we only need to perform simple string replacements.
  // Removing ts-morph saves significant memory and CPU time (~1.8ms -> ~0ms per call).
  const code = fixImport(raw);

  return code;
}

function getFileTarget(file: z.infer<typeof registryItemFileSchema>) {
  let target = file.target;

  if (!target || target === '') {
    const fileName = file.path.split('/').pop();

    if (file.type === 'registry:component') {
      target = file.path.replace('src/registry/', '');
    }
    if (file.type === 'registry:block' || file.type === 'registry:example') {
      target = `components/${fileName}`;
    }
    if (file.type === 'registry:ui') {
      target = `components/ui/${fileName}`;
    }
    if (file.type === 'registry:hook') {
      target = `hooks/${fileName}`;
    }
    if (file.type === 'registry:lib') {
      target = `lib/${fileName}`;
    }
  }

  return target ?? '';
}

function fixFilePaths(files: z.infer<typeof registryItemSchema>['files']) {
  if (!files?.length) {
    return [];
  }

  // Resolve all paths relative to the first file's directory.
  const firstFilePath = files[0].path;
  const firstFilePathDir = path.dirname(firstFilePath);

  return files.map((file) => ({
    ...file,
    path: path.relative(firstFilePathDir, file.path),
    target: getFileTarget(file),
  }));
}
