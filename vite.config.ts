import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [react(), dts({ insertTypesEntry: true })],
  build: {
    lib: {
      entry: './lib/index.ts',
      name: 'Tawr',
      fileName: 'tawr'
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', 'valtio', 'derive-valtio']
    }
  }
})
