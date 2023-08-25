import type { I18n } from 'vue-i18n'
import { createI18n } from 'vue-i18n'
import zh from '@/lang/zh'

const i18n: I18n = createI18n({
  locale: 'zh', // set locale
  fallbackLocale: 'zh', // set fallback locale
  messages: {
    zh,
  },
})

// i18n.set
export default i18n
