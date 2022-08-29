$(document).ready(function () {
	initProductsSwipper()
	$('.products-item-img img,.products-item-img .introduce-mask--event').click(function () {
		window.location.href = $(this).parent('.products-item-img').data('link') || ''
	})

	$('.products-item_button--event').click(function () {
		window.location.href = $(this).data('link') || ''
	})

	const globalConfig = INDEXDATA.find((item) => item.typeId == 9).config
	const isShowSecond = globalConfig == null ? false : globalConfig.goodsConfig.isShowSecond
	$('.product-img-event').hover(
		function () {
			// $(this)
			// 	.children('.main-img')
			// 	.css('opacity', isShowSecond ? 0 : 1)
			$(this)
				.children('.associate-img')
				.css('opacity', isShowSecond ? 1 : 0)
		},
		function () {
			// $(this).children('.main-img').css('opacity', 1)
			$(this).children('.associate-img').css('opacity', 0)
		}
	)
})
// 进入 页面 ，初始化左右滑动的产品展示模块
function initProductsSwipper() {
	$('.products-swiper.swiper-container').each(function () {
		const perLineNum = $(this).attr('perLineNum')
		const id = '#' + $(this).attr('id')
		const mySwiper = new Swiper(id, {
			observer: true, //修改swiper自己或子元素时，自动初始化swiper
			observeParents: true, //修改swiper的父元素时，自动初始化swiper
			slidesPerView: window.innerWidth > 768 ? perLineNum : 2.2, // 给’auto‘值时，识别不灵敏,移动端直接显示2.3个
			resizeObserver: true,
			watchSlidesProgress: true,
			watchSlidesVisibility: true,
			spaceBetween: 0,
			navigation: {
				nextEl: `${id} .swiper-button-next`,
				prevEl: `${id} .swiper-button-prev`,
			},
			lazy: {
				loadPrevNext: true,
			},
			on: {
				resize: $.throttle(() => {
					mySwiper.params.slidesPerView = window.innerWidth > 768 ? perLineNum : 2.3
					mySwiper.init()
				}, 500),
			},
		})
	})
	initProductStyle()
}

// 初始化折扣标签样式
function initProductStyle() {
	const shippingPostionClass = $('#discountInput').data('ship')
	const discountPostionClass = $('#discountInput').data('discount')
	const pictureSize = $('#discountInput').data('picturesize')
	const titleStyle = $('#discountInput').data('titlestyle')
	const discountSwitch = $('#discountInput').data('switchd')
	const shippingSwitch = $('#discountInput').data('switchs')
	$('.products-item .free-label')
		.removeClass(function (index, css) {
			return css.split(' ').find((item) => item != 'free-label' && item != 'no-discount')
		})
		.addClass(shippingPostionClass)
	$('.products-item .discount-label')
		.removeClass(function (index, css) {
			return css.substring('discount-label'.length - 1)
		})
		.addClass(discountPostionClass)
	$('.products-item .products-item-img img').attr('data-imgsize', pictureSize)
	// 商品标题样式
	titleStyle == '2'
		? $('.products-item .products-item-introduce p').addClass('overflow_1')
		: $('.products-item .products-item-introduce p').removeClass('overflow_1')
	if (!discountSwitch) {
		$('.products-item .discount-label').hide()
	}
	if (!shippingSwitch) {
		$('.products-item .free-label').hide()
	}
}
