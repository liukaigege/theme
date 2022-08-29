/**
 * 这里面存放页面调用的公共方法，按照js规范来写，使用$.fn.extend注册到jq上，使用文档注释
 */

;(function ($) {
	const browser = {
		versions: (function () {
			const u = navigator.userAgent
			return {
				trident: u.indexOf('Trident') > -1, //IE内核
				presto: u.indexOf('Presto') > -1, //opera内核
				webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
				gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
				mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
				ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
				android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, //android终端
				iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
				iPad: u.indexOf('iPad') > -1, //是否iPad
				iosApp: u.indexOf('Safari') == -1, //是否web应用程序
				weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
				qq: u.match(/\sQQ/i) == ' qq', //是否QQ
			}
		})(),
		language: (navigator.browserLanguage || navigator.language).toLowerCase(),
	}
	/* 批量将工具函数添加在jQuery中，方便其他页面调用 */
	$.extend({
		/*
		 * 获取页面URL中的参数
		 */
		getParam: function (key) {
			let param = ''
			const valus = new RegExp(key + '=(([^\\s&(#!)])+)').exec(window.location.href)
			if (valus && valus.length >= 2) {
				param = valus[1]
			}
			return param
		},

		/**
		 * 判断是否是pc设备
		 */
		isPC: function () {
			const userAgentInfo = navigator.userAgent
			const Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod', 'Harmony']
			let flag = true
			for (let v = 0; v < Agents.length; v++) {
				if (userAgentInfo.indexOf(Agents[v]) > 0) {
					flag = false
					break
				}
			}
			return flag
		},

		// 防抖
		debounce: function (func, delay = 500) {
			let timeout
			return function () {
				let context = this
				let args = arguments
				if (timeout) clearTimeout(timeout)
				let callNow = !timeout
				timeout = setTimeout(() => {
					timeout = null
				}, delay)
				if (callNow) func.apply(context, args)
			}
		},
		// 节流
		throttle: function (fn, delay = 500) {
			let timer = null
			return function () {
				if (!timer) {
					timer = setTimeout(function () {
						fn.apply(this, arguments)
						timer = null
					}, delay)
				}
			}
		},
		/**
		 * 切割数组,分割成一定长度的数组，返回的是一个数组集合
		 * @param {*} array
		 * @param {*} size
		 * @returns
		 */
		chunkArr: function (array, size) {
			//获取数组的长度，如果你传入的不是数组，那么获取到的就是undefined
			const length = array.length
			//判断不是数组，或者size没有设置，size小于1，就返回空数组
			if (!length || !size || size < 1) {
				return []
			}
			//核心部分
			let index = 0 //用来表示切割元素的范围start
			let resIndex = 0 //用来递增表示输出数组的下标

			//根据length和size算出输出数组的长度，并且创建它。
			let result = new Array(Math.ceil(length / size))
			//进行循环
			while (index < length) {
				//循环过程中设置result[0]和result[1]的值。该值根据array.slice切割得到。
				result[resIndex++] = array.slice(index, (index += size))
			}
			//输出新数组
			return result
		},

		//判断浏览内核Safari返回.jpg 其他返回.webp
		returnSuffixUrl: function (url) {
			const userAgent = navigator.userAgent
			const result = /Safari/.test(userAgent) && !/Chrome/.test(userAgent)
			const imgTypeList = ['.jpg', '.webp', '.JPG']
			if (url.indexOf('cdn.shopifycdn.net') != -1) {
				return url
			} else if (url.indexOf('vshop') != -1 && imgTypeList.some((item) => url.includes(item))) {
				let len = ''
				for (let v = 0; v < imgTypeList.length; v++) {
					if (url.lastIndexOf(imgTypeList[v]) > 0) {
						len = url.lastIndexOf(imgTypeList[v])
						break
					}
				}
				const newUrl = url.substr(0, len)
				return newUrl + `${result ? '.jpg' : '.webp'}`
			} else {
				return url
			}
		},

		/**
		 *
		 * @param {*} data 商品数据源
		 * @param {*} keyword 关键词
		 */
		filterHeaderGoodsList: function (data, keyword) {
			const reg = new RegExp(
				keyword
					.trim()
					.replace(/[($&*%#@)\n]/g, '')
					.toLowerCase()
			)
			return (newData = data.filter((item) => {
				// 返回匹配到热词的数据 或者 将热词去掉所有空格和商品名称去掉所有空格比较
				return reg.test(item.goodsName.toLowerCase().replace(/[($&*%#@)\n]/g, '')) || keyword.replace(/\s*/g, '') === item.goodsName.replace(/\s*/g, '')
			}))
		},

		/**
		 * 用户切换汇率
		 */
		switchCurrency: function () {
			const allprice = $('[p-price]')
			for (let i = 0; i < allprice.length; i++) {
				$(allprice[i]).text($.returnPrice($(allprice[i]).attr('p-price')))
			}
		},

		/**
		 * 切换汇率,返回当前汇率下的价格和单位
		 * @param {*params} money
		 */
		returnPrice: function (money) {
			const currentRate = JSON.parse(localStorage.getItem('currentRate'))
			if (currentRate && currentRate != 'undefined') {
				const totalMoney = currentRate.rate * money
				// let result = parseFloat(totalMoney)
				const result = Math.round(parseFloat(totalMoney) * 100) / 100
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
				return currentRate.symbol + s_x
			} else {
				return currentRate.symbol + money
			}
		},

		// 获取cookie
		getCookie: function (cname) {
			const name = cname + '='
			const ca = document.cookie.split(';')
			for (let i = 0; i < ca.length; i++) {
				let c = ca[i]
				while (c.charAt(0) == ' ') c = c.substring(1)
				if (c.indexOf(name) != -1) return c.substring(name.length, c.length)
			}
			return ''
		},

		//设置cookie
		setCookie: function (cname, cvalue) {
			document.cookie = cname + '=' + cvalue
		},

		//获取sessionStorage
		getSessionStorage: function (key) {
			return window.sessionStorage.getItem(key)
		},
		//设置sessionStorage
		setSessionStorage: function (key, val, time) {
			window.sessionStorage.setItem(key, val)
			if (time) {
				window.sessionStorage.setItem(key + '__expires__', time)
			}
		},

		//清除cookie
		clearCookie: function (name) {
			$.setCookie(name, '', -1)
		},

		isEffective: function (start, end) {
			if (end == null || !end) {
				end = '9999-12-31 00:00:00'
			}
			var now = new Date().getTime()
			if (browser.versions.ios && !$.isPC()) {
				// ios 手机 只认 2021/06/28 这种时间格式
				var s = new Date(start.replace(/-/g, '/')).getTime()
				var e = new Date(end.replace(/-/g, '/')).getTime()
			} else {
				// 安卓手机/window电脑/IOS电脑 识别 2021-06-28 这种日期格式
				var s = new Date(start).getTime()
				var e = new Date(end).getTime()
			}
			return now >= s && now <= e
		},

		// 禁止页面滚动
		forbidScroll: function forbidScroll() {
			$('body').css({
				overflow: 'hidden',
				height: $(window).height(),
			})
		},
		// 解开禁制页面滚动
		allowScroll: function allowScroll() {
			// $('body').height('').css({ 'overflow': 'auto' })
			$('body').height('').css({
				'overflow-y': 'auto',
			})
		},

		formateDiscount: function (params) {
			if (!params) return 0
			if (params > 0 && params < 1) {
				return 1
			} else {
				return Math.floor(params)
			}
		},

		/*
		 * 页面跳转 统一封装，页面路由修改时只需要修改defaultPage变量即可全局替换。
		 * 使用方法：
		 * 1.参数：url（必填） => 页面在defaultPage中的key。
		 * 2.参数：query（选填） => 携带在url传递到页面的数据object。
		 * 4.使用示例：$.toPage('index')     $.toPage('static',{id:97})     $.toPage('productList_',null,2938)
		 */
		toPage: function (url, query = false) {
			if (query) {
				let queryStr = ''
				// 对objec遍历取值
				$.each(query, (v) => {
					queryStr += `${v}=${query[v]}&`
				})
				window.location.href = url + '?' + queryStr.substr(0, queryStr.length - 1)
			} else {
				window.location.href = url
			}
		},
		/*
		 * 深拷贝
		 */
		deepCopy: function (obj) {
			var result = Array.isArray(obj) ? [] : {}
			for (var key in obj) {
				if (obj.hasOwnProperty(key)) {
					if (typeof obj[key] === 'object' && obj[key] !== null) {
						result[key] = $.deepCopy(obj[key]) // 递归复制
					} else {
						result[key] = obj[key]
					}
				}
			}
			return result
		},
		contrastTime: function (isChange, endTime, startTime) {
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
		},
	})
	/* 批量将方法类插件(可以被DOM调用)添加在jQuery中，方便其他页面调用 */
	$.fn.extend({
		/**
		 * 页面跳转、所有页面跳转需要携带标识符promotionLogo
		 * @param {*} url // 跳转地址
		 */
		routerJump: function (href, linkStatus) {
			$(this).click(function (e) {
				e.stopPropagation()
				if (href == '' || linkStatus === 0) return
				const promotionLogo = $.getCookie('promotionLogo')
				window.location.href = promotionLogo ? href + '?promotionLogo=' + promotionLogo : (window.location.href = href)
			})
		},

		validateItem(isFailed) {
			let { msg = 'Enter a valid value', reg } = this.data()
			let val = $.trim(this.val())
			let flag = !!val && val != 'default'
			if (reg && val) flag = new RegExp(reg, 'g').test(val)
			if (!isFailed && flag) {
				this.removeClass('validate-failed')
				this.parent().find('.err-msg').remove()
			} else {
				if (this.hasClass('validate-failed')) return
				let errDom = `<p class='err-msg'>${msg}</p>`
				this.addClass('validate-failed')
				this.parent().append(errDom)
			}
			return isFailed || flag
		},
		validate() {
			let flag = true
			$(this)
				// .find("input[data-required]:visible,select[data-required]:visible")
				.find('[data-required]:visible')
				.each(function () {
					if (!$(this).validateItem()) flag = false
				})
			return flag
		},
		serializeToObj() {
			let obj = {}
			let arr = this.serializeArray()
			if (arr.length == 0) return null
			arr.forEach((item) => {
				obj[item.name] = item.value
			})
			return obj
		},
	})
})(window.jQuery)
