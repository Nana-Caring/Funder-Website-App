import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Force specific port to ensure proxy works
    strictPort: false, // Allow fallback to other ports if 5173 is busy
    proxy: {
      '/api/auth': {
        target: 'https://nanacaring-backend.onrender.com',
        changeOrigin: true,
        secure: true,
        logLevel: 'debug' // Add logging to see proxy activity
      }
    }
  }
})
