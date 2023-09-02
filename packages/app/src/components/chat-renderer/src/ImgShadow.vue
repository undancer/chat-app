<script lang="ts" setup>
import { ref, watch } from 'vue-demi'
import * as avatar from '../../../api/chat/avatar'

interface Props {
  imgUrl: string
  height: string
  width: string
}

const props = defineProps<Props>()

const showImgUrl = ref<string>(props.imgUrl)

watch(() => showImgUrl.value, (value) => {
  showImgUrl.value = value
})
function onLoadError() {
  if (showImgUrl.value !== avatar.DEFAULT_AVATAR_URL) {
    showImgUrl.value = avatar.DEFAULT_AVATAR_URL
  }
}
</script>

<template>
  <yt-img-shadow class="no-transition" :height="height" :width="width" style="background-color: transparent;" loaded>
    <img id="img" class="style-scope yt-img-shadow" alt="" :height="height" :width="width" :src="showImgUrl" @error="onLoadError">
  </yt-img-shadow>
</template>

<style src="../../../assets/css/youtube/yt-img-shadow.css" />
