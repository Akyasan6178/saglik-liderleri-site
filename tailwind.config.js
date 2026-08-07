/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        jakarta: ['Plus Jakarta Sans', 'sans-serif'],
      },
      colors: {
        coral:  { DEFAULT: '#f97316', light: '#ffedd5', dark: '#ea580c' },
        mint:   { DEFAULT: '#10b981', light: '#d1fae5', dark: '#059669' },
        'sky-accent': { DEFAULT: '#0ea5e9', light: '#e0f2fe' },
        violet: { DEFAULT: '#7c3aed', light: '#ede9fe' },
        pink:   { DEFAULT: '#ec4899', light: '#fce7f3' },
      },
      boxShadow: {
        'soft':  '0 4px 24px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
        'card':  '0 10px 30px rgba(0,0,0,0.08)',
        'hover': '0 30px 60px rgba(0,0,0,0.10), 0 10px 20px rgba(249,115,22,0.08)',
        'cta':   '0 20px 40px rgba(249,115,22,0.30)',
      },

      animation: {
        'float': 'float 4s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2.5s ease-in-out infinite',
        'slide-up': 'slideInUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'rotate-slow': 'rotate-slow 20s linear infinite',
        'gradient': 'gradient-shift 4s ease infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(59, 147, 240, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(59, 147, 240, 0.7)' },
        },
        slideInUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'rotate-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'gradient-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
    },
  },
  plugins: [],
}
