<script lang="ts">
import * as fonts from './fonts.ts'

export default {
  name: 'FontSelect',
  props: {
    value: String,
  },
  data() {
    return {
      LOCAL_FONTS: fonts.LOCAL_FONTS,
      NETWORK_FONTS: fonts.NETWORK_FONTS,
    }
  },
}
</script>

<template>
  <el-select :value="value" filterable allow-create default-first-option @input="val => $emit('input', val)">
    <el-option-group>
      <el-option v-for="font in LOCAL_FONTS" :key="font" :value="font" />
    </el-option-group>
    <el-option-group>
      <el-option v-for="font in NETWORK_FONTS" :key="font" :value="font" />
    </el-option-group>
  </el-select>
</template>

<style scoped>
.el-select {
  width: 100%
}
</style>
