$(document).ready(function () {
    var currentRate=''
    if(localStorage.getItem('currentRate')){
      currentRate = JSON.parse(localStorage.getItem('currentRate'))
    }else{
      currentRate=CONFIGDATA.currency.filter(v=>{v.mainCurrency==1})[0]
    }
    $('.coutriesShow .coutriesFlag img').attr('src',currentRate.pic)
    $('.coutriesShow .coutriesMoney').html(currentRate.currency)
    $('.coutriesShow').show();
    let str='';
    CONFIGDATA.currency.map((v,i)=>{
      if(v.currency==currentRate.currency){
        str+=`<li class="coutries_list clearfix actived">
          <img src="${v.pic}" alt="" class="fl coutries_list_flag">
          <div class="fl coutries_list_text">${v.currency}</div>
          <img src="../assets/wap/images/gou_icon@2x.png" alt="" class="fr choose_image">
        </li>`
      } else{
        str+=`<li class="coutries_list clearfix">
          <img src="${v.pic}" alt="" class="fl coutries_list_flag">
          <div class="fl coutries_list_text">${v.currency}</div>
          <img src="../assets/wap/images/gou_icon@2x.png" alt="" class="fr choose_image">
        </li>`
      }
    })
  $('.coutries_list_container').html(str)
  var navList = INDEXDATA.filter((item) => item.typeId === 1)[0].config
    .catalogue.list
  $('#toolbar-menu').on('click',function () {
    $('#menu-outer').animate({ left: 0 })
    $('#modal').show()
    forbidScroll()
  })
  clickoutSide('menu-outer', function () {
    $('#menu-outer').stop(true,false).animate({ left: '-100%' })
    $('#modal').hide()
    allowScroll()
  })
  clickoutSide('menu-inner', function () {
    $('#menu-inner').stop(true,false).animate({ left: '-100%' })
    $('#modal').hide()
    allowScroll()
  })
  $('#close-outer').click(function () {
    $('#menu-outer').stop(true,false).animate({ left: '-100%' })
    $('#modal').hide()
    allowScroll()
  })
  $('#back-inner').click(function () {
    $('#menu-inner').stop(true,false).animate({ left: '-100%' })
  })

  $('#top-actived #actived-close').on('click', function () {
    $('#top-actived').hide()
    // 计算头部高度
    let $window_height = window.innerHeight
    let $height =
      $window_height > window.innerHeight ? $window_height : window.innerHeight
    let header_h = parseFloat($('.header-warp').height())
    // 购物车开关
    let cart_h = $height - header_h
    $('.cart_w').height(cart_h)
    $('.cart_w').css('top', header_h)
  })
  $('.menuItems').click(function () {
    var categoryId = $(this).attr('categoryId')
    var obj = navList.filter((item) => item.id == categoryId)[0]
    console.log(obj)
    $('#menu-inner .title').text(obj.name)

    if ((obj.linkType == 0 && obj.picWap) || (obj.linkType == 0 && obj.picPc)) {
      $('#menu-inner .menu-mainImg').css(
        'background-image',
        `url(${returnSuffixUrl(obj.picWap || obj.picPc)})`
      )
      $('#menu-inner .menu-mainImg').attr(
        'onclick',
        `routerJump('${obj.linkUrl}','${obj.linkStatus}')`
      )
    } else {
      $('.menuMainImg-inner').hide()
    }

    $('#menu-inner .menu-list-card p:first').text(obj.name)
    $('#menu-inner .menu-list-card').attr(
      'onclick',
      `routerJump('${obj.linkUrl}','${obj.linkStatus}')`
    )
    var names = obj.childList
      .map((item) => {
        return item.name
      })
      .join(',')
    if (names.length) {
      $('#menu-inner .menu-list-card .menu-list-card-content .names').remove()
      $('#menu-inner .menu-list-card .menu-list-card-content').append(
        `<p class="overflow_1 names">${names}</p>`
      )
    } else {
      $('#menu-inner .menu-list-card .menu-list-card-content').css({
        display: 'flex',
        'align-items': 'center',
      })
    }

    var html = ''
    obj.childList.map((item) => {
      if (item.pic) {
        var pic = returnSuffixUrl(item.pic)
      } else if (
        (item.linkType === 0 && !item.pic && item.picGoods) ||
        (item.linkType === 1 && !item.pic) ||
        (item.linkType === 2 && !item.pic)
      ) {
        var pic = returnSuffixUrl(item.picGoods)
      } else {
        var pic = '../assets/wap/images/bg-categorymenu@2x.png'
      }
      html =
        html +
        `
        <a href="javascript:;" onclick="routerJump('${item.linkUrl}','${item.linkStatus}')" class="menu-list-item">
          <div class="menu-list-item-content bg" style="background-image:url(${pic})"></div>
          <p class="overflow_1">${item.name}</p>
        </a>
        `
    })
    $('#menu-inner').animate({ left: '0' })
    $('#menu-inner .menu-list').html(html)
  })

  $('.coutriesShow').on('click',function(){
    var currentRate=''
    if(localStorage.getItem('currentRate')){
      currentRate = JSON.parse(localStorage.getItem('currentRate'))
    }else{
      currentRate=CONFIGDATA.currency.filter(v=>{v.mainCurrency==1})[0]
    }
    for(var i=0;i<$('.coutries_list_container .coutries_list').length;i++){
      if($('.coutries_list_container li .coutries_list_text').eq(i).text()==currentRate.currency){
        $('.coutries_list_container .coutries_list').eq(i).addClass('actived')
        $('.coutries_list_container .coutries_list').eq(i).siblings('li').removeClass('actived')
      }
    }
    $('.wap_money_list_outer_container').removeClass('wap_money_list_outer_container_hide').addClass('wap_money_list_outer_container_show')
  })
  $('.wap_money_list_outer_container').on('click','.leftArrow',function(){
    $('.wap_money_list_outer_container').removeClass('wap_money_list_outer_container_show').addClass('wap_money_list_outer_container_hide')
  }).on('click','.coutries_list_container .coutries_list',function(){
    currentRate=CONFIGDATA.currency.filter(v=>v.currency==$(this).children('.coutries_list_text').text().trim())[0]
    localStorage.setItem('currentRate',JSON.stringify(currentRate))
    if($('.coutries_list_container').data('id')){//首页和产品列表页，陈斌已解决局部渲染问题。
      $('.coutriesShow .coutriesFlag img').attr('src',currentRate.pic)
      $('.coutriesShow .coutriesMoney').html(currentRate.currency)
      $('#currency .currency-icon').css(
        'background-image',
        `url(${currentRate.pic})`
      )
      $('#currency .currency-text').text(currentRate.currency)
      $(this).addClass('actived').siblings('.coutries_list').removeClass('actived')
      $('.wap_money_list_outer_container').removeClass('wap_money_list_outer_container_show').addClass('wap_money_list_outer_container_hide')
      $('#close-outer').click()
      switchRate() //全局更换价格
    }else{
      location.reload()
    }
  }).on('click','.wap_money_list_container_masker',function(){
    $('.wap_money_list_outer_container').removeClass('wap_money_list_outer_container_show').addClass('wap_money_list_outer_container_hide')
  })
})
function clickoutSide(id, callback) {
  // 全局注册点击事件
  $('#modal').on('click', function (e) {
    //若点击元素为目标元素则返回
    if (e.target.id === id) return
    //否则执行回调函数
    callback()
  })
}

$(document).ready(function () {
  // pinterest 埋点数据 ~~~~~Start~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  var pinterestSetData={
    pinterestYOUR_TAG_ID:'',
    pinterestEventType:'pagevisit',
    pinterestData:{
      product_name:$('title').text().replace('"','“'),
      attribute:window.location.href
    }
  }
  pinterestFn(pinterestSetData)
  // pinterest 埋点数据 ~~~~~End~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
})