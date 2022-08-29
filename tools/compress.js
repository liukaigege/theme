const fs = require('fs')
const path = require('path')
const minify = require('html-minifier').minify
const UglifyJS = require('uglify-js')
var noCompressFiles = [
  // 免压缩文件
  'jquery.js',
  'swiper-bundle.min.js',
  'aliplayer-min.js',
  'aliyun-oss-sdk.min.js',
  'enc-base64-min.js',
  'jquery.imagezoom.min.js',
  'jscomp.js',
  'jquery.base64.js',
  'jquery.url.js',
  'jquery.SuperSlide.js',
  'iscroll.js',
  'animate.css',
  'aliplayer-min.css',
  'swiper.min.css',
  'core-min.js',
]
/**
 * 遍历文件
 * @param {*} dir 文件夹
 * @param {*} callback 回调函数
 * @param {*} newPath 压缩文件路径
 */
function compress(dir) {
  var files = fs.readdirSync(dir, 'utf8')
  files.forEach((file) => {
    var pathname = path.join(dir, file)
    var stats = fs.statSync(pathname)
    if (stats.isDirectory()) {
      // 图片和字体不参与压缩及部分文件
      if (
        !pathname.endsWith('images') &&
        !pathname.endsWith('fonts') &&
        !pathname.endsWith('layui') &&
        !pathname.endsWith('img')
      ) {
        compress(pathname)
      }
    } else {
      try {
        if (pathname.endsWith('js') && noCompressFiles.indexOf(file) === -1) {
          var data = fs.readFileSync(pathname, 'utf8')
          fs.writeFileSync(
            pathname,
            UglifyJS.minify(data, {
              compress: {
                drop_console: true, // 清除console.log语句
              },
            }).code
          )
          // console.log("压缩完成：" + pathname);
        } else if (
          (pathname.endsWith('css') || pathname.endsWith('html')) &&
          noCompressFiles.indexOf(file) === -1
        ) {
          var data = fs.readFileSync(pathname, 'utf8')
          fs.writeFileSync(
            pathname,
            minify(data, {
              removeComments: true,
              collapseWhitespace: true,
              minifyJS: true,
              minifyCSS: true,
            })
          )
        }
      } catch (e) {
        console.error('压缩失败：' + pathname)
      }
    }
  })
}

module.exports = {
  compress,
}
