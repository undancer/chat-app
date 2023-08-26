<script lang="ts" setup>
import {
  // defineEmits,
  defineProps,
} from 'vue'
import { LOCAL_FONTS, NETWORK_FONTS } from './fonts'

interface Props {
  value: string
}

defineProps<Props>()
// const emit = defineEmits(['input'])
//
// emit('input')
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
