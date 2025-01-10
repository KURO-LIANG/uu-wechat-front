<script setup lang="ts">
import {onHide, onLaunch, onShow} from "@dcloudio/uni-app";

onLaunch(() => {
  console.log("App Launch");
});
onShow(() => {
  // #ifdef MP
  const updateManager = uni.getUpdateManager()
  updateManager.onCheckForUpdate(res => {
    console.log('是否有新版本', res)
    if (res.hasUpdate) {

    }
  })
  updateManager.onUpdateReady(() => {
    console.log('新版本已经准备好')
    uni.showModal({
      title: '更新提示',
      content: '新版本已经准备好，是否重启应用？',
      success: res => {
        if (res.confirm) {
          // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
          updateManager.applyUpdate()
        }
      }
    })
  })
  updateManager.onUpdateFailed(() => {
    uni.showModal({
      title: '已经有新版本了哟~',
      content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
    })
  })
  // #endif
});
onHide(() => {
  console.log("App Hide");
});
</script>
<style lang="scss">
@use "@/static/iconfont.css" as *;
@use "@/static/scss/index.scss" as *;
@use '@/wxcomponents/vant/common/index.wxss' as *;
</style>
