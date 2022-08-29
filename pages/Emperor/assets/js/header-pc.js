$(document).ready(function () {
	const headerConfig = INDEXDATA.find((item) => item.typeId == 1).config
	const catalogueList = headerConfig.catalogue.list
	const currencyList = headerConfig.currency
	// 设置默认汇率
	const rateStorage = localStorage.getItem('currentRate')
	setCurrencyEle(JSON.parse(rateStorage))

	// 设置购物车数量
	const currentCheckedData = JSON.parse(localStorage.getItem('checkedData'))
	const cartNumber = currentCheckedData ? currentCheckedData.totalNumer : 0
	$.getParam('isIframe') != 1 &&
		$('.home-bag')
			.find('i')
			.text(cartNumber > 99 ? '99+' : cartNumber)

	// $('#headerFirstMenu').removeClass('menuHide')
	let lisLen = 0 // 当前导航所有li标签的长度和
	const isLineFeed = $('#scroller').attr('isLineFeed')
	const displayStyle = $('#navigation').attr('displayStyle')
	// 导航操作
	// 处理导航菜单数量过多情况下，滑动显示
	$('#scroller li').each(function () {
		lisLen = lisLen + parseInt($(this).css('width').split('p')[0]) + 98
	})
	if (isLineFeed == 0) {
		if (lisLen > 1650) {
			$('#scroller').css({
				transform: 'none',
			})
		} else if (lisLen < 1650) {
			$('#scroller').css({
				'justify-content': 'center',
				display: 'flex',
			})
			$('#scroller li').css({
				float: 'left',
			})
		}
	}

	customizeScrollWidth(lisLen, isLineFeed)

	// 窗口缩动，重新计算头部相关滚动元素
	window.onresize = $.throttle(() => {
		customizeScrollWidth(lisLen, isLineFeed)
	}, 500)

	// 左侧滚动
	$('.left-modal--event').on('click', function () {
		const leftValue = +$('#scroller').css('left').split('p')[0]
		if (+$('#scroller').css('left').split('p')[0] < 75) {
			var l = leftValue + 300 > 75 ? 75 : leftValue + 300
			$('#scroller').css({
				left: l + 'px',
				right: 'auto',
			})
		}
	})

	// 右侧滚动
	$('.right-modal--event').on('click', function () {
		const selfWidth = Math.abs($('.header .header-navigation .scroller-style-001').width())
		const parentWidth = $('#headerFirstMenu').width()
		const leftValue = +$('#scroller').css('left').split('px')[0]
		const l = leftValue - 300 // 300是步长
		if (Math.abs(l) < selfWidth - parentWidth) {
			$('#scroller').css('left', l + 'px')
		} else {
			$('#scroller').css('left', `-${selfWidth - parentWidth}px`)
		}
	})

	// 触摸切换货币汇率
	$('.header-toolbar-left .currency-hover').hover(
		function () {
			$('.header-toolbar-left .currency-extend').show()
		},
		function () {
			$('.header-toolbar-left .currency-extend').hide()
		}
	)

	$('.header-toolbar-left .currency-extend').hover(
		function () {
			$(this).show()
		},
		function () {
			$(this).hide()
		}
	)

	// 关闭顶部公告
	$('#topActived #activedClose').on('click', function (event) {
		event.preventDefault()
		$('#topActived').hide()
	})

	$('#navigation').mouseleave(function () {
		$('#menu').fadeOut(300)
	})

	$('#navigation #scroller li').mouseenter(function () {
		const parentEle = $('#navigation')
		const categoryId = $(this).attr('categoryId')
		const eleLeft = $(this).offset().left - parentEle.offset().left + $(this).width() / 2 // 该触摸元素中心点距离父元素左边缘位置
		const eleBottom = $(this).offset().top - parentEle.offset().top + $(this).height() // 该触摸元素底部距离父元素上边缘位置
		renderMenu({
			catalogueList,
			categoryId,
			displayStyle,
			eleLeft,
			eleBottom,
		})
	})

	// 搜索
	$('#showSearchDialog').click(function () {
		$('#searchDialog').removeClass('hide')
	})
	$('#closeSearchDialog').click(function () {
		$('#searchDialog').addClass('hide')
	})
	$('#search').blur(function () {
		setTimeout(() => {
			$('#searchExtend').hide(100)
		}, 300)
	})
	$('#search').focus(function () {
		var keyword = $(this).val()
		var result = $.filterHeaderGoodsList(DETAILDATA, keyword)
		if (keyword && result.length) {
			$('#searchExtend').show(100)
			$('#searchResult').empty()
			renderSearch(result)
		}
	})
	$('#search').keyup(function (event) {
		var keyword = $(this).val()
		var result = $.filterHeaderGoodsList(DETAILDATA, keyword)
		if (keyword && result.length) {
			$('#searchExtend').show(100)
			$('#searchResult').empty()
			renderSearch(result)
		} else {
			$('#searchExtend').hide(100)
			$('#searchResult').empty()
		}
	})
	$('#searchSubmit,#viewAll').on('click', function () {
		if ($('#search').val()) {
			location.href = 'productList.html?keyword=' + $('#search').val()
		} else {
			location.href = 'productList.html'
		}
	})

	//  打开购物车
	$('.header-pc .home-bag--event').click(function () {
		if (location.pathname == '/cart' || location.pathname == '/cart.html') return
		// $('.cart-modal--event').show()
		$.toPage('cart.html')
	})

	// 切换汇率
	$('.currency-extend_item--event').on('click', function () {
		$(this).addClass('active').siblings('li').removeClass('active')
		$('.currency-extend_item--event .currency-check').hide()
		$(this).find('.currency-check').show()
		const currentRate = currencyList.find((item) => item.currency === $(this).attr('currencyId'))
		$('.currency .currency-active').css('background-image', `url(${currentRate.pic})`)
		$('.currency .currencyActive-name').text(currentRate.currency)
		localStorage.setItem('currentRate', JSON.stringify(currentRate))
		$.switchCurrency() // 全局更换价格

		// }
		// }
	})

	$('#toolbar-menu').on('click', function () {
		$('#menu-outer').animate({
			left: 0,
		})
		$('#modal').show()
		// forbidScroll()
	})
})

function callbackCurreny(currentRate) {
	$('.currency-extend_item--event .currency-check').hide()
	$('.currency-extend_item--event').each(function () {
		if ($(this).attr('currencyId') === currentRate.currency) {
			$(this).addClass('active')
			$(this).find('.currency-check').show()
		}
	})
	$('.currency .currency-active').css('background-image', `url(${currentRate.pic})`)
	$('.currency .currencyActive-name').text(currentRate.currency)
}

function menuHover(url) {
	if (url != null) $('.menu-img .background-img').attr('src', getResultImg(url))
}

function customizeScrollWidth(lisLen, isLineFeed) {
	if ($('.header .header-navigation .scroller-style-001').length) {
		const listEle = $('.header .header-navigation .scroller-style-001').find('li')
		let toRightContainerWidth = 0 //需要滑动的模块外容器，初始值为0，先启动第一次滑动
		for (let i = 0; i < listEle.length; i++) {
			toRightContainerWidth += listEle.eq(i).width() + 50
		}
		$('.header .header-navigation .scroller-style-001').width(toRightContainerWidth)
		if ($('#headerFirstMenu').width() - 320 > toRightContainerWidth) {
			$('.header .header-navigation .scroller-style-001')
				.css({
					left: '50%',
					transform: 'translateX(-50%)',
				})
				.removeClass('opClass')
		} else {
			$('.header .header-navigation .scroller-style-001')
				.css({
					left: '75px',
					transform: 'none',
				})
				.removeClass('opClass')
		}
		if ($('#headerFirstMenu').width() > lisLen && !!isLineFeed) {
			$('.left-modal').hide()
			$('.right-modal').hide()
		} else {
			$('.left-modal').show()
			$('.right-modal').show()
		}
	}
}

/**
 *
 * @param {*} currentRate 当前汇率的所有值
 */
function setCurrencyEle(currentRate) {
	$('.header-pc .currency-img.currency-active').css('background-image', `url(${currentRate.pic})`)
	$('.header-pc .currency-hover .currency-name').text(currentRate.currency)
	$('ul.currency-extend li').each(function (index, item) {
		if ($(item).attr('currencyId') === currentRate.currency) {
			$(item).addClass('active').siblings().removeClass('active').find('.currency-check').hide()
			$(item).find('.currency-check').show()
		}
	})
}

$(document).ready(function () {
	// pinterest 埋点数据 ~~~~~Start~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	var pinterestSetData = {
		pinterestYOUR_TAG_ID: '',
		pinterestEventType: 'pagevisit',
		pinterestData: {
			product_name: $('title').text().replace('"', '“'),
			attribute: window.location.href,
		},
	}
	// pinterestFn(pinterestSetData)
	// pinterest 埋点数据 ~~~~~End~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
})
