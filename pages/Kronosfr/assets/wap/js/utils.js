var version = new Date().getTime()
var modalObjStr = JSON.parse(localStorage.getItem('modalobjstr')) || [] //3d => 所有的3d信息，本地存储
var searchResult = [] // 检索过滤得到的数据
// 免除搜索名单
var exemptSearchList = [52791, 52790, 52789, 52788, 52786, 52793] // 后期改动
var $DETAILDATA = DETAILDATA.filter(
  (item) => exemptSearchList.indexOf(item.id) === -1
)

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
{
  /* <img src="../assets/wap/images/3D@2x.png" class="threeDSweiperImages" alt=""></img> */
}
function renderhtml(data, fnode, type = 1, className) {
  data = delItemsFn(data)
  data = [...prevArr, ...data]
  return new Promise((resolve, reject) => {
    var html = ''
    for (let i = 0; i < data.length; i++) {
      var html1 = `
                               <div class="${className} athena_product_item">
                                <a onclick="routerJump('productDetail_${data[i].id}.html')" >
                                    <img src="" alt="" data-url="${data[i].mainImg}">`
      if (data[i].originalPrice && data[i].originalPrice > data[i].defaultPrice) {
        var html2 = `
                        <span class="discount ${data[i].freeShipping != 0 ? 'freeShipping' : ''} ${data[i].speType == 3 ? 'slide' : ''}">
                            <p>${formateDiscount(((data[i].originalPrice - data[i].defaultPrice) / data[i].originalPrice) * 100)}%</p>
                            <p>RABAIS</p>
                        </span>
                    `
      } else {
        var html2 = ''
      }
      if (data[i].freeShipping != 0) {
        var html3 = `

                                    <span class="free_shipping">
                                        <p>Livraison Gratuite</>
                                    </span>
                    `
      } else {
        var html3 = ''
      }
      var html4 = `
                    <div class="loadSpan"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>
                     </a>
                                <div class="athena_product_introduce_title">
                                    <p>${data[i].goodsName}</p>
                                    <div class="athena-product-introduce-price"  id="discountTime" start="${data[i].discountStaTime}" end="${data[i].discountEndTime}">
                                       
                                   
                    `
      if (data[i].discount && data[i].discount !== 10) {
        var html5 = `
                           <span class="defaultPrice" p-price="${data[i].defaultPrice
          }"></span>
                        <span class="discountPrice"   p-price="${(data[i].defaultPrice * data[i].discount) / 10
          }"></span>
            `
      } else {

        if (data[i].originalPrice && data[i].originalPrice > data[i].defaultPrice) {
          // 需要显示折扣价格
          var html5 = `
                 <span class="oldDefaultPrice" p-price="${data[i].originalPrice
            }"></span>
              <span class="newDiscountPrice"   p-price="${data[i].defaultPrice
            }"></span>
            `
        } else {
          // 不需要显示折扣价格
          var html5 = `
                <span class="defaultPrice" p-price="${data[i].defaultPrice}"></span>
                `
        }
      }
      if (data[i].speType == 3) {
        var html6 = `
              </div>
                  </div>
                  <div class="wrapContainer">
                      <div class="cube">
                          <div class="cubeList front">3</div>
                          <div class="cubeList back">3</div>
                          <div class="cubeList top">3</div>
                          <div class="cubeList bottom">D</div>
                          <div class="cubeList left">D</div>
                          <div class="cubeList right">D</div>
                      </div>
                  </div>
              </div> 
            `
      } else {
        var html6 = `
              </div>
                  </div>
              </div> 
            `
      }

      html = html + html1 + html2 + html3 + html4 + html5 + html6
    }
    if (type === 1) {
      $(fnode)
        .html(html)
        .promise()
        .done(function () {
          changePrice()
          checkActiveTime()
          // loadImg()
          switchWebp()
          resolve()
        })
    } else {
      $(fnode)
        .append(html)
        .promise()
        .done(function () {
          changePrice()
          checkActiveTime()
          // loadImg()
          switchWebp()
          resolve()
        })
    }

  })
}
/**
 * 页面跳转、所有页面跳转需要携带标识符promotionLogo
 * @param {*} url // 跳转地址
 */
// function routerJump(href) {
//   var promotionLogo = getCookie('promotionLogo')
//   if (promotionLogo) {
//     window.location.href = href + '?promotionLogo=' + promotionLogo
//   } else {
//     window.location.href = href
//   }
// }
// 根据汇率改变页面中的价格
function changePrice() {
  var allprice = $('[p-price]')
  allprice.each(function (index) {
    $(this).text(getMoney($(this).attr('p-price')))
  })
}
/**
 *
 * @param {*} data 商品数据源
 * @param {*} keyword 关键词
 */
// function filterData(data, keyword) {
//   keyword = keyword.trim().replace(/[\r\n]/g, '')
//   var reg = new RegExp(keyword.toLowerCase())
//   return (newData = data.filter((item) =>
//     item.goodsName.toLowerCase().match(reg)
//   ))
// }

/**
 *
 * @param {*} pageNum 当前页码
 * @param {*} pageSize 当前分页数
 * @param {*} array 需要切片的数据对象
 */
function pagination(pageNum, pageSize, array) {
  var offset = (pageNum - 1) * pageSize
  return offset + pageSize >= array.length
    ? array.slice(offset, array.length)
    : array.slice(offset, offset + pageSize)
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
      if (
        data[j].discount < 10 &&
        isEffective(data[j].discountStaTime, data[j].discountEndTime)
      ) {
        data[j].discountPrice = (data[j].defaultPrice * data[j].discount) / 10
      } else {
        data[j].discountPrice = data[j].defaultPrice
      }
      if (
        data[j + 1].discount < 10 &&
        isEffective(data[j + 1].discountStaTime, data[j + 1].discountEndTime)
      ) {
        data[j + 1].discountPrice =
          (data[j + 1].defaultPrice * data[j + 1].discount) / 10
      } else {
        data[j + 1].discountPrice = data[j + 1].defaultPrice
      }
      // 相邻元素两两对比，元素交换，大的元素交换到后面
      var a
      var b
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

function checkActiveTime() {
  var now = new Date().getTime()
  $('.athena_product_item').each(function (index) {
    let start = new Date(
      $(this).find('#discountTime').attr('start').replace(/-/g, '/')
    ).getTime()
    let end = new Date(
      $(this).find('#discountTime').attr('end').replace(/-/g, '/')
    ).getTime()
    if (start && end) {
      if (now >= start && now <= end) {
        $(this).find('.defaultPrice').show()
        $(this).find('.discountPrice').show()
        $(this).find('.discount').show()
        $(this).find('.defaultPrice').addClass('defaultPrice_line')
      } else {
        $(this).find('.defaultPrice').show()
        $(this).find('.discountPrice').hide()
        // $(this).find('.discount').hide()
      }
    } else if (isNaN(start) && isNaN(end)) {
      $(this).find('.defaultPrice').show()
      $(this).find('.discountPrice').hide()
      // $(this).find('.discount').hide()
    } else {
      $(this).find('.defaultPrice').show()
    }
  })
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
// 渲染推荐（检索为空时）
function renderRecommendEmpty() {
  const newData = getRandomProducts(12)
  renderhtml(newData, '#recommend_empty .swiper-wrapper', 1, 'swiper-slide')
}

function getQueryVariable(variable) {
  var query = decodeURI(window.location.search.substr(1))
  var vars = query.split('&')
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=')
    if (pair[0] === variable) {
      return pair[1]
    }
  }
  return ''
}

//新增
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
 * 校验折扣活动的有效期
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
              'Merci de vous être abonné ! Nous vous enverrons des offres spéciales et des nouvelles sous peu'
            )
          }
        } else {
          alert(res.msg)
        }
      },
    })
  } else {
    alert('Veuillez saisir une adresse e-mail valide.')
  }
}
