var version = new Date().getTime()
var pageSize = 20 // 每页20条数据
var pageNum = 1 // 当前页码
var id = +$('.athena-productList-title').attr('categoryId')
var goodsList = [] // 当前分类下所有的商品数据

var categoryData = {} // 当前分类的数据
var position = true // 记录当前产品排列方式 true: 并列排 false: 单行排
// var keyword = decodeURI(window.location.search.substr(1));
var keyword = getQueryVariable('keyword')
var flag = true // 判断当前页面渲染商品是否成功，成功后方可继续执行滚动下的事件

// $.ajaxSettings.async = false // 同步执行
// isAll 判断当前是某个分类下的商品还是所有商品
const isAll = $('.total').attr('all')
if (isAll == 0) {
  var categoryData = findCategory(CATEGORYDATA.categoryList, id)
  searchResult = categoryData ? categoryData.goodsList.filter(
    (item) => exemptSearchList.indexOf(item.id) === -1
  ) : [] // 获取当前分类下的数据 // 去改分类下的商品数据（改商品数据包含了子分类的数据）
  $('#total').text(`(${searchResult.length})`)
  if (!searchResult.length) {
    $('.productListBox').hide()
    $('.athena_search_empty').show()
    renderRecommendEmpty()

    $('#empty_searchWord').text(categoryData.name)
    $('#end').hide()
  } else {
    $('.productListBox').show()
    $('.athena_search_empty').hide()
    render(searchResult, 1)
    callbackSort(categoryData.sortRule, categoryData.sortMode)
  }
} else {
  if (keyword) {
    searchResult = filterData($DETAILDATA, keyword)
    // $('#title').text(keyword)
    // $('#titleTop').text(keyword)
  } else {
    searchResult = $DETAILDATA
  }
  $('#total').text(`(${searchResult.length})`)
  if (!searchResult.length) {
    $('.productListBox').hide()
    $('.athena_search_empty').show()
    renderRecommendEmpty()
    $('#empty_searchWord').text(keyword)
    $('#end').hide()
  } else {
    $('.productListBox').show()
    $('.athena_search_empty').hide()
    render(searchResult, 1)
    callbackSort('0', 1)
  }
}

if (keyword) {
  $('#searchKeywordWrap').find('.search-keyword').text(keyword);
  $('#searchKeywordWrap').find('#search').val(keyword);
  if (!searchResult.length) {
    $('#searchKeywordWrap').find('.noResult').removeClass('hide');
    $('.athena-productList-title').hide();
  } else {
    $('#searchKeywordWrap').find('.hasResult').removeClass('hide');
  }
  $('#searchKeywordWrap').removeClass('hide')

}
// 并列排
$('#Juxtaposition').on('click', function () {
  $('#notJuxtaposition span').css('background-color', '#bbbbbb')
  $('#Juxtaposition span').css('background-color', '#474747')
  $('.athena-filter-child').hide()
  $('.athena-productListBox').removeClass('single-column')
  pageSize = 20
  pageNum = 1
  position = true
  $('.athena-productListBox').empty()
  render(searchResult, 1).then((res) => {
    changePositionToJuxta()
  })
})
// 单行排列
$('#notJuxtaposition').on('click', function (event) {
  $('#Juxtaposition span').css('background-color', '#bbbbbb')
  $('#notJuxtaposition span').css('background-color', '#474747')
  $('.athena-filter-child').hide()
  $('.athena-productListBox').addClass('single-column')
  pageSize = 10
  pageNum = 1
  position = false
  $('.athena-productListBox').empty()
  render(searchResult, 1).then((res) => {
    changePositionToNotJuxta()
  })
})
if ($('.Sort li').length) {
  // 排序方式元素上增加标记
  $('.Sort li')[0].classList.add('active')
}

//商品列表排序下拉选项 点击任意地方自动收回
$('body').on('click', function (event) {
  if (event.target != document.querySelector('li.active')) {
    $('.Sort').hide(200)
  }
})

// 点击排序，展开列表
$('#Sort').on('click', function (event) {
  event.stopPropagation()
  $('.Sort').toggle(200)
  if ($('.triangle').hasClass('triangle_ratate')) {
    //点击箭头旋转180度
    $('.triangle').removeClass('triangle_ratate')
  } else {
    $('.triangle').addClass('triangle_ratate')
  }
})

// 执行排序操作
$('.Sort li').on('click', function (event) {
  $('.athena-productListBox').empty()
  // let arr = [...goodsList]
  searchResult = sort(
    searchResult,
    $(this).attr('value'),
    $(this).attr('sortMode')
  )
  pageNum = 1
  render(searchResult, 1)
  $('.Sort').hide()
  $('.athena-filter-child-check').hide()
  $(this).find('.athena-filter-child-check').show()
  $('.triangle').removeClass('triangle_ratate')
  $(this).addClass('active').siblings('li').removeClass('active')
})



// 滚动监听事件
$(window).scroll(function () {
  var scrollTop = $(this).scrollTop()
  var scrollHeight = $(document).height()
  var windowHeight = $(this).height()
  if (scrollTop + windowHeight + 180 > scrollHeight && flag) {
    pageNum++
    flag = false
    render(searchResult, 2).then(() => {
      flag = true
    })
  }
})

function render(data, type) {
  return new Promise((resolve, reject) => {
    $('#end').hide() // 隐藏结束样式
    $('.spinner').show() // 显示加载动画
    if (data.length) {
      const newData = pagination(pageNum, pageSize, data) // 获取当前页码的数据
      if (newData.length) {
        setTimeout(() => {
          renderhtml(newData, '.athena-productListBox', type).then((res) => {
            if (!position) {
              // 判断当前排列方式 调整样式
              changePositionToNotJuxta()
            } else {
              changePositionToJuxta()
            }
            if (newData.length < pageSize) {
              // 如果返回结果小于当前分页的长度，说明已经是最后一页，显示结束样式
              $('#end').show() // 显示结束样式
              $('.spinner').hide() // 隐藏加载动画
            } else {
              $('#end').hide() // 显示结束样式
              $('.spinner').hide() // 隐藏加载动画
            }
            resolve()
          })
        }, 300)
      } else {
        $('#end').show() // 显示结束样式
        $('.spinner').hide() // 隐藏加载动画
        resolve()
      }
    } else {
      $('#end').show() // 显示结束样式
      $('.spinner').hide() // 隐藏加载动画
      resolve()
    }
  })
}

function changePositionToNotJuxta() {
  position = false
  $('.athena_product_item').css({
    width: '100%'
  })
  // $('.athena_product_item .athena_product_introduce_title ').css({
  //   'font-size': '0.16rem',
  // })
  // $('.athena_product_item .discountPrice ').css({
  //   'font-size': '0.14rem',
  //   'font- weight': 700,
  // })
  // $('.athena_product_item .defaultPrice ').css({
  //   'font-size': '0.14rem',
  //   'font-weight': 700,
  // })
  // $('.athena_product_item a').css({ height: 'auto', 'min-height': '3.43rem' })
  $('.athena-productListBox img').css({
    width: 'auto',
    height: 'auto'
  })
}

function changePositionToJuxta() {
  position = true
  $('.athena_product_item').css({
    width: '48%',
    borderShadow: 'none'
  })
  // $('.athena_product_item .athena_product_introduce_title ').css({
  //   'font-size': '0.12rem',
  // })
  // $('.athena_product_item .defaultPrice ').css({
  //   'font-size': '0.12rem',
  //   'font-weight': 700,
  // })
  // $('.athena_product_item a').css({ height: '1.64rem' })
  // $('.athena_product_item .discountPrice ').css({
  //   'font-size': '0.12rem',
  //   'font-weight': 700,
  // })
}
// 回显排序被选中状态
function callbackSort(sortRule, sortMode) {
  var div = $('.athena-filter-child-check')
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