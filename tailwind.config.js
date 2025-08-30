/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx, css}"],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",
        "primary-lite": "#B7CEFF",
        primaryHover: "#1d4ed8",
        // ----------------
        "green-light": "#e6efed"
      },
    },
  },
  plugins: [],
};
