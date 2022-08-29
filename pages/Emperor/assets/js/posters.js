$(document).ready(function () {
	$('.posters-block').each(function () {
		let jumpUrl = ''
		const buttonJump = $(this).find('.poster-button__event')
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
