/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx, css}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#e6f1fe",
          100: "#cce3fd",
          200: "#99c7fb",
          300: "#66aaf9",
          400: "#338ef7",
          500: "#1a73e8", // Main primary color
          600: "#155cb9",
          700: "#10458b",
          800: "#0b2e5c",
          900: "#05172e",
        },
        secondary: {
          50: "#e8f5ee",
          100: "#d1ebdd",
          200: "#a3d7bb",
          300: "#76c39a",
          400: "#48af78",
          500: "#34a853", // Main secondary color
          600: "#2a8642",
          700: "#1f6532",
          800: "#154321",
          900: "#0a2211",
        },
        accent: {
          50: "#fce9e7",
          100: "#f9d3cf",
          200: "#f3a7a0",
          300: "#ed7b70",
          400: "#e84f40",
          500: "#ea4335", // Main accent color
          600: "#bb352a",
          700: "#8c2820",
          800: "#5e1b15",
          900: "#2f0d0b",
        },
        success: {
          500: "#34a853", // Same as secondary
        },
        warning: {
          500: "#fbbc05",
        },
        error: {
          500: "#ea4335", // Same as accent
        },
        neutral: {
          50: "#f8f9fa",
          100: "#f1f3f4",
          200: "#e8eaed",
          300: "#dadce0",
          400: "#bdc1c6",
          500: "#9aa0a6",
          600: "#80868b",
          700: "#5f6368",
          800: "#3c4043",
          900: "#202124",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      spacing: {
        72: "18rem",
        84: "21rem",
        96: "24rem",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
