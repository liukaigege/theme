$(function () {
  keyword = getQueryVariable('keyword')
  var id = $('.category').attr('categoryId')
  const isAll = $('.total').attr('all')
  if (isAll == 1) {
    searchSubmit(keyword)
    callbackSort('0', 1)
    if (keyword) {
      $('#keyword').val(keyword)
    }
  } else {
    var data = findCategory(CATEGORYDATA.categoryList, Number(id))
    searchResult = data ? data.goodsList.filter((item) => exemptSearchList.indexOf(item.id) === -1) : [] // 获取当前分类下的数据
    if (searchResult.length) {
      // 如果分类下的有数据，渲染到当前页面中，否则渲染空页面
      callbackSort(data.sortRule, data.sortMode)
      searchResult = sort(searchResult, 'sort', 1)
      render(searchResult, 1)
      $('#result #total').text(`(${searchResult.length + prevArr.length})`)
      $('#sort #total').text(`${searchResult.length + prevArr.length} items`)
      paginationObj.total = searchResult.length + prevArr.length
      pagination.init(paginationObj) // 初始化分页
    } else {
      $('.productContainer-box').hide()
      $('#result #total').text('(0)')
      renderRecommendEmpty()
    }
  }
  if (keyword) {
    const str = keyword.substring(1)
    $('#searchKeywordWrap').find('.search-keyword').text(str);
    $('#searchKeywordWrap').find('.search-input').val(str);
    if (!searchResult.length) {
      $('#searchKeywordWrap').find('.noResult').removeClass('hide');
      $('.athena-productList .categoryImg,.category,.category-name').hide();
    } else {
      $('#searchKeywordWrap').find('.hasResult').removeClass('hide');
    }
    $('#searchKeywordWrap').removeClass('hide')

  }
  $('#pageSearchSubmit').on('click', function () {
    if ($('#searchSubmit').attr('html') == 'productList') {
      searchSubmit($('#pageSearch').val())
    } else {
      if ($('#pageSearch').val()) {
        location.href = 'productList.html?keyword=' + $('#pageSearch').val()
      } else {
        location.href = 'productList.html'
      }
    }
  })
  // if (!searchResult.length) {
  //   $('.productContainer-box').hide()
  //   renderRecommendEmpty()
  // }
  // if ($('.productContainer-side li').length) {
  //   // 侧边栏首个分类默认增加点击效果
  //   $('.productContainer-side li')[0].classList.add('active')
  // }
  if ($('#sortBy li').length) {
    // 排序方式元素上增加标记
    $('#sortBy li')[0].classList.add('active')
  }

  $('.sortBy .sort_extend').mouseleave(function () {
    $(this).fadeOut(300)
    $('.triangle').removeClass('triangle_ratate')
  })
  $('.sortBy ').mouseleave(function () {
    $('.sortBy .sort_extend').fadeOut(300)
    $('.triangle').removeClass('triangle_ratate')
  })
  // 排序显示隐藏
  $('#sortBy').on('click', function () {
    $('#sort_extent').fadeToggle(300)
    if ($('.triangle').hasClass('triangle_ratate')) {
      //点击箭头旋转180度
      $('.triangle').removeClass('triangle_ratate')
    } else {
      $('.triangle').addClass('triangle_ratate')
    }
  })
  // 获取点击的排序字段
  $('#sortBy li').on('click', function () {
    // let arr = [...searchResult]
    searchResult = sort(searchResult, $(this).attr('value'), $(this).attr('sortMode'))
    // listSort(arr,true)//重新排序
    paginationObj.currentPage = 1
    pagination.init(paginationObj)
    // arr = delItemsFn(arr)
    // let productList = [...prevArr, ...arr];
    render(searchResult, 1)
    $('.sortCheck').hide()
    $(this).addClass('active').siblings('li').removeClass('active')
    $(this).find('.sortCheck').show()
    $('.triangle').removeClass('triangle_ratate')
    // if (paginationObj.pagesize === 16) {
    //   $('.productContainer .product-item').css({ width: '24%' })
    //   $('.productContainer .product-item a').css({ height: '383px' })
    // } else {
    //   $('.productContainer .product-item').css({ width: '32%' })
    //   $('.productContainer .product-item a').css({ height: '518px' })
    // }
  })
  // 三列排
  $('#three_colums').on('click', function () {
    $('.three_colums_isActive').show()
    $('.three_colums_notActive').hide()
    $('.four_cloums_notActive').show()
    $('.four_cloums_isActive').hide()
    paginationObj.currentPage = 1
    paginationObj.pagesize = 12
    pagination.init(paginationObj)
    // searchResult = delItemsFn(searchResult)
    // let productList = [...prevArr, ...searchResult]
    render(searchResult, 1)
    // $('.productContainer').css('grid-template-columns', 'repeat(3, 1fr)')
    $('.productContainer .product-item').css({
      width: 'calc(33.33% - 25px)'
    })
    // $('.productContainer .product-item').css({ width: '32%' })
    // $('.productContainer .product-item a').css({ height: '518px' })
  })
  // 四列排
  $('#four_cloums').on('click', function () {
    $('.three_colums_isActive').hide()
    $('.three_colums_notActive').show()
    $('.four_cloums_notActive').hide()
    $('.four_cloums_isActive').show()
    paginationObj.currentPage = 1
    paginationObj.pagesize = 16
    pagination.init(paginationObj)
    // searchResult = delItemsFn(searchResult)
    // let productList = [...prevArr, ...searchResult]
    render(searchResult, 1)
    $('.productContainer .product-item').css({
      width: 'calc(25% - 25px)'
    })
    // $('.productContainer .product-item').css({ width: '24%' })
    // $('.productContainer .product-item a').css({ height: '383px' })
    // $('.productContainer').css('grid-template-columns', 'repeat(4, 1fr)')
  })
})