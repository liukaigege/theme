$(document).ready(function () {
	// 在iframe子页面
	// 操作类型：1： 滚动页面；2： 删除积木；3：添加积木；4：更新积木；5：排序,6:初始化页面;7：重新加载页面

	window.addEventListener("message", function (event) {
		//event.data获取传过来的数据
		var type = event.data.type;
		var typeId = event.data.typeId;
		var sectionId = "#" + event.data.sectionId;
		var data = event.data.data;
		if (type === 1) {
			if (typeId == 9) return; // 全局配置模块不需要滚动页面
			scrollFun(sectionId);
		} else if (type === 2) {
			$(sectionId).remove();
		} else if (type === 3) {
			$(".pageFooter").before(data);
			scrollFun(sectionId);
		} else if (type === 4) {
			$(sectionId).replaceWith(data);
			if (typeId === 1) {
				navList = event.data.blockObj.config.catalogue.list;
				$("#navigation").mouseleave(function () {
					$("#menu").fadeOut(300);
				});
				$(".header .navigation .scroller-style-001").removeClass(
					"opClass"
				);
				$("#navigation #scroller li").mouseenter(function () {
					var displayStyle = $("#navigation").attr("displayStyle");
					var categoryId = $(this).attr("categoryId");
					renderMenu(navList, categoryId, displayStyle);
				});
			} else if (typeId === 2 || typeId === 4) {
				initSwiper();
			}
		} else if (type === 5) {
			var blocks = $("[type-block]");
			$("#blocks").html();
			for (let i = 0; i < data.length; i++) {
				for (let j = 0; j < blocks.length; j++) {
					if ($(blocks[j]).attr("id") == data[i]) {
						$("#blocks").append(blocks[j]);
					}
				}
			}
			scrollFun(sectionId);
		} else if (type === 6) {
			$("#blocks").html(data);
			navList = event.data.blockObj.config.catalogue.list;
			$("#navigation").mouseleave(function () {
				$("#menu").fadeOut(300);
			});
			// $('#navigation #scroller li').mouseleave(function () {
			//   $(this).children('.menu').fadeOut(300)
			// })

			$("#navigation #scroller li").mouseenter(function () {
				var displayStyle = $("#navigation").attr("displayStyle");
				var categoryId = $(this).attr("categoryId");
				renderMenu(navList, categoryId, displayStyle);
			});
			initSwiper();
		} else if (type === 7) {
			location.reload();
		} else if (type === 10) {
			initSwiper();
		} else if (type === 11) {
			switchRate(data);
		}
		if (typeId == 5) {
			setPosterWidthHeightFn();
		} else if (typeId == 8) {
			// 底部页脚修改了
			wapSwiperFn();
		} else if (typeId == 2) {
			var bannerListArr = [];
			initBannerFn([event.data.blockObj]);
			if (event.data.blockObj.config.bannerList.length > 1) {
				initSwiper();
			}
		}
		var listEle = $(".header .navigation .scroller-style-001").find("li");
		var toRightContainerWidth = 0; //需要滑动的模块外容器，初始值为0，先启动第一次滑动
		for (var i = 0; i < listEle.length; i++) {
			toRightContainerWidth += listEle.eq(i).width() + 100;
		}
		$(".header .navigation .scroller-style-001").width(
			toRightContainerWidth - 100
		);
		window.parent.postMessage("完成", "*");
	});
	$("#globalDialog").hide();
	window.addEventListener(
		"click",
		function (e) {
			// this.alert('当前为预览页面，禁止点击操作！')
			e.stopPropagation();
			e.preventDefault();
			return;
		},
		true
	);
});

function setPosterWidthHeightFn() {
	// 设置海报图片宽高
	if ($(".imgBox1").length > 0) {
		for (var i = 0; i < $(".imgBox1").length; i++) {
			var imgEle = $(".imgBox1").eq(i).find("img");
			if (imgEle.width() / imgEle.height() > 1600 / 878) {
				imgEle.css({ width: "100%" });
			} else {
				if (IsPC() && $(".imgBox1").eq(i).width() > 750) {
					imgEle.height(($(".imgBox1").eq(i).width() * 878) / 1600);
				}
			}
		}
	}
}
function IsPC() {
	var userAgentInfo = navigator.userAgent;
	var Agents = [
		"Android",
		"iPhone",
		"SymbianOS",
		"Windows Phone",
		"iPad",
		"iPod",
	];
	var flag = true;
	for (var v = 0; v < Agents.length; v++) {
		if (userAgentInfo.indexOf(Agents[v]) > 0) {
			flag = false;
			break;
		}
	}
	return flag;
}
function scrollFun(sectionId) {
	var scrollTop = sectionId ? $(sectionId).offset().top - 100 : 0;
	$("body,html").animate(
		{
			scrollTop: scrollTop,
		},
		500
	);
}

function loadJs(file) {
	var head = $("head").remove(`script[role='${file}']`);
	$("<scri" + "pt>" + "</scr" + "ipt>")
		.attr({
			role: "reload",
			src: `../assets/blocks/js/${file}.js`,
			type: "text/javascript",
		})
		.appendTo(head);
}
