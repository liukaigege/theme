var navList = INDEXDATA.filter((item) => item.typeId === 1)[0].config.catalogue.list
$(document).ready(function () {
  $('#header_firstMenu_container').removeClass('menuHide')
  var lisLen = 0 // 当前导航所有li标签的长度和
  var isLineFeed = $('#scroller').attr('isLineFeed')
  var displayStyle = $('#navigation').attr('displayStyle')

  // 导航操作

  // 处理导航菜单数量过多情况下，滑动显示
  $('#scroller li').each(function () {
    lisLen = lisLen + parseInt($(this).css('width').split('p')[0]) + 98
  })
  if (isLineFeed == 0) {
    if (lisLen > 1650) {
      $('#scroller').css({
        // 'justify-content': 'left',
        // left: '0',
        transform: 'none',
        // 'margin-left': '1.6rem',
      })
      // } else if (lisLen < 1600 && getQueryVariable('isIframe') !== 1) {
    } else if (lisLen < 1650) {
      $('#scroller').css({
        'justify-content': 'center',
        display: 'flex',
      })
      $('#scroller li').css({
        float: 'left',
      })
    }
  } else {
    if (lisLen < 1650) {
      $('#toLeft').hide()
      $('#toRight').hide()
    } else {
      $('#toLeft').show()
      $('#toRight').show()
    }
  }
  // if (lisLen > 1600 || isLineFeed == 0) {
  //   $('#scroller').css({
  //     'justify-content': 'left',
  //     left: '0',
  //     transform: 'none',
  //     // 'margin-left': '1.6rem',
  //   })
  //   $('#toLeft').show()
  //   $('#toRight').show()
  // } else {
  //   $('#toLeft').hide()
  //   $('#toRight').hide()
  // }

  customizeScrollWidth()

  // 窗口缩动，重新计算头部相关滚动元素
  window.onresize = debounce(() => {
    customizeScrollWidth()
  }, 500)

  function customizeScrollWidth() {
    if ($('.header .navigation .scroller-style-001').length) {
      var listEle = $('.header .navigation .scroller-style-001').find('li')
      var toRightContainerWidth = 0; //需要滑动的模块外容器，初始值为0，先启动第一次滑动
      for (var i = 0; i < listEle.length; i++) {
        toRightContainerWidth += (listEle.eq(i).width() + 50)
      }
      $('.header .navigation .scroller-style-001').width(toRightContainerWidth)
      if ($('#header_firstMenu_container').width() - 320 > toRightContainerWidth) {
        $('.header .navigation .scroller-style-001').css({
          'left': '50%',
          'transform': 'translateX(-50%)',
        }).removeClass('opClass')
      } else {
        $('.header .navigation .scroller-style-001').css({
          'left': '75px',
          'transform': 'none',
        }).removeClass('opClass')
      }
    }
  }

  $('#toLeft').on('click', function () {
    const leftValue = +$('#scroller').css('left').split('p')[0]
    if (+$('#scroller').css('left').split('p')[0] < 75) {
      var l = leftValue + 300 > 75 ? 75 : leftValue + 300
      $('#scroller').css({
        'left': l + 'px',
        'right': 'auto'
      })
    }
  })

  // 触摸切换货币汇率
  $('.toolbar-left .currency-hover').hover(function () {
    $('.toolbar-left .currencyExtend').show()
  }, function () {
    $('.toolbar-left .currencyExtend').hide()
  })

  $('.toolbar-left .currencyExtend').hover(function () {
    $(this).show()
  }, function () {
    $(this).hide()
  })

  // 点击滚动导航菜单
  $('#toRight').on('click', function () {
    const selfWidth = Math.abs($('.header .navigation .scroller-style-001').width())
    const parentWidth = $('#header_firstMenu_container').width()
    const leftValue = +$('#scroller').css('left').split('px')[0]
    const l = leftValue - 300 // 300是步长
    if (Math.abs(l) < (selfWidth - parentWidth)) {
      $('#scroller').css('left', l + 'px')
    } else {
      $('#scroller').css('left', `-${selfWidth - parentWidth}px`)
    }
  })
  // 关闭顶部公告
  $('#top-actived #actived-close').on('click', function (event) {
    event.stopPropagation()
    $('#top-actived').hide()
  })

  $('#navigation').mouseleave(function () {
    $('#menu').fadeOut(300)
  })
  $('#navigation #scroller li').mouseenter(function () {
    var categoryId = $(this).attr('categoryId')
    renderMenu(navList, categoryId, displayStyle)
  })
  // 搜索
  $('#showSearchDialog').click(function () {
    $('#searchDialog').removeClass('hide')
  })
  $('#closeSearchDialog').click(function () {
    $('#searchDialog').addClass('hide')
  })
  $('#search').blur(function () {
    setTimeout(() => {
      $('#searchExtend').hide(100)
    }, 300)
  })
  $('#search').focus(function () {
    var keyword = $(this).val()
    var result = filterData(DETAILDATA, keyword)
    if (keyword && result.length) {
      $('#searchExtend').show(100)
      $('#searchResult').empty()
      renderSearch(result)
    }
  })
  $('#search').keyup(function (event) {
    var keyword = $(this).val()
    var result = filterData(DETAILDATA, keyword)
    if (keyword && result.length) {
      $('#searchExtend').show(100)
      $('#searchResult').empty()
      renderSearch(result)
    } else {
      $('#searchExtend').hide(100)
      $('#searchResult').empty()
    }
  })
  $('#searchSubmit').on('click', function () {
    if ($('#searchSubmit').attr('html') == 'productList') {
      searchSubmit($('#search').val())
    } else {
      if ($('#search').val()) {
        location.href = 'productList.html?keyword=' + $('#search').val()
      } else {
        location.href = 'productList.html'
      }
    }
  })
  $('#viewAll').on('click', function () {
    if ($('#searchSubmit').attr('html') == 'productList') {
      searchSubmit($('#search').val())
    } else {
      location.href = 'productList.html?keyword=' + $('#search').val()
    }
  })
  // 切换汇率
  $('.currencyExtend li').on('click', function () {
    $(this).addClass('active').siblings('li').removeClass('active')
    $('.currencyExtend li .currency-check').hide()
    $(this).find('.currency-check').show()
    for (let i = 0; i < CONFIGDATA.currency.length; i++) {
      if (CONFIGDATA.currency[i].currency == $(this).attr('currencyId')) {
        $('.currency .currencyActive-img').css(
          'background-image',
          `url(${CONFIGDATA.currency[i].pic})`
        )
        $('.currency .currencyActive-name').text(
          CONFIGDATA.currency[i].currency
        )
        localStorage.setItem(
          'currentRate',
          JSON.stringify(CONFIGDATA.currency[i])
        )
        switchRate() // 全局更换价格
      }
    }
  })
})

function callbackCurreny(currentRate) {
  $('.currencyExtend li .currency-check').hide()
  $('.currencyExtend li').each(function () {
    if ($(this).attr('currencyId') === currentRate.currency) {
      $(this).addClass('active')
      $(this).find('.currency-check').show()
    }
  })
  $('.currency .currencyActive-img').css(
    'background-image',
    `url(${currentRate.pic})`
  )
  $('.currency .currencyActive-name').text(currentRate.currency)
}

function menuHover(e) {
  if (e) {
    $('.menuImg').css('background-image', `url(${returnSuffixUrl(e)})`)
    $('#header_firstMenu_container').removeClass('menuHide')
  }
}

function renderSearch(result) {
  var arr = result.slice(0, 3)
  for (let i = 0; i < arr.length; i++) {
    var item = arr[i]
    var discountPrice = (item.defaultPrice * item.discount) / 10
    var html = `
          <div class="search-result-div" onclick="routerJump('productDetail_${item.id
          }.html')"> 
            <img class="search-result-img" src="${returnSuffixUrl(item.mainImg)}">
            <div class="search-result-info">
            <div class="overflow_1">${item.goodsName}</div>
            ${item.discount && item.discount != 10 && isEffective(item.discountStaTime, item.discountEndTime)
        ? `<div p-price="${discountPrice}">${returnPrice(discountPrice)}</div>`
        : `<div p-price="${item.defaultPrice}">${returnPrice(
          item.defaultPrice
        )}</div>`
      }</div></div>
        `
    $('#searchResult').append(html)
  }
}

function renderMenu(navList, categoryId, displayStyle) {
  var list = navList.filter((item) => item.id == categoryId)[0]
  // 展示样式--多级目录 0下拉单列展示 1下拉图文展示 2子菜单不足5个单列展示，超出5个图文展示 默认0
  var len = 10
  if (list.childList && list.childList.length > 0) {
    if (displayStyle == 1) {
      $('#menu').fadeIn(300)
    } else {
      list.childList.length < 5 ? $('#menu').fadeOut(300) : $('#menu').fadeIn(300)
    }
    var html = ''
    var arr = chunkArr(list.childList, len)
    const listPic = list.pic || list.picGoods
    for (var j = 0; j < arr.length; j++) {
      var ht1 = `<div class="menuTitle-Item">`
      for (var i = 0; i < arr[j].length; i++) {
        const item = arr[j][i]
        const picUrl = item.pic || item.picGoods
        ht1 =
          ht1 +
          `<a class="overflow_1" onmousemove="menuHover('${picUrl}')" href="javascript:;" onclick="routerJump('${item.linkUrl}','${item.linkStatus}')">${item.name}</a>`
      }
      ht1 = ht1 + '</div>'
      html = html + ht1
    }
    html =
      html +
      `<div class="menuTitle-Item menuImg" style="background-image: url(${returnSuffixUrl(
        listPic
      )});"></div>`
    $('#menuTitle').html(html)
  } else {
    $('#menu').fadeOut(300)
  }
}
$(document).ready(function () {
  // pinterest 埋点数据 ~~~~~Start~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  var pinterestSetData = {
    pinterestYOUR_TAG_ID: '',
    pinterestEventType: 'pagevisit',
    pinterestData: {
      product_name: $('title').text().replace('"', '“'),
      attribute: window.location.href
    }
  }
  pinterestFn(pinterestSetData)
  // pinterest 埋点数据 ~~~~~End~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
})