/** @type {import('tailwindcss').Config} */
import flowbite from 'flowbite/plugin'

export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Lobster', 'sans-serif'],
      },
    },
  },
  plugins: [
    flowbite
  ],
}
