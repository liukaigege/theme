$(document).ready(function () {
	// 设置默认汇率
	const currentRate = JSON.parse(localStorage.getItem('currentRate'))
	setCurrencyEle(currentRate)
	// 初始化页面是隐藏侧边汇率选择器
	$('#sidebarContainer .currency-select').addClass('hide')
	//  根据汇率更改价格
	$.switchCurrency()
	// 汇率选择器，默认选中（底部的相同组件使用同一个逻辑，由于都在主页，js文件头部已加载，底部也生效）
	$('#currencySelect .currency-list[data-currency=' + currentRate.currency + ']').addClass('select')

	//  小屏时 调出侧边栏
	$('.header-toolbar-menu').on('click', function () {
		$('#sidebarContainer').removeClass('hide')
		$('#sidebar').animate({
			left: 0,
		})
		$.forbidScroll()
	})
	// 搜索按钮
	$('.home-seach_wap--event').routerJump('/search.html')
	// 搜索按钮
	$('.search-header-back').routerJump('/index.html')
	// 订单追踪按钮
	$('.home-order-event').routerJump('/orderSearch.html')
	// 侧边菜单下拉选项事件
	$('#sidebar').on('click', '.sidebar-submenu-icon', function () {
		$(this).parents('.sidebar-menu').toggleClass('expand')
	})

	//  关闭侧边栏
	$('#closeSidebar').click(function () {
		$('#sidebar').stop(true, false).animate({
			left: '-100%',
		})
		setTimeout(function () {
			$('#sidebarContainer').addClass('hide')
		}, 300)
		$.allowScroll()
	})

	//  打开购物车
	$('.header-mobile .home-bag--event').click(function () {
		if (location.pathname == '/cart' || location.pathname == '/cart.html') return
		// $('.cart-modal--event').show()
		$.toPage('cart.html')
	})

	$('#sidebarCurrency').on('click', function () {
		$('#currencySelect .currency-list').removeClass('select')
		const curStorage = localStorage.getItem('currentRate')
		$('#currencySelect .currency-list[data-currency=' + JSON.parse(curStorage).currency + ']').addClass('select')
		$('#currencySelect').toggleClass('hide')
	})

	$('#currencySelect').on('click', '.currency-list', function () {
		$('#currencySelect .currency-list').removeClass('select')
		$(this).addClass('select')
		const curRate = CONFIGDATA.currency.find((v) => v.currency == $(this).data('currency'))
		localStorage.setItem('currentRate', JSON.stringify(curRate))
		$('#currencySelect').toggleClass('hide')
		// if ($('#currencySelect').data('status')) {
		// 	$('.currency-main-img').attr('src', curRate.pic)
		// $('.currency-main-unit').html(curRate.currency)
		// 	switchRate()
		// } else {
		// 切换汇率
		$.switchCurrency()
		setCurrencyEle(curRate)
		// location.reload()
		// }
	})

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

function clickoutSide(id, callback) {
	// 全局注册点击事件
	$('#sidebarContainer').on('click', function (e) {
		//若点击元素为目标元素则返回
		if (e.target.id === id) return
		//否则执行回调函数
		callback()
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
