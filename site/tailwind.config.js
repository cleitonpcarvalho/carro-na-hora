/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'brand-blue':      'rgb(0, 36, 71)',
        'brand-blue-2':    'rgb(0, 68, 124)',
        'brand-gold':      'rgb(242, 142, 35)',
        'gold-start':      'rgb(255, 193, 7)',
        'gold-end':        'rgb(230, 92, 0)',
        'dark-bg':         'rgb(16, 16, 16)',
        'dark-surface':    'rgb(33, 37, 41)',
        'light-bg':        'rgb(242, 244, 246)',
        'light-surface':   'rgb(255, 255, 255)',
        'muted':           'rgb(115, 115, 115)',
        'whatsapp':        'rgb(37, 211, 102)',
      },
      fontFamily: {
        sans: ['Urbanist', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, rgb(0,36,71) 0%, rgb(16,16,16) 100%)',
        'cta-gradient':  'linear-gradient(90deg, rgb(255,193,7) 0%, rgb(230,92,0) 100%)',
        'gold-gradient': 'linear-gradient(90deg, rgb(255,193,7) 0%, rgb(230,92,0) 100%)',
      },
      boxShadow: {
        'soft':       'rgba(0,0,0,0.05) 0px 10px 20px 0px',
        'hover':      'rgba(0,0,0,0.12) 0px 12px 30px 0px',
        'glow-gold':  'rgba(242,142,35,0.30) 0px 4px 20px 0px',
        'glow-green': 'rgba(37,211,102,0.40) 0px 4px 16px 0px',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
      },
      animation: {
        'fade-up':     'fadeUp 0.6s ease forwards',
        'fade-in':     'fadeIn 0.5s ease forwards',
        'pulse-slow':  'pulse 3s infinite',
        'float':       'float 4s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
