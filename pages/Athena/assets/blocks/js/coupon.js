$(document).ready(function () {
  // 关闭弹框
  $('#closeCoupon').on('click', function () {
    $('#alertWindow').fadeOut(300)
    //设置已经领取优惠券标识
    setSessionStorage('isGetCoupon', 1)
  })
  $('#goShop').on('click', function () {
    $('#alertWindow').fadeOut(300)
  })
  // 关闭弹框
  $('#received-close').on('click', function () {
    $('#alertWindow').fadeOut(300)
  })
  var getCouponStatus = true;
  $('#getCoupon').on('click', function () {
    if (getCouponStatus) {
      getCouponStatus = false
      setTimeout(function () {
        getCouponStatus = true;
      }, 3000)
      var couponArr = []
      var couponList = CONFIGDATA.commomCoupon[0].list
      for (let i = 0; i < couponList.length; i++) {
        if (isEffective(couponList[i].couponStart, couponList[i].couponEnd)) {
          couponArr.push(couponList[i].id)
        }
      }
      var couponIds = couponArr.join(',')
      getCoupon(couponIds, function (result) {
        if (result.code === 0) {
          if ($('#alertWindow').attr('isMobilePhone') == 0) {
            $('#alertWindowInner').fadeOut(300)
            $('#receivedCoupon').fadeIn(300)
          } else {
            $('#alertWindow').fadeOut(300)
          }
          suCouponDialog()
          setSessionStorage('isGetCoupon', 1)
        }
      })
    }
  })

  function suCouponDialog() {
    if ($(window).width() < $(window).height()) {
      $('#coupon_succ_html').show()
    }
  }
  $('#coupon_succ_html .coupon_success .coupon_success_btn').on('click', function () {
    $('#coupon_succ_html').hide()
  })


  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  2021年6月21日重构优惠券弹框模块 Start   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  if (CONFIGDATA.commomCoupon.length) {
    if (getSessionStorage('isGetCoupon') != 1 && CONFIGDATA.commomCoupon[0].list.length&&getParam('isIframe')!=1) {
      $('.newCouponModal').show();
      if($('.newCouponModal').length){
        forbidScroll()
      }
    }
  }
  $('.newCouponModal').on('click touchstart', '.newCouponModal_Close_pc_btn', function () {
    // pc端点击取消领取优惠券
    setTimeout(function(){
      $('.newCouponModal').hide();
    },500)
    allowScroll()
    setSessionStorage('isGetCoupon', 1)
  }).on('click touchstart', '.newCouponModal_Close_wap_btn', function () {
    // wap端点击取消领取优惠券
    setTimeout(function(){
      $('.newCouponModal').hide();
    },500)
    allowScroll()
    setSessionStorage('isGetCoupon', 1)
  }).on('click touchstart', '.newCouponModal_contentBtns', function () {
    // 点击获取优惠券
    if (getCouponStatus) {
      getCouponStatus = false
      setTimeout(function () {
        getCouponStatus = true;
      }, 3000)
      var couponArr = []
      var couponList = CONFIGDATA.commomCoupon[0].list
      // couponList有值
      for (var i = 0; i < couponList.length; i++) {
        if (isEffective(couponList[i].couponStart, couponList[i].couponEnd)) {
          couponArr.push(couponList[i].id)
        }
      }
      // couponArr空数组，未收到值
        var couponIds = couponArr.join(',')
      getCoupon(couponIds, function (result) {
        if (result.code == 0) {
          $('.newCouponModal_content').hide()
          $('.newCouponModal_contentSuccess').show()
          setSessionStorage('isGetCoupon', 1)
        }
      })
    }
  }).on('click touchstart', '.newCouponModal_contentSuccess_btnContainer', function () {
    allowScroll()
    setSessionStorage('isGetCoupon', 1)
    setTimeout(function(){
      $('.newCouponModal').hide();
    },500)
  }).on('click touchstart', '.newCouponModal_contentSuccess_Close_pc_btn', function () {
    setTimeout(function(){
      $('.newCouponModal').hide();
    },500)
    allowScroll()
    setSessionStorage('isGetCoupon', 1)
  })
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  2021年6月21日重构优惠券弹框模块 End     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

})