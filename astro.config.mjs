import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

// https://astro.build/config
// `hybrid`: pages prerender by default; /api/* routes opt into SSR via
// `export const prerender = false` so the YouTube RSS proxy runs live.
export default defineConfig({
  site: 'https://elina.chat',
  output: 'hybrid',
  adapter: node({ mode: 'standalone' }),
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
  },
});
