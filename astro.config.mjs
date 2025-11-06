import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import keystatic from '@keystatic/astro';

// https://astro.build/config
export default defineConfig({
  site: 'https://workspace.xbyali.page',
  output: 'server',
  adapter: vercel(),
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: true,
    }),
    keystatic(),
  ],
});