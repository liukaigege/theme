$(function () {
	let orderList = [] //订单总数据
	const paramArr = decodeURI(window.location.href).split('?').pop();
	const orderId = paramArr.split('=')[1];
	getToken(function () {
		$.req({
			url: '/api/v1/orders/orders',
			type: 'get',
			data: {
				param: orderId
			},
			success(res) {
				if (res.code == 0) {
					orderList = res.data || []
					if (/mobile/i.test(navigator.userAgent)) {
						if (!orderList.length) {
							$('.order-content').addClass('hide')
							$('.empty-container').removeClass('hide')
							return false
						} else {
							$('.empty-container').addClass('hide')
							$('.order-content').removeClass('hide')
						}
						$('.order-content__header span').html(orderList.length || 0)
						let html = ''
						orderList.forEach(item => {
							html += createHtml(item, true)
						})
						$('.order-detail').html(html)


					} else {
						if (!orderList.length) {
							$('.order-content').addClass('hide')
							$('.empty-container').removeClass('hide')
							return false
						} else {
							$('.empty-container').addClass('hide')
							$('.order-content').removeClass('hide')
						}
						renderHtml(1)
					}
				}
			}
		});
	});

	function renderHtml(type) {
		const list = orderList.filter(v => {
			if (type == 1 && v.paymentStatus == 2) {
				// Payment Successful
				return v
			} else if (type == 2 && (v.paymentStatus == 1 || v.paymentStatus == 3)) {
				// Awaiting Payment
				return v
			} else if (type == 4 && v.paymentStatus == 5) {
				// Payment Failed
				return v
			} else if (type == 3 && v.paymentStatus == 4) {
				// Pending…
				return v
			}
		})
		$('.order-content__header span').html(list.length || 0)
		let html = ''
		list.forEach(item => {
			html += createHtml(item, false)
		})
		$('.order-detail').html(html)
	}


	//切换支付转态（pc）
	$(document).on('click', '.order-list__header li', function () {
		$(this).addClass('active').siblings().removeClass('active')
		let type = $(this).data('id') - 0
		renderHtml(type)
	}).on('click', '.emptyContainer button', function () {
		window.location.href = './productList.html'
	})

	// 点击下拉展示内容
	$(document).on('click', '.status-items,.items_click', function () {
		$(this).siblings('.open-content').slideToggle(300)
		$(this).find('.s_status').toggleClass('active')
	})
})

//时间戳转化为时间格式 yyyy-MM-dd HH:mm:ss
function dateTrans(date) {
	let _date = new Date(date.replace(/-/g, '/'));
	_date.setDate(_date.getDate() + 7);
	let y = _date.getFullYear();
	let m = _date.getMonth() + 1;
	m = m < 10 ? ('0' + m) : m;
	let d = _date.getDate();
	d = d < 10 ? ('0' + d) : d;
	let h = _date.getHours();
	h = h < 10 ? ('0' + h) : h;
	let minute = _date.getMinutes();
	let second = _date.getSeconds();
	minute = minute < 10 ? ('0' + minute) : minute;
	second = second < 10 ? ('0' + second) : second;
	let dates = String(y) + '-' + String(m) + '-' + String(d) + ' ' + String(h) + ':' + String(minute) + ':' + String(second);
	return dates;
};



$(document).on('click', '.zoomImg .iconfont', function () {
	$('.zoomImg').remove()
})
