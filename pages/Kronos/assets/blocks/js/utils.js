/**
 * 切换汇率,返回当前汇率下的价格和单位
 * @param {*params} money
 */
function returnPrice(money, type = 0, mainCurreny) {
  if (!money) return
  var currentRate =
    mainCurreny || JSON.parse(localStorage.getItem('currentRate'))
  if (currentRate && currentRate != '') {
    var totalMoney = currentRate.rate * money
    var result = parseFloat(totalMoney)
    result = Math.round(totalMoney * 100) / 100
    var s_x = result.toString()
    if (currentRate.currency !== 'JPY' && currentRate.currency !== 'TWD') {
      var pos_decimal = s_x.indexOf('.')
      if (pos_decimal < 0 && type === 2) {
        pos_decimal = s_x.length
        s_x += '.'
      }
      while (s_x.length <= pos_decimal + 2 && pos_decimal != -1) {
        s_x += '0'
      }
    } else {
      s_x = Math.round(s_x)
    }
    return currentRate.symbol + s_x
  } else {
    return currentRate.symbol + money
  }
}
/**
 * 将树形数据转成一维数组
 * @param {*params} nodes
 * @returns
 */
function treeToArray(nodes) {
  var r = []
  if (Array.isArray(nodes)) {
    for (var i = 0, l = nodes.length; i < l; i++) {
      r.push(nodes[i]) // 取每项数据放入一个新数组
      if (
        Array.isArray(nodes[i]['childList']) &&
        nodes[i]['childList'].length > 0
      )
        // 若存在childList则递归调用，把数据拼接到新数组中，并且删除该childList
        r = r.concat(treeToArray(nodes[i]['childList']))
    }
  }
  return r
}
/**
 * 定义compare函数，prop是对象的某一个属性，type是排序规则倒序和正序
 * @param {*} prop 排序字段
 * @param {*} type 排序类型 asc 升序 desc降序
 * @returns
 */
function compare(prop, type) {
  return function (obj1, obj2) {
    var val1 =
      typeof obj1[prop] === 'string'
        ? new Date(obj1[prop]).getTime()
        : obj1[prop]
    var val2 =
      typeof obj2[prop] === 'string'
        ? new Date(obj2[prop]).getTime()
        : obj2[prop]
    if (type === 'asc') {
      if (val1 < val2) {
        return -1
      } else if (val1 > val2) {
        return 1
      } else {
        return 0
      }
    } else {
      if (val1 > val2) {
        return -1
      } else if (val1 < val2) {
        return 1
      } else {
        return 0
      }
    }
  }
}
/**
 * 切割数组,分割成一定长度的数组，返回的是一个数组集合
 * @param {*} array
 * @param {*} size
 * @returns
 */
function chunkArr(array, size) {
  //获取数组的长度，如果你传入的不是数组，那么获取到的就是undefined
  const length = array.length
  //判断不是数组，或者size没有设置，size小于1，就返回空数组
  if (!length || !size || size < 1) {
    return []
  }
  //核心部分
  let index = 0 //用来表示切割元素的范围start
  let resIndex = 0 //用来递增表示输出数组的下标

  //根据length和size算出输出数组的长度，并且创建它。
  let result = new Array(Math.ceil(length / size))
  //进行循环
  while (index < length) {
    //循环过程中设置result[0]和result[1]的值。该值根据array.slice切割得到。
    result[resIndex++] = array.slice(index, (index += size))
  }
  //输出新数组
  return result
}
//判断浏览内核Safari返回.jpg 其他返回.webp
function returnSuffixUrl(url) {
  var reg =
    /^((ht|f)tps?):\/\/([\w-]+(\.[\w-]+)*\/?)+(\?([\w\-\.,@?^=%&:\/~\+#]*)+)?$/
  if (!reg.test(url)) {
    if ($('#NODE_ENV').attr('value') === 'build') {
      url = 'https://vshop001.oss-accelerate.aliyuncs.com/' + url
    } else {
      url = 'https://vshoptest.oss-cn-hangzhou.aliyuncs.com/' + url
    }
  }
  let userAgent = navigator.userAgent
  let result = /Safari/.test(userAgent) && !/Chrome/.test(userAgent)
  if (url.indexOf('cdn.shopifycdn.net') != -1) {
    return url
  } else if (
    url.indexOf('vshop') != -1 &&
    (url.lastIndexOf('.jpg') != -1 ||
      url.lastIndexOf('.webp') != -1 ||
      url.lastIndexOf('.JPG') != -1)
  ) {
    let len =
      url.lastIndexOf('.jpg') != -1
        ? url.lastIndexOf('.jpg')
        : '' || url.lastIndexOf('.webp') != -1
          ? url.lastIndexOf('.webp')
          : '' || url.lastIndexOf('.JPG') != -1
            ? url.lastIndexOf('.JPG')
            : ''
    let newUrl = url.substr(0, len)
    if (result) {
      return newUrl + '.jpg'
    } else {
      return newUrl + '.webp'
    }
  } else {
    return url
  }
}
/**
 *
 * @param {*} data 商品数据源
 * @param {*} keyword 关键词
 */
function filterData(data, keyword) {
  var reg = new RegExp(
    keyword
      .trim()
      .replace(/[($&*%#@)\n]/g, '')
      .toLowerCase()
  )
  return (newData = data.filter((item) => {
    // 返回匹配到热词的数据 或者 将热词去掉所有空格和商品名称去掉所有空格比较
    return (
      reg.test(item.goodsName.toLowerCase().replace(/[($&*%#@)\n]/g, '')) ||
      keyword.replace(/\s*/g, '') === item.goodsName.replace(/\s*/g, '')
    )
  }))
}
/**
 * 用户切换汇率
 */
function switchRate(mainCurreny) {
  var allprice = $('[p-price]')
  for (let i = 0; i < allprice.length; i++) {
    var price = returnPrice($(allprice[i]).attr('p-price'), 0, mainCurreny)
    $(allprice[i]).text(price)
    // if ($(allprice[i]).attr('type') == 'coupon') {
    //   $(allprice[i]).text(price.split('.')[0])
    // } else {
    //   $(allprice[i]).text(price)
    // }
  }
}
/**
 * 页面跳转、所有页面跳转需要携带标识符promotionLogo
 * @param {*} url // 跳转地址
 */
function routerJump(href, linkStatus) {
  if (href == '' || linkStatus == 0) return
  var promotionLogo = getCookie('promotionLogo')
  if (promotionLogo) {
    window.location.href = href + '?promotionLogo=' + promotionLogo
  } else {
    window.location.href = href
  }
}
/**
 * 领取优惠券
 * @param {*} couponIds 有效优惠券的Id组合，用逗号隔开
 * @param {*} callback 回调函数
 */
var flags = 1
function getCoupon(couponIds, callback) {
  flags++
  if (flags % 2 == 0) {
    getToken(function () {
      $.req({
        url: '/api/v1/goods/coupon',
        type: 'get',
        data: {
          couponId: couponIds,
          type: '1',
        },
        success(res) {
          flags = 1
          callback(res)
        },
      })
    })
  }
}
/**
 * 校验有效期
 * @param {*} start
 * @param {*} end
 * @returns
 */
function IsPC() {
  var userAgentInfo = navigator.userAgent;
  var Agents = ["Android", "iPhone",
    "SymbianOS", "Windows Phone",
    "iPad", "iPod"];
  var flag = true;
  for (var v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = false;
      break;
    }
  }
  return flag;
}
var browser = {
  versions: function () {
    const u = navigator.userAgent;
    return {
      trident: u.indexOf('Trident') > -1, //IE内核
      presto: u.indexOf('Presto') > -1, //opera内核
      webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
      gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,//火狐内核
      mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
      android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, //android终端
      iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
      iPad: u.indexOf('iPad') > -1, //是否iPad
      iosApp: u.indexOf('Safari') == -1, //是否web应用程序
      weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
      qq: u.match(/\sQQ/i) == " qq" //是否QQ
    };
  }(),
  language: (navigator.browserLanguage || navigator.language).toLowerCase()
}
function isEffective(start, end) {
  if (end == null || !end) {
    end = "9999-99-99 00:00:00"
  }
  var now = new Date().getTime()
  if (browser.versions.ios && !IsPC()) {
    // ios 手机 只认 2021/06/28 这种时间格式
    var s = new Date(start.replace(/-/g, '/')).getTime()
    var e = new Date(end.replace(/-/g, '/')).getTime()
  } else {
    // 安卓手机/window电脑/IOS电脑 识别 2021-06-28 这种日期格式
    var s = new Date(start).getTime()
    var e = new Date(end).getTime()
  }
  if ((now >= s && now <= e) || (start && !end)) {
    return true
  }
  return false
}
/**
 * 邮箱订阅
 *  @param {*} type 1: 积木订阅；2：底部订阅
 *  @param {*} e 是否触发回车事件
 */
function submitSubscribe(e, type) {
  console.log(type)
  if (e) {
    var evt = window.event || e
    if (evt.keyCode !== 13) {
      return
    }
  }
  var email = type === 1 ? $('#emailInput').val() : $('#footer-subscribe').val()
  var reg =
    /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/
  if (reg.test(email)) {
    $.req({
      url: '/api/v1/user/subscribe',
      type: 'post',
      contentType: 'application/json;charset=UTF-8',
      data: JSON.stringify({
        email: email,
      }),
      success(res) {
        if (res.code === 0) {
          if (type === 1) {
            $('#subscribeCopntent').hide()
            $('#subscribeAccept').show()
          } else {
            alert(
              'Thanks for Subscribing! We will send special offers and news to you shortly..'
            )
          }
        } else {
          alert(res.msg)
        }
      },
    })
  } else {
    alert('Please Enter a valid email address address.')
  }
}

/**
 * 获取url的参数值
 */
function getQueryVariable(variable) {
  var query = decodeURIComponent(window.location.search.substr(1))
  var vars = query.split('&')
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=')
    if (pair[0] === variable) {
      return pair[1].replace(/^/g, '%')
    }
  }
  return ''
}
// function getQueryVariable(key){
// 	var param="";
// 	var valus = new RegExp(key + "=(([^\\s&(#!)])+)").exec(window.location.href.replace(/%20/g, ' '));
// 	if(valus && valus.length>=2){
// 		param=valus[1];
// 	}
// 	return param;
// }
