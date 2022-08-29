// 购物车全局变量
const data = {
	// 当前税率
	currentRate: JSON.parse(getStorage('currentRate')),
	queryCartParam: {}, // 购物车数据传参
	cartDataList: {}, //购物车最终数据
	datalist: {}, //购物车接口初步数据
}
//查询购物车
var totalRate = JSON.parse(getStorage('currentRate'))
if (getStorage('history_list')) {
	history_list = JSON.parse(getStorage('history_list'))
	history_list.forEach((item) => {
		$('.history_list').append(`<span data-exclude='${item.addFoldUp}'>${item.code}</span>`)
	})
}

/**
 *更新购物车左上角数据
 */
function cartNum(cartDataList) {
	if ($.getParam('isIframe') != 1) { // 预览页面不显示购物车数量
		$('.home-bag--event i').html(cartDataList.goodsCount > 99 ? '99+' : cartDataList.goodsCount)
	}
	const default_shipping = {
		shippingId: '',
		shippingMoney: '',
	}
	const { shippingId, shippingMoney } = JSON.parse(sessionStorage.getItem('shipping')) || default_shipping
	if(!cartDataList.useDiscount) cartDataList.useDiscount ={}
	let checkedData = {
		couponCheckedId: cartDataList.useDiscount.activityId || null,
		discountId: cartDataList.useDiscount.couponId || cartDataList.useDiscount.couponCode,
		shippingId: shippingId,
		totalBill: cartDataList.productPrice,
		totalDiscount: cartDataList.dicountTotal,
		totalNumer: cartDataList.goodsCount,
		totalPrice: cartDataList.afterDicountTotal,
		totalShipping: shippingMoney,
	}
	setStorage('checkedData', JSON.stringify(checkedData))
}
function getCartInfo(queryCartParam) {
	// 加载paypal
	const { payMethod } = CONFIGDATA
	if (!!payMethod && payMethod.paypal) {
		paypalBase(payMethod)
	}
	getToken(function () {
		$.req({
			url: '/api/v1/cart/cart/info',
			type: 'get',
			contentType: 'application/json;charset=UTF-8',
			success(res) {
				if (res.code == 0) {
					data.datalist = res.data
					data.cartDataList = calculate(queryCartParam, data.datalist).data
					console.log('购物车数据 ==》', data.cartDataList)
					// 购物车列表
					renderCartTpl(data.cartDataList)
					//购物车优惠券
					renderCouponTpl(data.cartDataList)
					//费用明细
					renderTotalTpl(data.cartDataList, data.currentRate)
					// 更新购物车数量数据
					cartNum(data.cartDataList)
					// 判断全场活动
					isEffectiveSave()
				} else {
					$.alert('danger', res.msg)
				}
			},
		})
	})
}

// 全场活动
renderPromotion(data.queryCartParam)
// 计算单行总价
function cellTotal(price, quantity) {
	var star = Math.round(price * 100 * quantity) / 100
	return data.currentRate.symbol + ' ' + star
}

// 购物车加减按钮
$(document).on('click', '.quantity-selector__button', function () {
	const $cart_quantity = $(this).siblings('.quantity-selector__value')
	let cart_quantity_val = parseInt($cart_quantity.val())
	const attr_btn = $(this).attr('data-action')
	if (attr_btn == 'increase-quantity') {
		//购物车增加
		// 如果数量为999,则数量不增
		if (cart_quantity_val > 998) {
			$cart_quantity.val('999')
		} else {
			cart_quantity_val++
			$cart_quantity.val(cart_quantity_val)
			valueChange($cart_quantity, false, data)
		}
	} else if (attr_btn == 'decrease-quantity') {
		//购物车减少
		const $cart_quantity = $(this).siblings('.quantity-selector__value')
		let cart_quantity_val = $cart_quantity.val()
		// 如果数量为999,则数量不增
		if (cart_quantity_val < 2) {
			$cart_quantity.closest('li').remove()
			valueChange($cart_quantity, true, data)
		} else {
			cart_quantity_val--
			$cart_quantity.val(cart_quantity_val)
			valueChange($cart_quantity, false, data)
		}
	}
})

//修改购物车数量
$(document).on('change', '.quantity-selector__value', function () {
	let cart_quantity_val = $(this).val()
	if (!isInteger(cart_quantity_val) || parseInt(cart_quantity_val) === 0) {
		$(this).val('1')
	} else if (parseInt(cart_quantity_val) > 999) {
		$(this).val('999')
	}
	valueChange($(this), false, data)
})
// 判断是否为正整数
function isInteger(obj) {
	return Math.abs(parseInt(obj, 10)) == obj
}
//删除购物车列表
$(document).on('click', '#goods-container li .cart-del', function () {
	$(this).closest('li').remove()
	valueChange($(this), true, data)
})

// 数量发生变化时 发生的事件
function valueChange(item, isDel, data) {
	const { cartList } = data.datalist
	let dataId = item.attr('data-line-id')
	const goodsId = item.closest('li').attr('data-goodsId'),
		goodsVersion = item.closest('li').attr('data-goodsVersion'),
		speType = item.closest('li').attr('data-speType')
	// 更新购物车参数
	let updata = {
		skuId: parseInt(dataId),
		quantity: isDel ? 0 : parseInt(item.val()),
		customVal: '',
		goodsId,
		goodsVersion,
		speType,
	}
	console.log('updata', updata)
	cartList.forEach((element, index) => {
		if (element.skuId === parseInt(dataId) && item.closest('li').attr('data-customVal') === $.base64.encode(element.customVal)) {
			updata.customVal = element.customVal
			if (updata.quantity <= 0) {
				cartList.splice(index, 1)
			} else {
				element.quantity = updata.quantity
			}
		}
	})
	// 更新购物车接口
	updateCart(updata, item.closest('li'))
}

// 更新购物车
function updateCart(param, $_this) {
	let { queryCartParam, datalist, cartDataList, currentRate } = data
	getToken(function () {
		$.req({
			url: '/api/v1/cart/cart',
			type: 'PUT',
			data: JSON.stringify(param),
			dataType: 'json',
			contentType: 'application/json',
			success(res) {
				if (res.code == 0) {
					data.cartDataList = cartDataList = calculate(queryCartParam, datalist).data
					const goodsId = $_this.attr('data-goodsid')
					if (!cartDataList.goodsList.length && !cartDataList.invalidGoodsList.length) {
						$('.cart-empty-default--event').show()
						$('.list-container--event').hide()
					}
					//更新购物车左上角数据
					cartNum(cartDataList)

					const eventID = getRandomString(5)
					if (!!window.shopInfo.facebookId) {
						fbq('track', 'AddToCart', { eventID });
						// facebook api数据转化
						const custom_data = {
							"value": Number($_this.closest('li').find('.cart-price--discountPrice').text().substr(1)),
							"currency": data.currentRate.currency,
							"content_ids": $_this.closest('li').attr('data-goodsid'),
							"content_type": "product"
						}
						var dataList = facebookApiParam(custom_data, 'AddToCart', eventID)
						const facebookIdArr = window.shopInfo.facebookId.split(',')
						facebookIdArr.forEach(item => {
							facebookApi(item, dataList)
						})
					}
					// tiktok像素埋点
					if (!!window.shopInfo.Tiktok) {
						ttq.track('AddToCart', {
							content_id: $_this.closest('li').attr('data-goodsid'),
							content_type: 'product',
							content_name: $_this.closest('li').attr('data-skuname'),
							quantity: 1,
							price: Number($_this.closest('li').find('.cart-price--discountPrice').attr('data-money')),
							value: Number($_this.closest('li').find('.cart-price--discountPrice').attr('data-money')),
							currency: 'USD',
						})
					}

					//ga 像素埋点
					if (!!window.shopInfo.googleId) {
						ga('ec:addProduct', {
							'id': $_this.closest('li').attr('data-goodsid'),
							'name': $_this.closest('li').find('.cart_product--name p').text(),
							'price': Number($_this.closest('li').find('.cart-price--discountPrice').attr('data-money')),
							'quantity': 1
						});
						ga('ec:setAction', 'add');
						ga('send', 'event', 'add_to_cart', 'click', 'add to cart');
					}
					// pinterest 埋点数据 ~~~~~Start~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
					var pinterestSetData = {
						pinterestYOUR_TAG_ID: '',
						pinterestEventType: 'AddToCart',
						pinterestData: {
							value: $_this.parent('.quantity-selector').siblings('.cart-price--discountPrice').data('money') || 0,
							order_quantity: 1,
						}
					}
					pinterestFn(pinterestSetData)
					// pinterest 埋点数据 ~~~~~End~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
					//商品为批发状态
					if ($_this.attr('data-wholesale') == 1) {
						cartDataList.goodsList.forEach((item) => {
							let $item = ''
							if (goodsId == item.goodsId) {
								if (item.speType == 2) {
									$item = $("#goods-container [data-customval='" + $.base64.encode(item.customVal) + "']")
								} else {
									$item = $("#goods-container li[data-sku='" + item.skuId + "']")
								}
								console.log($item.attr('data-customval'))
								if (item.discount != 10) {
									//有则扣 显示则扣
									if ($item.find('.cart-price span').length == 1) {
										$item
											.find('.cart-price--discountPrice')
											.before(`<span class="cart-price--compare" data-money="${item.sellingPrice}">${getMoney(item.sellingPrice)}</span>`)
									} else {
										$item.find('.cart-price--compare').attr('data-money', item.sellingPrice).html(getMoney(item.sellingPrice))
									}
									const money = Math.round((getMoneyrate(item.sellingPrice) - getMoneyrate(item.discountPrice)) * item.quantity * 100) / 100
									$item.find('.cart-price p').addClass('show')
									$item.find('.cart-price p .discountPrice').html(currentRate.symbol + money)
								} else {
									// 无折扣
									if ($item.find('.cart-price span').length == 2) {
										$item.find('.cart-price--compare').remove()
									}
									if (item.sellingPrice > item.discountPrice) {
										$item
											.find('.cart-price--discountPrice')
											.before(`<span class="cart-price--compare" data-money="${item.sellingPrice}">${getMoney(item.sellingPrice)}</span>`)
									}
									$item.find('.cart-price p').removeClass('show')
								}
								console.log(item.afterDicountPrice, $item.attr('data-customval'))
								$item.find('.cart-total--price span').text(getMoney(item.afterDicountPrice))
								$item.find('.cart-price--discountPrice').attr('data-money', item.discountPrice).html(getMoney(item.discountPrice))
							}
							$_this.find('.cart-off i').text(parseFloat(Math.floor(100 - (Number(item.discountPrice) / Number(item.sellingPrice)) * 100)) || 1)
						})
					} else {
						const goodsListItem = cartDataList.goodsList.find((item) => {
							return goodsId == item.goodsId
						})
						if (typeof goodsListItem != 'undefined') {
							$_this.find('.cart-total--price span').text(getMoney(goodsListItem.afterDicountPrice))
						}
					}
					//购物车优惠券
					renderCouponTpl(cartDataList)
					//费用明细
					renderTotalTpl(cartDataList, currentRate)
					if (queryCartParam.hasOwnProperty('couponCode') && !cartDataList.useDiscount.hasOwnProperty('couponCodeId')) {
						$('.history_list span').removeClass('active')
						$('#discount_code--input').val('')
						delete queryCartParam.couponCode
					}
					//判断全场活动
					isEffectiveSave()
				} else if (res.code == 20016) {
					$.alert('danger', window.i18n.refresh_tip)
				} else if (res.code == 20015) {
					$.alert('danger', window.i18n.removed_tip)
				} else if (res.code == 20020) {
					$.alert('danger', res.msg)
				}
			},
		})
	})
}
// 判断全场活动
function isEffectiveSave() {
	let promotionList = CONFIGDATA.activities.find((item) => {
		return contrastTime(true, item.end, item.start) && item.status == 1
	})
	isEffectiveFun(data.cartDataList, promotionList) ? $('.promotion-discount--event').show() : $('.promotion-discount--event').hide()
}

//对价格进行汇率转化
function showMoney($id) {
	$($id + ' [data-money]').each(function (index, item) {
		let $price = Number($(item).attr('data-money'))
		$(item).html(getMoney($price))
	})
}

//选中优惠券
$('.coupon-list-content--event').on('click', '.coupon-list--event:not(.op)', function () {
	const { cartDataList, queryCartParam } = data
	const { useDiscount } = cartDataList

	$(this).addClass('active').siblings('.cart-discount-list--event').removeClass('active')
	$(this).find('.coupon-list-icon--event').toggleClass('icon-unchecked').toggleClass('icon-checked')
	$(this).siblings().find('.coupon-list-icon--event').removeClass('icon-checked').addClass('icon-unchecked')

	let $id = parseFloat($(this).attr('data-discount-id'))
	if (useDiscount.hasOwnProperty('couponId') && $id == useDiscount.couponId) {
		delete queryCartParam.couponId
	} else {
		queryCartParam.couponId = $id
	}
	// 优惠券和券码不能共用
	if (queryCartParam.hasOwnProperty('couponCode')) {
		$('.history_list span').removeClass('active')
		$('#discount_code--input').val('')
		delete queryCartParam.couponCode
	}
	const isExclude = $(this).attr('data-exclude')
	const promotionList = CONFIGDATA.activities.find(item => {
		return contrastTime(true, item.end, item.start) && item.status == 1
	})
	if (
		isExclude != 1 ||
		(queryCartParam.hasOwnProperty('activityId') && promotionList.addFoldUp != 1)
	) {
		delete queryCartParam.activityId
		$('.promotion-discount li').eq(1).addClass('active').siblings().removeClass('active')
		$('.promotion-discount li').eq(0).find('.checked-content>span').removeClass('icon-checked').addClass('icon-unchecked')
		$('.promotion-discount li').eq(1).find('.checked-content>span').removeClass('icon-unchecked').addClass('icon-checked')
	}
	// 查询购物车
	discountInit(queryCartParam, cartDataList)
	// 费用明细
	renderTotalTpl(cartDataList, data.currentRate)
})

// 优惠券券码
$(document).on('click', '.apply-btn--event', function (e) {
	e.stopPropagation()
	e.preventDefault()
	const codeVal = $('#discount_code--input').val().trim()
	codeVal && code(codeVal)
})
function code(val) {
	const { cartDataList, queryCartParam } = data
	var pattern = /^[a-zA-Z0-9]{1,30}/
	if (!pattern.test(val)) {
		$.alert('danger', window.i18n.Enter_a_valid_discount_code)
	} else {
		$('.code_err').text('')
		let addFoldUp = -1
		const couponList = CONFIGDATA.couponCodeList.find((item) => {
			return contrastTime(true, item.end, item.start) && item.status == 1 && item.couponNum == val
		})
		if (typeof couponList == 'undefined') {
			$.alert('danger', window.i18n.Sorry_invalid_coupon_code)
			return false
		} else if (isEffectiveFun(cartDataList, couponList)) {
			// 优惠券和券码不能共用
			if (queryCartParam.hasOwnProperty('couponId')) {
				$('.coupon-list-content .coupon-list--event .coupon-list-icon--event').addClass('icon-unchecked').removeClass('icon-checked')
				delete queryCartParam.couponId
			}
			queryCartParam.couponCode = val
			addFoldUp = couponList.addFoldUp
			if (addFoldUp != 1 || (queryCartParam.hasOwnProperty('activityId') && $('.promotion-discount').find('li.active').attr('data-exclude') != 1)) {
				delete queryCartParam.activityId
				$('.promotion-discount li').eq(1).addClass('active').siblings().removeClass('active')
				$('.promotion-discount li').eq(0).find('.checked-content>span').removeClass('icon-checked').addClass('icon-unchecked')
				$('.promotion-discount li').eq(1).find('.checked-content>span').removeClass('icon-unchecked').addClass('icon-checked')
			}
		} else {
			queryCartParam.couponCode = val
		}
		// 查询购物车
		discountInit(queryCartParam, cartDataList)
		// 费用明细
		renderTotalTpl(data.cartDataList, data.currentRate)
		// code结果返回
		codeResults(val, false, '', addFoldUp)
	}
}
//点击code缓存区
$('.history_list').on('click', 'span', function () {
	const { cartDataList, queryCartParam } = data
	let code = $(this).text()
	const isExclude = $(this).attr('data-exclude')
	const couponList = CONFIGDATA.couponCodeList.find((item) => {
		return contrastTime(true, item.end, item.start) && item.status == 1 && item.couponNum == code
	})
	console.log(typeof couponList != 'undefined', isEffectiveFun(cartDataList, couponList))
	if (typeof couponList != 'undefined' && isEffectiveFun(cartDataList, couponList)) {
		if (queryCartParam.hasOwnProperty('activityId')) {
			if (isExclude != 1 || $('.promotion-discount').find('li.active').attr('data-exclude') != 1) {
				delete queryCartParam.activityId
				$('.promotion-discount li').eq(1).addClass('active').siblings().removeClass('active')
				$('.promotion-discount li').eq(0).find('.checked-content>span').removeClass('icon-checked').addClass('icon-unchecked')
				$('.promotion-discount li').eq(1).find('.checked-content>span').removeClass('icon-unchecked').addClass('icon-checked')
			}
		}
	}
	$(this).toggleClass('active').siblings().removeClass('active')
	if (!$(this).hasClass('active')) {
		code = ''
		delete queryCartParam.couponCode
		$('#discount_code--input').val('')
		// 查询购物车
		discountInit(queryCartParam, cartDataList)
		// 费用明细
		renderTotalTpl(data.cartDataList, data.currentRate)
	} else {
		// 优惠券和券码不能共用
		if (queryCartParam.hasOwnProperty('couponId')) {
			delete queryCartParam.couponId
			$('.coupon-list-content .coupon-list--event .coupon-list-icon--event').addClass('icon-unchecked').removeClass('icon-checked')
		}
		queryCartParam.couponCode = code
		// 查询购物车
		discountInit(queryCartParam, cartDataList)
		// 费用明细
		renderTotalTpl(data.cartDataList, data.currentRate)
		// code结果返回
		codeResults(code, true, $(this), -1)
	}
})

// code结果返回
function codeResults(code, isClick, $this, addFoldUp) {
	const { cartDataList } = data
	var tip = ''
	let history_list = []
	if (getStorage('history_list')) {
		history_list = JSON.parse(getStorage('history_list') || [])
	}
	if (cartDataList.couponCodeMap.isExist == '1') {
		if (!cartDataList.couponCodeMap.hasOwnProperty('difference')) {
			const isSaveCode = history_list.some((item) => {
				return code == item.code
			})
			if (!isSaveCode) {
				$('.history_list span.active').removeClass('active')
				if (history_list.length > 7) {
					history_list = history_list.slice(0, -1)
					$('.history_list span:last-child').remove()
				}
				$('.history_list').prepend(`<span class='active' data-exclude='${addFoldUp}'>${code}</span>`)
				history_list.unshift({ code, addFoldUp })
				setStorage('history_list', JSON.stringify(history_list))
			} else {
				$('.history_list span').removeClass('active')
				$('.history_list span').each((index, item) => {
					if ($(item).text() == code) {
						$(item).addClass('active')
						return false
					}
				})
			}
		}
		// 存在判断是否有效
		if (cartDataList.useDiscount.hasOwnProperty('couponCodeId')) {
			$('#discount_code--input').val(code)
			return false
		} else {
			$('.history_list span.active').removeClass('active')
			$('#discount_code--input').val('')
			if (cartDataList.couponCodeMap.hasOwnProperty('activitiesRule')) {
				if (cartDataList.couponCodeMap.difference < 0) {
					tip = window.i18n.order_tip
				} else {
					if (cartDataList.couponCodeMap.activitiesRule == 1) {
						tip = window.i18n.straitened_money.replace(/111/g, getMoney(cartDataList.couponCodeMap.difference))
					} else if (cartDataList.couponCodeMap.activitiesRule == 2) {
						tip = window.i18n.straitened_PSC.replace(/111/g, cartDataList.couponCodeMap.difference)
					}
				}
				if (isClick) {
					const newHistoryList = history_list.filter((item) => item.code != code)
					setStorage('history_list', JSON.stringify(newHistoryList))
					$this.remove()
				}
			} else {
				return false
			}
		}
	} else {
		$('#discount_code--input').val('')
		$('.history_list span').removeClass('active')
		if (!cartDataList.goodsList.length) {
			tip = window.i18n.no_shopping_tip
		} else {
			tip = window.i18n.Sorry_invalid_coupon_code
			if (isClick) {
				const newHistoryList = history_list.filter((item) => {
					return item.code != code
				})
				setStorage('history_list', JSON.stringify(newHistoryList))
				$this.remove()
			}
		}
	}
	$.alert('danger', tip)
}

// 判断活动是否有效
function isEffectiveFun(cartDataList, promotionList) {
	if (promotionList || (promotionList != null && typeof promotionList != 'undefined')) {
		const ruleValue = {}
		if (promotionList.ruleValue == '' || promotionList.ruleValue == null) {
			ruleValue.end = -1
			ruleValue.start = -1
		} else if (promotionList.ruleValue.includes(',')) {
			ruleValue.start = Number(promotionList.ruleValue.split(',')[0]) || -1
			ruleValue.end = Number(promotionList.ruleValue.split(',')[1]) || -1
		} else {
			ruleValue.start = Number(promotionList.ruleValue)
			ruleValue.end = -1
		}
		if (promotionList.activitiesRule == 1) {
			// 价格
			if (
				(cartDataList.productPrice >= ruleValue.start || ruleValue.start == -1) &&
				(cartDataList.productPrice <= ruleValue.end || ruleValue.end == -1)
			) {
				return true
			} else {
				return false
			}
		} else if (promotionList.activitiesRule == 2) {
			// 数量
			if ((cartDataList.goodsCount >= ruleValue.start || ruleValue.start == -1) && (cartDataList.goodsCount <= ruleValue.end || ruleValue.end == -1)) {
				return true
			} else {
				return false
			}
		} else {
			// 无需条件
			return true
		}
	} else {
		return false
	}
}

// 运费接口
function shippingCost() {
	const { cartDataList } = data
	// 运费参数
	const goodsList = []
	const shippingCostParam = {
		goodsList,
	}
	cartDataList.goodsList.forEach((element) => {
		let goodsListItem = {}
		goodsListItem.goodsId = element.goodsId
		// goodsListItem.skuId = element.skuId;
		goodsListItem.afterDicountPrice = String(element.afterDicountPrice)
		goodsList.push(goodsListItem)
		return goodsList
	})
	shippingCostParam.afterDicountTotal = String(cartDataList.afterDicountTotal)
	console.log(shippingCostParam)
	const res = shippingInit(shippingCostParam)
	if (res) {
		if (res.list.length) {
			res.list.sort(function (a, b) {
				return a.sort <= b.sort ? 1 : -1
			})
			$('.shipping-method').show()
			renderShippingTpl(res)
		} else {
			$('.shipping-method').hide()
			$('#shipping').html(' ')
			$('#cart-shipping--price').text(getMoney('0'))
		}
		if (res.gapMoney) {
			$('.cart-list--tip').removeClass('hide')
			$('.cart-list--tip .cart_modal_money--event').text(getMoney(res.gapMoney))
		} else {
			$('.cart-list--tip').addClass('hide')
		}
	} else {
		cartDataList.shipping = 0
	}
}

//获取运费最小值
function minShipping(res) {
	var minShippingMoney = res[0].money,
		minShippingId = res[0].id,
		shippingNum = 0
	let isSave = false
	if (sessionStorage.getItem('shipping')) {
		let shipping = JSON.parse(sessionStorage.getItem('shipping'))
		isSave = res.some((item) => {
			return shipping.shippingId == item.id
		})
	}
	if (isSave) {
		let shipping = JSON.parse(sessionStorage.getItem('shipping'))
		minShippingId = parseFloat(shipping.shippingId)
		minShippingMoney = shipping.shippingMoney
		$('.shipping-method .cart-shipping-container--event')
			.find(`[data-id='${minShippingId}']`)
			.addClass('active')
			.find('.price-checked-container>span')
			.removeClass('icon-unchecked')
			.addClass('icon-checked')
	} else {
		// 不存在删除运费信息
		sessionStorage.removeItem('shipping')
		minShippingMoney = res[0].money
		minShippingId = res[0].id
		res.forEach((item, index) => {
			if (Number(item.money) < Number(minShippingMoney)) {
				minShippingMoney = item.money
				minShippingId = item.id
				shippingNum = index
			}
		})
		$('.shipping-method li').eq(shippingNum).addClass('active').find('.price-checked-container>span').removeClass('icon-unchecked').addClass('icon-checked')
	}
	shippingSession(minShippingId, minShippingMoney, false)
	return minShippingId
}

// 将物流费用存入session并回显至下方价格明细
function shippingSession(shippingId, shippingMoney, isClick) {
	const { cartDataList, currentRate } = data
	let shippingSession = {
		shippingId,
		shippingMoney,
	}
	$('#cart-shipping--price').text(getMoney(shippingMoney)).attr('data-o-money', getMoneyrate(shippingMoney))
	let product_price = $('#product-price').attr('data-o-money')
	let dicount_total = $('#dicount-total').attr('data-o-money') || 0
	let total = Math.round(parseFloat(product_price) * 100 + getMoneyrate(shippingMoney) * 100 - parseFloat(dicount_total) * 100) / 100  //重新计算总价
	total = total > 0 ? total : 0
	$('#cart-total--price').text(currentRate.symbol + total)
	$('#cart-total--price').attr('data-d-money', total)
	// 储存运费
	cartDataList.shippingId = shippingId
	cartDataList.shippingMoney = shippingMoney
	if (isClick) {
		sessionStorage.setItem('shipping', JSON.stringify(shippingSession))
	}
}

//全场活动的点击事件
$('.cart-discount-list-container--event').on('click', '.cart-discount-list--event', function () {
	// 选中状态，则返回
	if ($(this).hasClass('active')) return
	const { cartDataList, currentRate, queryCartParam } = data
	// 储存选择的折扣id
	const activityId = $(this).data('id')
	if (!!activityId) {
		if (queryCartParam.hasOwnProperty('activityId')) return false
		queryCartParam.activityId = activityId
	} else {
		delete queryCartParam.activityId
	}

	// 对当前选择折扣高亮，并进行排他
	$(this).addClass('active').siblings('.cart-discount-list--event').removeClass('active')
	$(this).find('.checked-content>span').removeClass('icon-unchecked').addClass('icon-checked')
	$(this).siblings('.cart-discount-list--event').find('.checked-content>span').removeClass('icon-checked').addClass('icon-unchecked')

	//优惠券选中dom
	const $coupon = $('.cart-coupon-content--event').find('li.active'),
		$code = $('.history_list span.active')

	//全场活动或者优惠券有一个互斥
	if ($(this).attr('data-exclude') != 1 || (queryCartParam.hasOwnProperty('couponId') && $coupon.attr('data-exclude') != 1) || (queryCartParam.hasOwnProperty('couponCode') && $code.attr('data-exclude') != 1)) {
		if (queryCartParam.hasOwnProperty('couponId')) {
			$coupon.removeClass('active').find('.iconfont').addClass('icon-unchecked').removeClass('icon-checked')
			delete queryCartParam.couponId
		} else if (queryCartParam.hasOwnProperty('couponCode')) {
			$('.history_list span').removeClass('active')
			$('#discount_code--input').val('')
			delete queryCartParam.couponCode
		}
	}
	// 查询购物车
	discountInit(queryCartParam, cartDataList)
	// 费用明细
	renderTotalTpl(cartDataList, currentRate)
})

function paypalBase({ paypal }) {
	const { clientId } = paypal
	if (clientId) {
		const setmeal = JSON.parse(getStorage('currentRate')).currency
		var jsStr = `?client-id=${clientId}&currency=${setmeal}`
		var PAYPAL_SCRIPT = 'https://www.paypal.com/sdk/js' + jsStr
		var script = document.createElement('script')
		script.setAttribute('src', PAYPAL_SCRIPT)
		document.body.prepend(script)
		if (script.readyState) {
			script.onreadystatechange = function () {
				if (script.readyState == 'complete' || script.readyState == 'loaded') {
					closePlaceholder()
					setPaypal()
				}
			}
		} else {
			script.onload = function () {
				closePlaceholder()
				setPaypal()
			}
		}
	}
}

function setPaypal() {

	// 订单参数
	getToken(function () {
		paypal
			.Buttons({
				// Call your server to set up the transaction
				createOrder: function () {
					const { cartDataList } = data
					var orderParams = {
						saveType: '1',
						payMethod: 'paypal',
						taxRatePrice: 0,
						currency: totalRate.currency,
						preParam: cartDataList.useDiscount,
						ordersOrigin: localStorage.getItem('sourceurl'),
						promotionLogo: getCookie('promotionLogo'),
						totalShippingPrice: getMoneyRateNum(cartDataList.shippingMoney) || 0,
						shippingsName: $(`#shipping li[data-id=${cartDataList.shippingId}]`).attr('data-name') || '',
						rate: Number(totalRate.rate),
						cart: totalCartList(cartDataList),
					}
					// return false
					console.log('order数据==>', cartDataList, orderParams, getMoneyRateNum(cartDataList.promotionDiscount))
					// 跟踪代码
					var cart = []
					var tiktokArr = [],
						goodsData = []
					cartDataList.goodsList.forEach((element) => {
						const cartList = {}
						cartList.sku = element.sku || ''
						cartList.type = ''
						cartList.product = element.goodsName || ''
						cartList.quantity = element.quantity || ''
						cart.push(cartList)
						const tiktokList = {
							content_id: String(element.goodsId),
							content_type: 'product',
							content_name: element.sku || '',
							quantity: Number(element.quantity),
							price: Number(element.discountPrice),
						}
						tiktokArr.push(tiktokList)

						let edataList = {}
						edataList.spuId = element.goodsId
						edataList.spu = element.goodsName
						edataList.quantity = element.quantity
						edataList.spuPrice = element.discountPrice
						edataList.sku = element.sku
						edataList.skuPrice = element.discountPrice
						edataList.spuImg = element.mainImg
						goodsData.push(edataList)
					})
					let TiktokParam = {
						contents: tiktokArr,
						value: Math.round(cartDataList.afterDicountTotal * 100 + parseFloat(cartDataList.shippingMoney || 0) * 100) / 100,
						currency: 'USD',
					}
					localStorage.setItem('TiktokParam', JSON.stringify(TiktokParam))
					var edata = {
						orderId: '',
						quantify: cartDataList.goodsCount,
						sales: Math.round(cartDataList.afterDicountTotal * 100 + parseFloat(cartDataList.shippingMoney || 0) * 100) / 100,
						discount: Math.round(cartDataList.promotionDiscount * 100 + parseFloat(cartDataList.couponDiscount || 0) * 100) / 100,
						shipping: parseFloat(cartDataList.shippingMoney) || 0,
					}
					sendAnalyze('payment', edata, goodsData)
					// facebook埋点
					const eventID = getRandomString(5)
					if (!!window.shopInfo.facebookId) {
						fbq('track', 'InitiateCheckout', { eventID })
						// facebook api数据转化
						const content_ids = []
						cartDataList.goodsList.forEach((item) => {
							content_ids.push(item.skuId)
						})
						const custom_data = {
							value: cartDataList.total,
							currency: JSON.parse(getStorage('currentRate')).currency,
							content_ids: content_ids,
							content_type: 'product',
						}
						var datalist = facebookApiParam(custom_data, 'InitiateCheckout', eventID)
						const facebookIdArr = window.shopInfo.facebookId.split(',')
						facebookIdArr.forEach((item) => {
							facebookApi(item, datalist)
						})
					}
					// tiktok像素埋点
					if (window.shopInfo.Tiktok) {
						ttq.track('Checkout', TiktokParam)
					}
					//ga 像素埋点
					if (window.shopInfo.googleId) {
						ga('create', window.shopInfo.googleId)
						ga('require', 'ec')
						checkout(cartDataList.goodsList)
						function checkout(cart) {
							cart.forEach((item) => {
								ga('ec:addProduct', {
									id: item.goodsId,
									name: item.goodsName,
									price: item.discountPrice,
									quantity: item.quantity,
								})
							})
						}
						ga('ec:setAction', 'checkout', {
							option: 'Paypal',
						})
						ga('send', 'event', 'checkout', 'click', 'Begin Checkout')
					}
					localStorage.setItem('productData', JSON.stringify(cartDataList))
					// 存储查询购物车条件,成功后去除卷码
					localStorage.setItem('queryCartParam', JSON.stringify(cartDataList.useDiscount))
					return fetch('/vshop-site/api/v1/pre/orders/orders', {
						method: 'post',
						body: JSON.stringify(orderParams),
						headers: {
							Authorization: 'Bearer' + getStorage('localstorageId'),
						},
					})
						.then(function (res) {
							console.log('123-->', res)
							return res.json()
						})
						.then(function (orderData) {
							if (orderData.code != 0) {
								if (orderData.msg === 'The total amount is zero') {
									$.alert('danger', window.i18n.price_zero)
								} else {
									$.alert('danger', orderData.msg)
								}
							} else {
								return orderData.data.order_number
							}
						})
				},
				// Call your server to finalize the transaction
				onApprove: function (data, actions) {
					$('html').append(
						'<div class="paymentLoading"><div><img src="../images/loading.gif" alt=""><p>Please wait a moment before finishing the payment.....</p><div></div>'
					)
					return fetch('/vshop-third/api/v1/third/' + data.orderID + '/capture', {
						method: 'post',
						headers: {
							Authorization: 'Bearer' + getStorage('localstorageId'),
						},
					})
						.then(function (res) {
							console.log('res--', res)
							return res.json()
						})
						.then(function (orderData) {
							console.log(orderData)
							// Three cases to handle:
							//   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
							//   (2) Other non-recoverable errors -> Show a failure message
							//   (3) Successful transaction -> Show a success / thank you message

							// Your server defines the structure of 'orderData', which may differ
							console.log('orderData--', orderData)
							var errorDetail = Array.isArray(orderData.details) && orderData.details[0]
							if (errorDetail && errorDetail.issue === 'INSTRUMENT_DECLINED') {
								// Recoverable state, see: "Handle Funding Failures"
								// https://developer.paypal.com/docs/checkout/integration-features/funding-failure/
								return actions.restart()
							}
							if (errorDetail) {
								var msg = 'Sorry, your transaction could not be processed.'
								if (errorDetail.description) msg += '\n\n' + errorDetail.description
								if (orderData.debug_id) msg += ' (' + orderData.debug_id + ')'
								// Show a failure message
								return $.alert('danger', msg)
							}
							// Show a success message to the buyer
							let money = $('#cart-total--price').attr('data-d-money')
							if (orderData.statusCode === 201 && orderData.status === 'COMPLETED') {
								window.location.href = `./payment-results.html?status=1&transcationId=${data.orderID}&currency=${totalRate.currency}&amount=${money}`
							} else {
								window.location.href = `./payment-results.html?status=0`
							}
						})
				},
			})
			.render('#paypal-button-container')
	})
}

// paypal预加载遮盖
function closePlaceholder() {
	let r = 'dynamic-checkout--loading'
	var e = document.querySelector('.' + r),
		t = document.querySelector('.dynamic-checkout__buttons')
	null !== e && null !== t && e.classList.remove(r)
}

$('.check-out-order').click(function () {
	jump_cart(data.queryCartParam)
})
function jump_cart($param) {
	// 查询购物车
	$res = calculate($param, data.datalist)
	switch ($res.code) {
		case 20000:
			// 全场活动失效
			delete $param.activityId
			jump_cart($param)
			break
		case 20001:
			// 优惠券失效
			delete $param.couponId
			jump_cart($param)
			break
		case 0:
			// 正常事件
			cartInfoGoodsList($res)
			break
	}
}

function cartInfoGoodsList(res) {
	if (res.data.invalidGoodsList.length && !res.data.goodsList.length) {
		$.alert('danger', window.i18n.cart_expired)
	} else {
		let money = $('#cart-total--price').attr('data-d-money')
		if (res.data.invalidGoodsList.length) {
			localStorage.setItem('invalidGoodsList', JSON.stringify(res.data.invalidGoodsList))
		}
		if (money !== '0') {
			// 存储查询购物车条件,成功后去除卷码
			localStorage.setItem('queryCartParam', JSON.stringify(res.data.useDiscount))
			window.location.href = './information.html?saveType=1'
		} else {
			$.alert('danger', window.i18n.price_zero)
		}
	}
}

$('.currency-extend li,.currency-select .currency-list').click(function () {
	location.reload()
})
