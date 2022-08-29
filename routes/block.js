const axios = require('axios')
const getPromise = axios.get
const fs = require('fs')
const path = require('path')
const { copyFile, mkdirSync } = require('../tools/dir') // 引入复制文件夹函数
const { filterLiquidName } = require('../tools/utils') // 引入树形数组转换函数
const testUrl = 'http://zhujingjuan.phigogroup.com/data/' // 开发环境获取json文件地址
const buildRoot = path.join(__dirname, '../../', 'build') // 设置打包后文件的路径
const { setView, registerEngine } = require('../tools/utils')
async function block(req, res, next) {
	const data = req.body
	if (!data.typeId) {
		console.log('参数不正确，模板不存在')
		res.json({ code: 500, data: null, message: '模板不存在' })
		return
	}
	const liquidName = filterLiquidName(data.typeId - 1)
	const isExist = data.isExist // 当前页面中是否存在此模块，如果存在说明页面中已经含有对应的css 和 js
	var htmlPc = '',
		htmlWap = ''
	var len = 0
	res.render(`${data.templateName}/home/components/${liquidName}`, { configData: data, isMobilePhone: 0, isLocal: 1, htmlName: 'index' }, (err, html) => {
		if (err) {
			console.log(liquidName + '模板渲染失败!', err)
			res.json({ code: 500, data: err, message: '模板渲染失败' })
		} else {
			htmlPc = html
		}
		len++
		if (len === 2) {
			res.json({
				code: 200,
				data: { htmlPc: htmlPc, htmlWap: htmlWap },
				message: '操作成功',
			})
		}
	})
	res.render(`${data.templateName}/home/components/${liquidName}`, { configData: data, isMobilePhone: 1, isLocal: 1, htmlName: 'index' }, (err, html) => {
		if (err) {
			console.log(liquidName + '模板渲染失败!', err)
			res.json({ code: 500, data: err, message: '模板渲染失败' })
		} else {
			htmlWap = html
		}
		len++
		if (len === 2) {
			res.json({
				code: 200,
				data: { htmlPc: htmlPc, htmlWap: htmlWap },
				message: '操作成功',
			})
		}
	})
}

// 重新渲染预览积木文件，保证用户下次进入看到的是保存更新后的效果
async function blockInit(req, res, next) {
	const VERSION = new Date().getTime() // 以时间戳作为版本
	let { data, domain, templateName } = req.body
	registerEngine(req.app, templateName)
	setView(req.app, templateName)
	console.log(domain, templateName)
	console.log('**开始重新渲染' + domain + '的首页预览页面**')
	//创建文件夹
	mkdirSync(path.join(buildRoot, domain))
	mkdirSync(path.join(buildRoot, domain, 'temptheme'))
	mkdirSync(path.join(buildRoot, domain, `temptheme/${templateName}`))
	// 复制静态资源
	copyFile(path.join(`./pages/${templateName}/assets`), path.join(buildRoot, domain, `temptheme/${templateName}/assets`), function () {
		console.log(templateName + '静态资源复制完成')
	})
	if (process.env.NODE_ENV === 'dev') {
		var baseData, categoryData, configData, detailData
		let jsonList = ['base', 'category', 'config', 'detail']
		await Promise.all(jsonList.map((item) => getPromise(`${testUrl}/${item}.json`))).then((res) => {
			baseData = res[0].data
			categoryData = res[1].data
			configData = res[2].data
			detailData = res[3].data
		})
	} else {
		var baseData = JSON.parse(fs.readFileSync(`config/${domain}/base.json`))
		var categoryData = JSON.parse(fs.readFileSync(`config/${domain}/category.json`))
		var configData = JSON.parse(fs.readFileSync(`config/${domain}/config.json`))
		var detailData = JSON.parse(fs.readFileSync(`config/${domain}/detail.json`))
		// var indexData = JSON.parse(fs.readFileSync(`config/${domain}/index.json`))
	}
	var OBJ = {
		baseData,
		categoryData,
		configData,
		detailData,
		indexData: data,
	}
	mkdirSync(path.join(buildRoot, domain, `temptheme/${templateName}/data`))
	// 定义全局变量文件
	fs.writeFileSync(
		path.resolve(path.join(buildRoot), `${domain}/temptheme/${templateName}/data/globalVariable.js`),
		`var BASEDATA=${JSON.stringify(OBJ.baseData)};var CATEGORYDATA=${JSON.stringify(OBJ.categoryData)};var CONFIGDATA=${JSON.stringify(
			OBJ.configData
		)};var DETAILDATA=${JSON.stringify(OBJ.detailData)};var INDEXDATA=${JSON.stringify(OBJ.indexData)};`
	)
	var blockData = data
	var num = 0
	// isMobilePhone 1:移动端，0: pc端
	res.render(`${templateName}/home/index`, { blockData, isMobilePhone: 0, VERSION, OBJ, htmlName: 'index' }, (err, html) => {
		if (err) {
			console.log('预览模板渲染更新失败!', err)
			reject(err)
		} else {
			mkdirSync(path.join(buildRoot, domain, `temptheme/${templateName}/pc`))
			fs.writeFileSync(path.join(buildRoot, domain, `temptheme/${templateName}/pc/index.html`), html)
			num++
			if (num === 2) {
				console.log('预览模板渲染完成')
				res.json({
					code: 200,
					data: null,
					message: '操作成功',
				})
			}
		}
	})
	res.render(`${templateName}/home/index`, { blockData, isMobilePhone: 1, VERSION, OBJ, htmlName: 'index' }, (err, html) => {
		if (err) {
			console.log('预览模板渲染更新失败!', err)
			reject(err)
		} else {
			mkdirSync(path.join(buildRoot, domain, `temptheme/${templateName}/wap`))
			fs.writeFileSync(path.join(buildRoot, domain, `temptheme/${templateName}/wap/index.html`), html)
			num++
			if (num === 2) {
				console.log('预览模板渲染完成')
				res.json({
					code: 200,
					data: null,
					message: '操作成功',
				})
			}
		}
	})
}

module.exports = {
	block,
	blockInit,
}
