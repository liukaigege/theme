const DATA = {
	currentRate: JSON.parse(getStorage('currentRate')), // 当前税率
	allChecked: [], //当前选择所有id
	$defaultPrice: $('.product-info__header_price-wrapper .product-info__header_price'), //售价
	$originalPrice: $('.product-info__header_price-wrapper .product-info__header_compare-at-price'), //原价
	myPlayer: null,
	$discount: $('.product-info__header_discount'), //折扣
	getPrice: function (money) {
		const { currency, symbol, rate } = this.currentRate
		if (!!this.currentRate) {
			let totalMoney = rate * money
			let result = parseFloat(totalMoney)
			result = Math.round(totalMoney * 100) / 100
			let s_x = result.toString()
			if (currency !== 'JPY' && currency !== 'TWD') {
				let pos_decimal = s_x.indexOf('.')
				if (pos_decimal < 0) {
					pos_decimal = s_x.length
					s_x += '.'
				}
				while (s_x.length <= pos_decimal + 2) {
					s_x += '0'
				}
			} else {
				s_x = Math.round(s_x)
			}
			return symbol + Number(s_x)
		} else {
			return symbol + Number(money)
		}
	}, //转换汇率价格
	skuId: '',
	sku: '',
	SKUResult: [], //所有多规格可能数据skuid集合
}
console.log('当前所有数据 ==》', window.ROWS)
//判断时候有批发价格
if (window.ROWS.hasOwnProperty('wholesaleList') && !!window.ROWS.wholesaleList && window.ROWS.wholesaleList.length) {
	countWholePrice(1, window.ROWS.wholesaleList)
}
if (window.ROWS.speType == 2) {
	baseCustomization()
} else {
	standard(window.ROWS)
	computeStaticPrice()
}
/*
 清除下拉框
*/
function selectClear(item) {
	item.find('.select-input').val('')
	item.find('.vshop-anim-upbit li').removeClass('is_show vshop-select-this')
}

//商品描述引入
if (!!window.ROWS.description) {
	$('.product-info__desc-tab-content').load('/static-page' + window.ROWS.description + '?version=' + new Date().getTime(), '', function () {})
} else {
	$('.product-info__desc-tab-content').remove()
}

// 点击空白 模态框关闭
function closeModel(item) {
	$(document).on('click', function (e) {
		e.stopPropagation()
		if (!$.contains(item.get(0), $(e.target).get(0))) {
			item.removeClass('vshop-form-selected')
		}
	})
}

//下拉菜单
$(document).on('click', '.product-info__variants_select .vshop-anim-upbit li:not(.is_hide)', function (e) {
	e.preventDefault()
	e.stopPropagation()
	$(this).toggleClass('active').siblings().removeClass('active')
	const vshopInput = $(this).closest('.vshop-form-select').find('.select-input')
	$(this).hasClass('active') ? vshopInput.val($(this).find('span.hide').text()) : vshopInput.val('')
	$(this).closest('.vshop-form-select').removeClass('vshop-form-selected')

	//判断规格类型
	if ($(this).hasClass('mlpSpe-item')) {
		//多规格
		baseMlpSpe($(this))
	} else {
		//定制化
		const hasChild = $(this).attr('data-childlength') // 子规格的数量
		const selfId = $(this).attr('data-selfid') // 自生的id
		const $childDom = $(this).closest('.product-info__variants_select').next('.child-custList__option')

		// 子规格的展示
		if (hasChild && $(this).hasClass('active')) {
			$childDom.find('.product-info__variants_items').addClass('hide')
			$childDom.find(`[data-parentoptionmapid="${selfId}"]`).removeClass('hide')
		} else {
			$childDom.find('.product-info__variants_items').addClass('hide')
		}

		baseCustomization()
	}
	//如果error提示展示 则隐藏
	const $errorTip = $(this).closest('.product-info__variants_items').find('.error')
	if (!$(this).hasClass('active') && $(this).attr('data-need') == '1') {
		$errorTip.removeClass('hide')
	} else {
		$errorTip.addClass('hide')
	}
})

//点击输入框加价
$('#customization').on('keyup', '.product-info__variants_input-item input', function (event) {
	event.stopPropagation()

	//计算价格
	baseCustomization()
	//如果error提示展示 则隐藏
	const $errorTip = $(this).closest('.product-info__variants_items').find('.error')
	if ($(this).attr('data-need') == '1' && !$(this).val()) {
		$errorTip.removeClass('hide')
	} else {
		$errorTip.addClass('hide')
	}
})

$('.product-info__desc-title').click(function () {
	$(this).toggleClass('active')
	$(this).next('.product-info__desc-tab-content').toggleClass('hide')
})

// img-text 图片和按钮类型的展开点击事件
$(document).on('click', '.product-info__variants_text-img li:not(.is_hide)', function (e) {
	e.preventDefault()
	e.stopPropagation()
	$(this).toggleClass('active').siblings().removeClass('active')
	if ($(this).hasClass('product-info__variants_img')) {
		const title = $(this).attr('title') || ''
		!!title && $(this).closest('.product-info__variants_items').find('.product-info__variants_title p').text(title)
	}
	//判断规格类型
	if ($(this).hasClass('mlpSpe-item')) {
		//多规格
		baseMlpSpe($(this))
	} else {
		//定制化
		const hasChild = $(this).attr('data-childlength'),
			selfId = $(this).attr('data-selfid'),
			$childDom = $(this).parent('ul').next('.child-custList__option')
		if (hasChild && $(this).hasClass('active')) {
			$childDom.find('.product-info__variants_items').addClass('hide')
			$childDom.find(`[data-parentoptionmapid="${selfId}"]`).removeClass('hide')
		} else {
			$childDom.find('.product-info__variants_items').addClass('hide')
		}
		//定制化计算
		baseCustomization()
	}
	//如果error提示展示 则隐藏
	const $errorTip = $(this).closest('.product-info__variants_items').find('.error')
	if (!$(this).hasClass('active') && $(this).attr('data-need') == '1') {
		$errorTip.removeClass('hide')
	} else {
		$errorTip.addClass('hide')
	}

	// 展示sku图片
	let dataEnlarge = $(this).attr('data-enlarge') || 0,
		mainImg = $(this).find('img').attr('src'),
		skuid = $(this).attr('data-selfid'),
		index = $('#gallery-top .swiper-slide.swiper-slide-active').index(),
		width = parseInt($('#gallery-top .swiper-slide').eq(0).width() || 0),
		marginRight = parseInt($('#gallery-top .swiper-slide').eq(0).css('marginRight') || 1)
	if (dataEnlarge == 1 && $(this).hasClass('active')) {
		$('#gallery-top .img_box').addClass('hide')
		$('#gallery-top .img_box[data-skuid="' + skuid + '"]')
			.removeClass('hide')
			.css('left', index * (width + marginRight))
			.find('.childDom')
			.attr({ src: mainImg, rel: mainImg })
		$('#gallery-thumbs .swiper-slide.swiper-slide-thumb-active').addClass('no_border')
	} else {
		$('#gallery-top .img_box[data-skuid="' + skuid + '"]').addClass('hide')
		$('#gallery-thumbs .swiper-slide.swiper-slide-thumb-active').removeClass('no_border')
	}
})

// 上传图片选项
$('#customization').on('change', '.uploadImgBtn ', function (event) {
	let files = $(this).prop('files')[0],
		$this = $(this)
	let arr = ['image/png', 'image/jpg', 'image/jpeg', 'image/bmp', 'image/gif', 'image/webp']
	if (arr.indexOf(files.type) === -1) {
		$.alert('danger', window.product_detail_i18n.Wrong_picture_type)
		$(this).val('')
		return false
	}
	let isLt2M = files.size / 1024 / 1024 < 10
	if (!isLt2M) {
		$.alert('danger', window.product_detail_i18n.Upload_picture_size)
		$(this).val('')
		return false
	}
	const $uploadImgUl = $this.closest('.product-info__variants_uploadImg').find('ul')
	return new Promise((resolve, reject) => {
		var extensionName = files.name.substr(files.name.indexOf('.')) // 文件扩展名
		var fileUrl = randomImgName() + extensionName // 文件名字（相对于根目录的路径 + 文件名）
		// 执行上传
		createOssClient().then((client) => {
			console.log('client ==>', client)
			// 异步上传,返回数据
			resolve({
				// fileName: MD5(files.name) + files.name,
				fileName: 111 + files.name,
				fileUrl: fileUrl,
			})
			// 上传处理
			async function putObject() {
				try {
					var result = await client.put(fileUrl, files)
					if (result.url) {
						if ($uploadImgUl.find('li').length) {
							$uploadImgUl.find('li').remove()
						}
						var addImgHtml = `<li><img class="uploadImg" src="${result.url}"> <i class="iconfont icon-close-modal"></i></li>`
						$uploadImgUl.append(addImgHtml).removeClass('hide')
						//如果error提示展示 则隐藏
						if (!$this.closest('.product-info__variants_items').find('p.error').hasClass('hide')) {
							$this.closest('.product-info__variants_items').find('p.error').addClass('hide')
						}
						//这发送图片上传接口后改变价格结果成功
						baseCustomization()
					}
				} catch (e) {}
			}
			putObject()
		})
	})
})

//点击删除图片按钮减价
$(document).on('click', '.icon-close-modal', function (event) {
	event.stopPropagation()
	//如果error提示展示 则隐藏
	if (!$(this).closest('.product-info__variants_items .error').hasClass('hide')) {
		$(this).closest('.product-info__variants_items .error').addClass('hide')
	}
	$(this).closest('.product-info__variants_uploadImg').find('.pro-file').val('')
	$(this).closest('.upload-img__list').find('li').remove()
	//这发送图片上传接口后改变价格结果成功
	baseCustomization()
})

$(document).on('click', '.vshop-form-select .vshop-select-title', function (e) {
	$(this).parent('.vshop-form-select').toggleClass('vshop-form-selected')
	closeModel($(this).parent('.vshop-form-select'))
})
// 多规格计算
function baseMlpSpe($_this) {
	mlpspe($_this)
	const speItem = {
		speValId: $_this.attr('data-selfId'),
		paramId: $_this.parent('ul').attr('param-id'),
	}
	let curr_index
	const saveFlag = DATA.allChecked.find((item, index) => {
		curr_index = index
		return item.paramId == speItem.paramId
	})
	if ($_this.hasClass('active')) {
		if (!!saveFlag) {
			saveFlag.speValId = speItem.speValId
		} else {
			DATA.allChecked.push(speItem)
		}
	} else {
		DATA.allChecked.splice(curr_index, 1)
	}
	if (window.ROWS.speList.length == DATA.allChecked.length) {
		computeStaticPrice()
	} else {
		$('#gallery-top .img_box').addClass('hide')
		$('#gallery-thumbs .swiper-slide.swiper-slide-thumb-active').removeClass('no_border')
		return false
	}
}
// 定制化计算
function baseCustomization() {
	let price = 0
	$("#customization .product-info__variants_items:not('.hide')").each((index, item) => {
		// 文本选择，图片选择，下拉选择dom
		const $text_img_select = $(item).find('ul').find('.customization-item.active')
		if ($text_img_select.length) {
			console.log(parseFloat($text_img_select.attr('param-price')))
			price += parseFloat($text_img_select.attr('param-price'))
		}

		//输入框加价
		const $input = $(item).children('.product-info__variants_input').find(' input')
		if ($input.length) {
			if (!!$input.val()) {
				price += parseFloat($input.attr('param-price'))
			}
		}

		//上传图片加价
		const $uploadImgInput = $(item).children('ul').find('.product-info__variants_uploadImg input')
		const $uploadImgList = $(item).children('ul').find('.product-info__variants_uploadImg ul li')
		if ($uploadImgInput.length && $uploadImgList.length) {
			price += parseFloat($uploadImgInput.attr('param-price'))
		}
	})
	let { originalPrice, defaultPrice, skuList } = window.ROWS
	originalPrice += price
	defaultPrice += price
	if ($('.wholesaleTable tr[class="active"]').length) {
		//符合批发条件
		let $countDiscount = parseFloat($('.wholesaleTable tr[class="active"]').attr('data-discount'))
		//折扣前的价格
		wholesaleCount(defaultPrice, $countDiscount)
	} else {
		if ($('.wholesaleTable tr').length) {
			wholesaleHtml(defaultPrice)
		}
		count(defaultPrice, originalPrice)
	}

	//设置skuID
	DATA.skuId = skuList[0].id
}

// 计算价格
function count(defaultPrice, originalPrice) {
	let discount
	const { $defaultPrice, $originalPrice, $discount } = DATA
	if (originalPrice && originalPrice > defaultPrice) {
		discount = parseFloat(Math.floor(100 - (defaultPrice / originalPrice) * 100)) || 1
		$originalPrice.html(DATA.getPrice(originalPrice)).removeClass('hide')
		$defaultPrice.html(DATA.getPrice(defaultPrice)).removeClass('hide')
		$discount.find('.product-info__header_discount_num').html(discount)
		$discount.removeClass('hide')
	} else {
		$originalPrice.addClass('hide')
		$discount.addClass('hide')
		$defaultPrice.html(DATA.getPrice(defaultPrice)).removeClass('hide')
	}
	$originalPrice.attr('US-price', Math.round(defaultPrice * 100) / 100)
}
/*
	非定制化算价格
	data:详情总数据，allChecked：所有勾选id之和
 */
function computeStaticPrice() {
	const { skuList } = window.ROWS
	let wholeBasePrice = 0
	const allChecked = []
	DATA.allChecked.forEach((item) => {
		allChecked.push(item.speValId)
	})
	allChecked.sort(function (a, b) {
		return a - b
	})
	//查找当前sku
	const currSku = skuList.find((item) => {
		return item.skuvalIds == allChecked.join('||')
	})
	if (typeof currSku != 'undefined') {
		DATA.skuId = currSku.id
		DATA.sku = currSku.sku
		wholeBasePrice = Number(currSku.price)
		//判断是否符合批发条件
		if ($('.wholesaleTable tr[class="active"]').length) {
			let $countDiscount = parseFloat($('.wholesaleTable tr[class="active"]').attr('data-discount'))
			count(wholeBasePrice, currSku.originalPrice)
			wholesaleCount(wholeBasePrice, $countDiscount)
		} else {
			// 批发
			if ($('.wholesaleTable tr').length) {
				wholesaleHtml(wholeBasePrice)
			}
			//折扣价格
			if (!!currSku.originalPrice) {
				count(wholeBasePrice, currSku.originalPrice)
			} else {
				count(wholeBasePrice, window.ROWS.originalPrice)
			}
		}

		// 展示sku图片
		let skuImg = currSku.skuImg
		;(skuid = currSku.id),
			(index = $('#gallery-top .swiper-slide.swiper-slide-active').index()),
			(width = parseInt($('#gallery-top .swiper-slide').eq(0).outerWidth() || 0)),
			(marginRight = parseInt($('#gallery-top .swiper-slide').eq(0).css('marginRight') || 1))
		if (!!skuImg) {
			$('#gallery-top .img_box').addClass('hide')
			$('#gallery-top .img_box[data-skuid="' + skuid + '"]')
				.removeClass('hide')
				.css('left', index * (width + marginRight))
				.find('.childDom')
				.attr({ src: skuImg, rel: skuImg })
			$('#gallery-thumbs .swiper-slide.swiper-slide-thumb-active').addClass('no_border')
		}
	}
}

//批发计算价格
function countWholePrice(number, wholeData) {
	if (wholeData.length) {
		let $discount = '',
			$num = 'null'
		for (let d = 0; d < wholeData.length; d++) {
			if (
				d == wholeData.length - 1 &&
				((number >= wholeData[d].startCount &&
					Object.prototype.toString.call(wholeData[d].endCount).slice(8, -1) != 'Null' &&
					number <= wholeData[d].endCount) ||
					(number >= wholeData[d].startCount &&
						(Object.prototype.toString.call(wholeData[d].endCount).slice(8, -1) == 'Null' ||
							!wholeData[d].endCount ||
							wholeData[d].endCount == '')))
			) {
				$discount = wholeData[d].discount
				$num = d
			} else {
				if (number >= wholeData[d].startCount && number <= wholeData[d].endCount) {
					$discount = wholeData[d].discount
					$num = d
				}
			}
		}
		if ($num != 'null') {
			$('.wholesaleTable tbody')
				.find('tr')
				.eq($num + 1)
				.addClass('active')
				.siblings('tr')
				.removeClass('active')
		} else {
			if ($('.wholesaleTable tbody').find('tr.active')) {
				$('.wholesaleTable tbody').find('tr.active').removeClass('active')
			}
		}
	}
}

//时间戳+四位随机数产生文件名
function randomImgName() {
	var charactors = '1234567890'
	var value = '',
		i
	for (j = 1; j <= 4; j++) {
		i = parseInt(10 * Math.random())
		value = value + charactors.charAt(i)
	}
	var name = new Date().getTime() + value
	return name
}

function createOssClient() {
	return new Promise((resolve, reject) => {
		var client = new OSS({
			// region: 'oss-cn-hangzhou',
			region: getEnvirVal() == 'shopvango' ? 'oss-cn-hangzhou' : 'oss-accelerate',
			accessKeyId: 'Jy6PO9aZI82pJzYh',
			accessKeySecret: 'pqhJx2AJineLcJpguU1SPImdB7ZLuv',
			// bucket: 'vshoptest'
			bucket: getEnvirVal() == 'shopvango' ? 'vshoptest' : 'vshop001',
		})
		resolve(client)
	})
}

/* 获取环境标识 */
function getEnvirVal() {
	let preUrl = $.url.setUrl(window.location.url).attr('host')
	if (preUrl.split('.').length - 1 >= 2) {
		//判断.出现次数 >=2
		let url = preUrl.split('.')
		return url[url.length - 2]
	} else if (preUrl.split('.').length - 1 == 1) {
		return preUrl.split('.')[0]
	} else {
		return ''
	}
}

// 数量input变化事件
$('.product-info__qty .product-info__qty_num').keyup(function () {
	let qty_num = parseInt($(this).val())
	if (qty_num > 999) {
		qty_num = 999
	}
	if (!qty_num || qty_num < 1) {
		qty_num = 1
	}
	$(this).val(qty_num)
	if (!!window.ROWS.wholesaleList) {
		countWholePrice(qty_num, window.ROWS.wholesaleList)
	}
	if (window.ROWS.speType != 2) {
		computeStaticPrice()
	} else {
		//计算总价格
		baseCustomization()
	}
})

//数量减法事件
$('.product-info__qty .product-info__qty_decr').on('click', function (event) {
	event.stopPropagation()
	const $qty_num = $(this).parents('.product-info__qty').find('.product-info__qty_num')
	let qty_num = parseInt($qty_num.val())
	if (qty_num > 1) {
		qty_num--
		$qty_num.val(qty_num)
	}
	if (!!window.ROWS.wholesaleList) {
		countWholePrice(qty_num, window.ROWS.wholesaleList)
	}
	if (window.ROWS.speType != 2) {
		computeStaticPrice()
	} else {
		//计算总价格
		baseCustomization()
	}
})
//数量加法事件
$('.product-info__qty .product-info__qty_incr').on('click', function (event) {
	event.stopPropagation()
	const $qty_num = $(this).parents('.product-info__qty').find('.product-info__qty_num')
	let qty_num = parseInt($qty_num.val())
	qty_num++
	if (qty_num > 999) qty_num = 999
	$qty_num.val(qty_num)
	if (!!window.ROWS.wholesaleList) {
		countWholePrice(qty_num, window.ROWS.wholesaleList)
	}
	if (window.ROWS.speType != 2) {
		computeStaticPrice()
	} else {
		//计算总价格
		baseCustomization()
	}
})

// 批发html方法
function wholesaleHtml(defaultPrice) {
	$('.wholesaleTable tr').each(function (index, el) {
		if (index > 0) {
			let wdiscount = Number($(el).attr('data-discount'))
			console.log(DATA.getPrice(defaultPrice * (wdiscount / 10)), defaultPrice, wdiscount)
			$(el)
				.find('td[w-rate]')
				.html(Math.round(1000 - wdiscount * 100) / 10 + '% ' + 'OFF')
			$(el)
				.find('td[w-price]')
				.html(DATA.getPrice(defaultPrice * (wdiscount / 10)))
		}
	})
}

//批发计算价格
function wholesaleCount(defaultPrice, discount) {
	const { $defaultPrice, $originalPrice, $discount } = DATA
	$('.wholesaleTable tr').each(function (index, el) {
		if (index > 0) {
			let wdiscount = Number($(el).attr('data-discount'))
			$(el)
				.find('td[w-rate]')
				.html(Math.round(1000 - wdiscount * 100) / 10 + '% ' + 'OFF')
			$(el)
				.find('td[w-price]')
				.html(DATA.getPrice(defaultPrice * (wdiscount / 10)))
		}
	})
	if ($('.wholesaleTable tr').hasClass('active')) {
		if (discount != 10) {
			$originalPrice.html(DATA.getPrice(defaultPrice)).removeClass('hide')
			$discount.find('.product-info__header_discount_num').html(parseFloat((10 - discount).toFixed(10)) * 10 || 1)
			$discount.removeClass('hide')
		} else {
			$originalPrice.addClass('hide')
			$discount.addClass('hide')
		}
		$defaultPrice.html(DATA.getPrice(defaultPrice * (discount / 10))).removeClass('hide')
		$defaultPrice.attr('US-price', Math.round(defaultPrice * (discount / 10) * 100) / 100)
	} else {
		if (discount && discount != '' && Number(discount) != 10 && Object.prototype.toString.call(discount).slice(8, -1) != 'Null') {
			if (contrastTime(true, end, start)) {
				$discount.removeClass('hide')
				$originalPrice.removeClass('hide')
			} else {
				$discount.addClass('hide')
				$originalPrice.addClass('hide')
			}
		} else {
			$discount.addClass('hide')
			$originalPrice.addClass('hide')
		}
	}
}

//填写商品评论
$('.product-reviews--header__write-btn-container,#product-reviews-write-btn').click(function () {
	$('#product-write-review').addClass('active')
})

// 加购和快速购买
$('.add-to-cart,.buy-it-now').click(function () {
	//多规格
	if (window.ROWS.speType == '0' || window.ROWS.speType == '1') {
		if (window.ROWS.speType == 1 && window.ROWS.speList.length != $('#mlpSpe .mlpSpe-item.active').length) {
			$('#mlpSpe ul').each(function (index, el) {
				//未选提示文字
				const $errorTip = $(el).closest('.product-info__variants_items').find('.error')
				if (!$(el).find('.mlpSpe-item.active').length) {
					$errorTip.removeClass('hide')
				} else {
					$errorTip.addClass('hide')
				}
			})
			proNoSelectAttr()
		} else {
			let madeStaticType = window.ROWS.speType,
				madeStaticProduct = {
					skuId: DATA.skuId,
					quantity: $('#product_quantity_btn').val(),
				},
				madeStaticisShowCart = false

			if ($(this).attr('operation') === 'toCart') {
				//组装数据加入购物车
				madeStaticisShowCart = true
			}
			addToCart(madeStaticType, madeStaticProduct, madeStaticisShowCart)
		}
	} else {
		if (checkRules()) {
			const customVal = []
			let madeStaticType = 2,
				madeStaticProduct = {
					skuId: window.ROWS.skuList[0].id,
					quantity: $('#product_quantity_btn').val(),
					customVal,
				}

			//组装定制类商品属性字段
			$('#customization>.product-info__variants_items:not(.hide)').each(function (index, element) {
				var type = $(element).attr('data-type'),
					name = $(element).attr('param-name'),
					ID = $(element).attr('param-id')
				const attrObj = getDomVal(type, element, name, ID)
				$(element)
					.find('.child-custList__option .product-info__variants_items:not(.hide)')
					.each((i, v) => {
						attrObj.childList = []
						if (!$(v).hasClass('hide')) {
							var childType = $(v).attr('data-type'),
								childName = $(v).attr('param-name'),
								cId = $(v).attr('param-id')
							attrObj.childList.push(getDomVal(childType, v, childName, cId))
						}
					})
				customVal.push(attrObj)
			})
			if ($(this).attr('operation') === 'toCart') {
				//组装数据加入购物车
				var madeStaticisShowCart = true
			} else {
				//组装数据跳转到付款页面
				var madeStaticisShowCart = false
			}
			addToCart(madeStaticType, madeStaticProduct, madeStaticisShowCart)
		} else {
			proNoSelectAttr()
		}
	}
})
//定制化组装数据
function getDomVal($type, $element, $name, $parentId) {
	var returnData = {}
	returnData.type = $type
	returnData.name = $name
	returnData.parentId = $parentId || ''
	const $child_custList = $($element).children('ul')
	if ($type == 1) {
		if ($($element).attr('data-pattern') != '1') {
			returnData.price = $child_custList.find('.customization-item.active').attr('param-price')
			returnData.value = $child_custList.find('.customization-item.active').text().trim()
		} else {
			returnData.price = $($element).children('.product-info__variants_select').find('.customization-item.active').attr('param-price')
			returnData.value = $($element).children('.product-info__variants_select').find('.customization-item.active span.hide').text().trim()
			console.log(returnData)
		}
	} else if ($type == 2) {
		returnData.price = $child_custList.find('.customization-item.active').attr('param-price')
		returnData.value = $child_custList.find('.customization-item.active > img').attr('src')
	} else if ($type == 3) {
		returnData.price = $child_custList.find('input').attr('param-price')
		returnData.value = $child_custList.find('input').val()
	} else {
		returnData.price = $child_custList.find('.uploadImgBtn').attr('param-price')
		returnData.value = $child_custList.find('.uploadImg').attr('src')
	}

	return returnData
}

//定制化效验规则
function checkRules() {
	$('#customization .product-info__variants_items:not(.hide)').each((_, element) => {
		switch ($(element).attr('data-type')) {
			case '3':
				if (!$(element).find('.a_input').val() && $(element).find('.a_input').attr('param-required') == 1) {
					$(element).find('.error').removeClass('hide')
				}
				break
			case '4':
				if ($(element).find('li').length < 1 && $(element).find('.uploadImgBtn').attr('param-required') == 1) {
					$(element).find('.error').removeClass('hide')
				}
				break
		}
	})
	if ($('#customization .product-info__variants_items:not(.hide)').length) {
		return !$('#customization .product-info__variants_items:not(.hide)').find(".error:not('.hide')").length
	}
}

// 回到当前未选择选项
function proNoSelectAttr() {
	let $scrTop = 0
	const $errFirstHtml = $('.product-info__body').find(".error:not('.hide'):first")
	$errFirstHtml.addClass('shake')
	if ($errFirstHtml.length) {
		$scrTop = $errFirstHtml.offset().top - 250
	}
	$('html,body').animate(
		{
			scrollTop: $scrTop,
		},
		500,
		function () {
			setTimeout(function () {
				$errFirstHtml.removeClass('shake')
			}, 650)
		}
	)
	//
}

// 加入购物车
function addToCart($type, $product, $isShowCart) {
	console.log($type, $product, $isShowCart,'-----------------');
	let sendData = {}
	sendData.skuId = DATA.skuId
	sendData.quantity = parseFloat($product.quantity)
	sendData.goodsVersion = $('.product-info__title').attr('data-goodsVersion')
	sendData.goodsId = Number($('.product-info__title').attr('data-id'))
	sendData.speType = window.ROWS.speType
	if ($type == 2) {
		sendData.customVal = $product.customVal
	}
	setStorage('getVustomVal', JSON.stringify(sendData))

	// 加购发送数据
	let productData = [],
		cartList = {}
	cartList.spuId = parseInt($('.product-info__title').attr('data-id')) || ''
	cartList.spu = $('.product-info__title').text().trim() || ''
	cartList.quantity = parseInt($('#product_quantity_btn').val()) || ''
	cartList.spuPrice = Number($('.product-info__header_price').attr('base-price'))
	cartList.sku = DATA.skuId
	cartList.skuPrice = Number($('.product-info__header_compare-at-price').attr('us-price')) || ''
	cartList.spuImg = $('.product-info__title').attr('data-mainimg') || ''
	productData.push(cartList)
	sendAnalyze('cart', {}, productData)
	//facebook埋点
	if (!!window.shopInfo.facebookId) {
		const eventID = getRandomString(5)
		fbq('track', 'AddToCart', { eventID })

		// facebook api数据转化
		const custom_data = {
			value: Number($('.product-info__header_compare-at-price').text().substr(1)),
			currency: DATA.currentRate.currency,
			content_ids: parseFloat($product.skuId),
			content_type: 'product',
		}
		var datalist = facebookApiParam(custom_data, 'AddToCart', eventID)
		facebookApi(window.shopInfo.facebookId, datalist)
	}
	//ga 像素埋点
	if (!!window.shopInfo.googleId) {
		ga('ec:addProduct', {
			id: parseInt($('.product-info__title').attr('data-id')) || '',
			name: $('.product-info__title').text().trim() || '',
			price: Number($('.product-info__header_price').attr('base-price')),
			quantity: parseInt($('#product_quantity_btn').val()) || '',
		})
		ga('ec:setAction', 'add')
		ga('send', 'event', 'add_to_cart', 'click', 'add to cart')
	}
	// tiktok像素埋点
	if (!!window.shopInfo.Tiktok) {
		ttq.track('AddToCart', {
			content_id: parseInt($('.product-info__title').attr('data-id')) || '',
			content_type: 'product',
			content_name: $('.product-info__title').text().trim() || '',
			quantity: parseInt($('#product_quantity_btn').val()) || '',
			price: Number($('.product-info__header_compare-at-price').attr('us-price')),
			value: Number(($('.product-info__header_compare-at-price').attr('us-price') * 100 * parseInt($('#product_quantity_btn').val())) / 100),
			currency: 'USD',
		})
	}
	// pinterest 埋点数据 ~~~~~Start~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	var pinterestSetData = {
		pinterestYOUR_TAG_ID: '',
		pinterestEventType: 'AddToCart',
		pinterestData: {
			value: Number($('.product-info__header_compare-at-price').attr('us-price')),
			order_quantity: parseInt($('#product_quantity_btn').val()) || '',
			currency: $('.header .currencyActive-name').text() || 'USD',
		},
	}
	pinterestFn(pinterestSetData)
	// pinterest 埋点数据 ~~~~~End~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	if (!$isShowCart) {
		window.location.href = './information.html?saveType=3'
		return false
	}

	getToken(function () {
		$.req({
			url: '/api/v1/cart/cart',
			type: 'post',
			contentType: 'application/json;charset=UTF-8',
			data: JSON.stringify(sendData),
			success(res) {
				if (res.code == 0) {
					// 打开购物车
					$('.cart-modal--event').show()
					getCartInfo()
				} else if (res.code == 20016) {
					$.alert('danger', window.product_detail_i18n.refresh_tip)
				} else if (res.code == 20015) {
					$.alert('danger', window.product_detail_i18n.select_other_products_tip)
				} else if (res.code == 20020) {
					$.alert('danger', res.msg)
				}
			},
		})
	})
}

/*
多规格商品sku匹配
*/
function standard(data) {
	//获得对象的key
	function getObjKeys(obj) {
		if (obj !== Object(obj)) throw new TypeError('Invalid object')
		var keys = []
		obj.forEach((item) => {
			keys[keys.length] = item.skuvalIds
		})
		return keys
	}

	//把组合的key放入结果集DATA.SKUResult
	function add2SKUResult(combArrItem, sku) {
		var key = combArrItem.join(';')
		const SKUCurrent = DATA.SKUResult.find((item) => {
			return key == item.ids
		})
		if (typeof SKUCurrent != 'undefined') {
			//SKU信息key属性
			SKUCurrent.val.price = sku.price
			SKUCurrent.val.originalPrice = sku.originalPrice
		} else {
			const SKUResultItem = {
				ids: key,
				val: {
					price: sku.price,
					originalPrice: sku.originalPrice,
				},
			}
			DATA.SKUResult.push(SKUResultItem)
		}
	}

	//初始化得到结果集
	function initSKU() {
		let skuList = data.skuList
		var i,
			j,
			skuKeys = getObjKeys(skuList)
		for (i = 0; i < skuKeys.length; i++) {
			var skuKey = skuKeys[i] //一条SKU信息key
			var sku = skuList[i] //一条SKU信息value
			var skuKeyAttrs = skuKey.split('||') //SKU信息key属性值数组
			skuKeyAttrs.sort(function (value1, value2) {
				return parseInt(value1) - parseInt(value2)
			})
			//对每个SKU信息key属性值进行拆分组合
			var combArr = combInArray(skuKeyAttrs)
			for (j = 0; j < combArr.length; j++) {
				add2SKUResult(combArr[j], sku)
			}
			//结果集接放入DATA.SKUResult
			const SKUResultItem = {
				ids: skuKeyAttrs.join(';'),
				val: {
					price: sku.price,
					originalPrice: sku.originalPrice,
				},
			}
			DATA.SKUResult.push(SKUResultItem)
		}
	}

	/**
	 * 从数组中生成指定长度的组合
	 * 方法: 先生成[0,1...]形式的数组, 然后根据0,1从原数组取元素，得到组合数组
	 */
	function combInArray(aData) {
		if (!aData || !aData.length) {
			return []
		}
		var len = aData.length
		var aResult = []
		for (var n = 1; n < len; n++) {
			var aaFlags = getCombFlags(len, n)
			while (aaFlags.length) {
				var aFlag = aaFlags.shift()
				var aComb = []
				for (var i = 0; i < len; i++) {
					aFlag[i] && aComb.push(aData[i])
				}
				aResult.push(aComb)
			}
		}
		return aResult
	}

	/**
	 * 得到从 m 元素中取 n 元素的所有组合
	 * 结果为[0,1...]形式的数组, 1表示选中，0表示不选
	 */
	function getCombFlags(m, n) {
		if (!n || n < 1) {
			return []
		}
		var aResult = []
		var aFlag = []
		var bNext = true
		var i, j, iCnt1

		for (i = 0; i < m; i++) {
			aFlag[i] = i < n ? 1 : 0
		}
		aResult.push(aFlag.concat())
		while (bNext) {
			iCnt1 = 0
			for (i = 0; i < m - 1; i++) {
				if (aFlag[i] == 1 && aFlag[i + 1] == 0) {
					for (j = 0; j < i; j++) {
						aFlag[j] = j < iCnt1 ? 1 : 0
					}
					aFlag[i] = 0
					aFlag[i + 1] = 1
					var aTmp = aFlag.concat()
					aResult.push(aTmp)
					if (aTmp.slice(-n).join('').indexOf('0') == -1) {
						bNext = false
					}
					break
				}
				aFlag[i] == 1 && iCnt1++
			}
		}
		return aResult
	}
	initSKU()
}
$('#mlpSpe .product-info__variants_items').each((index, item) => {
	if ($(item).find('.mlpSpe-item').length) {
		$(item)
			.find('.mlpSpe-item')
			.each((index, c_item) => {
				let optionalidsArr = $(c_item).attr('data-selfid')
				const isSkuSave = DATA.SKUResult.some((item) => {
					return item.ids == optionalidsArr
				})
				if (!isSkuSave) {
					$(c_item).addClass('is_hide')
				} else {
					$(c_item).removeClass('is_hide')
				}
			})
	}
})
function mlpspe($this) {
	let selectedIds = []
	$('.mlpSpe-item.active').each((index, item) => {
		let optionalidsArr = $(item).attr('data-selfid')
		selectedIds.push(optionalidsArr)
	})
	$('#mlpSpe .product-info__variants_items').each((index, item) => {
		if ($(item).find('.mlpSpe-item').length) {
			$('#mlpSpe .mlpSpe-item')
				.not($this)
				.each((i, v) => {
					mlpsku($(v), selectedIds, false)
				})
		}
	})
}
function mlpsku($item, $selectedIds) {
	let selectedIdsArr = []
	const $selected = $item.parent().find('.mlpSpe-item.active') // 勾选的规格
	if (!!$selected.html()) {
		var siblingsSelectedObjId = $selected.attr('data-selfid') //勾选的id
		for (var i = 0; i < $selectedIds.length; i++) {
			// 不存在添加
			$selectedIds[i] != siblingsSelectedObjId && selectedIdsArr.push($selectedIds[i])
		}
	} else {
		selectedIdsArr = $selectedIds.concat()
	}
	selectedIdsArr = selectedIdsArr.concat($item.attr('data-selfid'))
	selectedIdsArr.sort(function (value1, value2) {
		return parseInt(value1) - parseInt(value2)
	})
	const isSkuSave = DATA.SKUResult.some((item) => {
		return item.ids == selectedIdsArr.join(';')
	})
	if (!isSkuSave) {
		console.log('全部匹配=》', selectedIdsArr.join(';'), $selectedIds)
		console.log('失败=》', $item.text())
		$item.addClass('is_hide')
	} else {
		$item.removeClass('is_hide')
	}
}
//初始化选中
function chooseDefault() {
	$('.product-info__body .product-info__variants_items').each((index, item) => {
		const $ul = $(item).find('ul')
		if (($ul.length && !$ul.find('li.active').length) || !$(item).find('.select-input').val()) {
			$ul.find('li:not(.is_hide)').eq(0).click()
		}
	})
}

chooseDefault()

// //放大效果
$('#gallery-top .swiper-wrapper').lightGallery({
	thumbWidth: 64,
	thumbContHeight: 84,
	closable: false,
	fullScreen: false,
	download: false,
	hash: false,
	appendSubHtmlTo: '.lg-sub-html',
	subHtmlSelectorRelative: true,
})

// 点击视频播放按钮
$('.videoType').on('click', '.childBtn', function () {
	let video = $(this).parents('.videoType').attr('video')
	let cover = $(this).parents('.videoType').attr('cover')
	if (!!video) {
		playVideo(video, true, cover)
	}
})

function playVideo($url, isPlay, coverUrl) {
	let { myPlayer } = DATA
	if (myPlayer) {
		$('.picFocus  #my-video').empty().remove()
		$('.picFocus  .play_box').addClass('hide')
		myPlayer.dispose() //销毁
		myPlayer = null
	}
	$('.picFocus .play_box').removeClass('hide').html($('<div id="my-video"></div>'))
	myPlayer = new Aliplayer(
		{
			id: 'my-video',
			source: $url,
			cover: coverUrl,
			width: '100%',
			height: '100%',
			autoplay: true,
			isLive: false,
			playsinline: true,
			showBarTime: 2000,
			controlBarVisibility: 'click',
			useH5Prism: true,
			useFlashPrism: false,
			x5_video_position: 'normal',
			x5_type: 'h5',
			skinLayout: [
				// false | Array, 播放器使用的ui组件，非必填，不传使用默认，传false或[]整体隐藏
				{
					name: 'bigPlayButton',
					align: 'blabs',
					x: 30,
					y: 80,
				},
				{
					name: 'H5Loading',
					align: 'cc',
				},
				{
					name: 'errorDisplay',
					align: 'tlabs',
					x: 0,
					y: 0,
				},
				// {name: "snapshot", align: "trabs", x: 10, y: "50%"},
				{
					name: 'infoDisplay',
					align: 'cc',
				},
				{
					name: 'controlBar',
					align: 'blabs',
					x: 0,
					y: 0,
					children: [
						{
							name: 'progress',
							align: 'blabs',
							x: 0,
							y: 44,
						},
						{
							name: 'playButton',
							align: 'tl',
							x: 15,
							y: 12,
						},
						{
							name: 'timeDisplay',
							align: 'tl',
							x: 10,
							y: 7,
						},
						{
							name: 'fullScreenButton',
							align: 'tr',
							x: 10,
							y: 10,
						},
						//{name: "snapshot", align: "tr", x: 10, y: 10},
						{
							name: 'volume',
							align: 'tr',
							x: 10,
							y: 10,
						},
						{
							name: 'streamButton',
							align: 'tr',
							x: 0,
							y: 10,
						},
						{
							name: 'speedButton',
							align: 'tr',
							x: 0,
							y: 10,
						},
						{
							name: 'captionButton',
							align: 'tr',
							x: 0,
							y: 10,
						},
						{
							name: 'trackButton',
							align: 'tr',
							x: 0,
							y: 10,
						},
					],
				},
			],
		},
		function (player) {
			player.on('ready', function (e) {
				if (isPlay) {
					player.play()
				} else {
					player.pause()
				}
			})
			var _video = document.querySelector('video')
			$('.prism-cover').on('click', function (event) {
				event.stopPropagation()
				player.play()
			})

			player.on('play', function (e) {
				_video.removeEventListener('click', play)
				_video.addEventListener('click', pause)
			})
			player.on('pause', function (e) {
				_video.removeEventListener('click', pause)
				_video.addEventListener('click', play)
			})

			function play() {
				if (player) player.play()
			}

			function pause() {
				if (player) player.pause()
			}
		}
	)
}

$('.product-info__header_coupon_wrap .couponItem').each(function (index, el) {
	let start = $(el).attr('data-start'),
		end = $(el).attr('data-end')
	// if (!contrastTime(true, end, start)) {
	// 	$(el).remove();
	// }
})

//领取优惠券
$(document).on(
	'click',
	'.product-info__header_coupon_wrap .couponItem',
	$.debounce(function (event) {
		event.stopPropagation()
		let $couponId = $(this).attr('data-id')
		getToken(function () {
			$.req({
				url: '/api/v1/goods/coupon',
				type: 'get',
				data: {
					couponId: $couponId,
				},
				success(res) {
					if (res.code === 0) {
						$.alert('success', window.product_detail_i18n.Successfully)
					} else {
						$.alert('danger', res.msg)
					}
				},
			})
		})
	}, 500)
)

$('.currency-extend li,.currency-select .currency-list').click(function () {
	location.reload()
})
