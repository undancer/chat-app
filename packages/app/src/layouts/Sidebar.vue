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
        <i class="el-icon-s-home" />{{ $t('sidebar.home') }}
      </el-menu-item>
      <el-menu-item :index="$router.resolve({ name: 'stylegen' }).href">
        <i class="el-icon-brush" />{{ $t('sidebar.stylegen') }}
      </el-menu-item>
      <el-menu-item :index="$router.resolve({ name: 'help' }).href">
        <i class="el-icon-question" />{{ $t('sidebar.help') }}
      </el-menu-item>
      <a href="https://github.com/xfgryujk/blivechat" target="_blank">
        <el-menu-item>
          <i class="el-icon-share" />{{ $t('sidebar.projectAddress') }}
        </el-menu-item>
      </a>
      <a href="http://link.bilibili.com/ctool/vtuber" target="_blank">
        <el-menu-item>
          <i class="el-icon-link" />{{ $t('sidebar.giftRecordOfficial') }}
        </el-menu-item>
      </a>
      <el-submenu index="null">
        <template #title>
          <i class="el-icon-chat-line-square" />Language
        </template>
        <el-menu-item v-for="locale in LOCALES" :key="locale.locale" @click="onSelectLanguage(locale.locale)">
          <template>{{ locale.name }}</template>
        </el-menu-item>
      </el-submenu>
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
