const { Liquid } = require('liquidjs')
const engine = new Liquid({ extname: '.liquid' })
const { jsonToArray } = require('../../../tools/utils')
const { blockConfig } = require('../config/blockConfig')
const RegexUrl = /^((ht|f)tps?):\/\/([\w-]+(\.[\w-]+)*\/?)+(\?([\w\-\.,@?^=%&:\/~\+#]*)+)?$/
// 过滤器
if (process.env.NODE_ENV === 'build') {
	var IMGURL = 'https://vshop001.oss-accelerate.aliyuncs.com/'
} else {
	var IMGURL = 'https://vshoptest.oss-cn-hangzhou.aliyuncs.com/'
}
engine.registerFilter('filterBannerList', (arr) => {
	// 将轮播图数组中的空轮播图过滤出去
	let newArr = arr.filter((v) => v.pcUrl || v.wapUrl) || []
	return newArr
})
engine.registerFilter('OFF', (v) => {
	// 注册计算折扣过滤器)// 逐步弃用，改用calc替代
	return 100 - v * 10
})
engine.registerFilter('compareTime', (a, b) => {
	// 返回时间比较结果
	if (b) {
		var now = new Date().getTime()
		var start = new Date(a).getTime()
		var end = new Date(b).getTime()
		return now >= start && now <= end
	} else {
		return true
	}
})
engine.registerFilter('setPoaterLink', (v) => {
	// 设置海报链接
	if (v.linkId && v.linkType === 0) {
		// 跳转到当前分类下
		return `productList_${v.linkId}.html`
	} else if (v.linkId && v.linkType === 1) {
		// 跳转到当前商品详情页
		return `productDetail_${v.linkId}.html`
	} else if (v.linkType === 2 || v.linkType === 3) {
		// 跳转到所有商品页
		return `productList.html`
	} else {
		return `javascript:;`
	}
})
engine.registerFilter('couponRender', (v, obj) => {
	// 注册优惠券展示
	var t = obj.ruleDesc.split('**')[0]
	var val = obj.ruleDesc.split('**')[1]
	if (obj.activitiesRule == 0 && obj.ruleResult == 0) {
		// 无需条件-扣减金额
		return `
     <div class="coupon-Item-text">
      <p class="noRule">
        <span class="num" c-price="${obj.ruleResultValue}"></span>
      </p>
       </div>
    `
	} else if (obj.activitiesRule == 0 && obj.ruleResult == 1) {
		// 无需条件-折扣
		return `
      <div class="coupon-Item-text lessPrice">
        <div class="rule">
          <div class="rulenum">${obj.ruleResultValue * 10}</div>
          <div class="ruleunit">
            <span>%</span><br>
            <span>OFF</span>
          </div>
        </div>
      </div>
    `
	} else if (obj.activitiesRule == 1 && obj.ruleResult == 1) {
		// 买满金额-折扣
		return `
     <div class="coupon-Item-text lessPrice">
      <div class="rule">
          <div class="rulenum">${obj.ruleResultValue * 10}</div>
          <div class="ruleunit">
            <span>%</span><br>
            <span>OFF</span>
          </div>
        </div>
        <div>
          <span>${t}</span>
          <span c-price="${val}"></span>
        </div>
      </div>
    `
	} else if (obj.activitiesRule == 1 && obj.ruleResult == 0) {
		// 买满金额-扣减金额
		return ` <div class="coupon-Item-text">
     <p>
        <span class="num" c-price="${obj.ruleResultValue}"></span>
      </p>
       <p>
        <span>${t}</span>
        <span c-price="${val}"></span>
      </p> </div>
    `
	} else if (obj.activitiesRule == 2 && obj.ruleResult == 0) {
		// 买满件数-扣减金额
		return ` <div class="coupon-Item-text">
     <p>
        <span class="num" c-price="${obj.ruleResultValue}"></span>
      </p>
       <p >${obj.ruleDesc}</p> </div>
    `
	} else if (obj.activitiesRule == 2 && obj.ruleResult == 1) {
		// 买满件数-折扣
		return ` <div class="coupon-Item-text lessPrice">
     <div class="rule">
        <div class="rulenum">${obj.ruleResultValue * 10}</div>
        <div class="ruleunit">
          <span>%</span><br>
          <span>OFF</span>
        </div>
      </div>
      <div >${obj.ruleDesc}</div> </div>
    `
	}
})
engine.registerFilter('get', (v, l) => {
	// 过滤数组，返回数组的前L位组成新数组
	var arr = []
	for (let i = 0; i < v.length; i++) {
		if (i > l - 1) {
			break
		} else {
			arr.push(v[i])
		}
	}
	return arr
})
engine.registerFilter('discountPrice', (v, d) => {
	// 注册计算折扣过滤器)
	return (v * d) / 10
})
engine.registerFilter('calcDiscount', (originalPrice, defaultPrice) => {
	const discount = ((originalPrice - defaultPrice) / originalPrice) * 100
	if (!discount) return 0
	if (discount > 0 && discount < 1) {
		return 1
	} else {
		return Math.floor(discount)
	}
	// 注册计算折扣过滤器)
	// return parseInt(((originalPrice - defaultPrice) / originalPrice) * 100)
})

engine.registerFilter('str', (v) => {
	// 注册数字转字符串
	return v.toString()
})
engine.registerFilter('isEffective', (start, end) => {
	// 校验商品有效期
	var now = new Date().getTime()
	var s = new Date(start).getTime()
	var e = new Date(end).getTime()
	if ((now >= s && now <= e) || (start && !end)) {
		return true
	}
	return false
})
engine.registerFilter('uuid', (v) => {
	// 产生一个id
	return new Date().getTime()
})
engine.registerFilter('isExist', (v, s) => {
	// 产生一个id
	if (v) return v
	return s
})
engine.registerFilter('first', (v) => {
	// 返回数组第一个
	return v[0]
})
engine.registerFilter('last', (v) => {
	// 返回数组最后一个
	return v[v.length - 1]
})
engine.registerFilter('calc', (v, d, type) => {
	// 校验商品有效期

	if (type === 0) {
		// 0：计算折扣
		return 100 - v * 10
	} else if (type === 1) {
		// 1: 返回折扣后的价格
		return (v * d) / 10
	} else if (type === 2) {
		// 返回字符串相加
		return v + d
	}
})
engine.registerFilter('calcPrice', (money, currentRate) => {
	// 返回当前汇率下的价格
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
		return currentRate.symbol + s_x
	} else {
		return currentRate.symbol + money
	}
})
// 2021年6月21日重构优惠券弹框模块 过滤器 返回计算后的汇率价格
engine.registerFilter('calculationPrice', (money, currentRate, num) => {
	money = money - 0 //先转数字类型，兼容字符串类型的数字
	num = num || 2 //默认转为两位小数
	return (currentRate.rate * money).toFixed(num)
})
engine.registerFilter('calcCategory', (arr) => {
	// 计算分类，返回子分类下的所有名称拼接
	let newArr = jsonToArray(arr)
	let str = []
	for (let i = 0; i < newArr.length; i++) {
		str.push(newArr[i].name)
	}
	return str.join(',')
})
engine.registerFilter('switchRate', (money, currentRate, decimal = 2) => {
	// 根据汇率返回对应的价格和单位
	if (!money) return
	if (!currentRate) {
		return '$' + money
	}
	if (currentRate && currentRate != '') {
		var totalMoney = currentRate.rate * money
		var result = parseFloat(totalMoney)
		result = Math.round(totalMoney * 100) / 100
		var s_x = result.toString()
		if (currentRate.currency !== 'JPY' && currentRate.currency !== 'TWD') {
			var pos_decimal = s_x.indexOf('.')
			if (pos_decimal < 0 && decimal === 2) {
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
})
engine.registerFilter('couponRender', (v, obj) => {
	// 注册优惠券展示
	var t = obj.ruleDesc.split('**')[0]
	var val = obj.ruleDesc.split('**')[1]
	if (obj.activitiesRule == 0 && obj.ruleResult == 0) {
		// 无需条件-扣减金额
		return `
     <div class="coupon-Item-text">
      <p class="noRule">
        <span class="num" c-price="${obj.ruleResultValue}"></span>
      </p>
       </div>
    `
	} else if (obj.activitiesRule == 0 && obj.ruleResult == 1) {
		// 无需条件-折扣
		return `
      <div class="coupon-Item-text lessPrice">
        <div class="rule">
          <div class="rulenum">${obj.ruleResultValue * 10}</div>
          <div class="ruleunit">
            <span>%</span><br>
            <span>OFF</span>
          </div>
        </div>
      </div>
    `
	} else if (obj.activitiesRule == 1 && obj.ruleResult == 1) {
		// 买满金额-折扣
		return `
     <div class="coupon-Item-text lessPrice">
      <div class="rule">
          <div class="rulenum">${obj.ruleResultValue * 10}</div>
          <div class="ruleunit">
            <span>%</span><br>
            <span>OFF</span>
          </div>
        </div>
        <div>
          <span>${t}</span>
          <span c-price="${val}"></span>
        </div>
      </div>
    `
	} else if (obj.activitiesRule == 1 && obj.ruleResult == 0) {
		// 买满金额-扣减金额
		return ` <div class="coupon-Item-text">
     <p>
        <span class="num" c-price="${obj.ruleResultValue}"></span>
      </p>
       <p>
        <span>${t}</span>
        <span c-price="${val}"></span>
      </p> </div>
    `
	} else if (obj.activitiesRule == 2 && obj.ruleResult == 0) {
		// 买满件数-扣减金额
		return ` <div class="coupon-Item-text">
     <p>
        <span class="num" c-price="${obj.ruleResultValue}"></span>
      </p>
       <p >${obj.ruleDesc}</p> </div>
    `
	} else if (obj.activitiesRule == 2 && obj.ruleResult == 1) {
		// 买满件数-折扣
		return ` <div class="coupon-Item-text lessPrice">
     <div class="rule">
        <div class="rulenum">${obj.ruleResultValue * 10}</div>
        <div class="ruleunit">
          <span>%</span><br>
          <span>OFF</span>
        </div>
      </div>
      <div >${obj.ruleDesc}</div> </div>
    `
	}
})
engine.registerFilter('stylesheetTag', (v, style, type = 1) => {
	// 注册优惠券展示
	if (type === 1) {
		return `style="${style}:${v}"`
	} else if (type === 2) {
		return `style="${style}:repeat(${v}, 1fr);"`
	} else if (type === 3) {
		var s = ''
		for (let i = 0; i < style.length; i++) {
			s += `${style[i]}:${v[i]};`
		}
		return `style="${s}"`
	}
})

// engine.registerFilter('videoTextHeight', (className, status) => {
//   return !!status ? `style="max-height:2rem"` : `style="height:calc(100%-${elHeight})"`
// })
engine.registerFilter('blockTemplateName', (v) => {
	// 枚举积木名称
	switch (v) {
		case 1:
			return 'pageHeader'
		case 2:
			return 'banner'
		case 3:
			return 'category'
		case 4:
			return 'products'
		case 5:
			return 'poster'
		case 6:
			return 'video'
		case 7:
			return 'subscribe'
		case 8:
			return 'pageFooter'
		case 999999:
			return 'pageSearch'
	}
})
engine.registerFilter('IMGURL', (v, preloader, q) => {
	// 枚举积木名称
	if (v) {
		if (RegexUrl.test(v)) {
			return v
		} else {
			return IMGURL + v
		}
	} else {
		if (q) {
			return IMGURL + q
		} else {
			return preloader
		}
	}
})
engine.registerFilter('SplicingString', (a, b, type = 1) => {
	// 拼接字符串
	if (type === 1) {
		return a + ',' + b
	} else {
		if (b) {
			return a + b + '.html'
		} else {
			return ''
		}
	}
})
engine.registerFilter('OR', (v, s) => {
	// 如果为空返回对应字符串
	if (v) {
		return v
	} else {
		return s
	}
})
engine.registerFilter('chunkArr', (array, size) => {
	// 拼接字符串
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
})
engine.registerFilter('chunkCss', (typeIds) => {
	// 返回积木所需要的css 文件
	typeIds = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 999999]
	var styles = {
		cssPc: [],
		cssWap: [],
		jsPc: [],
		jsWap: [],
	}
	for (let i = 0; i < blockConfig.length; i++) {
		if (typeIds.indexOf(blockConfig[i].typeId) !== -1) {
			for (let j = 0; j < blockConfig[i].css.pc.length; j++) {
				styles.cssPc.push(blockConfig[i].css.pc[j])
			}
			for (let j = 0; j < blockConfig[i].css.wap.length; j++) {
				styles.cssWap.push(blockConfig[i].css.wap[j])
			}
			for (let j = 0; j < blockConfig[i].js.pc.length; j++) {
				styles.jsPc.push(blockConfig[i].js.pc[j])
			}
			for (let j = 0; j < blockConfig[i].js.wap.length; j++) {
				styles.jsWap.push(blockConfig[i].js.wap[j])
			}
		}
	}
	styles.cssPc = [...new Set(styles.cssPc)]
	styles.cssWap = [...new Set(styles.cssWap)]
	styles.jsPc = [...new Set(styles.jsPc)]
	styles.jsWap = [...new Set(styles.jsWap)]
	return styles
})
//计算优惠百分数
engine.registerFilter('offShow', ($defaultPrice, $originalPrice) => {
	return parseFloat(Math.floor((1 - Number($defaultPrice) / Number($originalPrice)) * 100) || 1)
})
engine.registerFilter('relationList', ($res, $categoryData, $data) => {
	//详情关联商品随机取12个
	let relationListArr = []
	let $res_id = [] //重复产品id
	$res_id.push($res.id)
	if ($res.relationList && $res.relationList.length) {
		if ($res.relationList.length > 12) {
			$res.relationList.length = 12
			relationListArr = $res.relationList
		} else {
			relationListArr = $res.relationList
			$res.relationList.forEach((item) => {
				if ($res_id.indexOf(item.id) == -1) {
					$res_id.push(item.id)
				}
			})
			relationListArr = category($res, $res_id, relationListArr)
		}
	} else {
		relationListArr = category($res, $res_id, relationListArr)
	}

	function category($res, $res_id, relationListArr) {
		// 关联商品不够12个,在分类中取
		if ($res.hasOwnProperty('categoryIds') && $res.categoryIds != '' && $res.categoryIds != null) {
			let $categoryIds = $res.categoryIds
			$categoryIdsArr = $categoryIds.split(',')
			let categoryArr = []
			$categoryIdsArr.forEach((element) => {
				$categoryData.categoryList.forEach((item) => {
					if (item.id == element) {
						categoryArr = item.goodsList
						return false
					} else {
						if (item.childList.length) {
							item.childList.forEach((val) => {
								if (val.id == element) {
									categoryArr = val.goodsList
									return false
								}
							})
						}
					}
				})
				if (categoryArr.length) {
					let categoryNewArr = categoryArr.filter((item, index) => {
						return $res_id.indexOf(item.id) == -1 && $res_id.push(item.id)
					})
					// 可以加入数组的最大数量
					let relationListArrLength = 12 - relationListArr.length
					if (categoryNewArr.length > relationListArrLength) {
						randomData(relationListArrLength, relationListArr, categoryNewArr)
						return false
					} else {
						relationListArr = relationListArr.concat(categoryNewArr)
					}
				}
			})
		}
		// 如果分类不够去标签取
		if (relationListArr.length < 12 && $res.hasOwnProperty('tag') && $res.tag != '' && $res.tag != null) {
			let $tag = $res.tag
			let tagData = $data.filter((item) => {
				let tagArr = []
				if (item.hasOwnProperty('tag') && item.tag != '' && item.tag != null) {
					tagArr = item.tag.split(',')
				}
				return tagArr.indexOf($tag) != -1 && $res_id.indexOf(item.id) == -1 && $res_id.push(item.id)
			})
			// 可以加入数组的最大数量
			let relationListArrLength = 12 - relationListArr.length
			let tagData_copy = JSON.parse(JSON.stringify(tagData))
			if (tagData.length > relationListArrLength) {
				tagData_copy.length = relationListArrLength
				// randomData(relationListArrLength, relationListArr, tagData)
			}
			relationListArr = relationListArr.concat(tagData_copy)
		}
		// 标签不够去品类中找
		if (relationListArr.length < 12 && $res.hasOwnProperty('productClassify') && $res.productClassify != '' && $res.productClassify != null) {
			let $productClassify = $res.productClassify
			let productClassifyData = $data.filter((item) => {
				let productClassify = ''
				if (item.hasOwnProperty('productClassify') && item.productClassify != '' && item.productClassify != null) {
					productClassify = item.productClassify
				}
				return productClassify == $productClassify && $res_id.indexOf(item.id) == -1 && $res_id.push(item.id)
			})
			let productClassifyData_copy = JSON.parse(JSON.stringify(productClassifyData))
			// 可以加入数组的最大数量
			let relationListArrLength = 12 - relationListArr.length
			if (productClassifyData.length > relationListArrLength) {
				productClassifyData_copy.length = relationListArrLength
				// randomData(relationListArrLength, relationListArr, productClassifyData)
			}
			relationListArr = relationListArr.concat(productClassifyData_copy)
		}
		// 最后在全部商品中找
		if (relationListArr.length < 12) {
			let deepData = JSON.parse(JSON.stringify($data))
			if (deepData.length > 100) {
				deepData.length = 100
			}
			let detailData = deepData.filter((item) => {
				return $res_id.indexOf(item.id) == -1 && $res_id.push(item.id)
			})
			// 可以加入数组的最大数量
			let relationListArrLength = 12 - relationListArr.length
			if (detailData.length > relationListArrLength) {
				randomData(relationListArrLength, relationListArr, detailData)
			} else {
				relationListArr = relationListArr.concat(detailData)
			}
		}
		return relationListArr
	}

	function randomData($len, relationListArr, data) {
		for (var i = 0; i < $len; i++) {
			var ran = Math.floor(Math.random() * ($len - i))
			relationListArr.push(data[ran])
			data[ran] = data[$len - i - 1]
		}
	}
	return relationListArr
})
engine.registerFilter('LINKURL', (v, linkStatus) => {
	// 如果为空返回对应字符串 0:无效
	return linkStatus === 0 ? 'javascript:void(0)' : v
})
engine.registerFilter('CREATEDGOODSLIST', (l) => {
	let arr = []
	for (let i = 0; i < l; i++) {
		let obj = {
			id: '',
			name: 'Title',
			picPc: '',
			picWap: '',
			freeShipping: 1,
			defaultPrice: 50,
			originalPrice: 100,
			pic: '',
		}
		arr.push(obj)
	}
	return arr
})
engine.registerFilter('escapeHtml', (v) => {
	var arrEntities = {
		lt: '<',
		gt: '>',
		nbsp: ' ',
		amp: '&',
		quot: "'",
	}
	return v.replace(/&(lt|gt|nbsp|amp|quot);/gi, function (all, t) {
		return arrEntities[t]
	})
})
engine.registerFilter('optionFilter', (v) => {
	const childCustListOption = []
	v.forEach((item) => {
		if (item.childCustList.length) {
			item.childCustList.forEach((val) => {
				childCustListOption.push(val)
			})
		}
	})
	return childCustListOption
})
engine.registerFilter('pageList', (v) => {
	const menuList = v.menuList
	let result,
		isFindList = ''
	const isFind = menuList.some((element) => {
		const pageClassifyId = element.pageClassifyId
		if (!pageClassifyId.hasOwnProperty('pageList')) {
			return false
		}
		isFindList = pageClassifyId.pageList.find((item) => {
			return item.path.toLocaleLowerCase().indexOf('terms') != -1
		})
		return typeof isFindList != 'undefined'
	})
	if (isFind) {
		result = isFindList.path
	} else {
		result = v.bottom.linkUrl.toLocaleLowerCase().indexOf('terms') != -1 ? v.bottom.linkUrl : ''
	}
	return result
})
engine.registerFilter('isCardPay', (v) => {
	const isFlag = v.some((item) => item.cardType == 9)
	return isFlag
})
engine.registerFilter('includeLinkId', (arr, v) => {
	let flatArr = new Array()
	arr.forEach((item) => {
		if (Array.isArray(item.childList)) {
			flatArr = flatArr.concat(item.childList).concat(item)
		} else {
			flatArr.push(item)
		}
	})
	return flatArr.filter((item) => item.level == v)
})

engine.registerFilter('strip_html', (v) => {
	return v
})
engine.registerFilter('newline_to_br', (v) => {
	return v
})

module.exports = engine
