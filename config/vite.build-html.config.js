import { defineConfig } from 'vite';
import { posthtmlPlugin } from './vite-plugin-posthtml';
import expressions from 'posthtml-expressions';
import include from 'posthtml-include';
import md from './posthtml-md';
import { resolve } from 'path';

export default defineConfig({
  root: resolve(__dirname, '../src'),
  build: {
    emptyOutDir: false,
    rollupOptions: {
      input: [
        resolve(__dirname, '../src/index.html'),
        resolve(__dirname, '../src/beaudar.html'),
      ],
      output: {
        dir: resolve(__dirname, '../dist'),
      },
    },
  },
  plugins: [
    posthtmlPlugin({
      plugins: [
        expressions({
          root: resolve(__dirname),
          locals: {
            NODE_ENV: process.env.NODE_ENV,
          },
        }),
        include(),
        md(),
      ],
    }),
  ],
});
