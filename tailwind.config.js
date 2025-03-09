/** @type {import('tailwindcss').Config} */
import flowbite from 'flowbite/plugin'

export default {
  purge: ['./src/**/*.html', './src/**/*.vue', './src/**/*.jsx'],
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    './node_modules/flowbite/**/*.js'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Lobster', 'sans-serif']
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: [flowbite]
}
