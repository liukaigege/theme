

// 检索点击监听事件
$('#search').on('click', function (event) {
  var promotionLogo = getCookie('promotionLogo')
  location.href = 'productList.html?promotionLogo=' + promotionLogo + '&keyword=' + $('#keyword').val()
})
// 点击预设置的热词
$('.athena_search_result li').on('click', function () {
  var promotionLogo = getCookie('promotionLogo')
  location.href = 'productList.html?promotionLogo=' + promotionLogo + '&keyword=' + $(this).children('.hotName').text()
})
// 点击回车返回结果
document.addEventListener('keyup', function (e) {
  if (e.keyCode === 13) {
    var promotionLogo = getCookie('promotionLogo')
    location.href = 'productList.html?promotionLogo=' + promotionLogo + '&keyword=' + $('#keyword').val()
  }
})

// 返回上个页面
$('.athena_search_header_back').on('click', function () {
  self.location = document.referrer
})



