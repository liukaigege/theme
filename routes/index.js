var express = require('express')
var router = express.Router()
const { publish } = require('./publish') // 引入发布接口方法
const { preview } = require('./preview') // 引入预览商品详情方法
const { block, blockInit } = require('./block') // 引入预览商品详情方法
const { newBlock, newBlockInit,newBlockSave } = require('./newBlock') // 引入新模板预览首页
const { newPublish } = require('./newTemplateRouter') // 新模板
const { setView, registerEngine } = require('../tools/utils')
const { forwardReq, getPage } = require('./dev')
// 发布
router
	.get('/node/publish', (req, res) => {
		let { templateName, domain } = req.query
		let oldTemplate = ['Athena', 'Kronos', 'Kronosfr']
		// 注册模板语言
		setView(req.app, templateName, domain)
		// 注册liquid
		registerEngine(req.app, templateName)
		if (oldTemplate.includes(templateName)) publish(req, res)
		else newPublish(req, res)
	})
	// 预览商品详情
	.post('/node/details', (req, res) => {
		const templateName = req.body.shop.templateName
		const domain = req.body.shop.tempDomain
		// 注册模板语言
		setView(req.app, templateName, domain)
		// 注册liquid
		registerEngine(req.app, templateName)
		preview(req, res)
	})
	// 积木装修预览
	.post('/node/renderBlock', (req, res)  => {
		const templateName = req.body.templateName
		const domain = req.body.tempDomain
		// 注册模板语言
		setView(req.app, templateName, domain)
		// 注册liquid
		registerEngine(req.app, templateName)
		block(req, res)
	})
	// 初始化积木
	.post('/node/initBlock', blockInit)
	// 积木装修新渲染
	.post('/node/newRenderBlock', newBlock)
	// 新版主页预览
	.get('/node/index', newBlockInit)
	// 积木保存后进入页面
	.post('/node/saveBlock', newBlockSave)
// 开发的时候调用接口  返回页面
if (process.env.NODE_ENV == 'dev') {
	router.get('/page/*', getPage)
	router.all('/vshop-auth/*', forwardReq)
	router.all('/vshop-site/*', forwardReq)
}

module.exports = router
