// 截取支付方式
var url = window.location.href;
var theRequest = {};
var ORDER_PAYMENT = {}
var paramArr = customVal(url, theRequest);
let configJson = {},
	payssionPayStatus = false,
	payssionId = null,
	alipayStatus = false,
	threeDOrderStatus = false;

//获取config.json里面数据
configJson = CONFIGDATA
configJson.payMethod.creditCard.forEach(function (v, i) {
	if (v.cardType == -2) {
		//本店铺支持payssion支付方式
		payssionPayStatus = true;
	} else if (v.cardType == -1) {
		alipayStatus = true
	}
})
// })

function showModal(selector) {
	$('body').addClass('modal-open')
	$('body').append('<div class="modal-backdrop fade show"></div>')
	$(selector).show()
}
function hideModal(selector) {
	$('body').removeClass('modal-open')
	$('.modal-backdrop').remove()
	$(selector).hide()
}

$(document).on('click', '#showMore', function () {
	showModal('.payment-modal')
})
$(document).on('click', '.close--event', function () {
	hideModal('.payment-modal')
})
$(document).on('click', '.payment-box--event', function () {
	payssionId = $(this).data('id') * 1;
	$('.payment-box--event').each((i, item) => $(item).removeClass('active'))
	$(this).addClass('active');
	$('#showMore').html($(this).text());
	hideModal('.modal')
})
let methodObj = ['oceanpayment', 'stripe', 'cnp', 'lianlian', 'pingpong', 'pacypay', 'pacypayold', 'checkout', 'glocash', 'cardpay', 'xbPay', 'wangao']
let methodType = configJson.payMethod.creditCard.find(item => item.cardType > -1)
// 获取付款方式
let creadit_card = methodObj[methodType.cardType]

// 绑定付款方式单选框点击事件
$('.payment-method-info--event').on('click', '[name="payMethod"]', function () {
	// 移除先前选中
	$('.payment-method-info--event .selected').removeClass('selected')
	// 显示现在选中付款方式详情
	$(this).parent().siblings('.method-box--event').addClass('selected')
	// 获取 选中方式
	let paymentName = $(this).data('method')
	ORDER_PAYMENT.payMethod = paymentName
	if (paymentName === 'paypal') {
		delete ORDER_PAYMENT.paymentMethodInfo
	}
	if(!['payssion','alipay','cod'].includes(paymentName)) {
		ORDER_PAYMENT.payMethod = creadit_card
	  }
})
// 默认选中第一个付款方式
$('[name="payMethod"]').first().prop('checked', true)
$('[name="payMethod"]').first().click()

$(document).on('click', '.checkout--event', function () {
	ORDER_PAYMENT.payssionId = payssionId
	$('[role="loading"]').show();
	getToken(function () {
		$.req({
			url: '/api/v1/pre/orders/orders',
			type: 'post',
			data: JSON.stringify(ORDER_PAYMENT),
			dataType: 'json',
			contentType: 'application/json',
			success(res) {
				if (res.code === 0) {
					if (ORDER_PAYMENT.payMethod == 'cod') {
						let money = $('#totalPrice').attr('data-money');
						window.location.href = './payment-results.html?status=cod&transcationId=' + ORDER_PAYMENT.ordersId + '&currency=' + totalRate.currency + '&amount=' + money
					} else {
						// 表单提交
						commitPayssion(res.data.reqPayssionParam)
					}
				} else {
					$.alert('danger', i18n.payment_abnormality)
					$('[role="loading"]').hide();
				}
			}
		});
	});
})

function customVal(str, obj) {
	if (str.indexOf("?") === -1) {
		return obj;
	}
	var arrStr = str.split('?')[1];
	if (arrStr && arrStr.indexOf("&") !== -1) {
		var arr = arrStr.split('&');
		arr.forEach(element => {
			element.split('=')[0] !== '' ? obj[element.split('=')[0]] = element.split('=')[1] : 0;
		});
	} else if (arrStr.indexOf("&") === -1) {
		obj[arrStr.split('=')[0]] = arrStr.split('=')[1];
	}
	return obj
}

function failedOpt() {
	$('.payment-failed--event').show();
	$("html,body").animate({
		scrollTop: $(".payment-failed--event").offset().top
	}, 500)
}

function codPayShowFn(countryCode) {
	let codStatus = CODCountry.some(v => countryCode == v.countryKey && !threeDOrderStatus);
	if (codStatus) {
		$('#cod').show();
	} else {
		$('#cod').hide();
		$('#paypalMethod').prop('checked', true)
	}
}
(paramArr.status === '0' || paramArr.status === 'FAILED' || paramArr.status === 'failed') && failedOpt();
//渲染
ORDER_PAYMENT['ordersId'] = paramArr.ordersId
ORDER_PAYMENT['payMethod'] = 'paypal';
if (getStorage('currentRate')) {
	var totalRate = JSON.parse(getStorage('currentRate'));
}

let payMethod = ''; //保存结算方式
var totalPriceUsd = 0; //美元总价（alipay使用）

getOrderDetails()

function getOrderDetails() {
	// U67.查询单个订单信息接口(Redis)
	getToken(function () {
		$.req({
			url: '/api/v1/orders/orders/' + ORDER_PAYMENT.ordersId,
			type: 'get',
			async: false,
			success(res) {
				if (res.code === 0) {
					threeDOrderStatus = res.data.goodsList.some(v => v.speType == 3 || v.speType == 2)
					// 切换货币，如果此接口返回货币与当前主货币不同，以此接口货币为主
					if (totalRate.currency !== res.data.currency) {
						let item = configJson.currency.find(item => res.data.currency == item.currency)
						totalRate = item;
					}
					//glocash
					codPayShowFn(res.data.adressParam.country);
					// 动态加载配置的支付方式
					renderPayssion(res.data.adressParam.country, payssionPayStatus)
					//
					ORDER_PAYMENT.adressParam = res.data.adressParam;
					ORDER_PAYMENT.taxRatePrice = res.data.taxRatePrice
					if (res.data.billingAdressParam) {
						ORDER_PAYMENT.billingAdressParam = res.data.billingAdressParam;
					}
					totalPriceUsd = res.data.totalPriceUsd
					// 地址信息
					renderPaymentAddess(res.data)
					renderOrderSummaryTpl(res.data)
					// 联盟看板信息埋点
					let goodsList = []
					res.data.goodsList.forEach(item => {
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
					// 埋点信息存入session
					var cartArr = [];
					let goodsCount = 0;
					res.data.goodsList.forEach(element => {
						var cartList = {};
						cartList.goodsId = element.goodsId
						cartList.goodsName = element.goodsName
						cartList.sku = element.sku || '';
						cartList.type = '';
						cartList.quantity = element.quantity || '';
						cartList.discountPrice = Math.round(element.discountPrice * 100 / totalRate.rate) / 100;
						goodsCount += element.quantity;
						cartArr.push(cartList);
					})
					if (res.data.promotionLogo && res.data.promotionLogo != null && !getCookie('promotionLogo')) {
						setCookie('promotionLogo', res.data.promotionLogo)
					}
					let productData = {
						"afterDicountTotal": Math.round(res.data.productPrice * 100 / totalRate.rate - res.data.totalDiscount * 100 / totalRate.rate) / 100,
						"orderTotal": goodsCount,
						"shippingMoney": Math.round(res.data.totalShippingPrice * 100 / totalRate.rate) / 100,
						"discount": Math.round(res.data.totalDiscount * 100 / totalRate.rate) / 100,
						"currency": totalRate.currency,
					};
					productData.goodsList = cartArr;
					localStorage.setItem('productData', JSON.stringify(productData));

					$('#paypalMethod').prop('checked', true)

					//tiktok埋点
					let $Tiktok_val = window.shopInfo.Tiktok
					let $tiktok_status = window.shopInfo.tiktokType == 1 ? false : true
					if ($Tiktok_val && $Tiktok_val != '' && Object.prototype.toString.call($Tiktok_val).slice(8, -1) != 'Null' && $tiktok_status == 'true') {
						let tiktokArr = []
						res.data.goodsList.forEach(element => {
							const tiktokList = {
								content_id: String(element.goodsId),
								content_type: 'product',
								content_name: element.sku || '',
								quantity: Number(element.quantity),
								price: Math.round(element.discountPrice * 100 / totalRate.rate) / 100,
							}
							tiktokArr.push(tiktokList)
						})
						let TiktokParam = {
							contents: tiktokArr,
							value: res.data.totalPriceUsd,
							currency: 'USD',
						}
						localStorage.setItem('TiktokParam', JSON.stringify(TiktokParam));
					}
				} else {
					$.alert('danger', res.msg)
					setTimeout(() => {
						window.location.href = '/'
					}, 2000)
				}
			}
		});
	});
}
$(document).on('click', '#confirmBtn', function () {
	// 校验form表单
	if ($(".form--event").validate()) {
		// 序列化参数
		let adressParam = $('.form--event').serializeToObj()
		// state
		adressParam.state = $('.province-cell.active [name=state]').val()
		let { firstName, lastName } = adressParam
		adressParam.name = firstName + ' ' + lastName;
		adressParam.countryCode = $('.country--event option:checked').data('code');
		codPayShowFn(adressParam.country)
		renderPayssion(adressParam.country, payssionPayStatus)
		$('#paypalMethod').prop("checked", true);
		ORDER_PAYMENT.payMethod = 'paypal'
		// 获取类型 type
		let type = $(this).data('type')
		ORDER_PAYMENT[type] = adressParam
		$("#paymentForm").hide();
		renderPaymentAddess(ORDER_PAYMENT)
	} else {
		// 滚动到可视区域
		$("html,body").animate({
			scrollTop: $(".validate-failed").parent().offset().top - window.innerHeight * 0.3
		}, 500)
	}
})

// ***************************************

var validTime = true
if (creadit_card == 'xbPay' || creadit_card == 'wangao') {
	$('.cards-info__form--event input').on('blur', function () {
		$(this).validateItem()
	})
	// 表单校验
	$('.cards-info__form--event select[data-required]').change(function () {
		// 判断时间是否选择 和 时间大于当前时间
		let month = new Date().getMonth() + 1
		let year = new Date().getFullYear()
		if ($(this).validateItem()) {
			if ($(this).attr('name') == 'year') {
				if ($(this).val() < year) {
					$(this).validateItem(true)
					validTime = false
				} else if ($(this).val() == year) {
					$("#month").validateItem($("#month").val() < month)
					validTime = false
				}
			}
		}
	})
}

function xbPayMethod() {
	if ($(".cards-info__form--event").validate() && validTime) {
		let obj = $(".cards-info__form--event").serializeToObj()
		var paymentMethodInfo = {
			"billing_desc": "",
			"card_no": obj.card_no.replace(/\s*/g, ""),
			"expiration_month": obj.month,
			"expiration_year": obj.year,
			"cvv": obj.card_cvv,
			"first_name": obj.first_name,
			"last_name": obj.last_name,
		}
		ORDER_PAYMENT.paymentMethodInfo = paymentMethodInfo
		return true

	} else {
		return false
	}
}

$('#creditCardBtn').click(function (e) {
	if ($(this).hasClass('disabled')) {
		return false
	}
	if (ORDER_PAYMENT.payMethod == 'xbPay' || ORDER_PAYMENT.payMethod == 'wangao') {
		if (!xbPayMethod()) {
			return false
		}
	} else {
		delete ORDER_PAYMENT.paymentMethodInfo
	}
	$('[role="loading"]').show();
	getToken(function () {
		$.req({
			url: '/api/v1/pre/orders/orders',
			type: 'post',
			data: JSON.stringify(ORDER_PAYMENT),
			dataType: 'json',
			contentType: 'application/json',
			success(res) {
				if (res.code === 0) {
					switch (ORDER_PAYMENT.payMethod) {
						case 'oceanpayment':
							// 右侧产品信息（前海支付）；表单提交
							commitOcean(res.data)
							break;
						case 'cnp': case 'lianlian':
							if (Object.prototype.toString.call(res.data.backUrl).slice(8, -1) != 'Null' && res.data.backUrl != '') {
								window.location.href = res.data.backUrl
							} else {
								$.alert('danger', i18n.payment_abnormality)
								$('[role="loading"]').hide();
							}
							break;
						case 'pingpong':
							if (Object.prototype.toString.call(res.data.token).slice(8, -1) != 'Null' &&
								Object.prototype.toString.call(res.data.innerJsUrl).slice(8, -1) != 'Null' &&
								Object.prototype.toString.call(res.data.mode).slice(8, -1) != 'Null') {
								pingPong_pay(res.data.token, res.data.innerJsUrl, res.data.mode)
							} else {
								$.alert('danger', i18n.payment_abnormality)
								$('[role="loading"]').hide();
							}
							break;
						case 'pacypay':
							// 提交pacypay适配表单
							commitPacypay(res.data)
							break;
						case 'pacypayold':
							if (res.data.pacPayV1ResUrlParameter.responseCode == 80) {
								window.location.href = res.data.pacPayV1ResUrlParameter.url
							} else {
								$.alert('danger', i18n.payment_abnormality)
								$('[role="loading"]').hide();
							}
							break;
						case 'checkout': case 'glocash': case 'cardpay':
							if (Object.prototype.toString.call(res.data.oceanCommitUrl).slice(8, -1) != 'Null' && res.data.oceanCommitUrl != '') {
								window.location.href = res.data.oceanCommitUrl
							} else {
								$.alert('danger', i18n.payment_abnormality)
								$('[role="loading"]').hide();
							}
							break;
						case 'xbPay':
							const money = $('#totalPrice').data('money');
							if (Object.prototype.toString.call(res.data.order_number).slice(8, -1) != 'Null' && res.data.order_number != '') {
								window.location.href = `/payment-results.html?status=1&transcationId=${res.data.order_number}&currency=${totalRate.currency}&amount=${money}`;
							} else {
								$.alert('danger', res.msg)
								$('[role="loading"]').hide();
							}
							break;
						case 'wangao':
							const { amount, payStatus, currency, paymentIntentId } = res.data
							if (payStatus == 'SUCCEEDED') {
								window.location.href = `/payment-results.html?status=1&transcationId=${paramArr.ordersId}&currency=${currency}&amount=${amount}`;
							} else {
								failedOpt()
							}
							break;
					}
				} else {
					if (ORDER_PAYMENT.payMethod == 'xbPay' || ORDER_PAYMENT.payMethod == 'wangao') {
						$.alert('danger', res.msg)
					} else {
						$('[role="loading"]').hide();
						$.alert('danger', i18n.payment_anomaly)
					}
					$('[role="loading"]').hide();
				}
			}, error: function () {

			}
		});
	});
})

// wangao 支付
function wangaoPayment(confirmWGPayUrl, requestId, token) {
	const data = {
		request_id: requestId,
		payment_method: {
			"cvc": "123",
			"expiry_month": "12",
			"expiry_year": "2030",
			"name": "John Doe",
			"number": "4111111111111111"
		},
		type: "card"
	}
	fetch(confirmWGPayUrl, {
		method: 'post',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${token}`,
			'region': 'string',
			'x-api-effective-version': '2019-09-09',
			'x-client-ip': 'string',
			'x-client-ip-source': 'string',
		},
		body: JSON.stringify({ data })
	}).then(function (result) {
		return result.json();
	}).then(function (data) {
		console.log(data)
	})

}

// stripe支付
if (creadit_card === 'stripe') {
	$.getScript("https://js.stripe.com/v3/", function () {
		getStripe();
	});
}

function getStripe() {
	// A reference to Stripe.js
	var stripe;
	// Disable the button until we have Stripe set up on the page
	document.querySelector("button").disabled = true;
	getToken(function () {
		fetch("/vshop-site/api/v1/indexPage/stripeKey", {
			method: 'get',
			headers: {
				"Authorization": 'Bearer ' + getStorage('localstorageId')
			}
		}).then(function (result) {
			return result.json();
		})
			.then(function (data) {
				return setupElements(data);
			})
			.then(function ({
				stripe,
				card,
				clientSecret
			}) {
				document.querySelector("button").disabled = false;
				var form = document.getElementById("payment-form");
				console.log(stripe, card, clientSecret)
				form.addEventListener("submit", function (event) {
					event.preventDefault();
					pay(stripe, card, clientSecret);
				});
			});

		var setupElements = function (data) {
			stripe = Stripe(data.msg);
			/* ------- Set up Stripe Elements to use in checkout form ------- */
			var elements = stripe.elements();
			var style = {
				base: {
					color: "#32325d",
					fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
					fontSmoothing: "antialiased",
					fontSize: "16px",
					"::placeholder": {
						color: "#aab7c4"
					}
				},
				invalid: {
					color: "#fa755a",
					iconColor: "#fa755a"
				}
			};

			var card = elements.create("card", {
				style: style
			});
			card.mount("#card-element");
			return {
				stripe: stripe,
				card: card,
				clientSecret: data.clientSecret
			};
		};

		var handleAction = function (clientSecret) {
			stripe.handleCardAction(clientSecret).then(function (data) {
				if (data.error) {
					showError("Your card was not authenticated, please try again");
				} else if (data.paymentIntent.status === "requires_confirmation") {
					fetch("/vshop-third/pay", {
						method: "POST",
						headers: {
							"Authorization": 'Bearer ' + getStorage('localstorageId'),
							"Content-Type": "application/json"
						},
						body: JSON.stringify({
							paymentIntentId: data.paymentIntent.id
						})
					})
						.then(function (result) {
							return result.json();
						})
						.then(function (json) {
							console.log("json-94-->", json);
							if (json.error) {
								showError(json.error);
							} else {
								orderComplete(clientSecret);
							}
						});
				}
			});
		};

		/*
		 * Collect card details and pay for the order
		 */
		var pay = function (stripe, card) {
			changeLoadingState(true);

			// Collects card details and creates a PaymentMethod
			stripe
				.createPaymentMethod("card", card)
				.then(function (result) {
					if (result.error) {
						showError(result.error.message);
					} else {
						ORDER_PAYMENT.paymentMethodId = result.paymentMethod.id;
						return fetch("/vshop-site/api/v1/pre/orders/orders", {
							method: "POST",
							headers: {
								"Authorization": 'Bearer ' + getStorage('localstorageId'),
								"Content-Type": "application/json"
							},
							body: JSON.stringify(ORDER_PAYMENT)
						});
					}
				})
				.then(function (result) {
					return result.json();
				})
				.then(function (response) {
					if (response.code != 0) {
						$.alert('danger', i18n.payment_abnormality)
					}
					if (response.error) {
						showError(response.error);
						$.alert('danger', i18n.payment_abnormality)
					} else if (response.data.requiresAction) {
						// Request authentication
						handleAction(response.data.clientSecret);
					} else if (Object.prototype.toString.call(response.data.stripeError).slice(8, -1) != 'Null') {
						failedOpt()
						showError(response.data.stripeError)
					} else {
						orderComplete(response.data.clientSecret);
					}
				});
		};

		/* ------- Post-payment helpers ------- */

		/* Shows a success / error message when the payment is complete */
		var orderComplete = function (clientSecret) {
			stripe.retrievePaymentIntent(clientSecret).then(function (result) {
				var paymentIntent = result.paymentIntent;
				let amount = $('#totalPrice').data('money');
				if (paymentIntent.status === "succeeded") {
					window.location.href = `/payment-results.html?status=1&transcationId=${paramArr.ordersId}&currency=${paymentIntent.currency}&amount=${amount}`;
				} else {
					// window.location.href = `/payment-results.html?status=0`;
					failedOpt()
				}
				changeLoadingState(false);
			});
		};

		var showError = function (errorMsgText) {
			changeLoadingState(false);
			var errorMsg = document.querySelector(".sr-field-error");
			errorMsg.textContent = errorMsgText;
			setTimeout(function () {
				errorMsg.textContent = "";
			}, 4000);
		};

		// Show a spinner on payment submission
		var changeLoadingState = function (isLoading) {
			if (isLoading) {
				document.querySelector("button").disabled = true;
				document.querySelector("#spinner").classList.remove("hidden");
				document.querySelector("#button-text").classList.add("hidden");
			} else {
				document.querySelector("button").disabled = false;
				document.querySelector("#spinner").classList.add("hidden");
				document.querySelector("#button-text").classList.remove("hidden");
			}
		};

	})
}

function pingPong_pay(token, innerJsUrl, mode) {
	let script = document.createElement('script');
	script.setAttribute('src', innerJsUrl);
	document.body.prepend(script);
	if (script.readyState) {
		script.onreadystatechange = function () {
			if (script.readyState == 'complete' || script.readyState == 'loaded') {
				pingPongSdk(token, mode)
			}
		}
	} else {
		script.onload = function () {
			pingPongSdk(token, mode)
		}
	}
}

function pingPongSdk(token, mode) {
	var client = new ppPay({
		debug: false
	})
	// const token = document.getElementById("token").value;
	var sdkConfig = {
		token: token,
		lang: 'en',
		// 本地测试模式 local test build (本地 ，测试 ，线上) (必填参数)
		mode: mode,
		// 支付界面绑定的 div id (可选参数)
		root: ".payment_btn--content",
		base: { // 弹框样式配置
			priceBgColor: "#fff",
			priceFontColor: "#1FA0E8",
			priceFontSize: "32px",
			// 框体样式
			width: '100%', // 框体宽度
			height: 'auto', // 框体⾼度
			fontSize: '14px', // 整体字体⼤⼩
			backgroundColor: '#fff', // 整体弹框背景⾊
			borderRadius: '0px',
			borderWidth: '1px',
			borderColor: 'transparent', // 弹边框颜⾊ transparent 为透明，⽀持 rgba 和 hex
			maskBackgroundColor: 'rgba(0,0,0,.5)',
			maskzIndex: '100',
			loadingColor: '#20a0e8', // 加载动画颜⾊
			loadingBackgroundColor: 'rgba(255,255,255,0.8)', // 动画背景⾊，rgba 格式
			billPadding: '0px',
			billColor: 'rgba(0, 0, 0, 0.4)',
			billFontSize: '14px',
			locatedPadding: '20px 0',
			locatedColor: "#999999",
			locatedBgColor: '#eee',
			locatedFontSize: '14px',
			showHeader: true, // 是否展示头部
			showHeaderLabel: true, // 是否展示头部字体
			headerLabelFont: "Credit Card", // ⾃定义头部字体内容
			headerColor: '#333333', // 头部字体颜⾊
			headerSize: '16px', // 头部字体⼤⼩
			headerBackgroundColor: '#fbfbfb', // 头部背景⾊
			headerPadding: '20px',
			headerfontWeight: '400', // 粗体或细体
			btnSize: '100%', // 按钮宽度百分⽐或者 px
			btnColor: '#fff', // 按钮字体颜⾊
			btnFontSize: '14px', // 按钮字体⼤⼩
			btnPaddingX: '20px', // 字体与宽体左右间距
			btnPaddingY: "10px", // 顶部和底部间距
			btnBackgroundColor: '#1fa0e8', // 按钮背景⾊
			btnBorderRadius: '4px', // 按钮圆⻆
			btnBorderColor: '#1fa0e8',
			btnMarginTop: '0px', // button 离顶部距离
		}
	}
	client.createPayment(sdkConfig, function (res) {
		// 回调函数中会返回支付成功还是失败
		console.log(res)
	})
	// $('.payment_btn--content').hide()
}


$('#point').on('click', function () {
	let disabled = $(this).prop('checked')
	$('#creditCardBtn').prop('disabled', !disabled)
})

if (alipayStatus) {
	var curArr = ['PHP', 'IDR', 'KRW', 'HKD']
	let rateArr = CONFIGDATA.currency
	// 把汇率渲染到列表里
	getrata(curArr, rateArr)
	let walletReqPaymentId = getuuidstr()
	//存储到缓存里，用户确认要取
	setStorage('walletReqPaymentId', walletReqPaymentId);
	let walletCurrency = $('.wallet-content--event .active').data('rate')
	let walletTotalPrice = Math.round(totalPriceUsd * 100 * walletCurrency) / 100
	let walletType = '1'
	let currencyd = 'PHP'
	$('.wallet-content--event').on('click', '.wallet-item', function (e) {
		// 切换支付时重新拿去uuid
		walletReqPaymentId = getuuidstr()
		//存储到缓存里，用户确认要取
		setStorage('walletReqPaymentId', walletReqPaymentId);
		currencyd = $(this).data('key') //货币单位
		walletCurrency = parseFloat($(this).data('rate'))
		if (walletCurrency == 0) {
			$('#alipayBtn').attr('disabled', 'false')
		} else {
			$('#alipayBtn').removeAttr('disabled', 'true')
		}

		$(this).addClass('active').siblings().removeClass('active');
		walletType = $(this).attr('data-type')
		let wallet = $(this).attr('data-wallet')
		$('.' + wallet).addClass('active').siblings().removeClass('active');
		if (currencyd == 'KRW') {
			walletTotalPrice = Math.round(totalPriceUsd * walletCurrency)
		} else if (currencyd == 'IDR') {
			walletTotalPrice = Math.ceil(totalPriceUsd * walletCurrency)
		} else {
			walletTotalPrice = Math.round(totalPriceUsd * 100 * walletCurrency) / 100
		}
		$('#alipayTotal').html(walletTotalPrice + ' ' + currencyd)
	})

	$('#alipayTotal').html(walletTotalPrice + ' ' + currencyd)
	let isClickAlipay = true
	$('#alipayBtn:not([disabled])').on('click', function () {
		if (isClickAlipay) {
			isClickAlipay = false
			let orderDeepCopy = Object.assign({}, ORDER_PAYMENT);
			orderDeepCopy.payMethod = 'alipay'
			orderDeepCopy.walletTotalPrice = walletTotalPrice
			orderDeepCopy.walletType = walletType
			orderDeepCopy.walletCurrency = currencyd
			orderDeepCopy.walletReqPaymentId = walletReqPaymentId
			getToken(function () {
				$.req({
					url: '/api/v1/pre/orders/orders',
					type: 'post',
					data: JSON.stringify(orderDeepCopy),
					dataType: 'json',
					contentType: 'application/json',
					success(res) {
						isClickAlipay = true
						if (res.code == 0) {
							showModal('.completed-modal')
							window.open(res.data.oceanCommitUrl);
						}
					}
				})
			})
		}
	})
	//点击用户是否已完成付款提示按钮
	$('#alipayCompleted').on('click', function () {
		let walletReqPaymentId = getStorage('walletReqPaymentId')
		getToken(function () {
			$.ajax({
				url: '/vshop-third/payments/inquiryPayment/' + walletReqPaymentId,
				type: 'get',
				dataType: 'json',
				success(res) {
					if (res.paymentStatus === "SUCCESS") {
						let productDataArr = JSON.parse(getStorage('productData'));
						productDataArr.currency = res.paymentAmount.currency;
						setStorage('productData', JSON.stringify(productDataArr))
						setTimeout(function () {
							window.location.href = `/payment-results.html?status=1&transcationId=${paramArr.ordersId}&currency=${res.paymentAmount.currency}&amount=${res.paymentAmount.value}`;
						}, 300);
					} else if (res.paymentStatus === "FAIL" || res.paymentStatus === "PROCESSING") {
						hideModal('.completed-modal')
						failedOpt()
					}
				}
			});
		})
	})
}
function getrata(cur, arr) {
	cur.forEach(cur_item => {
		let rate = arr.find(item => item.currency === cur_item).rate
		// 给Alipay + PARTNER 方式 赋data-rate
		$(`.wallet-content--event [data-key=${cur_item}]`).data('rate', rate)
		// 回显汇率
		$(`i[data-key=${cur_item}]`).html(rate)
	})
}
function tax(countryName) {
	const total_price = parseFloat($('#totalPrice').data('money')) - parseFloat($('#tax').data('tax'))
	const taxRateItem = CONFIGDATA.taxRateList.find(item => {
		return item.nameEn == countryName
	})
	let tax = 0
	if (taxRateItem) {
		$('.tax--event').show()
		taxVal = taxRateItem.taxRate / 100
		tax = formatMoneyRate(total_price * taxVal)
		$('#tax').text(totalRate.symbol + tax).data('tax', tax)
		$('#totalPrice').text((totalRate.symbol + formatMoneyRate(total_price * (taxVal + 1)).toFixed(2))).data('money', formatMoneyRate(total_price * (taxVal + 1)))
	} else {
		taxVal = 0
		tax = 0
		$('#tax').text(totalRate.symbol + 0).data('tax', 0)
		$('.tax--event').hide()
		$('#totalPrice').text(totalRate.symbol + total_price).data('money', total_price)
	}
	ORDER_PAYMENT.taxRatePrice = tax
}

