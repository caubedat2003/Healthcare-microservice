import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Bind to all interfaces
    port: 3000,       // Match Dockerfile and docker-compose.yml
    watch: {
      usePolling: true, // Necessary for Docker volume mounts
    },
  },
})
