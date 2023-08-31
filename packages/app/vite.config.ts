import { defineConfig } from 'vite'

import vue3 from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { presetDaisy } from 'unocss-preset-daisy'
import { presetIcons, presetUno, presetWebFonts, presetWind } from 'unocss'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue3({
      customElement: [
        /^yt-/,
      ],
    }),
    UnoCSS({
      presets: [
        presetUno(),
        presetIcons(),
        presetWebFonts(),
        presetWind(),
        presetDaisy(),
      ],
    }),
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
