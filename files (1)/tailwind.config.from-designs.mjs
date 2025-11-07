/**
 * Tailwind Configuration - Based on Improved Designs
 * 
 * Extracted from: /design/projects-page-redesign.html
 *                 /design/create-project-redesign.html
 * 
 * Features:
 * - Green primary brand (#00D084)
 * - Modern gray scale
 * - Consistent spacing and sizing
 * - Smooth transitions
 */

export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary Brand - Green
        primary: {
          DEFAULT: '#00D084',
          50: '#E6F9F3',
          100: '#CCFCE7',
          200: '#99F9CF',
          300: '#66F6B7',
          400: '#33F39F',
          500: '#00D084',  // Main
          600: '#00A368',  // Hover
          700: '#00875A',  // Dark
          800: '#006A4B',
          900: '#004E39',
        },
        // Gray Scale (exact from designs)
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
        // Semantic Colors
        success: '#00D084',
        warning: '#F59E0B',
        error: '#DC2626',
        danger: '#DC2626',
        info: '#3B82F6',
        // Accent Colors
        purple: '#7C3AED',
        blue: '#3B82F6',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        mono: [
          'SF Mono',
          'Monaco',
          'Cascadia Code',
          'Roboto Mono',
          'Consolas',
          'monospace',
        ],
      },
      fontSize: {
        // From your designs
        'tiny': '11px',
        'xs': '12px',
        'sm': '13px',
        'base': '14px',
        'md': '15px',
        'lg': '18px',
        'xl': '20px',
        '2xl': '32px',
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      borderRadius: {
        'sm': '6px',
        'DEFAULT': '8px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        'full': '9999px',
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'DEFAULT': '0 4px 6px rgba(0, 0, 0, 0.08)',
        'md': '0 4px 6px rgba(0, 0, 0, 0.08)',
        'lg': '0 8px 20px rgba(0, 0, 0, 0.08)',
        'xl': '0 12px 24px rgba(0, 0, 0, 0.1)',
        'hover': '0 8px 20px rgba(0, 0, 0, 0.08)',
        'focus': '0 0 0 3px rgba(0, 208, 132, 0.1)',
        'primary': '0 4px 12px rgba(0, 208, 132, 0.3)',
      },
      spacing: {
        // Your designs use these specific values
        '18': '4.5rem',  // 72px
        '22': '5.5rem',  // 88px
      },
      maxWidth: {
        'search': '400px',
      },
      minWidth: {
        'search': '250px',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'lift': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-2px)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-in': 'slide-in 0.3s ease-out',
        'lift': 'lift 0.2s ease-out',
      },
    },
  },
  plugins: [],
}
