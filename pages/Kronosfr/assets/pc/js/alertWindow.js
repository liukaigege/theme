/*
    公共弹框事件
 */
    jQuery.extend({
      alertWindow:function(title,content,bgcolor,alertHtml){
          var title = title; //标题
          var content = content; //内容
          var color1; //背景颜色
          if(bgcolor===undefined){
              color1 = "#FF7C00";
          }else{
              color1 = bgcolor;
          }
          //查找body中是否存在该消息框
          if($("body").find(".alertWindow1").length===0){
          //不存在
              $("body").append(alertHtml);
              /*
               绑定事件
               */
              var $alertWindow = $(".alertWindow1"); //窗口对象
              //关闭按钮
              $("#alertWindowCloseButton").click(function(){
                  $alertWindow.hide();
              });
          }else{
          //存在
              //设置标题
              $(".alertWindowTitle").text(title);
              //设置内容
              $(".alertWindowContent").text(content);
              //显示
              $(".alertWindow1").show();
          }
      }
  });