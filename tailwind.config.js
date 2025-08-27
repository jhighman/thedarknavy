/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./**/*.html",
    "./js/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        'navy': '#1A2A44',
        'golden-blaze': '#FFC107',
        'teal-pulse': '#26A69A',
        'white-spark': '#FFFFFF',
        'black-void': '#000000'
      },
      fontFamily: {
        'heading': ['Bebas Neue', 'sans-serif'],
        'body': ['Open Sans', 'sans-serif']
      }
    },
  },
  plugins: [],
}