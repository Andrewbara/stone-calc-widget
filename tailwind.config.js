/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb", // синий как в калькуляторе
        lightGray: "#f3f4f6", // фон
      },
      spacing: {
        70: "70px",
      },
    },
  },
  plugins: [],
}
