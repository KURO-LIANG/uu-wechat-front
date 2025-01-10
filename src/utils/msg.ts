function alert(content = '', title = '提示', callback?: Function) {
	uni.showModal({
		title,
		content,
		showCancel: false,
		success: (res) => {
			if(res.confirm && callback) {
				callback()
			}
		},
		fail: () => {}
	})
}

/**
 * 提示
 */
function toast(title = '', duration = 2500) {
	uni.showToast({
		title,
		icon: 'none',
		duration,
        complete: () => {},
	})
}

/**
 * 成功提示
 */
function toastSuccess(title = '', callback?: Function, duration = 1200) {
	uni.showToast({
		title,
		icon: 'success',
		duration,
        complete: () => {},
	})
	if (callback) {
		setTimeout(callback, duration)
	}
}

/**
 * 错误提示
 */
function toastError(title = '', duration = 2500) {
	uni.showToast({
		title,
		icon: 'error',
		duration,
        complete: () => {},
	})
}

/**
 * 加载状态
 */
function loading(title = '加载中...', mask = true) {
	uni.showLoading({
		title,
		mask,
        complete: () => {},
	})
}

/**
 * 关闭加载状态
 */
function hideLoading() {
	uni.hideLoading()
}

/**
 * 刷新前置页面并后退
 */
function backRefresh(target: number | string = 1, isBack = true) {
	const pages = getCurrentPages();
	let page: any, delta = 1;
	if(typeof target === 'number') {
		delta = target;
		page = pages[pages.length - delta - 1];
	} else {
		const index = pages.findIndex(item => item.route === target);
		if(index >= 0) {
			page = pages[index];
			delta = pages.length - index - 1;
		}
	}
	if(!page) return;
	page.$vm.refresh && page.$vm.refresh();
	if (isBack) {
		uni.navigateBack({
			delta
		})
	}
}

export default {
	alert,
	toast,
	toastSuccess,
	toastError,
	loading,
	hideLoading,
	backRefresh
}
