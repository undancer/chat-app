<script lang="ts">
import * as avatar from '@/legacy/api/chat/avatar.ts'

export default {
  name: 'ImgShadow',
  props: {
    imgUrl: String,
    height: String,
    width: String,
  },
  data() {
    return {
      showImgUrl: this.imgUrl,
    }
  },
  watch: {
    imgUrl(val) {
      this.showImgUrl = val
    },
  },
  methods: {
    onLoadError() {
      if (this.showImgUrl !== avatar.DEFAULT_AVATAR_URL) {
        this.showImgUrl = avatar.DEFAULT_AVATAR_URL
      }
    },
  },
}
</script>

<template>
  <yt-img-shadow class="no-transition" :height="height" :width="width" style="background-color: transparent;" loaded>
    <img id="img" class="style-scope yt-img-shadow" alt="" :height="height" :width="width" :src="showImgUrl" @error="onLoadError">
  </yt-img-shadow>
</template>

<style src="../../assets/css/youtube/yt-img-shadow.css"></style>
