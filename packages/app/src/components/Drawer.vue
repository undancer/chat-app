<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'
import {
  RouterLink,
  useRouter,
} from 'vue-router'

const { t, locale } = useI18n()
const router = useRouter()

const languages = [
  { locale: 'zh', name: '中文' },
  { locale: 'ja', name: '日本語' },
  { locale: 'en', name: 'English' },
]
function onSelectLanguage(value: string) {
  locale.value = value
}
</script>

<!-- background-color="#304156" -->
<!-- text-color="#bfcbd9" -->
<!-- active-text-color="rgb(64, 158, 255)" -->

<template>
  <div class="bg-base-100  drawer drawer-open">
    <input type="checkbox" class="drawer-toggle">
    <div class="drawer-side">
      <div class="w-48 h-8 bg-[#304156] text-[#bfcbd9]">
        side
      </div>
      <aside class="overscroll-auto h-full bg-[#304156] text-[#bfcbd9]">
        <ul
          class="menu bg-base-200 px-4 py-2 w-50 bg-[#304156] text-[#bfcbd9]"
          :class="{
            'rounded-box': false,
          }"
        >
          <li>
            <RouterLink to="/">
              <Icon icon="mdi:home" :width="`${1.5}em`" />
              <span>
                {{ t('sidebar.home') }}
              </span>
            </RouterLink>
          </li>
          <li>
            <RouterLink :to="router.resolve({ name: 'stylegen' }).href">
              <Icon icon="mdi:brush" :width="`${1.5}em`" />
              <span>
                {{ t('sidebar.stylegen') }}
              </span>
            </RouterLink>
          </li>
          <li>
            <RouterLink :to="router.resolve({ name: 'help' }).href">
              <Icon icon="mdi:link" :width="`${1.5}em`" />
              <span>
                {{ t('sidebar.help') }}
              </span>
            </RouterLink>
          </li>
          <li>
            <a href="https://github.com/xfgryujk/blivechat" target="_blank">
              <Icon icon="mdi:share" :width="`${1.5}em`" />
              <span>
                {{ t('sidebar.projectAddress') }}
              </span>
            </a>
          </li>
          <li>
            <a href="https://link.bilibili.com/ctool/vtuber" target="_blank">
              <Icon icon="mdi:help" :width="`${1.5}em`" />
              <span>
                {{ t('sidebar.giftRecordOfficial') }}
              </span>
            </a>
          </li>
          <li>
            <details open>
              <summary>
                <Icon icon="mdi:translate" :width="`${1.2}em`" />
                Language
              </summary>
              <ul>
                <li v-for="{ name, locale: language } in languages" :key="language" @click="onSelectLanguage(language)">
                  {{ name }}
                </li>
              </ul>
            </details>
          </li>
        </ul>
      </aside>
    </div>
    <div class="drawer-content bg-base-200">
      <div class="tabs">
        <a class="tab tab-bordered">Tab 1</a>
        <a class="tab tab-bordered tab-active">Tab 2</a>
        <a class="tab tab-bordered">Tab 3</a>
      </div>
      <div class="tabs tabs-boxed">
        <a class="tab">Tab 1</a>
        <a class="tab tab-active">Tab 2</a>
        <a class="tab">Tab 3</a>
      </div>
    </div>
  </div>

<!--  <div class="drawer w-full h-full"> -->
<!--    <input id="my-drawer" type="checkbox" class="drawer-toggle"> -->
<!--    <div class="drawer-side"> -->
<!--      <label for="my-drawer" class="drawer-overlay"> -->
<!--        aaa -->
<!--      </label> -->
<!--      <ul class="menu w-60 min-h-full bg-base-200 text-base-content"> -->
<!--        &lt;!&ndash; Sidebar content here &ndash;&gt; -->
<!--        <li><a>Sidebar Item 1</a></li> -->
<!--        <li><a>Sidebar Item 2</a></li> -->
<!--      </ul> -->
<!--    </div> -->
<!--    <div class="drawer-content"> -->
<!--      &lt;!&ndash; Page content here &ndash;&gt; -->
<!--      <label for="my-drawer" class="btn btn-primary drawer-button">Open drawer</label> -->
<!--    </div> -->
<!--  </div> -->
</template>

<style lang="scss" scoped>

</style>
<!--
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
-->
