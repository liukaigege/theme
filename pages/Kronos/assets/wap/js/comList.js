var version = new Date().getTime()
layui.config({
    version: true,
    base: '/layui'
}).use(['jquery', 'layer', 'laytpl', 'form'], function () {
    let $ = layui.jquery,
        laytpl = layui.laytpl,
        layer = layui.layer;

    function addcommentsList() {
        $('.addMoreBtn').on('click', function (event) {
            event.stopPropagation();
            let commentList = [];
            // $.getJSON("../../data/detail.json?version=" + version, function (res) {
            var res = JSON.parse(localStorage.getItem('$DETAILDATA')) || DETAILDATA
            
            let productId = $('.pro_details .title').attr('data-id');
            for (let i = 0; i < res.length; i++) {
                if (res[i].id == productId) {
                    commentList = res[i].commentList;
                    break;
                }
            }
            let space = $('.s_list.comments li').length,
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
                    $('.spinner').show();
                    $('.addMoreBtn').addClass('hide');
                    setTimeout(() => {
                        $('.s_list.comments').append(html);
                        let newLen = $('.s_list.comments li').length;
                        if (!commentList.slice(newLen, newLen + 5).length) {
                            $('.addMoreBtn').addClass('hide');
                        } else {
                            $('.addMoreBtn').removeClass('hide');
                        }
                        $('.spinner').hide(); // 隐藏加载动画
                    }, 2000);
                });
            }
            // })
        });
        $('.comments').on('click', '.z_img', function (event) {
            event.stopPropagation();
            let $height = $(window).width() - 30,
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
                        shade: [0, '#000'],
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