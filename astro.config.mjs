import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://workspace.xbyali.page',
  output: 'server',
  adapter: vercel(),
  integrations: [react()],
  // Remove base path for Vercel deployment
  // (GitHub Pages base path no longer needed)
});