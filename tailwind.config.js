/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}', // src 하위 JSX/TSX 다 스캔
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: 'var(--brand-red)',
          mint: 'var(--brand-mint)',
        },
        chip: {
          bp: 'var(--chip-bg)',
          border: 'var(--chip-border)',
        },
      },
    },
  },
  plugins: [],
};
