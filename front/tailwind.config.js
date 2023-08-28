/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      gradientColorStops: {
        'ff9300': '#FF9300',
        '983ffb': '#983FFB',
        '068ff1': '#068FF1',
        'ff9300': '#FF9300',
        '05eb07': '#05EB07',
      },
    },
    screens: {
      'sm':  [
        { 'max': '1100px'},
      ],
      'md': [
        {'min': '1101px', 'max': '2000px'},
      ],
      'lg':  [
        {'min': '2000px'},
      ]
    }
  },
  plugins: [],
}

