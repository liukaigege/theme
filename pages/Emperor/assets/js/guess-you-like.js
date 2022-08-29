
(function ($) {

	//声明变量储存猜你喜欢商品列表数据
	let guessList = [];
	// 获取所有商品列表 productList
	const productList = DETAILDATA,
		// 猜你喜欢列表商品(最多12个,随机获得)
		maxRandomNumber = productList.length,
		// 获取随机数函数R
		getRandom = (start = 0, end = 0) => {
			// start, end交换是为了书写习惯，可以只输入一个值即可
			var { start, end } = { end, start },
				randomNumber = Math.random() * (end - start)
			return Math.floor(randomNumber) + start
		},
		checkGuessList = (list = [], number = 12) => {
			// 自调用，获取12个商品
			if (list.length < number) {
				const ele = productList[getRandom(maxRandomNumber)]
				if (list.every(v => v.id != ele.id)) list.push(ele)
				checkGuessList(list)
			} else {
				return guessList = list
			}
		};
	if (maxRandomNumber < 13) {
		// 总商品数量不超过12个，直接全部作为猜你喜欢
		guessList = productList
	} else {
		// 总商品数量较多，随机筛选12个出来
		checkGuessList()
	}

	let goodsBannerStr = ''
	guessList.forEach(v => {
		let discountNum = ((v.originalPrice-v.defaultPrice)*100/v.originalPrice).toFixed(0)
		if(discountNum==100){
			discountNum = 99
		}else if(discountNum==0){
			discountNum = 1
		}
		goodsBannerStr += `
			<div class="swiper-slide" data-id="${v.id}">
				<div class="cover_wrap">
					<img class="cover " src="${v.mainImg}" data-suffix-img="${v.mainImg}" alt="">
				</div>
				<p class="m_title">${v.goodsName}</p>
				<div class="price">
					<del class="old_price ${v.originalPrice?'':'hide'}" p-price="${ v.originalPrice}">&yen;${v.originalPrice}</del>
					<span class="now_price" p-price="${ v.defaultPrice}">&yen;${v.defaultPrice}</span>
				</div>
				<div class="card-discount-container">
					<div class="card-discount card-discount-coupon ${v.originalPrice&&v.originalPrice>v.defaultPrice?'':'hide'}">${discountNum}% OFF</div>
					<div class="card-discount card-discount-shipng ${v.freeShipping?'':'hide'}">Free Shipping</div>
				</div>
			</div>
		`
	})
	$('.swiper-Banner').html(goodsBannerStr).on('click', '.swiper-slide', function () {
		window.location.href = './productDetail_' + $(this).data('id') + '.html'
	})


})(window.jQuery);
