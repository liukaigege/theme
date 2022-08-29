// {
//   "couponNum": "的",
//   "settlementType": 1,//结算类型：1券码结算，2勾选结算
//   "start": "2021-05-24 00:00:00",
//   "addFoldUp": 1,//是否全场活动折上折  0否  1是'
//   "description": null,
//   "updateTime": null,
//   "delFlag": 0,//逻辑删除状态 0未删除 1已删除'
//   "receptionShow": 1,//前台列表是否显示  0不显示  1显示
//   "unlimitedEndType": 1,//不限结束时间，0不限制，1限制
//   "activitiesRule": "1",//规则条件 0无需条件 1买满金额 2买满件数
//   "createBy": 749,
//   "ruleValue": "1200",
//   "createTime": "2021-05-25T14:44:11",
//   "updateBy": 748,
//   "couponType": 1,//优惠券类型   0通用券  1商品券'
//   "ruleResultValue": "1",//规则条件结果参数
//   "ruleDesc": " ",
//   "name": "滚动",
//   "addSpecialPrice": 1,//是否特价叠加 0否  1是
//   "end": "2022-05-26 23:59:59",
//   "id": 1756,
//   "ruleResult": "0",//规则条件结果参数
//   "shopId": 99,//店铺id
//   "status": 1//活动状态  0失效 1有效
// }


function calculate($param, res) {
	param = deepClone($param)
	// 初始化
	const CARTDATE = {
		couponCodeMap: { isExist: '0' },
		couponDiscount: 0,
		dicountTotal: 0,
		afterDicountTotal: 0,
		promotionDiscount: 0,
		productPrice: 0,
		activityList: [],
		couponList: [],
		invalidGoodsList: [],
		useDiscount: {},
		goodsList: [],
		goodsCount: 0
	}
	if (res.cartList != null && res.cartList.length) {
		const goodsList = res.cartList
		// 商品算费
		calculateGoodsList(goodsList, CARTDATE)
		CARTDATE.couponList = canUseCouponList(res.couponList, CARTDATE)
		discountInit(param, CARTDATE)
		return { code: 0, data: CARTDATE }
	} else {
		return { code: 0, data: CARTDATE }
	}
}

function shippingInit($param) {
	let goodsTotalPrice = $param.afterDicountTotal
	let goodsCount = 0
	$param.goodsList.forEach(item => {
		const goodsItem = DETAILDATA.find(val => {
			return item.goodsId == val.id
		})
		if (goodsItem.freeShipping != 0) {
			goodsTotalPrice = Math.round(goodsTotalPrice * 100 - item.afterDicountPrice * 100) / 100
			if (goodsTotalPrice < 0) goodsTotalPrice = 0
		} else {
			goodsCount++
		}
	})
	const SHIPPING = [], shippingData = {}, minMoney = []
	let isFreeShipping = false
	CONFIGDATA.shippings.forEach(item => {
		if (item.status == 1) {
			const formula = JSON.parse(item.formula)
			//直接比较有误差  用差值比较
			if (goodsTotalPrice - formula.minMoney >= 0 && (formula.maxMoney == -1 || goodsTotalPrice - formula.maxMoney < 0) && goodsCount != 0) {
				let shippingItem = deepClone(item)
				shippingItem.money = formula.shippingMoney
				if (shippingItem.money == 0) isFreeShipping = true
				SHIPPING.push(shippingItem)
			}
			if (formula.shippingMoney == 0) {
				minMoney.push(Number(formula.minMoney))
			}
		}
	})
	// 取差值
	const differMoneyArr = []
	minMoney.forEach(item => {
		if (item - goodsTotalPrice > 0) {
			differMoneyArr.push(Math.round(item * 100 - goodsTotalPrice * 100) / 100)
		}
	})
	if (differMoneyArr.length > 0) {
		let minMoneyItem = differMoneyArr[0]
		//取最小值
		differMoneyArr.forEach(item => {
			item < minMoneyItem && (minMoneyItem = item)
		})
		if ((!isFreeShipping && goodsCount != 0) || !$param.goodsList.length) shippingData.gapMoney = minMoneyItem
	}
	shippingData.list = SHIPPING
	return shippingData
}

function discountInit(param, CARTDATE) {
	const promotionCode = {};
	if (param.hasOwnProperty('activityId')) {
		calculateActivity(param.activityId, promotionCode)
		if (promotionCode.code != 0) {
			CARTDATE.promotionDiscount = 0
			delete CARTDATE.useDiscount.activityId
		}
	} else {
		// 未传全产活动
		CARTDATE.promotionDiscount = 0
		delete CARTDATE.useDiscount.activityId
	}

	const couponCode = {}
	if (param.hasOwnProperty('couponId')) {
		calculateCoupon(param.couponId, couponCode, 'couponId', CONFIGDATA.couponList)
		if (couponCode.code != 0) {
			CARTDATE.couponDiscount = 0
			delete CARTDATE.useDiscount.couponId
		} else {
			delete CARTDATE.useDiscount.couponCodeId
			delete CARTDATE.useDiscount.couponCode
		}
	} else if (param.hasOwnProperty('couponCode')) {
		calculateCoupon(param.couponCode, couponCode, 'couponNum', CONFIGDATA.couponCodeList)
		if (couponCode.code == 0) {
			param.couponCodeId = couponCode.data.id
			delete CARTDATE.useDiscount.couponId
		} else {
			delete param.couponCode
			delete param.couponCodeId
			CARTDATE.couponDiscount = 0
			delete CARTDATE.useDiscount.couponCodeId
			delete CARTDATE.useDiscount.couponCode
		}
	} else {
		couponCode.code = 0
		couponCode.data = {}
		delete param.couponCode
		delete param.couponCodeId
		delete param.couponId
		CARTDATE.couponDiscount = 0
		delete CARTDATE.useDiscount.couponCodeId
		delete CARTDATE.useDiscount.couponCode
		delete CARTDATE.useDiscount.couponId
	}

	//全场活动优惠价格(CARTDATE.promotionDiscount)
	if (param.hasOwnProperty('activityId')) {
		discountCode(promotionCode, CARTDATE, 'promotionDiscount', param)
	}
	//优惠券价格（CARTDATE.couponDiscount）
	if (couponCode.code == 0 && (param.hasOwnProperty('couponId') || param.hasOwnProperty('couponCode'))) {
		// 获取所有指定商品id
		discountCode(couponCode, CARTDATE, 'couponDiscount', param)
	}
	//将优惠活动总结（全场与优惠券是否互斥）
	CARTDATE.dicountTotal = Math.round(CARTDATE.couponDiscount * 100 + CARTDATE.promotionDiscount * 100) / 100
	CARTDATE.afterDicountTotal = Math.round(CARTDATE.productPrice * 100 - CARTDATE.dicountTotal * 100) / 100
	if (CARTDATE.afterDicountTotal < 0) {
		CARTDATE.afterDicountTotal = 0
	}
	if (CARTDATE.promotionDiscount != 0) {
		CARTDATE.useDiscount.activityId = Number(param.activityId)
	}
	if (CARTDATE.couponDiscount != 0) {
		if (param.hasOwnProperty('couponId')) {
			CARTDATE.useDiscount.couponId = Number(param.couponId)
		} else {
			CARTDATE.useDiscount.couponCodeId = Number(param.couponCodeId)
			CARTDATE.useDiscount.couponCode = param.couponCode
		}
	} else {
		delete CARTDATE.useDiscount.couponCodeId
		delete CARTDATE.useDiscount.couponCode
		delete CARTDATE.useDiscount.couponId
	}
}

// 全场活动
function calculateActivity($activityId, codeObj) {
	const promotion_arr = CONFIGDATA.activities
	// 判断全场活动是否失效
	const promotionList = promotion_arr.find(item => {
		return contrastTime(true, item.end, item.start) && item.status == 1
	})
	if (typeof (promotionList) != 'undefined') {
		if (promotionList.id == $activityId) {
			codeObj.code = 0
			codeObj.data = promotionList
		} else {
			//全场活动已失效
			codeObj.code = 20000;
			codeObj.msg = "No activity found"
		}
	} else {
		//无全场活动
		codeObj.code = 20000
		codeObj.msg = "No activity found"
	}
	return codeObj
}
// 优惠券
function calculateCoupon($couponId, codeObj, $id, couponListArr) {
	const couponList = couponListArr.find(item => {
		return item[$id] == $couponId
	})
	if (typeof (couponList) != 'undefined' && couponList.status == 1 && couponList.delFlag == 0) {
		isValid = contrastTime(true, couponList.end, couponList.start)
		if (isValid) {
			codeObj.code = 0
			codeObj.data = couponList
		} else {
			//全场活动已失效
			codeObj.code = 20001;
			codeObj.msg = "No coupon found"
		}
	} else {
		//无全场活动
		codeObj.code = 20001
		codeObj.msg = "No coupon found"
	}
	return codeObj
}
//活动优惠(全场活动和优惠券)
function discountCode(codeObj, CARTDATE, activeName, param) {
	//获取折扣活动区间
	const ruleValue = {}, rule = {}, active = { 'name': activeName };
	const discountData = codeObj.data
	if (discountData.ruleValue == '' || discountData.ruleValue == null) {
		ruleValue.end = -1
		ruleValue.start = -1
	} else if (discountData.ruleValue.includes(',')) {
		ruleValue.start = Number(discountData.ruleValue.split(',')[0]) || -1;
		ruleValue.end = Number(discountData.ruleValue.split(',')[1]) || -1
	} else {
		ruleValue.start = Number(discountData.ruleValue);
		ruleValue.end = -1
	}
	// 折扣方式（金额1，件数2，无需条件0）
	active.rule = discountData.activitiesRule
	//折扣方式（数值0还是百分数1）
	rule.result = discountData.ruleResult;
	//折扣内容
	rule.resultValue = discountData.ruleResultValue
	// 获取所有指定商品id
	const productIdArr = []
	const couponProduct = {
		price: 0,
		count: 0
	}
	const isDesignatedGoods = discountData.hasOwnProperty('goods') && discountData.goods.length
	if (isDesignatedGoods) {
		discountData.goods.forEach(item => {
			productIdArr.push(item.goodsId)
		})
		CARTDATE.goodsList.forEach(val => {
			if (productIdArr.includes(val.goodsId)) {
				couponProduct.price = Math.round(couponProduct.price * 100 + val.discountPrice * val.quantity * 100) / 100
				couponProduct.count += val.quantity
			}
		})
	}
	if (active.rule == 1) {
		//判断是否为指定商品券
		if (activeName == 'couponDiscount' && isDesignatedGoods) {
			promotionPrice(couponProduct.price, ruleValue, rule, active, CARTDATE, param, couponProduct.price)
		} else {
			promotionPrice(CARTDATE.productPrice, ruleValue, rule, active, CARTDATE, param, CARTDATE.productPrice)
		}
	} else if (active.rule == 2) {
		if (activeName == 'couponDiscount' && isDesignatedGoods) {
			promotionPrice(couponProduct.count, ruleValue, rule, active, CARTDATE, param, couponProduct.price)
		} else {
			promotionPrice(CARTDATE.goodsCount, ruleValue, rule, active, CARTDATE, param, CARTDATE.productPrice)
		}
	} else {
		// 无需条件
		if (isDesignatedGoods) {
			promotionPrice(-2, ruleValue, rule, active, CARTDATE, param, couponProduct.price)
		} else {
			promotionPrice(-2, ruleValue, rule, active, CARTDATE, param, CARTDATE.productPrice)
		}
	}
}
//活动计算价格
function promotionPrice($condition, ruleValue, rule, active, CARTDATE, param, productPrice) {
	//  判断是否是否满足活动
	if (($condition >= ruleValue.start || ruleValue.start == -1) && ($condition <= ruleValue.end || ruleValue.end == -1)) {
		if (rule.result == 0) {
			CARTDATE[active.name] = Number(rule.resultValue)
		} else {
			CARTDATE[active.name] = Math.round(productPrice * 10 * (10 - rule.resultValue)) / 100
		}
		if (active.name == 'couponDiscount' && param.hasOwnProperty('couponCode')) {
			CARTDATE.couponCodeMap = { isExist: '1' }
		}
	} else {
		CARTDATE[active.name] = 0
		// 券码不满足，返回不满足信息
		if (active.name == 'couponDiscount' && param.hasOwnProperty('couponCode')) {
			CARTDATE.couponCodeMap.activitiesRule = active.rule //1:金额，2：件数
			CARTDATE.couponCodeMap.difference = active.rule == 1 ? Math.round(ruleValue.start * 100 - $condition * 100) / 100 : ruleValue.start - $condition
			CARTDATE.couponCodeMap.isExist = "1"
		}
	}
}
// 处理所有商品
function calculateGoodsList($goodsList, CARTDATE) {
	// 遍历商品是否有失效商品
	let goodsList = [], invalidGoodsList = [];
	let wholesaleList = []
	let quantity = 0
	$goodsList.forEach(element => {
		element.discount = 10
		let currGoodslist = DETAILDATA.find(item => {
			return item.id == element.goodsId
		})
		if (typeof (currGoodslist) != "undefined" && element.goodsVersion == currGoodslist.goodsVersion) {
			element.sellingPrice = currGoodslist.originalPrice || null
			quantity += element.quantity
			//1.单规格与多规格
			if (currGoodslist.speType == 0 || currGoodslist.speType == 1) {
				let currGoodsSku = currGoodslist.skuList.find(item => {
					return element.skuId == item.id
				});
				if (typeof (currGoodsSku) != "undefined") {
					// 批发
					if (currGoodslist.wholesaleList.length) {
						wholesalePrice(currGoodslist, wholesaleList, element)
						element.isWholesale = 1
					} else {
						element.isWholesale = 0
					}
					if (currGoodsSku.originalPrice != null && currGoodsSku.originalPrice != '') {
						element.sellingPrice = currGoodsSku.originalPrice
					}
					element.discountPrice = currGoodsSku.price
					element.originalPrice = currGoodsSku.price
					element.sku = currGoodsSku.sku
				} else {
					//skuId 不存在
				}
			} else {
				//定制化和3d
				//加价
				if (element.customVal != '' && element.customVal != null) {
					let customVal = JSON.parse(element.customVal)
					let raisePrice = 0
					customVal.forEach(item => {
						raisePrice += Number(item.price);
						if (item.hasOwnProperty('childList')) {
							item.childList.forEach(val => {
								raisePrice += Number(val.price);
							})
						}
					})
					element.discountPrice = currGoodslist.defaultPrice + raisePrice
					element.originalPrice = currGoodslist.defaultPrice + raisePrice
					element.sellingPrice = currGoodslist.originalPrice != null ? currGoodslist.originalPrice + raisePrice : ''
					if (currGoodslist.wholesaleList.length) {
						wholesalePrice(currGoodslist, wholesaleList, element)
						element.isWholesale = 1
					} else {
						element.isWholesale = 0
					}
					element.sku = currGoodslist.skuList[0].sku
				}
				//批发
			}
			element.categoryId = currGoodslist.categoryId || ''
			element.defaultPrice = currGoodslist.defaultPrice
			element.categoryName = currGoodslist.categoryName || ''
			element.description = currGoodslist.description || ''
			element.afterDicountPrice = Math.round(element.discountPrice * element.quantity * 100) / 100
			goodsList.push(element)
		} else {
			invalidGoodsList.push(element)
		}
	});
	CARTDATE.goodsCount = quantity
	// 处理批发
	if (wholesaleList.length) {
		goodsList.forEach(item => {
			let wholesaleItem = wholesaleList.find(val => {
				return item.goodsId == val.goodsId
			})
			if (typeof (wholesaleItem) != "undefined") {
				item.discount = wholesaleItem.discount
				if (item.discount != 10) {
					item.sellingPriceOld = item.sellingPrice
					item.sellingPrice = item.originalPrice
				} else {
					if (typeof (item.sellingPriceOld) != "undefined") item.sellingPrice = item.sellingPriceOld
				}
				item.discountPrice = Math.round(item.originalPrice * wholesaleItem.discount * 10) / 100
				item.afterDicountPrice = Math.round(item.discountPrice * item.quantity * 100) / 100
			}
		})
	}
	//商品总价(不计算优惠券等折扣)
	CARTDATE.productPrice = totalPrice(goodsList)
	CARTDATE.goodsList = goodsList
	CARTDATE.invalidGoodsList = invalidGoodsList
	return $goodsList, CARTDATE
}
function wholesalePrice(currGoodslist, wholesaleList, element) {
	let isSave = false
	if (wholesaleList.length) {
		wholesaleList.forEach(item => {
			if (item.goodsId == element.goodsId) {
				isSave = true
				item.quantity += element.quantity
				let wholesaleCell = item.wholesaleList.find(val => {
					return ((item.quantity >= val.startCount || val.startCount == '' || val.startCount == null) && (item.quantity <= val.endCount || val.endCount == '' || val.endCount == null))
				})
				if (typeof (wholesaleCell) != "undefined") {
					item.discount = wholesaleCell.discount
				} else {
					item.discount = 10
				}
			}
		})
	}

	if (!isSave) {
		let wholesaleItem = {
			goodsId: element.goodsId,
			quantity: element.quantity,
			wholesaleList: currGoodslist.wholesaleList
		}
		let wholesaleCell = currGoodslist.wholesaleList.find(val => {
			return ((element.quantity >= val.startCount || val.startCount == null || val.startCount == '') && (element.quantity <= val.endCount || val.endCount == null || val.endCount == ''))
		})
		if (typeof (wholesaleCell) != "undefined") {
			wholesaleItem.discount = wholesaleCell.discount
		} else {
			wholesaleItem.discount = 10
		}
		wholesaleList.push(wholesaleItem)
	}
}
function totalPrice($goodsList) {
	let productPrice = 0
	$goodsList.forEach(item => {
		productPrice = Math.round(productPrice * 100 + item.discountPrice * item.quantity * 100) / 100
	})
	return productPrice
}

// 返回所有可用优惠券和未达到的优惠券
function canUseCouponList($couponList, CARTDATE) {

	const couponListArr = [] //用户领取的优惠券
	// 处理优惠券
	if ($couponList.length) {
		$couponList.forEach(item => {
			const couponListItem = CONFIGDATA.couponList.find(val => { return val.id == item.couponId })
			if (typeof (couponListItem) != 'undefined') {
				couponListItem.couponId = item.id
				couponListArr.push(couponListItem)
			}
		})
	}
	const couponList = []
	couponListArr.forEach(item => {
		// 判断时间范围
		if (item && !contrastTime(true, item.end, item.start) || item.settlementType == 1) {
			return false
		}
		// 判断是否为指定商品券
		if (item.hasOwnProperty('goods') && item.goods.length) {
			const couponGoods = []
			item.goods.forEach(item => {
				couponGoods.push(item.goodsId)
			})
			const isSave = CARTDATE.goodsList.some(item => couponGoods.includes(item.goodsId))
			if (!isSave) return false
		}
		const couponListItem = {
			id: item.couponId,
			couponNum: item.couponNum,
			isValid: '0', //是否满足 0 满足 1 不满足
			name: item.name,
			ruleDesc: item.ruleResult == '0' ? item.ruleResultValue : (100 - Number(item.ruleResultValue) * 10) + '%',
			ruleResult: item.ruleResult,
			addFoldUp: item.addFoldUp,//是否和全场活动互斥（0否1是）
			couponId: item.id
		}
		if (item.ruleValue == '' || item.ruleValue == null) {
			ruleValue_end = -1
			ruleValue_start = -1
		} else if (item.ruleValue.includes(',')) {
			ruleValue_start = Number(item.ruleValue.split(',')[0]);
			ruleValue_end = Number(item.ruleValue.split(',')[1])
		} else {
			ruleValue_start = Number(item.ruleValue);
			ruleValue_end = -1
		}
		/*
		  difference：差值为
		  proportion：差值百分数
		  "activitiesRule":"1买满金额 2买满件数"
		*/
		let activitiesRule = item.activitiesRule
		const productIdArr = []
		const couponProduct = {
			price: CARTDATE.productPrice,
			count: CARTDATE.goodsCount
		}

		if (item.hasOwnProperty('goods') && item.goods.length) {
			couponProduct.price = 0, couponProduct.count = 0
			item.goods.forEach(val => {
				productIdArr.push(val.goodsId)
			})
			CARTDATE.goodsList.forEach(val => {
				if (productIdArr.includes(val.goodsId)) {
					couponProduct.price = Math.round(couponProduct.price * 100 + val.discountPrice * val.quantity * 100) / 100
					couponProduct.count += val.quantity
				}
			})
		}
		// 折扣方式（金额1，件数2，无需条件0）
		if (activitiesRule == 1) {
			if ((couponProduct.price < ruleValue_start) || ruleValue_start == -1) {
				couponListItem.difference = Math.round(ruleValue_start * 100 - couponProduct.price * 100) / 100
				couponListItem.activitiesRule = 1
				couponListItem.isValid = '1'
				couponListItem.proportion = Math.round(couponProduct.price / ruleValue_start * 100) + '%'
			} else if (couponProduct.price > ruleValue_end && ruleValue_end != -1) {
				return false
			}
		} else if (activitiesRule == 2) {
			if ((couponProduct.count < ruleValue_start) || ruleValue_start == -1) {
				couponListItem.difference = ruleValue_start - couponProduct.count
				couponListItem.activitiesRule = 2
				couponListItem.isValid = '1'
				couponListItem.proportion = Math.round(couponProduct.count / ruleValue_start * 100) + '%'
			} else if (couponProduct.count > ruleValue_end && ruleValue_end != -1) {
				return false
			}
		}
		couponList.push(couponListItem)
	})
	couponList.sort(function (a, b) {
		return a.isValid - b.isValid
	});
	return couponList
}




