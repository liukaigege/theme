$(document).ready(function () {
  function wapSwiperFn(){
    new Swiper(`#${$('.footer').attr('id')} .swiper-container`, {
      loop: false,
      pagination: {
        el: '.swiper-pagination',
        dynamicBullets: true,
      },
      lazy: {
        loadPrevNext: true, // 轮播懒加载
      },
    })
  }
  if(!$('.banner').length){
    wapSwiperFn()
  }
  if(getParam('pageid')){
    $('.wap_block_footer.pageFooter').css({
      'padding-bottom': '0.28rem'
    })
  }
  $('#foot-notice #active-close ').on('click', function () {
    $('#foot-notice').hide()
    $('.wap_block_footer').css({'padding-bottom':0})
  })
  $('.link-item p').on('click', function () {
    $(this).siblings('.menuExtend').toggle(300)
    $(this).find('.link-icon').toggleClass('rotate')
  })
  $('#currency').on('click', function () {
    $('.currencyBox').animate({ bottom: 0 })
    var currentRate=''
    if(localStorage.getItem('currentRate')){
      currentRate = JSON.parse(localStorage.getItem('currentRate'))
    }else{
      currentRate=CONFIGDATA.currency.filter(v=>{v.mainCurrency==1})[0]
    }
    for(var i=0;i<$('.currencyExtend li').length;i++){
      if($('.currencyExtend li').eq(i).attr('currencyId')==currentRate.currency){
        $('.currencyExtend li').eq(i).find('.choose_image').show()
        $('.currencyExtend li').eq(i).siblings('li').find('.choose_image').hide()
      }
    }
  })
  $('#currency-close').on('click', function () {
    $('.currencyBox').animate({ bottom: '-100%' })
  })
  // 切换汇率

  $('.currencyExtend li').on('click', function () {
    for (let i = 0; i < CONFIGDATA.currency.length; i++) {
      if (CONFIGDATA.currency[i].currency == $(this).attr('currencyId')) {
        localStorage.setItem(
          'currentRate',
          JSON.stringify(CONFIGDATA.currency[i])
        )
        console.log(CONFIGDATA.currency[i])
        $('#currency .currency-icon').css(
          'background-image',
          `url(${CONFIGDATA.currency[i].pic})`
        )
        $('#currency .currency-text').text(CONFIGDATA.currency[i].currency)
        switchRate() //全局更换价格
        $('.currencyBox').animate({ bottom: '-100%' })
        $('this').find('.choose_image').show()
        $('this').siblings('li').find('.choose_image').hide()
        $('.coutriesShow .coutriesFlag img').attr('src',CONFIGDATA.currency[i].pic)
        $('.coutriesShow .coutriesMoney').html(CONFIGDATA.currency[i].currency)
      }
    }
  })
})
function callbackCurreny(currentRate) {
  $('#currency .currency-icon').css(
    'background-image',
    `url(${currentRate.pic})`
  )
  $('#currency .currency-text').text(currentRate.currency)
}
