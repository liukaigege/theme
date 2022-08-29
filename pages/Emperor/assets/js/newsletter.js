$(document).ready(function () {
	// 订阅输入框enter键
	$('#inputEmail').bind('keypress', function (e) {
		submitSubscribe(e)
	})
	// 订阅按钮
	$('#buttonEmail').on('click', function () {
		submitSubscribe(0)
	})

	/**
	 * 邮箱订阅
	 *  @param {*} e 是否触发回车事件
	 */
	function submitSubscribe(e) {
		if (e) {
			const evt = window.event || e
			if (evt.keyCode !== 13) return
		}
		const email = $('#inputEmail').val()
		const reg =
			/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/
		if (reg.test(email)) {
			$.req({
				url: '/api/v1/user/subscribe',
				type: 'post',
				contentType: 'application/json;charset=UTF-8',
				data: JSON.stringify({
					email
				}),
				success(res) {
					if (res.code === 0) {
						// $.alert('success', $('.subscribe-success').text())
						$('#newsletter .newsletter-subscribed').show()
						$('#newsletter .newsletter-subscribing').hide()
					} else {
						$.alert('danger', res.msg)
					}
				},
			})
		} else {
			$.alert('danger', $('.empty-address').text())
		}
	}
})
