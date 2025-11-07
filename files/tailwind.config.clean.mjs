/**
 * Tailwind CSS Configuration - Clean & Modern
 * 
 * Workspace Brand Design System
 * - Personal Workspace: Green (growth, cultivation) 🌱
 * - Commons Workspace: Blue (trust, depth) 🌳
 * - Clean, consistent color system
 * - No DaisyUI conflicts
 */

export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // Personal Workspace - Green palette
        personal: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',  // Primary
          600: '#16a34a',  // Hover
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        // Commons Workspace - Blue palette
        commons: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',  // Primary
          600: '#2563eb',  // Hover
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // Connection - Purple (bridge between worlds)
        connection: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',  // Primary
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },
        // Safety states
        safety: {
          current: '#22c55e',   // 🟢 Up to date (green-500)
          pending: '#f59e0b',   // 🟡 Review needed (amber-500)
          required: '#ef4444',  // 🔴 Action required (red-500)
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'sans-serif'],
        mono: ['SF Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', 'Consolas', 'Courier New', 'monospace'],
      },
      borderRadius: {
        'sm': '6px',
        'DEFAULT': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s infinite linear',
        fadeIn: 'fadeIn 0.3s ease-out',
        slideIn: 'slideIn 0.3s ease-out',
      },
    },
  },
  plugins: [],
}
