module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        success: '#54ba08',
        error: '#ba0d34',
        primary: '#47a5d3',
        secondary: '#aa44dd',
        base: {
          '100': '#999999',
          '200': '#777777',
          '300': '#555555',
          '400': '#323232',
          '500': '#2b2b2b',
          '600': '#121212',
        },
      },
    }
  },
  plugins: [],
}
