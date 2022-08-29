const $now = new Date().getTime() // 当前系统时间
var searchResult = [] // 检索过滤得到的数据
var paginationObj = {
  wrapid: 'pagination', //页面显示分页器容器id
  total: 1, //总条数
  pagesize: 16, //每页显示10条
  currentPage: 1, //当前页
  onPagechange: onPagechange,
  //btnCount:7 页数过多时，显示省略号的边界页码按钮数量，可省略，且值是大于5的奇数
}
var keyword = ''
var emptySwiper = null
// 免除搜索名单
var exemptSearchList = [52791, 52790, 52789, 52788, 52786, 52793] // 后期改动
var $DETAILDATA = DETAILDATA.filter((item) => exemptSearchList.indexOf(item.id) === -1)
$(function () {
  setSwiper()
  $currency.changePrice()
  // 1. 判断当前页面localStroge中是否存在汇率，如果没有则存入后台配置的默认汇率
  var currentRate = JSON.parse(localStorage.getItem('currentRate'))
  if (!currentRate || !Object.keys(currentRate).length) {
    for (let i = 0; i < CONFIGDATA.currency.length; i++) {
      if (CONFIGDATA.currency[i].mainCurrency === 1) {
        localStorage.setItem(
          'currentRate',
          JSON.stringify(CONFIGDATA.currency[i])
        )
        callbackCurreny(CONFIGDATA.currency[i])
        break
      }
    }
  } else {
    callbackCurreny(JSON.parse(localStorage.getItem('currentRate')))
    switchRate()
  }

  $('#foot-notice #active-close').on('click', function () {
    $('#foot-notice').hide()
  })
})

function delItemsFn(list) {
  for (let i = 0; i < prevArr.length; i++) {
    for (let j = 0; j < list.length; j++) {
      if (prevArr[i].goodsNum == list[j].goodsNum) {
        list.splice(j, 1)
        break
      }
    }
  }
  return list
}

function formateDiscount(params) {
  if (!params) return 0
  if (params > 0 && params < 1) {
    return 1
  } else {
    return Math.floor(params)
  }
}

/**
 *
 * @param {*} data 商品数据源
 * @param {*} fnode 需要插入html的父节点
 * @param {*} type  插入html的方式 1：.html() 2:.append()  默认为1
 */
function renderhtml(data, fnode, type = 1, classNmae) {
  // if (paginationObj.pagesize === 16 && fnode == 'productContainer') {
  //   let len = 4 - ((data.length + 4) % 4)
  //   if (len === 1 || len === 2) {
  //     for (let index = 0; index < len; index++) {
  //       data.push({})
  //     }
  //   }
  // } else if (paginationObj.pagesize === 12 && fnode == 'productContainer') {
  //   let len = 3 - ((data.length + 3) % 3)
  //   if (len === 1) {
  //     for (let index = 0; index < len; index++) {
  //       data.push({})
  //     }
  //   }
  // }
  return new Promise((resolve, reject) => {
    var html = ''
    var currentRate = ''
    if (localStorage.getItem('currentRate')) {
      currentRate = JSON.parse(localStorage.getItem('currentRate'))
    } else {
      currentRate = CONFIGDATA.currency.filter(v => {
        v.mainCurrency == 1
      })[0]
    }
    var promotionLogo = ''
    if (getCookie('promotionLogo')) {
      promotionLogo = `?promotionLogo=${getCookie('promotionLogo')}`
    }
    for (let i = 0; i < data.length; i++) {
      if (!$.isEmptyObject(data[i])) {
        //如果当前对象为空，则说明他是用来占位的，使其透明
        var html1 = `<div   class="product-item  ${classNmae} four" sort="${data[i].sort}" start="${data[i].discountStaTime}" end="${data[i].discountEndTime}"><a href='productDetail_${data[i].id}.html${promotionLogo}' class="loading">`
        if (data[i].discount && data[i].discount != 10) {
          var html2 = `<div class="off"><em>${formateDiscount(100 - data[i].discount * 10)
            }%</em><em>OFF</em></div>`
          var html6 = ` <span class="oldPrice" p-price="${data[i].defaultPrice
            }"></span><span class="newPrice" p-price="${(data[i].defaultPrice * data[i].discount) / 10
            }"></span></p></div>`
        } else {

          if (data[i].originalPrice && data[i].originalPrice > data[i].defaultPrice) {
            var html2 = `<div class="off ${data[i].freeShipping !== 0 ? 'freeShipping' : ''}">${formateDiscount(((data[i].originalPrice - data[i].defaultPrice) / data[i].originalPrice) * 100)
              }% OFF</div>`
            // 需要显示折扣价格
            var html6 = `<del class="oldDefaultPrice" p-price="${data[i].originalPrice}"></del><span class="newPrice" p-price="${data[i].defaultPrice}"></span></p></div>`
          } else {
            var html2 = ''
            var html6 = `<span class="oldPrice defaultPrice" p-price="${data[i].defaultPrice}"></span></p></div>`
          }
        }
        if (data[i].freeShipping !== 0) {
          var html3 = `<div class="free_shipping">FREE SHIPPING</div>`
        } else {
          var html3 = ''
        }
        if (data[i].otherImg) {
          var html4 = `<img class="associateImg" src="" data-url="${data[i].mainImg}" alt=""><img class="mainImg" src="" data-url="${data[i].otherImg}" alt="">`
        } else {
          var html4 = `<img  src="" data-url="${data[i].mainImg}" alt="">`
        }
        var html5 = `</a><p class="overflow">${data[i].goodsName}</p><p class="price">`
        html = html + html1 + html2 + html3 + html4 + html5 + html6
      } else {
        var html7 = `<div style="opacity:0"  class="product-item animate_product ${classNmae}" start="${data[i].discountStaTime}" end="${data[i].discountEndTime}"></div>`
        html = html + html7
      }
    }
    if (type === 1) {
      $(fnode)
        .html(html)
        .promise()
        .done(function () {
          $currency.changePrice()
          checkActiveTime()
          createdLoad()
          loadImg()
          // OffAnimate()
          resolve()
        })
    } else {
      $(fnode)
        .append(html)
        .promise()
        .done(function () {
          $currency.changePrice()
          checkActiveTime()
          createdLoad()
          loadImg()
          // OffAnimate()
          resolve()
        })
    }
  })
}

// 渲染商品列表(按分页渲染)
function render(data, type) {
  data = delItemsFn(data)
  data = [...prevArr, ...data]
  const newData = getpagination(
    paginationObj.currentPage,
    paginationObj.pagesize,
    data
  )
  renderhtml(newData, '.productContainer', type)
}

/**
 *
 * @param {*} data 商品数据源
 * @param {*} word 关键词
 */
// function filterData(data, word) {
//   console.log(data, word)
//   var reg = new RegExp(word.trim().replace(/[($&*%#@)\n]/g, '').toLowerCase())

//   return (newData = data.filter((item) => {

//     // 返回匹配到热词的数据 或者 将热词去掉所有空格和商品名称去掉所有空格比较
//     return (

//       reg.test(item.goodsName.toLowerCase().replace(/[($&*%#@)\n]/g, '')) ||
//       word.replace(/\s*/g, '') === item.goodsName.replace(/\s*/g, '')
//     )
//   }))
// }

/**
 *
 * @param {*} pageNum 当前页码
 * @param {*} pageSize 当前分页数
 * @param {*} array 需要切片的数据对象
 */
function getpagination(pageNum, pageSize, array) {
  var offset = (pageNum - 1) * pageSize
  return offset + pageSize >= array.length ?
    array.slice(offset, array.length) :
    array.slice(offset, offset + pageSize)
}

// 从所有的分类中找到当前分类和分类下的数据
function deepFind(data, id) {
  const obj = findCategory(data, id)
  return findProducts(obj)
}

/**
 *  返回当前id及子节点的数据 // 查找当前分类
 * @param {*} data 数据源
 * @param {*} id 匹配id
 */
function findCategory(data, id) {
  var newdata = treeToArray(data)
  var arr = newdata.filter((item) => {
    return item.id == id
  })
  console.log(arr)
  return arr[0]
}

function findProducts(obj) {
  var arr = []
  if (obj.goodsList && obj.goodsList.length) {
    arr = [...arr, ...obj.goodsList]
  }
  if (obj.childList && obj.childList.length) {
    for (let i = 0; i < obj.childList.length; i++) {
      if (obj.childList[i].goodsList && obj.childList[i].goodsList.length) {
        arr = [...arr, ...obj.childList[i].goodsList]
        if (obj.childList[i].childList && obj.childList[i].childList.length) {
          findProducts(obj.childList[i].childList)
        }
      }
    }
  }
  return arr
}
/**
 *
 * @param {*} data 需要排序的数据
 * @param {*} sortName 排序的字段
 * @param {*} sortType 排序的类型  0： asc  1: desc
 */
function sort(data, sortName, sortType) {

  var len = data.length
  for (var i = 0; i < len - 1; i++) {

    for (var j = 0; j < len - 1 - i; j++) {
      if (data[j].discount < 10 && isEffective(data[j].discountStaTime, data[j].discountEndTime)) {
        data[j].discountPrice = data[j].defaultPrice * data[j].discount / 10
      } else {
        data[j].discountPrice = data[j].defaultPrice
      }
      if (data[j + 1].discount < 10 && isEffective(data[j + 1].discountStaTime, data[j + 1].discountEndTime)) {
        data[j + 1].discountPrice = data[j + 1].defaultPrice * data[j + 1].discount / 10
      } else {
        data[j + 1].discountPrice = data[j + 1].defaultPrice
      }
      // 相邻元素两两对比，元素交换，大的元素交换到后面
      var a;
      var b;
      if (sortName === 'shelfTime') {
        a = new Date(data[j][sortName]).getTime()
        b = new Date(data[j + 1][sortName]).getTime()
      } else if (sortName === 'defaultPrice') {
        a = data[j].discountPrice
        b = data[j + 1].discountPrice
      } else {
        a = data[j][sortName]
        b = data[j + 1][sortName]
      }
      if (sortType == 1) {
        if (a < b) {
          var temp = data[j]
          data[j] = data[j + 1]
          data[j + 1] = temp
        }
      } else {
        if (a > b) {
          var temp = data[j]
          data[j] = data[j + 1]
          data[j + 1] = temp
        }
      }
    }
  }

  return data
}
// 校验活动优惠的时间
function checkActiveTime() {
  $('.product-item').each(function (index) {
    let start = new Date($(this).attr('start')).getTime()
    let end = new Date($(this).attr('end')).getTime()
    if (start && end) {
      if ($now >= start && $now <= end) {
        $(this).find('.newPrice').show()
        $(this).find('.oldPrice').show()
        $(this).find('.off').show()
        $(this).find('.oldPrice').addClass('oldPrice_line')
      } else {
        $(this).find('.newPrice').hide()
        $(this).find('.oldPrice').show()

        $(this).find('.off').hide()
      }
    } else {
      $(this).find('.newPrice').show()
    }
  })
}

function setSwiper() {
  let recommendIds = []
  $('.recommendId').each(function () {
    recommendIds.push($(this).attr('id'))
  })
  recommendIds.forEach((item) => {
    if (item) {
      let swiper = item + '-Swiper'
      let container = `#${item} .swiper-container`
      let next = `#${item} .swiper-button-next`
      let prev = `#${item} .swiper-button-prev`
      let len = +$(`#${item}`).attr('len')
      let maxlen = +$(`#${item}`).attr('maxlen')
      if (maxlen < len) {
        len = maxlen
      }
      if (!len) {
        len = 3
      }
      swiper = new Swiper(container, {
        slidesPerView: +len,
        spaceBetween: 30,
        slidesPerGroup: 1,

        // loopFillGroupWithBlank: true,
        navigation: {
          nextEl: next,
          prevEl: prev,
        },
      })
    }
  })
}

function setEmptySwiper() {
  if (emptySwiper) {
    emptySwiper.resize.resizeHandler()
  } else {
    emptySwiper = new Swiper('#recommend-empty .swiper-container', {
      slidesPerView: auto,
      spaceBetween: 30,
      // slidesPerGroup: 1,
      // loopFillGroupWithBlank: true,
      // loop: true,
      navigation: {
        nextEl: '#recommend-empty .swiper-button-next',
        prevEl: '#recommend-empty .swiper-button-prev',
      },
    })
  }
}
// 渲染推荐（检索为空时）
function renderRecommendEmpty() {
  const newData = getRandomProducts(12)
  renderhtml(newData, '#empty_swiper .swiper-wrapper', 1, 'swiper-slide').then(
    () => {
      if (!emptySwiper) {
        emptySwiper = new Swiper('#empty_swiper', {
          observer: true, //修改swiper自己或子元素时，自动初始化swiper
          observeParents: true, //修改swiper的父元素时，自动初始化swiper
          slidesPerView: 3,
          spaceBetween: 30,
          // loop: true
          navigation: {
            nextEl: '#recommend-empty .swiper-button-next',
            prevEl: '#recommend-empty .swiper-button-prev',
          },
        })
      }

      $('#empty').show()
    }
  )
}
// 检索查询商品数据
function searchSubmit(keyword) {
  if ($('body').attr('name') == 'productList') {
    // 如果当前页面是productlist页面，直接查询检索结果并展示
    if (keyword) {
      searchResult = filterData($DETAILDATA, keyword)
      if (searchResult.length) {
        render(searchResult, 1)
        $('.productContainer-box').show()
        $('#empty').hide()
      } else {
        $('.productContainer-box').hide()
        $('.athena_search_empty_text .searchVal').text(keyword)
        renderRecommendEmpty()
      }
    } else {
      $('.productContainer-box').show()
      $('#empty').hide()
      searchResult = $DETAILDATA
      render(searchResult, 1)
    }
    $('#sort #total').text(`${searchResult.length + prevArr.length} items`)
    paginationObj.total = searchResult.length + prevArr.length
    pagination.init(paginationObj)
  } else {
    // 如果不在productlist页面，先跳转到productList页面，并携带参数
    var promotionLogo = getCookie('promotionLogo')
    if (promotionLogo) {
      location.href =
        'productList.html?promotionLogo=' +
        promotionLogo +
        '&keyword=' +
        keyword // 点击跳转到商品列表页，并携带参数
    } else {
      location.href = 'productList.html?keyword=' + keyword // 点击跳转到商品列表页，并携带参数
    }
  }
}

function getQueryVariable(variable) {
  var query = decodeURIComponent(window.location.search.substr(1))
  var vars = query.split('&')
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=')
    if (pair[0] === variable) {
      return pair[1]
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
// 分页方法
function onPagechange(page) {
  $('html,body').animate({
      scrollTop: 0,
    },
    0
  )
  paginationObj.currentPage = page
  searchResult = delItemsFn(searchResult)
  let productList = [...prevArr, ...searchResult]
  render(productList, 1)
  // if (paginationObj.pagesize === 16) {
  //   $('.productContainer .product-item').css({ width: '24%' })
  //   $('.productContainer .product-item a').css({ height: '383px' })
  // } else {
  //   $('.productContainer .product-item').css({ width: '32%' })
  //   $('.productContainer .product-item a').css({ height: '518px' })
  // }
}
// 排序回显
function callbackSort(sortRule, sortMode) {
  var div = $('.sortCheck')
  for (let i = 0; i < div.length; i++) {
    if ($(div[i]).attr('sortRule') == sortRule) {
      if (sortRule == 5) {
        // 如果是价格的话 分为 降序和升序
        if ($(div[i]).attr('sortMode') == sortMode) {
          $(div[i]).show()
        }
      } else {
        $(div[i]).show()
      }
    }
  }
}

// // 提交邮箱
function submitEmail(data) {
  var reg =
    /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/
  if (reg.test(data)) {
    let emailObj = {
      email: data,
    }
    $.req({
      url: '/api/v1/user/subscribe',
      type: 'post',
      contentType: 'application/json;charset=UTF-8',
      data: JSON.stringify(emailObj),
      success(res) {
        if (res.code === 0) {
          $('.submitSuccess').show()
          $('.contact-inner').hide()
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

// 从所有商品数据中随机抽取12个商品
function getRandomProducts(num) {
  if ($DETAILDATA.length > num) {
    var randoms = []
    var ids = []
    while (randoms.length < num) {
      var temp = (Math.random() * $DETAILDATA.length) >> 0
      if (ids.indexOf($DETAILDATA[temp].id) === -1) {
        // 防止有重复
        ids.push($DETAILDATA[temp].id)
        randoms.push($DETAILDATA[temp])
      }
    }
    return randoms
  } else {
    return $DETAILDATA
  }
}

// 将图片转成webp格式
function switchWebp() {
  let $dom = $('*[data-url]')
  $dom.each(function (index, el) {
    let suffixImg = $(el).attr('data-url')
    if (
      suffixImg &&
      suffixImg != '' &&
      Object.prototype.toString.call(suffixImg).slice(8, -1) != 'null'
    ) {
      $(el).attr('src', returnSuffixName(suffixImg))
    }
  })
}

//加载页面时执行一次
changeMargin()
//监听浏览器宽度的改变
window.onresize = function () {
  changeMargin()
}

function changeMargin() {
  // 当页面宽度改变时，始终让图片宽度和高度等比
  // var docWidth = document.body.clientWidth;
  var width = $('.productContainer .product-item').css('width')
  $('.productContainer .product-item a').css({
    height: width
  })
}

// 新增
/**
 * 切换汇率,返回当前汇率下的价格和单位
 * @param {*params} money
 */
function returnPrice(money) {
  var currentRate = JSON.parse(localStorage.getItem('currentRate'))
  if (currentRate && currentRate != '') {
    var totalMoney = currentRate.rate * money
    var result = parseFloat(totalMoney)
    result = Math.round(totalMoney * 100) / 100
    var s_x = result.toString()
    if (currentRate.currency !== 'JPY' && currentRate.currency !== 'TWD') {
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
    return currentRate.symbol + s_x
  } else {
    return currentRate.symbol + money
  }
}

/**
 * 用户切换汇率
 */
function switchRate() {
  var allprice = $('[p-price]')
  for (let i = 0; i < allprice.length; i++) {
    $(allprice[i]).text(returnPrice($(allprice[i]).attr('p-price')))
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
      typeof obj1[prop] === 'string' ?
      new Date(obj1[prop]).getTime() :
      obj1[prop]
    var val2 =
      typeof obj2[prop] === 'string' ?
      new Date(obj2[prop]).getTime() :
      obj2[prop]
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
      url.lastIndexOf('.jpg') != -1 ?
      url.lastIndexOf('.jpg') :
      '' || url.lastIndexOf('.webp') != -1 ?
      url.lastIndexOf('.webp') :
      '' || url.lastIndexOf('.JPG') != -1 ?
      url.lastIndexOf('.JPG') :
      ''
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
 * @param {*} word 关键词
 */
function filterData(data, word) {
  var reg = new RegExp(
    word
    .trim()
    .replace(/[($&*%#@)\n]/g, '')
    .toLowerCase()
  )
  return (newData = data.filter((item) => {
    if (item.goodsName) {
      // 返回匹配到热词的数据 或者 将热词去掉所有空格和商品名称去掉所有空格比较
      return (
        reg.test(item.goodsName.toLowerCase().replace(/[($&*%#@)\n]/g, '')) ||
        word.replace(/\s*/g, '') === item.goodsName.replace(/\s*/g, '')
      )
    }
  }))
}

/**
 * 校验折扣活动的有效期
 * @param {*} start
 * @param {*} end
 * @returns
 */
function IsPC() {
  var userAgentInfo = navigator.userAgent;
  var Agents = ["Android", "iPhone",
    "SymbianOS", "Windows Phone",
    "iPad", "iPod"
  ];
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
      gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
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
 * 页面跳转、所有页面跳转需要携带标识符promotionLogo
 * @param {*} url // 跳转地址
 */
function routerJump(href, linkStatus) {
  if (!href || linkStatus == 0) return
  var promotionLogo = getCookie('promotionLogo')
  if (promotionLogo) {
    window.location.href = href + '?promotionLogo=' + promotionLogo
  } else {
    window.location.href = href
  }
}
