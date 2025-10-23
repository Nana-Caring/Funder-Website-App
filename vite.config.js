import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174, // Match the actual running port
    strictPort: false, // Allow fallback to other ports if 5174 is busy
    cors: true // Enable CORS for direct API connections
  }
})
