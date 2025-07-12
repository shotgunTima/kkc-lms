/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'blue-around': '0 4px 8px rgba(59, 130, 246, 0.15), 0 -4px 8px rgba(59, 130, 246, 0.08), 4px 0 8px rgba(59, 130, 246, 0.08), -4px 0 8px rgba(59, 130, 246, 0.08)',
        'soft-gray-around': '0 4px 8px rgba(0, 0, 0, 0.06), 0 -4px 8px rgba(0, 0, 0, 0.04), 4px 0 8px rgba(0, 0, 0, 0.04), -4px 0 8px rgba(0, 0, 0, 0.04)',
      },
      colors: {
        bgPrimary: '#8FC2F9',
        bgSecondary: '#07619D',
        textPrimary: '#022B6D',
        textSecondary: '#9E0C10',
        tableColor: '#EDEDED'
      },
    },
  },
  plugins: [],
}
