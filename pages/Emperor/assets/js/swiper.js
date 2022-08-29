$(document).ready(function () {
	initBanner()
})
function initBanner() {
	const interval = $('.home-swiper').attr('interval') * 1000
	$('.home-swiper.swiper-container').each(function () {
		const id = '#' + $(this).attr('id')
		new Swiper(id, {
			observer: true, //修改swiper自己或子元素时，自动初始化swiper
			observeParents: true, //修改swiper的父元素时，自动初始化swiper
			spaceBetween: 0,
			pagination: {
				el: '.home-swiper .swiper-pagination',
				clickable: true,
			},
			navigation: {
				nextEl: '.home-swiper .swiper-button-next',
				prevEl: '.home-swiper .swiper-button-prev',
			},
			loop: true,
			autoplay: {
				delay: interval,
				disableOnInteraction: false,
			},
			lazy: {
				loadPrevNext: true, // 轮播懒加载
			},
			pauseOnMouseEnter: true,
		})
	})
}
