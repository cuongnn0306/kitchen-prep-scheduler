import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-outfit)', 'sans-serif'],
        body:    ['var(--font-body)',   'sans-serif'],
      },
      colors: {
        brand: {
          DEFAULT: '#f97316',
          dark:    '#ea580c',
          light:   '#fed7aa',
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'warm-sm': '0 2px 8px rgba(249, 115, 22, 0.12)',
        'warm':    '0 4px 16px rgba(249, 115, 22, 0.16)',
        'warm-lg': '0 8px 32px rgba(249, 115, 22, 0.20)',
      },
      animation: {
        'slide-up':    'slide-up 0.25s ease-out both',
        'fade-in':     'fade-in 0.2s ease-out both',
        'pulse-warm':  'pulse-warm 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
