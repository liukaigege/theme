// 支持COD货到包邮的国家列表
var CODCountry = [
	{
		countryCode: 'PHL',
		countryKey: 'Philippines',
		countryName: '菲律宾',
	},
	{
		countryCode: 'THA',
		countryKey: 'Thailand',
		countryName: '泰国',
	},
	{
		countryCode: 'IDN',
		countryKey: 'Indonesia',
		countryName: '印度尼西亚',
	},
	{
		countryCode: 'SGP',
		countryKey: 'Singapore',
		countryName: '新加坡',
	},
	{
		countryCode: 'VNM',
		countryKey: 'Vietnam',
		countryName: '越南',
	},
	{
		countryCode: 'KHM',
		countryKey: 'Cambodia',
		countryName: '柬埔寨',
	},
	{
		countryCode: 'JPN',
		countryKey: 'Japan',
		countryName: '日本',
	},
]
var version = new Date().getTime()
var $webUrl = window.location.href //

function getStorage(key) {
	return localStorage.getItem(key)
}

//设置localStorage
function setStorage(key, val, time) {
	// 汇率
	if (getStorage(key)) {
		deleteStorage(key)
	}
	localStorage.setItem(key, val)
	if (time) {
		localStorage.setItem(key + '__expires__', time)
	}
}

// 预览汇率不受影响
// {
// 	currency: 'USD',
// 	symbol: '$',
// 	rate: '1',
// 	pic: 'https://shopvango.com/static-page/currency/USD.svg',
// }
const isIframe = $.getParam('isIframe') == 1
const currentCurrency = isIframe ? JSON.parse(getStorage('currency')).currencys : CONFIGDATA.currency
const defaultRate = currentCurrency.find((v) => v.mainCurrency == 1)
const rateStorage = JSON.parse(getStorage('currentRate'))
const currentRate = rateStorage ? rateStorage : defaultRate
setStorage('currentRate', JSON.stringify(!isIframe ? currentRate : defaultRate))

//删除localStorage
function deleteStorage(key) {
	localStorage.removeItem(key)
	localStorage.removeItem(key + '__expires__')
}
//设置cookie
function setCookie(cname, cvalue) {
	document.cookie = cname + '=' + cvalue
}
//获取cookie
function getCookie(cname) {
	var name = cname + '='
	var ca = document.cookie.split(';')
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i]
		while (c.charAt(0) == ' ') c = c.substring(1)
		if (c.indexOf(name) != -1) return c.substring(name.length, c.length)
	}
	return ''
}
/* 组装数据 */
function analyzeData(eventVal, edata, goodsList) {
	var sendObj = {}
	// sendObj.btype = $btype;
	sendObj.sh = window.screen.height || 0
	sendObj.sw = window.screen.width || 0
	// sendObj.cd = window.screen.colorDepth || 0;
	sendObj.lang = navigator.language || ''
	sendObj.userAgent = navigator.userAgent || ''
	sendObj.title = document.title || ''
	sendObj.domain = document.domain || ''
	sendObj.pageUrl = document.URL.includes('?') ? document.URL.split('?')[0] : document.URL
	sendObj.referrer = getStorage('sourceurl') || ''
	sendObj.promotion = getCookie('promotionLogo') || ''
	var $pathname = window.location.pathname.split('/')
	// 页面类型：首页 index 商品分类列表 typeList 检索结果列表 searchList 商品详情 detail 购物车 cart 结账 支付 payment 支付成功 payres 订单查询 orderSearch 订单结果orderList 联系我们 contactus 静态页面 static
	var $pathnamePre = ''
	if ($pathname[$pathname.length - 1] && $pathname[$pathname.length - 1].indexOf('.html')) {
		var Url = $pathname[$pathname.length - 1].split('.html')[0]
		if (Url == 'index') {
			$pathnamePre = 'index'
		} else if (Url.includes('productDetail_')) {
			$pathnamePre = 'detail'
		} else if (Url == 'cart') {
			$pathnamePre = 'cart'
		} else if (Url == 'information' || Url == 'payment') {
			$pathnamePre = 'payment'
		} else if (Url == 'orderSearch') {
			$pathnamePre = 'orderSearch'
		} else if (Url == 'orderDetail') {
			$pathnamePre = 'orderList'
		} else if (Url == 'contact') {
			$pathnamePre = 'contactus'
		} else if (Url == 'static') {
			$pathnamePre = 'static'
		} else if (Url == 'productList' || Url == 'search') {
			$pathnamePre = 'searchList'
		} else if (Url.includes('productList_')) {
			$pathnamePre = 'typeList'
		} else if (Url.includes('payment-results')) {
			$pathnamePre = 'payment-results'
		}
	} else {
		$pathnamePre = 'index'
	}
	if (
		$webUrl.indexOf('?') != -1 &&
		(getUrlVars($webUrl).status == 1 ||
			getUrlVars($webUrl).status == 'PAIED' ||
			getUrlVars($webUrl).status == 'PS' ||
			getUrlVars($webUrl).status == 'SUCCESS' ||
			getUrlVars($webUrl).status == 'cod')
	) {
		$pathnamePre = 'payres'
	}
	sendObj.etype = eventVal || ''
	sendObj.edata = {}
	sendObj.pageType = $pathnamePre || ''
	if (Object.prototype.toString.call(getStorage('oldDynamicId')).slice(8, -1) != 'Null' && getStorage('oldDynamicId')) {
		sendObj.shop = window.shopInfo.shopId || ''
		sendObj.uid = getStorage('oldDynamicId')
	}
	if (edata && Object.prototype.toString.call(edata).slice(8, -1) == 'Object') {
		for (var key in edata) {
			sendObj.edata[key] = edata[key]
		}
	}
	let goodsListArr = []
	if (goodsList.length && Object.prototype.toString.call(goodsList).slice(8, -1) == 'Array') {
		goodsList.forEach((item) => {
			let itemList = {}
			for (var key in item) {
				itemList[key] = item[key]
			}
			goodsListArr.push(itemList)
		})
	}
	sendObj.edata.goodsList = goodsListArr
	// var $baseVal = $.base64.encode(JSON.stringify(sendObj), true);
	var $baseVal = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(JSON.stringify(sendObj)))
	var realData = 'eWi' + Math.ceil(Math.random() * 8) + 'R' + Math.ceil(Math.random() * 8) + 'h' + $baseVal
	let timeStamp = new Date().getTime()
	return {
		id: realData,
		timeStamp,
	}
}

/* 发送分析 */
function sendAnalyze(eventVal, productData = {}, goodsList = []) {
	$.ajax({
		type: 'get',
		url: preUrl + '/vshop-plugin/api/v1/behavior/origin',
		data: analyzeData(eventVal, productData, goodsList),
		dataType: 'json',
		success: function (response) {},
	})
}

function getRanArray(count) {
	var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
	var shuffled = arr.slice(0),
		i = arr.length,
		min = i - count,
		temp,
		index
	while (i-- > min) {
		index = Math.floor((i + 1) * Math.random())
		temp = shuffled[index]
		shuffled[index] = shuffled[i]
		shuffled[i] = temp
	}
	return shuffled.slice(min)
}

ValidSourceVal()

function ValidSourceVal() {
	if (getStorage('sourceurl') && getStorage('sourceurl__expires__')) {
		var oldSourceurlTime = getStorage('sourceurl__expires__')
		;(oldSourceurlTime = parseInt(oldSourceurlTime)), (currentSourceurTime = new Date().getTime())
		//过期时间为7 * 24小时
		if (!compareTime(oldSourceurlTime, currentSourceurTime, 7 * 24)) {
			setStorage('sourceurl', getSourceVal(), new Date().getTime())
		}
	} else {
		setStorage('sourceurl', getSourceVal(), new Date().getTime())
	}
}

function getSourceVal() {
	var sourceVal = '',
		preUrl = '',
		referrer = document.referrer
	if (referrer && !referrer.includes(document.domain)) {
		//上一跳地址是否存在
		preUrl = $.url.setUrl(referrer).attr('host')

		if (preUrl.includes('?')) {
			var zUrl = preUrl.split('.')[0]
			return (sourceVal = zUrl)
		} else {
			return (sourceVal = preUrl)
		}
	} else {
		return (sourceVal = 'direct')
	}
}

function returnChangeVal(val) {
	if (val != 'facebook' && val != 'google' && val != 'instagram') {
		return 'direct'
	} else {
		return val
	}
}

function getDdentificationVal() {
	var promotionLogo = $.url.setUrl(window.location.url).param('promotionLogo'),
		sourceVal = ''
	if (promotionLogo && promotionLogo != '' && Object.prototype.toString.call(promotionLogo).slice(8, -1) != 'Null') {
		sourceVal = promotionLogo
	} else {
		sourceVal = ''
	}
	if (!getCookie('promotionLogo')) {
		setCookie('promotionLogo', sourceVal)
	}
}

//比较二个时间节点
function compareTime(startTime, endTime, interval) {
	return startTime + 3600000 * interval > endTime
}

function contrastTime(isChange, endTime, startTime) {
	let now = new Date().getTime()
	if (isChange) {
		let sTime = new Date(startTime).getTime()
		let eTime = new Date(endTime).getTime()
		if ((sTime && eTime && now >= sTime && now <= eTime) || (sTime && now >= sTime && !eTime)) {
			return true
		} else {
			return false
		}
	} else {
		if ((startTime && endTime && now > startTime && now < endTime) || (startTime && now > startTime && !endTime)) {
			return true
		} else {
			return false
		}
	}
}
// 带时区的时间比较
function contrastTimeZone(isChange, endTime, startTime) {
	let now = timezone()
	if (isChange) {
		let sTime = new Date(startTime).getTime() + new Date().getTimezoneOffset() * 60 * 1000 // 获取格林威治时间戳 正常时间戳（yyyy-mm-dd）会加上时区时间戳
		let eTime = new Date(endTime).getTime() + new Date().getTimezoneOffset() * 60 * 1000
		if ((sTime && eTime && now >= sTime && now <= eTime) || (sTime && now >= sTime && !eTime)) {
			return true
		} else {
			return false
		}
	} else {
		if ((startTime && endTime && now > startTime && now < endTime) || (startTime && now > startTime && !endTime)) {
			return true
		} else {
			return false
		}
	}
}

/* 获取url参数 */
function getUrlVars(url, type = 1) {
	var hash
	var myJson = {}
	var hashes = url.slice(url.indexOf('?') + 1).split('&')
	for (var i = 0; i < hashes.length; i++) {
		hash = hashes[i].split('=')
		if (type === 1) {
			myJson[hash[0]] = hash[1]
		} else {
			myJson = hash[1]
		}
	}
	return myJson
}
var shopId = window.shopInfo.shopId
var dynamicAuth = 'Basic ' + window.btoa(shopId + ':vshop2020')
setStorage('shopid', shopId)
setStorage('domainurl', window.location.host)
var urlPrefix = window.location.href.split(':')[0]
preUrl = urlPrefix + '://' + window.location.host

function tokenReq(storageData, Fn) {
	$.ajax({
		type: 'post',
		url: preUrl + '/vshop-auth/oauth/token',
		data: storageData,
		dataType: 'json',
		headers: {
			Authorization: dynamicAuth, //,
		},
		success: function (response) {
			if (response.data.access_token) {
				setStorage('oldDynamicId', storageData.localstorage_id)
				setStorage('localstorageId', response.data.access_token, new Date().getTime())
				getDdentificationVal()
				Fn && Fn()
			}
		},
	})
}

function getToken(Fn) {
	var dynamicStorageId = new Date().getTime() * 1000 + getRanArray(4).join('')
	var storageData = {
		grant_type: 'password',
		auth_type: 'site',
		password: '',
		localstorage_id: dynamicStorageId,
		username: dynamicStorageId,
	}
	ValidSourceVal()
	if (
		getStorage('localstorageId') &&
		getStorage('localstorageId__expires__') &&
		getStorage('domainurl') &&
		getStorage('shopid') &&
		getStorage('domainurl') == window.location.host
	) {
		var oldTime = getStorage('localstorageId__expires__')
		;(oldTime = parseInt(oldTime)), (currentTime = new Date().getTime())
		//过期时间为24小时
		if (!compareTime(oldTime, currentTime, 24)) {
			//过期重新发接口 获取localstorage_id
			storageData.localstorage_id = getStorage('oldDynamicId')
			storageData.username = getStorage('oldDynamicId')
			tokenReq(storageData, Fn)
		} else {
			//未过期取localstorage中的参数
			if (!getCookie('promotionLogo')) getDdentificationVal()
			Fn && Fn()
		}
	} else {
		//首次进入发接口 获取localstorage_id
		tokenReq(storageData, Fn)
	}
}

//全局的ajax 调用即可
$.req = function (options, allowOrigin = false) {
	options.url = preUrl + `${allowOrigin ? '/vshop' : '/vshop-site'}` + options.url
	options.headers = {
		Authorization: 'bearer ' + getStorage('localstorageId'),
	}
	return $.ajax(
		$.extend(
			{
				type: 'get',
				headers: {
					Authorization: 'bearer ' + getStorage('localstorageId') || '',
				},
				dataType: 'json',
				error: function (res) {
					//error 回调
					if (
						res.responseText &&
						JSON.parse(res.responseText).code &&
						(JSON.parse(res.responseText).code == 401 || JSON.parse(res.responseText).code == 500)
					) {
						var storageData = {
							grant_type: 'password',
							auth_type: 'site',
							password: '',
						}

						var dynamicStorageId = new Date().getTime() * 1000 + getRanArray(4).join('')
						storageData.localstorage_id = getStorage('oldDynamicId') || dynamicStorageId
						storageData.username = getStorage('oldDynamicId') || dynamicStorageId

						$.ajax({
							type: 'post',
							url: preUrl + '/vshop-auth/oauth/token',
							data: storageData,
							headers: {
								Authorization: dynamicAuth,
							},
							success: function (response) {
								if (response.data.access_token) {
									setStorage('oldDynamicId', storageData.localstorage_id)
									setStorage('localstorageId', response.data.access_token, new Date().getTime())
									ValidSourceVal()
									getDdentificationVal()
									return false
								}
							},
						})
					} else {
						if (typeof error === 'undefined' || typeof error != 'function') {
							layer.msg('Connection failed!', {
								icon: 5,
								time: 1000,
							})
						} else {
							typeof error === 'function' && error(res)
						}
					}
				},
			},
			options
		)
	)
}
//判断浏览内核Safari返回.jpg 其他返回.webp
function returnSuffixName(url) {
	let userAgent = navigator.userAgent
	let result = /Safari/.test(userAgent) && !/Chrome/.test(userAgent)
	if (url.indexOf('cdn.shopifycdn.net') != -1) {
		return url
	} else if (url.indexOf('vshop') != -1 && (url.lastIndexOf('.jpg') != -1 || url.lastIndexOf('.webp') != -1 || url.lastIndexOf('.JPG') != -1)) {
		let len =
			url.lastIndexOf('.jpg') != -1
				? url.lastIndexOf('.jpg')
				: '' || url.lastIndexOf('.webp') != -1
				? url.lastIndexOf('.webp')
				: '' || url.lastIndexOf('.JPG') != -1
				? url.lastIndexOf('.JPG')
				: ''
		let newUrl = url.substr(0, len)
		if (result) {
			return newUrl + '.jpg'
		} else {
			return newUrl + '.webp'
		}
	} else {
		return url
	}
}

// 转换汇率(不加货币单位)
function getMoneyrate(money) {
	if (!money) return 0
	totalRate = JSON.parse(getStorage('currentRate'))
	if (typeof money === 'string') {
		money = money.replace(totalRate.symbol, '')
	}
	money = parseFloat(money)
	if (Object.prototype.toString.call(totalRate).slice(8, -1) == 'Object') {
		var totalMoney = totalRate.rate * money
		var result = parseFloat(totalMoney),
			result = Math.round(totalMoney * 100) / 100
		var s_x = result.toString()
		if (totalRate.currency !== 'JPY' && totalRate.currency !== 'TWD') {
			var pos_decimal = s_x.indexOf('.')
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
		return Number(s_x)
	} else {
		return Number(money)
	}
}

//获取汇率转换后的价格
function getMoney(money) {
	if (!money) return 0
	let currentRate = JSON.parse(getStorage('currentRate'))
	if (typeof money === 'string') {
		money = money.replace(currentRate.symbol, '')
	}
	money = parseFloat(money)
	if (currentRate && currentRate != '') {
		let totalMoney = currentRate.rate * money
		let result = parseFloat(totalMoney)
		result = Math.round(totalMoney * 100) / 100
		let s_x = result.toString()
		if (currentRate.currency !== 'JPY' && currentRate.currency !== 'TWD') {
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
		return currentRate.symbol + (s_x - 0)
	} else {
		return currentRate.symbol + Number(money)
	}
}

// 时区转化
function timezone() {
	let $time = new Date().getTimezoneOffset() * 60 * 1000 + new Date().getTime() //获取格林威治时间
	let $timezone = window.shopInfo.timezone.split('GMT')[1]
	let time = $timezone.substr(1, $timezone.length - 1)
	let hour = Number(time.split(':')[0]) // 获取相差小时
	let minute = Number(time.split(':')[1]) //获取相差分钟
	let differ_time = hour * 60 * 60 * 1000 + minute * 60 * 1000
	if ($timezone.substr(0, 1) == '-') {
		$time = $time - differ_time
	} else if ($timezone.substr(0, 1) == '+') {
		$time = $time + differ_time
	}
	return $time
}

// 产生UUid
function getuuidstr() {
	var s = []
	var hexDigits = '0123456789abcdef'
	for (var i = 0; i < 36; i++) {
		s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
	}
	s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
	s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
	s[8] = s[13] = s[18] = s[23] = '-'
	var uuid = s.join('')
	uuid = uuid.replace(/-/g, '')
	return uuid
}

function deepClone(obj) {
	let objClone = Array.isArray(obj) ? [] : {}
	if (obj && typeof obj === 'object') {
		for (let key in obj) {
			if (obj[key] && typeof obj[key] === 'object') {
				objClone[key] = deepClone(obj[key])
			} else {
				objClone[key] = obj[key]
			}
		}
	}
	return objClone
}

function formatMoney(money) {
	money = money + ''
	var totalMoeny = money.split('.')[1]
	var preMoeny = ''
	if (totalMoeny == '00' || totalMoeny == '0') {
		preMoeny = money.split('.')[0]
	} else {
		if (money.indexOf('.') != -1) {
			var cutBefore = money.split('.')[0],
				cutAfter = money.split('.')[1].substr(0, 1)
			if (cutAfter != 0) {
				preMoeny = cutBefore + '.' + cutAfter.substr(0, 1)
			} else {
				preMoeny = cutBefore
			}
		} else {
			preMoeny = money
		}
	}
	return preMoeny
}

function sellingPrice($sellingPrice, $customVal) {
	let $price = 0
	$customVal.forEach((item) => {
		if (item.hasOwnProperty('price') && item.price != '' && item.price != null) {
			$price = $price + Number(item.price)
		}
		if (item.hasOwnProperty('childList')) {
			item.childList.forEach((val) => {
				$price = $price + Number(val.price)
			})
		}
	})
	$sellingPrice += $price
	return $sellingPrice
}
var $pathname = window.location.pathname.split('/')

$(function () {
	// 初始化购物车数目
	let $shopping_num = 0
	if (localStorage.getItem('shopping_num')) {
		$shopping_num = parseInt(localStorage.getItem('shopping_num'))
	}
	if ($shopping_num > 99) {
		$('.home_bag i').text('99+')
	} else {
		$('.home_bag i').text($shopping_num)
	}
	// 页面发送数据
	if (($pathname[$pathname.length - 1] && $pathname[$pathname.length - 1].indexOf('.html')) || window.location.pathname == '/') {
		var Url = $pathname[$pathname.length - 1].split('.html')[0]
		if (Url.indexOf('_') != -1) {
			Url = Url.split('_')[0]
		}
		if (Url != 'productDetail' && Url != 'information' && Url != 'payment') {
			sendAnalyze('view')
		}
	}
})
// 金额转化
function totalCartList(cart_info) {
	const totalCartList = {
		couponDiscount: getMoneyRateNum(cart_info.couponDiscount),
		promotionDiscount: getMoneyRateNum(cart_info.promotionDiscount),
	}
	let goodsList = deepClone(cart_info.goodsList)
	let afterDicountTotal = 0
	goodsList.forEach((item) => {
		item.defaultPrice = getMoneyRateNum(item.defaultPrice) || ''
		item.discountPrice = getMoneyRateNum(item.discountPrice)
		item.afterDicountPrice = formatMoneyRate(item.discountPrice * item.quantity)
		item.originalPrice = getMoneyRateNum(item.originalPrice)
		item.sellingPrice = getMoneyRateNum(item.sellingPrice) || ''
		afterDicountTotal = formatMoneyRate(item.afterDicountPrice + afterDicountTotal)
	})
	totalCartList.goodsList = goodsList
	totalCartList.afterDicountTotal = formatMoneyRate(afterDicountTotal - totalCartList.couponDiscount - totalCartList.promotionDiscount)
	return totalCartList
}

function getMoneyRateNum(money) {
	if (!money) return 0
	totalRate = JSON.parse(getStorage('currentRate'))
	if (getStorage('currentRate') && Object.prototype.toString.call(totalRate).slice(8, -1) == 'Object') {
		let result = 0
		if (totalRate.currency == 'JPY' || totalRate.currency == 'TWD') {
			result = Math.round(totalRate.rate * money)
		} else {
			result = Math.round(totalRate.rate * money * 100) / 100
		}
		return Number(result)
	} else {
		return Number(money)
	}
}

function formatMoneyRate(money) {
	let result = 0,
		totalRate = JSON.parse(getStorage('currentRate'))
	if (totalRate.currency == 'JPY' || totalRate.currency == 'TWD') {
		result = Math.round(money)
	} else {
		result = Math.round(money * 100) / 100
	}
	return result
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

function getRandomString(len = 32) {
	var $chars = 'ABCDEFGHJKMNPQRSTWXYZ0123456789'
	var maxPos = $chars.length
	var val = ''
	for (i = 0; i < len; i++) {
		val += $chars.charAt(Math.floor(Math.random() * maxPos))
	}
	return val
}

//获取当前格林尼治时间
function getGreenwichTime() {
	var dt = new Date()
	dt.setMinutes(dt.getMinutes() + dt.getTimezoneOffset())
	return dt.getTime()
}

// facebook api数据转化
function facebookApi(facebookId, data) {
	const TOKEN = BASEDATA.textInfo.tokenFacebook
	$.ajax({
		url: `https://graph.facebook.com/v8.0/${facebookId}/events?access_token=${TOKEN}`,
		type: 'post',
		dataType: 'json',
		contentType: 'text/plain; charset=utf-8',
		data: JSON.stringify(data),
		success(res) {},
	})
}
// facebook api数据转化 参数
function facebookApiParam(custom_data, event_name, eventID) {
	const fbqApi = {
		data: [
			{
				event_name: event_name,
				event_time: getGreenwichTime(),
				event_id: eventID,
				event_source_url: window.location.href,
				user_data: {
					fbp: getCookie('_fbp'),
					fbc: getCookie('_fbc'),
				},
				custom_data,
			},
		],
	}
	return fbqApi
}

// pinterest 埋点数据 ~~~~~Start~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/*  pinterestFn() pinterest数据埋点函数说明：
 *   1. 开发时间：2021-07-02
 *   2. 开发者：王新国
 *   3. 参考文档：https://help.pinterest.com/zh-hans/business/article/add-event-codes
 *   4. 函数入参数据结构及说明:
 *      1) data => 函数入参，类型为Object
 *      2) data.pinterestYOUR_TAG_ID => 接收目标的id,固定值（可不传）
 *      3) data.pinterestEventType => 事件名称：加购物车=>AddToCart 页面信息=>pagevisit 结账(交易完成)=>checkout 其他参考第3条注释的参考文档 --> 事件代码类型
 *      4) data.pinterestData => pinterest实际使用数据数据，即发送的数据
 *      5) data.pinterestData 数据结构及说明：
 *         a) data.pinterestData.value => 加购或订单总价
 *         b) data.pinterestData.order_quantity => 加购或订单总数量
 *      其他数据，参照第3条注释的参考文档 --> 添加事件数据 --> 在IMG标签中包含事件数据
 *   5. pinterestFn函数内部的pinterestYOUR_TAG_ID默认值根据不同的平台查看账号而不同
 *   6. 同一个事件类型在一个页面只能添加一个，多次添加覆盖上一条。如添加两个AddToCart事件。不同事件不影响，如AddToCart与pagevisit互不影响。
 *   7. 使用示例：
 *      1) 声明一个入参数据 ==>
 *         let pinterestSetData={
 *            pinterestYOUR_TAG_ID:'',
 *            pinterestEventType:'AddToCart',
 *            pinterestData:{
 *              value:'0.99',
 *              order_quantity:1,
 *            }
 *          }
 *      2) 调用函数，将入参传入 => pinterestFn(pinterestSetData)
 */
function pinterestFn(data) {
	let { pinterestEventType, pinterestData } = data,
		pinterestYOUR_TAG_ID = data.pinterestYOUR_TAG_ID || BASEDATA.textInfo.codePrinterest,
		pinterestImgId = 'pinterest' + pinterestEventType, //DOM元素的ID，每种类型的数据只有一个DOM结构
		pinterestDataString = ''
	if (pinterestYOUR_TAG_ID) {
		for (let pinterestKey in pinterestData) {
			pinterestDataString += `
		  &ed[${pinterestKey}]=${pinterestData[pinterestKey]}
		`
		}
		let pinterestImgString = `
		<img
		  id="${pinterestImgId}"
		  height="1"
		  width="1"
		  style="display:none;"
		  alt=""
		  src="https://ct.pinterest.com/v3/?tid=${pinterestYOUR_TAG_ID}&event=${pinterestEventType}${pinterestDataString}&noscript=1"
		/>
	  `
		$('#' + pinterestImgId).remove()
		$('body').append(pinterestImgString)
	}
}
// pinterest 埋点数据 ~~~~~End~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
