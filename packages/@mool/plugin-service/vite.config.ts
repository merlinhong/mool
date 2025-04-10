// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/createService.ts'),
      name: 'createService',
      fileName: 'createService',
      formats:['es']
    },
    rollupOptions: {
      external: ['axios'],
    },
  },
})