/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  separator: '_',
  theme: {
    extend: {
      colors: {
        'utd-green': '#154734',
        'utd-orange': '#E4701E', //slightly off from utd's orange, but matches comet cupboard colors
      },
      fontFamily: {
        utd: ['FF Din Pro', 'Barlow',],
      },
    },
  },
  plugins: [],
}

