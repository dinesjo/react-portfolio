/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#00040f",
        secondary: "#00f6ff",
        dimWhite: "rgba(255, 255, 255, 0.7)",
        dimBlue: "rgba(9, 151, 124, 0.1)",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    },
    screens: {
      xs: "480px",
      ss: "620px",
      sm: "768px",
      md: "1060px",
      lg: "1200px",
      xl: "1700px",
    },
  },
  plugins: [],
  safelist: [
    "bg-teal-700",
    "bg-lime-700",
    "bg-green-700",
    "bg-indigo-700",
    "bg-red-700",
    "bg-orange-700",
    "bg-blue-700",
    "bg-pink-700",
    "bg-cyan-700",
    "bg-emerald-700",
    "bg-purple-700",
    "bg-amber-700",
    "bg-fuchsia-700",
  ],
}

