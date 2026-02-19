import { defineConfig } from 'tsup';

const common = {
  bundle: true,
  dts: false,
  sourcemap: false,
  splitting: false,
  target: 'es2019',
};

export default defineConfig([
  {
    ...common,
    banner: {
      js: "import { createRequire } from 'module'; const require = createRequire(import.meta.url);",
    },
    clean: true,
    entry: {
      index: 'lib/index.js',
    },
    format: ['esm'],
    outDir: 'dist/esm',
    outExtension: () => ({
      js: '.mjs',
    }),
    platform: 'node',
  },
  {
    ...common,
    clean: false,
    entry: {
      index: 'lib/index.js',
    },
    format: ['cjs'],
    outDir: 'dist/cjs',
    outExtension: () => ({
      js: '.cjs',
    }),
    platform: 'node',
  },
  {
    ...common,
    clean: false,
    entry: {
      'index.browser': 'lib/index.js',
    },
    format: ['esm'],
    outDir: 'dist/esm',
    outExtension: () => ({
      js: '.js',
    }),
    platform: 'browser',
  },
  {
    ...common,
    clean: false,
    entry: {
      'mammoth.browser': 'lib/index.js',
    },
    format: ['iife'],
    globalName: 'mammoth',
    minify: false,
    outDir: 'dist',
    outExtension: () => ({
      js: '.js',
    }),
    platform: 'browser',
  },
  {
    ...common,
    clean: false,
    entry: {
      'mammoth.browser.min': 'lib/index.js',
    },
    format: ['iife'],
    globalName: 'mammoth',
    minify: true,
    outDir: 'dist',
    outExtension: () => ({
      js: '.js',
    }),
    platform: 'browser',
  },
]);
