/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'brand-blue':   'rgb(0, 36, 71)',
        'brand-blue-2': 'rgb(0, 68, 124)',
        'brand-gold':   'rgb(242, 142, 35)',
        'gold-start':   'rgb(255, 193, 7)',
        'gold-end':     'rgb(230, 92, 0)',
        'dark-bg':      'rgb(16, 16, 16)',
        'dark-surface': 'rgb(33, 37, 41)',
        'light-bg':     'rgb(242, 244, 246)',
        'muted':        'rgb(115, 115, 115)',
      },
      fontFamily: {
        sans: ['Urbanist', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(90deg, rgb(255,193,7) 0%, rgb(230,92,0) 100%)',
      },
    },
  },
  plugins: [],
}
