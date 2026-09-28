module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,css,scss}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["Fira Code", "ui-monospace", "monospace"],
      },
      colors: {
        cream: "#F7F4EE",
        "earth-tan": "#DBBB9C",
        "canyon-tan": "#E4D5B7",
        "forest-green": "#5E6746",
        "sage-green": "#7D8A69",
        "deep-forest": "#3A4428",
        "stone-black": "#2A2A2A",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
