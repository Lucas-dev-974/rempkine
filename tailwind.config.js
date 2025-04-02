/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx, css}"],
  theme: {
    extend: {
      colors: {
        primary: "#3c50e0",
        primaryHover: "#4c62ff",
        "gray-dark": "#4e4e4e",
        "blue-base": "#019fc5",
        "blue-light": "#00b8e5",
        "red-base": "#DD2A2A",
      },
    },
  },
  plugins: [],
};
