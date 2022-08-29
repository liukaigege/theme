var url = window.location.href;
var paramArr = url.split('?').pop()
var paymentParam = {}
var version = new Date().getTime()
paymentParam[paramArr.split('=')[0]] = parseInt(paramArr.split('=')[1]);
// 订单参数
const orderParams = {};
// 货币
var setmeal = JSON.parse(localStorage.getItem('currentRate'));
//发送联盟看板事件
var goodsData = [];
var edata = {}
// tiktok像素相关
let tiktokArr = []
let tiktoValue = '', tiktokShipping = '';
//商品总参数
let cart_info = {}
//税率
var taxVal = 0

// 判断是购物车购买 || 快速购买
if (paymentParam.saveType == 1) {
	// 购物车购买
	let queryCartParam = JSON.parse(localStorage.getItem('queryCartParam'));
	cartBuy(queryCartParam, false)
} else if (paymentParam.saveType == 3) {
	//快速购买
	quickBuy(false)
}

// 送货地址选择 绑定事件
$('.billing-address__item--event').on('click', 'input', function (e) {
	// 1: 使用账单地址， 2：自定义地址
	let typeName = $(this).data('type')
	if (typeName == 2) {
		// 展开表单
		$('.billing-address-form--event').slideDown(300).addClass('active');
	} else {
		// 清除账单地址数据
		$('.billing-address-form--event').find('.form--event')[0].reset();
		// 收起表单
		$('.billing-address-form--event').slideUp(300).removeClass('active')
	}
})

$("#paymentInfoSubmit").on('click', $.debounce(function () {
	// 校验form表单
	if ($(".shipping-address-form--event, .billing-address-form--event.active").validate()) {
		// 序列化参数
		orderParams.adressParam = $('.shipping-address-form--event .form--event').serializeToObj()
		// state
		orderParams.adressParam.state = $('.province-cell.active [name=state]').val()
		let { firstName, lastName } = orderParams.adressParam
		orderParams.adressParam.name = firstName + ' ' + lastName;
		orderParams.adressParam.countryCode = $('.shipping-address-form--event .country--event option:checked').data('code');
		let billingAdressParam = $('.billing-address-form--event.active .form--event').serializeToObj()
		// 判断是否需要账单地址
		if (billingAdressParam) {
			orderParams.billingAdressParam = billingAdressParam
			orderParams.billingAdressParam.name = firstName + ' ' + lastName;
			orderParams.billingAdressParam.countryCode = $('.billing-address-form--event.active .country--event option:checked').data('code');
		}
		localStorage.setItem('address_form', JSON.stringify(orderParams))
		if (paymentParam.saveType == 1) {
			// 购物车购买
			let queryCartParam = JSON.parse(localStorage.getItem('queryCartParam'));
			cartBuy(queryCartParam, true)
		} else if (paymentParam.saveType == 3) {
			//快速购买
			quickBuy(true)
		}
	} else {
		// 滚动到可视区域
		$("html,body").animate({
			scrollTop: $(".validate-failed").parent().offset().top - window.innerHeight * 0.3
		}, 500)

	}

}))

function cartQuery(res) {
	cart_info = deepClone(res)
	orderParams.saveType = paymentParam.saveType + '';
	orderParams.payMethod = 'paypal';
	orderParams.taxRatePrice = 0;
	orderParams.preParam = res.useDiscount;
	orderParams.ordersOrigin = getStorage('sourceurl') || '';
	orderParams.promotionLogo = getCookie('promotionLogo') || '';
	orderParams.rate = Number(setmeal.rate);
	orderParams.currency = setmeal.currency;
	orderParams.cart = totalCartList(res)
	// console.log('order数据==>', orderParams)
	// tiktok数据
	if (res.goodsList.length) {
		tiktokArr.length = 0
		res.goodsList.forEach(element => {
			const tiktokList = {
				content_id: String(element.goodsId),
				content_type: 'product',
				content_name: element.sku || '',
				quantity: Number(element.quantity),
				price: Number(element.discountPrice),
			}
			tiktokArr.push(tiktokList)
		})
	}
	//联盟看板事件
	goodsData.length = 0
	res.goodsList.forEach(element => {
		let cartList = {};
		cartList.spuId = element.goodsId
		cartList.spu = element.goodsName;
		cartList.quantity = element.quantity;
		cartList.spuPrice = element.discountPrice;
		cartList.sku = element.sku;
		cartList.skuPrice = element.discountPrice;
		cartList.spuImg = element.mainImg
		goodsData.push(cartList)
	});
	edata.orderId = ''
	edata.quantify = res.goodsCount
	edata.discount = Math.round(res.promotionDiscount * 100 + parseFloat(res.couponDiscount || 0) * 100) / 100
	edata.sales = res.afterDicountTotal
	edata.shipping = 0

	res.symbol = setmeal.symbol
	let productPrice = 0;
	res.goodsList.forEach(element => {
		productPrice = Math.round(productPrice * 100 + getMoneyrate(element.discountPrice) * 100 * element.quantity) / 100;
	});
	res.productPrice = productPrice;
	// 不加运费的总价
	// 计算汇率前
	res.beforeDicountTotal = res.afterDicountTotal;
	// 计算汇率后
	res.afterDicountTotal = Math.round(productPrice * 100 - getMoneyrate(res.promotionDiscount) * 100 - getMoneyrate(res.couponDiscount) * 100) / 100;
	if (res.afterDicountTotal < 0) {
		res.afterDicountTotal = 0
	}

	let goodsList = []
	res.goodsList.forEach(item => {
		const goodListItem = {
			quantity: item.quantity,
			spuId: item.goodsId,
			spu: item.goodsName,
			spuPrice: item.defaultPrice,
			spuImg: item.mainImg
		}
		goodsList.push(goodListItem)
	})
	sendAnalyze('view', {}, goodsList);
	// 绘制订单信息
	res.totalDiscount = ((res.promotionDiscount || 0) + (res.couponDiscount || 0)) * 1
	shippingCost(res);
	let address_form = JSON.parse(localStorage.getItem('address_form'))
	if (address_form != null && address_form.hasOwnProperty('adressParam')) {
		tax(address_form.adressParam.country)
	}
}
// 运费接口
function shippingCost(res) {
	// 运费参数
	const goodsList = [];
	const shippingCostParam = {
		goodsList
	}
	res.goodsList.forEach(element => {
		let goodsListItem = {};
		// goodsListItem.skuId = element.skuId;
		goodsListItem.goodsId = element.goodsId;
		goodsListItem.afterDicountPrice = String(element.afterDicountPrice);
		goodsList.push(goodsListItem);
		return goodsList;
	});
	shippingCostParam.afterDicountTotal = String(res.beforeDicountTotal);
	const res_shipping = shippingInit(shippingCostParam)
	if (res_shipping.list.length) {
		res_shipping.list.sort(function (a, b) { return a.sort <= b.sort ? 1 : -1 });
		shippingTpl(res_shipping, res)
		renderOrderSummaryTpl(res)
	} else {
		res.shipping = 0;
		res.totalPrice = res.afterDicountTotal
		renderOrderSummaryTpl(res)
		orderParams.totalShippingPrice = 0;
		orderParams.shippingsName = '';
		$('#shippingMethod').html('');
		// 选择地址设置为第2步
		$(".circle-icon--event").html(2)
	}
}

// 运费
function shippingTpl(res, cart_res) {
	if (res.list.length) {
		renderLogisticsTpl(res.list)
		minShipping(res.list, cart_res)
		// 选择物流
		$('#shippingMethod').on('click', 'li', function (e) {
			// 判断多次点击
			if (!$(this).hasClass('active')) {
				$(this).addClass('active').siblings('li').removeClass('active');
				var $shippingMoney = $(this).data('money');
				// 获取邮费
				let $id = $(this).data('id');
				if(!$(this).find('.custom-control-input').prop("checked")) $(this).find('.custom-control-input').prop("checked",true)
				// 存储运费进入session
				shippingSession($id, $shippingMoney, cart_res, true)
			}
		})
	}
}
//获取运费最小值
function minShipping(res, cart_res) {
	var minShippingMoney = res[0].money,
		minShippingId = res[0].id,
		shippingNum = 0;
	let isSave = false
	if (sessionStorage.getItem('shipping')) {
		let shipping = JSON.parse(sessionStorage.getItem('shipping'))
		minShippingId = parseFloat(shipping.shippingId)
		minShippingMoney = shipping.shippingMoney
		isSave = res.some(item => {
			return shipping.shippingId == item.id
		})
	}
	if (isSave) {
		$('#shippingMethod').find(`[data-id=${minShippingId}]`).addClass('active').find('input').prop("checked", "checked")
	} else {
		minShippingMoney = res[0].money
		minShippingId = res[0].id
		res.forEach((item, index) => {
			if (Number(item.money) < Number(minShippingMoney)) {
				minShippingMoney = item.money;
				minShippingId = item.id;
				shippingNum = index;
			}
		});
		$('#shippingMethod li').eq(shippingNum).addClass('active').find('input').prop("checked", "checked");
	}
	shippingSession(minShippingId, minShippingMoney, cart_res, false)
	return minShippingId
}

// 将物流费用存入session并回显至下方价格明细
function shippingSession(shippingId, shippingMoney, cart_res, isClick) {
	let shippingobj = {
		shippingId,
		shippingMoney
	}
	orderParams.totalShippingPrice = getMoneyRateNum(shippingMoney) || 0;
	orderParams.shippingsName = $(`#shippingMethod li[data-id=${shippingId}]`).data('name') || '';
	sessionStorage.setItem('shipping', JSON.stringify(shippingobj));
	// 联盟看板数据
	edata.sales = Math.round(cart_res.beforeDicountTotal * 100 + shippingMoney * 100) / 100
	edata.shipping = parseFloat(shippingMoney)
	cart_info.shippingMoney = parseFloat(shippingMoney)
	if (isClick) {
		$('#shippingPrice').text(getMoney(shippingMoney));
		let $_total_price = $('#totalPrice').data('dicount');
		let total_price = Math.round(getMoneyrate(shippingMoney) * 100 + parseFloat($_total_price) * 100) / 100
		// 渲染运费和总价
		$('#totalPrice').attr('data-money', total_price)
		$('#tax').text(setmeal.symbol + formatMoneyRate(total_price * taxVal)).attr('data-tax', formatMoneyRate(total_price * taxVal))
		$('#totalPrice').text(setmeal.symbol + formatMoneyRate(total_price * (taxVal + 1))).attr('data-money', formatMoneyRate(total_price * (taxVal + 1)))
		tiktokShipping = shippingMoney
	} else {
		cart_res.totalPrice = Math.round(cart_res.afterDicountTotal * 100 + getMoneyrate(shippingMoney) * 100) / 100 //重新计算总价
		cart_res.shipping = shippingMoney //加入运费
		cart_res.totalShippingPrice = shippingMoney || 0
		tiktokShipping = shippingMoney
		return cart_res
	}
}


// U66.创建前置订单接口(前端触发)
function afterOrder(orderParams) {
	// 税率
	orderParams.taxRatePrice = Number($('#tax').attr('data-tax'))
	getToken(function () {
		$.req({
			url: '/api/v1/pre/orders/preOrders',
			type: 'post',
			data: JSON.stringify(orderParams),
			dataType: 'json',
			contentType: 'application/json',
			success(res) {
				if (res.code === 0) {
					//清除购物车数量
					localStorage.setItem('shopping_num', 0);
					$('#homeCart i').text(0);
					sessionStorage.removeItem('remark');
					sessionStorage.removeItem('shipping');
					let $facebookId_val = window.shopInfo.facebookId
					if ($facebookId_val && Object.prototype.toString.call($facebookId_val).slice(8, -1) != 'Null') {
						const eventID = getRandomString(5)
						fbq('track', 'InitiateCheckout', { eventID });
						// facebook api数据转化
						const content_ids = []
						cart_info.goodsList.forEach(item => {
							content_ids.push(item.skuId)
						})
						const custom_data = {
							"value": Number($('#totalPrice').text().substr(1)),
							"currency": setmeal.currency,
							"content_ids": content_ids,
							"content_type": "product"
						}
						var data = facebookApiParam(custom_data, 'InitiateCheckout', eventID)
						const facebookIdArr = $facebookId_val.split(',')
						facebookIdArr.forEach(item => {
							facebookApi($facebookId_val, data)
						})
					}
					//ga 像素埋点
					const $googleId = window.shopInfo.googleId
					if ($googleId && $googleId != '' && Object.prototype.toString.call($googleId).slice(8, -1) != 'Null') {
						ga('create', $googleId);
						ga('require', 'ec');
						checkout(cart_info.goodsList)
						function checkout(cart) {
							cart.forEach(item => {
								ga('ec:addProduct', {
									'id': item.goodsId,
									'name': item.goodsName,
									'price': item.discountPrice,
									'quantity': item.quantity
								});
							})
						}
						ga('ec:setAction', 'checkout', {
							'option': 'Checkout'
						});
						ga('send', 'event', 'checkout', 'click', 'Begin Checkout');
					}
					//  PayPal支付跟踪代码埋点
					let $Tiktok_val = window.shopInfo.Tiktok
					let $tiktok_status = window.shopInfo.tiktokType == 1? false: true
					if ($Tiktok_val && $Tiktok_val != '' && Object.prototype.toString.call($Tiktok_val).slice(8, -1) != 'Null' && $tiktok_status == 'true') {
						let TiktokParam = {
							contents: tiktokArr,
							value: Math.round(tiktoValue * 100 + parseFloat(tiktokShipping || 0) * 100) / 100,
							currency: 'USD',
						}
						localStorage.setItem('TiktokParam', JSON.stringify(TiktokParam));
						ttq.track('Checkout', TiktokParam)
					}
					//联盟看板事件
					edata.orderId = res.data.ordersId
					sendAnalyze('payment', edata, goodsData);
					window.location.replace("./payment.html?ordersId=" + res.data.ordersId);
				} else {
					$.alert('danger', res.msg)
					setTimeout(() => {
						window.location.replace("/");
					}, 3000)
				}
			}
		});
	});
}

// 快速购买
function quickBuy(isClick) {
	var getVustomVal = JSON.parse(localStorage.getItem('getVustomVal'));
	let goodsList = [];
	goodsList.push(getVustomVal);
	let params = {
		goodsList,
	}
	const calculationParams = {}
	const promotion_arr = CONFIGDATA.activities
	if (promotion_arr.length && contrastTime(true, promotion_arr[0].end, promotion_arr[0].start)) {
		params['activityId'] = promotion_arr[0].id;
		calculationParams.activityId = promotion_arr[0].id
	}
	getToken(function () {
		$.req({
			url: '/api/v1/goods/calculation',
			type: 'POST',
			data: JSON.stringify(params),
			dataType: 'json',
			contentType: 'application/json',
			success(res) {
				if (res.code === 0 && res.data.cartList.length) {
					let $res = calculate(calculationParams, res.data)
					if ($res.code == 0) {
						let cartRes = $res.data
						cartQuery(cartRes);
						tiktoValue = cartRes.afterDicountTotal
						if (isClick) {
							if (cartRes.invalidGoodsList.length) {
								let tip = i18n.cart_expired
								$.confirm({
									title: false,
									content: tip,
									callback: function () {
										$.closeConfirm() //如果设定了yes回调，需进行手工关闭
										window.location.href = "/cart.html";
									}
								})
							} else {
								let money = $('#totalPrice').attr('data-money');
								if (money !== '0') {
									afterOrder(orderParams);
								} else {
									$.alert('danger', i18n.business_failed_msg)
								}
							}
						}
					}
				} else if (res.code == 20016) {
					$.confirm({
						title: false,
						content: i18n.refresh_update,
						callback: function() {
							$.closeConfirm() //如果设定了yes回调，需进行手工关闭
							window.location.href = '/'
						}
					})
				} else if (res.code == 20015) {
					$.confirm({
						title: false,
						content: i18n.product_removed,
						callback: function() {
							$.closeConfirm() //如果设定了yes回调，需进行手工关闭
							window.location.href = 'productList.html'
						}
					})
				} else {
					$.alert('danger', res.msg)
					setTimeout(() => {
						window.location.replace("/");
					}, 3000)
				}
			}
		});
	});

	// })
};
//购物车购买
function cartBuy(data, isClick) {
	getToken(function () {
		$.req({
			url: '/api/v1/cart/cart/info',
			type: 'get',
			success(res) {
				if (res.code == 0 && res.data.cartList.length) {
					$res = calculate(data, res.data)
					switch ($res.code) {
						case 20000:
							// 全场活动失效
							delete data.activityId
							cartBuy(data, true)
							break;
						case 20001:
							// 优惠卷失效
							delete data.couponId
							cartBuy(data, true)
							break;
						case 0:
							// 正常事件
							cartInfoGoodsList($res, isClick)
							break;
					}
				} else if (res.code == 20016) {
					$.confirm({
						title: false,
						content: i18n.refresh_update,
						callback: function() {
							$.closeConfirm() //如果设定了yes回调，需进行手工关闭
							window.location.href = 'cart.html'
						}
					})
				} else if (res.code == 20015) {
					$.confirm({
						title: false,
						content: i18n.product_removed,
						callback: function() {
							$.closeConfirm() //如果设定了yes回调，需进行手工关闭
							window.location.href = 'productList.html'
						}
					})
				} else {
					$.alert('danger', res.msg)
					setTimeout(() => {
						window.location.replace("cart.html");
					}, 3000)
				}
			}
		});
	});
}
function cartInfoGoodsList(res, isClick) {
	if (res.code === 0 && res.data.goodsList.length) {
		const cart_info = res.data;
		tiktoValue = cart_info.afterDicountTotal
		cartQuery(cart_info)
		if (isClick) {
			var invalidGoodsList = []
			if (getStorage('invalidGoodsList')) {
				invalidGoodsList = getStorage('invalidGoodsList');
			}
			if (res.data.invalidGoodsList.length && JSON.stringify(res.data.invalidGoodsList) !== invalidGoodsList) {
				$.confirm({
					title: i18n.cart_expired,
					callback: function (index, layero) {
						$.closeConfirm() //如果设定了yes回调，需进行手工关闭
						deleteStorage('invalidGoodsList')
						window.location.href = "/cart.html";
					}
				})
			} else {
				deleteStorage('invalidGoodsList')
				let money = $('#totalPrice').attr('data-money');
				if (money !== '0') {
					afterOrder(orderParams);
				} else {
					$.alert('danger', i18n.business_failed_msg)
				}
			}
		}
	}
}
// 地址回显
let address_form = JSON.parse(localStorage.getItem('address_form'))
if (address_form != null) {
	// 含有收货地址
	if (address_form.hasOwnProperty('adressParam')) {
		addressShow('.shipping-address-form--event', address_form['adressParam'],'shopping')
	}
	// 含有账单地址
	if (address_form.hasOwnProperty('billingAdressParam')) {
		addressShow('.billing-address-form--event', address_form['billingAdressParam','billing'])
		$('.billing-address-ul li').eq(1).addClass('active').siblings().removeClass('active')
		$('.billing-address-ul li').eq(1).find('.input-radio').prop("checked", "checked");
		$('.billing-address-ul li').eq(1).siblings().find('.input-radio').removeProp('checked');
		$('#billing_address_form').show()
	}
}

$('#order_checkout--checkbox').click(function () {
	$(this).toggleClass('active');
	if ($(this).hasClass('active')) {
		$('#order_checkout').removeAttr('disabled')
	} else {
		$('#order_checkout').attr('disabled', 'disabled')
	}
})

function tax(countryName) {
	const total_price = $('#totalPrice').data('money')
	if (CONFIGDATA.hasOwnProperty('taxRateList')) {
		const isCountryExist = CONFIGDATA.taxRateList.find(item => {
			return item.nameEn == countryName
		})
		if (isCountryExist) {
			$('.tax--event').removeProp('hidden')
			taxVal = isCountryExist.taxRate / 100 || 0
			const tax = formatMoneyRate(total_price * taxVal)
			$('#tax').text(setmeal.symbol + tax).attr('data-tax', tax)
			$('#totalPrice').text(getMoney(total_price * (taxVal + 1))).attr('data-money', formatMoneyRate(total_price * (taxVal + 1)))
		} else {
			taxVal = 0
			$('.tax--event').prop('hidden', true)
			$('#tax').attr('data-money', 0)
			$('#totalPrice').text(setmeal.symbol + total_price).attr('data-money', total_price)
		}
	}
}
