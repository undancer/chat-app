<script lang="ts">
import * as chatConfig from '../../../api/chatConfig'
import Ticker from './Ticker.vue'
import TextMessage from './TextMessage.vue'
import MembershipItem from './MembershipItem.vue'
import PaidMessage from './PaidMessage.vue'
import {
  getGiftShowContent,
  getShowAuthorName,
  getShowContent,
  getShowRichContent,
} from './utils'
import {
  MESSAGE_TYPE_DEL,
  MESSAGE_TYPE_GIFT,
  MESSAGE_TYPE_MEMBER,
  MESSAGE_TYPE_SUPER_CHAT,
  MESSAGE_TYPE_TEXT,
  MESSAGE_TYPE_UPDATE,
} from './constants'

// 只有要添加的消息需要平滑
const NEED_SMOOTH_MESSAGE_TYPES = [
  MESSAGE_TYPE_TEXT,
  MESSAGE_TYPE_GIFT,
  MESSAGE_TYPE_MEMBER,
  MESSAGE_TYPE_SUPER_CHAT,
]
// 发送消息时间间隔范围
const MESSAGE_MIN_INTERVAL = 80
const MESSAGE_MAX_INTERVAL = 1000

// 每次发送消息后增加的动画时间，要比MESSAGE_MIN_INTERVAL稍微大一点，太小了动画不连续，太大了发送消息时会中断动画
// 84 = ceil((1000 / 60) * 5)
const CHAT_SMOOTH_ANIMATION_TIME_MS = 84
// 滚动条距离底部小于多少像素则认为在底部
const SCROLLED_TO_BOTTOM_EPSILON = 15

export default {
  name: 'ChatRenderer',
  components: {
    Ticker,
    TextMessage,
    MembershipItem,
    PaidMessage,
  },
  props: {
    maxNumber: {
      type: Number,
      default: chatConfig.DEFAULT_CONFIG.maxNumber,
    },
    showGiftName: {
      type: Boolean,
      default: chatConfig.DEFAULT_CONFIG.showGiftName,
    },
  },
  data() {
    return {
      MESSAGE_TYPE_TEXT,
      MESSAGE_TYPE_GIFT,
      MESSAGE_TYPE_MEMBER,
      MESSAGE_TYPE_SUPER_CHAT,

      messages: [], // 显示的消息
      paidMessages: [], // 固定在上方的消息

      smoothedMessageQueue: [], // 平滑消息队列，由外部调用addMessages等方法添加
      emitSmoothedMessageTimerId: null, // 消费平滑消息队列的定时器ID
      enqueueIntervals: [], // 最近进队列的时间间隔，用来估计下次进队列的时间
      lastEnqueueTime: null, // 上次进队列的时间
      estimatedEnqueueInterval: null, // 估计的下次进队列时间间隔

      messagesBuffer: [], // 暂时未显示的消息，当不能自动滚动时会积压在这
      preinsertHeight: 0, // 插入新消息之前items的高度
      isSmoothed: true, // 是否平滑滚动，当消息太快时不平滑滚动
      chatRateMs: 1000, // 用来计算消息速度
      scrollPixelsRemaining: 0, // 平滑滚动剩余像素
      scrollTimeRemainingMs: 0, // 平滑滚动剩余时间
      lastSmoothChatMessageAddMs: null, // 上次showNewMessages时间
      smoothScrollRafHandle: null, // 平滑滚动requestAnimationFrame句柄
      lastSmoothScrollUpdate: null, // 平滑滚动上一帧时间

      atBottom: true, // 滚动到底部，用来判断能否自动滚动
      cantScrollStartTime: null, // 开始不能自动滚动的时间，用来防止卡住
    }
  },
  computed: {
    canScrollToBottom() {
      return this.atBottom/* || this.allowScroll */
    },
  },
  watch: {
    canScrollToBottom(val) {
      this.cantScrollStartTime = val ? null : new Date()
    },
  },
  mounted() {
    this.scrollToBottom()
  },
  beforeUnmount() {
    if (this.emitSmoothedMessageTimerId) {
      window.clearTimeout(this.emitSmoothedMessageTimerId)
      this.emitSmoothedMessageTimerId = null
    }
    this.clearMessages()
  },
  methods: {
    getGiftShowContent(message) {
      return getGiftShowContent(message, this.showGiftName)
    },
    getShowContent,
    getShowRichContent,
    getShowAuthorName,

    addMessage(message) {
      this.addMessages([message])
    },
    addMessages(messages) {
      this.enqueueMessages(messages)
    },
    mergeSimilarText(content) {
      content = content.trim().toLowerCase()
      let res = false
      this.forEachRecentMessage(5, (message) => {
        if (message.type !== MESSAGE_TYPE_TEXT) {
          return true
        }
        const messageContent = message.content.trim().toLowerCase()
        let longer, shorter
        if (messageContent.length > content.length) {
          longer = messageContent
          shorter = content
        } else {
          longer = content
          shorter = messageContent
        }
        if (longer.includes(shorter) // 长的包含短的
            && longer.length - shorter.length < shorter.length // 长度差较小
        ) {
          // 其实有小概率导致弹幕卡住
          message.repeated++
          res = true
          return false
        }
        return true
      })
      return res
    },
    mergeSimilarGift(authorName, price, giftName, num) {
      let res = false
      this.forEachRecentMessage(5, (message) => {
        if (message.type === MESSAGE_TYPE_GIFT
            && message.authorName === authorName
            && message.giftName === giftName
        ) {
          message.price += price
          message.num += num
          res = true
          return false
        }
        return true
      })
      return res
    },
    forEachRecentMessage(num, callback) {
      // 从新到老遍历num条消息
      for (let i = this.smoothedMessageQueue.length - 1; i >= 0 && num > 0; i--) {
        const messageGroup = this.smoothedMessageQueue[i]
        for (let j = messageGroup.length - 1; j >= 0 && num-- > 0; j--) {
          if (!callback(messageGroup[j])) {
            return
          }
        }
      }
      for (const arr of [this.messagesBuffer, this.messages]) {
        for (let i = arr.length - 1; i >= 0 && num-- > 0; i--) {
          if (!callback(arr[i])) {
            return
          }
        }
      }
    },
    delMessage(id) {
      this.delMessages([id])
    },
    delMessages(ids) {
      this.enqueueMessages(ids.map(
        id => ({
          type: MESSAGE_TYPE_DEL,
          id,
        }),
      ))
    },
    clearMessages() {
      this.messages = []
      this.paidMessages = []
      this.smoothedMessageQueue = []
      this.messagesBuffer = []
      this.isSmoothed = true
      this.lastSmoothChatMessageAddMs = null
      this.chatRateMs = 1000
      this.lastSmoothScrollUpdate = null
      this.scrollTimeRemainingMs = this.scrollPixelsRemaining = 0
      this.smoothScrollRafHandle = null
      this.preinsertHeight = 0
      this.maybeResizeScrollContainer()
      if (!this.atBottom) {
        this.scrollToBottom()
      }
    },
    updateMessage(id, newValuesObj) {
      this.enqueueMessages([{
        type: MESSAGE_TYPE_UPDATE,
        id,
        newValuesObj,
      }])
    },

    enqueueMessages(messages) {
      // 估计进队列时间间隔
      if (!this.lastEnqueueTime) {
        this.lastEnqueueTime = new Date()
      } else {
        const curTime = new Date()
        const interval = curTime - this.lastEnqueueTime
        // 真实的进队列时间间隔模式大概是这样：2500, 300, 300, 300, 2500, 300, ...
        // B站消息有缓冲，会一次发多条消息。这里把波峰视为发送了一次真实的WS消息，所以要过滤掉间隔太小的
        if (interval > 1000 || this.enqueueIntervals.length < 5) {
          this.enqueueIntervals.push(interval)
          if (this.enqueueIntervals.length > 5) {
            this.enqueueIntervals.splice(0, this.enqueueIntervals.length - 5)
          }
          // 这边估计得尽量大，只要不太早把消息缓冲发完就是平滑的。有MESSAGE_MAX_INTERVAL保底，不会让消息延迟太大
          // 其实可以用单调队列求最大值，偷懒不写了
          this.estimatedEnqueueInterval = Math.max(...this.enqueueIntervals)
        }
        // 上次入队时间还是要设置，否则会太早把消息缓冲发完，然后较长时间没有新消息
        this.lastEnqueueTime = curTime
      }

      // 把messages分成messageGroup，每个组里最多有1个需要平滑的消息
      let messageGroup = []
      for (const message of messages) {
        messageGroup.push(message)
        if (this.messageNeedSmooth(message)) {
          this.smoothedMessageQueue.push(messageGroup)
          messageGroup = []
        }
      }
      // 还剩下不需要平滑的消息
      if (messageGroup.length > 0) {
        if (this.smoothedMessageQueue.length > 0) {
          // 和上一组合并
          const lastMessageGroup = this.smoothedMessageQueue[this.smoothedMessageQueue.length - 1]
          for (const message of messageGroup) {
            lastMessageGroup.push(message)
          }
        } else {
          // 自己一个组
          this.smoothedMessageQueue.push(messageGroup)
        }
      }

      if (!this.emitSmoothedMessageTimerId) {
        this.emitSmoothedMessageTimerId = window.setTimeout(this.emitSmoothedMessages)
      }
    },
    messageNeedSmooth({ type }) {
      return NEED_SMOOTH_MESSAGE_TYPES.includes(type)
    },
    emitSmoothedMessages() {
      this.emitSmoothedMessageTimerId = null
      if (this.smoothedMessageQueue.length <= 0) {
        return
      }

      // 估计的下次进队列剩余时间
      let estimatedNextEnqueueRemainTime = 10 * 1000
      if (this.estimatedEnqueueInterval) {
        estimatedNextEnqueueRemainTime = Math.max(this.lastEnqueueTime - new Date() + this.estimatedEnqueueInterval, 1)
      }
      // 计算发送的消息数，保证在下次进队列之前发完
      // 下次进队列之前应该发多少条消息
      const shouldEmitGroupNum = Math.max(this.smoothedMessageQueue.length, 0)
      // 下次进队列之前最多能发多少次
      const maxCanEmitCount = estimatedNextEnqueueRemainTime / MESSAGE_MIN_INTERVAL
      // 这次发多少条消息
      let groupNumToEmit
      if (shouldEmitGroupNum < maxCanEmitCount) {
        // 队列中消息数很少，每次发1条也能发完
        groupNumToEmit = 1
      } else {
        // 每次发1条以上，保证按最快速度能发完
        groupNumToEmit = Math.ceil(shouldEmitGroupNum / maxCanEmitCount)
      }

      // 发消息
      const messageGroups = this.smoothedMessageQueue.splice(0, groupNumToEmit)
      const mergedGroup = []
      for (const messageGroup of messageGroups) {
        for (const message of messageGroup) {
          mergedGroup.push(message)
        }
      }
      this.handleMessageGroup(mergedGroup)

      if (this.smoothedMessageQueue.length <= 0) {
        return
      }
      // 消息没发完，计算下次发消息时间
      let sleepTime
      if (groupNumToEmit === 1) {
        // 队列中消息数很少，随便定个[MESSAGE_MIN_INTERVAL, MESSAGE_MAX_INTERVAL]的时间
        sleepTime = estimatedNextEnqueueRemainTime / this.smoothedMessageQueue.length
        sleepTime *= 0.5 + Math.random()
        if (sleepTime > MESSAGE_MAX_INTERVAL) {
          sleepTime = MESSAGE_MAX_INTERVAL
        } else if (sleepTime < MESSAGE_MIN_INTERVAL) {
          sleepTime = MESSAGE_MIN_INTERVAL
        }
      } else {
        // 按最快速度发
        sleepTime = MESSAGE_MIN_INTERVAL
      }
      this.emitSmoothedMessageTimerId = window.setTimeout(this.emitSmoothedMessages, sleepTime)
    },

    handleMessageGroup(messageGroup) {
      if (messageGroup.length <= 0) {
        return
      }

      for (const message of messageGroup) {
        switch (message.type) {
          case MESSAGE_TYPE_TEXT:
          case MESSAGE_TYPE_GIFT:
          case MESSAGE_TYPE_MEMBER:
          case MESSAGE_TYPE_SUPER_CHAT:
            this.handleAddMessage(message)
            break
          case MESSAGE_TYPE_DEL:
            this.handleDelMessage(message)
            break
          case MESSAGE_TYPE_UPDATE:
            this.handleUpdateMessage(message)
            break
        }
      }

      this.maybeResizeScrollContainer()
      this.flushMessagesBuffer()
      this.$nextTick(this.maybeScrollToBottom)
    },
    handleAddMessage(message) {
      message = {
        ...message,
        addTime: new Date(), // 添加一个本地时间给Ticker用，防止本地时间和服务器时间相差很大的情况
      }
      this.messagesBuffer.push(message)

      if (message.type !== MESSAGE_TYPE_TEXT) {
        this.paidMessages.unshift(message)
        const MAX_PAID_MESSAGE_NUM = 100
        if (this.paidMessages.length > MAX_PAID_MESSAGE_NUM) {
          this.paidMessages.splice(MAX_PAID_MESSAGE_NUM, this.paidMessages.length - MAX_PAID_MESSAGE_NUM)
        }
      }
    },
    handleDelMessage({ id }) {
      for (const arr of [this.messages, this.paidMessages, this.messagesBuffer]) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].id === id) {
            arr.splice(i, 1)
            this.resetSmoothScroll()
            break
          }
        }
      }
    },
    handleUpdateMessage({ id, newValuesObj }) {
      // 遍历滚动的消息
      this.forEachRecentMessage(999999999, (message) => {
        if (message.id !== id) {
          return true
        }
        for (const name in newValuesObj) {
          message[name] = newValuesObj[name]
        }
        return false
      })
      // 遍历固定的消息
      for (const message of this.paidMessages) {
        if (message.id !== id) {
          continue
        }
        for (const name in newValuesObj) {
          message[name] = newValuesObj[name]
        }
        break
      }
      this.resetSmoothScroll()
    },

    async flushMessagesBuffer() {
      if (this.messagesBuffer.length <= 0) {
        return
      }
      if (!this.canScrollToBottomOrTimedOut()) {
        if (this.messagesBuffer.length > this.maxNumber) {
          // 未显示消息数 > 最大可显示数，丢弃
          this.messagesBuffer.splice(0, this.messagesBuffer.length - this.maxNumber)
        }
        return
      }

      const removeNum = Math.max(this.messages.length + this.messagesBuffer.length - this.maxNumber, 0)
      if (removeNum > 0) {
        this.messages.splice(0, removeNum)
        // 防止同时添加和删除项目时所有的项目重新渲染 https://github.com/vuejs/vue/issues/6857
        await this.$nextTick()
      }

      this.preinsertHeight = this.$refs.items.clientHeight
      for (const message of this.messagesBuffer) {
        this.messages.push(message)
      }
      this.messagesBuffer = []
      // 等items高度变化
      await this.$nextTick()
      this.showNewMessages()
    },
    showNewMessages() {
      const hasScrollBar = this.$refs.items.clientHeight > this.$refs.scroller.clientHeight
      this.$refs.itemOffset.style.height = `${this.$refs.items.clientHeight}px`
      if (!this.canScrollToBottomOrTimedOut() || !hasScrollBar) {
        return
      }

      // 计算剩余像素
      this.scrollPixelsRemaining += this.$refs.items.clientHeight - this.preinsertHeight
      this.scrollToBottom()

      // 计算是否平滑滚动、剩余时间
      if (!this.lastSmoothChatMessageAddMs) {
        this.lastSmoothChatMessageAddMs = performance.now()
      }
      const interval = performance.now() - this.lastSmoothChatMessageAddMs
      this.chatRateMs = (0.9 * this.chatRateMs) + (0.1 * interval)
      if (this.isSmoothed) {
        if (this.chatRateMs < 400) {
          this.isSmoothed = false
        }
      } else {
        if (this.chatRateMs > 450) {
          this.isSmoothed = true
        }
      }
      this.scrollTimeRemainingMs += this.isSmoothed ? CHAT_SMOOTH_ANIMATION_TIME_MS : 0

      if (!this.smoothScrollRafHandle) {
        this.smoothScrollRafHandle = window.requestAnimationFrame(this.smoothScroll)
      }
      this.lastSmoothChatMessageAddMs = performance.now()
    },
    smoothScroll(time) {
      if (!this.lastSmoothScrollUpdate) {
        // 第一帧
        this.lastSmoothScrollUpdate = time
        this.smoothScrollRafHandle = window.requestAnimationFrame(this.smoothScroll)
        return
      }

      const interval = time - this.lastSmoothScrollUpdate
      if (
        this.scrollPixelsRemaining <= 0 || this.scrollPixelsRemaining >= 400 // 已经滚动到底部或者离底部太远则结束
        || interval >= 1000 // 离上一帧时间太久，可能用户切换到其他网页
        || this.scrollTimeRemainingMs <= 0 // 时间已结束
      ) {
        this.resetSmoothScroll()
        return
      }

      const pixelsToScroll = interval / this.scrollTimeRemainingMs * this.scrollPixelsRemaining
      this.scrollPixelsRemaining -= pixelsToScroll
      if (this.scrollPixelsRemaining < 0) {
        this.scrollPixelsRemaining = 0
      }
      this.scrollTimeRemainingMs -= interval
      if (this.scrollTimeRemainingMs < 0) {
        this.scrollTimeRemainingMs = 0
      }
      this.lastSmoothScrollUpdate = time
      this.smoothScrollRafHandle = window.requestAnimationFrame(this.smoothScroll)
    },
    resetSmoothScroll() {
      this.scrollTimeRemainingMs = this.scrollPixelsRemaining = 0
      this.lastSmoothScrollUpdate = null
      if (this.smoothScrollRafHandle) {
        window.cancelAnimationFrame(this.smoothScrollRafHandle)
        this.smoothScrollRafHandle = null
      }
    },

    maybeResizeScrollContainer() {
      this.$refs.itemOffset.style.height = `${this.$refs.items.clientHeight}px`
      this.maybeScrollToBottom()
    },
    maybeScrollToBottom() {
      if (this.canScrollToBottomOrTimedOut()) {
        this.scrollToBottom()
      }
    },
    scrollToBottom() {
      this.$refs.scroller.scrollTop = 2 ** 24
      this.atBottom = true
    },
    onScroll() {
      this.refreshCantScrollStartTime()
      const scroller = this.$refs.scroller
      this.atBottom = scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight < SCROLLED_TO_BOTTOM_EPSILON
      this.flushMessagesBuffer()
    },
    canScrollToBottomOrTimedOut() {
      if (this.canScrollToBottom) {
        return true
      }
      // 防止在OBS中卡住，超过一定时间也可以自动滚动
      return new Date() - this.cantScrollStartTime >= 5 * 1000
    },
    refreshCantScrollStartTime() {
      // 有鼠标事件时刷新，防止用户看弹幕时自动滚动
      if (this.cantScrollStartTime) {
        this.cantScrollStartTime = new Date()
      }
    },
  },
}
</script>

<template>
  <yt-live-chat-renderer
    class="style-scope yt-live-chat-app"
    style="--scrollbar-width:11px;"
    hide-timestamps
    @mousemove="refreshCantScrollStartTime"
  >
    <Ticker
      v-model:messages="paidMessages"
      class="style-scope yt-live-chat-renderer"
      :show-gift-name="showGiftName"
    />
    <yt-live-chat-item-list-renderer
      class="style-scope yt-live-chat-renderer"
      allow-scroll
    >
      <div
        id="item-scroller"
        ref="scroller"
        class="style-scope yt-live-chat-item-list-renderer animated"
        @scroll="onScroll"
      >
        <div
          id="item-offset"
          ref="itemOffset"
          class="style-scope yt-live-chat-item-list-renderer"
          style="height: 0px;"
        >
          <div
            id="items"
            ref="items"
            class="style-scope yt-live-chat-item-list-renderer"
            style="overflow: hidden"
            :style="{ transform: `translateY(${Math.floor(scrollPixelsRemaining)}px)` }"
          >
            <template v-for="message in messages">
              <TextMessage
                v-if="message.type === MESSAGE_TYPE_TEXT"
                :key="message.id"
                class="style-scope yt-live-chat-item-list-renderer"
                :time="message.time"
                :avatar-url="message.avatarUrl"
                :author-name="message.authorName"
                :author-type="message.authorType"
                :privilege-type="message.privilegeType"
                :rich-content="getShowRichContent(message)"
                :repeated="message.repeated"
              />
              <PaidMessage
                v-else-if="message.type === MESSAGE_TYPE_GIFT"
                :key="`gift-${message.id}`"
                class="style-scope yt-live-chat-item-list-renderer"
                :time="message.time"
                :avatar-url="message.avatarUrl"
                :author-name="getShowAuthorName(message)"
                :price="message.price"
                :content="getGiftShowContent(message)"
              />
              <MembershipItem
                v-else-if="message.type === MESSAGE_TYPE_MEMBER"
                :key="`member-${message.id}`"
                class="style-scope yt-live-chat-item-list-renderer"
                :time="message.time"
                :avatar-url="message.avatarUrl"
                :author-name="getShowAuthorName(message)"
                :privilege-type="message.privilegeType"
                :title="message.title"
              />
              <PaidMessage
                v-else-if="message.type === MESSAGE_TYPE_SUPER_CHAT"
                :key="`super-chat-${message.id}`"
                class="style-scope yt-live-chat-item-list-renderer"
                :time="message.time"
                :avatar-url="message.avatarUrl"
                :author-name="getShowAuthorName(message)"
                :price="message.price"
                :content="getShowContent(message)"
              />
            </template>
          </div>
        </div>
      </div>
    </yt-live-chat-item-list-renderer>
  </yt-live-chat-renderer>
</template>

<style src="../../../assets/css/youtube/yt-html.css" />

<style src="../../../assets/css/youtube/yt-live-chat-renderer.css" />

<style src="../../../assets/css/youtube/yt-live-chat-item-list-renderer.css" />
