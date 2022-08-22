/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    fontFamily: {
      sans: ["Inter", "sans-serif"],
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    // darkTheme: "night",
    darkTheme: "corporate",
    lightTheme: "corporate",
  }
};
