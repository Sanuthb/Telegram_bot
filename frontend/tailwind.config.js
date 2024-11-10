/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary:'#111526',
        secondary:'#171b2e',
        accent:'#D91656',

      }
    },
  },
  plugins: [],
}



