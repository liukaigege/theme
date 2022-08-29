$(document).ready(function () {
  // console.log(INDEXDATA)
  initSwiper()
  var mySwiperBanner
  const ele = $('.productsItemsStyle2-img img')
  for (let i = 0; i < ele.length; i++) {
    if (ele.eq(i).width() > ele.eq(i).height()) {
      ele.eq(i).css({
        width: '100%'
      })
    } else {
      // ele.eq(i).css({ height: '100%' })
    }
  }
})

function initSwiper() {
  var interval = $('.banner').attr('interval') * 1000
  mySwiperBanner = new Swiper('.banner .swiper-container', {
    observer: true, //修改swiper自己或子元素时，自动初始化swiper
    observeParents: true, //修改swiper的父元素时，自动初始化swiper
    spaceBetween: 0,
    pagination: {
      el: '.banner .swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.banner .swiper-button-next',
      prevEl: '.banner .swiper-button-prev',
      disabledClass: 'my-button-disabled',
    },
    loop: true,
    autoplay: {
      delay: interval,
      disableOnInteraction: false,
    },
    lazy: {
      loadPrevNext: true, // 轮播懒加载
    },
    pauseOnMouseEnter: true
  })

  $('.recommend').each(function () {
    var isMobilePhone = $('#isMobilePhone').attr('value')
    var perLineNum = $(this).attr('perLineNum')
    const isCategorySwiper = $(this).hasClass("recommendCategory-swiper-pc")
    var id = '#' + $(this).attr('id')
    var sectionId = '#' + $(this).attr('sectionId')
    new Swiper(id, {
      observer: true, //修改swiper自己或子元素时，自动初始化swiper
      observeParents: true, //修改swiper的父元素时，自动初始化swiper
      slidesPerView: isMobilePhone == 1 ? 'auto' : (isCategorySwiper ? 1 : perLineNum),
      watchSlidesProgress: isMobilePhone == 1,
      watchSlidesVisibility: isMobilePhone == 1,
      spaceBetween: isMobilePhone == 1 ? 0 : 30,
      navigation: {
        nextEl: `${id} .swiper-button-next`,
        prevEl: `${id} .swiper-button-prev`,
      },
      lazy: {
        loadPrevNext: true,
      },
      pauseOnMouseEnter: true,
    })
  })

  // 初始页脚化轮播模块
  wapSwiperFn()
}

function wapSwiperFn() {
  new Swiper(`#${$('.footer').attr('id')} .swiper-container`, {
    loop: false,
    pagination: {
      el: '.swiper-pagination',
      dynamicBullets: true,
    },
    lazy: {
      loadPrevNext: true, // 轮播懒加载
    },
    pauseOnMouseEnter: true
  })
}