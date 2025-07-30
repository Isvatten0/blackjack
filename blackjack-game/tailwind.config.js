/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'green-felt': '#0f5132',
        'card-back': '#1e3a8a',
      },
      animation: {
        'card-deal': 'cardDeal 0.3s ease-in-out',
        'card-flip': 'cardFlip 0.5s ease-in-out',
      },
      keyframes: {
        cardDeal: {
          '0%': { transform: 'translateX(-100px) rotate(-10deg)', opacity: '0' },
          '100%': { transform: 'translateX(0) rotate(0deg)', opacity: '1' },
        },
        cardFlip: {
          '0%': { transform: 'rotateY(0deg)' },
          '50%': { transform: 'rotateY(90deg)' },
          '100%': { transform: 'rotateY(0deg)' },
        },
      },
    },
  },
  plugins: [],
}