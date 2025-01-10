<template>
  <view class="tabbar" :style="`--repeat: ${tabbar.length}`">
    <view class="tabbar-nav">
      <view class="tabbar-nav-a" v-for="(item, index) in tabbar" :key="index"
            @tap="tapTabbar(index,item)">
        <image v-if="pageIndex == index" :class="[item.text ? 'w_48 h_48':'w_80 h_80','gap-mb-xs']" :src="item.selectedIconPath" mode=""></image>
        <image v-else :class="[item.text ? 'w_48 h_48':'w_80 h_80','gap-mb-xs']" :src="item.iconPath" mode=""></image>
        <text :class="['text',pageIndex == index?'active':'']" v-if="item.text">{{ item.text }}</text>
      </view>
    </view>
    <view class="safeZone" :style="{ 'height': safeAreaInsetsBottom  + 'rpx' }"></view>
  </view>
</template>
<script setup lang="ts">
import { ref,reactive, onMounted } from 'vue'

defineOptions({
  name: "Tabbar"
});
const safeAreaInsetsBottom = ref(0)
const show = ref(false)

const props = defineProps({
  pageIndex: {
    type: Number,
    default: 0
  }
});
const emits = defineEmits<{
  (e: 'change', value: any): void
}>();
const tabbar = reactive([
  {
    "pagePath": "/pages/index/index",
    "text": "首页",
    "iconPath": "/static/images/tab-menu-index.svg",
    "selectedIconPath": "/static/images/tab-menu-index-active.svg",
    "search":true
  },
  {
    "pagePath": "/pages/menu-my/menu-my",
    "text": "我的",
    "title": "我的",
    "iconPath": "/static/images/tab-menu-my.svg",
    "selectedIconPath": "/static/images/tab-menu-my-active.svg",
  }

])
const tapTabbar = (index:number,item:any) => {
  console.log(props.pageIndex ,index)
  if(props.pageIndex != index){
    show.value = false
    emits('change', {
      index,
      title:item.title ? item.title : '',
      search:item.search
    });
  }
}
onMounted(() => {
  // uni.hideTabBar({animation: true})
  let res = uni.getWindowInfo().safeAreaInsets.bottom
  safeAreaInsetsBottom.value = res * 2;
});
</script>

<style lang="scss">
.tabbar {
  --width: 100rpx;
  --height: 100rpx;
  --size: 60rpx;
  --repeat: 4;
  --radius: 20rpx;
  --rgba: #333333;
  position: fixed;
  width: 100%;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
  background-color: rgb(25 25 25 / 10%);
  backdrop-filter: blur(22px);

  .tabbar-nav {
    display: grid;
    grid-template-columns: repeat(var(--repeat), 1fr);

    .tabbar-nav-a {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
      padding: 4rpx 0;
      position: relative;
      height: var(--height);
      box-sizing: border-box;
      filter: drop-shadow(2rpx -2rpx 2rpx rgba(0, 0, 0, 0.1));
      font-size: 20rpx;

      &:nth-child(1) {
        border-top-left-radius: var(--radius);
      }

      &:nth-last-child(1) {
        border-top-right-radius: var(--radius);
      }

      .active{
        color: var(--color);
      }
    }
  }
}
</style>
