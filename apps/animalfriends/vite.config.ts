import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' : Electron(file://), Capacitor, GitHub Pages(/저장소명/) 모두에서 동작
export default defineConfig({
  plugins: [react()],
  base: './',
})
