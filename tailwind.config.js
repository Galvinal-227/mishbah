/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        emerald: {
          deep: '#0F3D32',
          main: '#176B5B',
          muted: '#3F7D6D',
          soft: '#E6EFEA',
          pale: '#F0F6F3',
        },
        cream: {
          DEFAULT: '#F7F3E8',
          dark: '#EDE7D6',
        },
        ivory: '#FCFAF4',
        gold: {
          DEFAULT: '#B89B5E',
          soft: '#D4BE87',
          dark: '#8F7844',
        },
        ink: {
          DEFAULT: '#19352E',
          soft: '#2C4A42',
          muted: '#5A6E67',
          pale: '#8A9A94',
        },
        line: {
          DEFAULT: '#E5E0D2',
          soft: '#F0EBDD',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        arabic: ['"Amiri Quran"', '"Scheherazade New"', 'serif'],
        arabicAlt: ['"Scheherazade New"', 'serif'],
        display: ['"Fraunces"', 'serif'],
      },
      fontSize: {
        'arabic-sm': ['1.75rem', { lineHeight: '2.8' }],
        'arabic-base': ['2.25rem', { lineHeight: '3.4' }],
        'arabic-lg': ['2.75rem', { lineHeight: '4' }],
        'arabic-xl': ['3.5rem', { lineHeight: '4.8' }],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(25, 53, 46, 0.04), 0 4px 16px rgba(25, 53, 46, 0.06)',
        card: '0 1px 3px rgba(25, 53, 46, 0.06), 0 8px 24px rgba(25, 53, 46, 0.08)',
        glow: '0 0 0 4px rgba(23, 107, 91, 0.12)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        shimmer: 'shimmer 1.6s infinite',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};