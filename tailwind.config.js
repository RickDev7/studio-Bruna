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
      animation: {
        'fadeIn': 'fadeIn 1s ease-out forwards',
        'subtle-zoom': 'subtle-zoom 20s ease-in-out infinite alternate',
        'scroll': 'scroll 2s ease-in-out infinite',
        'bounce': 'bounce 1s infinite',
      },
      keyframes: {
        fadeIn: {
          'from': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          'to': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'subtle-zoom': {
          'from': {
            transform: 'scale(1.05)',
          },
          'to': {
            transform: 'scale(1.1)',
          },
        },
        scroll: {
          '0%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(100%)',
          },
          '100%': {
            transform: 'translateY(0)',
          },
        },
      },
    },
  },
  plugins: [],
} 