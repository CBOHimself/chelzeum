/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-primary': 'var(--color-bg-primary)',
        'bg-secondary': 'var(--color-bg-secondary)',
        'accent-rose': 'var(--color-accent-rose)',
        'accent-mauve': 'var(--color-accent-mauve)',
        'text-light': 'var(--color-text-light)',
      },
    },
  },
  plugins: [],
};
