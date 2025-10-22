import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';

// https://astro.build/config
export default defineConfig({
  site: 'https://workspace.xbyali.page',
  output: 'server',
  adapter: vercel(),
  // Remove base path for Vercel deployment
  // (GitHub Pages base path no longer needed)
});