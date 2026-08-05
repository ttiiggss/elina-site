import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';

// https://astro.build/config
// `hybrid`: pages prerender by default; /api/* routes opt into SSR via
// `export const prerender = false` so the YouTube RSS proxy runs live as a
// Vercel serverless function. The static page is served from the CDN.
export default defineConfig({
  site: 'https://elina.chat',
  output: 'hybrid',
  adapter: vercel({ imageService: 'compile' }),
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
  },
});
