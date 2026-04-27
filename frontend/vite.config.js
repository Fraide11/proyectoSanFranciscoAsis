import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/

export default defineConfig({
  server: {
    port: 5173, // ASEGÚRATE de que aquí NO diga 10000
    strictPort: true, 
  },
  // ... resto de la configuración
})