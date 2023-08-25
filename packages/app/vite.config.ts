import { defineConfig } from 'vite'

import vue3 from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue3(),
  ],
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
