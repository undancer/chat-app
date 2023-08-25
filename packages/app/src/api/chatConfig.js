import _ from 'lodash'

import { mergeConfig } from '@/utils'

export const DEFAULT_CONFIG = {
  minGiftPrice: 7, // $1
  showDanmaku: true,
  showGift: true,
  showGiftName: false,
  mergeSimilarDanmaku: false,
  mergeGift: true,
  maxNumber: 60,

  blockGiftDanmaku: true,
  blockLevel: 0,
  blockNewbie: false,
  blockNotMobileVerified: false,
  blockKeywords: '',
  blockUsers: '',
  blockMedalLevel: 0,

  relayMessagesByServer: false,
  autoTranslate: false,
  giftUsernamePronunciation: '',

  emoticons: [], // [{ keyword: '', url: '' }, ...]
}

export function deepCloneDefaultConfig() {
  return _.cloneDeep(DEFAULT_CONFIG)
}

export function setLocalConfig(config) {
  config = mergeConfig(config, DEFAULT_CONFIG)
  window.localStorage.config = JSON.stringify(config)
}

export function getLocalConfig() {
  try {
    let config = JSON.parse(window.localStorage.config)
    config = mergeConfig(config, deepCloneDefaultConfig())
    sanitizeConfig(config)
    return config
  } catch {
    return deepCloneDefaultConfig()
  }
}

export function sanitizeConfig(config) {
  const newEmoticons = []
  if (Array.isArray(config.emoticons)) {
    for (const emoticon of config.emoticons) {
      try {
        const newEmoticon = {
          keyword: emoticon.keyword,
          url: emoticon.url,
        }
        if ((typeof newEmoticon.keyword !== 'string') || (typeof newEmoticon.url !== 'string')) {
          continue
        }
        newEmoticons.push(newEmoticon)
      } catch {
        continue
      }
    }
  }
  config.emoticons = newEmoticons
}
