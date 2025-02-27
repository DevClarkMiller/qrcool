/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          'base' : '#17153B',
          'medium' : '#433D8B',
          'regular' : '#433D8B',
          'light': '#C8ACD6',
          'sky': '#8FB1FF'
        }
      },
    },
    plugins: [],
  };