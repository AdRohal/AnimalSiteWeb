/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FDF6F1',
          100: '#F9E8DB',
          200: '#F3D1B7',
          300: '#E5AB7E',
          400: '#D99066',
          500: '#C87548', // Main orange from logo
          600: '#B3643E',
          700: '#A85D38',
          800: '#8E4E2F',
          900: '#744027',
          DEFAULT: '#C87548',
        },
        secondary: {
          50: '#FAF6EF',
          100: '#F5EFE6', // Main beige/cream from logo
          200: '#EBE3D5',
          300: '#E8DFD0',
          400: '#DDD2BE',
          500: '#CFC0A7',
          600: '#B8A485',
          700: '#9A8868',
          800: '#7D6F54',
          900: '#635943',
          DEFAULT: '#F5EFE6',
        },
        dark: {
          50: '#F1F3F5',
          100: '#DCE1E6',
          200: '#B8C3CF',
          300: '#94A5B8',
          400: '#708799',
          500: '#4C6A7A',
          600: '#34495E',
          700: '#2C3E50', // Main dark from logo
          800: '#1F2D3D',
          900: '#161E27',
          DEFAULT: '#2C3E50',
        },
        cream: '#F5EFE6',
        terracotta: '#C87548',
        navy: '#2C3E50',
      },
      fontFamily: {
        arabic: ['Cairo', 'sans-serif'],
        english: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'warm': '0 4px 6px -1px rgba(200, 117, 72, 0.1), 0 2px 4px -1px rgba(200, 117, 72, 0.06)',
        'warm-lg': '0 10px 15px -3px rgba(200, 117, 72, 0.1), 0 4px 6px -2px rgba(200, 117, 72, 0.05)',
      },
    },
  },
  plugins: [],
}
