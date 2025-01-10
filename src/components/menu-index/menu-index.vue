<script setup lang="ts">
import {ref, reactive, watch} from "vue";
import UiSkeleton from "@/components/ui-skeleton/ui-skeleton.vue";
import {onLoad, onShow} from "@dcloudio/uni-app";
import {reqCollectPokemon, reqList, reqPokemonList} from "@/apis/api-your-business";
import msg from "@/utils/msg";

let visible = ref(false)
let firstLoading = ref(false)
let reLoading = ref(false)
let loading = ref(false)
let saving = ref(false)
const pulling = ref(false);
let loaded = false;
const props = defineProps({
  scrollHeight: {
    type: Number,
    default: 0
  },
  searchData: {
    type: Object,
    default: {}
  }
})
const skeletonProps = reactive({
  wrapper: true,
  hidden: false,
  className: 'pt_36 mb_40 plr_36',
  children: [
    {
      className: 'width-full h_460 br_16',
    },
    {
      className: 'w50 h_60',
    },
    {
      className: 'width-full h_460 br_16',
    },
    {
      className: 'w50 h_60',
    }
  ]
});
const show = () => {
  visible.value = true
}
const hide = () => {
  visible.value = false
}
const emit = defineEmits<{
  (e: 'update:loading', loading: boolean): void
}>();
// 监听loading变化传递给父级页面
watch(()=>firstLoading.value, (newValue) => {
  console.log('firstLoading', newValue)
  emit('update:loading', newValue)
})
// 监听搜索条件变化
watch(()=>props.searchData, (newValue) => {
  console.log('搜索变化',newValue)
  searchData.nameChinese = newValue.nameChinese
  reLoading.value = true
  refresh()
}, { deep: true })

interface State {
  page: number
  limit: number
  list: ListRes[]
}

const state = reactive<State>({
  page: 1,
  limit: 20,
  list: []
});

let searchData = reactive({
  nameChinese: '',
  sort: 0, // 排序类型 0-xx，1-xx
  orderBy: 0,// 排序方式 0-顺序，1-倒叙
  collect:0, // 收藏状态 0-全部，1-已收藏
})

const query = () => {
  if (loading.value) {
    pulling.value = false;
    return;
  }
  loading.value = true;
  reqList({
    pageNum: state.page,
    pageSize: state.limit,
    ...searchData
  }).then(res => {
    const list = res?.list || [];
    state.list = state.page === 1 ? list : state.list.concat(list);
    if (res?.total) {
      const totalPages = getTotalPages(res.total);
      loaded = state.page >= totalPages;
    }
  }).catch(e => {
    msg.toast(e.message)
  }).finally(() => {
    loading.value = false;
    pulling.value = false;
    firstLoading.value = false;
    reLoading.value = false;
  })
}

const getTotalPages = (total: number) => {
  return Math.ceil(total / state.limit);
}

const refresh = () => {
  state.page = 1;
  pulling.value = true;
  query();
}

const more = () => {
  if (loaded || loading.value) return;
  state.page++;
  query();
}

const toDetail = (id: number) => {
  uni.navigateTo({
    url: `/pages/detail/detail?id=${id}`
  })
}

onLoad(() => {
  firstLoading.value = true
  // 定时器，检查
  let timer = setInterval(() => {
    let userInfo = uni.getStorageSync('userInfo')
    if (userInfo && userInfo.userId > 0) {
      clearInterval(timer)
      query()
    }
  }, 500)
})
defineExpose({
  show,
  hide
});
</script>

<template>
  <view v-show="visible" class="content">
    <ui-skeleton v-if="firstLoading || reLoading" :skeleton="skeletonProps"></ui-skeleton>
    <view v-else class="pt_40">
      <scroll-view
          :style="{height:props.scrollHeight + 'px'}"
          scroll-y="true"
          refresher-enabled="true"
          :refresher-triggered="pulling"
          @scrolltolower="more"
          @refresherrefresh="refresh"
      >
        <view class="flex-column flex-row-center flex-column-center padding plr_36 h100" v-if="!state.list.length">
          <image src="/static/images/icon-no-data.svg" class="w_200 h_200"></image>
          <text class="text-light">暂无记录</text>
        </view>
        <!--业务布局-->
        <view>
        </view>
        <view class="h_80 ptb_48 text-center font-size10 text-info" v-if="loaded">-- 我也是有底线的 --</view>
        <view v-if="loading" class="h_80 flex-row flex-row-center ptb_48">
          <view class="loading"></view>
        </view>
      </scroll-view>
      <view class="h_150"></view>
    </view>
  </view>
</template>

<style scoped>
</style>
