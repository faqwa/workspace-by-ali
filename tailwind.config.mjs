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
        // Personal Workspace colors
        personal: {
          primary: '#22c55e',  // Green-500 - Growth
          accent: '#84cc16',   // Lime-500 - Fresh
          light: '#f0fdf4',    // Green-50 - Surface
        },
        // Commons Workspace colors
        commons: {
          primary: '#3b82f6',  // Blue-500 - Trust
          accent: '#06b6d4',   // Cyan-500 - Clarity
          light: '#eff6ff',    // Blue-50 - Surface
        },
        // Safety protocol states
        safety: {
          current: '#22c55e',  // Green - Up to date 🟢
          pending: '#f59e0b',  // Amber - Review needed 🟡
          required: '#ef4444', // Red - Action required 🔴
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
