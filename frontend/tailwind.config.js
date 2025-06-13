/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
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
