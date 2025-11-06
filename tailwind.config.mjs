/**
 * Tailwind CSS v4 Configuration with DaisyUI
 *
 * Workspace Brand Design System
 * Full documentation: docs/architecture/04_Brand_Design_System.md
 *
 * Key Brand Concepts:
 * - Personal Workspace: Green (growth, cultivation) 🌱
 * - Commons Workspace: Blue (trust, depth) 🌳
 * - Connection: Purple (bridge between worlds)
 */

import daisyui from 'daisyui';

export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
  ],
  plugins: [daisyui],
  // DaisyUI used only for component structure (drawer, card, btn classes)
  // Colors managed via Tailwind utilities + CSS custom properties in global.css
  daisyui: {
    themes: false, // Disable theme system, use pure Tailwind
    logs: false,
  },
  theme: {
    extend: {
      colors: {
        // Personal Workspace colors - Reference CSS variables
        personal: {
          primary: 'var(--personal-primary)',  // Green - Growth
          'primary-hover': '#16a34a',          // Green-600 for hover states
          accent: '#84cc16',                   // Lime-500 - Fresh
          light: '#f0fdf4',                    // Green-50 - Surface
        },
        // Commons Workspace colors - Reference CSS variables
        commons: {
          primary: 'var(--commons-primary)',   // Blue - Trust
          'primary-hover': '#2563eb',          // Blue-600 for hover states
          accent: '#06b6d4',                   // Cyan-500 - Clarity
          light: '#eff6ff',                    // Blue-50 - Surface
        },
        // Safety protocol states - Reference CSS variables
        safety: {
          current: 'var(--safety-current)',    // Green - Up to date 🟢
          pending: 'var(--safety-pending)',    // Amber - Review needed 🟡
          required: 'var(--safety-required)',  // Red - Action required 🔴
        },
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s infinite linear',
      },
    },
  },
}
