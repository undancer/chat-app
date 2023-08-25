import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'

// import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
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
    },
  },
})
