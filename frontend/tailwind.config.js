/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'brand': {
          'primary': 'var(--primary-color, #1e3a5f)',
          'light': 'var(--primary-light, #2563eb)',
          'dark': 'var(--primary-dark, #0f172a)',
          'accent': 'var(--accent-color, #0ea5e9)',
          'bg-dark': 'var(--background-dark, #0f172a)',
        },
        // Executive Precision Design System
        'exec': {
          'navy': '#0F172A',           // Midnight Navy - Primary
          'blue': '#2563EB',           // Electric Blue - Secondary
          'slate': '#334155',          // Slate - Tertiary
          'muted': '#64748B',          // Muted Slate - Neutral
          'surface-light': '#F8F9FF',  // Light surface
          'surface-muted': '#F1F5F9',  // Muted surface
          'border-light': '#E2E8F0',   // Light border
          'border-dark': '#1E293B',    // Dark border
          'text-secondary': '#94A3B8', // Secondary text
        }
      },
      fontFamily: {
        'jakarta': ['Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'exec-sm': '0px 1px 3px rgba(15, 23, 42, 0.05), 0px 1px 2px rgba(15, 23, 42, 0.03)',
        'exec-md': '0px 10px 15px -3px rgba(15, 23, 42, 0.08), 0px 4px 6px -4px rgba(15, 23, 42, 0.04)',
        'exec-lg': '0px 20px 25px -5px rgba(15, 23, 42, 0.12), 0px 8px 10px -6px rgba(15, 23, 42, 0.06)',
      },
      spacing: {
        'gutter': '1.5rem',
        'gutter-sm': '1rem',
      }
    },
  },
  plugins: [],
}

