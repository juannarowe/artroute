/// <reference types="vitest/config" />
import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // "@/..." points to "src/..." (used by shadcn/ui imports)
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    // Simulated browser, so components can render inside Node
    environment: 'jsdom',
    // Runs before every test file
    setupFiles: './src/test/setup.ts',
  },
})