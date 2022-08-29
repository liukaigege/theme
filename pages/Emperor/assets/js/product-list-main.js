$(document).ready(function () {
	const defaultGoodsConfig = {
		discountLabelStyle: 'special',
		shippingLabelStyle: 'circal',
		discountLabelPosition: 'right',
		shippingLabelPosition: 'left',
		discountSwitch: true,
		shippingSwitch: true,
		titleStyle: 2,
		pictureSize: 1,
		isShowSecond: false,
	}
	const categoryList = CATEGORYDATA.categoryList // 所有分类数据
	const globalConfigData = INDEXDATA.find((item) => item.typeId == 9)
	const goodsConfig = globalConfigData.config == null ? defaultGoodsConfig : globalConfigData.config.goodsConfig
	const discountStyle = goodsConfig.discountLabelStyle, // 折扣标签样式
		freeShippingStyle = goodsConfig.shippingLabelStyle, // 免邮标签样式
		discountPosition = goodsConfig.discountLabelPosition, // 折扣标签位置 1，左上角 2 ，右上角
		freeShippingPosition = goodsConfig.shippingLabelPosition, // 免邮标签位置  1，左上角 2 ，右上角
		discountSwitch = goodsConfig.discountSwitch, // 是否开启折扣标签
		shippingSwitch = goodsConfig.shippingSwitch, // 是否开启免邮标签
		titleStyle = goodsConfig.titleStyle, // 商品标题显示样式 1-换行显示, 2-超出一行隐藏
		pictureSize = goodsConfig.pictureSize, // 商品图片样式比例 1-原尺寸 ,2-比例1:1 , 3-比例4:3 ,4-比例2:3
		isShowSecond = goodsConfig.isShowSecond, // 是否显示副图
		postionClass = `${discountPosition + '-' + freeShippingPosition}`
	// 最终需要渲染的数据集合
	let searchResult = [],
		// 进入页面判断屏幕宽度
		isLargeScreen = window.innerWidth > 992,
		// 每次滚动时加载的数据条数
		pageSize = 12,
		pageNum = 1,
		flag = true
	!isLargeScreen && $(`div[section-name='pageFooter']`).hide()
	// 屏幕改变时  重置参数
	$(window).resize(
		$.throttle(function () {
			isLargeScreen = window.innerWidth > 992
			$(`div[section-name='pageFooter']`).css('display', isLargeScreen ? 'block' : 'none')
			isLargeScreen && $('#end').hide()
		})
	)

	$(window).scroll(scrollGetList)

	DETAILDATA.sort(function (a, b) {
		var value1 = a['sort']
		var value2 = b['sort']
		return value2 - value1
	})
	// 处理特殊搜索数据
	const prevArr = listSort(DETAILDATA)
	const keyword = decodeURIComponent($.getParam('keyword'))
	const exemptSearchList = [52791, 52790, 52789, 52788, 52786, 52793] // 后期改动
	const _detailData = DETAILDATA.filter((item) => exemptSearchList.indexOf(item.id) === -1)
	// 进入页面后渲染当前条件下的数据
	searchProducts(keyword)

	// 商品列表搜索关键词
	$('#pageSearchSubmit').on('click', function () {
		if ($('#pageSearch').val()) {
			location.href = 'productList.html?keyword=' + $('#pageSearch').val()
		} else {
			location.href = 'productList.html'
		}
	})

	// 排序功能
	if ($('#sortBy li').length) {
		// 排序方式元素上增加标记
		$('#sortBy li')[0].classList.add('active')
	}

	// 大屏情况下鼠标离开父元素后 缩回排序下拉框
	$('#sortBy .sort-extend').mouseleave(function () {
		if (isLargeScreen) {
			$(this).fadeOut(300)
			$('.triangle').removeClass('icon-arrow-down').addClass('icon-arrow-top')
		}
	})
	$('#sortBy').mouseleave(function () {
		if (isLargeScreen) {
			$('#sortExtend').fadeOut(300)
			$('.triangle').removeClass('icon-arrow-down').addClass('icon-arrow-top')
		}
	})

	//商品列表排序下拉选项 点击任意地方自动收回
	$('body').on('click', function (event) {
		if (event.target != document.querySelector('li.active') && !isLargeScreen) {
			$('#sortExtend').fadeOut(300)
			$('.triangle').removeClass('icon-arrow-down').addClass('icon-arrow-top')
		}
	})

	// 排序显示隐藏
	$('#sortBy').on('click', function (e) {
		e.stopPropagation() // 阻止事件冒泡，防止触发小屏情况下的点击任意元素排序下拉收回
		$('#sortExtend').fadeToggle(300)
		$('.triangle').toggleClass('icon-arrow-down').toggleClass('icon-arrow-top')
	})

	// 获取点击的排序字段
	$('#sortBy li').on('click', function (e) {
		e.stopPropagation()
		$(this).addClass('active').siblings('li').removeClass('active')
		$('#sortExtend').fadeOut(300)
		$('.triangle').toggleClass('icon-arrow-down').toggleClass('icon-arrow-top')
		//  渲染页面
		// 重置渲染第一屏
		pageNum = 1
		pageSize = 12
		searchProducts(keyword, $(this).attr('value'), $(this).attr('sortMode'))
		// 图片懒加载
		lazyload()
	})

	// 大屏时分列排 -三列排
	$('#threeColums').on('click', function () {
		$('#productListMain').attr('data-collg', 4)
		$('.three-colums-active').show()
		$('.three-colums-unactive').hide()
		$('.four-colums-unactive').show()
		$('.four-colums-active').hide()
		$('.product-list-main .product-item').each(function (index, item) {
			$(item).addClass('col-lg-4').removeClass('col-lg-3')
		})
	})

	//  大屏时分列排 -四列排
	$('#fourCloums').on('click', function () {
		$('#productListMain').attr('data-collg', 3)
		$('.three-colums-active').hide()
		$('.three-colums-unactive').show()
		$('.four-colums-unactive').hide()
		$('.four-colums-active').show()
		$('.product-list-main .product-item').each(function (index, item) {
			$(item).addClass('col-lg-3').removeClass('col-lg-4')
		})
	})

	// 小屏时分列排 -单列
	$('#oneColums').click(function () {
		$('#productListMain').attr('data-colsm', 12)
		$(this).addClass('active').siblings('#twoColums').removeClass('active')
		$('.product-list-main .product-item').each(function (index, item) {
			$(item).removeClass('col-csm-6').addClass('col-sm-12')
		})
	})

	// 小屏时分列排 -双列
	$('#twoColums').click(function () {
		$('#productListMain').attr('data-colsm', 6)
		$(this).addClass('active').siblings('#oneColums').removeClass('active')
		$('.product-list-main .product-item').each(function (index, item) {
			$(item).removeClass('col-sm-12').addClass('col-csm-6')
		})
	})

	/**
	 *
	 * @param {*}:
	 * @Description : 滚动加载列表数据
	 *
	 */

	function scrollGetList() {
		// 如果总数据大于已加载数据，才显示加载动画
		if (searchResult.length > 12) $('#spinner').show()
		// 视口的高度
		const windowHeight = $(this).height()
		// 滚动高度
		const scrollTop = $(this).scrollTop()
		const minusHeight = isLargeScreen ? 180 : 60

		const $el = $('#productListMain')
		// 父容器底部到页面顶部的距离
		const elScrollTop = $el.height() + $el.offset().top
		if (scrollTop + windowHeight - minusHeight > elScrollTop && flag) {
			pageNum++
			flag = false
			renderhtml(sliceData(pageNum, pageSize, searchResult), '#productListMain', 2)
			if (pageNum >= Math.ceil(searchResult.length / pageSize)) {
				$('#spinner').hide()
				if (!isLargeScreen) $('#end').show()
				$(window).off('scroll', scrollGetList)
			}
			flag = true
		}
	}

	/**
	 *
	 * @param {*} pageNum 当前页码
	 * @param {*} pageSize 当前分页数
	 * @param {*} array 需要切片的数据对象
	 */
	function sliceData(pageNum, pageSize, array) {
		const offset = (pageNum - 1) * pageSize
		const sliceLastLen = offset + pageSize >= array.length ? array.length : offset + pageSize
		return array.slice(offset, sliceLastLen)
	}

	/**
	 *
	 * @param {*} keyword 关键词
	 */
	function searchProducts(keyword = '', sortName, sortType) {
		// 如果当前页面是productlist页面，直接查询检索结果并展示
		if (keyword) {
			searchResult = sort(filterData(_detailData, keyword), sortName, sortType) // 筛选商品并排序
			$('#productListSearch').removeClass('hide')
			$('.product-list-empty .about-all').hide()
			$('#productListSearch').find('.search-keyword').text(keyword)
			$('#productListSearch').find('.search-input').val(keyword)
			if (searchResult.length > 0) {
				// 渲染截取过的数据
				renderhtml(sliceData(pageNum, pageSize, searchResult), '#productListMain')
				$('#productListSearch').find('.has-result').removeClass('hide')
			} else {
				$('#productListMain').empty()
				$('.product-list-operation').hide()
				$('#productListSearch').find('.no-result').removeClass('hide')
			}
		} else {
			// 截取url上的分类id数据  按照分类产品列表页面的路由值来截取  /productList_xxxx.html
			const id = decodeURIComponent($.getParam('id'))
			if (id.length > 0) {
				const currentItem = categoryList.find((item) => item.id == id)
				if (currentItem) {
					addCategoryImg(currentItem)
					searchResult = sort(currentItem.goodsList || [], sortName, sortType)
					$('.product-list-title .category-name').text(currentItem.name)
				}
			} else {
				searchResult = sort(_detailData, sortName, sortType)
			}
			searchResult.length > 0 && renderhtml(sliceData(pageNum, pageSize, searchResult), '#productListMain')
			$('.product-list-empty .about-keyword').hide()
		}
		searchResult.length > 0 ? $('.product-list-empty').hide() : $('.product-list-empty').show()
		$('#resultTotal').text(`(${searchResult.length + prevArr.length})`)
		// const itemSymbol = $('#sortTotal').data('items')
		// $('#sortTotal').text(`${searchResult.length + prevArr.length + ' ' + itemSymbol}`)
	}

	function listSort(itemList) {
		const list = []
		if ($.getParam('q')) {
			const tempArr = $.getParam('q').split('-')
			for (let i = 0; i < tempArr.length; i++) {
				for (let j = 0; j < itemList.length; j++) {
					if (tempArr[i] == itemList[j].goodsNum) {
						list.push(itemList[j])
						break
					}
				}
			}
		}
		return list
	}

	/**
	 *
	 * @param {*} data 商品数据源
	 * @param {*} word 关键词
	 */
	function filterData(data, word) {
		var reg = new RegExp(
			word
				.trim()
				.replace(/[($&*%#@)\n]/g, '')
				.toLowerCase()
		)
		const newData = data.filter((item) => {
			if (item.goodsName) {
				// 返回匹配到热词的数据 或者 将热词去掉所有空格和商品名称去掉所有空格比较
				return reg.test(item.goodsName.toLowerCase().replace(/[($&*%#@)\n]/g, '')) || word.replace(/\s*/g, '') === item.goodsName.replace(/\s*/g, '')
			}
		})
		return newData
	}

	/**
	 *
	 * @param {*} data 渲染的数据源
	 * @param {*} fnode 父级元素
	 * @param {*} type 渲染类型 1-直接替换父元素所有数据  其余数值-直接添加在已渲染数据后面
	 */
	function renderhtml(data, fnode, type = 1) {
		const productItems = renderProductItem(data)
		type === 1 ? $(fnode).html(productItems) : $(fnode).append(productItems)
		lazyload()
		// 切换汇率
		$.switchCurrency()
	}

	/**
	 *
	 * @param {*} data 需要排序的数据
	 * @param {*} sortName 排序的字段
	 * @param {*} sortType 排序的类型  0： asc  1: desc
	 */
	function sort(data, sortName, sortType) {
		let len = data.length
		for (let i = 0; i < len - 1; i++) {
			for (let j = 0; j < len - 1 - i; j++) {
				if (data[j].discount < 10 && $.isEffective(data[j].discountStaTime, data[j].discountEndTime)) {
					data[j].discountPrice = (data[j].defaultPrice * data[j].discount) / 10
				} else {
					data[j].discountPrice = data[j].defaultPrice
				}
				if (data[j + 1].discount < 10 && $.isEffective(data[j + 1].discountStaTime, data[j + 1].discountEndTime)) {
					data[j + 1].discountPrice = (data[j + 1].defaultPrice * data[j + 1].discount) / 10
				} else {
					data[j + 1].discountPrice = data[j + 1].defaultPrice
				}
				// 相邻元素两两对比，元素交换，大的元素交换到后面
				let a, b
				if (sortName === 'shelfTime') {
					console.log(123123123)
					a = new Date(data[j][sortName]).getTime()
					b = new Date(data[j + 1][sortName]).getTime()
				} else if (sortName === 'defaultPrice') {
					a = data[j].discountPrice
					b = data[j + 1].discountPrice
				} else {
					a = data[j][sortName]
					b = data[j + 1][sortName]
				}
				if (sortType == 1) {
					if (a < b) {
						var temp = data[j]
						data[j] = data[j + 1]
						data[j + 1] = temp
					}
				} else {
					if (a > b) {
						var temp = data[j]
						data[j] = data[j + 1]
						data[j + 1] = temp
					}
				}
			}
		}
		return data
	}
	/**
	 * @param {*} data 需要渲染的数据
	 */
	function renderProductItem(data) {
		let html = '',
			html1 = '',
			html2 = '',
			html3 = '',
			html4 = '',
			html6 = '',
			promotionLogo = ''
		if ($.getCookie('promotionLogo')) {
			promotionLogo = `?promotionLogo=${$.getCookie('promotionLogo')}`
		}
		const colLgNumber = $('#productListMain').attr('data-collg')
		const colSmNumber = $('#productListMain').attr('data-colsm')
		for (let i = 0; i < data.length; i++) {
			if (!$.isEmptyObject(data[i])) {
				// <button onclick="routerJump('productDetail_${data[i].id}.html${promotionLogo}')"></button>
				//如果当前对象为空，则说明他是用来占位的，使其透明
				html1 = `<div class="product-item col-csm-${colSmNumber} col-lg-${colLgNumber}" sort="${data[i].sort}" start="${
					data[i].discountStaTime
				}" end="${data[i].discountEndTime}"><a class="product-item-img product-img-event" href='productDetail_${
					data[i].id
				}.html${promotionLogo}'><div class="product-item-madal">${$('.product-list').data('quick')}</div>`
				const isHaveDiscount = data[i].discount && data[i].discount != 10
				if (isHaveDiscount && discountSwitch) {
					html2 = `<div class="off discount-label ${discountStyle + postionClass}"><em>${$.formateDiscount(100 - data[i].discount * 10)}%</em><em>${$(
						'.product-list'
					).data('discount')}</em></div>`
					html6 = `<span class="old-price" p-price="${data[i].defaultPrice}"></span><span class="new-price current-price-font" p-price="${
						(data[i].defaultPrice * data[i].discount) / 10
					}"></span></p></div>`
				} else {
					if (data[i].originalPrice && data[i].originalPrice > data[i].defaultPrice && discountSwitch) {
						html2 = `<div class="off discount-label ${discountStyle + postionClass} ${
							data[i].freeShipping !== 0 ? 'free-shipping' : ''
						}"><p>${$.formateDiscount(((data[i].originalPrice - data[i].defaultPrice) / data[i].originalPrice) * 100)}%</p> <p>${$(
							'.product-list'
						).data('discount')}</p></div>`
						// 需要显示折扣价格
						html6 = `<del class="old-default-price prev-price-font" p-price="${data[i].originalPrice}"></del><span class="new-price current-price-font" p-price="${data[i].defaultPrice}"></span></p></div>`
					} else {
						html2 = ''
						html6 = `<span class="old-price default-price current-price-font" p-price="${data[i].defaultPrice}"></span></p></div>`
					}
				}
				if (data[i].freeShipping !== 0 && shippingSwitch) {
					html3 = `<div class="free-shipping-label ${freeShippingStyle + postionClass} ${html2 == '' ? 'no-discount' : ''}">${$('.product-list').data(
						'free'
					)}</div>`
				} else {
					html3 = ''
				}
				if (data[i].otherImg && isShowSecond) {
					html4 = `<img class="associate-img lazy-img" data-imgsize="${pictureSize}" data-url="${data[i].otherImg}" alt=""><img class="main-img lazy-img" data-imgsize="${pictureSize}" data-url="${data[i].mainImg}" alt="">`
				} else {
					html4 = `<img class="lazy-img" data-imgsize="${pictureSize}" data-url="${data[i].mainImg}" alt="">`
				}
				let html5 = `</a><p class="product-item-text goods-title-font ${titleStyle == 1 ? '' : 'ellipsis'}">${
					data[i].goodsName
				}</p><p class="product-item-price">`
				html = html + html1 + html2 + html3 + html4 + html5 + html6
			} else {
				let html7 = `<div style="opacity:0"  class="product-item start="${data[i].discountStaTime}" end="${data[i].discountEndTime}"></div>`
				html = html + html7
			}
		}
		return html
	}

	// 添加分类图
	function addCategoryImg(item) {
		const html = `<div class="product-list-img">
						<img src="${item.picPc || ''}" class="lazy-img product-list_img--pc">
						<img src="${item.wapPc || ''}" class="lazy-img product-list_img--wap">
					</div>`
		$('.product-list-img').remove()
		$('.product-list-operation').before(html)
	}
})
