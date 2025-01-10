<template>
  <view class="relative content">
    <custom-nav ref="customNavRef" :title="title" :search="search" :loading="loading" @change="changeSearch" :collect="collect"></custom-nav>

    <MenuIndex ref="indexRef" :searchData="state.searchData" :scrollHeight="scrollHeight" @update:loading="changeLoading"></MenuIndex>
    <MenuMy ref="myRef" :scrollHeight="scrollHeight"></MenuMy>

    <custom-tab ref="customTabRef" :pageIndex="tabIndex" @change="changeTab" />
  </view>
</template>

<script setup lang="ts">
import {nextTick, reactive, ref} from 'vue'
import CustomTab from "@/components/custom-tab/custom-tab.vue";
import CustomNav from "@/components/custom-nav/custom-nav.vue";
import MenuIndex from "@/components/menu-index/menu-index.vue";
import MenuMy from "@/components/menu-my/menu-my.vue";
import {onLoad, onShow} from "@dcloudio/uni-app";
import {reqOpenId} from "@/apis/api-auth";

const loading = ref(true)
const search = ref(false)
const tabIndex = ref(-1)
const title = ref('')
const scrollHeight = ref(0)
const state = reactive({
  searchData: {
    nameChinese:''
  }
})
const customNavRef = ref();
const customTabRef = ref();

// 添加了菜单页面需要在这里增加页面组件的ref
const indexRef = ref();
const myRef = ref();
const coms = reactive([
  indexRef,
  myRef
])

const changeTab = (value:any) => {
  console.log('切换tab',value)
  if(tabIndex.value > -1){
    coms[tabIndex.value].value.hide()
  }
  coms[value.index].value.show()
  tabIndex.value = value.index
  title.value = value.title
  search.value = value.search??false
  uni.pageScrollTo({
    scrollTop: 0
  })
}

const changeSearch = (search:any) => {
  console.log('index ',search)
  state.searchData = search
}
const changeLoading = (newValue:boolean) => {
  console.log('loading', newValue)
  loading.value = newValue
}
const init = async () => {
  await reqOpenId();
  await nextTick()
}

const refresh = () => {
  init().then(()=>{
    coms[tabIndex.value].value.show()
  })
}

onLoad(()=>{
  init().then(() => {
    changeTab({index: 0,search:true})

    nextTick(()=>{
      const windowInfo = uni.getWindowInfo()
      const titleBar: number = uni.getDeviceInfo().system.indexOf('ios') < 0 ? 48 : 44

      // 获取customNav高度
      const customNavHeight = windowInfo.statusBarHeight + titleBar
      let bottomHeight = windowInfo.safeAreaInsets.bottom
      const customTabHeight = bottomHeight*2 + 50
      // 获取屏幕高度
      scrollHeight.value = windowInfo.windowHeight - customNavHeight - customTabHeight
    })
  }).catch((e) => {
    console.error(e)
  }).finally(() => {
    // loading.value = false;
  })
})

onShow(()=>{
  if(!loading.value){
    refresh()
  }
})
</script>

<style>
.icon-bg{
  position: absolute;
  top: -6%;
  right: -15%;
  width: 100%;
  height: 53%;
  transform: rotate(30deg);
  opacity: 0.5;
}

</style>
