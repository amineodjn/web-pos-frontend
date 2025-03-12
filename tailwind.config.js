/** @type {import('tailwindcss').Config} */
import flowbite from 'flowbite/plugin'

export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{html,vue,js,ts,jsx,tsx}',
    './node_modules/flowbite/**/*.js'
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#1e1e1e',
      },
      fontFamily: {
        sans: ['Lobster', 'sans-serif']
      },
      boxShadow: {
        'dark-hover': '0 8px 16px rgba(255, 255, 255, 0.1)',
      },
    }
  },
  variants: {
    extend: {}
  },
  plugins: [flowbite]
}
