/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts,scss}", // Ensure all your component files are included
  ],
  theme: {
    extend: {
      zIndex: {
        100: "100",
      },
      transitionProperty: {
        "max-height": "max-height",
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      colors: {
        "custom-yellow": "#F4BF1B",
        "custom-light-yellow": "#E9C773",
        "custom-green": "#16791A",
        "custom-light-gray": "#ECECEC",
        "custom-light-red": "#FF9595",
        "custom-dark-red": "#9D3E3E",
        "custom-thin-gray": "#96969342",
        "custom-red": "#FF685F",
        "custom-light-green": "#6BA46D",
        "custom-very-light-yellow": "#F0D9A1",
      },
      boxShadow: {
        drop: "0px 4px 4px rgba(0, 0, 0, 0.25)",
      },
      screens: {
        xs: "479px",
      },
    },
  },
  plugins: [],
};
