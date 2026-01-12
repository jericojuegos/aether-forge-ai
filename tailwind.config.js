/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        aether: {
          bg: '#030712', // detailed void
          panel: 'rgba(17, 24, 39, 0.7)', // glass
          accent: '#06b6d4', // cyan-500
          secondary: '#8b5cf6', // violet-500
          text: '#e2e8f0', // slate-200
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
