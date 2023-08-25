<script lang="ts">
import i18n from '../languages'

export default {
  name: 'Sidebar',
  data() {
    return {
      LOCALES: [
        { locale: 'zh', name: '中文' },
        { locale: 'ja', name: '日本語' },
        { locale: 'en', name: 'English' },
      ],
    }
  },
  methods: {
    onSelectLanguage(locale: string) {
      // i18n..setLocale(locale)
      i18n.global.locale = locale
    },
  },
}
</script>

<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      router
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="rgb(64, 158, 255)"
      :default-active="$route.path"
    >
      <el-menu-item index="/">
        <el-icon><House /></el-icon>
        {{ $t('sidebar.home') }}
      </el-menu-item>
      <el-menu-item :index="$router.resolve({ name: 'stylegen' }).href">
        <el-icon><Brush /></el-icon>
        {{ $t('sidebar.stylegen') }}
      </el-menu-item>
      <el-menu-item :index="$router.resolve({ name: 'help' }).href">
        <el-icon><Help /></el-icon>
        {{ $t('sidebar.help') }}
      </el-menu-item>
      <a href="https://github.com/xfgryujk/blivechat" target="_blank">
        <el-menu-item>
          <el-icon><Share /></el-icon>
          {{ $t('sidebar.projectAddress') }}
        </el-menu-item>
      </a>
      <a href="http://link.bilibili.com/ctool/vtuber" target="_blank">
        <el-menu-item>
          <el-icon><Link /></el-icon>
          {{ $t('sidebar.giftRecordOfficial') }}
        </el-menu-item>
      </a>
      <el-sub-menu index="null">
        <template #title>
          <el-icon><ChatLineSquare /></el-icon>
          Language
        </template>
        <el-menu-item-group>
          <el-menu-item v-for="locale in LOCALES" :key="locale.locale" @click="onSelectLanguage(locale.locale)">
            {{ locale.name }}
          </el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
    </el-menu>
  </el-scrollbar>
</template>

<style>
.el-scrollbar {
  height: 100%;
}

.scrollbar-wrapper {
  overflow-x: hidden !important;
}

.scrollbar-wrapper .el-menu {
  border: none;
}
</style>
