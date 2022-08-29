// const e = require("express");

var version = new Date().getTime()
var url = window.location.href;
var paramArr = url.split('?').pop()
var paymentParam = {}
paymentParam[paramArr.split('=')[0]] = parseInt(paramArr.split('=')[1]);
//商品总参数
let cart_info = {}
// 订单参数
const ORDERPARAMS = {};
// tiktok像素相关
let tiktokArr = []
let tiktoValue = '', tiktokShipping = '';
// 货币
const setmeal = JSON.parse(localStorage.getItem('currentRate'));
//发送联盟看板事件
var goodsData = [];
var edata = {}
//税率
var taxVal = 0
// 判断是购物车购买 || 快速购买
if (paymentParam.saveType == 1) {
  // 购物车购买
  let queryCartParam = JSON.parse(localStorage.getItem('queryCartParam'));
  cartBuy(queryCartParam, false)
} else if (paymentParam.saveType == 3) {
  //快速购买
  quickBuy(false)
}
// 表单验证
$('.form__field').on({
  blur: function () {
    $.trim($(this).val()) ? $(this).addClass('is-filled') : $(this).removeClass('is-filled')
  }
});
$('.billing-address-ul').on('click', 'li', function (e) {
  e.stopPropagation()
  e.preventDefault()
  $(this).siblings().find('.input-radio').removeProp('checked');
  $(this).addClass('active').siblings('li').removeClass('active');
  $(this).find('.input-radio').prop("checked", "checked");
  let typeName = $(this).attr('data-type')
  if (typeName === 'billing-address') {
    $('#billing_address_form').slideDown(300).removeClass('active');
    $('#billing_address_form .address_form--ul').addClass('active')
  } else {
    // 清除账单地址数据
    $('#billing_address_form')[0].reset();
    $('#billing_address_form #checkout_billing_address_order_country').val('default')
    $('#billing_address_form .address_form--ul').removeClass('active')
    $('#billing_address_form .form__field').removeClass('is-filled')
    $('#billing_address_form li').removeClass('err_active')
    $('#billing_address_form').slideUp(300).addClass('active')
  }
})

$('#shipping_address_form input,#billing_address_form input').on({
  'focus': function () {
    $(this).parents('li').removeClass('err_active');
  },
  'blur': function () {
    switch ($(this).attr('name')) {
      case 'phone':
        var pattern = /^[0-9\+\-\(\)\#\s]{1,30}$/g;
        validate(pattern, $(this));
        break;
      case 'firstName': case 'lastName': case 'state': case 'city':
        var pattern = /^.{1,60}$/;
        validate(pattern, $(this));
        break;
      case 'street1':
        var pattern = /^.{1,150}$/;
        validate(pattern, $(this));
        break;
      // case 'postcode':
      //   var pattern = /^[a-zA-Z0-9]{1,30}/;
      //   validate(pattern, $(this));
      //   break;
      case 'email':
        var pattern = /^[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/;

        validate(pattern, $(this));
        break;
      case 'street2':
        break;
      default:
        var pattern = /\S/;
        validate(pattern, $(this));
        break;
    };

    function validate(pattern, $this) {
      if (!pattern.test($this.val())) {
        $this.parents('li').addClass('err_active');
        $this.addClass('err');
        top = $('.err').offset().top;
        msgErrAnimate($this.siblings('.msg'));
      } else {
        $this.parents('li').removeClass('err_active');
        $this.removeClass('err');
      }
    }
  }
});
//地址提示错误动画
function msgErrAnimate(item) {
  item.addClass('msgErr')
  setTimeout(function () {
    item.removeClass('msgErr')
  }, 1000)
}
let createOrderStatus = true, timer = null;
clearTimeout(timer);
$(document).on('click', '#order_checkout', function () {
  if (createOrderStatus) {
    createOrderStatus = false;
    clearTimeout(timer);
    timer = setTimeout(() => {
      createOrderStatus = true;
    }, 3000)
    var issubmit = true;
    $('.address_form--ul.active').find('li').each((index, item) => {
      if ($(item).find('input').val() === '' && $(item).find('input').attr('name') !== 'street2') {
        if ($(item).hasClass('province') && !$(item).find('.province-input').hasClass('active')) {
          $(item).find('.msg').removeClass('active');
          issubmit = true;
        } else {
          $(item).addClass('err_active');
          msgErrAnimate($(item).find('.msg'));
          issubmit = false;
        }
      };
      if ($(item).find('input').hasClass('err')) {
        issubmit = false
      }
      // return issubmit;
    });
    // 判断是否选中国家
    if ($('#checkout_billing_address_country').val() == null) {
      $('#checkout_billing_address_country').closest('li').addClass('err_active');
      msgErrAnimate($('#checkout_billing_address_country').siblings('.msg'));
      issubmit = false;
    };
    //判断是否选中省份
    if (!$('#shipping_address_form .province-input').hasClass('active')) {
      if ($('#shipping_address_form .province-cell.active').find('.province-select').val() == null) {
        $('#shipping_address_form .province-cell.active').closest('li').addClass('err_active');
        msgErrAnimate($('#shipping_address_form .province-cell.active').find('.msg'));
        issubmit = false;
      }
      console.log(issubmit)
    } else {
      if ($('#shipping_address_form .province-input').find('.form__field--text').val().trim() === '') {
        $('#shipping_address_form .province-cell.active').closest('li').addClass('err_active');
        msgErrAnimate($('#shipping_address_form .province-cell.active').find('.msg'));
        issubmit = false;
      }
    }


    if ($('.billing-address-ul [data-type="billing-address"]').hasClass('active')) {
      // 判断是否选中国家(账单地址)
      if ($('#checkout_billing_address_order_country').val() == null) {
        $('#checkout_billing_address_order_country').closest('li').addClass('err_active');
        msgErrAnimate($('#checkout_billing_address_order_country').siblings('.msg'));
        issubmit = false;
      };
      //判断是否选中省份(账单地址)
      if (!$('#billing_address_form .province-input').hasClass('active')) {
        if ($('#billing_address_form .province-cell.active').find('.province-select').val() == null) {
          $('#billing_address_form .province-cell.active').closest('li').addClass('err_active');
          msgErrAnimate($('#billing_address_form .province-cell.active').find('.msg'));
          issubmit = false;
        }
      } else {
        if ($('#billing_address_form .province-input').find('.form__field--text').val().trim() === '') {
          $('#billing_address_form .province-cell.active').closest('li').addClass('err_active');
          msgErrAnimate($('#billing_address_form .province-cell.active').find('.msg'));
          issubmit = false;
        }
      }
    }
    if (issubmit) {
      // 序列化
      $.fn.serializeObject = function () {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
          if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
              o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
          } else {
            o[this.name] = this.value || '';
          }
        });
        return o;
      }
      // 序列化表格
      let shipping_form = serializeForm('shipping_address_form', ORDERPARAMS, 'adressParam')
      // 判断是否需要账单地址
      let isSave = $('.billing-address-ul [data-type="billing-address"]').hasClass('active')
      if (isSave) {
        let billing_form = serializeForm('billing_address_form', ORDERPARAMS, 'billingAdressParam')
      }
      localStorage.setItem('address_form', JSON.stringify(ORDERPARAMS))
      if (paymentParam.saveType == 1) {
        // 购物车购买
        let queryCartParam = JSON.parse(localStorage.getItem('queryCartParam'));
        cartBuy(queryCartParam, true)
      } else if (paymentParam.saveType == 3) {
        //快速购买
        quickBuy(true)
      }
    } else {
      $("html,body").animate({
        scrollTop: $(".main li.err_active:first")[0].offsetTop - window.innerHeight * 0.3
      }, 500)
      msgErrAnimate($('li.err_active .msg'))
    }
  } else {
    // 
  }
})
// 国家下拉
$(document).on('change', "#checkout_billing_address_country,#checkout_billing_address_order_country", function () {
  let countryCode = $(this).find("option:selected").attr('data-code');
  var addressForm = $(this).attr('data-address');
  $('#' + addressForm + ' .field__input--select').val('default')
  $(this).closest('li').removeClass('err_active')
  if (countryCode === "CAN" || countryCode === "USA") {
    $('#' + addressForm + ' [data-stata="' + countryCode + '"]').addClass('active').siblings().removeClass('active');
    $('#' + addressForm + ' .province-input').find('input').val(' ')
    $('#' + addressForm + ' [data-stata="' + countryCode + '"]').siblings().find('select').removeClass('is-selected')
  } else {
    $('#' + addressForm).find('.province-input').addClass('active').siblings().removeClass('active');
  };
  // 获取countryCode
  let countryCodeHtml = $(this).attr('data-country-code');
  $('#' + countryCodeHtml).addClass('is-filled').val(countryCode);
  if ($(this).attr('id') == 'checkout_billing_address_country') {
    tax($(this).find("option:selected").text())
  }
  $(this).addClass('is-selected')
});

// 省份下拉选择事件
$('.province-select').change(function () {
  let stateCode = $(this).val();
  $(this).closest('li').removeClass('err_active')
  $(this).addClass('is-selected')
})
function serializeForm($id, formInfo, name) {
  let $form = $('#' + $id).serializeObject();
  formInfo[name] = $form;
  $form['name'] = $form.firstName + ' ' + $form.lastName;
  $form['countryCode'] = $('#' + $id + ' .address_country option:checked').attr('data-code');
  if ($('#' + $id + ' .province-cell.active').hasClass('province-input')) {
    $form.state = $('#' + $id + ' .province-cell.active').find('input').val();
  } else {
    $form.state = $('#' + $id + ' .province-cell.active').find('.field__input option:checked').text();
  }
  return $form
}

function cartQuery(res) {
  cart_info = res
  ORDERPARAMS.saveType = paymentParam.saveType + '';
  ORDERPARAMS.payMethod = 'paypal';
  ORDERPARAMS.taxRatePrice = 0;
  ORDERPARAMS.preParam = res.useDiscount;
  ORDERPARAMS.ordersOrigin = getStorage('sourceurl') || '';
  ORDERPARAMS.promotionLogo = getCookie('promotionLogo') || '';
  ORDERPARAMS.rate = Number(setmeal.rate);
  ORDERPARAMS.currency = setmeal.currency;
  ORDERPARAMS.cart = totalCartList(res)
  console.log('order数据==>', ORDERPARAMS)
  //  tiktok支付跟踪代码埋点
  if (res.goodsList.length) {
    tiktokArr.length = 0
    res.goodsList.forEach(element => {
      const tiktokList = {
        content_id: String(element.goodsId),
        content_type: 'product',
        content_name: element.sku || '',
        quantity: Number(element.quantity),
        price: Number(element.discountPrice),
      }
      tiktokArr.push(tiktokList)
    })
  }
  //联盟看板事件
  goodsData.length = 0
  res.goodsList.forEach(element => {
    let cartList = {};
    cartList.spuId = element.goodsId
    cartList.spu = element.goodsName;
    cartList.quantity = element.quantity;
    cartList.spuPrice = element.discountPrice;
    cartList.sku = element.sku;
    cartList.skuPrice = element.discountPrice;
    cartList.spuImg = element.mainImg
    goodsData.push(cartList)
  });
  edata.orderId = ''
  edata.quantify = res.goodsCount
  edata.discount = Math.round(res.promotionDiscount * 100 + parseFloat(res.couponDiscount || 0) * 100) / 100
  edata.sales = res.afterDicountTotal
  edata.shipping = 0

  res.symbol = setmeal.symbol
  let productPrice = 0;
  res.goodsList.forEach(element => {
    productPrice = Math.round(productPrice * 100 + getMoneyrate(element.discountPrice) * 100 * element.quantity) / 100;
  });
  res.productPrice = productPrice;
  // 不加运费的总价
  // 计算汇率前
  res.beforeDicountTotal = res.afterDicountTotal;
  // 计算汇率后
  res.afterDicountTotal = Math.round(productPrice * 100 - getMoneyrate(res.promotionDiscount) * 100 - getMoneyrate(res.couponDiscount) * 100) / 100;
  if (res.afterDicountTotal < 0) {
    res.afterDicountTotal = 0
  }
  shippingCost(res);
  let goodsList = []
  res.goodsList.forEach(item => {
    const goodListItem = {
      quantity: item.quantity,
      spuId: item.goodsId,
      spu: item.goodsName,
      spuPrice: item.defaultPrice,
      spuImg: item.mainImg
    }
    goodsList.push(goodListItem)
  })
  if ($('#pay_method').attr('data-type').trim() == 'cardpay') {
    res.link = $('#cardPayLink').attr('data-link')
  }
  sendAnalyze('view', {}, goodsList);
  layui.use(['laytpl'], function () {
    let laytpl = layui.laytpl;
    let getTpl = order_info_tempalte.innerHTML,
      view = document.getElementById('order-info');
    laytpl(getTpl).render(res, function (html) {
      view.innerHTML = html;
      showMoney('#order-info')
      //订单商品列表下拉
      let address_form = JSON.parse(localStorage.getItem('address_form'))
      if (address_form != null && address_form.hasOwnProperty('adressParam')) {
        tax(address_form.adressParam.country)
      }
      $('.order-info .information_title').click(function () {
        $(this).toggleClass('active');
        $('.order-info--content').slideToggle(300);

      })
    });
  });
}
// 运费接口
function shippingCost(res) {
  // 运费参数
  const goodsList = [];
  const shippingCostParam = {
    goodsList
  }
  const _res = res; //储存商品信息，加入运费
  TotalPrice = res.afterTotal; // 存入总价
  res.goodsList.forEach(element => {
    let goodsListItem = {};
    // goodsListItem.skuId = element.skuId;
    goodsListItem.goodsId = element.goodsId;
    goodsListItem.afterDicountPrice = String(element.afterDicountPrice);
    goodsList.push(goodsListItem);
    return goodsList;
  });
  shippingCostParam.afterDicountTotal = String(res.beforeDicountTotal);
  const res_shipping = shippingInit(shippingCostParam)
  if (res_shipping.list.length) {
    res_shipping.list.sort(function (a, b) { return a.sort <= b.sort ? 1 : -1 });
    shippingTpl(res_shipping, _res)
    $('#billing_num').html('3')
  } else {
    _res.shipping = 0;
    _res.total = _res.afterDicountTotal
    ORDERPARAMS.totalShippingPrice = 0;
    ORDERPARAMS.shippingsName = '';
    $('#billing_num').html('2')
    $('#shipping').html('');
  }
  return _res
}

// 运费
function shippingTpl(res, cart_res) {
  if (res.list.length) {
    layui.use(['laytpl'], function () {
      let laytpl = layui.laytpl;
      let getPromotionTpl = shipping_template.innerHTML,
        promotionView = document.getElementById('shipping');
      laytpl(getPromotionTpl).render(res.list, function (html) {
        promotionView.innerHTML = html;
        minShipping(res.list, cart_res)
        showMoney('#shipping')
        // 选择物流
        $('#shipping .shippingMethod-ul').on('click', 'li', function (e) {
          e.stopPropagation()
          e.preventDefault()
          // 判断多次点击
          if (!$(this).hasClass('active')) {
            $(this).siblings().find('.input-radio').removeProp('checked');
            $(this).addClass('active').siblings('li').removeClass('active');
            $(this).find('.input-radio').prop("checked", "checked");
            var $shippingMoney = $(this).find('.shippingCost').attr('data-money');
            // 获取邮费
            let $id = $(this).attr('data-id');
            // 存储运费进入session
            shippingSession($id, $shippingMoney, cart_res, true)
          }

        })
      })
    })
  }
}
//获取运费最小值
function minShipping(res, cart_res) {
  var minShippingMoney = res[0].money,
    minShippingId = res[0].id,
    shippingNum = 0;
  let isSave = false
  if (sessionStorage.getItem('shipping')) {
    let shipping = JSON.parse(sessionStorage.getItem('shipping'))
    minShippingId = parseFloat(shipping.shippingId)
    minShippingMoney = shipping.shippingMoney
    isSave = res.some(item => {
      return shipping.shippingId == item.id
    })
  }
  if (isSave) {
    $('#shipping .radio-ul').find(`[data-id=${minShippingId}]`).addClass('active').find('.input-radio').prop("checked", "checked")
  } else {
    minShippingMoney = res[0].money
    minShippingId = res[0].id
    res.forEach((item, index) => {
      if (Number(item.money) < Number(minShippingMoney)) {
        minShippingMoney = item.money;
        minShippingId = item.id;
        shippingNum = index;
      }
    });
    $('#shipping .radio-ul>li').eq(shippingNum).addClass('active').find('.input-radio').prop("checked", "checked");
  }
  shippingSession(minShippingId, minShippingMoney, cart_res, false)
  return minShippingId
}

// 将物流费用存入session并回显至下方价格明细
function shippingSession(shippingId, shippingMoney, cart_res, isClick) {
  let shippingSession = {
    shippingId,
    shippingMoney
  }
  ORDERPARAMS.totalShippingPrice = getMoneyRateNum(shippingMoney) || 0;
  ORDERPARAMS.shippingsName = $(`#shipping li[data-id=${shippingId}]`).attr('data-name') || '';
  sessionStorage.setItem('shipping', JSON.stringify(shippingSession));
  // 联盟看板数据
  edata.sales = Math.round(cart_res.beforeDicountTotal * 100 + shippingMoney * 100) / 100
  edata.shipping = parseFloat(shippingMoney)
  cart_info.shippingMoney = parseFloat(shippingMoney)
  if (isClick) {
    $('#shipping_price').text(getMoney(shippingMoney));
    let $_total_price = $('#total_price').attr('data-d-money');
    let total_price = Math.round(getMoneyrate(shippingMoney) * 100 + parseFloat($_total_price) * 100) / 100
    tiktokShipping = shippingMoney
    // 渲染运费和总价
    $('#total_price').attr('data-o-money', total_price)
    $('#tax').text(setmeal.symbol + formatMoneyRate(total_price * taxVal))
    $('#total_price').text(setmeal.symbol + formatMoneyRate(total_price * (taxVal + 1))).attr('data-tax-money', formatMoneyRate(total_price * (taxVal + 1)))
  } else {
    cart_res.total = Math.round(cart_res.afterDicountTotal * 100 + getMoneyrate(shippingMoney) * 100) / 100 //重新计算总价
    cart_res.shipping = shippingMoney //加入运费
    tiktokShipping = shippingMoney
    return cart_res
  }
}


function showMoney($id) {
  $($id + " [data-money]").each(function (index, item) {
    let $price = Number($(item).attr('data-money'));
    $(item).html(getMoney($price));
  })
}

showMoney('body')
const clientId = $('#paypal_clientId').attr('data-clientId')
if (clientId) {
  var jsStr = `?client-id=${clientId}&currency=${setmeal.currency}`;
  var PAYPAL_SCRIPT = 'https://www.paypal.com/sdk/js' + jsStr;
  var script = document.createElement('script');
  script.setAttribute('src', PAYPAL_SCRIPT);
  document.body.prepend(script);
  if (script.readyState) {
    script.onreadystatechange = function () {
      if (script.readyState == 'complete' || script.readyState == 'loaded') {
        closePlaceholder();
        setPaypal()
      }
    }
  } else {
    script.onload = function () {
      closePlaceholder();
      setPaypal()
    }
  }
}
function setPaypal() {
  closePlaceholder();
  // paypal支付
  paypal.Buttons({
    // Call your server to set up the transaction
    createOrder: function (data, actions) {
      // facebook埋点
      let $facebookId_val = $('#facebookId').val();
      if ($facebookId_val && $facebookId_val != '' && Object.prototype.toString.call($facebookId_val).slice(8, -1) != 'Null') {
        const eventID = getRandomString(5)
        fbq('track', 'InitiateCheckout', { eventID });
        // facebook api数据转化
        const content_ids = []
        cart_info.goodsList.forEach(item => {
          content_ids.push(item.skuId)
        })
        const custom_data = {
          "value": Number($('#total_price').text().substr(1)),
          "currency": setmeal.currency,
          "content_ids": content_ids,
          "content_type": "product"
        }
        var data = facebookApiParam(custom_data, 'InitiateCheckout', eventID)
        const facebookIdArr = $facebookId_val.split(',')
        facebookIdArr.forEach(item => {
          facebookApi(item, data)
        })
      }
      //ga 像素埋点
      const $googleId = $('#googleId').val()
      if ($googleId && $googleId != '' && Object.prototype.toString.call($googleId).slice(8, -1) != 'Null') {
        ga('create', $googleId);
        ga('require', 'ec');
        checkout(cart_info.goodsList)
        function checkout(cart) {
          cart.forEach(item => {
            ga('ec:addProduct', {
              'id': item.goodsId,
              'name': item.goodsName,
              'price': item.discountPrice,
              'quantity': item.quantity
            });
          })
        }
        ga('ec:setAction', 'checkout', {
          'option': 'Paypal'
        });
        ga('send', 'event', 'checkout', 'click', 'Begin Checkout');
      }
      //tiktok埋点
      let $Tiktok_val = $('#Tiktok').val();
      let $tiktok_status = $('#Tiktok').attr('data-show')
      if ($Tiktok_val && $Tiktok_val != '' && Object.prototype.toString.call($Tiktok_val).slice(8, -1) != 'Null' && $tiktok_status == 'true') {
        let TiktokParam = {
          contents: tiktokArr,
          value: Math.round(tiktoValue * 100 + parseFloat(tiktokShipping || 0) * 100) / 100,
          currency: 'USD',
        }
        ttq.track('Checkout', TiktokParam)
        localStorage.setItem('TiktokParam', JSON.stringify(TiktokParam));
      }

      //联盟看板事件
      sendAnalyze('payment', edata, goodsData);
      localStorage.setItem('productData', JSON.stringify(cart_info));
      if (ORDERPARAMS.hasOwnProperty('adressParam')) {
        delete ORDERPARAMS.adressParam
      }
      return fetch('/vshop-site/api/v1/pre/orders/orders', {
        method: 'post',
        body: JSON.stringify(ORDERPARAMS),
        headers: {
          "Authorization": 'Bearer' + getStorage('localstorageId')
        }
      }).then(function (res) {
        console.log("123-->", res);
        return res.json();
      }).then(function (orderData) {
        console.log("orderData-->", orderData);
        if (orderData.code != 0) {
          alertTxt(orderData.msg)
          setTimeout(() => {
            window.location.replace("/");
          }, 3000)
        } else {
          return orderData.data.order_number;
        }
      });
    },
    // Call your server to finalize the transaction
    onApprove: function (data, actions) {
      $('html').append('<div class="paymentLoading"><div><img src="../assets/wap/images/icon/loading.gif" alt=""><p>Please wait a moment before finishing the payment.....</p><div></div>')
      console.log("data--" + JSON.stringify(data));
      return fetch('/vshop-third/api/v1/third/' + data.orderID + '/capture', {
        method: 'post',
        headers: {
          "Authorization": 'Bearer' + getStorage('localstorageId')
        }
      }).then(function (res) {
        console.log("res--", res);
        return res.json();
      }).then(function (orderData) {
        // Three cases to handle:
        //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
        //   (2) Other non-recoverable errors -> Show a failure message
        //   (3) Successful transaction -> Show a success / thank you message

        // Your server defines the structure of 'orderData', which may differ
        console.log("orderData--", orderData);
        var errorDetail = Array.isArray(orderData.details) && orderData.details[0];
        if (errorDetail && errorDetail.issue === 'INSTRUMENT_DECLINED') {
          // Recoverable state, see: "Handle Funding Failures"
          // https://developer.paypal.com/docs/checkout/integration-features/funding-failure/
          return actions.restart();
        }
        if (errorDetail) {
          var msg = 'Sorry, your transaction could not be processed.';
          if (errorDetail.description) msg += '\n\n' + errorDetail.description;
          if (orderData.debug_id) msg += ' (' + orderData.debug_id + ')';
          // Show a failure message
          return alertTxt(res.msg)
        }
        // Show a success message to the buyer
        let money = $('#total_price').attr('data-tax-money');
        if (orderData.statusCode === 201 && orderData.status === "COMPLETED") {
          window.location.href = `./payment-results.html?status=1&transcationId=${data.orderID}&currency=${totalRate.currency}&amount=${money}`;
        } else {
          window.location.href = `./payment-results.html?status=0`;
        }
      });
    }
  }).render('#paypal-button-container');
}

// paypal预加载遮盖
function closePlaceholder() {
  let r = "dynamic-checkout--loading";
  var e = document.querySelector("." + r),
    t = document.querySelector(".dynamic-checkout__buttons");
  null !== e && null !== t && e.classList.remove(r)
}

// U66.创建前置订单接口(前端触发)
function afterOrder(orderParams) {
  ORDERPARAMS.taxRatePrice = Number($('#tax').attr('data-money'))
  getToken(function () {
    $.req({
      url: '/api/v1/pre/orders/preOrders',
      type: 'post',
      data: JSON.stringify(orderParams),
      dataType: 'json',
      contentType: 'application/json',
      success(res) {
        if (res.code === 0) {
          //清除购物车数量
          localStorage.setItem('shopping_num', 0);
          $('.header .home_cart i').text(0);
          sessionStorage.removeItem('remark');
          sessionStorage.removeItem('shipping');
          let $facebookId_val = $('#facebookId').val();
          if ($facebookId_val && $facebookId_val != '' && Object.prototype.toString.call($facebookId_val).slice(8, -1) != 'Null') {
            const eventID = getRandomString(5)
            fbq('track', 'InitiateCheckout', { eventID });
            // facebook api数据转化
            const content_ids = []
            cart_info.goodsList.forEach(item => {
              content_ids.push(item.skuId)
            })
            const custom_data = {
              "value": Number($('#total_price').text().substr(1)),
              "currency": setmeal.currency,
              "content_ids": content_ids,
              "content_type": "product"
            }
            var data = facebookApiParam(custom_data, 'InitiateCheckout', eventID)
            const facebookIdArr = $facebookId_val.split(',')
            facebookIdArr.forEach(item => {
              facebookApi(item, data)
            })
          }
          //ga 像素埋点
          const $googleId = $('#googleId').val()
          if ($googleId && $googleId != '' && Object.prototype.toString.call($googleId).slice(8, -1) != 'Null') {
            ga('create', $googleId);
            ga('require', 'ec');
            checkout(cart_info.goodsList)
            function checkout(cart) {
              cart.forEach(item => {
                ga('ec:addProduct', {
                  'id': item.goodsId,
                  'name': item.goodsName,
                  'price': item.discountPrice,
                  'quantity': item.quantity
                });
              })
            }
            ga('ec:setAction', 'checkout', {
              'option': 'Checkout'
            });
            ga('send', 'event', 'checkout', 'click', 'Begin Checkout');
          }
          //  PayPal支付跟踪代码埋点
          let $Tiktok_val = $('#Tiktok').val();
          let $tiktok_status = $('#Tiktok').attr('data-show')
          if ($Tiktok_val && $Tiktok_val != '' && Object.prototype.toString.call($Tiktok_val).slice(8, -1) != 'Null' && $tiktok_status == 'true') {
            let TiktokParam = {
              contents: tiktokArr,
              value: Math.round(tiktoValue * 100 + parseFloat(tiktokShipping || 0) * 100) / 100,
              currency: 'USD',
            }
            ttq.track('Checkout', TiktokParam)
            localStorage.setItem('TiktokParam', JSON.stringify(TiktokParam));
          }
          //联盟看板事件
          edata.orderId = res.data.ordersId
          sendAnalyze('payment', edata, goodsData);
          setTimeout(() => {
            window.location.replace("./payment.html?ordersId=" + res.data.ordersId);
          }, 300)
        } else {
          alertTxt(res.msg)
          setTimeout(() => {
            window.location.replace("/");
          }, 3000)
        }
      }
    });
  });
}

// 快速购买
function quickBuy(isClick) {
  const getVustomVal = JSON.parse(localStorage.getItem('getVustomVal'));
  let goodsList = [];
  // console.log('getVustomVal==>',getVustomVal)
  getVustomVal.customVal = JSON.stringify(getVustomVal.customVal)
  goodsList.push(getVustomVal);
  let params = {
    goodsList,
  }
  const calculationParams = {}
  // $.getJSON("../data/config.json?version=" + version, function (data) {
  const promotion_arr = CONFIGDATA.activities
  if (promotion_arr.length && contrastTime(true, promotion_arr[0].end, promotion_arr[0].start)) {
    params['activityId'] = promotion_arr[0].id;
    calculationParams.activityId = promotion_arr[0].id
  }
  getToken(function () {
    // return console.log('计算价格===》',params)
    $.req({
      url: '/api/v1/goods/calculation',
      type: 'POST',
      data: JSON.stringify(params),
      dataType: 'json',
      contentType: 'application/json',
      success(res) {
        if (res.code === 0 && res.data.cartList.length) {
          let $res = calculate(calculationParams, res.data)
          if ($res.code == 0) {
            let cartRes = $res.data
            cartQuery(cartRes);
            tiktoValue = cartRes.afterDicountTotal
            if (isClick) {
              if (cartRes.invalidGoodsList.length) {
                layui.config({
                  version: true,
                  base: '/layui'
                }).use(['jquery', 'layer'], function () {
                  var $ = layui.jquery,
                    layer = layui.layer
                  let tip = 'Your shopping cart was expired, please select a new product.'
                  layer.confirm(tip, {
                    id: 'tip_code',
                    icon: 5,
                    title: '',
                    closeBtn: 0,
                    skin: 'tip-class',
                    btn: ['YES'] //可以无限个按钮
                    , btn1: function (index, layero) {
                      layer.close(index);
                      window.location.href = "/cart.html";
                    }
                  })

                });
              } else {
                let money = $('#total_price').attr('data-d-money');
                if (money !== '0') {
                  afterOrder(ORDERPARAMS);
                } else {
                  alert('Your request could not be performed due to incorrect and failed business verification. The money amount must be not less than zero.')
                }
              }
            }
          }
        } else if (res.code == 20016) {
          layui.config({ version: true, base: '/layui', })
            .use(['jquery', 'layer'], function () {
              var $ = layui.jquery,
                layer = layui.layer
              layer.open({
                closeBtn: 0,
                title: false,
                content: 'Please refresh after updating the information.',
                btn: ['confirm'],
                yes: function (index, layero) {
                  layer.close(index); //如果设定了yes回调，需进行手工关闭
                  window.location.href = '/'
                }
              });
            })
        } else if (res.code == 20015) {
          layui.config({ version: true, base: '/layui', })
            .use(['jquery', 'layer'], function () {
              var $ = layui.jquery,
                layer = layui.layer
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
            })
        } else {
          alertTxt(res.msg)
          setTimeout(() => {
            window.location.replace("/");
          }, 3000)
        }
      }
    });
  });

  // })
};
//购物车购买
function cartBuy(data, isClick) {
  getToken(function () {
    $.req({
      url: '/api/v1/cart/cart/info',
      type: 'get',
      success(res) {
        if (res.code == 0 && res.data.cartList.length) {
          $res = calculate(data, res.data)
          switch ($res.code) {
            case 20000:
              // 全场活动失效
              delete data.activityId
              cartBuy(data, true)
              break;
            case 20001:
              // 优惠卷失效
              delete data.couponId
              cartBuy(data, true)
              break;
            case 0:
              // 正常事件
              cartInfoGoodsList($res, isClick)
              break;
          }
        } else if (res.code == 20016) {
          layui.config({ version: true, base: '/layui', })
            .use(['jquery', 'layer'], function () {
              var $ = layui.jquery,
                layer = layui.layer
              layer.open({
                closeBtn: 0,
                title: false,
                content: 'Please refresh after updating the information.',
                btn: ['confirm'],
                yes: function (index, layero) {
                  layer.close(index); //如果设定了yes回调，需进行手工关闭
                  window.location.href = 'cart.html'
                }
              });
            })
        } else if (res.code == 20015) {
          layui.config({ version: true, base: '/layui', })
            .use(['jquery', 'layer'], function () {
              var $ = layui.jquery,
                layer = layui.layer
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
            })

        } else {
          alertTxt(res.msg)
          setTimeout(() => {
            window.location.replace("cart.html");
          }, 3000)
        }
      }
    });
  });
}
function cartInfoGoodsList(res, isClick) {
  if (res.code === 0 && res.data.goodsList.length) {
    const cart_info = res.data;
    ORDERPARAMS.preParam = cart_info.useDiscount;
    if (sessionStorage.getItem('remark')) {
      ORDERPARAMS.remark = sessionStorage.getItem('remark');
      cart_info.remark = sessionStorage.getItem('remark');
    }
    tiktoValue = cart_info.afterDicountTotal
    cartQuery(cart_info)
    if (isClick) {
      var invalidGoodsList = []
      if (getStorage('invalidGoodsList')) {
        invalidGoodsList = getStorage('invalidGoodsList');
      }
      if (res.data.invalidGoodsList.length && JSON.stringify(res.data.invalidGoodsList) !== invalidGoodsList) {
        layui.config({
          version: true,
          base: '/layui'
        }).use(['jquery', 'layer'], function () {
          var $ = layui.jquery,
            layer = layui.layer
          let tip = 'Your shopping cart was expired, please select a new product.'
          layer.confirm(tip, {
            id: 'tip_code',
            icon: 5,
            title: '',
            closeBtn: 0,
            skin: 'tip-class',
            btn: ['YES'] //可以无限个按钮
            , btn1: function (index, layero) {
              layer.close(index);
              deleteStorage('invalidGoodsList')
              window.location.href = "/cart.html";
            }
          })
        });
      } else {
        deleteStorage('invalidGoodsList')
        let money = $('#total_price').attr('data-d-money');
        if (money !== '0') {
          afterOrder(ORDERPARAMS);
        } else {
          alertTxt('Your request could not be performed due to incorrect and failed business verification. The money amount must be not less than zero.')
        }
      }
    }
  }
}
// 地址回显
let address_form = JSON.parse(localStorage.getItem('address_form'))
if (address_form != null) {
  // 含有收货地址
  if (address_form.hasOwnProperty('adressParam')) {
    addressShow('shipping_address_form', 'adressParam')
  }
  // 含有账单地址
  if (address_form.hasOwnProperty('billingAdressParam')) {
    addressShow('billing_address_form', 'billingAdressParam')
    $('.billing-address-ul li').eq(1).addClass('active').siblings().removeClass('active')
    $('.billing-address-ul li').eq(1).find('.input-radio').prop("checked", "checked");
    $('.billing-address-ul li').eq(1).siblings().find('.input-radio').removeProp('checked');
    $('#billing_address_form').show()
  }
}
function addressShow($id, addressName) {
  let address = address_form[addressName];
  for (var key in address) {
    if (key === 'country') {
      country($id, address['country'])
      if (address['countryCode'] === 'CAN' || address['countryCode'] === 'USA') {
        $('#' + $id + ' .province-input .field__input').val('')
        $('#' + $id + ' [data-stata="' + address['countryCode'] + '"').addClass('active').siblings().removeClass('active');
        $('#' + $id + ' [data-stata="' + address['countryCode'] + '"').find('option').each(function (index, item) {
          if ($(item).text() === address['state']) {
            $(item).prop("selected", 'selected')
          }
        });
        $('#' + $id + ' [data-stata="' + address['countryCode'] + '"').find('select').addClass('is-selected')
      }
    } else {
      $('#' + $id).find('input[name="' + key + '"]').val(address[key]).addClass('is-filled');
      if (!$('#' + $id).find('.province-input').hasClass('active')) {
        $('#' + $id + ' .province-input .field__input').val('')
      }
    }
  }
}

// 国家列表
function country(countryId, countryKey) {
  let $html = '<option value="default" disabled selected hidden></option>';
  let county_list = JSON.parse($('[data-county-json]').html())
  for (var key in county_list) {
    let $option = `<option data-code="${county_list[key]}" value='${key}' >${key}</option>`;
    if (countryKey === key) {
      $option = `<option data-code="${county_list[key]}" value='${key}' selected >${key}</option>`;
    }
    $html += $option;
  }
  $('#' + countryId).find('.address_country').html($html).addClass('is-selected');
}

// 虚拟键盘输入框挡住input
if (navigator.userAgent.toLowerCase().match(/iPhone\sOS/i) !== "iphone os") {
  const innerHeight = window.innerHeight;
  window.addEventListener('resize', () => {
    const newInnerHeight = window.innerHeight;
    if (innerHeight > newInnerHeight) {
      // 键盘弹出事件处理
      $('#order-checkbox--btn').css('position', 'static')
    } else {
      // 键盘收起事件处理
      $('#order-checkbox--btn').css('position', 'fixed')
    }
  });
}

function tax(countryName) {
  const total_price = $('#total_price').attr('data-o-money')
  const isCountryExist = CONFIGDATA.taxRateList.find(item => {
    return item.nameEn == countryName
  })
  if (typeof (isCountryExist) != 'undefined') {
    $('.tax').removeClass('hide')
    taxVal = isCountryExist.taxRate / 100
    const tax = formatMoneyRate(total_price * taxVal)
    $('#tax').text(setmeal.symbol + tax).attr('data-money', tax)
    $('#total_price').text(setmeal.symbol + formatMoneyRate(total_price * (taxVal + 1))).attr('data-tax-money', formatMoneyRate(total_price * (taxVal + 1)))
  } else {
    taxVal = 0
    $('.tax').addClass('hide')
    $('#tax').attr('data-money', 0)
    $('#total_price').text(setmeal.symbol + total_price).attr('data-tax-money', total_price)
  }
}
$(document).on('click', '#order_checkout--checkbox', function () {
  $(this).toggleClass('active');
  if ($(this).hasClass('active')) {
    $('#order_checkout').removeAttr('disabled')
  } else {
    $('#order_checkout').attr('disabled', 'disabled')
  }
})