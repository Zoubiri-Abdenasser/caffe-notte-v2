/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FAF7F2',
        espresso: '#2C1810',
        gold: '#C8973F',
        latte: '#E8D5B7',
        mocha: '#6B3F2A',
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Tajawal', 'sans-serif'],
      },
    },
  },
  plugins: [],
}