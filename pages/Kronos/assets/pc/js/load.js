/**  动画js
 *
 */
// 加载动画
createdLoad()
loadImg()
//添加滚动事件
window.onscroll = function () {
  loadImg()
  if ($('#contactEmail').attr('id')) {
    emailAnimate()
  }
}
function loadImg() {
  switchWebp()
  let iH = document.documentElement.clientHeight
  let t = document.documentElement.scrollTop || document.body.scrollTop
  let img = document.querySelectorAll('.loading img')
  for (let i = 0; i < img.length; i++) {
    if (!img[i].bstop && $(img[i]).offset().top < iH + t) {
      //注意  真正在页面上使用一定要加开关,不加开关每次条件符合时都会重新请求服务器，还不如不用懒加载
      let src = returnSuffixName(img[i].getAttribute('data-url'))
      // let src = img[i].getAttribute("data-url");
      img[i].src = src
      img[i].bstop = true
      img[i].onload = () => {
        $(img[i].parentNode).find('.loadSpan').remove()
      }
    }
  }
}
function createdLoad() {
  var inp = document.getElementsByClassName('loading')
  for (let index = 0; index < inp.length; index++) {
    var div = document.createElement('div')
    div.setAttribute('class', 'loadSpan')
    inp[index].appendChild(div)
    for (let index = 0; index < 8; index++) {
      var span = document.createElement('span')
      div.appendChild(span)
    }
  }
}

// 折扣标签动画
OffAnimate()
function OffAnimate() {
  // $('.animate_product').on('mouseenter', function () {
  //   $(this).addClass('animate__animated animate__pulse')
  //   $(this).find('.off').addClass('animate__animated animate__shakeY animate__delay-1s')
  //   $(this).find('.free_shipping').addClass('animate__animated animate__shakeY animate__delay-1s')
  // })
  // $('.animate_product').on('mouseleave', function () {
  //   $(this).removeClass('animate__animated animate__pulse')
  //   $(this).find('.off').removeClass('animate__animated animate__shakeY animate__delay-1s')
  //   $(this).find('.free_shipping').removeClass('animate__animated animate__shakeY animate__delay-1s')
  // })
}

// 邮箱动画
function emailAnimate() {
  let iH = document.documentElement.clientHeight
  let t = document.documentElement.scrollTop || document.body.scrollTop
  if (!$('#contactEmail').bstop && $('#contactEmail').offset().top < iH + t) {
    $('#contactEmail .contact-inner .title').addClass(
      'animate__animated animate__backInLeft'
    )
    $('#contactEmail .contact-inner .tip').addClass(
      'animate__animated animate__backInRight'
    )
    $('#contactEmail .contact-inner .inputBox').addClass(
      'animate__animated animate__backInRight'
    )
    // $('#contactEmail .contact-inner .submit').addClass('animate__animated animate__backInUp')
  }
}

// // 所有a标签跳转时拦截，并将归属标识加入链接作为参数
// $('a:not(.home_bag)').on('click', function (event) {
//   var promotionLogo = getCookie('promotionLogo')
//   var url = $(this).attr('href')
//   if (url !== 'javascript:;') {
//     if (promotionLogo) {
//       event.preventDefault() // 阻止默认事件
//       event.stopPropagation() // 阻止冒泡

//       var hasParams = getUrlVars(url, (type = 2))
//       console.log(url)
//       document.querySelector('a').href = '#'
//       if (hasParams) {
//         window.location = url + '&promotionLogo=' + promotionLogo
//       } else {
//         window.location = url + '?promotionLogo=' + promotionLogo
//       }
//     }
//   }
// })
