// tsup.config.ts
import { defineConfig } from 'tsup';
import stripPlugin from './plugins/strip-plugin.js';
import { readdir } from 'fs/promises';
import path from 'path';

const locales = await (async () => {
  const folderName = 'locale';
  const dicPath = path.join(__dirname, `./src/${folderName}`);
  const locales: Record<string, string> = {};
  try {
    const files = await readdir(dicPath);
    for (const file of files) {
      const filename = path.basename(file, '.ts');
      locales[`${folderName}/${filename}`] = `src/${folderName}/${filename}.ts`;
    }
  } catch (err) {
    console.error(err);
  }
  return locales;
})();

export default defineConfig({
  entry: {
    // Core
    index: 'src/index.ts',
    // Plugins
    'format/index': 'src/plugins/format.ts',
    'diff/index': 'src/plugins/diff.ts',
    ...locales,
    // Shared types
    'types/index': 'src/shared/types.ts',
  },
  format: ['cjs', 'esm'], // Output formats
  dts: true, // Generate TypeScript declarations
  sourcemap: true, // Generate source maps
  clean: true, // Clean output directory before each build
  minify: false, // Minify output
  splitting: false,

  minifySyntax: true,
  minifyWhitespace: false,
  minifyIdentifiers: false,

  treeshake: true,

  banner: { js: '"use strict";' },

  esbuildOptions(options, context) {
    options.drop = ['debugger'];
    if (context.format === 'cjs') {
      options.outExtension = { '.js': '.cjs' };
    } else if (context.format === 'esm') {
      options.outExtension = { '.js': '.mjs' };
    }
  },

  esbuildPlugins: [stripPlugin()],
});
