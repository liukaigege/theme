const axios = require('axios')
const qs = require('qs')
const { getData } = require('../tools/utils')
const settingData = require('../pages/Emperor/config/setting_data.json')
const assetsConfig = require(`../pages/Emperor/config/setting_assets.json`)
var baseUrl = 'http://lican.phigogroup.com'
// 获取数据
var jsonData = {}
getData('lican', 'Emperor').then((data) => {
	jsonData = data
})

// 获取页面
function getPage(req, res) {
	let name = req.path.split('/')[2]
	// 分类列表页使用productList模板
	name = name.includes('productList') ? 'productList' : name
	let ROWS = {}
	if (name.includes('productDetail')) {
		const goodsId = name.split('_')[1]
		ROWS = jsonData.detailData.find((item) => {
			return item.id == goodsId
		})
		name = !!ROWS ? 'productDetail' : 'static404'
	}
	// assetsData  该页面所需静态资源配置
	let data = {
		...jsonData,
		version: new Date().getTime(),
		assetsData: assetsConfig[name],
		shopName: 'lican',
		settingData,
		ROWS,
	}
	res.render(name, data, function (err, html) {
		if (err) res.send(err)
		else {
			res.send(html)
		}
	})
}
// 测试环境转发接口 baseUrl 可以根据店铺自行更改
function forwardReq(req, res) {
	let contentType = req.headers['content-type']
	let isJson = contentType && contentType.indexOf('json') > -1
	axios({
		method: req.method,
		url: `${baseUrl}${req.path}`,
		data: isJson
			? req.body
			: qs.stringify(req.body, {
					encodeValuesOnly: true,
			  }),
		params: req.query,
		headers: req.headers,
	})
		.then((data) => {
			res.send(data.data)
		})
		.catch((e) => {
			res.send({
				err: e,
			})
		})
}

module.exports = {
	forwardReq,
	getPage,
}
