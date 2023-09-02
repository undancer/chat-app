import i18n from '../../../languages'
import {
  CONTENT_TYPE_TEXT,
  GUARD_LEVEL_TO_TEXT_KEY,
  PRICE_CONFIGS,
} from './constants'

export function getShowGuardLevelText(guardLevel) {
  const key = GUARD_LEVEL_TO_TEXT_KEY[guardLevel] || ''
  if (key === '') {
    return ''
  }
  return i18n.global.t(key)
}

export function getPriceConfig(price) {
  for (const config of PRICE_CONFIGS) {
    if (price >= config.price) {
      return config
    }
  }
  return PRICE_CONFIGS[PRICE_CONFIGS.length - 1]
}

export function getShowContent(message) {
  if (message.translation) {
    return `${message.content}（${message.translation}）`
  }
  return message.content
}

export function getShowRichContent(message) {
  const richContent = [...message.richContent]
  if (message.translation) {
    richContent.push({
      type: CONTENT_TYPE_TEXT,
      text: `（${message.translation}）`,
    })
  }
  return richContent
}

export function getGiftShowContent(message, showGiftName) {
  if (!showGiftName) {
    return ''
  }
  return i18n.global.t('chat.sendGift', { giftName: message.giftName, num: message.num })
}

export function getShowAuthorName(message) {
  if (message.authorNamePronunciation && message.authorNamePronunciation !== message.authorName) {
    return `${message.authorName}(${message.authorNamePronunciation})`
  }
  return message.authorName
}
