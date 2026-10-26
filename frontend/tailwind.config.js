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
        // Medium Blue & Eye-friendly soft glass palette
        medblue: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        glass: {
          light: 'rgba(241, 245, 249, 0.85)',
          'light-hover': 'rgba(248, 250, 252, 0.95)',
          'light-border': 'rgba(203, 213, 225, 0.85)',
          dark: 'rgba(12, 12, 14, 0.85)',
          'dark-hover': 'rgba(24, 24, 27, 0.9)',
          'dark-border': 'rgba(255, 255, 255, 0.12)',
        },
        // True Black & White monochromatic dark mode palette
        black: '#000000',
        charcoal: {
          950: '#050506',
          900: '#09090b',
          850: '#101013',
          800: '#18181b',
          700: '#27272a',
          600: '#3f3f46',
          500: '#52525b',
          400: '#71717a',
          300: '#a1a1aa',
          200: '#d4d4d8',
          100: '#e4e4e7',
          50: '#f4f4f5',
        },
      },
      boxShadow: {
        'glass-light': '0 4px 20px -2px rgba(37, 99, 235, 0.06)',
        'glass-dark': '0 8px 30px rgba(0, 0, 0, 0.8)',
        'medblue-glow': '0 0 20px -3px rgba(37, 99, 235, 0.35)',
      },
    },
  },
  plugins: [],
};
