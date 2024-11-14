// tsup.config.ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'], // Entry file(s)
  format: ['cjs', 'esm'], // Output formats
  dts: true, // Generate TypeScript declarations
  sourcemap: true, // Generate source maps
  clean: true, // Clean output directory before each build
  minify: false, // Minify output
  target: 'es2017', // JavaScript target version
  esbuildOptions(options) {
    options.drop = ['console', 'debugger'];
  },
});
