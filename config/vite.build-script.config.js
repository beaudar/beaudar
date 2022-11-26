import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, '../src/client.ts'),
      formats: ['umd'],
      name: 'client',
      fileName: () => 'client.js',
      output: {
        dir: resolve(__dirname, '../dist'),
      },
    },
  },
});
