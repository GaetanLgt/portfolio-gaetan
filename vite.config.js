import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    // Optimisations performance
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        // Code splitting par chunk
        manualChunks(id) {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('three')) {
              return 'three';
            }
            if (id.includes('gsap')) {
              return 'gsap';
            }
            if (id.includes('chart.js')) {
              return 'chart';
            }
            return 'vendor';
          }
          // Component chunks
          if (id.includes('/views/')) {
            return 'views';
          }
          if (id.includes('/components/three/')) {
            return 'three-components';
          }
        }
      }
    },
    // Reduce bundle size
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    // Chunk size warnings
    chunkSizeWarningLimit: 1000
  },
  // Critical CSS inline
  css: {
    preprocessorOptions: {
      css: {
        charset: false
      }
    }
  }
})
