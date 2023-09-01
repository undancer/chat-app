import { defineConfig } from 'vite'

import vue3 from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { presetDaisy } from 'unocss-preset-daisy'
import { presetIcons, presetUno, presetWebFonts, presetWind } from 'unocss'
import { vitePluginVersionMark } from 'vite-plugin-version-mark'

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
    vitePluginVersionMark({
      // name: 'test-app',
      // version: '0.0.1',
      // command: 'git describe --tags',
      ifGitSHA: true,
      ifShortSHA: true,
      ifMeta: true,
      ifLog: true,
      ifGlobal: true,
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
