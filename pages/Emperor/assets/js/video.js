$(document).ready(function () {
	$('.video-blcok').each(function () {
		const video = $(this).find('video')[0]
		let isLargeScreen = window.innerWidth > 992
		// 屏幕改变时  重置参数
		$(window).resize(
			$.throttle(function () {
				isLargeScreen = window.innerWidth > 992
			})
		)
		$(this)
			.find('.video-play')
			.on('click', function () {
				$(video).show()
				video.play()
				$(this).hide()
				$(this).siblings('.video-mask').hide()
			})
		video.addEventListener(
			'pause',
			function () {
				// if (!isLargeScreen) {
				// $(this).siblings('.video-play').show()
				// }
			},
			false
		)
		video.addEventListener(
			'ended',
			function () {
				// if (!isLargeScreen) {
				// 	$(this).siblings('.video-play').show()
				// }
			},
			false
		)
		video.addEventListener(
			'playing',
			function () {
				$(video).show()
				$(this).attr('controls', 1)
				$(this).siblings('.video-play').hide()
				$(this).siblings('.video-mask').hide()
			},
			false
		)

		// 按钮跳转
		let jumpUrl = ''
		const buttonJump = $(this).find('.video-button__event')
		const link = buttonJump.attr('data-link')
		const status = buttonJump.attr('data-status')
		buttonJump.click(function () {
			if (link.includes('productList_')) {
				const id = link.slice('productList_'.length, link.indexOf('.html'))
				jumpUrl = `productList.html?id=${id}`
			} else {
				jumpUrl = link
			}
			window.location.href = status ? jumpUrl : ''
		})
	})
})
