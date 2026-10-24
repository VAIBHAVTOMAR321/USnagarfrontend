import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  base: '/pauripargati/',
  server: {
    open: '/pauripargati/',
    proxy: {
      // Proxy API calls to backend so cookies are same-origin
      '/pauripargati/pauripargati_backend/api': {
        target: 'https://mahadevaaya.com',
        changeOrigin: true,
        secure: true,
        cookieDomainRewrite: 'localhost',
      },
    },
  },
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
})
