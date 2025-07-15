// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      animation: {
        shimmer: 'shimmer 1.5s infinite linear',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
}
