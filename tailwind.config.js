/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        brand: {
          blue: '#3B6EF6',
          blueDark: '#2554D8',
          teal: '#4CC9B0',
          amber: '#F5B041',
          coral: '#EB5757',
          purple: '#9B51E0',
          bg: '#F4F6FA',
        }
      },
      boxShadow: {
        'card': '0 2px 12px -2px rgba(16, 24, 40, 0.05), 0 1px 4px -1px rgba(16, 24, 40, 0.03)',
        'card-hover': '0 8px 24px -4px rgba(59, 110, 246, 0.12), 0 2px 8px -2px rgba(16, 24, 40, 0.05)',
      }
    },
  },
  plugins: [],
}
