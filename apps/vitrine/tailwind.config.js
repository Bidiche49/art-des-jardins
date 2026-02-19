/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f6f7f0',
          100: '#e9eedd',
          200: '#d3debb',
          300: '#b6c78f',
          400: '#96ac66',
          500: '#738847',
          600: '#576b3b',
          700: '#44542f',
          800: '#384429',
          900: '#303b24',
        },
        secondary: {
          50: '#faf8f2',
          100: '#f3efe0',
          200: '#e6ddc0',
          300: '#d5c699',
          400: '#c4ad72',
          500: '#b89a58',
          600: '#a7834a',
          700: '#8b6740',
          800: '#735439',
          900: '#52422b',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out',
        'fade-up': 'fade-up 0.6s ease-out',
      },
    },
  },
  plugins: [],
};
