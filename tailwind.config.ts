import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // KP Golf Brand Palette
        'kp-green': {
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        'kp-gold': {
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        'kp-dark': {
          900: '#0a0f0a',
          800: '#0f1a0f',
          700: '#1a2e1a',
          600: '#1f3a1f',
        },
        'kp-charcoal': '#1c1c1e',
        'kp-sand':    '#e8dcc8',
      },
      fontFamily: {
        sans:    ['var(--font-inter)', 'sans-serif'],
        display: ['var(--font-playfair)', 'serif'],
      },
      animation: {
        'marquee':        'marquee 30s linear infinite',
        'marquee-reverse':'marquee-reverse 35s linear infinite',
        'float':          'float 4s ease-in-out infinite',
        'float-delayed':  'float 4s ease-in-out 1.5s infinite',
        'fall':           'fall linear infinite',
        'fade-in':        'fadeIn 0.8s ease-out forwards',
        'fade-up':        'fadeUp 0.8s ease-out forwards',
        'spin-slow':      'spin 3s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%':   { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%':   { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        fall: {
          '0%':   { transform: 'translateY(-120px) rotate(0deg)',   opacity: '0.8' },
          '80%':  { opacity: '0.6' },
          '100%': { transform: 'translateY(110vh) rotate(360deg)', opacity: '0' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'gradient-radial':  'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':   'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-gradient':    'linear-gradient(135deg, #0a0f0a 0%, #1a2e1a 50%, #0f1a0f 100%)',
      },
    },
  },
  plugins: [],
}

export default config
