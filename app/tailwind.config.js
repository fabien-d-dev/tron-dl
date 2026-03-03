/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html", // pour que Tailwind lise l'HTML racine
    "./src/**/*.{js,ts,jsx,tsx}", // pour tous vos fichiers React/TypeScript
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
