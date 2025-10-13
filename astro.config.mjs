import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';

// Update YOUR-USERNAME with your GitHub username when deploying
export default defineConfig({
  site: 'https://writingsbyali-hub.github.io',
  base: '/workspace-by-ali/',
  output: 'server',
  adapter: vercel(),
});