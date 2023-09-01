<script lang="ts">
import { getTimeTextHourMin } from '../../utils/legacy'
import ImgShadow from './ImgShadow.vue'
import AuthorChip from './AuthorChip.vue'
import * as constants from './constants.ts'

// HSL
const REPEATED_MARK_COLOR_START = [210, 100.0, 62.5]
const REPEATED_MARK_COLOR_END = [360, 87.3, 69.2]

export default {
  name: 'TextMessage',
  components: {
    ImgShadow,
    AuthorChip,
  },
  props: {
    avatarUrl: String,
    time: Date,
    authorName: String,
    authorType: Number,
    richContent: Array,
    privilegeType: Number,
    repeated: Number,
  },
  data() {
    return {
      CONTENT_TYPE_TEXT: constants.CONTENT_TYPE_TEXT,
      CONTENT_TYPE_IMAGE: constants.CONTENT_TYPE_IMAGE,
    }
  },
  computed: {
    timeText() {
      return getTimeTextHourMin(this.time)
    },
    authorTypeText() {
      return constants.AUTHOR_TYPE_TO_TEXT[this.authorType]
    },
    repeatedMarkColor() {
      let color
      if (this.repeated <= 2) {
        color = REPEATED_MARK_COLOR_START
      } else if (this.repeated >= 10) {
        color = REPEATED_MARK_COLOR_END
      } else {
        color = [0, 0, 0]
        const t = (this.repeated - 2) / (10 - 2)
        for (let i = 0; i < 3; i++) {
          color[i] = REPEATED_MARK_COLOR_START[i] + ((REPEATED_MARK_COLOR_END[i] - REPEATED_MARK_COLOR_START[i]) * t)
        }
      }
      return `hsl(${color[0]}, ${color[1]}%, ${color[2]}%)`
    },
  },
}
</script>

<template>
  <yt-live-chat-text-message-renderer :author-type="authorTypeText">
    <ImgShadow
      id="author-photo" height="24" width="24" class="style-scope yt-live-chat-text-message-renderer"
      :img-url="avatarUrl"
    />
    <div id="content" class="style-scope yt-live-chat-text-message-renderer">
      <span id="timestamp" class="style-scope yt-live-chat-text-message-renderer">{{ timeText }}</span>
      <AuthorChip
        class="style-scope yt-live-chat-text-message-renderer"
        :is-in-member-message="false" :author-name="authorName" :author-type="authorType" :privilege-type="privilegeType"
      />
      <span id="message" class="style-scope yt-live-chat-text-message-renderer">
        <template v-for="(content, index) in richContent">
          <span v-if="content.type === CONTENT_TYPE_TEXT" :key="`s-${index}`">{{ content.text }}</span>
          <img
            v-else-if="content.type === CONTENT_TYPE_IMAGE" :id="`emoji-${content.text}`"
            :key="`i-${index}`"
            class="emoji yt-formatted-string style-scope yt-live-chat-text-message-renderer" :src="content.url" :alt="content.text" :shared-tooltip-text="content.text"
          >
        </template>
        <el-badge
          v-if="repeated > 1" :value="repeated" :max="99" class="style-scope yt-live-chat-text-message-renderer"
          :style="{ '--repeated-mark-color': repeatedMarkColor }"
        />
      </span>
    </div>
  </yt-live-chat-text-message-renderer>
</template>

<style>
yt-live-chat-text-message-renderer>#content>#message>.el-badge {
  margin-left: 10px;
}

yt-live-chat-text-message-renderer>#content>#message>.el-badge .el-badge__content {
  font-size: 12px !important;
  line-height: 18px !important;
  text-shadow: none !important;
  font-family: sans-serif !important;
  color: #FFF !important;
  background-color: var(--repeated-mark-color) !important;
  border: none;
}
</style>

<style src="../../assets/css/youtube/yt-live-chat-text-message-renderer.css"></style>
