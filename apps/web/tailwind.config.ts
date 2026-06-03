import type { Config } from 'tailwindcss'

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#141F2E',
          50: '#E8ECF0',
          100: '#C5CDD8',
          200: '#9FAEBF',
          300: '#7A8FA5',
          400: '#5E7590',
          500: '#455E78',
          600: '#354963',
          700: '#26374F',
          800: '#1A2A3F',
          900: '#141F2E',
        },
        teal: {
          DEFAULT: '#286B72',
          50: '#E8F4F5',
          100: '#C4E2E5',
          200: '#9CCFD3',
          300: '#72BAC0',
          400: '#4FA9AF',
          500: '#31979E',
          600: '#286B72',
          700: '#1F5259',
          800: '#163D43',
          900: '#0E2A2E',
        },
        steel: {
          DEFAULT: '#A2B3BC',
          50: '#F4F7F8',
          100: '#E4EBEE',
          200: '#CDDAE0',
          300: '#B5C7CF',
          400: '#A2B3BC',
          500: '#8CA0AB',
          600: '#748E99',
          700: '#5E7A86',
          800: '#4A6571',
          900: '#37515C',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.25rem',
      },
    },
  },
  plugins: [],
} satisfies Config
