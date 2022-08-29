$.extend({
	toast: function (title, content) { // 提示框
		$('.toast .mr-auto').text(title)
		$('.toast .toast-body').text(content)
		$('.toast .close').on('click', function () {
			$('.toast').animate({
				opacity: 0
			}, 300, function () {
				$(this).hide()
			})
		})
		$('.toast').show().animate({
			opacity: 1
		}, 300)
	},
	alert: function (type, text, position = "center") {
		// 第一个参数 字符串 类型枚举 'success','danger','warning'，
		// 第二个参数 字符串 alert显示内容，
		// 第三个参数 字符串 alert出现的位置 默认'center', 可选 'top' 暂时弃用
		let content = `<div class="alerts">
												<span class="icon iconfont icon-${type}"></span>
												<span class="text">
														${text}
												</span>
									</div>`
		$('#alert-box').append(content)
		let div = $('#alert-box .alerts').last().animate({
			opacity: 1,
		}, 200).toggleClass('alerts-show')
		setTimeout(() => {
				div.toggleClass('alerts-show')
				setTimeout(() => {
					div.remove()
				}, 300);
		}, 2000)
	},
	confirm: function (options = {}) { // 对话框
		let defaultOptions = {
			title: '提示',
			content: '默认提示语',
			cancel: '取消',
			determine: '确定',
			callback: null, // 确认的回调函数
		}
		let obj = Object.assign(defaultOptions, options)
		if(options.title) $('#confirm-mask .modal-title').text(obj.title)
		else $('#confirm-mask .modal-header').hide()
		$('#confirm-mask .modal-body').text(obj.content)
		$('#confirm-mask .cancel').text(obj.cancel).on('click', $.closeConfirm)
		$('#confirm-mask .determine').text(obj.determine).on('click', obj.callback || $.closeConfirm)
		$('#confirm-mask #confirm-close').on('click', $.closeConfirm)
		$('#confirm-mask').show()
	},
	closeConfirm: function () { // confirm回调函数中加入这个关闭对话框
		$('#confirm-mask').hide()
	}
})
