/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        'scale-pulse': 'scalePulse 2.5s ease-in-out infinite',
        'fade-in': 'fadeIn 1.5s ease-in-out forwards',
        'fade-bounce': 'fadeBounce 1.5s ease-in-out',
        'move-horizontal': 'moveHorizontal 3s ease-out forwards', // Add animation
      },
      keyframes: {
        scalePulse: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(10px)' },
        },
        fadeBounce: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '50%': { opacity: '1', transform: 'translateY(0)' },
          '75%': { transform: 'translateY(-10px)' },
          '100%': { transform: 'translateY(0)' },
        },
        moveHorizontal: {
          '0%': { transform: 'translateX(0)', }, // Start off-screen
          '100%': { transform: 'translateX(145%)', }, // End at original position
        },
      },
    },
  },
  plugins: [],
};