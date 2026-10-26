/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        // Light Blue & White glass palette
        ice: {
          50: '#f8fbff',
          100: '#f0f7ff',
          200: '#e0f0fe',
          300: '#bae6fd',
          400: '#7dd3fc',
          500: '#38bdf8',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        azure: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        glass: {
          light: 'rgba(255, 255, 255, 0.72)',
          'light-hover': 'rgba(255, 255, 255, 0.88)',
          'light-border': 'rgba(255, 255, 255, 0.85)',
          dark: 'rgba(12, 24, 43, 0.75)',
          'dark-hover': 'rgba(16, 32, 58, 0.85)',
          'dark-border': 'rgba(56, 189, 248, 0.22)',
        },
        slate: {
          950: '#071120',
          900: '#0b172a',
          850: '#0f1f38',
          800: '#172b4d',
          700: '#233d6b',
          600: '#38578f',
          500: '#64748b',
          400: '#94a3b8',
          300: '#cbd5e1',
          200: '#e2e8f0',
          100: '#f1f5f9',
          50: '#f8fafc',
        },
      },
      boxShadow: {
        'glass-light': '0 8px 32px 0 rgba(14, 165, 233, 0.08), inset 0 0 0 1px rgba(255, 255, 255, 0.6)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 0 0 1px rgba(56, 189, 248, 0.18)',
        'glass-glow': '0 0 25px -3px rgba(56, 189, 248, 0.35)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
