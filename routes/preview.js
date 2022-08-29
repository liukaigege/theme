const fs = require('fs')
const path = require('path')
const buildRoot = path.join(__dirname, '../../', 'build') // 设置打包后文件的路径
const { getData } = require("../tools/utils")
function preview(req, res) {
	const templateName = req.body.shop.templateName
	let oldTemplate = ['Athena', 'Kronos', 'Kronosfr']
	// 旧模板预览
	if (oldTemplate.includes(templateName)) previewOld(req, res)
	// 新模板预览
	else previewNew(req, res)
}
function previewNew(req, res) {
	const domain = req.body.shop.tempDomain
	const templateName = req.body.shop.templateName
	const ROWS = req.body.details
	getData(domain,templateName).then(data => {
		res.render('productDetail',{...data, assetsData: data.assetsConfig['productDetail'], ROWS: ROWS[0],isView: '1'},(err,html) => {
			if(err) res.json({ code: 500, data: err, message: '详情编译失败' })
			else fs.writeFile(path.join(buildRoot, domain,'./pages/detailPreview.html'),html,err1 => {
				if(err1) res.json({ code: 500, data: [], message: '文件写入操作失败' })
				else res.json({	code: 200,data: 'detailPreview.html',message: '操作完成'})
			})
		})
	})
}

function previewOld(req, res) {
	console.log('开始渲染详情页面')
	const domain = req.body.shop.tempDomain
	const templateName = req.body.shop.templateName
	const ROWS = req.body.details
	const isPreview = true // 告诉模板当前是否为预览
	// 保存json数据
	let file_json = path.resolve(
		path.join(buildRoot, domain, 'data'),
		'previewDetail.json'
	)
	fs.writeFile(file_json, JSON.stringify(ROWS), (err) => {
		if (err) {
			res.json({ code: 500, data: [], message: '写入json文件失败' })
		}
	})

	// 2. 读取配置文件
	var CONFIGS = require(`../config/${templateName}.js`)
	console.log('读取配置文件完成')
	// 3. 读取json文件
	var baseData = JSON.parse(fs.readFileSync(`config/${domain}/base.json`))
	var categoryData = JSON.parse(
		fs.readFileSync(`config/${domain}/category.json`)
	)
	var configData = JSON.parse(fs.readFileSync(`config/${domain}/config.json`))
	var detailData = JSON.parse(fs.readFileSync(`config/${domain}/detail.json`))
	var indexData = JSON.parse(fs.readFileSync(`config/${domain}/index.json`))
	console.log('读取json文件完成')
	// 4. 渲染模板
	var data = {
		baseData,
		categoryData,
		configData,
		detailData,
		indexData,
		CONFIGS,
	}
	// 渲染模板
	res.render(
		path.join(`${templateName}/pc/productDetail`),
		{ data, ROWS: ROWS[0], isPreview, blockData: indexData, isMobilePhone: 0 },
		(err, html) => {
			if (err) {
				res.json({
					code: 500,
					data: [],
					message: '模板渲染操作失败，没有找到对应的模板',
				})
			} else {
				let file = path.resolve(
					path.join(buildRoot, domain),
					`./pc/detailPreview.html`
				)
				fs.writeFile(file, html, { encoding: 'utf8' }, (err) => {
					if (err) {
						res.json({ code: 500, data: [], message: '文件写入操作失败' })
					}
					res.json({
						code: 200,
						data: 'detailPreview.html',
						message: '操作完成',
					})
				})
			}
		}
	)
}

module.exports = {
	preview,
}
