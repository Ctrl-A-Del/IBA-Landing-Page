/** @type {import('tailwindcss').Config} */
module.exports = {
  // CRA 5 detects this file and wires `tailwindcss` into its PostCSS pipeline
  // automatically (react-scripts/config/webpack.config.js: useTailwind).
  content: ["./src/**/*.{js,jsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        // Primary dark background used across sections
        brand: {
          DEFAULT: "#0a1f2e",
          alt: "#14171a",
        },
        // Brand gradient endpoints (buttons, icon circles, hover overlays)
        accent: {
          from: "#6372ff",
          to: "#5ca9fb",
        },
        link: "#608dfd",
        surface: "#f6f6f6",
      },
      fontFamily: {
        heading: ["Raleway", "sans-serif"],
        body: ['"Open Sans"', "sans-serif"],
        nav: ["Lato", "sans-serif"],
      },
      maxWidth: {
        container: "1170px",
      },
    },
  },
  plugins: [],
};
