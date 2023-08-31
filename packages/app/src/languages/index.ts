import type { I18n } from 'vue-i18n'
import { createI18n } from 'vue-i18n'
import en from './en.ts'
import ja from './ja.ts'
import zh from './zh.ts'

const i18n: I18n = createI18n({
  legacy: false, // 要把 legacy 設為 false，才可以使用 Composition API
  locale: 'zh', // set locale
  fallbackLocale: 'zh', // set fallback locale
  messages: {
    en,
    ja,
    zh,
  },
})

export default i18n
