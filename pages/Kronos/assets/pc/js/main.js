// 支持COD货到包邮的国家列表
var CODCountry = [
  {
    countryCode: 'PHL',
    countryKey: 'Philippines',
    countryName: '菲律宾',
  },
  {
    countryCode: 'THA',
    countryKey: 'Thailand',
    countryName: '泰国',
  },
  {
    countryCode: 'IDN',
    countryKey: 'Indonesia',
    countryName: '印度尼西亚',
  },
  {
    countryCode: 'SGP',
    countryKey: 'Singapore',
    countryName: '新加坡',
  },
  {
    countryCode: 'VNM',
    countryKey: 'Vietnam',
    countryName: '越南',
  },
  {
    countryCode: 'KHM',
    countryKey: 'Cambodia',
    countryName: '柬埔寨',
  },
  {
    countryCode: 'JPN',
    countryKey: 'Japan',
    countryName: '日本',
  },
]
var $currency
var version = new Date().getTime()
// var $configData;
$currency = new Currency()
function Currency() {
  var obj = localStorage.getItem('currentRate')
  if (!obj) {
    // 设置货币及汇率
    // $.ajaxSettings.async = false; // 同步执行
    // $.getJSON("../data/config.json?version=" + version, function (data) {
    let currency = CONFIGDATA.currency
    for (let i = 0; i < currency.length; i++) {
      if (currency[i].mainCurrency === 1) {
        localStorage.setItem('currentRate', JSON.stringify(currency[i]))
        break
      }
    }
    // })
  }
  // 设置头部货币样式
  this.changeCurrency = function () {
    let currentRate = JSON.parse(localStorage.getItem('currentRate'))
    $('.currency .active-pic').attr('src', currentRate.pic)
    $('.currency .active-cur').text(currentRate.currency)
  }
  // 返回汇率下的价格
  this.getPrice = function (money) {
    let currentRate = JSON.parse(localStorage.getItem('currentRate'))
    if (currentRate && currentRate != '') {
      let totalMoney = currentRate.rate * money
      let result = parseFloat(totalMoney)
      result = Math.round(totalMoney * 100) / 100
      let s_x = result.toString()
      if (currentRate.currency !== 'JPY' && currentRate.currency !== 'TWD') {
        let pos_decimal = s_x.indexOf('.')
        if (pos_decimal < 0) {
          pos_decimal = s_x.length
          s_x += '.'
        }
        while (s_x.length <= pos_decimal + 2) {
          s_x += '0'
        }
      } else {
        s_x = Math.round(s_x)
      }
      return currentRate.symbol + Number(s_x)
    } else {
      return currentRate.symbol + Number(money)
    }
  }
  // 根据汇率改变页面中的价格
  this.changePrice = function (isRound = false) {
    if (isRound) {
      var cPrice = $('[c-price]')
      for (let i = 0; i < cPrice.length; i++) {
        $(cPrice[i]).text(
          this.getPrice($(cPrice[i]).attr('c-price')).split('.')[0]
        )
      }
    } else {
      var allprice = $('[p-price]')
      for (let i = 0; i < allprice.length; i++) {
        $(allprice[i]).text(this.getPrice($(allprice[i]).attr('p-price')))
      }
    }
  }
}

function getSpaceMoney(money) {
  let currentRate = JSON.parse(getStorage('currentRate'))
  if (currentRate && currentRate != '') {
    let totalMoney = currentRate.rate * money
    let result = parseFloat(totalMoney)
    result = Math.round(totalMoney * 100) / 100
    let s_x = result.toString()
    if (currentRate.currency !== 'JPY' && currentRate.currency !== 'TWD') {
      let pos_decimal = s_x.indexOf('.')
      if (pos_decimal < 0) {
        pos_decimal = s_x.length
        s_x += '.'
      }
      while (s_x.length <= pos_decimal + 2) {
        s_x += '0'
      }
    } else {
      s_x = Math.round(s_x)
    }
    return currentRate.symbol + ' ' + Number(s_x)
  } else {
    return currentRate.symbol + ' ' + Number(money)
  }
}

var storage = window.localStorage
var sessionStorage = window.sessionStorage
var preUrl = ''
var $webUrl = window.location.href
var shopId = $('#shopId').val(),
  $pathname = window.location.pathname.split('/')

var $btype = 1
if (
  getStorage('localstorageId') &&
  Object.prototype.toString.call(getStorage('localstorageId')).slice(8, -1) !=
  'Null'
) {
  $btype = 0
}

// 网站标题
function setDocumentTitle() {
  let $website = $('#shopName').val(),
    $urlname = '',
    Url = ''
  if (
    $pathname[$pathname.length - 1] &&
    $pathname[$pathname.length - 1].indexOf('.html')
  ) {
    Url = $pathname[$pathname.length - 1].split('.html')[0]
    if (Url == 'index') {
      $urlname = $website
    } else if (Url == 'cart') {
      $urlname = 'Shopping Cart - ' + $website
    } else if (Url == 'collections') {
      $urlname = 'collections - ' + $website
    } else if (Url == 'information') {
      $urlname = 'Checkout - ' + $website
    } else if (Url == 'logistics') {
      $urlname = 'Track logistics - ' + $website
    } else if (Url == 'orderSearch') {
      $urlname = 'Track my order - ' + $website
    } else if (Url == 'orderDetail') {
      $urlname = 'Track order information - ' + $website
    } else if (Url == 'payment' || Url == 'payment-results') {
      $urlname = Url + ' - ' + $website
    } else if (Url == 'static') {
      $urlname = 'static - ' + $website
    } else if (Url == 'contact') {
      $urlname = 'contact us - ' + $website
    } else if (Url == 'boundDetails') {
      $urlname = 'Combination goods - ' + $website
    } else if (Url == 'search') {
      $urlname = 'search - ' + $website
    }
  } else {
    $urlname = $website
  }

  if (Url.indexOf('_') != -1) {
    Url = Url.split('_')[0]
  }
  if (Url != 'productDetail' && Url != 'productList') {
    $(document).attr('title', $urlname)
  }
}
// setDocumentTitle();

//获取localStorage
function getStorage(key) {
  return storage.getItem(key)
}
//设置localStorage
function setStorage(key, val, time) {
  if (getStorage(key)) {
    deleteStorage(key)
  }
  storage.setItem(key, val)
  if (time) {
    storage.setItem(key + '__expires__', time)
  }
}
//删除localStorage
function deleteStorage(key) {
  storage.removeItem(key)
  storage.removeItem(key + '__expires__')
}

//获取sessionStorage
function getSessionStorage(key) {
  return sessionStorage.getItem(key)
}
//设置sessionStorage
function setSessionStorage(key, val, time) {
  sessionStorage.setItem(key, val)
  if (time) {
    sessionStorage.setItem(key + '__expires__', time)
  }
}

//设置cookie
function setCookie(cname, cvalue) {
  document.cookie = cname + '=' + cvalue
}

//获取cookie
function getCookie(cname) {
  var name = cname + '='
  var ca = document.cookie.split(';')
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i]
    while (c.charAt(0) == ' ') c = c.substring(1)
    if (c.indexOf(name) != -1) return c.substring(name.length, c.length)
  }
  return ''
}

//清除cookie
function clearCookie(name) {
  setCookie(name, '', -1)
}

//判断浏览内核Safari返回.jpg 其他返回.webp
function returnSuffixName(url) {
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

ValidSourceVal()

/* 组装数据 */
function analyzeData(eventVal, edata, goodsList) {
  var sendObj = {};
  // sendObj.btype = $btype;
  sendObj.sh = window.screen.height || 0;
  sendObj.sw = window.screen.width || 0;
  // sendObj.cd = window.screen.colorDepth || 0;
  sendObj.lang = navigator.language || '';
  sendObj.userAgent = navigator.userAgent || '';
  sendObj.title = document.title || '';
  sendObj.domain = document.domain || '';
  sendObj.pageUrl = document.URL.includes("?") ? document.URL.split('?')[0] : document.URL;;
  sendObj.referrer = getStorage('sourceurl') || '';
  sendObj.promotion = getCookie('promotionLogo') || '';
  var $pathname = window.location.pathname.split('/');
  // 页面类型：首页 index 商品分类列表 typeList 检索结果列表 searchList 商品详情 detail 购物车 cart 结账 支付 payment 支付成功 payres 订单查询 orderSearch 订单结果orderList 联系我们 contactus 静态页面 static
  var $pathnamePre = '';
  if ($pathname[$pathname.length - 1] && $pathname[$pathname.length - 1].indexOf('.html')) {
    var Url = $pathname[$pathname.length - 1].split('.html')[0];
    if (Url == 'index') {
      $pathnamePre = 'index';
    } else if (Url.includes('productDetail_')) {
      $pathnamePre = 'detail';
    } else if (Url == 'cart') {
      $pathnamePre = 'cart';
    } else if (Url == 'information' || Url == 'payment') {
      $pathnamePre = 'payment';
    } else if (Url == 'orderSearch') {
      $pathnamePre = 'orderSearch';
    } else if (Url == 'orderDetail') {
      $pathnamePre = 'orderList';
    } else if (Url == 'contact') {
      $pathnamePre = 'contactus';
    } else if (Url == 'static') {
      $pathnamePre = 'static';
    } else if (Url == 'productList' || Url == 'search') {
      $pathnamePre = 'searchList';
    } else if (Url.includes('productList_')) {
      $pathnamePre = 'typeList';
    }
  } else {
    $pathnamePre = 'index';
  }
  if ($webUrl.indexOf('?') != -1 && (getUrlVars($webUrl).status == 1 || getUrlVars($webUrl).status == 'PAIED' || getUrlVars($webUrl).status == 'PS' || getUrlVars($webUrl).status == 'SUCCESS' || getUrlVars($webUrl).status == 'cod')) {
    $pathnamePre = 'payres';
  }
  sendObj.etype = eventVal || '';
  sendObj.edata = {};
  sendObj.pageType = $pathnamePre || '';
  if (Object.prototype.toString.call(getStorage('oldDynamicId')).slice(8, -1) != 'Null' && getStorage('oldDynamicId')) {
    sendObj.shop = $('#shopId').val() || '';
    sendObj.uid = getStorage('oldDynamicId');
  }
  if (edata && Object.prototype.toString.call(edata).slice(8, -1) == 'Object') {
    for (var key in edata) {
      sendObj.edata[key] = edata[key];
    }
  }
  let goodsListArr = []
  if (goodsList.length && Object.prototype.toString.call(goodsList).slice(8, -1) == 'Array') {
    goodsList.forEach(item => {
      let itemList = {}
      for (var key in item) {
        itemList[key] = item[key];
      }
      goodsListArr.push(itemList)
    })
  }
  sendObj.edata.goodsList = goodsListArr
  // var $baseVal = $.base64.encode(JSON.stringify(sendObj), true);
  var $baseVal = CryptoJS.enc.Base64.stringify(
    CryptoJS.enc.Utf8.parse(JSON.stringify(sendObj))
  )
  var realData =
    'eWi' +
    Math.ceil(Math.random() * 8) +
    'R' +
    Math.ceil(Math.random() * 8) +
    'h' +
    $baseVal
  let timeStamp = new Date().getTime()
  return {
    id: realData,
    timeStamp,
  }
}

/* 发送分析 */
function sendAnalyze(eventVal, productData = {}, goodsList = []) {
  $.ajax({
    type: "get",
    url: preUrl + "/vshop-plugin/api/v1/behavior/origin",
    data: analyzeData(eventVal, productData, goodsList),
    dataType: "json",
    success: function (response) {

    }
  });
}

function getRanArray(count) {
  var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
  var shuffled = arr.slice(0),
    i = arr.length,
    min = i - count,
    temp,
    index
  while (i-- > min) {
    index = Math.floor((i + 1) * Math.random())
    temp = shuffled[index]
    shuffled[index] = shuffled[i]
    shuffled[i] = temp
  }
  return shuffled.slice(min)
}

function ValidSourceVal() {
  if (getStorage('sourceurl') && getStorage('sourceurl__expires__')) {
    var oldSourceurlTime = getStorage('sourceurl__expires__')
      ; (oldSourceurlTime = parseInt(oldSourceurlTime)),
        (currentSourceurTime = new Date().getTime())
    //过期时间为7 * 24小时
    if (!compareTime(oldSourceurlTime, currentSourceurTime, 7 * 24)) {
      setStorage('sourceurl', getSourceVal(), new Date().getTime())
    }
  } else {
    setStorage('sourceurl', getSourceVal(), new Date().getTime())
  }
}

function getSourceVal() {
  var sourceVal = '',
    preUrl = '',
    referrer = document.referrer;
  console.log($.url.setUrl(referrer).attr("host"))
  if (referrer && referrer != '' && Object.prototype.toString.call(referrer).slice(8, -1) != 'Null' && !referrer.includes(document.domain)) { //上一跳地址是否存在
    preUrl = $.url.setUrl(referrer).attr("host");
    // if (preUrl.split(".").length - 1 >= 2) { //判断.出现次数 >=2
    //   var url = preUrl.split("."),
    //     dataUrl = url[url.length - 2];
    //   return returnChangeVal(dataUrl);
    // } else if (preUrl.split(".").length - 1 == 1) {
    //   var zUrl = preUrl.split('.')[0];
    //   return returnChangeVal(zUrl);
    // } else {
    //   return sourceVal = 'direct';
    // }
    if (preUrl.includes('?')) {
      var zUrl = preUrl.split('.')[0];
      return sourceVal = zUrl;
    } else {
      return sourceVal = preUrl;
    }
  } else {
    return (sourceVal = 'direct')
  }
}

function returnChangeVal(val) {
  if (val != 'facebook' && val != 'google' && val != 'instagram') {
    return 'direct'
  } else {
    return val
  }
}

function getDdentificationVal() {
  var promotionLogo = $.url.setUrl(window.location.url).param('promotionLogo'),
    sourceVal = ''
  if (
    promotionLogo &&
    promotionLogo != '' &&
    Object.prototype.toString.call(promotionLogo).slice(8, -1) != 'Null'
  ) {
    sourceVal = promotionLogo
  } else {
    sourceVal = ''
  }
  if (!getCookie('promotionLogo')) {
    setCookie('promotionLogo', sourceVal)
  }
}

//比较二个时间节点
function compareTime(startTime, endTime, interval) {
  return startTime + 3600000 * interval > endTime
}

function contrastTime(isChange, endTime, startTime) {
  let now = new Date().getTime()
  if (isChange) {
    let sTime = new Date(startTime).getTime()
    let eTime = new Date(endTime).getTime()
    if (
      (sTime && eTime && now >= sTime && now <= eTime) ||
      (sTime && now >= sTime && !eTime)
    ) {
      return true
    } else {
      return false
    }
  } else {
    if (
      (startTime && endTime && now > startTime && now < endTime) ||
      (startTime && now > startTime && !endTime)
    ) {
      return true
    } else {
      return false
    }
  }
}
// 带时区的时间比较
function contrastTimeZone(isChange, endTime, startTime) {
  let now = timezone()
  if (isChange) {
    let sTime =
      new Date(startTime).getTime() + new Date().getTimezoneOffset() * 60 * 1000 // 获取格林威治时间戳 正常时间戳（yyyy-mm-dd）会加上时区时间戳
    let eTime =
      new Date(endTime).getTime() + new Date().getTimezoneOffset() * 60 * 1000
    if (
      (sTime && eTime && now >= sTime && now <= eTime) ||
      (sTime && now >= sTime && !eTime)
    ) {
      return true
    } else {
      return false
    }
  } else {
    if (
      (startTime && endTime && now > startTime && now < endTime) ||
      (startTime && now > startTime && !endTime)
    ) {
      return true
    } else {
      return false
    }
  }
}

/* 获取url参数 */
function getUrlVars(url, type = 1) {
  var hash
  var myJson = {}
  var hashes = url.slice(url.indexOf('?') + 1).split('&')
  for (var i = 0; i < hashes.length; i++) {
    hash = hashes[i].split('=')
    if (type === 1) {
      myJson[hash[0]] = hash[1]
    } else {
      myJson = hash[1]
    }
  }
  return myJson
}

var dynamicAuth = 'Basic ' + window.btoa(shopId + ':vshop2020')
setStorage('shopid', shopId)
setStorage('domainurl', window.location.host)
if (
  window.location.host &&
  window.location.host.split(':') &&
  window.location.host.split(':')[0]
) {
  var urlPrefix = window.location.href.split(':')[0]
  if (urlPrefix) {
    preUrl = urlPrefix + '://' + window.location.host.split(':')[0]
  } else {
    preUrl = window.location.host.split(':')[0]
  }
}

function getToken(Fn) {
  var dynamicStorageId = new Date().getTime() * 1000 + getRanArray(4).join('')
  var storageData = {
    grant_type: 'password',
    auth_type: 'site',
    password: '',
    localstorage_id: dynamicStorageId,
    username: dynamicStorageId,
  }

  ValidSourceVal()
  if (
    getStorage('localstorageId') &&
    getStorage('localstorageId__expires__') &&
    getStorage('domainurl') &&
    getStorage('shopid') &&
    getStorage('domainurl') == window.location.host
  ) {
    var oldTime = getStorage('localstorageId__expires__')
      ; (oldTime = parseInt(oldTime)), (currentTime = new Date().getTime())
    //过期时间为24小时
    if (!compareTime(oldTime, currentTime, 24)) {
      //过期重新发接口 获取localstorage_id
      storageData.localstorage_id = getStorage('oldDynamicId')
      storageData.username = getStorage('oldDynamicId')
      $.ajax({
        type: 'post',
        url: preUrl + '/vshop-auth/oauth/token',
        data: storageData,
        async: true,
        headers: {
          Authorization: dynamicAuth,
        },
        success: function (response) {
          if (response.data.access_token) {
            setStorage('oldDynamicId', storageData.localstorage_id)
            setStorage(
              'localstorageId',
              response.data.access_token,
              new Date().getTime()
            )
            getDdentificationVal()
            if (Fn) {
              Fn()
            }
          }
        },
      })
    } else {
      //未过期取localstorage中的参数
      if (!getCookie('promotionLogo')) {
        getDdentificationVal()
      }
      if (Fn) {
        Fn()
      }
    }
  } else {
    //首次进入发接口 获取localstorage_id
    $.ajax({
      type: 'post',
      url: preUrl + '/vshop-auth/oauth/token',
      data: storageData,
      dataType: 'json',
      async: false,
      headers: {
        Authorization: dynamicAuth,
      },
      success: function (response) {
        if (response.data.access_token) {
          setStorage('oldDynamicId', storageData.localstorage_id)
          setStorage(
            'localstorageId',
            response.data.access_token,
            new Date().getTime()
          )
          getDdentificationVal()
          if (Fn) {
            Fn()
          }
        }
      },
    })
  }
}

//全局的ajax 调用即可
$.req = function (options) {
  options.url = preUrl + '/vshop-site' + options.url
  options.headers = {
    Authorization: 'bearer ' + getStorage('localstorageId'),
  }

  return $.ajax(
    $.extend(
      {
        type: 'get',
        headers: {
          Authorization: 'bearer ' + getStorage('localstorageId') || '',
        },
        dataType: 'json',
        success: function (res) {
          if (typeof success === 'function') {
            if (
              res.code === 0 ||
              res.code === '0' ||
              res.code === 200 ||
              res.code === '200'
            ) {
              success(res)
            } else {
              if (res.code == 401 || res.code == 500) {
                return false
              } else {
                layer.closeAll()
                layer.msg(res.msg, {
                  icon: 5,
                  time: 1000,
                })
              }
            }
          }
        },
        error: function (res) {
          //error 回调
          if (
            res.responseText &&
            JSON.parse(res.responseText).code &&
            (JSON.parse(res.responseText).code == 401 ||
              JSON.parse(res.responseText).code == 500)
          ) {
            var storageData = {
              grant_type: 'password',
              auth_type: 'site',
              password: '',
            }

            var dynamicStorageId =
              new Date().getTime() * 1000 + getRanArray(4).join('')
            storageData.localstorage_id =
              getStorage('oldDynamicId') || dynamicStorageId
            storageData.username =
              getStorage('oldDynamicId') || dynamicStorageId

            $.ajax({
              type: 'post',
              url: preUrl + '/vshop-auth/oauth/token',
              data: storageData,
              async: false,
              headers: {
                Authorization: dynamicAuth,
              },
              success: function (response) {
                if (response.data.access_token) {
                  setStorage('oldDynamicId', storageData.localstorage_id)
                  setStorage(
                    'localstorageId',
                    response.data.access_token,
                    new Date().getTime()
                  )
                  ValidSourceVal()
                  getDdentificationVal()
                  return false
                }
              },
            })
          } else {
            if (typeof error === 'undefined' || typeof error != 'function') {
              layer.msg('Connection failed!', {
                icon: 5,
                time: 1000,
              })
            } else {
              typeof error === 'function' && error(res)
            }
          }
        },
      },
      options
    )
  )
}


//优惠券描述处理逻辑
function descr(descr) {
  var sDescr = ''
  if (descr.indexOf('**') != -1) {
    var upMoeny = descr.split('**')[1],
      preDecr = descr.split('**')[0]
    sDescr = preDecr + getSpaceMoney(upMoeny).split(' ')[1]
  } else {
    sDescr = descr
  }
  return sDescr
}

// 转换汇率(不加货币单位)
function getMoneyrate(money) {
  totalRate = JSON.parse(getStorage('currentRate'))
  if (getStorage('currentRate')) {
    if (Object.prototype.toString.call(totalRate).slice(8, -1) == 'Object') {
      var totalMoney = totalRate.rate * money
      var result = parseFloat(totalMoney),
        result = Math.round(totalMoney * 100) / 100
      var s_x = result.toString()
      if (totalRate.currency !== 'JPY' && totalRate.currency !== 'TWD') {
        var pos_decimal = s_x.indexOf('.')
        if (pos_decimal < 0) {
          pos_decimal = s_x.length
          s_x += '.'
        }
        while (s_x.length <= pos_decimal + 2) {
          s_x += '0'
        }
      } else {
        s_x = Math.round(s_x)
      }
      return Number(s_x)
    } else {
      return Number(money)
    }
  } else {
    return Number(money)
  }
}

//获取汇率转换后的价格
function getMoney(money) {
  money = parseFloat(money)
  let currentRate = JSON.parse(getStorage('currentRate'))
  if (currentRate && currentRate != '') {
    let totalMoney = currentRate.rate * money
    let result = parseFloat(totalMoney)
    result = Math.round(totalMoney * 100) / 100
    let s_x = result.toString()
    if (currentRate.currency !== 'JPY' && currentRate.currency !== 'TWD') {
      let pos_decimal = s_x.indexOf('.')
      if (pos_decimal < 0) {
        pos_decimal = s_x.length
        s_x += '.'
      }
      while (s_x.length <= pos_decimal + 2) {
        s_x += '0'
      }
    } else {
      s_x = Math.round(s_x)
    }
    return currentRate.symbol + (s_x - 0)
  } else {
    return currentRate.symbol + Number(money)
  }
}
getToken(function () { })

// 时区转化
function timezone() {
  let $time = new Date().getTimezoneOffset() * 60 * 1000 + new Date().getTime() //获取格林威治时间
  let $timezone = $('#timezone').val().split('GMT')[1]
  let time = $timezone.substr(1, $timezone.length - 1)
  let hour = Number(time.split(':')[0]) // 获取相差小时
  let minute = Number(time.split(':')[1]) //获取相差分钟
  let differ_time = hour * 60 * 60 * 1000 + minute * 60 * 1000
  if ($timezone.substr(0, 1) == '-') {
    $time = $time - differ_time
  } else if ($timezone.substr(0, 1) == '+') {
    $time = $time + differ_time
  }
  return $time
}

// 提示语
function alertTxt(tip, icon = 5, time = 1500) {
  layui
    .config({
      version: true,
      base: '/layui',
    })
    .use(['layer'], function () {
      layer = layui.layer
      layer.msg(tip, {
        id: 'tip_code',
        icon,
        time,
      })
    })
}

//图片点击放大
$(document).on('click', '[data-zoom="zoomImg"]:not([disabled])', function () {
  const $img = $(this).attr('data-img')
  layui
    .config({
      version: true,
      base: '/layui',
    })
    .use(['jquery', 'layer'], function () {
      var $ = layui.jquery,
        layer = layui.layer
      layer.open({
        skin: 'zoom_img',
        type: 1,
        title: false,
        area: [$(window).width() + 'px', $(window).height() + 'px'],
        shade: [0.9, '#000000'],
        content: `<div class='zoomImg'><img src='${$img}'></div>`,
        closeBtn: 1,
        cancel: function () { },
      })
    })
})

function changeImg(parentDom) {
  $(function () {
    let $dom = $('*[data-suffix-img]')
    if (parentDom) {
      $dom = $(parentDom + '*[data-suffix-img]')
    }
    $dom.each(function (index, el) {
      let suffixImg = $(el).attr('data-suffix-img')
      if (
        suffixImg &&
        suffixImg != '' &&
        Object.prototype.toString.call(suffixImg).slice(8, -1) != 'Null'
      ) {
        $(el).attr('src', returnSuffixName(suffixImg))
      }

      let $rel = $(el).attr('rel')
      if (
        $rel &&
        $rel != '' &&
        Object.prototype.toString.call($rel).slice(8, -1) != 'Null'
      ) {
      }
    })
  })
}

changeImg()

// 产生UUid
function getuuidstr() {
  var s = []
  var hexDigits = '0123456789abcdef'
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = '-'
  var uuid = s.join('')
  uuid = uuid.replace(/-/g, '')
  return uuid
}

function deepClone(obj) {
  let objClone = Array.isArray(obj) ? [] : {}
  if (obj && typeof obj === 'object') {
    for (let key in obj) {
      if (obj[key] && typeof obj[key] === 'object') {
        objClone[key] = deepClone(obj[key])
      } else {
        objClone[key] = obj[key]
      }
    }
  }
  return objClone
}

function formatMoney(money) {
  money = money + ''
  var totalMoeny = money.split('.')[1]
  var preMoeny = ''
  if (totalMoeny == '00' || totalMoeny == '0') {
    preMoeny = money.split('.')[0]
  } else {
    if (money.indexOf('.') != -1) {
      var cutBefore = money.split('.')[0],
        cutAfter = money.split('.')[1].substr(0, 1)
      if (cutAfter != 0) {
        preMoeny = cutBefore + '.' + cutAfter.substr(0, 1)
      } else {
        preMoeny = cutBefore
      }
    } else {
      preMoeny = money
    }
  }
  return preMoeny
}

function sellingPrice($sellingPrice, $customVal) {
  let $price = 0
  $customVal.forEach((item) => {
    if (
      item.hasOwnProperty('price') &&
      item.price != '' &&
      item.price != null
    ) {
      $price = $price + Number(item.price)
    }
    if (item.hasOwnProperty('childList')) {
      item.childList.forEach((val) => {
        $price = $price + Number(val.price)
      })
    }
  })
  $sellingPrice += $price
  return $sellingPrice
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

$(function () {
  // 初始化购物车数目
  let $shopping_num = 0
  if (localStorage.getItem('shopping_num')) {
    $shopping_num = parseInt(localStorage.getItem('shopping_num'))
  }
  if ($shopping_num > 99) {
    $('.home_bag i').text('99+')
  } else {
    $('.home_bag i').text($shopping_num)
  }
  // 页面发送数据
  if (
    ($pathname[$pathname.length - 1] &&
      $pathname[$pathname.length - 1].indexOf('.html')) ||
    window.location.pathname == '/'
  ) {
    var Url = $pathname[$pathname.length - 1].split('.html')[0]
    if (Url.indexOf('_') != -1) {
      Url = Url.split('_')[0]
    }
    if (Url != 'productDetail' && Url != 'information' && Url != 'payment') {
      sendAnalyze('view');
    }
  }
})
// 金额转化
function totalCartList(cart_info) {
  const totalCartList = {
    couponDiscount: getMoneyRateNum(cart_info.couponDiscount),
    promotionDiscount: getMoneyRateNum(cart_info.promotionDiscount),
  }
  let goodsList = deepClone(cart_info.goodsList)
  let afterDicountTotal = 0
  goodsList.forEach(item => {
    item.defaultPrice = getMoneyRateNum(item.defaultPrice) || ''
    item.discountPrice = getMoneyRateNum(item.discountPrice)
    item.afterDicountPrice = formatMoneyRate(item.discountPrice * item.quantity)
    item.originalPrice = getMoneyRateNum(item.originalPrice)
    item.sellingPrice = getMoneyRateNum(item.sellingPrice) || ''
    afterDicountTotal = formatMoneyRate(item.afterDicountPrice + afterDicountTotal)
  })
  totalCartList.goodsList = goodsList
  totalCartList.afterDicountTotal = formatMoneyRate(afterDicountTotal - totalCartList.couponDiscount - totalCartList.promotionDiscount)
  return totalCartList
}

function getMoneyRateNum(money) {
  if (money == '' || money == null) {
    return money
  }
  totalRate = JSON.parse(getStorage('currentRate'))
  if (getStorage('currentRate') && Object.prototype.toString.call(totalRate).slice(8, -1) == 'Object') {
    let result = 0
    if (totalRate.currency == 'JPY' || totalRate.currency == 'TWD') {
      result = Math.round(totalRate.rate * money)
    } else {
      result = Math.round(totalRate.rate * money * 100) / 100
    }
    return Number(result)
  } else {
    return Number(money)
  }
}

// 防抖
function debounce(fn, delay = 500) {
  // timer 是在闭包中的
  let timer = null;

  return function () {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, arguments);
    }, delay);
  }
}
function formatMoneyRate(money) {
  let result = 0, totalRate = JSON.parse(getStorage('currentRate'))
  if (totalRate.currency == 'JPY' || totalRate.currency == 'TWD') {
    result = Math.round(money)
  } else {
    result = Math.round(money * 100) / 100
  }
  return result
}
//时间戳+四位随机数产生文件名
function randomImgName() {
  var charactors = "1234567890";
  var value = '', i;
  for (j = 1; j <= 4; j++) {
    i = parseInt(10 * Math.random());
    value = value + charactors.charAt(i);
  }
  var name = new Date().getTime() + value
  return name
}

DETAILDATA.sort(function (a, b) {
  var value1 = a['sort'];
  var value2 = b['sort'];
  return value2 - value1;
});
var prevArr = []
listSort(DETAILDATA)
function listSort(itemList) {
  if (getParam('q')) {
    prevArr = [];
    let tempArr = getParam('q').split('-');
    for (let i = 0; i < tempArr.length; i++) {
      for (let j = 0; j < itemList.length; j++) {
        if (tempArr[i] == itemList[j].goodsNum) {
          prevArr.push(itemList[j]);
          break;
        }
      }
    }
  }
}

function getParam(key) {
  var param = "";
  var valus = new RegExp(key + "=(([^\\s&(#!)])+)").exec(window.location.href);
  if (valus && valus.length >= 2) {
    param = valus[1];
  }
  return param;
}

function getRandomString(len = 32) {
  var $chars = 'ABCDEFGHJKMNPQRSTWXYZ0123456789';
  var maxPos = $chars.length;
  var val = '';
  for (i = 0; i < len; i++) {
    val += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return val;
}

//获取当前格林尼治时间
function getGreenwichTime() {
  var dt = new Date;
  dt.setMinutes(dt.getMinutes() + dt.getTimezoneOffset());
  return dt.getTime()
}

// facebook api数据转化
function facebookApi(facebookId, data) {
  const TOKEN = BASEDATA.textInfo.tokenFacebook
  $.ajax({
    url: `https://graph.facebook.com/v8.0/${facebookId}/events?access_token=${TOKEN}`,
    type: 'post',
    dataType: 'json',
    contentType: "text/plain; charset=utf-8",
    data: JSON.stringify(data),
    success(res) {
    }
  });
}
// facebook api数据转化 参数
function facebookApiParam(custom_data, event_name, eventID) {
  const fbqApi = {
    "data": [
      {
        "event_name": event_name,
        "event_time": getGreenwichTime(),
        "event_id": eventID,
        "event_source_url": window.location.href,
        "user_data": {
          'fbp': getCookie('_fbp'),
          'fbc': getCookie('_fbc'),
        },
        custom_data
      },
    ]
  }
  return fbqApi
}
