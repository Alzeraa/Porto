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
        }
      }
    },
  },
  plugins: [],
}

