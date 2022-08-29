/**
 * @desc 用于图片懒加载
 */

$(document).ready(() => {
	lazyload()
	// 滚屏函数
	$(window).scroll(lazyload)
})
// 懒加载实现
function lazyload() {
	// 已滚动距离
	var distance = 0
	// 滚动高度
	var scrollTop = document.documentElement.scrollTop || document.body.scrollTop
	// 记录已滚动部分，img不必再次赋值
	if (distance > scrollTop) return
	distance = scrollTop
	// 获取图片列表，即img标签列表
	var imgs = $('.lazy-img')
	// 可视区域高度
	var innerHeight = window.innerHeight
	var scrollHeight = document.documentElement.scrollHeight
	//滚动区域高度
	imgs.each(function () {
		let top = this.offsetTop
		// 滚动到图片或者积木装修预览时，加载 图片
		if (innerHeight + scrollTop > top) {
			let src = this.dataset.url
			$(this).attr('src', src)
		}
	})
	// 全部滚动过，解除绑定
	if (innerHeight + scrollTop >= scrollHeight) {
		$(window).off('scroll', lazyload)
	}
}
