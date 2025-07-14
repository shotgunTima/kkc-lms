/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'blue-around': '0 4px 8px rgba(59, 130, 246, 0.15), 0 -4px 8px rgba(59, 130, 246, 0.08), 4px 0 8px rgba(59, 130, 246, 0.08), -4px 0 8px rgba(59, 130, 246, 0.08)',
        'soft-gray-around': '0 4px 8px rgba(0, 0, 0, 0.06), 0 -4px 8px rgba(0, 0, 0, 0.04), 4px 0 8px rgba(0, 0, 0, 0.04), -4px 0 8px rgba(0, 0, 0, 0.04)',
        'black-around': '0 2px 4px rgba(0, 0, 0, 0.12), 0 -2px 4px rgba(0, 0, 0, 0.10), 2px 0 4px rgba(0, 0, 0, 0.10), -2px 0 4px rgba(0, 0, 0, 0.10)',
        'white-around': '0 2px 4px rgba(255, 255, 255, 0.15), 0 -2px 4px rgba(255, 255, 255, 0.12), 2px 0 4px rgba(255, 255, 255, 0.12), -2px 0 4px rgba(255, 255, 255, 0.12)',


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


