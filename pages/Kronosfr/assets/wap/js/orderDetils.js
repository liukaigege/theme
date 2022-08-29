
layui.config({
    version: true,
    base: '/layui'
}).use(['jquery', 'layer', 'laytpl'], function () {
    var $ = layui.jquery,
        layer = layui.layer,
        laytpl = layui.laytpl;
    var url = decodeURI(window.location.href);
    var paramArr = url.split('?').pop()
    var orderId = paramArr.split('=')[1];
    if (orderId) {
        getToken(function () {
            $.req({
                url: '/api/v1/orders/orders',
                type: 'get',
                data: {
                    param: orderId
                },
                success(res) {
                    if (res.data.length) {
                        console.log(res.data)
                        let getTpl = orderTpl.innerHTML,
                            view = document.querySelector('#order');
                        laytpl(getTpl).render(res.data, function (html) {
                            view.innerHTML = html;
                            // 点击下拉展示内容
                            $('.items_click').click(function () {
                                $(this).next('.down_open_content').slideToggle(300)
                                $(this).find('.pay_time').toggleClass('active')
                            })
                            $('.open_content').on('click', '.toThreeD', function () {
                                window.location.href = './3d.html?type=2&modalId=' + $(this).data('id');
                            })
                        });
                        $('body').on('click', '.emptyContainer button', function () {
                            window.location.href = './productList.html'
                        })
                    } else {
                        $('#order').append(`<div class="emptyContainer" ><img src = "../assets/pc/images/icon/empty@2x.png" /><p>Votre invité n'a rien commandé.</p > <a href="productList.html" class="button" type="button" class="content_btn">Continuez à faire du shopping.</a></div > `)
                    }
                }
            });
        });
    } else {
        layer.msg('Your email or order ID!', {
            icon: 5,
            time: 1500,
            success() {
                $('.layui-layer-msg').addClass('coupon_msg');
            }
        });
    }

});

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
$(document).ready(function () {
    console.log('CONFIGDATA', INDEXDATA)
    let bottomData = INDEXDATA.filter(v => v.typeId == 8)[0].config.bottom
    if (bottomData.bottomLock && bottomData.showBottom) {
        $('.wap_block_footer').css({ 'padding-bottom': '0.28rem' })
    }
})