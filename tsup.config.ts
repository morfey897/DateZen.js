// tsup.config.ts
import { defineConfig } from 'tsup';
import { stripCommentsPlugin } from './strip-comments-plugin.js';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'format/index': 'src/plugins/format.ts',
    'diff/index': 'src/plugins/diff.ts',
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
    options.drop = ['console', 'debugger'];
    if (context.format === 'cjs') {
      options.outExtension = { '.js': '.cjs' };
    } else if (context.format === 'esm') {
      options.outExtension = { '.js': '.mjs' };
    }
  },

  esbuildPlugins: [stripCommentsPlugin()],
});
