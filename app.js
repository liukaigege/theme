const express = require('express')
const path = require('path')
const app = express()
const router = require('./routes/index')
const fs = require('fs')
const { setView, registerEngine } = require('./tools/utils')

const port = process.env.NODE_POOT
if (process.env.NODE_ENV == 'dev') {
	// 开发环境，新模板调试
	let tempName = 'Emperor'
	// 注册liquid
	registerEngine(app, tempName)
	// 设置模板路径
	setView(app, tempName)
	// 静态资源
	app.use(express.static(path.join(__dirname, 'pages', tempName)))
}

app.use(express.json({ limit: '2100000kb' })) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.all('*', function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Headers', 'content-type')
	res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
	next()
})
app.set('view engine', 'liquid') // 设置liquid渲染引擎为默认渲染引擎
app.listen(port, function (err) {
	console.log('服务启动在: http://localhost:' + port)
})
app.use('/', router)

fs.mkdir(path.join(__dirname, '../build'), function (err) {
	if (err) {
		console.log('文件目录已存在!')
		return false
	}
	console.log('build文件目录已创建!')
})
fs.mkdir(path.join(__dirname, '../resources'), function (err) {
	if (err) {
		console.log('资源目录已存在!')
		return false
	}
	console.log('resources文件目录已创建!')
})
module.exports = app
