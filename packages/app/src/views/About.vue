<script lang="ts" setup>
</script>

<template>
  <div class="drawer drawer-open">
    <input type="checkbox" class="drawer-toggle">
    <div class="drawer-content">
      <div
        class="
      border-base-100 border-1
      sticky top-0
      w-full h-full
      px-2 py-2
"
      >
        content
        <div class="grid grid-cols-2 gap-4">
          <div class="border-1">
            01
          </div>
          <div class="border-1">
            02
          </div>
        </div>
      </div>
    </div>
    <div class="drawer-side">
      <aside class="w-80 h-full">
        side
      </aside>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "daisyui/dist/full.css";
</style>
