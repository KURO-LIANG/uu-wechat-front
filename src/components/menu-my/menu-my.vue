<script setup lang="ts">
import {ref} from "vue";

let visible = ref(false)
const show = () => {
  visible.value = true
}
const hide = () => {
  visible.value = false
}

defineExpose({
  show,
  hide
});
</script>

<template>
  <view v-show="visible">555</view>
</template>

<style scoped>

</style>
