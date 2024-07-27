/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./styles/customMessages.css",
  ],

  theme: {
    extend: {
      transform: {
        "rotate-y-360": "rotateY(360deg)",
      },
      perspective: {
        1000: "1px",
      },
      scale: {
        110: "1.1",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "synthwave"],
  },
};
