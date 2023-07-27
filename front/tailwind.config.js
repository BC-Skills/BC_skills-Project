/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {},
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

