/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        admin: {
          primary: '#1e40af',
          secondary: '#6366f1',
          success: '#059669',
          warning: '#d97706',
          error: '#dc2626',
          dark: '#1f2937',
          light: '#f9fafb'
        }
      }
    },
  },
  plugins: [],
}
