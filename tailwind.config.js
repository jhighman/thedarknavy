/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./**/*.html",
    "./js/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        'navy': '#0F1E33',
        'golden-blaze': '#C5FF45',
        'teal-pulse': '#2A9D8F',
        'white-spark': '#FFFFFF',
        'lime-green': '#C5FF45',
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