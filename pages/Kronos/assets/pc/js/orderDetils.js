const allOrderDate = {
    orderList: [],
    type: 1
}
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
                        $('#order-content').removeClass('hide')
                        $('#order-empty').addClass('hide')
                        // console.log('订单列表==>', res.data, $('#order'))
                        allOrderDate.orderList = res.data
                        let getTpl = orderTpl.innerHTML,
                            view = document.querySelector('#order');
                        renderHtml(allOrderDate)
                        function renderHtml(data) {
                            const list = data.orderList.filter(v => {
                                if (data.type == 1 && v.paymentStatus == 2) {
                                    // Payment Successful
                                    return v
                                } else if (data.type == 2 && (v.paymentStatus == 1 || v.paymentStatus == 3)) {
                                    // Awaiting Payment
                                    return v
                                } else if (data.type == 4 && v.paymentStatus == 5) {
                                    // Payment Failed
                                    return v
                                } else if (data.type == 3 && v.paymentStatus == 4) {
                                    // Pending…
                                    return v
                                }
                            })
                            $('.orderContentHeader span').html(list.length || 0)
                            laytpl(getTpl).render(list, function (html) {
                                view.innerHTML = html;
                                // 点击下拉展示内容
                                $('.status_items').click(function () {
                                    $(this).next('.open_content').slideToggle(300)
                                    $(this).find('.s_status').toggleClass('active')
                                })
                            });
                        }
                        $('body').on('click', '.orderListHeader li', function () {
                            $(this).addClass('active').siblings().removeClass('active')
                            allOrderDate.type = $(this).data('id') - 0
                            renderHtml(allOrderDate)
                        }).on('click', '.emptyContainer button', function () {
                            window.location.href = './productList.html'
                        })
                    } else {
                        $('#order-content').addClass('hide')
                        $('#order-empty').removeClass('hide')
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
