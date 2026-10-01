module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,css,scss}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Archivo", "Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "Menlo", "monospace"],
      },
      // Token names only, by role. `amber` replaces Tailwind's amber-* scale on
      // purpose: the page has one accent, so `text-amber-400` must not exist.
      colors: {
        ink: "#121513",
        "ink-2": "#4A4F4C",
        pine: "#0F1A15",
        soot: "#0A0F0C",
        surface: "#1A1E1B",
        "surface-pine": "#16231C",
        line: "#2E3330",
        "line-pine": "#2A3A31",
        "line-mid": "#3A403C",
        "line-pine-mid": "#3A4A41",
        "line-hi": "#6B736E",
        "line-soot": "#1E2823",
        paper: "#ECEBE5",
        "paper-2": "#C2C7C3",
        muted: "#939A95",
        amber: "#E9A23B",
        heat: {
          0: "#1E2A24",
          1: "#504320",
          2: "#806129",
          3: "#B58132",
          4: "#E9A23B",
        },
      },
      maxWidth: {
        page: "1296px",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
