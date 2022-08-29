$(document).ready(function () {
	// 在iframe子页面
	// 操作类型：1： 滚动页面；2： 删除积木；3：添加积木；4：更新积木；5：排序
	window.addEventListener('message', function (event) {
		//event.data获取传过来的数据
		const type = event.data.type
		const typeId = event.data.typeId
		const sectionId = event.data.sectionId
		const eventData = event.data.data
		let currentEle = $(`div[section-id="${sectionId}"]`)
		if (type === 1) {
			if (typeId == 9) return // 全局配置模块不需要滚动页面
			scrollFun(sectionId)
		} else if (type === 2) {
			currentEle.remove()
		} else if (type === 3) {
			$('#template').append(eventData)
			scrollFun(sectionId)
			loadImg()
		} else if (type === 4) {
			currentEle.replaceWith(eventData)
			if (typeId === 1) {
				handleHeader(event)
			} else if (typeId === 2 || typeId === 4) {
				initBanner() // 初始化banner轮播图
				initProductsSwipper() //初始化首页商品列表页轮播
			}
			// 更新模块时，加载图片（因为此时无法触发lazyload.js内图片懒加载逻辑）
			loadImg()
		} else if (type === 5) {
			// 模块排序
			sortBlocks(eventData)
			scrollFun(sectionId)
		} else if (type === 10) {
			initProductsSwipper()
		} else if (type === 11) {
			$.switchCurrency() // 根据汇率更改全局价格
		}

		if (typeId == 2) {
			initBanner() // 初始化banner轮播图
		} else if (typeId == 4) {
			initProductsSwipper() //初始化首页商品列表页轮播
		} else if (typeId == 9) {
			addStyle(eventData)
			initProductStyle() // 初始化折扣标签样式
		}

		window.parent.postMessage('完成', '*')
	})
	window.addEventListener(
		'click',
		function (e) {
			// this.alert('当前为预览页面，禁止点击操作！')
			e.stopPropagation()
			e.preventDefault()
			return
		},
		true
	)
})

function scrollFun(sectionId) {
	var scrollTop = sectionId ? $(`div[section-id="${sectionId}"]`).offset().top - 100 : 0
	$('body,html').animate({ scrollTop }, 500)
}

// 给index页面折扣和免邮标签实时更新位置
function addStyle(styleData) {
	$('#discountInput').remove()
	$('#globalVar').remove()
	$('head').append(styleData)
}

function loadImg() {
	$('.lazy-img').each(function () {
		// 加载 图片
		let src = this.dataset.url
		$(this).attr('src', src)
	})
}

// 处理头部逻辑
function handleHeader(event) {
	console.log(event);
	const catalogueList = event.data.blockObj.config.catalogue.list
	const isLineFeed = $('#scroller').attr('isLineFeed')
	let lisLen = 0
	$('#scroller li').each(function () {
		lisLen = lisLen + parseInt($(this).css('width').split('p')[0]) + 98
	})
	$('#navigation').mouseleave(function () {
		$('#menu').fadeOut(300)
	})
	$('#headerFirstMenu .scroller-style-001').removeClass('opClass')
	// 计算头部导航的宽度
	customizeScrollWidth(lisLen, isLineFeed)
	$('#navigation #scroller li').mouseenter(function () {
		const parentEle = $('#navigation')
		const categoryId = $(this).attr('categoryId')
		const displayStyle = parentEle.attr('displayStyle')
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
}

function sortBlocks(data) {
	// 模块排序
	const blocks = $('#template').children('div[section-id]')
	$('#template').html()
	for (let i = 0; i < data.length; i++) {
		for (let j = 0; j < blocks.length; j++) {
			if ($(blocks[j]).attr('section-id') == data[i]) {
				$('#template').append(blocks[j])
			}
		}
	}
}
