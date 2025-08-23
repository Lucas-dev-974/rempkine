/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx, css}"],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",
        primaryHover: "#1d4ed8",
        "gray-dark": "#4e4e4e",
        "blue-base": "#019fc5",
        "blue-light": "#00b8e5",
        "red-base": "#DD2A2A",

        // ----------------

        "green-primary": "#619e90",
        "green-dark": "#153C33",
        "green-light": "#e6efed"
      },
    },
  },
  plugins: [],
};
