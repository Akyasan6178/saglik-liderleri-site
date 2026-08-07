import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Tailwind CSS v3 is processed via PostCSS (postcss.config.js)
export default defineConfig({
  plugins: [
    react(),
  ],
})
