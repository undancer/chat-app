import path from 'node:path'
import { defineConfig } from 'vite'

// import vue2 from '@vitejs/plugin-vue2'
import vue3 from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // vue2(),
    vue3(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      // 'api/server_info': {
      //
      // },
      '/api/server_info': {
        target: 'https://httpbin.org',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/server_info/, '/get'),
      },
      '/api/emoticon': {
        target: 'https://httpbin.org',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/emoticon/, '/get'),
      },
    },
  },
})
