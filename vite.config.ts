import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import htmlMinifier from 'vite-plugin-html-minifier';

export default defineConfig({
  plugins: [htmlMinifier(), viteSingleFile()],
  build: {
    rolldownOptions: {
      output: {
        comments: {
          legal: true,
        },
      },
    },
  },
});
