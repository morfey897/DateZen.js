// tsup.config.ts
import { defineConfig } from 'tsup';
import { stripCommentsPlugin } from './strip-comments-plugin.js';

export default defineConfig({
  entry: ['src/index.ts', 'src/utility.ts'], // Entry file(s)
  format: ['cjs', 'esm'], // Output formats
  dts: true, // Generate TypeScript declarations
  sourcemap: true, // Generate source maps
  clean: true, // Clean output directory before each build
  minify: false, // Minify output
  // target: 'es2020', // JavaScript target version
  splitting: false,

  minifySyntax: true,
  minifyWhitespace: false,
  minifyIdentifiers: false,

  treeshake: true,

  banner: { js: '"use strict";' },

  esbuildOptions(options) {
    options.drop = ['console', 'debugger'];
  },

  esbuildPlugins: [stripCommentsPlugin()],
});
