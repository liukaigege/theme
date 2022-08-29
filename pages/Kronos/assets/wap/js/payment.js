// 截取支付方式
var url = window.location.href;
var theRequest = {};
var paramArr = customVal(url, theRequest);
let configJson = {},
  payssionPayStatus = false,
  payssionId = false,
  alipayStatus = false,
  threeDOrderStatus = false;
// $.getJSON("../data/config.json?version=" + version, function (data) {
//获取config.json里面数据
configJson = CONFIGDATA
// })
configJson.payMethod.creditCard.map(function (v, i) {
  if (v.cardType == -2) {
    //本店铺支持payssion支付方式
    payssionPayStatus = true;
  } else if (v.cardType == -1) {
    alipayStatus = true
  }
})
function customVal(str, obj) {
  if (str.indexOf("?") === -1) {
    return obj;
  }
  var arrStr = str.split('?')[1];
  if (arrStr && arrStr.indexOf("&") !== -1) {
    var arr = arrStr.split('&');
    arr.forEach(element => {
      element.split('=')[0] !== '' ? obj[element.split('=')[0]] = element.split('=')[1] : 0;
    });
  } else if (arrStr.indexOf("&") === -1) {
    obj[arrStr.split('=')[0]] = arrStr.split('=')[1];
  }
  return obj;
}

function codPayShowFn(countryCode) {
  let codStatus = false;
  CODCountry.map(function (v, i) {
    if (countryCode == v.countryKey && !threeDOrderStatus) {
      codStatus = true;
    }
  })
  if (codStatus) {
    $('#codPay').show();
  } else {
    $('#codPay').hide();
    if ($('#codPay').find('#codMethod').prop('checked')) {
      $('#codPay').find('#codMethod').prop('checked', false);
      $('#codPay').find('.codPayBtn').hide();
      $('.paypalBtns').show();
      $('#paypalMethod').prop('checked', true);
    }
  }
}



(paramArr.hasOwnProperty('status') && paramArr.status === '0' || paramArr.status === 'FAILED' || paramArr.status === 'failed') && failedOpt();
var paymentParam = {}
paymentParam['ordersId'] = parseInt(paramArr.ordersId);
//渲染
const ORDER_PAYMENT = {}
ORDER_PAYMENT['ordersId'] = paymentParam.ordersId;
ORDER_PAYMENT['payMethod'] = 'paypal';
// $('#oceanpayment').removeProp('checked');

function renderPayssion(country) {
  if (payssionPayStatus) {
    getToken(function () {
      $.req({
        url: '/api/v1/orders/queryPayssion',
        type: 'get',
        data: {},
        dataType: 'json',
        contentType: 'application/json',
        success(res) {
          // console.log(res)
          if (res.code == 0) {
            let prevArr = [], //当前国家展示的支付方式
              lastArr = []; //其他国家的更多支付方式
            res.data.map(function (item, index) { //遍历后台支付数据
              pushStatus = false; //初始化临时变量
              item.countryName = item.countryName.split(','); //多个国家名称，转为数组
              item.countryName.map(function (v, i) { //遍历当前方法支持的国家数组
                if (v == country) { //当前国家与传入国家名称匹配
                  pushStatus = true;
                }
              })
              if (pushStatus) {
                prevArr.push(item)
              } else {
                lastArr.push(item)
              }
            });
            if ($('#paymentMethod .radio-ul').find('.payssionLists').length > 0) {
              let ele = $('#paymentMethod .radio-ul').find('.payssionLists');
              for (let i = ele.length - 1; i >= 0; i--) {
                ele.eq(i).remove();
              }
            }
            let payssionListStr = '',
              morepayssionStr = '';
            if (prevArr.length > 0) {
              prevArr.map(function (v, i) {
                payssionListStr += `
              <li class="radio-wrapper payssionLists" data-method-name="payssion">
                <label class="radio__label" for="payssionMethod">
                  <div class="radio__input">
                    <input class="input-radio payssionMethod" type="radio" value="false">
                  </div>
                  <span>${v.methodName} via payssion</span>
                </label>
                <div class="paymentMethod_btn">
                  <div class='paypal-tip'>Please click the button below to pay,you will be redirected to payment page to complete your purchase securely. For assistance, please contact us.</div>
                  <div class="payssionPay showPayssionPay" data-id="${v.id}">Proceed to Checkout</div>
                </div>
              </li>
              `
              });
            }
            payssionListStr += `
            <li class="radio-wrapper payssionLists" data-method-name="payssion">
              <label class="radio__label" for="payssionMethod">
                <div class="radio__input">
                  <input class="input-radio payssionMethod" type="radio" value="false">
                </div>
                <span>More payment methods</span>
              </label>
              <div class="paymentMethod_btn">
                <div class="showPayssionType">${lastArr[0].methodName} via payssion</div>
                <div class='paypal-tip'>Please click the button below to pay,you will be redirected to payment page to complete your purchase securely. For assistance, please contact us.</div>
                <div class="payssionPay listPayssionPay showPayssionPay" data-id="${lastArr[0].id}">Proceed to Checkout</div>
              </div>
            </li>
            `
            $('#paymentMethod .radio-ul').append(payssionListStr);
            lastArr.map(function (v, i) {
              morepayssionStr += `
              <li class="payssionList ${i == 0 ? 'active' : ''}" data-id="${v.id}">
                <img src="../assets/pc/images/gou_icon.png" alt="" class="wapChoose">
                <img src="../assets/pc/images/choose.png" alt="" class="pcChoose">
                <span>${v.methodName} via payssion</span>
              </li>
              `
            })
            $('#payssionListContainer').html(morepayssionStr)

          }
        }
      })
    })
  }
}

setTimeout(() => {
  $('#oceanpayment').prop("checked", false);
  $('#paypalMethod').prop("checked", "checked");
}, 100)
if (getStorage('currentRate')) {
  var totalRate = JSON.parse(getStorage('currentRate'));
}
let payMethod = '';//保存结算方式
var totalPriceUsd = 0; //美元总价（alipay使用）
getOrderDetails()
function getOrderDetails() {
  // U67.查询单个订单信息接口(Redis)
  getToken(function () {
    $.req({
      url: '/api/v1/orders/orders/' + paymentParam.ordersId,
      type: 'get',
      async: false,
      success(res) {
        if (res.code === 0) {
          // threeDOrderStatus
          console.log('订单信息===>', res)
          res.data.goodsList.map(function (v, i) {
            if (v.speType == 3 || v.speType == 2) {
              threeDOrderStatus = true
            }
          })
          // 切换货币，如果此接口返回货币与当前主货币不同，以此接口货币为主
          if (totalRate.currency !== res.data.currency) {
            configJson.currency.forEach(item => {
              if (res.data.currency == item.currency) {
                totalRate = item;
                return false
              }
            })
          }
          ORDER_PAYMENT.adressParam = res.data.adressParam;
          ORDER_PAYMENT.taxRatePrice = res.data.taxRatePrice
          codPayShowFn(res.data.adressParam.country);
          renderPayssion(res.data.adressParam.country)
          if (res.data.hasOwnProperty('billingAdressParam') && res.data.billingAdressParam && res.data.billingAdressParam != null) {
            ORDER_PAYMENT.billingAdressParam = res.data.billingAdressParam;
          }
          totalPriceUsd = res.data.totalPriceUsd
          // 产品信息；
          product(res.data);
          // 联盟看板
          let goodsList = []
          res.data.goodsList.forEach(item => {
            const goodListItem = {
              quantity: item.quantity,
              spuId: item.goodsId,
              spu: item.goodsName,
              spuPrice: item.defaultPrice,
              spuImg: item.mainImg
            }
            goodsList.push(goodListItem)
          })
          sendAnalyze('view', {}, goodsList);
          // 埋点信息存入session
          var cartArr = [];
          let goodsCount = 0;
          res.data.goodsList.forEach(element => {
            var cartList = {};
            cartList.goodsId = element.goodsId
            cartList.goodsName = element.goodsName
            cartList.sku = element.sku || '';
            cartList.type = '';
            cartList.quantity = element.quantity || '';
            cartList.discountPrice = Math.round(element.discountPrice * 100 / totalRate.rate) / 100;
            goodsCount += element.quantity;
            cartArr.push(cartList);
          })
          if (res.data.promotionLogo && res.data.promotionLogo != null && !getCookie('promotionLogo')) {
            setCookie('promotionLogo', res.data.promotionLogo)
          }
          let productData = {
            "afterDicountTotal": Math.round(res.data.productPrice * 100 / totalRate.rate - res.data.totalDiscount * 100 / totalRate.rate) / 100,
            "orderTotal": goodsCount,
            "shippingMoney": Math.round(res.data.totalShippingPrice * 100 / totalRate.rate) / 100,
            "discount": Math.round(res.data.totalDiscount * 100 / totalRate.rate) / 100,
            "currency": totalRate.currency,
          };
          productData.goodsList = cartArr;
          localStorage.setItem('productData', JSON.stringify(productData));
          setTimeout(() => {
            for (let i = 0; i < $('.radio-wrapper .input-radio').length; i++) {
              $('.radio-wrapper .input-radio').eq(i).removeProp('checked');
            }
            $('#paypalMethod').prop("checked", "checked");
          }, 100)
          //tiktok埋点
          let $Tiktok_val = $('#Tiktok').val();
          let $tiktok_status = $('#Tiktok').attr('data-show')
          if ($Tiktok_val && $Tiktok_val != '' && Object.prototype.toString.call($Tiktok_val).slice(8, -1) != 'Null' && $tiktok_status == 'true') {
            let tiktokArr = []
            res.data.goodsList.forEach(element => {
              const tiktokList = {
                content_id: String(element.goodsId),
                content_type: 'product',
                content_name: element.sku || '',
                quantity: Number(element.quantity),
                price: Math.round(element.discountPrice * 100 / totalRate.rate) / 100,
              }
              tiktokArr.push(tiktokList)
            })
            let TiktokParam = {
              contents: tiktokArr,
              value: res.data.totalPriceUsd,
              currency: 'USD',
            }
            localStorage.setItem('TiktokParam', JSON.stringify(TiktokParam));
          }
        } else {
          alertTxt(res.msg)
        }
      }
    });
  });
}

function product(res) {
  layui.use(['laytpl'], function () {
    let laytpl = layui.laytpl;
    let getOrderTpl = order_info_tempalte.innerHTML,
      orderView = document.getElementById('order-info--payment')
    laytpl(getOrderTpl).render(res, function (html) {
      orderView.innerHTML = html;
      $("[data-now-money]").each(function (index, item) {
        let $price = Number($(item).attr('data-now-money'));
        $(item).html(totalRate.symbol + $price);
      })
    });
  })
  address(res)
}
function address(res) {
  layui.use(['laytpl'], function () {
    let laytpl = layui.laytpl;
    let getTpl = shipping_box_demo.innerHTML,
      view = document.getElementById('shipping_box')
    if (res.shippingsName) {
      sessionStorage.setItem('shippingsName', res.shippingsName)
    } else {
      res.shippingsName = sessionStorage.getItem('shippingsName')
    }
    laytpl(getTpl).render(res, function (html) {
      view.innerHTML = html;
      $('.shipping_box_change').click(function () {
        var $id = $(this).attr('data-address');
        $('#' + $id).addClass('active');
        $('#shipping_box').hide();
        // 地址回显
        $id === 'shipping_address_form' ? addressShow($id, 'adressParam') : addressShow($id, 'billingAdressParam');
      });
    });
  })
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
  // $(this).siblings().find('.input-radio').removeProp('checked');
  $(this).siblings().find('.input-radio').prop('checked', false);
  $(this).addClass('active').siblings('li').removeClass('active');
  $(this).find('.input-radio').prop("checked", "checked");
  let typeName = $(this).attr('data-type')
  if (typeName === 'billing-address') {
    $('#billing_address_form').slideDown(300).removeClass('active');
    $('#billing_address_form .address_form--ul').addClass('active')
  } else {
    $('#billing_address_form')[0].reset();
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
      //   var pattern = /^[A-Z0-9]{1,30}/;
      //   validate(pattern, $(this));
      //   break;
      case 'email':
        var pattern = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,8}){1,2})$/;;
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
//订单商品列表下拉
$('.order-info .information_title').click(function () {
  $(this).toggleClass('active')
  $('.order-info--content').slideToggle(300)
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
  } else {
    $('#' + addressForm).find('.province-input').addClass('active').siblings().removeClass('active');
  };
  // 获取countryCode
  let countryCodeHtml = $(this).attr('data-country-code');
  $('#' + countryCodeHtml).addClass('is-filled').val(countryCode);
  if ($(this).attr('id') == 'checkout_billing_address_country') {
    tax($(this).find("option:selected").text())
  }
});
// 省份下拉选择事件
$('.province-select').change(function () {
  let stateCode = $(this).val();
  $(this).closest('li').removeClass('err_active')
})

$(document).on('click', '.adress_btn', function () {
  var issubmit = true;
  $('.order_container form.active').find('li').each((index, item) => {
    if ($(item).find('input').val() === '' && $(item).find('input').attr('name') !== 'street2') {
      $(item).addClass('err_active');
      msgErrAnimate($(item).find('.msg'));
      issubmit = false;
      if ($(item).hasClass('province-cell') && !$(item).hasClass('active')) {
        $(item).find('.msg').removeClass('active');
        issubmit = true;
      }
    };
    if ($(item).find('input').hasClass('err')) {
      issubmit = false
    }
    // return issubmit;
  });
  // 收货地址
  if ($('#shipping_address_form').hasClass('active')) {
    // 判断是否选中国家
    codPayShowFn($('#checkout_billing_address_country').val())
    renderPayssion($('#checkout_billing_address_country').val())

    for (let i = 0; i < $('.radio-wrapper .input-radio').length; i++) {
      $('.radio-wrapper .input-radio').eq(i).removeProp('checked');
    }
    $('#paypalMethod').prop("checked", "checked");
    ORDER_PAYMENT.payMethod = 'paypal'
    $('.radio-wrapper').eq(0).addClass('active').siblings('li').removeClass('active')

    if ($('#checkout_billing_address_country').val() == null || $('#checkout_billing_address_country').val().trim() === '') {
      $('#checkout_billing_address_country').closest('li').addClass('err_active');
      msgErrAnimate($('#checkout_billing_address_country').siblings('.msg'));
      issubmit = false;
    };
    //判断是否选中省份
    if ($('#shipping_address_form .province-cell.active').find('.field__input').val() == null || $('#shipping_address_form .province-cell.active').find('.field__input').val().trim() === '') {
      $('#shipping_address_form .province-cell.active').closest('li').addClass('err_active');
      msgErrAnimate($('#shipping_address_form .province-cell.active').find('.msg'));
      issubmit = false;
    }
  }
  // 账单地址
  if ($('#billing_address_form').hasClass('active')) {
    if ($('.billing-address-ul [data-type="billing-address"]').hasClass('active')) {
      // 判断是否选中国家(账单地址)
      if ($('#checkout_billing_address_order_country').val() == null || $('#checkout_billing_address_order_country').val().trim() === '') {
        $('#checkout_billing_address_order_country').closest('li').addClass('err_active');
        msgErrAnimate($('#checkout_billing_address_order_country').siblings('.msg'));
        issubmit = false;
      };
      //判断是否选中省份(账单地址)
      if ($('#billing_address_form .province-cell.active').find('.field__input').val() == null || $('#billing_address_form .province-cell.active').find('.field__input').val().trim() === '') {
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
    var formInfo = {}
    // 关闭表格提交
    var _this = $(this);
    let $form = _this.attr('data-form');
    if ($form === 'shipping_address_form') {
      let shipping_form = serializeForm('shipping_address_form', formInfo)
      ORDER_PAYMENT.adressParam = shipping_form
    } else {
      let billing_form = serializeForm('billing_address_form', formInfo)
      ORDER_PAYMENT.billingAdressParam = billing_form
    }
    $('#' + $form).removeClass('active');
    address(ORDER_PAYMENT)
    $('#shipping_box').show();
    $("html,body").animate({
      scrollTop: $("body").offset().top - window.innerHeight * 0.3
    }, 500)
  } else {
    $("html,body").animate({
      scrollTop: $("#payment li.err_active:first").offset().top - window.innerHeight * 0.3
    }, 500)
    msgErrAnimate($('li.err_active .msg'))
  }
})

// 地址回显
function addressShow($id, addressName) {
  if (ORDER_PAYMENT.hasOwnProperty(addressName)) {
    let address = ORDER_PAYMENT[addressName];
    for (var key in address) {
      if (key === 'country') {
        country($id, address['country'])
        if (address['countryCode'] === 'CAN' || address['countryCode'] === 'USA') {
          $('#' + $id + ' [data-stata="' + address['countryCode'] + '"').addClass('active').siblings().removeClass('active');
          $('#' + $id + ' [data-stata="' + address['countryCode'] + '"').find('option').each(function (index, item) {
            if ($(item).text() === address['state']) {
              $(item).prop("selected", 'selected')
            }
          });
        }
      } else {
        $('#' + $id).find('input[name="' + key + '"]').val(address[key]).addClass('is-filled');
      }
    }
  }
}

// 国家列表
function country(countryId, countryKey) {
  var country = JSON.parse(sessionStorage.getItem('country'));
  let $html = '<option value="default" disabled selected hidden></option>';
  if (country) {
    for (var key in country) {
      let $option = `<option data-code="${country[key]}" value='${key}' >${key}</option>`;
      if (countryKey === key) {
        $option = `<option data-code="${country[key]}" value='${key}' selected >${key}</option>`;
      }
      $html += $option;
    }
  } else {
    let county_list = JSON.parse($('[data-county-json]').html())
    localStorage.setItem('country', JSON.stringify('county_list'))
    for (var key in county_list) {
      let $option = `<option data-code="${county_list[key]}" value='${key}' >${key}</option>`;
      if (countryKey === key) {
        $option = `<option data-code="${county_list[key]}" value='${key}' selected >${key}</option>`;
      }
      $html += $option;
    }
  }
  $('#' + countryId).find('.address_country').html($html);
}

// 序列化
function serializeForm($id, formInfo) {
  let $form = $('#' + $id).serializeObject();
  formInfo[$id] = $form;
  $form['name'] = $form.firstName + ' ' + $form.lastName;
  $form['countryCode'] = $('#' + $id + ' .address_country option:checked').attr('data-code');
  if ($('#' + $id + ' .province-cell.active').hasClass('province-input')) {
    $form.state = $('#' + $id + ' .province-cell.active').find('input').val();
  } else {
    $form.state = $('#' + $id + ' .province-cell.active').find('.field__input option:checked').text();
  }
  return $form
}

// 切换支付方式
const creadit_card = $('#pay_method').attr('data-type').trim() //获取paypal外的支付方式
$('#paymentMethod').on('click', '.radio-wrapper', function (e) {
  e.stopPropagation()
  e.preventDefault()
  // $(this).siblings('li').removeClass('active').find('.input-radio').removeProp('checked');
  $(this).siblings('li').removeClass('active').find('.input-radio').prop('checked', false);
  $(this).addClass('active').find('.input-radio').prop("checked", "checked");
  let paymentName = $(this).attr('data-method-name')
  if (paymentName === 'paypal') {
    ORDER_PAYMENT.payMethod = 'paypal'
  } else if (paymentName === 'cod') {
    ORDER_PAYMENT.payMethod = 'cod'
  } else if (paymentName == 'alipay') {
    ORDER_PAYMENT.payMethod = 'alipay'
    paymentName = 'alipay'
  } else if (paymentName == 'payssion') {
    ORDER_PAYMENT.payMethod = 'payssion'
    payssionId = $(this).find('.showPayssionPay').data('id') - 0;
  } else {
    ORDER_PAYMENT.payMethod = creadit_card
  }
}).on('click', '.radio-ul .showPayssionType', function () {
  $('.payssionTContainer').show();
}).on('click', '.payssionLists .payssionPay', function (e) {
  e.stopPropagation();
  console.log('payssionId=>', payssionId)
  ORDER_PAYMENT.payssionId = payssionId
  console.log('ORDER_PAYMENT', ORDER_PAYMENT)
  $('#oceanpayment_buynow img').show();
  getToken(function () {
    ORDER_PAYMENT.payMethod = 'payssion'
    $.req({
      url: '/api/v1/pre/orders/orders',
      type: 'post',
      data: JSON.stringify(ORDER_PAYMENT),
      dataType: 'json',
      contentType: 'application/json',
      success(res) {
        if (res.code === 0) {
          console.log(res)
          layui.use(['laytpl'], function () {
            let laytpl = layui.laytpl;
            let getTpl = payssionNoticeDemo.innerHTML,
              view = document.getElementById('formNotice');
            laytpl(getTpl).render(res.data, function (html) {
              view.innerHTML = html;
            });
            // 提交payssion适配表单
            $('#payssionForm').submit();
          });
        } else {
          alertTxt('payment abnormality')
          $('#oceanpayment_buynow img').hide();
        }
      }
    });
  });
})
$('.payssionTContainer').on('click', '#payssionListContainer .payssionList', function () {
  payssionId = $(this).data('id') - 0;
  $('.listPayssionPay').data('id', payssionId)
  $(this).addClass('active').siblings('.payssionList').removeClass('active');
  $('.showPayssionType').html($(this).text());
  $('.payssionTContainer').hide();
}).on('click', '.payssionContentHeader img', function () {
  $('.payssionTContainer').hide();
})

function failedOpt() {
  $('.payment-failed').show();
  $("html,body").animate({
    scrollTop: $(".payment-failed").offset().top
  }, 500)
}

const clientId = $('#paypal_clientId').attr('data-clientId')
if (clientId) {
  const setmeal = totalRate.currency
  var jsStr = `?client-id=${clientId}&currency=${setmeal}`;
  var PAYPAL_SCRIPT = 'https://www.paypal.com/sdk/js' + jsStr;
  var script = document.createElement('script');
  script.setAttribute('src', PAYPAL_SCRIPT);
  document.body.prepend(script);
  if (script.readyState) {
    script.onreadystatechange = function () {
      if (script.readyState == 'complete' || script.readyState == 'loaded') {
        setPaypal()
      }
    }
  } else {
    script.onload = function () {
      setPaypal()
    }
  }
}
function setPaypal() {
  closePlaceholder()
  // paypal支付
  paypal.Buttons({
    // Call your server to set up the transaction
    createOrder: function (data, actions) {
      return fetch('/vshop-site/api/v1/pre/orders/orders', {
        method: 'post',
        body: JSON.stringify(ORDER_PAYMENT),
        headers: {
          "Authorization": 'Bearer' + getStorage('localstorageId')
        }
      }).then(function (res) {
        console.log("123-->", res);
        return res.json();
      }).then(function (orderData) {
        console.log("orderData-->", orderData);
        if (orderData.code != 0) {
          alertTxt('payment abnormality')
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
          return alertTxt('payment abnormality')
        }
        // Show a success message to the buyer
        let money = $('#total_price').attr('data-now-money');
        if (orderData.statusCode === 201 && orderData.status === "COMPLETED") {
          window.location.href = `/payment-results.html?status=1&transcationId=${data.orderID}&currency=${totalRate.currency}&amount=${money}`;
        } else {
          // window.location.href = `/payment-results.html?status=0`;
          failedOpt()
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
if (creadit_card == 'xbPay' || creadit_card == 'wangao') {
  $('#card_no').on('blur', function () {
    if ($(this).val() && is_valid_credit_card($(this).val().replace(/\s*/g, ""))) {
      $('#card_no+p').addClass('hide')
    } else {
      $('#card_no+p').removeClass('hide')
    }
  })
  $('#first_name,#last_name,#cvv').on('blur', function () {
    const pattern = new RegExp($(this).attr('data-pattern'))
    const val = $(this).val()
    if (!pattern.test(val)) {
      $(this).siblings('p').removeClass('hide')
    } else {
      $(this).siblings('p').addClass('hide')
    }
  })
  // 校验有效月分
  $('#expiration_month').change(function () {
    // 判断时间是否选择 和 时间大于当前时间
    const expiration_year = $('#expiration_year').val() || 0
    const expiration_month = $('#expiration_month').val() || 0
    const currMonth = new Date().getMonth() + 1
    const currYear = new Date().getFullYear()
    if (!expiration_month) {
      $(this).siblings('p').removeClass('hide')
    } else if (expiration_year && expiration_year == currYear) {
      expiration_month >= currMonth ? $(this).siblings('p').addClass('hide') : $(this).siblings('p').removeClass('hide')
    } else {
      $(this).siblings('p').addClass('hide')
    }
  })
  // 校验有效年分
  $('#expiration_year').change(function () {
    const expiration_year = $('#expiration_year').val() || 0
    const expiration_month = $('#expiration_month').val() || 0
    const currMonth = new Date().getMonth() + 1
    const currYear = new Date().getFullYear()
    if (!expiration_year || expiration_year < currYear) {
      $(this).siblings('p').removeClass('hide')
    } else if (expiration_year == currYear) {
      expiration_month >= currMonth ? $('#expiration_month').siblings('p').addClass('hide') : $('#expiration_month').siblings('p').removeClass('hide')
      $(this).siblings('p').addClass('hide')
    } else {
      $('#expiration_month').siblings('p').addClass('hide')
      $(this).siblings('p').addClass('hide')
    }
  })

}
function xbPayMethod() {
  let isFlag = true
  $('.pay-credit .form-group').each((index, item) => {
    if (!$(item).find('p').hasClass('hide')) {
      isFlag = false
    } else {
      if ($(item).find('.form-control').val() == '') {
        $(item).find('p').removeClass('hide')
      }
    }
  })
  if (!isFlag) {
    return false
  }
  // 判断时间是否选择 和 时间大于当前时间
  const expiration_year = $('#expiration_year').val()
  const expiration_month = $('#expiration_month').val()
  if (!expiration_month) {
    isFlag = false
    $('#expiration_month+p').removeClass('hide')
  }
  if (!expiration_year) {
    isFlag = false
    $('#expiration_year+p').removeClass('hide')
  }
  if (isFlag) {
    var paymentMethodInfo = {
      "billing_desc": "",
      "card_no": $('#card_no').val().replace(/\s*/g, ""),
      "expiration_month": $('#expiration_month').val(),
      "expiration_year": $('#expiration_year').val(),
      "cvv": $('#cvv').val().trim(),
      "first_name": $('#first_name').val().trim(),
      "last_name": $('#last_name').val().trim(),
    }
    ORDER_PAYMENT.paymentMethodInfo = paymentMethodInfo
  }
  return isFlag
}
function is_valid_credit_card(card_no) {
  var pattern = /^[ 0-9]{14,23}$/;
  if (!pattern.test(card_no)) {
    return false
  }
  let $sum = 0
  card_no.split('').forEach((item, index) => {
    let $val = 0
    if ((index % 2) == 0) {
      $val = Number(item) * 2;
      if ($val > 9) {
        $val -= 9
      }
    } else {
      $val = Number(item)
    }
    $sum += $val
  })
  return (($sum % 10) == 0);
}

$('#oceanpayment_buynow').click(function (e) {
  e.stopPropagation();
  if ($(this).hasClass('disabled')) {
    return false
  }
  if (ORDER_PAYMENT.payMethod == 'xbPay' || ORDER_PAYMENT.payMethod == 'wangao') {
    if (!xbPayMethod()) {
      return false
    }
  } else {
    delete ORDER_PAYMENT.paymentMethodInfo
  }
  $('#oceanpayment_buynow img').show();
  getToken(function () {
    $.req({
      url: '/api/v1/pre/orders/orders',
      type: 'post',
      data: JSON.stringify(ORDER_PAYMENT),
      dataType: 'json',
      contentType: 'application/json',
      success(res) {
        if (res.code === 0) {
          switch (ORDER_PAYMENT.payMethod) {
            case 'oceanpayment':
              // 右侧产品信息（前海支付）；
              layui.use(['laytpl'], function () {
                let laytpl = layui.laytpl;
                let getTpl = formNoticeDemo.innerHTML,
                  view = document.getElementById('formNotice');
                laytpl(getTpl).render(res.data, function (html) {
                  view.innerHTML = html;
                  console.log()
                });
                // 提交钱海适配表单
                $('#aa').submit();
              });
              break;
            case 'cnp': case 'lianlian':
              if (Object.prototype.toString.call(res.data.backUrl).slice(8, -1) != 'Null' && res.data.backUrl != '') {
                window.location.href = res.data.backUrl
              } else {
                alertTxt('payment abnormality')
                $('#oceanpayment_buynow img').hide();
              }
              break;
            case 'pingpong':
              if (Object.prototype.toString.call(res.data.token).slice(8, -1) != 'Null' && res.data.token != '' &&
                Object.prototype.toString.call(res.data.innerJsUrl).slice(8, -1) != 'Null' && res.data.innerJsUrl != '' &&
                Object.prototype.toString.call(res.data.mode).slice(8, -1) != 'Null' && res.data.mode != '') {
                pingPong_pay(res.data.token, res.data.innerJsUrl, res.data.mode)
              } else {
                alertTxt('payment abnormality')
                $('#oceanpayment_buynow img').hide();
              }
              break;
            case 'pacypay':
              layui.use(['laytpl'], function () {
                let laytpl = layui.laytpl;
                let getTpl = pacypayDemo.innerHTML,
                  view = document.getElementById('formNotice');
                laytpl(getTpl).render(res.data, function (html) {
                  view.innerHTML = html;
                });
                // 提交pacypay适配表单
                $('#btnForm').submit();
              });
              break;
            case 'pacypayold':
              if (res.data.pacPayV1ResUrlParameter.responseCode == 80) {
                window.location.href = res.data.pacPayV1ResUrlParameter.url
              } else {
                alertTxt('payment abnormality')
                $('#oceanpayment_buynow img').hide();
              }
              break;
            case 'checkout': case 'glocash': case 'cardpay':
              if (Object.prototype.toString.call(res.data.oceanCommitUrl).slice(8, -1) != 'Null' && res.data.oceanCommitUrl != '') {
                window.location.href = res.data.oceanCommitUrl
              } else {
                alertTxt('payment abnormality')
                $('#oceanpayment_buynow img').hide();
              }
              break;
            case 'xbPay':
              const money = $('#total_price').attr('data-now-money');
              if (Object.prototype.toString.call(res.data.order_number).slice(8, -1) != 'Null' && res.data.order_number != '') {
                window.location.href = `/payment-results.html?status=1&transcationId=${res.data.order_number}&currency=${totalRate.currency}&amount=${money}`;
              } else {
                alertTxt('payment anomaly')
                $('#oceanpayment_buynow img').hide();
              }
              break;
            case 'wangao':
              const { amount, payStatus, currency, paymentIntentId } = res.data
              if (payStatus == 'SUCCEEDED') {
                window.location.href = `/payment-results.html?status=1&transcationId=${paymentIntentId}&currency=${currency}&amount=${amount}`;
              } else {
                $('#oceanpayment_buynow img').hide();
                failedOpt()
              }
              break;
          }
        } else {
          if (ORDER_PAYMENT.payMethod == 'xbPay' || ORDER_PAYMENT.payMethod == 'wangao') {
            alertTxt(res.msg)
          } else {
            alertTxt('payment anomaly')
          }
          $('#oceanpayment_buynow img').hide();
        }
      }
    });
  });
})

$('#codPay').on('click', '.codPayBtn', function (e) {
  ORDER_PAYMENT.payMethod = 'cod'
  e.stopPropagation();
  getToken(function () {
    $.req({
      url: '/api/v1/pre/orders/orders',
      type: 'post',
      data: JSON.stringify(ORDER_PAYMENT),
      dataType: 'json',
      contentType: 'application/json',
      success(res) {
        if (res.code === 0) {
          console.log(ORDER_PAYMENT.payMethod)
          let money = $('#total_price').attr('data-now-money');
          window.location.href = './payment-results.html?status=cod&transcationId=' + ORDER_PAYMENT.ordersId + '&currency=' + totalRate.currency + '&amount=' + money
        } else {
          alertTxt('payment abnormality')
          $('#oceanpayment_buynow img').hide();
        }
      }
    });
  });
})
// stripe支付
if (creadit_card === 'stripe') {
  var PAYPAL_SCRIPT = 'https://js.stripe.com/v3/'
  var script = document.createElement('script');
  script.setAttribute('src', PAYPAL_SCRIPT);
  document.body.prepend(script);
  if (script.readyState) {
    script.onreadystatechange = function () {
      if (script.readyState == 'complete' || script.readyState == 'loaded') {
        getStripe()
      }
    }
  } else {
    script.onload = function () {
      getStripe()
    }
  }
}

function getStripe() {
  // A reference to Stripe.js
  var stripe;
  // Disable the button until we have Stripe set up on the page
  // document.querySelector("button").disabled = true;
  getToken(function () {
    fetch("/vshop-site/api/v1/indexPage/stripeKey", {
      method: 'get',
      headers: {
        "Authorization": 'Bearer ' + getStorage('localstorageId')
      }
    }).then(function (result) {
      return result.json();
    })
      .then(function (data) {
        console.log(data)
        return setupElements(data);
      })
      .then(function ({ stripe, card, clientSecret }) {
        document.querySelector("button").disabled = false;
        var form = document.getElementById("payment-form");
        form.addEventListener("submit", function (event) {
          event.preventDefault();
          pay(stripe, card, clientSecret);
        });
      });

    var setupElements = function (data) {
      stripe = Stripe(data.msg);
      /* ------- Set up Stripe Elements to use in checkout form ------- */
      var elements = stripe.elements();
      var style = {
        base: {
          color: "#32325d",
          fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
          fontSmoothing: "antialiased",
          fontSize: "16px",
          "::placeholder": {
            color: "#aab7c4"
          }
        },
        invalid: {
          color: "#fa755a",
          iconColor: "#fa755a"
        }
      };

      var card = elements.create("card", { style: style });
      card.mount("#card-element");

      return {
        stripe: stripe,
        card: card,
        clientSecret: data.clientSecret
      };
    };

    var handleAction = function (clientSecret) {
      stripe.handleCardAction(clientSecret).then(function (data) {
        console.log("data-76-->", data);
        if (data.error) {
          showError("Your card was not authenticated, please try again");
        } else if (data.paymentIntent.status === "requires_confirmation") {
          fetch("/vshop-third/pay", {
            method: "POST",
            headers: {
              "Authorization": 'Bearer ' + getStorage('localstorageId'),
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              paymentIntentId: data.paymentIntent.id
            })
          })
            .then(function (result) {
              console.log("result-90-->", result);
              return result.json();
            })
            .then(function (json) {
              console.log("json-94-->", json);
              if (json.error) {
                showError(json.error);
              } else {
                orderComplete(clientSecret);
              }
            });
        }
      });
    };

    /*
     * Collect card details and pay for the order
     */
    var pay = function (stripe, card) {
      changeLoadingState(true);

      // Collects card details and creates a PaymentMethod
      stripe
        .createPaymentMethod("card", card)
        .then(function (result) {
          if (result.error) {
            showError(result.error.message);
          } else {
            ORDER_PAYMENT.paymentMethodId = result.paymentMethod.id;
            return fetch("/vshop-site/api/v1/pre/orders/orders", {
              method: "POST",
              headers: {
                "Authorization": 'Bearer ' + getStorage('localstorageId'),
                "Content-Type": "application/json"
              },
              body: JSON.stringify(ORDER_PAYMENT)
            });
          }
        })
        .then(function (result) {
          return result.json();
        })
        .then(function (response) {
          console.log("response--->", response);
          if (response.code != 0) {
            alertTxt('payment abnormality')
          }
          if (response.error) {
            showError(response.error);
            alertTxt('payment abnormality')
          } else if (response.data.requiresAction) {
            // Request authentication
            console.log(response.data)
            handleAction(response.data.clientSecret);
          } else if (Object.prototype.toString.call(response.data.stripeError).slice(8, -1) != 'Null') {
            failedOpt()
            showError(response.data.stripeError)
          } else {
            orderComplete(response.data.clientSecret);
          }
        });
    };

    /* ------- Post-payment helpers ------- */

    /* Shows a success / error message when the payment is complete */
    var orderComplete = function (clientSecret) {
      console.log(clientSecret)
      stripe.retrievePaymentIntent(clientSecret).then(function (result) {
        console.log("result-150-->", result);
        var paymentIntent = result.paymentIntent;
        let amount = $('#total_price').attr('data-now-money');
        if (paymentIntent.status === "succeeded") {
          window.location.href = `/payment-results.html?status=1&transcationId=${paymentIntent.id}&currency=${paymentIntent.currency}&amount=${amount}`;
        } else {
          // window.location.href = `/payment-results.html?status=0`;
          failedOpt()
        }
        changeLoadingState(false);
      });
    };

    var showError = function (errorMsgText) {
      changeLoadingState(false);
      var errorMsg = document.querySelector(".sr-field-error");
      errorMsg.textContent = errorMsgText;
      setTimeout(function () {
        errorMsg.textContent = "";
      }, 4000);
    };

    // Show a spinner on payment submission
    var changeLoadingState = function (isLoading) {
      if (isLoading) {
        document.querySelector("button").disabled = true;
        document.querySelector("#spinner").classList.remove("hidden");
        document.querySelector("#button-text").classList.add("hidden");
      } else {
        document.querySelector("button").disabled = false;
        document.querySelector("#spinner").classList.add("hidden");
        document.querySelector("#button-text").classList.remove("hidden");
      }
    };

  })
}
function pingPong_pay(token, innerJsUrl, mode) {
  let script = document.createElement('script');
  script.setAttribute('src', innerJsUrl);
  document.body.prepend(script);
  if (script.readyState) {
    script.onreadystatechange = function () {
      if (script.readyState == 'complete' || script.readyState == 'loaded') {
        pingPongSdk(token, mode)
      }
    }
  } else {
    script.onload = function () {
      pingPongSdk(token, mode)
    }
  }
}

function pingPongSdk(token, mode) {
  var client = new ppPay({
    debug: false
  })
  // const token = document.getElementById("token").value;
  var sdkConfig = {
    token: token,
    lang: 'en',
    // 本地测试模式 local test build (本地 ，测试 ，线上) (必填参数)
    mode: mode,
    // 支付界面绑定的 div id (可选参数)
    root: ".payment_btn--content",
    base: { // 弹框样式配置
      priceBgColor: "#fff",
      priceFontColor: "#1FA0E8",
      priceFontSize: "32px",
      // 框体样式
      width: '100%', // 框体宽度
      height: 'auto', // 框体⾼度
      fontSize: '14px', // 整体字体⼤⼩
      backgroundColor: '#fff', // 整体弹框背景⾊
      borderRadius: '0px',
      borderWidth: '1px',
      borderColor: 'transparent', // 弹边框颜⾊ transparent 为透明，⽀持 rgba 和 hex
      maskBackgroundColor: 'rgba(0,0,0,.5)',
      maskzIndex: '100',
      loadingColor: '#20a0e8', // 加载动画颜⾊
      loadingBackgroundColor: 'rgba(255,255,255,0.8)', // 动画背景⾊，rgba 格式
      billPadding: '0px',
      billColor: 'rgba(0, 0, 0, 0.4)',
      billFontSize: '14px',
      locatedPadding: '20px 0',
      locatedColor: "#999999",
      locatedBgColor: '#eee',
      locatedFontSize: '14px',
      showHeader: true, // 是否展示头部
      showHeaderLabel: true, // 是否展示头部字体
      headerLabelFont: "Credit Card", // ⾃定义头部字体内容
      headerColor: '#333333', // 头部字体颜⾊
      headerSize: '16px', // 头部字体⼤⼩
      headerBackgroundColor: '#fbfbfb', // 头部背景⾊
      headerPadding: '20px',
      headerfontWeight: '400', // 粗体或细体
      btnSize: '100%', // 按钮宽度百分⽐或者 px
      btnColor: '#fff', // 按钮字体颜⾊
      btnFontSize: '14px', // 按钮字体⼤⼩
      btnPaddingX: '20px', // 字体与宽体左右间距
      btnPaddingY: "10px", // 顶部和底部间距
      btnBackgroundColor: '#1fa0e8', // 按钮背景⾊
      btnBorderRadius: '4px', // 按钮圆⻆
      btnBorderColor: '#1fa0e8',
      btnMarginTop: '0px', // button 离顶部距离
    }
  }
  client.createPayment(sdkConfig, function (res) {
    // 回调函数中会返回支付成功还是失败
    console.log(res)
  })
  // $('.payment_btn--content').hide()
}

if (alipayStatus) {

  var curArr = ['PHP', 'IDR', 'KRW', 'HKD']
  let rateArr = getRateArr()
  let walletReqPaymentId = getuuidstr()
  //存储到缓存里，用户确认要取
  setStorage('walletReqPaymentId', walletReqPaymentId);
  // 把汇率渲染到列表里
  getrata(curArr, rateArr)
  let walletCurrency = $('.wallet_all .wallet_item.selecting').attr('data-rate')
  let walletTotalPrice = Math.round(totalPriceUsd * 100 * walletCurrency) / 100
  let walletType = '1'
  let currencyd = 'PHP'
  $('#rata .card_item.active').find('i').html(walletCurrency)
  $('.wallet_all').on('click', '.wallet_item', function (e) {
    e.stopPropagation()
    e.preventDefault()
    // 切换支付时重新拿去uuid
    walletReqPaymentId = getuuidstr()
    //存储到缓存里，用户确认要取
    setStorage('walletReqPaymentId', walletReqPaymentId);
    currencyd = $(this).attr('data-cur') //货币单位
    walletCurrency = parseFloat($(this).attr('data-rate'))
    if (walletCurrency == 0) {
      $('#payment_button').attr('disabled', 'false')
    } else {
      $('#payment_button').removeAttr('disabled', 'true')
    }
    $(this).addClass('selecting').siblings().removeClass('selecting');
    walletType = $(this).attr('data-select')
    let wallet = $(this).attr('data-wallet')
    $('.' + wallet).addClass('active').siblings().removeClass('active');
    if (currencyd == 'KRW') {
      walletTotalPrice = Math.round(totalPriceUsd * walletCurrency)
    } else if (currencyd == 'IDR') {
      walletTotalPrice = Math.ceil(totalPriceUsd * walletCurrency)
    } else {
      walletTotalPrice = Math.round(totalPriceUsd * 100 * walletCurrency) / 100
    }
    $('#alipay_total').html(walletTotalPrice + ' ' + currencyd)
  })
  $('#alipay_total').html(walletTotalPrice + ' ' + currencyd)
  let isClickAlipay = true
  $('#payment_button').on('click', function () {
    if (isClickAlipay) {
      isClickAlipay = false
      let orderDeepCopy = Object.assign({}, ORDER_PAYMENT);
      orderDeepCopy.payMethod = 'alipay'
      orderDeepCopy.walletTotalPrice = walletTotalPrice
      orderDeepCopy.walletType = walletType
      orderDeepCopy.walletCurrency = currencyd
      orderDeepCopy.walletReqPaymentId = walletReqPaymentId
      console.log(walletReqPaymentId)
      getToken(function () {
        $.req({
          url: '/api/v1/pre/orders/orders',
          type: 'post',
          data: JSON.stringify(orderDeepCopy),
          dataType: 'json',
          contentType: 'application/json',
          success(res) {
            isClickAlipay = true
            if (res.code == 0) {
              window.location.href = res.data.oceanCommitUrl
              $('#alipay_layer').show()
            }
          }
        })
      })
    }
  })
  //点击用户是否已完成付款提示按钮
  $('#alipay_layer .alipay-btn').on('click', 'button', function () {
    let walletReqPaymentId = getStorage('walletReqPaymentId')
    getToken(function () {
      $.ajax({
        url: '/vshop-third/payments/inquiryPayment/' + walletReqPaymentId,
        type: 'get',
        dataType: 'json',
        success(res) {
          console.log(res)
          if (res.paymentStatus === "SUCCESS") {
            let productDataArr = JSON.parse(getStorage('productData'));
            productDataArr.currency = res.paymentAmount.currency;
            setStorage('productData', JSON.stringify(productDataArr))
            setTimeout(function () {
              window.location.href = `/payment-results.html?status=1&transcationId=${res.paymentRequestId}&currency=${res.paymentAmount.currency}&amount=${res.paymentAmount.value}`;
            }, 300);
          } else if (res.paymentStatus === "FAIL" || res.paymentStatus === "PROCESSING") {
            // window.location.href = `/payment-results.html?status=0`;
            $('#alipay_layer').hide()
            failedOpt()
          }
        }
      });
    })
  })
}
function getrata(cur, arr) {
  let rata = 0
  cur.forEach(cur_item => {
    rata = 0
    arr.forEach(item => {
      if (item.currency === cur_item) {
        rata = item.rate
      }
      return false
    })
    switch (cur_item) {
      case 'PHP':
        $('.wallet_all .wallet_item').eq(0).attr('data-rate', rata)
        $('#rata .gcash i').html(rata)
        break;
      case 'IDR':
        $('.wallet_all .wallet_item').eq(2).attr('data-rate', rata)
        $('#rata .dana i').html(rata)
        break;
      case 'KRW':
        $('.wallet_all .wallet_item').eq(1).attr('data-rate', rata)
        $('#rata .kakaopay i').html(rata)
        break;
      case 'HKD':
        $('.wallet_all .wallet_item').eq(3).attr('data-rate', rata)
        $('#rata .AlipayHK i').html(rata)
        break;

    }
  })
}
//获取货币json
function getRateArr() {
  let currency = {}
  // $.getJSON("../data/config.json?version=" + version, function (data) {
  var data = CONFIGDATA
  currency = data.currency
  // }) 
  return currency
}

$('.COT').on('click', function () {
  $(this).toggleClass('active')
  $('#oceanpayment_buynow').toggleClass('disabled')
})

function tax(countryName) {
  const total_price = parseFloat($('#total_price').attr('data-now-money')) - parseFloat($('#tax').attr('data-now-money'))
  const isCountryExist = CONFIGDATA.taxRateList.find(item => {
    return item.nameEn == countryName
  })
  let tax = 0
  console.log(isCountryExist)
  if (typeof (isCountryExist) != 'undefined') {
    $('.tax').removeClass('hide')
    taxVal = isCountryExist.taxRate / 100
    tax = formatMoneyRate(total_price * taxVal)
    $('#tax').text(totalRate.symbol + tax).attr('data-now-money', tax)
    $('#total_price').text(totalRate.symbol + formatMoneyRate(total_price * (taxVal + 1))).attr('data-now-money', formatMoneyRate(total_price * (taxVal + 1)))
  } else {
    taxVal = 0
    tax = 0
    $('#tax').text(totalRate.symbol + 0).attr('data-now-money', 0)
    $('.tax').addClass('hide')
    $('#total_price').text(totalRate.symbol + total_price).attr('data-now-money', total_price)
  }
  ORDER_PAYMENT.taxRatePrice = tax
}