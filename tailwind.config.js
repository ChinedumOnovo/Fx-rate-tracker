/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50:  "#E8F4FD",
          500: "#0D2144",
          700: "#0A1628",
          900: "#060D18",
        },
        teal: {
          400: "#00C9A7",
          500: "#00B396",
        },
        gold: {
          400: "#FFB703",
          500: "#E6A502",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      keyframes: {
        'fade-in-up': {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'coin-hover': {
          '0%':   { transform: 'scale(1)    translateY(0px)' },
          '45%':  { transform: 'scale(1.14) translateY(-8px)' },
          '70%':  { transform: 'scale(1.10) translateY(-5px)' },
          '100%': { transform: 'scale(1.12) translateY(-6px)' },
        },
        'twinkle': {
          '0%, 100%': { opacity: '0.15', transform: 'scale(0.9)' },
          '50%':      { opacity: '0.4',  transform: 'scale(1.1)' },
        },
      },
      animation: {
        'fade-in-up':  'fade-in-up 0.7s ease-out both',
        'coin-hover':  'coin-hover 0.3s ease-out forwards',
        'twinkle':     'twinkle 3s ease-in-out infinite',
        'twinkle-alt': 'twinkle 4.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}