// createdLoad()
// loadImg()
switchWebp()
//添加滚动事件
window.onscroll = function () {
  switchWebp()
}
function loadImg() {
  // switchWebp()
  var iH = document.documentElement.clientHeight
  var t = document.documentElement.scrollTop || document.body.scrollTop
  var img = document.querySelectorAll('.loading img')

  for (let i = 0; i < img.length; i++) {
    if (!img[i].bstop && $(img[i]).offset().top < iH + t) {
      //注意  真正在页面上使用一定要加开关,不加开关每次条件符合时都会重新请求服务器，还不如不用懒加载
      let src = returnSuffixName(img[i].getAttribute('data-url'))
      img[i].src = src
      img[i].bstop = true
      console.log(111)
      $(img[i].parentNode).find('.loadSpan').remove()
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

// 所有a标签跳转时拦截，并将归属标识加入链接作为参数
$('a').on('click', function (event) {
  var promotionLogo = getCookie('promotionLogo')
  if (promotionLogo) {
    event.preventDefault() // 阻止默认事件
    event.stopPropagation() // 阻止冒泡
    var url = $(this).attr('href')
    var hasParams = getUrlVars(url, (type = 2))
    console.log(hasParams)
    document.querySelector('a').href = '#'
    if (hasParams) {
      window.location = url + '&promotionLogo=' + promotionLogo
    } else {
      window.location = url + '?promotionLogo=' + promotionLogo
    }
  }
})

// 跳转页面
function toJump(url) {
  var promotionLogo = getCookie('promotionLogo')
  if (promotionLogo) {
    window.location = url + '?promotionLogo=' + promotionLogo
  } else {
    window.location = url
  }
}
