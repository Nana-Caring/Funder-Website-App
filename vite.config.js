import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/password-reset': {
        target: 'https://password-reset-29wr.onrender.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/password-reset/, '/api/auth')
      }
    }
  }
})
