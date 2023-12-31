<script lang="ts">
import _ from 'lodash'

import Room from '../../Room.vue'
import i18n from '../../../languages'
import Legacy from './Legacy.vue'
import LineLike from './LineLike.vue'

export default {
  name: 'StyleGenerator',
  components: {
    Legacy, LineLike, Room,
  },
  data() {
    const styleElement = document.createElement('style')
    document.head.appendChild(styleElement)
    // 数据流：
    //                                                   输入框 --\
    // 子组件 -> subComponentResults -> subComponentResult -> inputResult -> 防抖延迟0.5s后 -> debounceResult -> exampleCss
    return {
      // 子组件的结果
      subComponentResults: {
        legacy: '',
        lineLike: '',
      },
      activeTab: 'legacy',
      // 输入框的结果
      inputResult: '',
      // 防抖后延迟变化的结果
      debounceResult: '',

      styleElement,
      exampleTop: 0,
      playAnimation: true,
      exampleBgLight: false,
    }
  },
  computed: {
    i18n() {
      return i18n
    },
    // 子组件的结果
    subComponentResult() {
      return this.subComponentResults[this.activeTab]
    },
    // 应用到预览上的CSS
    exampleCss() {
      return this.debounceResult.replace(/^body\b/gm, '#fakebody')
    },
  },
  watch: {
    subComponentResult(val) {
      this.inputResult = val
    },
    inputResult: _.debounce(function (val) {
      this.debounceResult = val
    }, 500),
    exampleCss(val) {
      this.styleElement.innerText = val
    },
  },
  mounted() {
    this.debounceResult = this.inputResult = this.subComponentResult

    this.$parent.$el.addEventListener('scroll', this.onParentScroll)
  },
  beforeUnmount() {
    this.$parent.$el.removeEventListener('scroll', this.onParentScroll)

    document.head.removeChild(this.styleElement)
  },
  methods: {
    onParentScroll(event) {
      if (document.body.clientWidth <= 992) {
        this.exampleTop = 0
      } else {
        this.exampleTop = event.target.scrollTop
      }
    },
    onPlayAnimationChange(value) {
      if (value) {
        this.$refs.room.start()
      } else {
        this.$refs.room.stop()
      }
    },
    copyResult() {
      this.$refs.result.select()
      document.execCommand('Copy')
    },
    resetConfig() {
      this.$refs[this.activeTab].resetConfig()
      this.inputResult = this.subComponentResult
    },
  },
}
</script>

<template>
  <el-row
    :gutter="20"
  >
    <el-col
      :sm="24"
      :md="16"
    >
      <el-tabs
        v-model="activeTab"
      >
        <el-tab-pane
          :label="i18n.global.t('stylegen.legacy')"
          name="legacy"
        >
          <Legacy
            ref="legacy"
            v-model="subComponentResults.legacy"
          />
        </el-tab-pane>
        <el-tab-pane
          :label="i18n.global.t('stylegen.lineLike')"
          name="lineLike"
        >
          <LineLike
            ref="lineLike"
            v-model="subComponentResults.lineLike"
          />
        </el-tab-pane>
      </el-tabs>

      <el-form
        label-width="150px"
        size="mini"
      >
        <h3>{{ i18n.global.t('stylegen.result') }}</h3>
        <el-card shadow="never">
          <el-form-item label="CSS">
            <el-input
              ref="result"
              v-model="inputResult"
              type="textarea"
              :rows="20"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="copyResult"
            >
              {{ i18n.global.t('stylegen.copy') }}
            </el-button>
            <el-button
              @click="resetConfig"
            >
              {{ i18n.global.t('stylegen.resetConfig') }}
            </el-button>
          </el-form-item>
        </el-card>
      </el-form>
    </el-col>

    <el-col :sm="24" :md="8">
      <div :style="{ position: 'relative', top: `${exampleTop}px` }">
        <el-form inline style="line-height: 40px">
          <el-form-item
            :label="i18n.global.t('stylegen.playAnimation')"
            style="margin: 0"
          >
            <el-switch
              v-model="playAnimation"
              @change="onPlayAnimationChange"
            />
          </el-form-item>
          <el-form-item
            :label="i18n.global.t('stylegen.backgrounds')"
            style="margin: 0 0 0 30px"
          >
            <el-switch
              v-model="exampleBgLight"
              :active-text="i18n.global.t('stylegen.light')"
              :inactive-text="i18n.global.t('stylegen.dark')"
            />
          </el-form-item>
        </el-form>
        <div
          id="example-container"
          :class="{ light: exampleBgLight }"
        >
          <div
            id="fakebody"
          >
            <Room ref="room" />
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<style scoped>
#example-container {
  height: calc(100vh - 150px);

  background-color: #444;
  background-image:
      -moz-linear-gradient(45deg, #333 25%, transparent 25%),
      -moz-linear-gradient(-45deg, #333 25%, transparent 25%),
      -moz-linear-gradient(45deg, transparent 75%, #333 75%),
      -moz-linear-gradient(-45deg, transparent 75%, #333 75%);
  background-image:
      -webkit-gradient(linear, 0 100%, 100% 0, color-stop(.25, #333), color-stop(.25, transparent)),
      -webkit-gradient(linear, 0 0, 100% 100%, color-stop(.25, #333), color-stop(.25, transparent)),
      -webkit-gradient(linear, 0 100%, 100% 0, color-stop(.75, transparent), color-stop(.75, #333)),
      -webkit-gradient(linear, 0 0, 100% 100%, color-stop(.75, transparent), color-stop(.75, #333));

  -moz-background-size: 32px 32px;
  background-size: 32px 32px;
  -webkit-background-size: 32px 32px;

  background-position: 0 0, 16px 0, 16px -16px, 0px 16px;

  padding: 25px;

  resize: both;
  overflow: hidden;
}

#example-container.light {
  background-color: #ddd;
  background-image:
      -moz-linear-gradient(45deg, #eee 25%, transparent 25%),
      -moz-linear-gradient(-45deg, #eee 25%, transparent 25%),
      -moz-linear-gradient(45deg, transparent 75%, #eee 75%),
      -moz-linear-gradient(-45deg, transparent 75%, #eee 75%);
  background-image:
      -webkit-gradient(linear, 0 100%, 100% 0, color-stop(.25, #eee), color-stop(.25, transparent)),
      -webkit-gradient(linear, 0 0, 100% 100%, color-stop(.25, #eee), color-stop(.25, transparent)),
      -webkit-gradient(linear, 0 100%, 100% 0, color-stop(.75, transparent), color-stop(.75, #eee)),
      -webkit-gradient(linear, 0 0, 100% 100%, color-stop(.75, transparent), color-stop(.75, #eee));
}

#fakebody {
  outline: 1px #999 dashed;
  height: 100%;
}
</style>
