import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Marine palette
        ocean: {
          50: '#e8f5f5',
          100: '#c5e8e9',
          200: '#9dd5d7',
          300: '#6cbfc2',
          400: '#3BBFBF',
          500: '#1E8FA0',
          600: '#176d7d',
          700: '#0f4d5a',
          800: '#083038',
          900: '#0A2342',
          950: '#061929',
        },
        coral: {
          50: '#fef4f0',
          100: '#fde4d8',
          200: '#fac5b0',
          300: '#f5a080',
          400: '#E8856A',
          500: '#d9644a',
          600: '#b84a31',
          700: '#8f3524',
          800: '#63241a',
          900: '#3d1610',
        },
        sandy: {
          50: '#fdfaf3',
          100: '#F4E4C1',
          200: '#ead5a0',
          300: '#dcc07a',
          400: '#ceaa56',
          500: '#b5913a',
          600: '#8f712c',
          700: '#68521e',
          800: '#433313',
          900: '#211a0a',
        },
        seafoam: '#E8F5F5',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-cabinet)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'ocean-gradient': 'linear-gradient(180deg, #0A2342 0%, #1E8FA0 50%, #3BBFBF 100%)',
        'surface-gradient': 'linear-gradient(180deg, #3BBFBF 0%, #1E8FA0 100%)',
        'deep-gradient': 'linear-gradient(180deg, #0A2342 0%, #083038 100%)',
      },
      animation: {
        'wave': 'wave 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(5deg)' },
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
