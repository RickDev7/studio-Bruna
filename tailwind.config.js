/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'Times New Roman', 'serif'],
        sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        'pink-primary': '#CFAE9D',
        'pink-secondary': '#EAD0C2',
        'pink-light': '#D6C1B1',
        'luxury-bg-primary': '#F5F1EC',
        'luxury-bg-secondary': '#E7DBD1',
        'luxury-neutral': '#E4D6CC',
        'luxury-accent-soft': '#D6C1B1',
        'luxury-accent-medium': '#CFAE9D',
        'luxury-highlight-soft': '#EAD0C2',
        'luxury-text-main': '#8A5C4A',
        'luxury-gold': '#C8A27A',
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