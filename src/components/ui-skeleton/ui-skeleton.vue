<template>
	<view :class="['skeleton', skeleton.hidden ? 'skeleton-hide' : '']" v-if="!skeleton.children || !skeleton.children.length"></view>
	<view :class="['skeleton-page',skeleton.className?skeleton.className:'']" v-else-if="skeleton.wrapper">
	  <ui-skeleton v-for="(item, index) of skeleton.children" :key="index" :class="[item.className?item.className:'']" :skeleton="item" :style="'gap:inherit;'+(item.style?item.style:'')"></ui-skeleton>
	</view>
	<block v-else :class="[skeleton.className?skeleton.className:'']">
	  <ui-skeleton v-for="(item, index) of skeleton.children" :key="index" :class="[item.className?item.className:'']" :skeleton="item" :style="'gap:inherit;'+(item.style?item.style:'')"></ui-skeleton>
	</block>
</template>

<script lang="ts" setup>
	interface Data {
		wrapper?: boolean
		style?: string
		hidden?: boolean
		className?: string
		children: Array<Data>
	}

	defineProps<{
		skeleton: Data
	}>();
</script>

<style>
.skeleton-page {
  padding: var(--gap);
  display: flex;
  flex-direction: column;
  gap: var(--gap);
}

.skeleton-row {
  display: flex;
  margin-bottom: var(--gap);
  gap: var(--gap);
}

.skeleton {
  flex: 1;
  min-height: 1em;
  height: 100%;
  background-color: rgba(0,0,0,0.04);
  border-radius: 8rpx;
  position: relative;
  overflow: hidden;
}

.skeleton::after {
  content: "";
  position: absolute;
  inset: 0;
  /* background-color: rgba(255, 255, 255, 0.5); */
  background-image: linear-gradient(100deg, transparent 30%, rgba(255,255,255,0.3), transparent 70%);
  transform: translateX(-100%);
  animation: loading 2s linear 0.6s infinite;
}

.skeleton-hide {
  visibility: hidden;
}

@keyframes loading {
  0% {
    transform: translateX(-100%);
  }

  40% {
    transform: translateX(100%);
  }

  100% {
    transform: translateX(100%);
  }
}
</style>
