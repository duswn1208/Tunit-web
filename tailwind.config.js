/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        'primary-bg': 'var(--color-primary-bg)',
        'primary-dark': 'var(--color-primary-dark)',
        surface: 'var(--bg-surface)',
        base: 'var(--bg-base)',
        border: 'var(--border)',
        'lesson-pending': 'var(--lesson-pending)',
        'lesson-confirmed': 'var(--lesson-confirmed)',
        'lesson-completed': 'var(--lesson-completed)',
        'lesson-cancelled': 'var(--lesson-cancelled)',
        'lesson-trial': 'var(--lesson-trial)',
        'lesson-firstcome': 'var(--lesson-firstcome)',
        // Legacy aliases
        brand: {
          red: 'var(--color-primary)',
          mint: 'var(--brand-mint)',
        },
        chip: {
          bp: 'var(--chip-bg)',
          border: 'var(--chip-border)',
        },
      },
      borderRadius: {
        card: 'var(--radius-card)',
        btn: 'var(--radius-btn)',
        chip: 'var(--radius-chip)',
        modal: 'var(--radius-modal)',
        input: 'var(--radius-input)',
      },
      fontFamily: {
        sans: ['Pretendard Variable', 'Pretendard', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        hover: 'var(--shadow-hover)',
        drawer: 'var(--shadow-drawer)',
        brand: 'var(--shadow-brand)',
      },
    },
  },
  plugins: [],
};
