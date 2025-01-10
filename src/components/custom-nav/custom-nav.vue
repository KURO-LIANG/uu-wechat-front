<template>
  <view class="c-nav-placeholder" :style="{'height':navigationBarHeight+'px'}">
    <view class="c-nav" :class="{'c-nav-bg':showBg}" :style="{'opacity':opacityBg}">
      <view class="c-nav-status-bar" :style="{'height':statusBarHeight+'px'}"></view>
      <view class="c-nav-title-bar relative w100" :style="{'height':titleBarHeight+'px'}">
        <view v-if="!notBack && isBack" class="c-nav-back" @tap="tapBack"></view>
        <view class="c-nav-left">
          <slot name="left"></slot>
        </view>
        <view class="c-nav-title">
          <view v-if="loading" class="loader" :style="{'background-color': search ? '#333333':'none'}">
            <label>L</label>
            <label>o</label>
            <label>a</label>
            <label>d</label>
            <label>i</label>
            <label>n</label>
            <label>g</label>
          </view>
          <slot name="title" v-else-if="title">{{ title }}</slot>
        </view>
        <slot></slot>
        <view v-if="search" :class="['flex-row-between width-full', !notBack && isBack ? '':'ml_36']">
          <view class="searchBox flex-row-between"
                :style="{'box-shadow': loading ? 'none !important':'0 2px 10px 0 rgba(37, 37, 37, 0.16)'}">
            <view :class="['flex-row flex-column-center gap-ml-xs', showSearchInput?'searchInputBox':'']"
                  @click="showSearch">
              <image src="/static/images/icon-search.svg" class="w_36 h_36 min_w_36"/>
              <input type="text" placeholder="名称" confirm-type="search"
                     v-model.trim="searchData.nameChinese" :focus="showSearchInput"
                     :class="['searchInput', showSearchInput?'inputLoad':'']"
                     @confirm="confirm"/>
            </view>
          </view>
          <view class="c-nav-right"></view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import {ref, onMounted, reactive, watch} from 'vue';

const props = withDefaults(
    defineProps<{
      title?: string
      showBg?: boolean
      notBack?: boolean
      loading?: boolean
      search?: boolean
      opacityBg?:number
    }>(),
    {
      title: '',
      showBg: false,
      notBack: false,
      loading: false,
      search: false,
    }
);
const statusBarHeight = ref(20);
const titleBarHeight = ref(60);
const navigationBarHeight = ref(68);
const showSearchInput = ref(false);
const isBack = ref(false);
let searchData = reactive({
  nameChinese: '',
  sort:0,
  orderBy:0
})
let tabData = reactive({
  left: 0,
  width: 62,
  height: 38
})

watch(()=>props.search, (newValue)=>{
  console.log('搜索变化',newValue)
  if(newValue){
    navigationBarHeight.value = navigationBarHeight.value + 30
  }
})

const tapBack = () => {
  uni.navigateBack()
}

const emits = defineEmits<{
  (e: 'change', value: any): void
}>();

const showSearch = () => {
  showSearchInput.value = true
}
const confirm = () => {
  emits('change', searchData);
}

onMounted(async () => {
  const res = uni.getWindowInfo()
  const titleBar: number = uni.getDeviceInfo().system.indexOf('ios') < 0 ? 48 : 44

  statusBarHeight.value = res.statusBarHeight
  titleBarHeight.value = titleBar
  navigationBarHeight.value = res.statusBarHeight + titleBar
  console.log('props.search',props.search)
  isBack.value = getCurrentPages().length > 1
  console.log('是否加载中...', props.loading)
  uni.setNavigationBarColor({
    backgroundColor: '#C4DDF4',
    frontColor: '#ffffff'
  })
})
</script>

<style lang="scss">
.c-nav-bg {
  background-color: #fff;
  border-bottom: 1px solid $uni-border-color;
}

.c-nav {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  right: 0;
  transition: background-color 0.3s;
  background: linear-gradient(to bottom, rgb(43 43 43) 0%, rgba(0, 0, 0, 0) 100%);
}

.c-nav-title-bar {
  display: flex;
}

.c-nav-back {
  padding-left: 32upx;
  padding-right: 32upx;
  display: flex;
  justify-content: center;
  align-items: center;

  &:active {
    background-color: rgba(0, 0, 0, 0.1);
  }

  &::after {
    content: "";
    display: block;
    width: 0.6em;
    height: 0.6em;
    border-top: 2px solid currentColor;
    border-left: 2px solid currentColor;
    transform: rotate(-45deg) translate(15%, 15%);
  }
}

.c-nav-left {
  display: flex;
  align-items: center;
}

.c-nav-right {
  width: 146px;
  height: 64rpx;
}

.c-nav-title {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  //padding-left: 16px;
  font-size: 16px;
}

.c-nav-back + .c-nav-title {
  padding-left: 0;
}

.c-nav-end {
  flex: 0 0 32upx;
}

/* #ifdef MP */
.c-nav-end {
  flex: 0 0 220upx;
}

/* #endif */

/* loading */
.loader {
  font-size: 40upx;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70rpx;
  position: absolute;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 2;
}

.loader label {
  display: inline-block;
  transform: scale(0);
  opacity: 0;
  animation: loadingEffect 2s ease-in-out infinite;
  margin-right: 2px;
}

.loader label:nth-child(1) {
  animation-delay: 0s;
}

.loader label:nth-child(2) {
  animation-delay: 0.2s;
}

.loader label:nth-child(3) {
  animation-delay: 0.4s;
}

.loader label:nth-child(4) {
  animation-delay: 0.6s;
}

.loader label:nth-child(5) {
  animation-delay: 0.8s;
}

.loader label:nth-child(6) {
  animation-delay: 1s;
}

.loader label:nth-child(7) {
  animation-delay: 1.2s;
}

@keyframes loadingEffect {
  0% {
    opacity: 0;
    transform: scale(0); /* 字母从不可见、缩小状态开始 */
  }
  30% {
    opacity: 1;
    transform: scale(1); /* 字母变得可见并达到正常大小 */
  }
  50% {
    opacity: 1;
    transform: scale(1); /* 字母变得可见并达到正常大小 */
  }
  70% {
    opacity: 1;
    transform: scale(1); /* 字母变得可见并达到正常大小 */
  }
  100% {
    opacity: 0;
    transform: scale(0); /* 最后逐渐缩小并消失 */
  }
}

.searchBox {
  box-shadow: 0 2px 10px 0 rgba(37, 37, 37, 0.16);
  border-radius: 60rpx;
  width: 100%;
  height: 64rpx;

  .slide1 {
    position: absolute;
    display: inline-block;
    //padding: 15rpx 28rpx;
    height: 34px;
    width: 89.75px;
    border-radius: 16px;
    transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1.05);
  }

  .slide1 {
    background-color: var(--color);
    z-index: 2;
  }

  .active {
    padding: 15rpx 28rpx;
    border-radius: 16px;
    color: #000;
    z-index: 2;

    /**文字颜色渐变效果**/
    //background: linear-gradient(to right, #ffd602 0, #ff5500 50%, #ffd602 100%) 0 center / 200% auto;
    //-webkit-background-clip: text;
    //background-clip: text;
    //-webkit-text-fill-color: transparent;
    //text-fill-color: transparent;
    //-webkit-animation: txt-anim 4s linear infinite;
    //animation: txt-anim 4s linear infinite;
    //overflow: hidden;
  }

  @keyframes txt-anim {
    100% {
      background-position-x: 200%;
    }
  }

  .searchInputBox {
    border-radius: 18px;
    padding: 3px 6px;
    animation: inputBoxLoad 200ms linear 1 forwards;
  }

  @keyframes inputBoxLoad {
    0% {
      background-color: rgba(0, 0, 0, 0);
    }
    100% {
      background-color: rgba(0, 0, 0, 1);
    }
  }

  .searchInput {
    width: 0;
    height: 54rpx;
    font-size: 12px;
    margin-left: 2px;
    margin-right: 10px;
  }

  .inputLoad {
    animation: inputLoad 200ms linear 1 forwards;
  }

  @keyframes inputLoad {
    0% {
      width: 0;
    }
    100% {
      width: 100%;
    }
  }
}
</style>
