/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'be-vietnam': ['"Be Vietnam Pro"', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
        'fragment': ['"Fragment Mono"', 'monospace'],
        'space': ['"Space Grotesk"', 'sans-serif'],
      },
      colors: {
        primary: '#010204',
        surface: '#0e0b0e',
        border: '#252525',
        accent: '#007be3',
        accent2: '#4f4ff1',
        cyan: '#95d7e4',
        blue2: '#3b93ce',
      },
      letterSpacing: {
        tight2: '-0.04em',
        tight3: '-0.06em',
        tight4: '-0.08em',
      },
    },
  },
  plugins: [],
}
