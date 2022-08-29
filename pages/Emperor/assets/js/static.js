(function ($) {
  const page_id = $.getParam('pageid')
  $(".static-page-html").load('/static-page' + page_id + '?version=' + new Date().getTime(), '', function () { });
})(window.jQuery);
