/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4f46e5', // Indigo 600 (Pro Max Recommendation)
        secondary: '#64748b', // Slate 500
        success: '#10b981', // Emerald 500
        warning: '#f59e0b', // Amber 500
        error: '#ef4444',   // Red 500
        background: '#f8fafc', // Slate 50
        text: '#0f172a', // Slate 900
      },
      fontFamily: {
        sans: ['Inter', 'Nunito', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
