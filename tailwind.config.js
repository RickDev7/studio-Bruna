/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'pink-primary': '#FF69B4',
        'pink-secondary': '#FFB6C1',
        'pink-light': '#FFC0CB',
      },
    },
  },
  plugins: [],
} 