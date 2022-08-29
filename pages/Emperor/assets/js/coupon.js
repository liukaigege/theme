// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  2022年3月28日重构优惠券弹框模块 Start   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
$(document).ready(function () {
	let getCouponStatus = true
	if (CONFIGDATA.commomCoupon.length) {
		const commomCouponData = CONFIGDATA.commomCoupon[0]
		// detailsDisplay是否在详情页面展示，categoryDisplay是否在分类页面展示，indexDisplay是否在主页展示
		const { detailsDisplay, categoryDisplay, indexDisplay, start, end } = commomCouponData
		const couponPage = [
			{
				pageName: '',
				pageDisplay: indexDisplay,
			},
			{
				pageName: 'index',
				pageDisplay: indexDisplay,
			},
			{
				pageName: 'productList',
				pageDisplay: categoryDisplay,
			},
			{
				pageName: 'productDetail',
				pageDisplay: detailsDisplay,
			},
		]
		if ($.getSessionStorage('isGetCoupon') != 1 && commomCouponData.list.length && $.getParam('isIframe') != 1 && $.isEffective(start, end)) {
			couponPage.forEach((item) => {
				if (window.location.pathname.includes(item.pageName) && item.pageDisplay == 1) {
					$('.coupon-modal').show()
				}
				// if ($('.coupon-modal').length) $.forbidScroll()
			})
		} else {
			$('.coupon-modal').hide()
		}
	}

	$('.coupon-modal')
		.on('click touchstart', '.coupon-modal_close--pc', function (e) {
			e.stopPropagation()
			// pc端点击取消领取优惠券
			setTimeout(function () {
				$('.coupon-modal').hide()
			}, 500)
			// 取消之后pc端x方向不要滚动
			$.allowScroll()
			$.setSessionStorage('isGetCoupon', 1)
		})
		.on('click', '.coupon-modal_options--btn', function (e) {
			e.stopPropagation()
			// 点击获取优惠券
			if (getCouponStatus) {
				getCouponStatus = false
				setTimeout(function () {
					getCouponStatus = true
				}, 3000)
				const couponArr = []
				const couponList = CONFIGDATA.commomCoupon[0].list
				// couponList有值
				for (let i = 0; i < couponList.length; i++) {
					if ($.isEffective(couponList[i].couponStart, couponList[i].couponEnd)) {
						couponArr.push(couponList[i].id)
					}
				}
				// couponArr空数组，未收到值
				const couponIds = couponArr.join(',')
				getCoupon(couponIds, function (result) {
					if (result.code == 0) {
						$('.coupon-modal_content').empty() //  直接删除优惠券领取界面
						// $('.coupon-modal_content').hide()
						$('.coupon-modal_success').show()
						$.setSessionStorage('isGetCoupon', 1)
					}
				})
			}
		})
		.on('click touchstart', '.coupon-modal_success--container', function () {
			$.allowScroll()
			$.setSessionStorage('isGetCoupon', 1)
			setTimeout(function () {
				$('.coupon-modal').hide()
			}, 500)
		})
		.on('click touchstart', '.coupon-modal_success--btn', function () {
			setTimeout(function () {
				$('.coupon-modal').hide()
			}, 500)
			// 取消之后pc端x方向不要滚动
			$.allowScroll()
			$.setSessionStorage('isGetCoupon', 1)
		})

	let flags = 1

	function getCoupon(couponIds, callback) {
		flags++
		if (flags % 2 == 0) {
			getToken(function () {
				$.req({
					url: '/api/v1/goods/coupon',
					type: 'get',
					data: {
						couponId: couponIds,
						type: '1',
					},
					success(res) {
						flags = 1
						callback(res)
					},
				})
			})
		}
	}
})
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  2021年3月28日重构优惠券弹框模块 End     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
