/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        thapar: {
          50: '#f0f4ff',
          100: '#e0e9fe',
          200: '#c2d4fe',
          300: '#94b3fd',
          400: '#6089fa',
          500: '#3b5df6',
          600: '#253fea',
          700: '#1d2cd8',
          800: '#1e26af',
          900: '#1e258a',
          950: '#121654'
        },
        darkbg: '#0b0f17',
        darkcard: '#131926',
        darkborder: '#1f293d'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
      }
    }
  },
  plugins: []
};
