var version = new Date().getTime()
// 当前货币币种
let currentRate = JSON.parse(getStorage('currentRate'));
// 购物车数据
const queryCartParam = {}
let cart_info = {}
var isStartPaypal = false
// 券码显示
let history_list = []
let cartInfo = {}
if (getStorage('history_list')) {
  history_list = JSON.parse(getStorage('history_list'))
  history_list.forEach(item => {
    $('.history_list').append(`<span data-exclude='${item.addFoldUp}'>${item.code}</span>`)
  })
}
ActiveFun()
// 全场活动
function ActiveFun() {
  // $.getJSON("../data/config.json?version=" + version, function (data) {
  var data = CONFIGDATA
  const promotion_arr = []
  const promotionList = data.activities.find(item => {
    return contrastTime(true, item.end, item.start) && item.status == 1
  })
  if (typeof (promotionList) != 'undefined') {
    promotion_arr.push(promotionList)
    let getTpl = promotionTpl.innerHTML,
      view = document.getElementById('promotion');
    layui.use(['laytpl'], function () {
      let laytpl = layui.laytpl;
      laytpl(getTpl).render(promotion_arr, function (html) {
        view.innerHTML = html;
        $('.promotion-ul li').eq(0).addClass('active')
        $('.promotion-ul li').eq(0).find('.input-radio').prop('checked', 'checked')
        queryCartParam.activityId = $('.promotion-ul li.active').attr('data-id')
        // 查询购物车
        if (!$('.cart_head').hasClass('active')) {
          getCartInfo(queryCartParam)
        }
      });
    })
  } else {
    $('#promotion').html('')
    // 查询购物车
    if (!$('.cart_head').hasClass('active')) {
      getCartInfo(queryCartParam)
    }
  }
  // })
}



// 点击选择全场活动
$(document).on('click', '.promotion-ul li', function (e) {
  e.stopPropagation()
  e.preventDefault();
  $(this).siblings().find('.input-radio').removeProp('checked');
  $(this).addClass('active').siblings('li').removeClass('active');
  $(this).find('.input-radio').prop("checked", "checked")
  // couponNum couponId
  if ($(this).attr('data-exclude') != 1) {
    if (queryCartParam.hasOwnProperty('couponId')) {
      $('#coupon .cart_coupon').find('.cart_coupon--cell.active').removeClass('active')
      delete queryCartParam.couponId
    } else if (queryCartParam.hasOwnProperty('couponCode')) {
      $('.history_list span').removeClass('active')
      $('#discount_code--input').val('')
      delete queryCartParam.couponCode
    }
  } else if ($(this).attr('data-id') != 'no_promotion') {
    if (queryCartParam.hasOwnProperty('couponId') && $('#coupon .cart_coupon').find('.cart_coupon--cell.active').attr('data-exclude') != 1) {
      $('#coupon .cart_coupon').find('.cart_coupon--cell.active').removeClass('active')
      delete queryCartParam.couponId
    } else if (queryCartParam.hasOwnProperty('couponCode') && $('.history_list span.active').attr('data-exclude') != 1) {
      $('.history_list span').removeClass('active')
      $('#discount_code--input').val('')
      delete queryCartParam.couponCode
    }
  }
  if ($(this).attr('data-value') === '0') {
    if (queryCartParam.hasOwnProperty('activityId')) {
      delete queryCartParam.activityId;
    } else {
      return false
    }
  } else {
    const activityId = $(this).attr('data-id')
    if (!queryCartParam.hasOwnProperty('activityId') || (queryCartParam.hasOwnProperty('activityId') && queryCartParam.activityId != activityId)) {
      queryCartParam.activityId = activityId
    } else {
      return false
    }
  }
  discountInit(queryCartParam, cart_info)
  // 费用明细
  totalTpl(cart_info)
});
// 查询购物车
function getCartInfo(data, isAsync = false) {
  // 加载paypal
  if (!isStartPaypal) {
    paypalBase()
  }
  isStartPaypal = true
  getToken(function () {
    $.req({
      url: '/api/v1/cart/cart/info',
      type: 'get',
      async: isAsync,
      success(res) {
        if (res.code === 0) {
          cartInfo = res.data
          let $res = calculate(data, res.data)
          console.log('购物车信息', $res.data)
          if ($res.code == 0) {
            cart_info = $res.data
            if (cart_info.goodsList.length || cart_info.invalidGoodsList.length) {
              // 存储查询购物车条件,成功后去除券码
              localStorage.setItem('queryCartParam', JSON.stringify(res.data.useDiscount))
              $('#cart').show()
              $('.cartEmpty').hide()
            } else {
              let gapMoney = `You have <i>0 item</i> in your cart.`
              $('.cart_head span').html(gapMoney)
              $('#cart').hide()
              $('.cartEmpty').show()
            }
            // 购物车
            cartTpl(cart_info)
            // 优惠券
            couponTpl(cart_info)
            // 费用明细
            totalTpl(cart_info)

            if (queryCartParam.hasOwnProperty('couponCode') && !cart_info.useDiscount.hasOwnProperty('couponCodeId')) {
              $('.history_list span').removeClass('active')
              $('#discount_code--input').val('')
              delete queryCartParam.couponCode;
            }
            if (queryCartParam.hasOwnProperty('couponId') && !cart_info.useDiscount.hasOwnProperty('couponId')) {
              $('.cart_coupon .cart_coupon--cell').removeClass('active')
              delete queryCartParam.couponId;
            }
            // if (queryCartParam.hasOwnProperty('activityId') && !cart_info.useDiscount.hasOwnProperty('activityId')) {
            //   $('#promotion').hide()
            // } else {
            //   $('#promotion').show()
            // }
            // 判断全场活动
            const promotionList = CONFIGDATA.activities.find(item => {
              return contrastTime(true, item.end, item.start) && item.status == 1
            })
            if (isEffectiveFun(cart_info, promotionList)) {
              $('#promotion').removeClass('hide')
            } else {
              $('#promotion').addClass('hide')
            }
            if (cart_info.goodsList.length || cart_info.invalidGoodsList.length) {
              //运费查询
              shippingCost(cart_info)
            } else {
              $('#shipping').html('')
            }
          }
        } else {
          alertTxt(res.msg)
        }
      }
    });
  });
}
// 判断活动是否有效
function isEffectiveFun($res, promotionList) {
  console.log(promotionList || promotionList != null && typeof (promotionList) != 'undefined')
  if (promotionList || promotionList != null && typeof (promotionList) != 'undefined') {
    const ruleValue = {};
    if (promotionList.ruleValue == '' || promotionList.ruleValue == null) {
      ruleValue.end = -1
      ruleValue.start = -1
    } else if (promotionList.ruleValue.includes(',')) {
      ruleValue.start = Number(promotionList.ruleValue.split(',')[0]) || -1;
      ruleValue.end = Number(promotionList.ruleValue.split(',')[1]) || -1
    } else {
      ruleValue.start = Number(promotionList.ruleValue);
      ruleValue.end = -1
    }
    console.log(ruleValue, $res.productPrice, $res.goodsCount)
    if (promotionList.activitiesRule == 1) {
      // 价格
      if (($res.productPrice >= ruleValue.start || ruleValue.start == -1) && ($res.productPrice <= ruleValue.end || ruleValue.end == -1)) {
        return true
      } else {
        return false
      }
    } else if (promotionList.activitiesRule == 2) {
      // 数量
      if (($res.goodsCount >= ruleValue.start || ruleValue.start == -1) && ($res.goodsCount <= ruleValue.end || ruleValue.end == -1)) {
        return true
      } else {
        return false
      }
    } else {
      // 无需条件
      return true
    }
  } else {
    return false
  }
}
// 购物车
function cartTpl(res) {
  layui.use(['laytpl'], function () {
    let laytpl = layui.laytpl;
    let getTpl = cart_template.innerHTML,
      view = document.querySelector('#cart_list');
    laytpl(getTpl).render(res, function (html) {
      view.innerHTML = html;
      showMoney('#cart_list')
    });
    $('#cart_list').on('click', '.toThreeD', function () {
      window.location.href = './3d.html?type=2&modalId=' + $(this).data('id');
    }).on('click', '.threeImage', function () {
      window.location.href = './3d.html?type=2&modalId=' + $(this).data('id');
    })
  });
}
// 优惠券
function couponTpl(res) {
  let getPromotionTpl = coupon_tempalte.innerHTML,
    promotionView = document.getElementById('coupon');
  layui.use(['laytpl'], function () {
    let laytpl = layui.laytpl;
    laytpl(getPromotionTpl).render(res, function (html) {
      promotionView.innerHTML = html;
      showMoney('#coupon')
      //选中优惠券
      $('.cart_coupon').on('click', '.cart_coupon--cell', function () {
        let $id = parseFloat($(this).attr('data-discount-id'))
        if (res.useDiscount.hasOwnProperty('couponId') && $id == res.useDiscount.couponId) {
          delete queryCartParam.couponId
        } else {
          queryCartParam.couponId = $id
        }
        // 优惠券和券码不能共用
        if (queryCartParam.hasOwnProperty('couponCode')) {
          $('.history_list span').removeClass('active')
          $('#discount_code--input').val('')
          delete queryCartParam.couponCode;
        }
        const isExclude = $(this).attr('data-exclude')
        if (isExclude != 1 || queryCartParam.hasOwnProperty('activityId') && $('#promotion').find('.radio-wrapper.active').attr('data-exclude') != 1) {

          delete queryCartParam.activityId;
          $('.promotion-ul li').eq(1).addClass('active').siblings().removeClass('active')
          $('.promotion-ul li').eq(0).find('.input-radio').removeProp('checked')
          $('.promotion-ul li').eq(1).find('.input-radio').prop('checked', 'checked')
        }
        // 查询购物车
        discountInit(queryCartParam, cart_info)
        // 费用明细
        totalTpl(cart_info)
        $(this).toggleClass('active').siblings().removeClass('active')
      })
      $('.cart_coupon').find('.cart_coupon--cell[data-discount-id="' + res.useDiscount.couponId + '"]').addClass('active');
    })
  })
}
// 优惠券券码
$(document).on('click', '[data-apply="discount_code"]:not([disabled])', function (e) {
  e.stopPropagation()
  e.preventDefault()
  const codeVal = $('#discount_code--input').val().trim()
  codeVal && code(codeVal)
})
function code(val) {
  $(this).attr('disabled')
  let code_txt = $('#discount_code--input').val().trim()
  var pattern = /^[a-zA-Z0-9]{1,30}/
  if (!pattern.test(code_txt)) {
    $('.code_err').text('Enter a valid discount code')
  } else {
    $('.code_err').text('')
    let addFoldUp = -1
    const couponList = CONFIGDATA.couponCodeList.find(item => {
      return contrastTime(true, item.end, item.start) && item.status == 1 && item.couponNum == val
    })
    if (typeof (couponList) == 'undefined') {
      layui.config({
        version: true,
        base: '/layui'
      }).use(['layer'], function () {
        layer = layui.layer
        layer.msg('Sorry, invalid coupon code..', {
          id: 'tip_code',
          icon: 5,
          time: 2000
        });
      });
      return false
    } else if (isEffectiveFun(cart_info, couponList)) {
      // 优惠券和券码不能共用
      if (queryCartParam.hasOwnProperty('couponId')) {
        $('#coupon .cart_coupon .cart_coupon--cell').removeClass('active')
        delete queryCartParam.couponId;
      }
      queryCartParam.couponCode = val
      addFoldUp = couponList.addFoldUp
      if (addFoldUp != 1 || queryCartParam.hasOwnProperty('activityId') && $('#promotion').find('.radio-wrapper.active').attr('data-exclude') != 1) {
        delete queryCartParam.activityId;
        $('.promotion-ul li').eq(1).addClass('active').siblings().removeClass('active')
        $('.promotion-ul li').eq(0).find('.input-radio').removeProp('checked')
        $('.promotion-ul li').eq(1).find('.input-radio').prop('checked', 'checked')
      }
    } else {
      queryCartParam.couponCode = val
    }
    // 查询购物车
    discountInit(queryCartParam, cart_info)
    // 费用明细
    totalTpl(cart_info)
    $(this).removeAttr('disabled')
    codeResults(val, false, '', addFoldUp)
  }
}
//点击code缓存区
$('.history_list').on('click', 'span', function () {
  let code = $(this).text()
  const isExclude = $(this).attr('data-exclude')
  const couponList = CONFIGDATA.couponCodeList.find(item => {
    return contrastTime(true, item.end, item.start) && item.status == 1 && item.couponNum == code
  })
  if (typeof (couponList) != 'undefined' && isEffectiveFun(cart_info, couponList)) {
    if (queryCartParam.hasOwnProperty('activityId')) {
      if (isExclude != 1 || $('#promotion').find('.radio-wrapper.active').attr('data-exclude') != 1) {
        delete queryCartParam.activityId;
        $('.promotion-ul li').eq(1).addClass('active').siblings().removeClass('active')
        $('.promotion-ul li').eq(0).find('.input-radio').removeProp('checked')
        $('.promotion-ul li').eq(1).find('.input-radio').prop('checked', 'checked')
      }
    }
  }
  $(this).toggleClass('active').siblings().removeClass('active')
  if (!$(this).hasClass('active')) {
    code = ''
    delete queryCartParam.couponCode;
    $('#discount_code--input').val('')
    // 查询购物车
    discountInit(queryCartParam, cart_info)
    // 费用明细
    totalTpl(cart_info)
  } else {
    // 优惠券和券码不能共用
    if (queryCartParam.hasOwnProperty('couponId')) {
      delete queryCartParam.couponId;
    }
    queryCartParam.couponCode = code
    // 查询购物车
    discountInit(queryCartParam, cart_info)
    // 费用明细
    totalTpl(cart_info)
    // code结果返回
    codeResults(code, true, $(this), -1)
  }
})
// code结果返回
function codeResults(code, isClick, $this, addFoldUp) {
  var tip = ''
  let history_list = []
  if (getStorage('history_list')) {
    history_list = JSON.parse(getStorage('history_list'))
  }
  if (cart_info.couponCodeMap.isExist == '1') {
    if (!cart_info.couponCodeMap.hasOwnProperty('difference')) {
      const isSaveCode = history_list.some(item => { return code == item.code })
      if (!isSaveCode) {
        $('.history_list span.active').removeClass('active')
        if (history_list.length > 7) {
          history_list = history_list.slice(0, -1)
          $('.history_list span:last-child').remove()
        }
        $('.history_list').prepend(`<span class='active' data-exclude='${addFoldUp}'>${code}</span>`)
        history_list.unshift({ code, addFoldUp })
        setStorage('history_list', JSON.stringify(history_list))
      } else {
        $('.history_list span').removeClass('active')
        $('.history_list span').each((index, item) => {
          if ($(item).text() == code) {
            $(item).addClass('active')
            return false
          }
        })
      }
    }
    // 存在判断是否有效
    if (cart_info.useDiscount.hasOwnProperty('couponCodeId')) {
      $('#discount_code--input').val(code)
      return false
    } else {
      $('.history_list span.active').removeClass('active')
      $('#discount_code--input').val('')
      if (cart_info.couponCodeMap.hasOwnProperty('activitiesRule')) {
        if (cart_info.couponCodeMap.difference < 0) {
          tip = 'The order amount does not meet the requirement of using the discount code.'
        } else {
          if (cart_info.couponCodeMap.activitiesRule == 1) {
            tip = `Sorry, You need to purchase ${getMoney(cart_info.couponCodeMap.difference)} to use this discount code.`
          } else if (cart_info.couponCodeMap.activitiesRule == 2) {
            tip = `Sorry, You need to purchase ${cart_info.couponCodeMap.difference} PCS more to use this discount code.`
          }
        }
        if (isClick) {
          const newHistoryList = history_list.filter(item => { return item.code != code })
          setStorage('history_list', JSON.stringify(newHistoryList))
          $this.remove()
        }
      } else {
        return false
      }
    }
  } else {
    $('#discount_code--input').val('')
    $('.history_list span').removeClass('active')
    if (!cart_info.goodsList.length) {
      tip = 'No effective product is in your Shopping Cart .'
    } else {
      tip = 'Sorry, invalid coupon code..'
      if (isClick) {
        const newHistoryList = history_list.filter(item => { return item.code != code })
        setStorage('history_list', JSON.stringify(newHistoryList))
        $this.remove()
      }
    }
  }
  layui.config({
    version: true,
    base: '/layui'
  }).use(['layer'], function () {
    layer = layui.layer
    layer.msg(tip, {
      id: 'tip_code',
      icon: 5,
      time: 2000
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
  res.goodsList.forEach(element => {
    let goodsListItem = {};
    // goodsListItem.skuId = element.skuId;
    goodsListItem.goodsId = element.goodsId;
    goodsListItem.afterDicountPrice = String(element.afterDicountPrice);
    goodsList.push(goodsListItem);
    return goodsList;
  });
  shippingCostParam.afterDicountTotal = String(res.afterDicountTotal);
  const $res = shippingInit(shippingCostParam)
  if ($res) {
    if ($res.list.length) {
      $res.list.sort(function (a, b) { return a.sort <= b.sort ? 1 : -1 });
      shippingTpl($res)
    } else {
      $('#shipping').html(' ')
      $('#shipping_price').text(getMoney('0'))
    }
    if ($res.gapMoney) {
      let gapMoney = `Spend <i class="total_price">${getMoney($res.gapMoney)}</i> more to enjoy FREE SHIPPING.`
      $('.cart_head span').html(gapMoney)
      $('.cart_head .buy_more--btn').show()
      $('#cart_box .cart_head').show()
    } else {
      $('.cart_head .buy_more--btn').hide()
      $('.cart_head span').text('')
      $('#cart_box .cart_head').hide()
    }
  } else {
    _res.shipping = 0;
  }

  // getToken(function () {
  //   $.req({
  //     url: '/api/v1/shipping/shippings',
  //     type: 'POST',
  //     data: JSON.stringify(shippingCostParam),
  //     dataType: 'json',
  //     contentType: 'application/json',
  //     async: false,
  //     success(res) {

  //     }
  //   });
  // });
}
// 运费
function shippingTpl(res) {
  console.log('运费===>', res)
  let getPromotionTpl = shipping_template.innerHTML,
    promotionView = document.getElementById('shipping');
  layui.use(['laytpl'], function () {
    let laytpl = layui.laytpl;
    laytpl(getPromotionTpl).render(res.list, function (html) {
      promotionView.innerHTML = html;
      minShipping(res.list)
      // 转化货币
      showMoney('#shipping')
      // 切换运费
      $('#shipping .shippingMethod-ul').on('click', 'li', function (e) {
        e.stopPropagation();
        e.preventDefault();
        $(this).siblings().find('.input-radio').removeProp('checked');
        $(this).addClass('active').siblings('li').removeClass('active');
        $(this).find('.input-radio').prop("checked", "checked");
        var $shippingMoney = $(this).find('.shippingCost').attr('data-money');
        // 获取邮费
        let $id = $(this).attr('data-id');

        // 存储运费进入session
        shippingSession($id, $shippingMoney, true)
      })

    });
  })
}
//获取运费最小值
function minShipping(res) {
  var minShippingMoney = res[0].money,
    minShippingId = res[0].id,
    shippingNum = 0;
  let isSave = false
  if (sessionStorage.getItem('shipping')) {
    let shipping = JSON.parse(sessionStorage.getItem('shipping'))
    isSave = res.some(item => {
      return shipping.shippingId == item.id
    })
  }
  if (isSave) {
    let shipping = JSON.parse(sessionStorage.getItem('shipping'))
    minShippingId = parseFloat(shipping.shippingId)
    minShippingMoney = shipping.shippingMoney
    $('#shipping .radio-ul').find(`[data-id=${minShippingId}]`).addClass('active').find('.input-radio').prop("checked", "checked")
  } else {
    // 不存在删除运费信息
    sessionStorage.removeItem('shipping')
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
  shippingSession(minShippingId, minShippingMoney, false)
  return minShippingId
}

// 将物流费用存入session并回显至下方价格明细
function shippingSession(shippingId, shippingMoney, isClick) {
  let shippingSession = {
    shippingId,
    shippingMoney
  }
  $('#shipping_price').text(getMoney(shippingMoney))
    .attr('data-o-money', getMoneyrate(shippingMoney));
  let total_price = $('#total_price').attr('data-o-money');
  let total = Math.round(parseFloat(total_price) * 100 + getMoneyrate(shippingMoney) * 100) / 100 //重新计算总价
  $('#total_price').text(JSON.parse(getStorage('currentRate')).symbol + total)
  $('#total_price').attr('data-d-money', total)
  // 储存运费
  cart_info.shippingId = shippingId
  cart_info.shippingMoney = shippingMoney
  if (isClick) {
    sessionStorage.setItem('shipping', JSON.stringify(shippingSession));
  }
}

//费用明细
function totalTpl($res) {
  const res = deepClone($res)
  let shopping_num = res.goodsCount
  localStorage.setItem('shopping_num', shopping_num)
  if(!getQueryVariable('isIframe')){
    if (shopping_num > 99) {
      $('.header .home_cart i').text('99+')
    } else {
      $('.header .home_cart i').text(shopping_num)
    }

    if ($("#cart-num").length) {
      $("#cart-num").text(shopping_num)
    }
  }
  res.symbol = JSON.parse(getStorage('currentRate')).symbol
  let productPrice = 0;
  if (res.goodsList.length) {
    res.goodsList.forEach(element => {
      productPrice = Math.round(productPrice * 100 + getMoneyrate(element.discountPrice) * 100 * element.quantity) / 100;
    });
  }
  res.productPrice = productPrice;
  res.total = Math.round(productPrice * 100 - getMoneyrate(res.promotionDiscount) * 100 - getMoneyrate(res.couponDiscount) * 100) / 100;
  if (res.total < 0) {
    res.total = 0;
  }
  let getPromotionTpl = total_template.innerHTML,
    promotionView = document.getElementById('totalList');
  layui.use(['laytpl'], function () {
    let laytpl = layui.laytpl;
    laytpl(getPromotionTpl).render(res, function (html) {
      promotionView.innerHTML = html;
      showMoney('#totalList')
      if (cart_info.goodsList.length || cart_info.invalidGoodsList.length) {
        //运费查询
        shippingCost(cart_info)
      } else {
        $('#shipping').html('')
      }
    });
  })
}
// 点击按钮，跳过购物车
$('[data-cart="cart_btn"]').click(function () {
  jump_cart(queryCartParam)
})
function jump_cart($param) {
  // 查询购物车
  $res = calculate($param, cartInfo)
  switch ($res.code) {
    case 20000:
      // 全场活动失效
      delete $param.activityId
      jump_cart($param)
      break;
    case 20001:
      // 优惠券失效
      delete $param.couponId
      jump_cart($param)
      break;
    case 0:
      // 正常时间
      cartInfoGoodsList($res)
      break;
  }
}
function cartInfoGoodsList(res) {
  if (res.data.invalidGoodsList.length && !res.data.goodsList.length) {
    let tip = 'Your shopping cart was expired, please select a new product.'
    layui.config({
      version: true,
      base: '/layui'
    }).use(['layer'], function () {
      layer = layui.layer
      layer.confirm(tip, {
        id: 'tip_code',
        icon: 5,
        title: '',
        closeBtn: 0,
        skin: 'tip-class',
        btn: ['YES'], //可以无限个按钮
        btn1: function (index, layero) {
          layer.close(index);
          var pathname = window.location.pathname;
          let isSave = false
          if (pathname.indexOf("productDetail") != -1) {
            let goodsId = window.location.pathname.split('_')[1].split('.html')[0];
            if (res.data.invalidGoodsList.length) {
              isSave = res.data.invalidGoodsList.some(item => {
                return item.goodsId == goodsId
              })
            }
          }
          isSave ? window.location.href = '/productList.html' : location.reload();
        }
      })
    });
  } else {
    let money = $('#total_price').attr('data-o-money');
    if (res.data.invalidGoodsList.length) {
      localStorage.setItem('invalidGoodsList', JSON.stringify(res.data.invalidGoodsList))
    }
    if (money !== '0') {
      // 存储查询购物车条件,成功后去除券码
      localStorage.setItem('queryCartParam', JSON.stringify(res.data.useDiscount))
      window.location.href = "/information.html?saveType=1";
    } else {
      alertTxt('Your request could not be performed due to incorrect and failed business verification. The money amount must be not less than zero.')
    }
  }
}
// 点击下拉打开
$(document).on('click', '[data-action="toggle-collapsible"]:not([disabled])', function (e) {
  $(this).next('.cart-section--content').slideToggle(300)
  $(this).toggleClass('active')
})
// 备注点击
$('#note button').click(function () {
  $(this).next('.cart-recap__note-inner').slideToggle(300)
  $(this).toggleClass('active')
})

//删除购物车列表
$('.cart_list').on('click', '.cart_del', function () {
  $(this).parent('li').remove()
  let $cart_quantity = $(this).parent('li').find('.quantity-selector__value')
  if ($(this).closest('li').hasClass('expired')) {
    valueChange($cart_quantity, false, true, true)
  } else {
    valueChange($cart_quantity, false, true)
  }

})
$(document).on('click', '.quantity-selector__button', function () {
  const $cart_quantity = $(this).siblings('.quantity-selector__value')
  let cart_quantity_val = parseInt($cart_quantity.val())
  const attr_btn = $(this).attr('data-action')
  if (attr_btn == 'increase-quantity') {
    //购物车增加
    // 如果数量为999,则数量不增
    if (cart_quantity_val > 998) {
      $cart_quantity.val('999')
    } else {
      cart_quantity_val++
      $cart_quantity.val(cart_quantity_val)
      valueChange($cart_quantity, true, false)
    }
    // pinterest 埋点数据 ~~~~~Start~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    var pinterestSetData = {
      pinterestYOUR_TAG_ID: '',
      pinterestEventType: 'AddToCart',
      pinterestData: {
        value: $(this).parent('.quantity-selector').siblings('.cart_price').find('.cart_price--discountPrice').data('money') || 0,
        order_quantity: 1,
      }
    }
    pinterestFn(pinterestSetData)
    // pinterest 埋点数据 ~~~~~End~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  } else if (attr_btn == 'decrease-quantity') {
    //购物车减少
    const $cart_quantity = $(this).siblings('.quantity-selector__value')
    let cart_quantity_val = $cart_quantity.val()
    // 如果数量为999,则数量不增
    if (cart_quantity_val < 2) {
      $cart_quantity.closest('li').remove()
      valueChange($cart_quantity, false, true)
    } else {
      cart_quantity_val--
      $cart_quantity.val(cart_quantity_val)
      valueChange($cart_quantity, false, false)
    }

  }
})
//修改购物车数量
$(document).on('change', '.quantity-selector__value', function () {
  let cart_quantity_val = $(this).val()
  if (!isInteger(cart_quantity_val) || parseInt(cart_quantity_val) === 0) {
    $(this).val('1')
  } else if (parseInt(cart_quantity_val) > 999) {
    $(this).val('999')
  }
  valueChange($(this))
})

// 数量发生变化时 发生的事件
function valueChange(item, isAdd, isDel, isInvalid) {
  var speType = item.data('id');
  let dataId = item.attr('data-line-id');
  const goodsId = item.closest('li').attr('data-goodsId');
  const goodsVersion = item.closest('li').attr('data-goodsVersion');
  // 更新购物车参数
  let updata = {
    "skuId": parseInt(dataId),
    "quantity": isDel ? 0 : parseInt(item.val()),
    "customVal": "",
    goodsId,
    goodsVersion,
    speType
  };

  cartInfo.cartList.forEach((element, index) => {
    if (element.skuId === parseInt(dataId) && item.closest('li').attr('data-customVal') === $.base64.encode(element.customVal)) {
      updata.customVal = element.customVal;
      if (updata.quantity <= 0) {
        cartInfo.cartList.splice(index, 1)
      } else {
        element.quantity = updata.quantity
      }
    }
  });

  // 更新购物车接口
  updateCart(item, updata, isAdd, item.closest('li'));
}
// 更新购物车
function updateCart(item, data, isAdd, $item) {
  getToken(function () {
    $.req({
      url: '/api/v1/cart/cart',
      type: 'PUT',
      data: JSON.stringify(data),
      dataType: 'json',
      contentType: 'application/json',
      success(res) {
        if (res.code === 0) {
          console.log('购物车数据=》', cartInfo)
          if (!cartInfo.cartList.length) {
            let gapMoney = `You have <i>0 item</i> in your cart.`
            $('.cart_head span').html(gapMoney)
            $('#cart').hide()
            $('.cartEmpty').show()
          }
          cart_info = calculate(queryCartParam, cartInfo).data
          if ($item.attr('data-wholesale') == 1) {
            const goodsId = $item.attr('data-goodsid')
            cart_info.goodsList.forEach(item => {
              if (goodsId == item.goodsId) {
                if (item.speType != 0 && item.speType != 1) {
                  $item = $("#cart_list [data-customval='" + $.base64.encode(item.customVal) + "']")
                } else {
                  $item = $("#cart_list li[data-sku='" + item.skuId + "']")
                }
                if (item.discount != 10) {
                  //<span class="cart_price--compare" data-money="{{item.sellingPrice}}"></span>
                  if ($item.find('.cart_price span').length == 1) {
                    $item.find('.cart_price--discountPrice').before(`<span class="cart_price--compare" data-money="${item.sellingPrice}">${getMoney(item.sellingPrice)}</span>`)
                  } else {
                    $item.find('.cart_price--compare').attr('data-money', item.sellingPrice).html(getMoney(item.sellingPrice))
                  }
                  //购物车页面
                  if ($('#cart_box').length) {
                    const money = Math.round((getMoneyrate(item.sellingPrice) - getMoneyrate(item.discountPrice)) * item.quantity * 100) / 100
                    $item.find('.cart_price p').addClass('show')
                    $item.find('.cart_price p .discountPrice').html(currentRate.symbol + money)
                  }

                } else {
                  if ($item.find('.cart_price span').length == 2) {
                    $item.find('.cart_price--compare').remove()
                  }
                  if ($('#cart_box').length) {
                    $item.find('.cart_price p').removeClass('show')
                  }

                }
                $item.find('.cart_price--discountPrice').attr('data-money', item.discountPrice).html(getMoney(item.discountPrice))
              }
            })
          }
          // 判断全场活动
          const promotionList = CONFIGDATA.activities.find(item => {
            return contrastTime(true, item.end, item.start) && item.status == 1
          })
          const isEffectiveSave = isEffectiveFun(cart_info, promotionList)
          if (isEffectiveSave) {
            $('#promotion').removeClass('hide')
          } else {
            $('#promotion').addClass('hide')
          }
          // 优惠券
          couponTpl(cart_info)
          // 费用明细
          totalTpl(cart_info)
          // 优惠券
          couponTpl(cart_info)
          // getCartInfo(queryCartParam)
          if (queryCartParam.hasOwnProperty('couponCode') && !cart_info.useDiscount.hasOwnProperty('couponCodeId')) {
            $('.history_list span').removeClass('active')
            $('#discount_code--input').val('')
            delete queryCartParam.couponCode;
          }

          // 添加购物车埋点
          if (isAdd) {
            let productData = [], cartList = {};
            cartList.spuId = parseInt(item.parents('li').attr('data-goodsid')) || ''
            cartList.spu = item.parents('li').find('.cart_product--name').text() || '';
            cartList.quantity = 1;
            cartList.spuPrice = Number($('.allPirce .c_price').attr('base-price') || 0);
            cartList.sku = item.closest('li').attr('data-skuname') || '';
            cartList.skuPrice = Number(item.parents('li').find('.cart_price--discountPrice').attr('data-money'));
            cartList.spuImg = item.parents('li').find('.cart_img').attr('data-img') || ''
            productData.push(cartList)
            sendAnalyze('cart', {}, productData);
            let $facebookId_val = $('#facebookId').val();
            if ($facebookId_val && $facebookId_val != '' && Object.prototype.toString.call($facebookId_val).slice(8, -1) != 'Null') {
              const eventID = getRandomString(5)
              fbq('track', 'AddToCart', { eventID });

              // facebook api数据转化
              const custom_data = {
                "value": Number(item.closest('li').find('.cart_price--discountPrice').text().substr(1)),
                "currency": JSON.parse(getStorage('currentRate')).currency,
                "content_ids": item.closest('li').attr('data-goodsid'),
                "content_type": "product"
              }
              var data = facebookApiParam(custom_data, 'AddToCart', eventID)
              const facebookIdArr = $facebookId_val.split(',')
              facebookIdArr.forEach(item => {
                facebookApi(item, data)
              })
            }
            // tiktok像素埋点
            let $Tiktok_val = $('#Tiktok').val();
            let $tiktok_status = $('#Tiktok').attr('data-show')
            if ($Tiktok_val && $Tiktok_val != '' && Object.prototype.toString.call($Tiktok_val).slice(8, -1) != 'Null' && $tiktok_status == 'true') {
              ttq.track('AddToCart', {
                content_id: item.closest('li').attr('data-goodsid') || '',
                content_type: 'product',
                content_name: item.closest('li').attr('data-skuname'),
                quantity: 1,
                price: Number(item.closest('li').find('.cart_price--discountPrice').attr('data-money')),
                value: Number(item.closest('li').find('.cart_price--discountPrice').attr('data-money')),
                currency: 'USD',
              })
            }
            //ga 像素埋点
            const $googleId = $('#googleId').val()
            if ($googleId && $googleId != '' && Object.prototype.toString.call($googleId).slice(8, -1) != 'Null') {
              ga('ec:addProduct', {
                'id': item.closest('li').attr('data-goodsid'),
                'name': item.closest('li').find('.cart_product--name').text(),
                'price': Number(item.closest('li').find('.cart_price--discountPrice').attr('data-money')),
                'quantity': 1
              });
              ga('ec:setAction', 'add');
              ga('send', 'event', 'UX', 'click', 'add to cart');
            }
          }

        } else if (res.code == 20016) {
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
        } else if (res.code == 20015) {
          layer.open({
            closeBtn: 0,
            title: false,
            content: 'One product has been removed, please select other products.',
            btn: ['confirm'],
            yes: function (index, layero) {
              layer.close(index); //如果设定了yes回调，需进行手工关闭
              window.location.href = '/'
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

// 判断是否为正整数
function isInteger(obj) {
  return Math.abs(parseInt(obj, 10)) == obj
}


function showMoney($id) {
  $($id + " [data-money]").each(function (index, item) {
    let $price = Number($(item).attr('data-money'));
    $(item).html(getMoney($price));
  })
}

function paypalBase() {
  const clientId = $('#paypal_clientId').attr('data-clientId')
  if (clientId) {
    const setmeal = JSON.parse(getStorage('currentRate')).currency
    var jsStr = `?client-id=${clientId}&currency=${setmeal}`;
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
}
function setPaypal() {
  // 订单参数
  var orderParams = {};
  orderParams.saveType = '1';
  orderParams.payMethod = 'paypal';
  getToken(function () {
    paypal.Buttons({
      // Call your server to set up the transaction
      createOrder: function (data, actions) {
        var orderParams = {
          saveType: '1',
          payMethod: 'paypal',
          taxRatePrice: 0,
          currency: totalRate.currency,
          preParam: cart_info.useDiscount,
          ordersOrigin: localStorage.getItem('sourceurl'),
          promotionLogo: getCookie('promotionLogo'),
          totalShippingPrice: getMoneyRateNum(cart_info.shippingMoney) || 0,
          shippingsName: $(`#shipping li[data-id=${cart_info.shippingId}]`).attr('data-name') || '',
          rate: Number(totalRate.rate),
          cart: totalCartList(cart_info)
        };
        // 像素埋点
        var cart = [];
        var tiktokArr = []
        var goodsData = [];
        cart_info.goodsList.forEach(element => {
          let edataList = {};
          edataList.spuId = element.goodsId
          edataList.spu = element.goodsName;
          edataList.quantity = element.quantity;
          edataList.spuPrice = element.discountPrice;
          edataList.sku = element.sku;
          edataList.skuPrice = element.discountPrice;
          edataList.spuImg = element.mainImg
          goodsData.push(edataList)

          const cartList = {};
          cartList.sku = element.sku || '';
          cartList.type = '';
          cartList.product = element.goodsName || '';
          cartList.quantity = element.quantity || '';
          cart.push(cartList);
          const tiktokList = {
            content_id: String(element.goodsId),
            content_type: 'product',
            content_name: element.sku || '',
            quantity: Number(element.quantity),
            price: Number(element.discountPrice),
          }
          tiktokArr.push(tiktokList)
        });
        var edata = {
          orderId: '',
          quantify: cart_info.goodsCount,
          sales: Math.round(cart_info.afterDicountTotal * 100 + parseFloat(cart_info.shippingMoney || 0) * 100) / 100,
          discount: Math.round(cart_info.promotionDiscount * 100 + parseFloat(cart_info.couponDiscount || 0) * 100) / 100,
          shipping: parseFloat(cart_info.shippingMoney) || 0,
        }
        sendAnalyze('payment', edata, goodsData);
        let TiktokParam = {
          contents: tiktokArr,
          value: Math.round(cart_info.afterDicountTotal * 100 + parseFloat(cart_info.shippingMoney || 0) * 100) / 100,
          currency: 'USD',
        }
        localStorage.setItem('TiktokParam', JSON.stringify(TiktokParam));
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
            "value": cart_info.total,
            "currency": JSON.parse(getStorage('currentRate')).currency,
            "content_ids": content_ids,
            "content_type": "product"
          }
          var data = facebookApiParam(custom_data, 'InitiateCheckout', eventID)
          const facebookIdArr = $facebookId_val.split(',')
          facebookIdArr.forEach(item => {
            facebookApi(item, data)
          })
        }
        // tiktok像素埋点
        let $Tiktok_val = $('#Tiktok').val();
        let $tiktok_status = $('#Tiktok').attr('data-show')
        if ($Tiktok_val && $Tiktok_val != '' && Object.prototype.toString.call($Tiktok_val).slice(8, -1) != 'Null' && $tiktok_status == 'true') {
          ttq.track('Checkout', TiktokParam)
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
        localStorage.setItem('productData', JSON.stringify(cart_info));
        // 存储查询购物车条件,成功后去除券码
        localStorage.setItem('queryCartParam', JSON.stringify(cart_info.useDiscount))
        return fetch('/vshop-site/api/v1/pre/orders/orders', {
          method: 'post',
          body: JSON.stringify(orderParams),
          headers: {
            "Authorization": 'Bearer' + getStorage('localstorageId')
          }
        }).then(function (res) {
          console.log("123-->", res);
          return res.json();
        }).then(function (orderData) {
          if (orderData.code != 0) {
            if (orderData.msg === 'The total amount is zero') {
              let tip = 'Your request could not be performed due to incorrect and failed business verification. The money amount must be not less than zero.';
              alertTxt(tip)
            } else {
              alertTxt(orderData.msg)
            }
          } else {
            return orderData.data.order_number;
          }
        });
      },
      // Call your server to finalize the transaction
      onApprove: function (data, actions) {
        $('html').append('<div class="paymentLoading"><div><img src="../assets/wap/images/icon/loading.gif" alt=""><p>Please wait a moment before finishing the payment.....</p><div></div>')
        return fetch('/vshop-third/api/v1/third/' + data.orderID + '/capture', {
          method: 'post',
          headers: {
            "Authorization": 'Bearer' + getStorage('localstorageId')
          }
        }).then(function (res) {
          console.log("res--", res);
          return res.json();
        }).then(function (orderData) {
          console.log(orderData);
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
            return alertTxt(msg)
          }
          // Show a success message to the buyer
          let money = $('#total_price').attr('data-o-money');
          if (orderData.statusCode === 201 && orderData.status === "COMPLETED") {
            window.location.href = `/payment-results.html?status=1&transcationId=${data.orderID}&currency=${totalRate.currency}&amount=${money}`;
          } else {
            window.location.href = `/payment-results.html?status=0`;
          }
        });
      }
    }).render('#paypal-button-container');
  });
}

// paypal预加载遮盖
function closePlaceholder() {
  let r = "dynamic-checkout--loading";
  var e = document.querySelector("." + r),
    t = document.querySelector(".dynamic-checkout__buttons");
  null !== e && null !== t && e.classList.remove(r)
}
//屏幕变化
var $window_height = window.innerHeight
$(window).resize(function () {
  let $height = $window_height > window.innerHeight ? $window_height : window.innerHeight;
  cartHeight($height);
});
function cartHeight($height) {
  // 计算头部高度
  // let activity_h = parseFloat($('.activity').height()) || 0
  // let header_h = parseFloat($('.header_wrap').height()) + activity_h
  let header_h = parseFloat($('.header-warp').height())
  // 购物车开关
  let cart_h = $height - header_h
  $('.cart_w').height(cart_h)
  $('.cart_w').css('top', header_h)
};
// 打开购物车
$(document).on('click', '.home_cart:not([disabled])', function () {
  window.scrollTo(0, 0);
  let $height = $window_height > window.innerHeight ? $window_height : window.innerHeight;
  cartHeight($height);
  // 查询购物车
  $('.cart_w').slideDown(300).addClass('active')
  $('html').attr('data-overflow', 'true')
  getCartInfo(queryCartParam, true);
})
// 关闭购物车
$(document).on('click', '.cart_icon--close,[data-cart="close_cart"]', function () {
  $('.cart_w').slideUp(300).removeClass('active')
  $('html').removeAttr('data-overflow', 'true')
})

$(function () {
  var result = [];
  // let version_rec = new Date().getTime()
  // $.getJSON("../data/detail.json?version=" + version_rec, function (data) {
  var data = deepClone(DETAILDATA)
  var data_length = data.length > 100 ? 100 : data.length;
  var ranNum = data_length > 12 ? 12 : data_length;
  for (var i = 0; i < ranNum; i++) {
    var ran = Math.floor(Math.random() * (data_length - i));
    result.push(data[ran]);
    data[ran] = data[data_length - i - 1];
  };
  layui.use(['laytpl'], function () {
    let laytpl = layui.laytpl;
    let getTpl = recommend_cart_template.innerHTML,
      view = document.getElementById('recommend_cart_layui_swiper');
    laytpl(getTpl).render(result, function (html) {
      view.innerHTML = html;
      // newProducts 下的轮播图
      var recommend_cart_layui_swiper = new Swiper('#recommend_cart_layui_swiper', {
        observer: true,//修改swiper自己或子元素时，自动初始化swiper
        observeParents: true,//修改swiper的父元素时，自动初始化swiper
        slidesPerView: 'auto',
        spaceBetween: 10,
      })
      changeImg()
      recommendLayuiSwiper();
    });
    function recommendLayuiSwiper() {

      let allprice = $("#recommend_cart_layui_swiper [p-price]")
      allprice.each(function (index) {
        $(this).text(getMoney($(this).attr('p-price')))
      });
    }
    let price = $('#recommend_cart_layui_swiper .swiper-slide')
    price.each(function (index, item) {
      let $defaultPrice = $(item).find('.price').attr('data-price'),
        $originalPrice = $(item).find('.price').attr('data-originalPrice');
      relationCount($(item), $defaultPrice, $originalPrice)
    });
    /* 计算价格 */
    function relationCount($this, $defaultPrice, $originalPrice) {
      if ($originalPrice && $originalPrice != '' && Number($originalPrice) > Number($defaultPrice) && Object.prototype.toString.call($originalPrice).slice(8, -1) != 'Null') {
        $this.find('.now_price').removeClass('hide').html(getMoney($defaultPrice)).addClass('main_color');
        $this.find('.old_price').removeClass('hide').html(getMoney($originalPrice));
        $this.find('.off i').html(parseFloat(Math.floor((1 - Number($defaultPrice) / Number($originalPrice)) * 100)) || 1);
        $this.find('[data-discount]').removeClass('hide');
      } else {
        $this.find('.now_price').html(getMoney($defaultPrice))
      }
    }
  })

})


// 虚拟键盘输入框挡住input
if (navigator.userAgent.toLowerCase().match(/iPhone\sOS/i) !== "iphone os") {
  const innerHeight = window.innerHeight;
  window.addEventListener('resize', () => {
    const newInnerHeight = window.innerHeight;
    if (innerHeight > newInnerHeight) {
      // 键盘弹出事件处理
      $('#order-cart_checkout').css('position', 'static')
      $('.billing-address').css('margin-bottom', 0)
    } else {
      // 键盘收起事件处理
      $('#cart_checkout').css('position', 'fixed')
      $('.billing-address').css('margin-bottom', $('#order-info').outerHeight())
    }
  });
}