// pinterest 埋点数据 ~~~~~Start~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/*  pinterestFn() pinterest数据埋点函数说明：
 *   1. 开发时间：2021-07-02
 *   2. 开发者：王新国
 *   3. 参考文档：https://help.pinterest.com/zh-hans/business/article/add-event-codes
 *   4. 函数入参数据结构及说明:
 *      1) data => 函数入参，类型为Object
 *      2) data.pinterestYOUR_TAG_ID => 接收目标的id,固定值（可不传）
 *      3) data.pinterestEventType => 事件名称：加购物车=>AddToCart 页面信息=>pagevisit 结账(交易完成)=>checkout 其他参考第3条注释的参考文档 --> 事件代码类型
 *      4) data.pinterestData => pinterest实际使用数据数据，即发送的数据
 *      5) data.pinterestData 数据结构及说明：
 *         a) data.pinterestData.value => 加购或订单总价
 *         b) data.pinterestData.order_quantity => 加购或订单总数量
 *      其他数据，参照第3条注释的参考文档 --> 添加事件数据 --> 在IMG标签中包含事件数据
 *   5. pinterestFn函数内部的pinterestYOUR_TAG_ID默认值根据不同的平台查看账号而不同
 *   6. 同一个事件类型在一个页面只能添加一个，多次添加覆盖上一条。如添加两个AddToCart事件。不同事件不影响，如AddToCart与pagevisit互不影响。
 *   7. 使用示例：
 *      1) 声明一个入参数据 ==>
 *         let pinterestSetData={
 *            pinterestYOUR_TAG_ID:'',
 *            pinterestEventType:'AddToCart',
 *            pinterestData:{
 *              value:'0.99',
 *              order_quantity:1,
 *            }
 *          }
 *      2) 调用函数，将入参传入 => pinterestFn(pinterestSetData)
 */
function pinterestFn(data) {
  let {
    pinterestEventType,
    pinterestData,
  } = data,
  pinterestYOUR_TAG_ID = data.pinterestYOUR_TAG_ID || BASEDATA.textInfo.codePrinterest,
    pinterestImgId = 'pinterest' + pinterestEventType, //DOM元素的ID，每种类型的数据只有一个DOM结构
    pinterestDataString = '';
  if (pinterestYOUR_TAG_ID) {
    for (let pinterestKey in pinterestData) {
      pinterestDataString += `
        &ed[${pinterestKey}]=${pinterestData[pinterestKey]}
      `
    }
    let pinterestImgString = `
      <img
        id="${pinterestImgId}"
        height="1"
        width="1"
        style="display:none;"
        alt=""
        src="https://ct.pinterest.com/v3/?tid=${pinterestYOUR_TAG_ID}&event=${pinterestEventType}${pinterestDataString}&noscript=1"
      />
    `
    $('#' + pinterestImgId).remove()
    $('body').append(pinterestImgString)
  }
}
// pinterest 埋点数据 ~~~~~End~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// wap端禁止页面滚动
function forbidScroll() {
  $('body').height($(window).height()).css({
    'overflow': 'hidden'
  })
}
// wap端解开禁制页面滚动
function allowScroll() {
  $('body').height('').css({
    'overflow': 'auto'
  })
}




/**
 * 网页入口函数，用于配置当前网页的基础信息：汇率，标识符...
 */
//如果返回false –> 说明页面被嵌套在iframe中了
//如果返回true –> 说明页面并没有被嵌套在iframe中
$(document).ready(function () {
  if (
    getQueryVariable('isIframe') == 1 ||
    (self.frameElement && self.frameElement.tagName == 'IFRAME') ||
    window.frames.length != parent.frames.length ||
    self != top
  ) {
    $.getScript('../assets/blocks/js/postMessage.js')
  } else {
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
  }

  // 2. 图片转webp
  // var originalSrc = $('[data-original]')
  // var backgroundSrc = $('[data-background]')
  // originalSrc.each(function(){
  //   $(this).attr('data-original',returnSuffixUrl($(this).attr('data-original')))
  // })
  // backgroundSrc.each(function(){
  //   $(this).attr('data-background',returnSuffixUrl($(this).attr('data-background')))
  // })
  // 3. 校验优惠券是否有效，失效的优惠券隐藏

  if (
    CONFIGDATA.commomCoupon.length &&
    sessionStorage.getItem('isGetCoupon') != 1 &&
    CONFIGDATA.commomCoupon[0].unlimitedEndType === 0 &&
    isEffective(
      CONFIGDATA.commomCoupon[0].start,
      CONFIGDATA.commomCoupon[0].end
    )
  ) {
    $('#alertWindow').fadeIn(300)
  } else {
    $('#alertWindow').fadeOut(300)
  }
  $('[couponId]').each(function () {
    var start = $(this).attr('start')
    var end = $(this).attr('end')
    if (!isEffective(start, end)) {
      $(this).hide()
    }
  })
  // 上浮按钮
  $('#backTop').on('click', function () {
    $('body,html').animate({
      scrollTop: 0
    }, 500)
  })
  $('#foot-notice #active-close ').on('click', function () {
    $('#foot-notice').hide()
    $('.pc_block_footer').css({
      'padding-bottom': 0
    })
  })
  $(window).scroll(function () {
    200 <= $(this).scrollTop() && $('#backTop').fadeIn(),
      $(this).scrollTop() < 200 && $('#backTop').fadeOut()
  })

  $('#searchSubmit').on('click', function () {
    var promotionLogo = getCookie('promotionLogo')
    location.href =
      'productList.html?promotionLogo=' +
      promotionLogo +
      '&keyword=' +
      $('#search').val().replace(/%/g, '^')
  })
})


function getParam(key) {
  var param = "";
  var valus = new RegExp(key + "=(([^\\s&(#!)])+)").exec(window.location.href);
  if (valus && valus.length >= 2) {
    param = valus[1];
  }
  return param;
}
var bannerListArr = []
if (NODE_ENV.value === 'build') {
  var imgPrevUrl = 'https://vshop001.oss-accelerate.aliyuncs.com/'
} else {
  var imgPrevUrl = 'https://vshoptest.oss-cn-hangzhou.aliyuncs.com/'
}


// console.log('首页数据===>',INDEXDATA)
initBannerFn()

function initBannerFn(bannerListArr_arrary) {
  // 此方法有问题，再在加载页面时，消耗性能(增加渲染时间约60ms)，且网络差时会有一瞬间错误渲染。
  if (getParam('isIframe') != 1) {
    // 开发和生成环境的图片前缀
    //新需求：播图有多个图片位置，有图片有图，有图片无图，当有图的轮播图只有一个位置时，店铺对应轮播图无左右箭头，后台管理预览有箭头
    bannerListArr = bannerListArr_arrary || INDEXDATA.filter(v => v.typeId == 2)
    bannerListArr.map((v, i) => { //遍历轮播图数据
      let banner_attr_arr = []
      banner_attr_arr = v.config.bannerList.filter(val => val.pcUrl || val.wapUrl)
      //  有空轮播图的轮播图(pc端和wap都没有上传图片)
      if (banner_attr_arr.length > 1) {
        if (isMobilePhone.value == 1) {
          // 移动端
          wapBannerFn(i, banner_attr_arr)
        } else {
          // pc端
          pcBannerFn(i, banner_attr_arr)
        }
      } else if (banner_attr_arr.length == 1) {
        if (isMobilePhone.value == 1) {
          if (banner_attr_arr[0].linkUrl) {
            $('.banner').eq(i).html(`
              <a onclick="routerJump( ${banner_attr_arr[0].linkUrl + ''} )">
                <img src=" ${banner_attr_arr[0].wapUrl ? imgPrevUrl + banner_attr_arr[0].wapUrl : banner_attr_arr[0].pcUrl ? imgPrevUrl + banner_attr_arr[0].pcUrl : '../assets/wap/images/banner_iphone@2x.png'} " alt="" class="oneImages">
              </a>
            `)
          } else {
            $('.banner').eq(i).html(`
              <a>
                <img src=" ${banner_attr_arr[0].wapUrl ? imgPrevUrl + banner_attr_arr[0].wapUrl : banner_attr_arr[0].pcUrl ? imgPrevUrl + banner_attr_arr[0].pcUrl : '../assets/wap/images/banner_iphone@2x.png'} " alt="" class="oneImages">
              </a>
            `)
          }
        } else {
          if (banner_attr_arr[0].linkUrl) {
            $('.banner').eq(i).html(`
              <a onclick="routerJump( ${banner_attr_arr[0].linkUrl + ''}  )">
                <img src=" ${banner_attr_arr[0].pcUrl ? imgPrevUrl + banner_attr_arr[0].pcUrl : banner_attr_arr[0].wapUrl ? imgPrevUrl + banner_attr_arr[0].wapUrl : '../assets/pc/images/banner_pc@2x.png'} " alt="" class="oneImages">
              </a>
            `)
          } else {
            $('.banner').eq(i).html(`
              <a>
                <img src=" ${banner_attr_arr[0].pcUrl ? imgPrevUrl + banner_attr_arr[0].pcUrl : banner_attr_arr[0].wapUrl ? imgPrevUrl + banner_attr_arr[0].wapUrl : '../assets/pc/images/banner_pc@2x.png'} " alt="" class="oneImages">
              </a>
            `)
          }
        }
      }
    })
  } else if ($('.banner .banner_empty_img_hide').length) {
    $('.banner .banner_empty_img_hide').show()
  }
}

function pcBannerFn(i, banner_attr_arr) {
  let bannerString = '';
  banner_attr_arr.map(val => {
    console.log('.......>', val)
    if (val.linkUrl) {
      bannerString += `
          <a onclick="routerJump(' ${val.linkUrl + ''} ')" class="swiper-slide">
            <img id="a11" class="swiper-lazy" src=" ${val.pcUrl ? imgPrevUrl + val.pcUrl : val.wapUrl ? imgPrevUrl + val.wapUrl : '../assets/pc/images/banner_pc@2x.png'} ">
          </a>
        `
    } else {
      bannerString += `
          <a class="swiper-slide">
            <img id="a11" class="swiper-lazy" src=" ${val.pcUrl ? imgPrevUrl + val.pcUrl : val.wapUrl ? imgPrevUrl + val.wapUrl : '../assets/pc/images/banner_pc@2x.png'} ">
          </a>
        `
    }
  })
  $('.banner').eq(i).html(`
      <div class="swiper-container">
        <div class="swiper-wrapper">${bannerString}</div>
        <div class=" swiper-pagination swiper-pagination-white"></div>
        <div class="swiper-button-next"></div>
        <div class="swiper-button-prev"></div>
      </div>`)
}

function wapBannerFn(i, banner_attr_arr) {
  let bannerString = '';
  banner_attr_arr.map(val => {
    if (val.linkUrl) {
      bannerString += `
          <a onclick="routerJump(' ${val.linkUrl + ''} ')" class="swiper-slide">
            <img class="swiper-lazy" src=" ${val.wapUrl ? imgPrevUrl + val.wapUrl : val.pcUrl ? imgPrevUrl + val.pcUrl : '../assets/wap/images/banner_iphone@2x.png'} ">
          </a>
        `
    } else {
      bannerString += `
          <a class="swiper-slide">
            <img class="swiper-lazy" src=" ${val.wapUrl ? imgPrevUrl + val.wapUrl : val.pcUrl ? imgPrevUrl + val.pcUrl : '../assets/wap/images/banner_iphone@2x.png'} ">
          </a>
        `
    }
  })
  $('.banner').eq(i).html(`
      <div class="swiper-container">
        <div class="swiper-wrapper">${bannerString}</div>
        <div class=" swiper-pagination swiper-pagination-white"></div>
      </div>`)
}


$(function () {
  $('[onclick]').each((index, item) => {
    const str = $(item).attr('onclick')
    const param = str.split("(")[1].split(')')[0].replace(/\'|\"/g, '').trim()
    var cookieList = document.cookie.split(';')
    var promotionLogo = cookieList.find(item => {
      return item.indexOf('promotionLogo') != -1
    })
    var promotionLogoVal = ""
    if (typeof (promotionLogo) != 'undefined' && promotionLogo.split('=')[1]) {
      promotionLogoVal = 'promotionLogo=' + promotionLogo.split('=')[1]
    }
    if (param.indexOf(',') != -1) {
      const linkStatus = param.split(',')[1]
      const href = param.split(',')[0]
      if (linkStatus == 0 || href == '') {
        return false
      }
      if (href.indexOf('?') != -1) {
        promotionLogoVal = promotionLogoVal ? '&' + promotionLogoVal : ''
      } else {
        promotionLogoVal = promotionLogoVal ? '?' + promotionLogoVal : ''
      }
      $(item).attr('href', href + promotionLogoVal)
    } else if (param != '') {
      if (param.indexOf('?') != -1) {
        promotionLogoVal = promotionLogoVal ? '&' + promotionLogoVal : ''
      } else {
        promotionLogoVal = promotionLogoVal ? '?' + promotionLogoVal : ''
      }
      $(item).attr('href', param + promotionLogoVal)
    }
  })
})
