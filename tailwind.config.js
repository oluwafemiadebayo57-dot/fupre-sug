/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        fupre: {
          navy: '#0a1f44',       // deep navy (primary)
          blue: '#12386b',       // mid navy
          light: '#1e4d8c',      // lighter navy (hover states)
          gold: '#f5b400',       // gold accent (FUPRE yellow)
          cream: '#fdf8ee',      // soft background tint
        }
      }
    },
  },
  plugins: [],
}