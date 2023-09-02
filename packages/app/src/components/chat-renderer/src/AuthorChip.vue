<script lang="ts">
import AuthorBadge from './AuthorBadge.vue'
import * as constants from './constants.ts'

export default {
  name: 'AuthorChip',
  components: {
    AuthorBadge,
  },
  props: {
    isInMemberMessage: Boolean,
    authorName: String,
    authorType: Number,
    privilegeType: Number,
  },
  data() {
    return {
      AUTHRO_TYPE_ADMIN: constants.AUTHRO_TYPE_ADMIN,
    }
  },
  computed: {
    authorTypeText() {
      return constants.AUTHOR_TYPE_TO_TEXT[this.authorType]
    },
  },
}
</script>

<template>
  <yt-live-chat-author-chip>
    <span
      id="author-name"
      dir="auto"
      class="style-scope yt-live-chat-author-chip"
      :class="{ member: isInMemberMessage }"
      :type="authorTypeText"
    >
      <template>
        {{ authorName }}
      </template>
      <!-- 这里是已验证勋章 -->
      <span
        id="chip-badges"
        class="style-scope yt-live-chat-author-chip"
      />
    </span>
    <span
      id="chat-badges"
      class="style-scope yt-live-chat-author-chip"
    >
      <AuthorBadge
        v-if="isInMemberMessage"
        class="style-scope yt-live-chat-author-chip"
        :is-admin="false"
        :privilege-type="privilegeType"
      />
      <template
        v-else
      >
        <AuthorBadge
          v-if="authorType === AUTHRO_TYPE_ADMIN"
          class="style-scope yt-live-chat-author-chip"
          is-admin
          :privilege-type="0"
        />
        <AuthorBadge
          v-if="privilegeType > 0"
          class="style-scope yt-live-chat-author-chip"
          :is-admin="false"
          :privilege-type="privilegeType"
        />
      </template>
    </span>
  </yt-live-chat-author-chip>
</template>

<style src="../../../assets/css/youtube/yt-live-chat-author-chip.css" />
