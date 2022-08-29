const { Liquid } = require('liquidjs')
const path = require('path')
const engine = new Liquid({ extname: '.liquid' })
const { getStrValue } = require('../../../tools/utils')
const IMGURL = process.env.NODE_ENV === 'build' ? 'https://vshop001.oss-accelerate.aliyuncs.com/' : 'https://vshoptest.oss-cn-hangzhou.aliyuncs.com/'
const RegexUrl = /^((ht|f)tps?):\/\/([\w-]+(\.[\w-]+)*\/?)+(\?([\w\-\.,@?^=%&:\/~\+#]*)+)?$/
/**
 * @desc 国际化翻译
 * @param {string} language - 要翻译的语言
 * @param {*} args - 代表要替换字符串的集合
 */
engine.registerFilter('t', (v, language = 'en', ...args) => {
	let str = v
	let p = path.resolve(__dirname, '../locales')
	let languagePath = path.resolve(p, language)
	let i18n = require(languagePath)
	str = getStrValue(v, { i18n })
	if (args.length > 0) {
		args.forEach((arr) => {
			let reg = new RegExp('{{\\s*' + arr[0] + '\\s*}}', 'gim')
			str = str.replace(reg, arr[1])
		})
	}
	return str
})
/**
 * @desc 转化真假
 */
engine.registerFilter('fmtBoolean', (v) => {
	return !!v
})
// 将轮播图数组中的空轮播图过滤出去
engine.registerFilter('filterBannerList', (arr) => {
	let newArr = arr.filter((v) => v.pcUrl || v.wapUrl) || []
	return newArr
})
//
engine.registerFilter('IMGURL', (v, preloader, q) => {
	if (v && v != 'undefined') {
		return RegexUrl.test(v) ? v : IMGURL + v
	} else {
		return q && v != 'undefined' ? IMGURL + q : preloader
	}
})

engine.registerFilter('DomainImgUrl', (v) => {
	return v ? IMGURL : ''
})
/*
 *@Date: 2022-03-16 16:28:40
 *@Description: 解码word编辑器返回的编码
 */
engine.registerFilter('escapeHtml', (v) => {
	const arrEntities = {
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

engine.registerFilter('SplicingString', (a, b, type = 1) => {
	let str = ''
	switch (type) {
		case 1:
			str = a + ',' + b
			break
		case 2:
			str = b ? a + b + '.html' : ''
			break
		default:
			// 正常事件
			str = b ? a + '.html?id=' + b : ''
	}
	return str
})

engine.registerFilter('stylesheetTag', (v, style, type = 1) => {
	let s = ''
	for (let i = 0; i < style.length; i++) {
		s += `${style[i]}:${v[i]};`
	}
	const styleTypeObj = {
		1: `style="${style}:${v}"`,
		2: `style="${style}:repeat(${v}, 1fr);"`,
		3: `style="${s}"`,
	}
	return styleTypeObj[type]
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

engine.registerFilter('switchRate', (money, currentRate, decimal = 2) => {
	// 根据汇率返回对应的价格和单位
	if (!money) return
	if (!currentRate) {
		return '$' + money
	}
	if (currentRate && currentRate != 'undefined') {
		const totalMoney = currentRate.rate * money
		const result = Math.round(parseFloat(totalMoney) * 100) / 100
		let s_x = result.toString()
		if (currentRate.currency !== 'JPY' && currentRate.currency !== 'TWD') {
			let pos_decimal = s_x.indexOf('.')
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

engine.registerFilter('chunkArr', (array, size) => {
	// 拼接字符串
	//获取数组的长度，如果你传入的不是数组，那么获取到的就是undefined
	const length = array.length
	//判断不是数组，或者size没有设置，size小于1，就返回空数组
	if (!length || !size || size < 1) return []
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

/*
 *@Description: 收集评星各个级别得数量
 *@Parmas: v:评星原数据
 */
engine.registerFilter('reviewData', (v) => {
	const star = [0, 0, 0, 0, 0]
	if (!v && !v.length) return false
	v.forEach((item) => star[item.star - 1]++)
	return star
})

/*
 *@Description: 切割数组
 *@Parmas: v:原数据,index:初始下标，howmany：项目数量
 */
engine.registerFilter('arrSlice', (v, index, howmany) => {
	// 如果为空返回对应字符串
	return howmany > index ? v.slice(index, howmany) : []
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

engine.registerFilter('LINKURL', (v, linkStatus) => {
	// 如果为空返回对应字符串 0:无效
	const url = linkStatus === 0 ? 'javascript:void(0)' : v
	if (!url.includes('productList_')) return url
	const id = url.slice('productList_'.length, url.indexOf('.html'))
	return 'productList.html?id=' + id
})

// 过滤器 返回计算后的汇率价格
engine.registerFilter('calculationPrice', (money, currentRate, num) => {
	money = money - 0 //先转数字类型，兼容字符串类型的数字
	num = num || 2 //默认转为两位小数
	return (currentRate.rate * money).toFixed(num)
})
// 开发环境和生产环境跳转 配置
engine.registerFilter('fmtUrl', (v) => {
	return process.env.NODE_ENV == 'dev' ? v : v + '.html'
})

/*
 *详情关联商品随机取12个
 *$res:当前商品数据
 *$categoryData:全部分类数据
 *$data：全部商品数据
 * */
engine.registerFilter('relationList', ($res, $categoryData, $data) => {
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

//  筛选各种样式
engine.registerFilter('filterStyle', (v, style) => {
	switch (style) {
		case 'textAlain':
			return v ? 'center' : 'left'
		case 'imgShow':
			return v ? 'inline-block' : 'none'
		case 'radius':
			return v == 'square' ? 0 : '8px'
	}
})

// 分类和商品没有数据时，创建空的分类数据
engine.registerFilter('createGoodList', (l) => {
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
//计算优惠百分数
engine.registerFilter('offShow', ($defaultPrice, $originalPrice) => {
	return parseFloat(Math.floor((1 - Number($defaultPrice) / Number($originalPrice)) * 100) || 1)
})
/**
 * 将全局配置得折扣或免邮转为样式
 * indexData:首页配置数据，type：类型（折扣和免邮）
 * */
engine.registerFilter('styleObj', (indexData, type) => {
	// 默认样式
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
	const globalConfigData = indexData.find((item) => item.typeId == 9)
	const goodsConfig = globalConfigData.config == null ? defaultGoodsConfig : globalConfigData.config.goodsConfig
	const { discountLabelStyle, discountBgColor, discountTextColor, shippingBgColor, shippingLabelStyle, shippingTextColor } = goodsConfig
	let style = ''
	if (type == 'discount') {
		if (discountLabelStyle == 'circle') {
			style += 'border-radius:50%;'
		} else if (discountLabelStyle == 'special') {
			style += 'border-radius:13px 0;'
		}
		style += `background-color:${discountBgColor};color:${discountTextColor}`
	} else {
		if (shippingLabelStyle == 'circle') {
			style += 'border-radius:50%;'
		} else if (shippingLabelStyle == 'special') {
			style += 'border-radius:13px 0;'
		}
		style += `background-color:${shippingBgColor};color:${shippingTextColor}`
	}
	return style
})

// 截取字符串
engine.registerFilter('calcString', (str, symbol) => {
	return str.slice(0, str.indexOf(symbol))
})
module.exports = engine
