var version = new Date().getTime()

layui.config({
    version: true,
    base: '/layui'
}).use(['jquery', 'layer', 'laytpl', 'form'], function () {
    let $ = layui.jquery,
        laytpl = layui.laytpl,
        layer = layui.layer;

    function addcommentsList() {
        $('.get_more_btn').on('click', function (event) {
            event.stopPropagation();
            let commentList = [];
            // $.getJSON("../../data/detail.json?version=" + version, function (res) {
            var res = DETAILDATA
            console.log('comlist', res)
            let productId = $('.pro_details .title').attr('data-id');
            for (let i = 0; i < res.length; i++) {
                if (res[i].id == productId) {
                    commentList = res[i].commentList;
                    break;
                }
            }
            let space = $('.u_list li').length,
                newAll = [];
            if (space > 0) {
                newAll = commentList.slice(space, space + 5);
            }

            if (newAll.length) {
                moreHtml(newAll);
            }

            function moreHtml(arr) {
                let cHtml = $('#cHtml').html();
                laytpl(cHtml).render(arr, function (html) {
                    $('.l_box_wrap').removeClass('hide');
                    $('.get_more_btn').addClass('hide');
                    setTimeout(() => {
                        $('.u_list').append(html);
                        let newLen = $('.u_list li').length;
                        if (!commentList.slice(newLen, newLen + 5).length) {
                            $('.get_more_wrap').addClass('hide');
                        } else {
                            $('.get_more_wrap').removeClass('hide');
                            $('.get_more_btn').removeClass('hide');
                        }
                        $('.l_box_wrap').addClass('hide'); // 隐藏加载动画
                    }, 2000);
                });
            }
            // })
        });

        $('.comment').on('click', '.z_img', function (event) {
            event.stopPropagation();
            let $height = 670,
                $cIndex = $(this).attr('data-index'),
                $dialogSwiper = null,
                allImg = [];

            $(this).parents('.z_img_inner').find('.z_img').each(function (index, item) {
                allImg.push({ 'mainImg': $(item).attr('data-src') });
            });

            if (allImg.length) {
                let dialogTpl = $('#setmealDialogTpl').html();
                laytpl(dialogTpl).render(allImg, function (html) {
                    $('#dialog-box .box').html(html);
                    layer.open({
                        id: 'layerDialog',
                        type: 1,
                        title: false,
                        area: [$height + 'px', $height + 'px'],
                        shade: [0.6, '#000'],
                        content: $('#dialog-box'),
                        success: function () {
                            $('#dialog-box .swiper-wrapper').css('height',
                                $height);
                            let $dialogSwiper = new Swiper(
                                '#setmealDialogTplSwiper', {
                                navigation: {
                                    prevEl: '.swiper-button-prev',
                                    nextEl: '.swiper-button-next'
                                }
                            });
                            $dialogSwiper.slideTo($cIndex);
                            $('.layui-layer-shade').addClass('dialogTpl');
                            $('.layui-layer.layui-layer-page').addClass('layui-layer-dialog');

                            $('.layui-layer-page').addClass('layerDialogWrap');
                        },
                        cancel: function () {
                            $dialogSwiper = null;
                            allImg = [];
                        }
                    });
                });
            }
        });
    }
    addcommentsList();
});