// const e = require("express");

var threeDItem = false,
	colorId = 0,//3d => 颜色id
	modalId = 0,//3d => 已定义modal id
	goodId = 0,//3d => 选择的属性 id
	tempGoodId = 0,//3d => 选择的属性 id （临时用）
	theGoodsHasModal = false,//3d => 当前产品是否是3d产品
	goodsInfo = [], buyAndAddStatus = true;
var version = new Date().getTime()
$(document).ready(function () {
	var allStaticId = [],
		speType = 0,
		$staticTextLen = 0,
		wholeBasePrice = 0,
		newIsPreview = $('#isPreview').val(),
		myPlayer = null,
		goodsInfo = [];

	layui.config({
		version: true,
		base: '/layui'
	}).use(['jquery', 'layer', 'laytpl', 'form'], function () {
		let $ = layui.jquery,
			layer = layui.layer,
			laytpl = layui.laytpl,
			form = layui.form;

		/* 获取环境标识 */
		function getEnvirVal() {
			let preUrl = $.url.setUrl(window.location.url).attr("host");
			if (preUrl.split(".").length - 1 >= 2) { //判断.出现次数 >=2
				let url = preUrl.split(".");
				return url[url.length - 2];
			} else if (preUrl.split(".").length - 1 == 1) {
				return preUrl.split('.')[0];
			} else {
				return '';
			}
		}

		function createOssClient() {
			return new Promise((resolve, reject) => {
				var client = new OSS({
					// region: 'oss-cn-hangzhou',
					region: getEnvirVal() == 'shopvango' ? 'oss-cn-hangzhou' : 'oss-accelerate',
					accessKeyId: 'Jy6PO9aZI82pJzYh',
					accessKeySecret: 'pqhJx2AJineLcJpguU1SPImdB7ZLuv',
					// bucket: 'vshoptest'
					bucket: getEnvirVal() == 'shopvango' ? 'vshoptest' : 'vshop001'
				})
				resolve(client)
			})
		}

		// 计算价格
		function count(defaultPrice, originalPrice) {
			let discount;
			if (originalPrice && originalPrice > defaultPrice) {
				discount = parseFloat(Math.floor(100 - defaultPrice / originalPrice * 100)) || 1
				$('.allPirce .o_price').html($currency.getPrice(originalPrice)).removeClass('hide');
				$('.allPirce .c_price').html($currency.getPrice(defaultPrice)).removeClass('hide');
				$('.allPirce .d_num').html(discount);
				$('.allPirce .discount').removeClass('hide');
			} else {
				$('.allPirce .discount,.allPirce .o_price').addClass('hide');
				$('.allPirce .c_price').html($currency.getPrice(defaultPrice)).removeClass('hide');
			}
			$('.allPirce .c_price').attr('US-price', Math.round(defaultPrice * 100) / 100)
		}

		function wholesaleCount(defaultPrice, discount) {
			$('.wholesaleTable tr').each(function (index, el) {
				if (index > 0) {
					let wdiscount = Number($(el).attr('data-discount'));
					$(el).find('td[w-rate]').html(Math.round(1000 - wdiscount * 100) / 10 + '% ' + 'OFF');
					$(el).find('td[w-price]').html($currency.getPrice(defaultPrice * (wdiscount / 10)));
				}
			});
			if ($('.wholesaleTable tr').hasClass('active')) {
				if (discount != 10) {
					$('.allPirce .o_price').html($currency.getPrice(defaultPrice)).removeClass('hide');
					$('.allPirce .d_num').html((parseFloat((10 - discount).toFixed(10))) * 10 || 1);
					$('.allPirce .discount').removeClass('hide');
				} else {
					$('.allPirce .o_price').addClass('hide')
					$('.allPirce .discount').addClass('hide')
				}
				$('.allPirce .c_price').html($currency.getPrice(defaultPrice * (discount / 10))).removeClass('hide');
				$('.allPirce .c_price').attr('US-price', (Math.round(defaultPrice * (discount / 10) * 100) / 100))
			} else {
				if (discount && discount != '' && Number(discount) != 10 && Object.prototype.toString.call(discount).slice(8, -1) != 'Null') {
					if (contrastTime(true, end, start)) {
						$('.allPirce .discount').removeClass('hide');
						$('.allPirce .o_price').removeClass('hide');
					} else {
						$('.allPirce .discount').addClass('hide');
						$('.allPirce .o_price').addClass('hide');
					}
				} else {
					$('.allPirce .discount').addClass('hide');
					$('.allPirce .o_price').addClass('hide');
				}
			}
		}
		$('.threeDModal').on('click', '.threeDModalCloose', function () {
			$('.threeDModal').hide()
		})
		/* 商品评论 */
		function comments() {
			$('#comment_form .star').on('click', function (event) {
				event.stopPropagation();
				$(this).prevAll().removeClass('empty').addClass('realStar');
				$(this).removeClass('empty').addClass('realStar');
				$(this).nextAll().addClass('empty').removeClass('realStar');
			});
			$('.reviewBtn').on('click', function (event) {
				event.stopPropagation();
				$('#comment_form').toggleClass('hide');
			});

			$('#review_email').keyup(function (e) {
				var $emailVal = $(this).val().replace(/\s/g, '');
				$(this).val($emailVal);
			});
			$('.addCommentItem').on('click', '.delAddImgBtn', function (event) {
				$(this).closest('div').find(".pro-file").val('');
				$(this).parents('li').remove();
			});
			$('#comment_form .addImgFile').on('change', function (event) {
				event.stopPropagation();
				var arr = [
					'image/png',
					'image/jpg',
					'image/jpeg',
					'image/bmp',
					'image/gif',
					'image/webp'
				];
				if (!$(this).prop('files').length) {
					return false;
				}
				if ($('#comment_form .addCommentItem li').length > 7 || $(this).prop('files').length > 8 || ($('#comment_form .addCommentItem li').length + $(this).prop('files').length) > 8) {
					layer.msg('Up to 8 pictures!', {
						icon: 5,
						time: 1000
					});
					// return false;
				}
				let MaxNewFilesLen = 8 - $('#comment_form .addCommentItem li').length
				let newFiles = $(this).prop('files');
				const newFilesLen = $(this).prop('files').length
				MaxNewFilesLen = MaxNewFilesLen < newFilesLen ? MaxNewFilesLen : newFilesLen
				const newFilesResult = []
				for (let zIndex = 0; zIndex < MaxNewFilesLen; zIndex++) {
					if (arr.indexOf(newFiles[zIndex].type) === -1) {
						layer.msg('Wrong picture type!', {
							icon: 5,
							time: 1000
						});
						$(this).val('');
						return false;
					}
					let isLt2M = newFiles[zIndex].size / 1024 / 1024 < 10;
					if (!isLt2M) {
						layer.msg('Upload picture less than 10M(10M)!', {
							icon: 5,
							time: 1000
						});
						$(this).val('');
						return false;
					}
					new Promise((resolve, reject) => {
						let extensionName = newFiles[zIndex].name.substr(newFiles[zIndex].name.indexOf('.')); // 文件扩展名
						const fileUrl = randomImgName() + extensionName; // 文件名字（相对于根目录的路径 + 文件名）
						// 执行上传
						let $loadingIndex = layer.load(2);
						createOssClient().then(client => {
							// 异步上传,返回数据
							resolve({
								fileName: MD5(newFiles[zIndex].name) + newFiles[zIndex].name,
								fileUrl: fileUrl
							})
							// 上传处理
							async function putObject() {
								try {
									let result = await client.put(fileUrl, newFiles[zIndex])
									layer.close($loadingIndex);
									if (result.url) {
										newFilesResult.push({ 'val': result.url, 'num': zIndex })
										if (newFilesResult.length == MaxNewFilesLen) {
											newFilesResult.sort(sortby('num'))
											function sortby(prop) {
												return function (a, b) {
													var val1 = a[prop];
													var val2 = b[prop];
													return val1 - val2
												}
											}
											newFilesResult.forEach(item => {
												let addImg = '<li>' +
													'<img class="commentImg" src="' + item.val + '"/>' +
													'<img class="delAddImgBtn" src="../assets/pc/images/zClose.png"></img>' +
													'</li>';
												$('#comment_form .addCommentItem').append(addImg).removeClass('hide');
											})
										}

									}
								} catch (e) {
									layer.msg('Upload failed!', {
										icon: 5,
										time: 1000
									});
									layer.close($loadingIndex);
								}
							}
							putObject();
						});
					});
				}
			});
			form.on('submit(commentBtn)', function (data) {
				form.verify({
					len: function (value) {
						if (value.length > 100) {
							return 'Mailbox length more than 100';
						}
					},
					newEmail: function (value) {
						if (!/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9])+$/.test(value)) {
							return 'Enter your email address';
						}
					}
				});
				if (!$('#comment_form').find('.realStar').length) {
					layer.msg('Select your star', {
						icon: 5,
						time: 1000,
						success() {
							$('.layui-layer-msg').addClass('coupon_msg');
						}
					});
					return false;
				}
				data.field.star = 5 - ($('#comment_form').find('.realStar').length) > 0 ? ($('#comment_form').find('.realStar').length) : 5;
				data.field.goodsId = parseInt($('.pro_details .title').attr('data-id'));
				data.field.comment = String(data.field.comment);
				data.field.name = String(data.field.name);
				if ($('#comment_form .addCommentItem li').length) {
					let imgArr = [];
					$('#comment_form .addCommentItem li').each(function (index, el) {
						let $obj = {
							url: $(el).find('.commentImg').attr('src'),
							type: 1
						};
						imgArr.push($obj);
					});
					data.field.resourceList = imgArr;
				}
				let submitIndex = layer.load(2);
				getToken(function () {
					$.req({
						url: '/api/v1/goods/comment',
						type: 'post',
						contentType: 'application/json;charset=UTF-8',
						data: JSON.stringify(data.field),
						success(res) {
							layer.close(submitIndex);
							layer.msg(res.msg, {
								time: 1000,
								icon: 6
							}, function () {
								$('#comment_form #review_author,#comment_form #review_email,#comment_form #review_body').val('');
								$('#comment_form .star').addClass('empty');
								$('#comment_form').addClass('hide');
								$('#comment_form .addCommentItem li').remove();
							});
						}
					});
				});

				return false;
			});
		}
		comments();

		function productDetails() {
			let description = $('.descr').attr('data-description');
			if (description && description != '' && Object.prototype.toString.call(description).slice(8, -1) != 'Null') {
				$('.descr .d_text').load('/static-page' + description + '?version=' + new Date().getTime(), '', function () {
				});

			} else {
				$('.p_main .descr').remove();
			}

			//重置数量输入框
			$('.q_number_wrap').find('.q_number').val(1);

			//speType 2定制化 1多规格 0单规格
			speType = $('.pro_details .title').attr('data-speType');
			let jsonUrl = '';
			var res = JSON.parse(localStorage.getItem('$DETAILDATA')) || DETAILDATA
			if (newIsPreview == 'true') {
				$.ajaxSettings.async = false; // 同步执行
				$.getJSON('../data/previewDetail.json?version=' + version, function (r) {
					res = r
				})
				$('.cart_wrap').addClass('hide');
			}
			let productId = $('.pro_details .title').attr('data-id');
			for (let i = 0; i < res.length; i++) {
				if (res[i].id == productId) {
					//优惠券逻辑
					goodsInfo = res[i];
					console.log('goodsInfo==>', goodsInfo)
					function baseCoupon() {
						if (res[i].couponList && res[i].couponList.length) {
							let couponTplHtml = $('#couponTpl').html();
							laytpl(couponTplHtml).render(res[i].couponList, function (html) {
								$('.pro_details .details_coupon_wrap').html(html);
							});
						}
						var galleryThumbs = new Swiper('.gallery-thumbs', {
							spaceBetween: 15,
							slidesPerView: 5,
							freeMode: true,
							freeModeSticky: true,
							freeModeMomentum: true,
							centeredSlidesBounds: true,
							watchSlidesVisibility: true,
							watchSlidesProgress: true,
							direction: 'vertical',
							navigation: {
								nextEl: '.h_hd .next',
								prevEl: '.h_hd .prev',
							},
							on: {
								'click': function (e) {
									// 点击关闭多规格属性图片
									if (!$('.p_swiper ').hasClass('.img_box')) {
										$('.p_swiper').remove('.img_box');
									}
								}
							}
						});
						$('.gallery-thumbs .i_img').each(function (index, el) {
							countWH(el, '.gallery-thumbs .swiper-slide');
						});
						$('.gallery-thumbs').on('click', '.swiper-slide', function () {
							$('.p_swiper .img_box').addClass('hide');
							$(this).addClass('swiper-slide-thumb-active').siblings().removeClass('swiper-slide-thumb-active')
							$(this).parent().find('.swiper-slide').removeClass('no_border')
						})
						$(function () {
							$('.jqPreload0').remove();
						});

						$('.picFocus .b_bd').on('click', '.prev', function (event) {
							event.stopPropagation();
							galleryThumbs.slidePrev();
							let $this = $(this);
							$(function () {
								let $imgSrc = $this.parents('.b_bd').find('.swiper-slide.swiper-slide-active .product-gallery__image').attr('rel');
								$('.zoomDiv .bigimg').attr('src', $imgSrc)
							});
						});

						$('.picFocus .b_bd').on('click', '.next', function (event) {
							event.stopPropagation();
							galleryThumbs.slideNext();
							let $this = $(this);
							$(function () {
								let $imgSrc = $this.parents('.b_bd').find('.swiper-slide.swiper-slide-active .product-gallery__image').attr('rel');
								$('.zoomDiv .bigimg').attr('src', $imgSrc)
							});
						});

						var galleryTop = new Swiper('.gallery-top', {
							navigation: {
								nextEl: '.gallery-top .next',
								prevEl: '.gallery-top .prev',
							},
							thumbs: {
								swiper: galleryThumbs
							},
							on: {
								slideChange: function () {
									$('.p_swiper .img_box').addClass('hide');
									$('.p_swiper .h_hd .swiper-slide').removeClass('no_border')
								},
							}
						});
						$('.gallery-top .swiper-wrapper').lightGallery({
							thumbWidth: 64,
							thumbContHeight: 84,
							closable: false,
							fullScreen: false,
							download: false,
							hash: false,
							appendSubHtmlTo: '.lg-sub-html',
							subHtmlSelectorRelative: true
						});
						$('.gallery-top .product-gallery__image').each(function (index, el) {
							countWH(el, '.gallery-top');
						});

						// 点击视频播放按钮
						$('.p_swiper').on('click', '.childBtn', function () {
							let video = $(this).parents('.videoType').attr('video');
							let cover = $(this).parents('.videoType').attr('cover');
							if (video && video != '' && Object.prototype.toString.call(video).slice(8, -1) != 'Null') {
								playVideo(video, true, cover);
							}
						});

						$('.details_coupon_wrap li').each(function (index, el) {
							let start = $(el).attr('data-start'),
								end = $(el).attr('data-end'),
								money = Number($(el).find('[data-money]').attr('data-money')),
								rate = Number($(el).find('[data-rate]').attr('data-rate')),
								dDescr = $(el).find('[data-descr]').attr('data-descr');
							if (!contrastTime(true, end, start)) {
								$(el).remove();
							}
						});

						$('.details_coupon_wrap').on('click', 'li', debounce(function (event) {
							event.stopPropagation();
							let $couponId = $(this).attr('data-id');
							getToken(function () {
								$.req({
									url: '/api/v1/goods/coupon',
									type: 'get',
									data: {
										couponId: $couponId
									},
									success(res) {
										if (res.code === 0) {
											layer.msg('Successfully applied. <br>  Enter the code when you checkout.', {
												// icon: 6,
												skin: 'success_sub',
												time: 1500
											});
										} else {
											layer.msg(res.msg, {
												// icon: 5,
												skin: 'fail_sub',
												time: 1500
											});
										}
									}
								});
							});

						}, 500));

						//点击右侧星级页面滚动到评论区域
						$('.p_views').on('click', function (event) {
							event.stopPropagation();
							let $top = $('.p_main .comment').offset().top - 160;
							$('html,body').animate({
								scrollTop: $top
							}, 800);
						});
					}
					baseCoupon();
					let goodsList = []
					const goodListItem = {
						quantity: 1,
						spuId: res[i].id,
						spu: res[i].goodsName,
						spuPrice: res[i].defaultPrice,
						spuImg: res[i].mainImg
					}
					goodsList.push(goodListItem)
					sendAnalyze('view', {}, goodsList);
					//首次计算批发
					if (res[i].wholesaleList && res[i].wholesaleList.length) {
						countWholePrice(1, res[i].wholesaleList);
					}
					$('.quantity_wrap .q_number').keyup(function () {
						let $val = parseInt($(this).val());
						if ($val > 999) {
							$val = 999;
						}
						if (!$val || $val < 1) {
							$val = 1;
						}
						$(this).val($val);

						if (res[i].wholesaleList && res[i].wholesaleList.length) {
							countWholePrice($val, res[i].wholesaleList);
						}
						if (speType != 2) {
							computeStaticPrice(res[i], res[i].skuList, allStaticId);
						} else {
							//计算总价格
							getMadeProductPrice(res[i]);
						}
					});

					$('.q_number_wrap .reduceBtn').on('click', function (event) {
						event.stopPropagation();
						let val = parseInt($(this).parents('.q_number_wrap').find('.q_number').val());
						if (val > 1) {
							val--;
							$(this).parents('.q_number_wrap').find('.q_number').val(val);
							if (res[i].wholesaleList && res[i].wholesaleList.length) {
								countWholePrice(val, res[i].wholesaleList);
							}
							if (speType != 2 && speType != 3) {
								computeStaticPrice(res[i], res[i].skuList, allStaticId);
							} else {
								//计算总价格
								getMadeProductPrice(res[i]);
							}
						}
					});

					$('.q_number_wrap .addBtn').on('click', function (event) {
						event.stopPropagation();
						let val = parseInt($(this).parents('.q_number_wrap').find('.q_number').val());
						val++;
						if (val > 999) {
							val = 999;
						}

						$(this).parents('.q_number_wrap').find('.q_number').val(val);
						if (res[i].wholesaleList && res[i].wholesaleList.length) {
							countWholePrice(val, res[i].wholesaleList);
						}
						if (speType != 2 && speType != 3) {
							computeStaticPrice(res[i], res[i].skuList, allStaticId);
						} else {
							//计算总价格
							getMadeProductPrice(res[i]);
						}
					});

					var recommend_products_swiper = new Swiper('#recommend_products_swiper', {
						slidesPerView: 3,
						spaceBetween: 20,
						navigation: {
							nextEl: '#recommend-section_swiper .swiper-next',
							prevEl: '#recommend-section_swiper .swiper-prev',
						}
					});
					if (res[i].speType == 2 || res[i].speType == 3) {
						madeProduct(res[i]);
						getMadeProductPrice(res[i]);
					} else {
						standard(res[i]);
						computeStaticPrice(res[i], res[i].skuList, []);
						// $('.pro_attr select').val('');
						selectClear($('.pro_attr .item_select'))
					}
					break;
				}
			}
			// });
			chooseDefault()
		}
		/*
		 清除下拉框
		*/
		function selectClear(item) {
			item.find('.select-input').val('');
			item.find('.vshop-anim-upbit li').removeClass('is_show vshop-select-this')
		}
		productDetails();
		function chooseDefault() {
			$('.pro_attr .parent_item').each((index, item) => {
				if ($('#mlpSpe').length) {
					if ($(item).children('.z_inner').length && !$(item).children('.z_inner').find('li.active').length) {
						$(item).children('.z_inner').find('li:not(.is_hide)').eq(0).click();
					}
					if ($(item).children('.z_select').length && !$(item).find('.select-input').val()) {
						$(item).find('.vshop-anim-upbit li:not(.is_hide)').eq(0).click();
					}
				} else {
					if ($(item).children('.z_inner').length && !$(item).children('.z_inner').find('li.active').length && $(item).children('.z_inner').attr('data-need') == 1) {
						$(item).children('.z_inner').find('li').eq(0).click();
					}
					if ($(item).children('.z_select').length && !$(item).find('.select-input').val() && $(item).children('.z_select').attr('data-need') == 1) {
						$(item).find('.vshop-anim-upbit li').eq(0).click();
					}
				}
			})
		}
		function chooseChildDefault($item) {
			$item.each((index, item) => {
				if ($(item).children('.z_inner').length && !$(item).children('.z_inner').find('li.active').length && $(item).children('.z_inner').attr('data-need') == 1) {
					$(item).children('.z_inner').find('li').eq(0).click();
				}
				if ($(item).children('.z_select').length && !$(item).find('.select-input').val() && $(item).children('.z_select').attr('data-need') == 1) {
					$(item).find('.vshop-anim-upbit li').eq(0).click();
				}
			})
		}
		function countWH($img, $dom) {
			let $src = $($img).attr('src');
			if ($src && $src != '' && Object.prototype.toString.call($src).slice(8, -1) != 'Null') {
				let newImg = new Image(); //建立新的图片对象
				newImg.src = $src;
				let img_h = newImg.height;
				let img_w = newImg.width;
				let idWidth = $($dom).width();
				if (img_w > idWidth && img_w > img_h) {
					let height = img_h * idWidth / img_w;
					$($img).css({
						"width": idWidth,
						"height": height
					});
				}
				if (img_w > idWidth && img_w < img_h) {
					let width = img_w * idWidth / img_h;
					$($img).css({
						"width": width,
						"height": idWidth
					});
				}

				if (img_h > idWidth && img_w < img_h) {
					let height = img_w * idWidth / img_h;
					$($img).css({
						"width": height,
						"height": idWidth
					});
				}
				if (img_h > idWidth && img_w > img_h) {
					let height = img_h * idWidth / img_w;
					$($img).css({
						"width": idWidth,
						"height": height
					});
				}
				if (img_w > idWidth && img_w == img_h) {
					$($img).css({
						"width": idWidth,
						"height": idWidth
					});
				}
			}
		}

		function madeProduct(data) {
			baseMade(data)
			function baseMade(data) {
				// 设置data-skuid
				$('.pro_details .title').attr({ 'data-skuid': data.skuList[0].id, 'data-sku': data.skuList[0].sku });
				//点击输入框加价
				$('.pro_attr').on('keyup', '.item_input .a_input', function (event) {
					event.stopPropagation();
					if ($(this).attr('data-need') == '1' && !$(this).val()) {
						$(this).closest('.a_item').find('.error').removeClass('hide');
					} else {
						$(this).closest('.a_item').find('.error').addClass('hide');
					}
					//计算总价格
					getMadeProductPrice(data);

					if (!$('.p_swiper .img_box').hasClass('hide')) {
						$('.p_swiper .img_box').addClass('hide');
					}
				});

				//点击下拉框加价
				$('.pro_attr').on('click', '.a_select li', function (event) {
					// event.stopPropagation();
					$(this).toggleClass('vshop-select-this').siblings().removeClass('vshop-select-this')
					const vshopInput = $(this).closest('.vshop-form-select').find('.select-input')
					$(this).hasClass('vshop-select-this') ? vshopInput.val($(this).attr('vshop-select-value')) : vshopInput.val('');
					$(this).closest('.vshop-form-select').removeClass('vshop-form-selected')
					if ($(this).hasClass('vshop-select-this')) {
						$(this).closest('.a_select').addClass('hasActive');
					} else {
						$(this).closest('.a_select').removeClass('hasActive');
					}
					const childLength = $(this).attr('data-childlength')
					const $parent = $(this).closest('.a_item')
					const $childId = $(this).attr('param-child-id')
					if (childLength > 0 && $(this).hasClass('vshop-select-this')) {
						$parent.find('.childCustListOption').find('.a_item').addClass('hide')
						$parent.find('.childCustListOption').find(`[data-parentoptionmapid =${$childId}]`).removeClass('hide')
						chooseChildDefault($parent.find('.childCustListOption').find(`[data-parentoptionmapid =${$childId}]`))
					} else {
						$parent.find('.childCustListOption').find('.a_item').removeClass('hide')
						$parent.find('.childCustListOption').find('.a_item').addClass('hide')
					}
					//如果error提示展示 则隐藏
					if (!$(this).hasClass('vshop-select-this') && $(this).attr('data-need') == '1') {
						$(this).closest('.a_item').find('.error').removeClass('hide');
					} else {
						$(this).closest('.a_item').find('.error').addClass('hide');
					}
					//计算总价格
					getMadeProductPrice(data);
					if (!$('.p_swiper .img_box').hasClass('hide')) {
						$('.p_swiper .img_box').addClass('hide');
					}
					// chooseDefault()
				});
				if (data.speType == 3) {
					threeDItem = true
					$('.threeDSweiperImage').show()
					$('.customizePreviewContainer').show()
				} else {
					$('.threeDSweiperImage').hide()
					$('.customizePreviewContainer').hide()
				}
				$('.threeDSweiperImage').on('click', function () {
					$('.threeDModal').show()
				})
				$('.customizePreviewContainer').on('click', '.customizePreviewBtns', function () {
					$('.threeDModal').show()
				})
				//点击文本选项加价
				$('.pro_attr').on('click', '.item_text', function (event) {
					// event.stopPropagation();
					// event.preventDefault()
					$(this).toggleClass('active').siblings().removeClass('active');
					//如果error提示展示 则隐藏
					if (!$(this).hasClass('active') && $(this).attr('data-need') == '1') {
						$(this).closest('.a_item').children('.a_title_wrap').find('.error').removeClass('hide');
					} else {
						$(this).closest('.a_item').children('.a_title_wrap').find('.error').addClass('hide');
					}
					if (!$('.p_swiper .img_box').hasClass('hide')) {
						$('.p_swiper .img_box').addClass('hide');
					}
					// 判断子规格
					const childLength = $(this).attr('data-childlength')
					const $parent = $(this).closest('.a_item')
					const $childId = $(this).attr('param-child-id')
					if (childLength > 0 && $(this).hasClass('active')) {
						$parent.find('.childCustListOption').find('.a_item').addClass('hide')
						$parent.find('.childCustListOption').find(`[data-parentoptionmapid =${$childId}]`).removeClass('hide')
						chooseChildDefault($parent.find('.childCustListOption').find(`[data-parentoptionmapid =${$childId}]`))
					} else {
						$parent.find('.childCustListOption').find('.a_item').addClass('hide')
					}
					//计算总价格
					getMadeProductPrice(data);
					// chooseDefault()
				});

				//点击图片选项加价
				$('.pro_attr').on('click', '.item_img', function (event) {
					// event.stopPropagation();
					$(this).toggleClass('active').siblings().removeClass('active');
					//如果error提示展示 则隐藏
					if (!$(this).hasClass('active') && $(this).attr('data-need') == '1') {
						$(this).closest('.a_item').children('.a_title_wrap').find('.error').removeClass('hide');
					} else {
						$(this).closest('.a_item').children('.a_title_wrap').find('.error').addClass('hide');
					}
					// 提示
					if ($(this).hasClass('active') && $(this).attr('title') != '') {
						$(this).closest('.a_item').find('.a_title p').text($(this).attr('title') || '')
					} else {
						$(this).closest('.a_item').find('.a_title p').text('')
					}
					// 判断子规格
					const childLength = $(this).attr('data-childlength')
					const $parent = $(this).closest('.a_item')
					const $childId = $(this).find('img').attr('param-child-id')
					if (childLength > 0 && $(this).hasClass('active')) {
						$parent.find('.childCustListOption').find('.a_item').addClass('hide')
						$parent.find('.childCustListOption').find(`[data-parentoptionmapid =${$childId}]`).removeClass('hide')
						chooseChildDefault($parent.find('.childCustListOption').find(`[data-parentoptionmapid =${$childId}]`))
					} else {
						$parent.find('.childCustListOption').find('.a_item').addClass('hide')
					}

					let $dataEnlarge = $(this).attr('data-enlarge');
					let $mainImg = $(this).find('.a_img').attr('src');
					if ($dataEnlarge && $dataEnlarge != '' && $dataEnlarge == 1 && Object.prototype.toString.call($dataEnlarge).slice(8, -1) != 'Null' && $(this).hasClass('active')) {
						let $index = $('.gallery-top .swiper-slide.swiper-slide-active').index(),
							$width = parseInt($('.gallery-top .swiper-slide').eq(0).width() || 0),
							$marginRight = parseInt($('.gallery-top .swiper-slide').eq(0).css('marginRight') || 1);
						$('.p_swiper .img_box').addClass('hide');
						$('.p_swiper .img_box[data-skuid="' + $(this).find('.a_img').attr('param-child-id') + '"]').removeClass('hide').css('left', $index * ($width + $marginRight)).find('.childDom').attr({ 'src': $mainImg, 'rel': $mainImg });
						$('.jqPreload0').remove();
						$('.p_swiper .h_hd .swiper-slide.swiper-slide-thumb-active').addClass('no_border')
					} else {
						$('.p_swiper .img_box[data-skuid="' + $(this).find('.a_img').attr('param-child-id') + '"]').addClass('hide')
						$('.p_swiper .h_hd .swiper-slide.swiper-slide-thumb-active').removeClass('no_border')

					}
					//计算总价格
					getMadeProductPrice(data);
				});

				// 上传图片选项
				$('.pro_attr').on('change', '.uploadImgBtn', function (event) {
					if (!$('.p_swiper .img_box').hasClass('hide')) {
						$('.p_swiper .img_box').addClass('hide');
					}

					let files = $(this).prop('files')[0],
						$this = $(this);
					let arr = [
						'image/png',
						'image/jpg',
						'image/jpeg',
						'image/bmp',
						'image/gif',
						'image/webp'
					];
					if (arr.indexOf(files.type) === -1) {
						layer.msg('Wrong picture type!', {
							icon: 5,
							time: 1000
						});
						$(this).val('');
						return false;
					}
					let isLt2M = files.size / 1024 / 1024 < 10;
					if (!isLt2M) {
						layer.msg('Upload picture less than 10M(10M)!', {
							icon: 5,
							time: 1000
						});
						$(this).val('');
						return false;
					}
					return new Promise((resolve, reject) => {
						var extensionName = files.name.substr(files.name.indexOf('.')); // 文件扩展名
						var fileUrl = randomImgName() + extensionName; // 文件名字（相对于根目录的路径 + 文件名）
						// 执行上传
						var $loadingIndex = layer.load(2);
						createOssClient().then(client => {
							console.log('client ==>', client)
							// 异步上传,返回数据
							resolve({
								fileName: MD5(files.name) + files.name,
								fileUrl: fileUrl
							})
							// 上传处理
							async function putObject() {
								try {
									var result = await client.put(fileUrl, files)
									console.log('result ==>', result)
									if (result.url) {
										layer.close($loadingIndex);
										if ($this.closest('.a_item').find('.uploadImg').length) {
											$this.closest('.a_item').find('.uploadImgWrap li').remove();
										}
										var addImgHtml = '<li>' +
											'<span><img class="uploadImg" src="' + result.url + '"/></span>' +
											'<img class="delImg" src="../assets/pc/images/zClose.png"/>' +
											'</li>';
										$this.closest('.a_item').find('.uploadImgWrap').append(addImgHtml).removeClass('hide');

										//如果error提示展示 则隐藏
										if (!$this.closest('.a_item').find('.error').hasClass('hide')) {
											$this.closest('.a_item').find('.error').addClass('hide');
										}

										//这发送图片上传接口后改变价格结果成功
										getMadeProductPrice(data);
									}
								} catch (e) {
									layer.msg('Upload failed!', {
										icon: 5,
										time: 1000
									});
									layer.close($loadingIndex);
								}
							}
							putObject();
						});
					});
				});

				//点击删除图片按钮减价
				$('.pro_attr').on('click', '.delImg', function (event) {
					event.stopPropagation();
					//如果error提示展示 则隐藏
					if ($(this).parents('.a_item').find('.error').hasClass('hide')) {
						$(this).parents('.a_item').find('.error').removeClass('hide');
					}
					$(this).closest('div').find(".pro-file").val('');
					$(this).parents('.uploadImgWrap').find('li').remove();
					//这发送图片上传接口后改变价格结果成功
					getMadeProductPrice(data);
				});

				/* 加入购物、购买下单 */
				$('.addToCart,.imToCart').on('click', function (event) {
					event.stopPropagation();
					if (goodsInfo.speType == 3) {
						// pc不支持3d，提示
						$('.customizePreviewContainer .customizePreviewBtns').addClass('threeShake')
						setTimeout(() => {
							$('.customizePreviewContainer .customizePreviewBtns').removeClass('threeShake')
						}, 1500);
					} else {
						//验证所有必选项都选择
						if (checkRules()) {
							let madeStaticType = 2,
								madeStaticProduct = {
									skuId: $('.pro_details .title').attr('data-skuId'),
									quantity: $('.q_number_wrap .q_number').val()
								};
							madeStaticProduct.customVal = []; //组装定制类商品属性字段
							$('.pro_attr .attr_inner .a_item:not(.hide)').each(function (index, element) {
								var type = $(element).attr('data-type'),
									name = $(element).attr('data-field'),
									ID = $(element).attr('data-privateid');

								if (!$(element).attr('data-dynamicparentid') || $(element).attr('data-dynamicparentid') == '') {
									var attrObj = getDomVal(type, element, name, ID);
									madeStaticProduct.customVal.push(attrObj);
								}
							});

							$('.pro_attr .attr_inner .a_item:not(.hide)').each(function (key, el) {
								if ($(el).attr('data-dynamicparentid') && $(el).attr('data-dynamicparentid') != '') {
									var cId = $(el).attr('data-dynamicparentid');
									for (let l = 0; l < madeStaticProduct.customVal.length; l++) {
										if (cId == madeStaticProduct.customVal[l].parentId) {
											if (!madeStaticProduct.customVal[l].childList || !madeStaticProduct.customVal[l].childList.length) {
												madeStaticProduct.customVal[l].childList = [];
											}
											var childType = $(el).attr('data-type'),
												childName = $(el).attr('data-field');
											madeStaticProduct.customVal[l].childList.push(getDomVal(childType, el, childName, cId));
										}
									}
								}
							});

							if ($(this).attr('operation') === 'toCart') { //组装数据加入购物车
								var madeStaticisShowCart = true;
							} else { //组装数据跳转到付款页面
								var madeStaticisShowCart = false;
							}
							addToCart(madeStaticType, madeStaticProduct, madeStaticisShowCart);
						} else {
							proNoSelectAttr();
						}
					}
				});
			}
		}
		/*
		  多规格商品sku匹配
		*/
		function standard(data) {
			//保存最后的组合结果信息(配对成功的所有可能性)
			var SKUResult = [];
			//获得对象的key
			function getObjKeys(obj) {
				if (obj !== Object(obj)) throw new TypeError('Invalid object');
				var keys = [];
				obj.forEach(item => {
					keys[keys.length] = item.skuvalIds;
				})
				return keys;
			}

			//把组合的key放入结果集SKUResult
			function add2SKUResult(combArrItem, sku) {
				var key = combArrItem.join(";");
				const SKUCurrent = SKUResult.find(item => { return key == item.ids })
				if (typeof (SKUCurrent) != 'undefined') {
					//SKU信息key属性
					SKUCurrent.val.price = sku.price;
					SKUCurrent.val.originalPrice = sku.originalPrice;
				} else {
					const SKUResultItem = {
						'ids': key,
						'val': {
							'price': sku.price,
							'originalPrice': sku.originalPrice
						}
					};
					SKUResult.push(SKUResultItem)
				}
			}

			//初始化得到结果集
			function initSKU() {
				let skuList = data.skuList;
				var i, j, skuKeys = getObjKeys(skuList);
				for (i = 0; i < skuKeys.length; i++) {
					var skuKey = skuKeys[i];//一条SKU信息key
					var sku = skuList[i];	//一条SKU信息value
					var skuKeyAttrs = skuKey.split("||"); //SKU信息key属性值数组
					skuKeyAttrs.sort(function (value1, value2) {
						return parseInt(value1) - parseInt(value2);
					});
					//对每个SKU信息key属性值进行拆分组合
					var combArr = combInArray(skuKeyAttrs);
					for (j = 0; j < combArr.length; j++) {
						add2SKUResult(combArr[j], sku);
					}
					//结果集接放入SKUResult
					const SKUResultItem = {
						'ids': skuKeyAttrs.join(";"),
						'val': {
							'price': sku.price,
							'originalPrice': sku.originalPrice
						}
					};
					SKUResult.push(SKUResultItem)
				}
			}

			/**
			 * 从数组中生成指定长度的组合
			 * 方法: 先生成[0,1...]形式的数组, 然后根据0,1从原数组取元素，得到组合数组
			 */
			function combInArray(aData) {
				if (!aData || !aData.length) {
					return [];
				}
				var len = aData.length;
				var aResult = [];
				for (var n = 1; n < len; n++) {
					var aaFlags = getCombFlags(len, n);
					while (aaFlags.length) {
						var aFlag = aaFlags.shift();
						var aComb = [];
						for (var i = 0; i < len; i++) {
							aFlag[i] && aComb.push(aData[i]);
						}
						aResult.push(aComb);
					}
				}
				return aResult;
			}


			/**
			 * 得到从 m 元素中取 n 元素的所有组合
			 * 结果为[0,1...]形式的数组, 1表示选中，0表示不选
			 */
			function getCombFlags(m, n) {
				if (!n || n < 1) {
					return [];
				}
				var aResult = [];
				var aFlag = [];
				var bNext = true;
				var i, j, iCnt1;

				for (i = 0; i < m; i++) {
					aFlag[i] = i < n ? 1 : 0;
				}
				aResult.push(aFlag.concat());
				while (bNext) {
					iCnt1 = 0;
					for (i = 0; i < m - 1; i++) {
						if (aFlag[i] == 1 && aFlag[i + 1] == 0) {
							for (j = 0; j < i; j++) {
								aFlag[j] = j < iCnt1 ? 1 : 0;
							}
							aFlag[i] = 0;
							aFlag[i + 1] = 1;
							var aTmp = aFlag.concat();
							aResult.push(aTmp);
							if (aTmp.slice(-n).join("").indexOf('0') == -1) {
								bNext = false;
							}
							break;
						}
						aFlag[i] == 1 && iCnt1++;
					}
				}
				return aResult;
			}
			initSKU()
			// console.log(SKUResult)
			$("#mlpSpe .a_item").each((index, item) => {
				if ($(item).find('.z_inner li').length) {
					$(item).find('.z_inner li').each((index, c_item) => {
						let optionalidsArr = $(c_item).attr('param-child-id');
						const isSkuSave = SKUResult.some(item => { return item.ids == optionalidsArr })
						if (!isSkuSave) {
							$(c_item).addClass('is_hide');
						} else {
							$(c_item).removeClass('is_hide');
						}
					})
				}
				if ($(item).find('.z_select .vshop-anim-upbit li').length) {
					$(item).find('.z_select .vshop-anim-upbit li').each((c_index, c_item) => {
						let optionalidsArr = $(c_item).attr('param-child-id');
						const isSkuSave = SKUResult.some(item => { return item.ids == optionalidsArr })
						if (!isSkuSave) {
							$(c_item).addClass('is_hide');
						} else {
							$(c_item).removeClass('is_hide');
						}
					})
				}
			})
			function mlpspe($this) {
				let selectedIds = []
				$('.item_text.active').each((index, item) => {
					let optionalidsArr = $(item).attr('param-child-id');
					selectedIds.push(optionalidsArr)
				})
				$('.a_select.hasActive').each((index, item) => {
					let optionalidsArr = $(item).find('.vshop-anim-upbit li.vshop-select-this').attr('param-child-id');
					selectedIds.push(optionalidsArr)
				})
				$("#mlpSpe .a_item").each((index, item) => {
					if ($(item).find('.z_inner li').length) {
						$('#mlpSpe .item_text').not($this).each((index, item) => {
							mlpsku($(item), selectedIds, false)
						})
					}
					if ($(item).find('.z_select .vshop-anim-upbit li').length) {
						$(item).find('.z_select .vshop-anim-upbit li').not($this).each((c_index, c_item) => {
							mlpsku($(c_item), selectedIds, true)
						})
					}
				})
			}
			function mlpsku($item, $selectedIds, $isSelect) {
				let selectedIdsArr = []
				if (($isSelect && $item.parent().find('.vshop-select-this').text() != '') || (!$isSelect && $item.parent().find('.item_text.active').html() != '')) {
					var siblingsSelectedObjId = $isSelect ? $item.parent().find('.vshop-select-this').attr('param-child-id') : $item.parent().find('.item_text.active').attr('param-child-id')
					for (var i = 0; i < $selectedIds.length; i++) {
						// 不存在添加
						($selectedIds[i] != siblingsSelectedObjId) && selectedIdsArr.push($selectedIds[i]);
					}
				} else {
					selectedIdsArr = $selectedIds.concat()
				}
				selectedIdsArr = selectedIdsArr.concat($item.attr('param-child-id'))
				selectedIdsArr.sort(function (value1, value2) {
					return parseInt(value1) - parseInt(value2);
				});
				const isSkuSave = SKUResult.some(item => { return item.ids == selectedIdsArr.join(';') })
				if (!isSkuSave) {
					console.log('全部匹配=》', selectedIdsArr.join(';'), $selectedIds)
					console.log('失败=》', $item.text())
					$item.addClass('is_hide');
				} else {
					$item.removeClass('is_hide');
				}
			}
			//点击文本,若所有文本、下拉框都选择则动态更改价格
			$staticTextLen = $('.pro_attr').attr('data-len');
			$('.a_item').on('click', '.item_text:not(.is_hide)', function (event) {
				// event.stopPropagation();
				$('.pro_details .title').attr({ 'data-skuId': '', 'data-sku': '' });
				$(this).toggleClass('active').siblings().removeClass('active');
				// 提示
				if ($(this).hasClass('active')) {
					baseError($(this), true)
					$(this).parents('.a_item').find('.error').addClass('hide');
					if ($(this).attr('title') != '') {
						$(this).closest('.a_item').find('.a_title p').text($(this).attr('title') || '')
					}
				} else {
					baseError($(this), false)
					$(this).parents('.a_item').find('.error').removeClass('hide');
					$(this).closest('.a_item').find('.a_title p').text('')
				}
				mlpspe($(this))
			});

			//点击下拉框,若所有文本、下拉框都选择则动态更改价格
			$('.item_select ').on('click', '.vshop-anim-upbit li:not(.is_hide)', function (event) {
				// event.stopPropagation();
				$(this).toggleClass('vshop-select-this').siblings().removeClass('vshop-select-this')
				const vshopInput = $(this).closest('.vshop-form-select').find('.select-input')
				$(this).hasClass('vshop-select-this') ? vshopInput.val($(this).attr('vshop-select-value')) : vshopInput.val('');
				$(this).closest('.vshop-form-select').removeClass('vshop-form-selected')

				$('.pro_details .title').attr({ 'data-skuId': '', 'data-sku': '' });
				if ($(this).hasClass('vshop-select-this')) {
					$(this).closest('.a_select').addClass('hasActive');
				} else {
					$(this).closest('.a_select').removeClass('hasActive');
				}
				if ($(this).hasClass('vshop-select-this')) {
					baseError($(this), true)
					$(this).parents('.a_item').find('.error').addClass('hide');
				} else {
					baseError($(this), false)
					$(this).parents('.a_item').find('.error').removeClass('hide');
				}
				mlpspe($(this))
			});

			/* 加入购物、购买下单 */
			$('.addToCart,.imToCart').on('click', function (event) {
				// event.stopPropagation();
				//验证所有文本都选择
				if (data.speType == '1' && $staticTextLen != ($('.pro_attr').find('.item_text.active').length + $('.pro_attr').find('.a_select.hasActive').length)) {
					$('.pro_attr .a_item').each(function (index, el) {
						if (!$(el).find('.item_attr.active').length) {
							$(el).find('.error').removeClass('hide');
							if ($(el).find('.vshop-anim-upbit li').length && $(el).find('.vshop-anim-upbit li.vshop-select-this').attr('vshop-select-value')) {
								$(el).find('.error').addClass('hide');
							}
						}
						if ($(el).find('.vshop-anim-upbit .vshop-select-this').length && !$(el).find('.vshop-anim-upbit li.vshop-select-this').attr('vshop-select-value')) {
							$(el).find('.error').removeClass('hide');
						}
					});
					proNoSelectAttr();
				} else {
					if (!data.speType) {
						$('.pro_details .title').attr({ 'data-skuid': data.skuList[0].id, 'data-sku': data.skuList[0].sku });
					}
					let madeStaticType = 1,
						madeStaticProduct = {
							skuId: $('.pro_details .title').attr('data-skuid'),
							quantity: $('.q_number_wrap .q_number').val()
						},
						madeStaticisShowCart = false;

					if ($(this).attr('operation') === 'toCart') { //组装数据加入购物车
						madeStaticisShowCart = true;
					}

					if (!$('.pro_attr').find('.error:visible').length && (!madeStaticProduct.skuId || Object.prototype.toString.call(madeStaticProduct.skuId).slice(8, -1) == 'Null')) {
						layer.msg('skuId is empty!', {
							icon: 5,
							time: 1000
						});
					} else {
						addToCart(madeStaticType, madeStaticProduct, madeStaticisShowCart);
					}

				}
			});


			/* 多规格基础逻辑 */
			function baseError($el, flag) {
				if ($el.attr('data-mainvalimg') && $el.attr('data-mainvalimg') != '' && flag) {
					let $dynamicImgSrc = $el.attr('data-mainvalimg'),
						$dynamicImg = $('<img>').attr({ 'src': $dynamicImgSrc });
					$('#pro_details_swiper .img_box').empty().html($dynamicImg).removeClass('hide');
				} else {
					$('#pro_details_swiper .img_box').empty().addClass('hide');
					if (myPlayer) {
						$('#pro_details_swiper  #my-video').empty().remove();
						$('#pro_details_swiper  .play_box').addClass('hide');
						myPlayer.dispose(); //销毁
						myPlayer = null;
					}
				}

				//如果error提示展示 则隐藏
				$('.pro_attr .a_item').each(function (index, el) {
					if ($(el).find('.item_attr.active').length || ($(el).find('.select-input').val() != '' && $(el).find('.select-input').val() != undefined)) {
						$(el).find('.error').addClass('hide');
					} else {
						$(el).find('.error').removeClass('hide');
					}
				});
				if ($staticTextLen == ($('.pro_attr').find('.item_text.active').length + $('.pro_attr').find('.a_select.hasActive').length)) {
					allStaticId = [];
					$('.pro_attr .item_attr').each(function (index, element) {
						if ($(element).hasClass('active') && $(element).attr('param-child-id')) {
							allStaticId.push($(element).attr('param-child-id'));
						} else if ($(element).find('.a_select.hasActive').length) {
							allStaticId.push($(element).find('.vshop-anim-upbit .vshop-select-this').attr('param-child-id'));
						}
					});
					computeStaticPrice(data, data.skuList, allStaticId);
				} else {
					computeStaticPrice(data, data.skuList, []);
					$('.p_swiper .h_hd .swiper-slide').removeClass('no_border')
					$('.p_swiper .img_box').addClass('hide');
				}
			}
		}

		// 非定制化算价格
		function computeStaticPrice(allData, data, allStaticId) {
			let $basePrice = parseFloat(allData.defaultPrice);
			wholeBasePrice = 0;
			if (data && data.length && allStaticId && allStaticId.length) {
				for (let k = 0; k < data.length; k++) {
					if (data[k].skuval.length == allStaticId.length) {
						let currId = data[k].skuval;
						let isVal = currId.every(function (val, index) {
							return val.speValId == allStaticId[index];
						});
						if (isVal == true) {
							wholeBasePrice = Number(data[k].price);
							let skuImg = data[k].skuImg;
							if (skuImg && skuImg != '' && Object.prototype.toString.call(skuImg).slice(8, -1) != 'Null') {
								let $index = $('.gallery-top .swiper-slide.swiper-slide-active').index(),
									$width = parseInt($('.gallery-top .swiper-slide').eq(0).width() || 0),
									$marginRight = parseInt($('.gallery-top .swiper-slide').eq(0).css('marginRight') || 1);
								$('.p_swiper .img_box').addClass('hide');
								let skuId = data[k].id;
								$('.p_swiper .img_box[data-skuid="' + skuId + '"]').removeClass('hide').css('left', $index * ($width + $marginRight)).find('.childDom').attr({ 'src': skuImg, 'rel': skuImg });
								countWH('.img_box .product-gallery__image', '.gallery-top');
								$('.jqPreload0').remove();
								$('.p_swiper .h_hd .swiper-slide.swiper-slide-thumb-active').addClass('no_border')
							} else {
								$('.p_swiper .h_hd .swiper-slide').removeClass('no_border')
								$('.p_swiper .img_box').addClass('hide');
							}
							if ($('.wholesaleTable tr[class="active"]').length) { //符合批发条件
								let $countDiscount = parseFloat($('.wholesaleTable tr[class="active"]').attr('data-discount'));
								wholesaleCount(wholeBasePrice, $countDiscount);
							} else {
								//折扣价格
								if (data[k].originalPrice != null && data[k].originalPrice != '') {
									count(wholeBasePrice, data[k].originalPrice);
								} else {
									count(wholeBasePrice, allData.originalPrice);
								}
								if ($('.wholesaleTable tr').length) {
									wholesaleHtml(wholeBasePrice, $countDiscount);
								}
							}
							//设置当前商品的skuId
							$('.pro_details .title').attr({ 'data-skuId': data[k].id, 'data-sku': data[k].sku });
							break;
						} else {
							if ($('.wholesaleTable tr[class="active"]').length) { //符合批发条件
								let $countDiscount = parseFloat($('.wholesaleTable tr[class="active"]').attr('data-discount'));
								wholesaleCount(allData.defaultPrice, $countDiscount);
							} else {
								if ($('.wholesaleTable tr').length) {
									wholesaleHtml(allData.defaultPrice);
								}
								//折扣价格
								count(allData.defaultPrice, allData.originalPrice);
							}
						}
					}
				}
			} else {
				if ($('.wholesaleTable tr[class="active"]').length) { //符合批发条件
					var $countDiscount = parseFloat($('.wholesaleTable tr[class="active"]').attr('data-discount'));
					wholesaleCount(allData.defaultPrice, $countDiscount);
				} else {
					if ($('.wholesaleTable tr').length) {
						wholesaleHtml(allData.defaultPrice);
					}
					count(allData.defaultPrice, allData.originalPrice);
				}
			}
		}

		//定制化算价格
		function getMadeProductPrice(data) {
			let $textSelectPrice = $selectPrice = $picSelectPrice = $textPrice = $imgPrice = 0;
			$('.pro_attr .a_item:not(.hide)').each((index, item) => {

				//文本选项加价
				if ($(item).children('.z_inner').find('.item_text.active').length) {
					$(item).children('.z_inner').find('.item_text.active').each(function (index, element) {
						$textSelectPrice += parseFloat($(element).attr('param-child-price'));
					});
				}

				//下拉框选项加价
				if ($(item).children('.z_select').find('.vshop-anim-upbit .vshop-select-this').length) {
					$(item).children('.z_select').find('.vshop-anim-upbit .vshop-select-this').each(function (index, element) {
						$selectPrice += parseFloat($(element).attr('param-child-price'));
					});
				}

				//图片选项加价
				if ($(item).children('.z_inner').find('.item_img.active').length) {
					$(item).children('.z_inner').find('.item_img.active').each(function (index, element) {
						$picSelectPrice += parseFloat($(element).find('img').attr('param-child-price'));
					});
				}

				//输入框加价
				if ($(item).children('.z_inner').find('.a_input').length) {
					$(item).children('.z_inner').find('.a_input').each(function (index, el) {
						if ($(el).val() && $(el).val() != '') {
							$textPrice += parseFloat($(el).attr('param-price'));
						}
					});
				}

				//上传图片加价
				if ($(item).children('.z_inner').find('.uploadImgWrap.paramItem').length) {
					$(item).children('.z_inner').find('.uploadImgWrap.paramItem').each(function (index, element) {
						if ($(element).find('li').length) {
							$imgPrice += parseFloat($(element).attr('param-price'));
						}
					});
				}
			})


			let num = Number($('.quantity_wrap .q_number').val()),
				defaultPrice = data.defaultPrice,
				originalPrice = data.originalPrice,
				$originalPrice = (originalPrice + $selectPrice + $textSelectPrice + $picSelectPrice + $textPrice + $imgPrice),
				$singlePrice = (defaultPrice + $selectPrice + $textSelectPrice + $picSelectPrice + $textPrice + $imgPrice);
			console.log(defaultPrice, $selectPrice, $textSelectPrice, $picSelectPrice, $textPrice, $imgPrice)
			if ($('.wholesaleTable tr[class="active"]').length) { //符合批发条件
				let $countDiscount = parseFloat($('.wholesaleTable tr[class="active"]').attr('data-discount'));
				//折扣前的价格
				wholesaleCount($singlePrice, $countDiscount);
			} else {
				if ($('.wholesaleTable tr').length) {
					wholesaleHtml($singlePrice)
				}
				count($singlePrice, $originalPrice);
			}
		}

		function wholesaleHtml(defaultPrice) {
			$('.wholesaleTable tr').each(function (index, el) {
				if (index > 0) {
					let wdiscount = Number($(el).attr('data-discount'));
					$(el).find('td[w-rate]').html(Math.round(1000 - wdiscount * 100) / 10 + '% ' + 'OFF');
					$(el).find('td[w-price]').html($currency.getPrice(defaultPrice * (wdiscount / 10)));
				}
			});
		}

		//定制化组装数据
		function getDomVal($type, $element, $name, $parentId) {
			var returnData = {};
			returnData.type = $type;
			returnData.name = $name;
			returnData.parentId = $parentId || '';
			if ($type == 1) {
				if ($($element).children('.z_inner').find('.item_text.active').length) {
					returnData.price = $($element).children('.z_inner').find('.item_text.active').attr('param-child-price');
					returnData.value = $($element).children('.z_inner').find('.item_text.active').html();
				} else {
					returnData.price = $($element).children('.z_select').find('.vshop-select-this').attr('param-child-price');
					returnData.value = $($element).children('.z_select').find('.vshop-select-this').attr('vshop-select-value');
				}
			} else if ($type == 2) {
				returnData.price = $($element).children('.z_inner').find('.item_img.active > img').attr('param-child-price');
				returnData.value = $($element).children('.z_inner').find('.item_img.active > img').attr('src');
			} else if ($type == 3) {
				returnData.price = $($element).children('.z_inner').find('.a_input').attr('param-price');
				returnData.value = $($element).children('.z_inner').find('.a_input').val();
			} else {
				returnData.price = $($element).children('.z_inner').find('.uploadImgWrap').attr('param-price');
				returnData.value = $($element).children('.z_inner').find('.uploadImg').attr('src');
			}
			return returnData;
		}

		//定制化效验规则
		function checkRules() {
			//文本选项效验 和 下拉框[data-type="1"]'
			if ($('.pro_attr .a_item:not(.hide)').length) {
				$('.pro_attr .a_item:not(.hide)').each((index, element) => {
					switch ($(element).attr('data-type')) {
						case '1':
							if ($(element).find('.z_inner').attr('param-required') == 1) {
								if ($(element).find('.z_select').length) {
									!$(element).find('.select-input').val() && $(element).find('.error').removeClass('hide')
								} else if ($(element).find('.z_inner').length) {
									!$(element).find('.item_text.active').length && $(element).find('.error').removeClass('hide')
								}
							}
							break;
						case '2':
							if (!$(element).find('.item_img.active').length && $(element).find('.z_inner').attr('param-required') == 1) {
								$(element).find('.error').removeClass('hide')
							}
							break;
						case '3':
							if (!$(element).find('.a_input').val() && $(element).find('.a_input').attr('param-required') == 1) {
								$(element).find('.error').removeClass('hide')
							}
							break;
						case '4':
							if (!$(element).find('li').length && $(element).find('.uploadImgWrap').attr('param-required') == 1) {
								$(element).find('.error').removeClass('hide')
							}
							break;
					}
				})
				if ($('.pro_attr').find('.error:visible').length) {
					return false
				} else {
					return true
				}
			}
		}

		//获取定制化子属性
		function getCustResult(arr, parentId, childId) {
			var result = [];
			for (var z = 0; z < arr.length; z++) {
				if (arr[z].id == parentId) {
					for (var b = 0; b < arr[z].optionList.length; b++) {
						if (arr[z].optionList[b].id == childId) {
							result = arr[z].optionList[b].childCustList;
							break;
						}
					}
					break;
				}
			}
			return result;
		}

		// 加入购物车
		function addToCart($type, $product, $isShowCart) {
			console.log('add the item to cart')
			let sendData = {};
			sendData.skuId = parseFloat($product.skuId);
			sendData.quantity = parseFloat($product.quantity);
			sendData.goodsVersion = $('.pro_details .title').attr('data-goodsVersion');
			sendData.goodsId = Number($('.pro_details .title').attr('data-id'));
			sendData.speType = goodsInfo.speType;
			if ($type == 2) {
				sendData.customVal = $product.customVal;
			}
			setStorage('getVustomVal', JSON.stringify(sendData));

			// 加购发送数据
			let productData = [], cartList = {};
			cartList.spuId = parseInt($('.pro_details .title').attr('data-id')) || ''
			cartList.spu = $('.pro_details .title').text() || '';
			cartList.quantity = parseInt($('.q_number_wrap .q_number').val()) || '';
			cartList.spuPrice = Number($('.allPirce .c_price').attr('base-price'));
			cartList.sku = $('.pro_details .title').attr('data-sku') || '';
			cartList.skuPrice = Number($('.allPirce .c_price').attr('us-price'));
			cartList.spuImg = $('.pro_details .title').attr('data-mainimg') || ''
			productData.push(cartList);
			sendAnalyze('cart', {}, productData);
			//facebook埋点
			let $facebookId_val = $('#facebookId').val();
			if ($facebookId_val && $facebookId_val != '' && Object.prototype.toString.call($facebookId_val).slice(8, -1) != 'Null') {
				const eventID = getRandomString(5)
				fbq('track', 'AddToCart', { eventID });

				// facebook api数据转化
				const custom_data = {
					'value': Number($('.allPirce .c_price').text().substr(1)),
					"currency": JSON.parse(getStorage('currentRate')).currency,
					"content_ids": parseFloat($product.skuId),
					"content_type": "product"
				}
				var data = facebookApiParam(custom_data, 'AddToCart', eventID)
				facebookApi($facebookId_val, data)
			}
			//ga 像素埋点
			const $googleId = $('#googleId').val()
			if ($googleId && $googleId != '' && Object.prototype.toString.call($googleId).slice(8, -1) != 'Null') {
				ga('ec:addProduct', {
					'id': $('.pro_details .title').attr('data-id') || '',
					'name': $('.pro_details .title').text() || '',
					'price': Number($('.allPirce .c_price').attr('us-price')),
					'quantity': parseInt($('.q_number_wrap .q_number').val()) || ''
				});
				ga('ec:setAction', 'add');
				ga('send', 'event', 'add_to_cart', 'click', 'add to cart');
			}
			// tiktok像素埋点
			let $Tiktok_val = $('#Tiktok').val();
			let $tiktok_status = $('#Tiktok').attr('data-show')
			if ($Tiktok_val && $Tiktok_val != '' && Object.prototype.toString.call($Tiktok_val).slice(8, -1) != 'Null' && $tiktok_status == 'true') {
				ttq.track('AddToCart', {
					content_id: $('.pro_details .title').attr('data-id') || '',
					content_type: 'product',
					content_name: $('.pro_details .title').attr('data-sku') || '',
					quantity: parseInt($('.q_number_wrap .q_number').val()) || '',
					price: Number($('.allPirce .c_price').attr('us-price')),
					value: Number($('.allPirce .c_price').attr('us-price') * 100 * parseInt($('.q_number_wrap .q_number').val()) / 100),
					currency: 'USD',
				})
			}
			if (!$isShowCart) {
				window.location.href = './information.html?saveType=3';
				return false;
			}
			var addToCartIndex = layer.load(2);
			cartHeight();
			$('#cart_box--right').addClass('active')
			$('html').attr('data-overflow', 'true')
			// pinterest 埋点数据 ~~~~~Start~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			var pinterestSetData = {
				pinterestYOUR_TAG_ID: '',
				pinterestEventType: 'AddToCart',
				pinterestData: {
					value: Number($('.allPirce .c_price').attr('base-price')),
					order_quantity: parseInt($('.q_number_wrap .q_number').val()) || 1,
					currency: $('.header .currencyActive-name').text() || 'USD'
				}
			}
			pinterestFn(pinterestSetData)
			// pinterest 埋点数据 ~~~~~End~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			getToken(function () {
				$.req({
					url: '/api/v1/cart/cart',
					type: 'post',
					contentType: 'application/json;charset=UTF-8',
					data: JSON.stringify(sendData),
					success(res) {
						if (res.code == 0) {
							layer.close(addToCartIndex);
							// 打开购物车
							// $.getJSON("../data/config.json?version=" + version, function (data) {
							var data = JSON.parse(localStorage.getItem('$CONFIGDATA')) || CONFIGDATA
							const promotionList = data.activities.find(item => {
								return contrastTime(true, item.end, item.start) && item.status == 1
							})
							let promotion_id = {}
							if (typeof (promotionList) != 'undefined') {
								promotion_id.activityId = promotionList.id
							}
							getCartInfo(promotion_id)
							// })
						} else if (res.code == 20016) {
							layer.open({
								closeBtn: 0,
								title: false,
								content: 'Please refresh after updating the information.',
								btn: ['confirm'],
								yes: function (index, layero) {
									layer.close(index); //如果设定了yes回调，需进行手工关闭
									location.reload();
								}
							});
						} else if (res.code == 20015) {
							layer.open({
								closeBtn: 0,
								title: false,
								content: 'One product has been removed, please select other products.',
								btn: ['confirm'],
								yes: function (index, layero) {
									layer.close(index); //如果设定了yes回调，需进行手工关闭
									window.location.href = 'productList.html'
								}
							});
						} else if (res.code == 20020) {
							layer.close(addToCartIndex);
							alertTxt(res.msg);
						}
					}
				});
			});
		}

		function cartHeight() {
			// 计算头部高度
			let activity_h = parseFloat($('.activity').height()) || 0
			let header_h = parseFloat($('.header_wrap').height()) + activity_h
			// 购物车开关
			let cart_h = window.innerHeight - header_h
			$('.cart_w').height(cart_h)
			$('.cart_w').css('top', header_h)
		};
		// 展示当前选项
		function proNoSelectAttr() {
			let $scrTop = 0;
			$(".pro_attr").find('.error:visible:first').parents('.a_title_wrap').addClass('shake');
			if ($(".pro_attr").find('.error:visible:first').length) {
				$scrTop = $(".pro_attr").find('.error:visible:first').offset().top - 250;
			}
			$("html,body").animate({
				scrollTop: $scrTop
			}, 500, function () {
				setTimeout(function () {
					$(".pro_attr").find('.error:visible:first').parents('.a_title_wrap').removeClass('shake');
				}, 650);
			});
			//
		}

		//批发计算价格
		function countWholePrice(number, wholeData) {
			if (wholeData.length) {
				let $discount = '',
					$num = 'null';
				for (let d = 0; d < wholeData.length; d++) {
					if (d == wholeData.length - 1 && ((number >= wholeData[d].startCount && Object.prototype.toString.call(wholeData[d].endCount).slice(8, -1) != 'Null' && number <= wholeData[d].endCount) ||
						(number >= wholeData[d].startCount && (Object.prototype.toString.call(wholeData[d].endCount).slice(8, -1) == 'Null' || !wholeData[d].endCount || wholeData[d].endCount == '')))) {
						$discount = wholeData[d].discount;
						$num = d;
					} else {
						if (number >= wholeData[d].startCount && number <= wholeData[d].endCount) {
							$discount = wholeData[d].discount;
							$num = d;
						}
					}
				}
				if ($num != 'null') {
					$('.wholesaleTable tbody').find('tr').eq($num + 1).addClass('active').siblings('tr').removeClass('active');
				} else {
					if ($('.wholesaleTable tbody').find('tr.active')) {
						$('.wholesaleTable tbody').find('tr.active').removeClass('active');
					}
				}
			}
		}


		function playVideo($url, isPlay, coverUrl) {
			if (myPlayer) {
				$('.p_swiper  #my-video').empty().remove();
				$('.p_swiper  .play_box').addClass('hide');
				myPlayer.dispose(); //销毁
				myPlayer = null;
			}
			$('.p_swiper .play_box').removeClass('hide').html($('<div id="my-video"></div>'));
			myPlayer = new Aliplayer({
				id: "my-video",
				source: $url,
				cover: coverUrl,
				width: "100%",
				height: "100%",
				autoplay: true,
				isLive: false,
				playsinline: true,
				showBarTime: 2000,
				controlBarVisibility: 'click',
				useH5Prism: true,
				useFlashPrism: false,
				x5_video_position: 'normal',
				x5_type: 'h5',
				skinLayout: [ // false | Array, 播放器使用的ui组件，非必填，不传使用默认，传false或[]整体隐藏
					{
						name: "bigPlayButton",
						align: "blabs",
						x: 30,
						y: 80
					},
					{
						name: "H5Loading",
						align: "cc"
					},
					{
						name: "errorDisplay",
						align: "tlabs",
						x: 0,
						y: 0
					},
					// {name: "snapshot", align: "trabs", x: 10, y: "50%"},
					{
						name: "infoDisplay",
						align: "cc"
					},
					{
						name: "controlBar",
						align: "blabs",
						x: 0,
						y: 0,
						children: [{
							name: "progress",
							align: "blabs",
							x: 0,
							y: 44
						},
						{
							name: "playButton",
							align: "tl",
							x: 15,
							y: 12
						},
						{
							name: "timeDisplay",
							align: "tl",
							x: 10,
							y: 7
						},
						{
							name: "fullScreenButton",
							align: "tr",
							x: 10,
							y: 10
						},
						//{name: "snapshot", align: "tr", x: 10, y: 10},
						{
							name: "volume",
							align: "tr",
							x: 10,
							y: 10
						},
						{
							name: "streamButton",
							align: "tr",
							x: 0,
							y: 10
						},
						{
							name: "speedButton",
							align: "tr",
							x: 0,
							y: 10
						},
						{
							name: "captionButton",
							align: "tr",
							x: 0,
							y: 10
						},
						{
							name: "trackButton",
							align: "tr",
							x: 0,
							y: 10
						},
						]
					}
				],
			}, function (player) {
				player.on('ready', function (e) {
					if (isPlay) {
						player.play();
					} else {
						player.pause();
					}
				});
				var _video = document.querySelector('video');
				$('.prism-cover').on('click', function (event) {
					event.stopPropagation();
					player.play();
				});

				player.on('play', function (e) {
					_video.removeEventListener('click', play);
					_video.addEventListener('click', pause);
				});
				player.on('pause', function (e) {
					_video.removeEventListener('click', pause);
					_video.addEventListener('click', play)
				});

				function play() {
					if (player) player.play();
				}

				function pause() {
					if (player) player.pause();
				}
			});
		}
	});
})
function limitImport(str, num) {
	$(document).on('input propertychange', str, function () {
		var self = $(this);
		var content = self.val();
		if (content.length > num) {
			self.val(content.substring(0, num));
		}
	});
}

//限制文本框输入字数
limitImport('#review_body', 1500);

$(document).on('click', '.vshop-form-select .vshop-select-title', function (e) {
	$(this).parent('.vshop-form-select').toggleClass('vshop-form-selected')
	closeModel($(this).parent('.vshop-form-select'))
})

// 点击空白 模态框关闭
function closeModel(item) {
	$(document).on('click', function (e) {
		e.stopPropagation();
		if (!$.contains(item.get(0), $(e.target).get(0))) {
			item.removeClass('vshop-form-selected');
		}
	})
}

$(document).ready(function () {
	// pinterest 埋点数据 ~~~~~Start~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	var pinterestSetData = {
		pinterestYOUR_TAG_ID: '',
		pinterestEventType: 'pagevisit',
		pinterestData: {
			product_id: $('h3.title').data('id'),
			product_name: $('h3.title').text().replace('"', '“'),
			product_price: $('.c_price').attr('base-price')
		}
	}
	pinterestFn(pinterestSetData)
	// pinterest 埋点数据 ~~~~~End~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
})
