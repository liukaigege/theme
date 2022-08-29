$(document).ready(function () {
	// 将底部汇率部分显示为默认汇率
	const rateStorage = localStorage.getItem('currentRate')
	const isHaveRateStorage = rateStorage && rateStorage != 'undefined'
	const defaultRate = CONFIGDATA.currency.find((v) => v.mainCurrency == 1)
	const currentRate = isHaveRateStorage ? JSON.parse(rateStorage) : defaultRate
	// setCurrencyEle(currentRate)
	$('#currencySelect .currency-list[data-currency=' + currentRate.currency + ']').addClass('select')

	// function wapSwiperFn() {
	// 	new Swiper(`#${$('.footer').attr('id')} .swiper-container`, {
	// 		loop: false,
	// 		pagination: {
	// 			el: '.swiper-pagination',
	// 			dynamicBullets: true,
	// 		},
	// 		lazy: {
	// 			loadPrevNext: true, // 轮播懒加载
	// 		},
	// 	})
	// }
	// if (!$('.banner').length) {
	// 	wapSwiperFn()
	// }

	if ($.getParam('pageid')) {
		$('.footer').css({
			'padding-bottom': '0.28rem',
		})
	}

	// 扩展条目点击事件
	$('.mobile-link-item p').on('click', function () {
		$(this).siblings('.menu-extend').toggle(300)
		$(this).find('.link-icon').toggleClass('rotate')
	})

	//  调出汇率切换界面
	$('#paymentCurrency').on('click', function () {
		$('.mobile-currency').animate({
			bottom: 0,
		})
		const curStorage = localStorage.getItem('currentRate')
		$('#currencySelect .currency-list').removeClass('select')
		$('#currencySelect .currency-list[data-currency=' + JSON.parse(curStorage).currency + ']').addClass('select')
	})

	//  隐藏汇率界面
	$('#currencyClose').on('click', function () {
		$('.mobile-currency').animate({
			bottom: '-100%',
		})
	})

	// 切换汇率
	$('.footer-mobile-link .currency-list').click(function () {
		$(this).addClass('select').siblings().removeClass('select')
		const curRate = CONFIGDATA.currency.find((v) => v.currency == $(this).data('currency'))
		localStorage.setItem('currentRate', JSON.stringify(curRate))
		setCurrencyEle(curRate)
		$.switchCurrency()
	})

	// 关闭底部公告
	$('#homePageFooter').on('click', '#footerActivedClose', function (event) {
		console.log(1231231231);
		event.preventDefault()
		$('#footNotice').hide()
		$('#homePageFooter').css({
			'padding-bottom': 0,
		})
	})

	// 订阅输入框enter键
	$('#footerSubscribe').bind('keypress', function (e) {
		submitSubscribe(e, 'pc')
	})
	// 订阅按钮
	$('#submitSubscribe').on('click', function () {
		submitSubscribe(0, 'pc')
	})
	// 小屏订阅输入框enter键
	$('#mobileSubscribeInput').bind('keypress', function (e) {
		submitSubscribe(e, 'mobile')
	})
	// 小屏订阅按钮
	$('#mobileSubscribeButton').on('click', function () {
		submitSubscribe(0, 'mobile')
	})

	/**
	 * 邮箱订阅
	 *  @param {*} e 是否触发回车事件
	 */
	function submitSubscribe(e, type) {
		if (e) {
			const evt = window.event || e
			if (evt.keyCode !== 13) return
		}
		const email = type == 'pc' ? $('#footerSubscribe').val() : $('#mobileSubscribeInput').val()
		console.log(email)
		const reg =
			/^[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/
		if (reg.test(email)) {
			getToken(function () {
				$.req({
					url: '/api/v1/user/subscribe',
					type: 'post',
					contentType: 'application/json;charset=utf-8',
					data: JSON.stringify({
						email,
					}),
					success(res) {
						if (res.code === 0) {
							$.alert('success', $('.footer-subscribe_success').text())
						} else {
							$.alert('danger', res.msg)
						}
					},
				})
			})
		} else {
			$.alert('danger', $('.footer-subscribe_empty').text())
		}
	}

	/**
	 *
	 * @param {*} currentRate 当前汇率的所有值
	 */
	function setCurrencyEle(currentRate) {
		$('.currency-main-img').each(function () {
			$(this).attr('src', currentRate.pic)
		})
		$('.currency-main-unit').each(function () {
			$(this).html(currentRate.currency)
		})
	}
})
