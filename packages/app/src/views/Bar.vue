<!--
<script lang="ts" setup>
</script>
-->
<script lang="ts">
import { defineComponent } from 'vue'
import { mapActions, useApiStore } from '../stores'

export default defineComponent({
  name: 'Bar',
  methods: {
    ...mapActions(useApiStore, [
      'foo',
      'bar',
    ]),
  },
})
</script>

<template>
  <div>
    bar
    <div class="join">
      <button
        class="btn join-item"
        @click="foo"
      >
        Foo Button
      </button>
      <button
        class="btn join-item"
        @click="bar"
      >
        Bar Button
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>
