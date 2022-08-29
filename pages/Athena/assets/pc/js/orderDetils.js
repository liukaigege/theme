
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
                            $('.status_items').click(function () {
                                $(this).next('.open_content').slideToggle(300)
                                $(this).find('.s_status').toggleClass('active')
                            })
                        });
                    } else {
                        $('#order').append('<div class="emptyImg"><img src="../assets/pc/images/search_no_bg@2x.png" alt=""></div>')
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
