import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['__benchmarks__/index.ts'],
  outDir: 'benchmarks',
  format: ['esm'],
  target: 'node20',
  clean: true,
  splitting: false,
  shims: false,
  dts: false,
});
