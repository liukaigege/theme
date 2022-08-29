const path = require('path')
const axios = require('axios')
const { readFile } = require('fs').promises
// 将树形数据转成一维数组
function jsonToArray(nodes) {
	var r = []
	if (Array.isArray(nodes)) {
		for (var i = 0, l = nodes.length; i < l; i++) {
			r.push(nodes[i]) // 取每项数据放入一个新数组
			if (Array.isArray(nodes[i]['childList']) && nodes[i]['childList'].length > 0)
				// 若存在childList则递归调用，把数据拼接到新数组中，并且删除该childList
				r = r.concat(jsonToArray(nodes[i]['childList']))
		}
	}
	return r
}
/**
 * 校验折扣活动的有效期
 * @param {*} start
 * @param {*} end
 * @returns
 */
function isEffective(start, end) {
	var now = new Date().getTime()
	var s = new Date(start).getTime()
	var e = new Date(end).getTime()
	if ((now >= s && now <= e) || (start && !end)) {
		return true
	}
	return false
}
function findProducts(obj) {
	var arr = []
	if (obj.goodsList && obj.goodsList.length) {
		arr = [...arr, ...obj.goodsList]
	}
	if (obj.childList && obj.childList.length) {
		for (let i = 0; i < obj.childList.length; i++) {
			if (obj.childList[i].goodsList && obj.childList[i].goodsList.length) {
				arr = [...arr, ...obj.childList[i].goodsList]
				if (obj.childList[i].childList && obj.childList[i].childList.length) {
					findProducts(obj.childList[i].childList)
				}
			}
		}
	}
	return arr
}
function filterLiquidName(typeId) {
	let typeList = ['pageHeader', 'banner', 'category', 'products', 'poster', 'video', 'subscribe', 'pageFooter']
	return typeList[typeId]
}
function getStrValue(str, data) {
	let res = data
	var paths = str.split('.')
	while (paths.length > 0) {
		res = res[paths.shift()]
	}
	return res || str
}
function setView(app, templateName, domain) {
	let oldTemplate = ['Athena', 'Kronos', 'Kronosfr']
	if (oldTemplate.includes(templateName)) {
		app.set('views', path.resolve(__dirname, '../pages'))
	} else {
		let root = path.resolve(__dirname, '../pages', templateName)
		if (process.env.NODE_ENV !== 'dev') {
			// 生产环境
			root = path.resolve(__dirname, '../../resources', domain, templateName)
		}
		let temFolders = ['templates', 'snippets', 'sections', 'layout']
		app.set(
			'views',
			temFolders.map((item) => path.resolve(root, item))
		)
	}
}
function registerEngine(app, templateName) {
	let engine = require(`../pages/${templateName}/engine`)
	app.engine('liquid', engine.express()) // 注册liquid
}
function getData(domain, templateName, isPreview = false) {
	return new Promise((res, rej) => {
		// 主页渲染模块部分  头部  轮播图 分类模块  商品模块  海报  视频  订阅  底部 全局配置
		const typeNameList = ['pageHeader', 'banner', 'category', 'products', 'poster', 'video', 'subscribe', 'pageFooter', 'global-var']
		const fixedTemplateId = [1, 8, 9] // 固定模板，不需要动态渲染（）
		let baseData, categoryData, configData, detailData, indexData, headerData, footerData, globalVarData, indexTemplateData, lang
		let resFourData
		let jsonList = ['base', 'category', 'config', 'detail', 'index', 'preview']
		let promiseList = []
		if (process.env.NODE_ENV === 'dev') {
			promiseList = jsonList.map((item) => axios.get(`http://${domain}.phigogroup.com/data/${item}.json`))
		} else {
			promiseList = jsonList.map((item) => readFile(`config/${domain}/${item}.json`))
		}
		// 版本号 为了除去资源缓存
		const version = new Date().getTime()
		// 模板配置资源
		let configPath = path.resolve(__dirname, `../../resources/${domain}/${templateName}/config`)
		const settingData = require(path.join(configPath, 'setting_data.json'))
		const assetsConfig = require(path.join(configPath, 'setting_assets.json'))
		return Promise.all(promiseList)
			.then((arr) => {
				if (process.env.NODE_ENV == 'dev') arr = arr.map((o) => o.data)
				else arr = arr.map((str) => JSON.parse(str))
				baseData = arr[0]
				lang = baseData.templateLanguage
				categoryData = arr[1]
				configData = arr[2]
				detailData = arr[3]
				resFourData = arr[4]
				// 预览的情况下使用preview数据
				if (isPreview) resFourData = arr[5] || arr[4]
				resFourData.forEach((item) => {
					item.templateName = typeNameList[item.typeId * 1 - 1]
				})
				indexData = resFourData
				// 除了头部底部和全局配置模块以外，返回的其他模板需要循环动态渲染到主页
				indexTemplateData = resFourData.filter((_item) => !fixedTemplateId.includes(_item.typeId))
				globalVarData = resFourData.find((_item) => _item.typeId == 9) // 全局配置数据
				headerData = resFourData.find((_item) => _item.typeId == 1) // 头部数据
				footerData = resFourData.find((_item) => _item.typeId == 8) // 底部数据
				res({
					baseData,
					categoryData,
					configData,
					detailData,
					indexData,
					headerData,
					indexTemplateData,
					footerData,
					globalVarData,
					lang,
					assetsConfig,
					settingData,
					version,
				})
			})
			.catch((rej) => {
				console.log(rej)
			})
	})
}
module.exports = {
	jsonToArray,
	isEffective,
	findProducts,
	filterLiquidName,
	getStrValue,
	setView,
	registerEngine,
	getData,
}
