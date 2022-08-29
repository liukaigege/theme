const { getData, registerEngine, setView } = require('../tools/utils') // 引入树形数组转换函数
const assetsConfig = require(`../pages/Emperor/config/setting_assets.json`)
const { mkdirSync, copyFile } = require('../tools/dir') // 引入复制文件夹函数
const fs = require('fs')
const path = require('path')
const buildRoot = path.join(__dirname, '../../', 'build') // 设置打包后文件的路径
// 新模板实时渲染
async function newBlock(req, res, next) {
	const data = req.body
	if (!data.typeId) {
		res.json({ code: 500, data: null, message: '模板不存在' })
		return
	}
	const typeNameList = ['pageHeader', 'banner', 'category', 'products', 'poster', 'video', 'subscribe', 'pageFooter', 'global-var']
	const liquidName = typeNameList[data.typeId - 1]
	res.render(`${liquidName}`, { configData: data, isLocal: 1, htmlName: 'index', prePath: '../temptheme/' }, (err, html) => {
		let renderHtml = ''
		if (liquidName === 'global-var') {
			// 全局样式加在头部标签里
			renderHtml = html
		} else {
			renderHtml = `<div class="vshop-section" section-name="${liquidName}" section-id="${data.sectionId}">` + html + `</div>`
		}
		if (err) {
			console.log(liquidName + '模板渲染失败!', err)
			res.json({ code: 500, data: err, message: '模板渲染失败' })
		} else {
			res.json({
				code: 200,
				data: { htmlPc: renderHtml, htmlWap: renderHtml },
				message: '操作成功',
			})
		}
	})
}

// 重新渲染预览积木文件，保证用户下次进入看到的是保存更新后的效果
async function newBlockInit(req, res, next) {
	const { templateName, domain, lang, isIframe } = req.query
	setView(req.app, templateName, domain)
	// 注册liquid
	registerEngine(req.app, templateName)
	// assetsData  该页面所需静态资源配置

	getData(domain, templateName, true).then((data) => {
		//创建文件夹
		mkdirSync(path.join(buildRoot, domain))
		mkdirSync(path.join(buildRoot, domain, 'temptheme'))
		mkdirSync(path.join(buildRoot, domain, `temptheme/${templateName}`))
		// 复制静态资源
		copyFile(path.join(`./pages/${templateName}/assets`), path.join(buildRoot, domain, `temptheme/assets`), function () {
			console.log(templateName + '静态资源复制完成')
			// fs.writeFileSync(
			// 	path.resolve(buildRoot, domain, 'temptheme/assets/js/globalVariable.js'),
			// 	`var BASEDATA=${JSON.stringify(data.baseData)};
			// 	var CATEGORYDATA=${JSON.stringify(data.categoryData)};
			// 	var CONFIGDATA=${JSON.stringify(data.configData)};
			// 	var DETAILDATA=${JSON.stringify(data.detailData)};
			// 	var INDEXDATA=${JSON.stringify(data.indexData)};
			// 	`
			// )
			let jsonData = {
				...data,
				version: new Date().getTime(),
				assetsData: assetsConfig.index,
				shopName: domain,
				isIframe,
				templateName,
				lang,
			}
			res.render('index', jsonData, function (err, html) {
				if (err) res.send(err)
				else {
					res.send(html)
				}
			})
		})
	})
}

async function newBlockSave(req, res, next) {
	const { data, domain, templateName } = req.body
	setView(req.app, templateName, domain)
	registerEngine(req.app, templateName)
	const buildRoot = path.join(__dirname, '../config', domain)
	fs.writeFile(path.join(buildRoot, 'preview.json'), JSON.stringify(data), (err) => {
		if (err) {
			res.json({ code: 500, data: [], message: '文件写入操作失败' })
		}
		res.json({
			code: 200,
			data: 'preview.json',
			message: '操作完成',
		})
	})
}
module.exports = {
	newBlock,
	newBlockInit,
	newBlockSave,
}
