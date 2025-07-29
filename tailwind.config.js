/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'fixitnow': {
          'navy': '#1e3a8a', // Navy blue - primary brand color
          'green': '#10b981', // Electric green - accent color  
          'green-light': '#34d399', // Lighter electric green
          'navy-light': '#3b82f6', // Lighter navy for hover states
        }
      }
    },
  },
  plugins: [],
};
