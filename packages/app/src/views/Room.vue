<script lang="ts">
import i18n from '../languages'
import {
  mergeConfig,
  toBool,
  toInt,
} from '../utils'
import * as trie from '../utils/legacy/trie'
import * as pronunciation from '../utils/pronunciation'
import * as chatConfig from '../api/chatConfig'
import ChatClientTest from '../api/chat/ChatClientTest'
import ChatClientDirect from '../api/chat/ChatClientDirect'
import ChatClientRelay from '../api/chat/ChatClientRelay'
import ChatRenderer from '../components/chat-renderer'
import {
  CONTENT_TYPE_IMAGE,
  CONTENT_TYPE_TEXT,
  MESSAGE_TYPE_GIFT,
  MESSAGE_TYPE_MEMBER,
  MESSAGE_TYPE_SUPER_CHAT,
  MESSAGE_TYPE_TEXT,
} from '../components/chat-renderer/src/constants'

export default {
  name: 'Room',
  components: {
    ChatRenderer,
  },
  props: {
    roomId: {
      type: Number,
      default: null,
    },
    strConfig: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      config: chatConfig.deepCloneDefaultConfig(),
      chatClient: null,
      pronunciationConverter: null,
      textEmoticons: {}, // 官方的文本表情，运行时从弹幕消息收集
    }
  },
  computed: {
    blockKeywordsTrie() {
      const blockKeywords = this.config.blockKeywords.split('\n')
      const res = new trie.Trie()
      for (const keyword of blockKeywords) {
        if (keyword !== '') {
          res.set(keyword, true)
        }
      }
      return res
    },
    blockUsersTrie() {
      const blockUsers = this.config.blockUsers.split('\n')
      const res = new trie.Trie()
      for (const user of blockUsers) {
        if (user !== '') {
          res.set(user, true)
        }
      }
      return res
    },
    emoticonsTrie() {
      const res = new trie.Trie()
      for (const emoticon of this.config.emoticons) {
        if (emoticon.keyword !== '' && emoticon.url !== '') {
          res.set(emoticon.keyword, emoticon)
        }
      }
      for (const emoticon of Object.values(this.textEmoticons)) {
        res.set(emoticon.keyword, emoticon)
      }
      return res
    },
  },
  mounted() {
    this.initConfig()
    this.initChatClient()
    if (this.config.giftUsernamePronunciation !== '') {
      this.pronunciationConverter = new pronunciation.PronunciationConverter()
      this.pronunciationConverter.loadDict(this.config.giftUsernamePronunciation)
    }

    // 提示用户已加载
    this.$message({
      message: 'Loaded',
      duration: '500',
    })
  },
  beforeUnmount() {
    if (this.chatClient) {
      this.chatClient.stop()
    }
  },
  methods: {
    initConfig() {
      const locale = this.strConfig.lang
      if (locale) {
        i18n.global.locale = locale
        // i18n.setLocale(locale)
      }

      let cfg = {}
      // 留空的使用默认值
      for (const i in this.strConfig) {
        if (this.strConfig[i] !== '') {
          cfg[i] = this.strConfig[i]
        }
      }
      cfg = mergeConfig(cfg, chatConfig.deepCloneDefaultConfig())

      cfg.minGiftPrice = toInt(cfg.minGiftPrice, chatConfig.DEFAULT_CONFIG.minGiftPrice)
      cfg.showDanmaku = toBool(cfg.showDanmaku)
      cfg.showGift = toBool(cfg.showGift)
      cfg.showGiftName = toBool(cfg.showGiftName)
      cfg.mergeSimilarDanmaku = toBool(cfg.mergeSimilarDanmaku)
      cfg.mergeGift = toBool(cfg.mergeGift)
      cfg.maxNumber = toInt(cfg.maxNumber, chatConfig.DEFAULT_CONFIG.maxNumber)

      cfg.blockGiftDanmaku = toBool(cfg.blockGiftDanmaku)
      cfg.blockLevel = toInt(cfg.blockLevel, chatConfig.DEFAULT_CONFIG.blockLevel)
      cfg.blockNewbie = toBool(cfg.blockNewbie)
      cfg.blockNotMobileVerified = toBool(cfg.blockNotMobileVerified)
      cfg.blockMedalLevel = toInt(cfg.blockMedalLevel, chatConfig.DEFAULT_CONFIG.blockMedalLevel)

      cfg.relayMessagesByServer = toBool(cfg.relayMessagesByServer)
      cfg.autoTranslate = toBool(cfg.autoTranslate)
      cfg.emoticons = this.toObjIfJson(cfg.emoticons)

      chatConfig.sanitizeConfig(cfg)
      this.config = cfg
    },
    toObjIfJson(str) {
      if (typeof str !== 'string') {
        return str
      }
      try {
        return JSON.parse(str)
      } catch {
        return {}
      }
    },
    initChatClient() {
      if (this.roomId === null) {
        this.chatClient = new ChatClientTest()
      } else {
        if (!this.config.relayMessagesByServer) {
          this.chatClient = new ChatClientDirect(this.roomId)
        } else {
          this.chatClient = new ChatClientRelay(this.roomId, this.config.autoTranslate)
        }
      }
      this.chatClient.onAddText = this.onAddText
      this.chatClient.onAddGift = this.onAddGift
      this.chatClient.onAddMember = this.onAddMember
      this.chatClient.onAddSuperChat = this.onAddSuperChat
      this.chatClient.onDelSuperChat = this.onDelSuperChat
      this.chatClient.onUpdateTranslation = this.onUpdateTranslation
      this.chatClient.start()
    },

    start() {
      this.chatClient.start()
    },
    stop() {
      this.chatClient.stop()
    },

    onAddText(data) {
      if (!this.config.showDanmaku || !this.filterTextMessage(data) || this.mergeSimilarText(data.content)) {
        return
      }

      // 更新官方文本表情
      for (const [keyword, url] of data.textEmoticons) {
        if (!(keyword in this.textEmoticons)) {
          const emoticon = { keyword, url }
          this.$set(this.textEmoticons, keyword, emoticon)
        }
      }

      const message = {
        id: data.id,
        type: MESSAGE_TYPE_TEXT,
        avatarUrl: data.avatarUrl,
        time: new Date(data.timestamp * 1000),
        authorName: data.authorName,
        authorType: data.authorType,
        content: data.content,
        richContent: this.getRichContent(data),
        privilegeType: data.privilegeType,
        repeated: 1,
        translation: data.translation,
      }
      this.$refs.renderer.addMessage(message)
    },
    onAddGift(data) {
      if (!this.config.showGift) {
        return
      }
      const price = data.totalCoin / 1000
      if (this.mergeSimilarGift(data.authorName, price, data.giftName, data.num)) {
        return
      }
      if (price < this.config.minGiftPrice) { // 丢人
        return
      }
      const message = {
        id: data.id,
        type: MESSAGE_TYPE_GIFT,
        avatarUrl: data.avatarUrl,
        time: new Date(data.timestamp * 1000),
        authorName: data.authorName,
        authorNamePronunciation: this.getPronunciation(data.authorName),
        price,
        giftName: data.giftName,
        num: data.num,
      }
      this.$refs.renderer.addMessage(message)
    },
    onAddMember(data) {
      if (!this.config.showGift || !this.filterNewMemberMessage(data)) {
        return
      }
      const message = {
        id: data.id,
        type: MESSAGE_TYPE_MEMBER,
        avatarUrl: data.avatarUrl,
        time: new Date(data.timestamp * 1000),
        authorName: data.authorName,
        authorNamePronunciation: this.getPronunciation(data.authorName),
        privilegeType: data.privilegeType,
        title: this.$t('chat.membershipTitle'),
      }
      this.$refs.renderer.addMessage(message)
    },
    onAddSuperChat(data) {
      if (!this.config.showGift || !this.filterSuperChatMessage(data)) {
        return
      }
      if (data.price < this.config.minGiftPrice) { // 丢人
        return
      }
      const message = {
        id: data.id,
        type: MESSAGE_TYPE_SUPER_CHAT,
        avatarUrl: data.avatarUrl,
        authorName: data.authorName,
        authorNamePronunciation: this.getPronunciation(data.authorName),
        price: data.price,
        time: new Date(data.timestamp * 1000),
        content: data.content.trim(),
        translation: data.translation,
      }
      this.$refs.renderer.addMessage(message)
    },
    onDelSuperChat(data) {
      this.$refs.renderer.delMessages(data.ids)
    },
    onUpdateTranslation(data) {
      if (!this.config.autoTranslate) {
        return
      }
      this.$refs.renderer.updateMessage(data.id, { translation: data.translation })
    },

    filterTextMessage(data) {
      if (this.config.blockGiftDanmaku && data.isGiftDanmaku) {
        return false
      } else if (this.config.blockLevel > 0 && data.authorLevel < this.config.blockLevel) {
        return false
      } else if (this.config.blockNewbie && data.isNewbie) {
        return false
      } else if (this.config.blockNotMobileVerified && !data.isMobileVerified) {
        return false
      } else if (this.config.blockMedalLevel > 0 && data.medalLevel < this.config.blockMedalLevel) {
        return false
      }
      return this.filterByContent(data.content) && this.filterByAuthorName(data.authorName)
    },
    filterSuperChatMessage(data) {
      return this.filterByContent(data.content) && this.filterByAuthorName(data.authorName)
    },
    filterNewMemberMessage(data) {
      return this.filterByAuthorName(data.authorName)
    },
    filterByContent(content) {
      const blockKeywordsTrie = this.blockKeywordsTrie
      for (let i = 0; i < content.length; i++) {
        const remainContent = content.substring(i)
        if (blockKeywordsTrie.lazyMatch(remainContent) !== null) {
          return false
        }
      }
      return true
    },
    filterByAuthorName(authorName) {
      return !this.blockUsersTrie.has(authorName)
    },
    mergeSimilarText(content) {
      if (!this.config.mergeSimilarDanmaku) {
        return false
      }
      return this.$refs.renderer.mergeSimilarText(content)
    },
    mergeSimilarGift(authorName, price, giftName, num) {
      if (!this.config.mergeGift) {
        return false
      }
      return this.$refs.renderer.mergeSimilarGift(authorName, price, giftName, num)
    },
    getPronunciation(text) {
      if (this.pronunciationConverter === null) {
        return ''
      }
      return this.pronunciationConverter.getPronunciation(text)
    },
    getRichContent(data) {
      const richContent = []

      // B站官方表情
      if (data.emoticon !== null) {
        richContent.push({
          type: CONTENT_TYPE_IMAGE,
          text: data.content,
          url: data.emoticon,
        })
        return richContent
      }

      // 没有文本表情，只能是纯文本
      if (this.config.emoticons.length === 0 && Object.keys(this.textEmoticons).length === 0) {
        richContent.push({
          type: CONTENT_TYPE_TEXT,
          text: data.content,
        })
        return richContent
      }

      // 可能含有文本表情，需要解析
      const emoticonsTrie = this.emoticonsTrie
      let startPos = 0
      let pos = 0
      while (pos < data.content.length) {
        const remainContent = data.content.substring(pos)
        const matchEmoticon = emoticonsTrie.lazyMatch(remainContent)
        if (matchEmoticon === null) {
          pos++
          continue
        }

        // 加入之前的文本
        if (pos !== startPos) {
          richContent.push({
            type: CONTENT_TYPE_TEXT,
            text: data.content.slice(startPos, pos),
          })
        }

        // 加入表情
        richContent.push({
          type: CONTENT_TYPE_IMAGE,
          text: matchEmoticon.keyword,
          url: matchEmoticon.url,
        })
        pos += matchEmoticon.keyword.length
        startPos = pos
      }
      // 加入尾部的文本
      if (pos !== startPos) {
        richContent.push({
          type: CONTENT_TYPE_TEXT,
          text: data.content.slice(startPos, pos),
        })
      }
      return richContent
    },
  },
}
</script>

<template>
  <ChatRenderer ref="renderer" :max-number="config.maxNumber" :show-gift-name="config.showGiftName" />
</template>
