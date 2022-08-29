const axios = require("axios");
const getPromise = axios.get;
const fs = require("fs");
const path = require("path");
const buildRoot = path.join(__dirname, "../../", "build"); // 设置打包后文件的路径
const { copyFile, mkdirSync } = require("../tools/dir"); // 引入复制文件夹函数
const { compress } = require("../tools/compress"); // 引入压缩文件方法
const { jsonToArray } = require("../tools/utils"); // 引入树形数组转换函数
const testUrl = "http://lican.phigogroup.com/data/"; // 开发环境获取json文件地址 https://lican.shopvango.com/data/config.json
async function publish(req, res, next) {
	const VERSION = new Date().getTime(); // 以时间戳作为版本
	const templateName = req.query.templateName;
	const domain = req.query.domain;
	const language = req.query.language;
	const newDomain = `${domain}_copy`;
	if (!(templateName && domain && language)) {
		res.json({
			code: 500,
			msg: "缺失参数",
		});
		return;
	}
	console.log(`***********开始发布${domain}***********`);
	// 模板配置
	var CONFIGS = require(`../pages/${templateName}/config/${templateName}.js`);
	CONFIGS.VERSION = VERSION;
	CONFIGS.NODE_ENV = process.env.NODE_ENV;
	if (process.env.NODE_ENV === "dev") {
		var baseData, categoryData, configData, detailData, indexData;
		let jsonList = ["base", "category", "config", "detail", "index",'preview'];
		await Promise.all(
			jsonList.map((item) => getPromise(`${testUrl}/${item}.json`))
		).then((res) => {
			baseData = res[0].data;
			categoryData = res[1].data;
			configData = res[2].data;
			detailData = res[3].data;
			indexData = res[4].data;
		});
	} else {
		var baseData = JSON.parse(
			fs.readFileSync(`config/${domain}/base.json`)
		);
		var categoryData = JSON.parse(
			fs.readFileSync(`config/${domain}/category.json`)
		);
		var configData = JSON.parse(
			fs.readFileSync(`config/${domain}/config.json`)
		);
		var detailData = JSON.parse(
			fs.readFileSync(`config/${domain}/detail.json`)
		);
		var indexData = JSON.parse(
			fs.readFileSync(`config/${domain}/index.json`)
		);
	}
	//组装数据
	var OBJ = {
		baseData,
		categoryData,
		configData,
		detailData,
		indexData,
		CONFIGS,
	};

	// 组装头部导航数据
	const configList = indexData[0].config;
	if (
		configList &&
		configList.catalogue &&
		configList.catalogue.list &&
		configList.catalogue.list.length > 0
	) {
		const productHeaderData = configList.catalogue.list;
		productHeaderData.forEach((item) => {
			item.level = 1;
			if (item.childList && item.childList.length > 0) {
				item.childList.forEach((_item) => {
					_item.parentLinkId = item.linkId;
					_item.parentId = item.id;
					_item.level = 2;
				});
			}
		});
		// 头部菜单对应产品列表左侧侧边栏
		OBJ.productSideData = productHeaderData;
	} else {
		OBJ.productSideData = [];
	}

	const blockData = {
		index: indexData,
		search: [
			{
				typeId: 999999,
				section: "juggle_123456",
				id: "vshop-section-999999",
				config: indexData[0].config,
			},
		],
	};
	if (fs.existsSync(path.join(buildRoot, newDomain)))
		delete_Vshop_Dir(path.join(buildRoot, newDomain)); // 删除 newDomain
	// 创建店铺文件目录
	create_Vshop_Dir(domain, newDomain, templateName, OBJ);
	copyReviewStatic(newDomain, templateName, OBJ);
	// 渲染文件
	renderTemplate(res, newDomain, OBJ, blockData, templateName)
		.then(() => {
			// ****************************方案二*************************************
			fs.writeFileSync(
				path.join(buildRoot, newDomain, "pc/404_pc.html"),
				fs.readFileSync("./static/404_pc.html")
			);
			fs.writeFileSync(
				path.join(buildRoot, newDomain, "wap/404_wap.html"),
				fs.readFileSync("./static/404_wap.html")
			);
			res.json({
				code: 200,
				msg: "发布完成",
			});
			delete_Vshop_Dir(path.join(buildRoot, domain)); // 删除 domain
			fs.renameSync(
				path.join(buildRoot, newDomain),
				path.join(buildRoot, domain)
			);
			// 复制首页作为预览页面
			copyFileToIndex(domain, templateName);
			if (process.env.NODE_ENV !== "dev") {
				// 压缩文件(开发环境不压缩资源)
				console.log("开始压缩资源");
				compress(path.join(buildRoot, domain));
			}
			console.log(`***********${domain}发布完成***********`);
		})
		.catch((err) => {
			console.error("发布失败", err);
			res.json({
				code: 500,
				msg: err,
			});
		});
}

// 渲染雅典娜模板
function renderTemplate(res, newDomain, OBJ, blockData, templateName) {
	if (templateName !== "Emperor") {
		blockData.index = blockData.index.filter((item) => item.typeId != 9);
	}
	return new Promise((reslove, reject) => {
		var renderPages = [
			"information",
			"orderSearch",
			"orderDetail",
			"contact",
			"cart",
			"payment",
			"payment-results",
			"static",
		];
		var blockPages = ["index", "search"];
		var newCategoryData = jsonToArray(OBJ.categoryData.categoryList);
		var num = 0;
		// 需要渲染页面的个数 ，当num===len时说明所有页面渲染完成2 + newCategoryData.length + renderPages.length + data.detailData.length
		var len =
			3 +
			newCategoryData.length +
			renderPages.length +
			OBJ.detailData.length;
		// var len = blockPages.length
		for (let i = 0; i < blockPages.length; i++) {
			render(
				res,
				blockData[blockPages[i]],
				"home/index",
				blockPages[i],
				newDomain,
				(VERSION = OBJ.CONFIGS.VERSION),
				OBJ,
				templateName
			)
				.then(() => {
					console.log(blockPages[i] + "模板渲染完成!");
					num++;
					if (num === len) {
						reslove();
					}
				})
				.catch((err) => {
					num++;
					console.log(blockPages[i] + "模板渲染失败" + err);
					reject(err);
				});
		}
		renderByOld(
			res,
			{
				data: OBJ,
				ROWS: 1,
				blockData: blockData,
			},
			"productList",
			"productList",
			newDomain,
			templateName
		)
			.then(() => {
				console.log("列表页模板渲染完成!");
				num++;
				if (num === len) {
					reslove();
				}
			})
			.catch((err) => {
				num++;
				console.log("列表页模板渲染失败" + err);
				reject(err);
			});
		// 渲染分类页面
		let productNum = 0;
		for (let i = 0; i < newCategoryData.length; i++) {
			renderByOld(
				res,
				{
					data: OBJ,
					ROWS: newCategoryData[i],
					blockData,
				},
				"productList",
				`productList_${newCategoryData[i].id}`,
				newDomain,
				templateName
			)
				.then(() => {
					num++;
					productNum++;
					if (productNum == newCategoryData.length)
						console.log("分类模板渲染完成!");
					if (num === len) {
						reslove();
					}
				})
				.catch((err) => {
					num++;
					console.log("分类模板渲染失败" + err);
					reject(err);
				});
		}
		// 渲染详情页面

		let detailNum = 0;
		for (let i = 0; i < OBJ.detailData.length; i++) {
			renderByOld(
				res,
				{
					data: OBJ,
					ROWS: OBJ.detailData[i],
					blockData: blockData,
				},
				"productDetail",
				`productDetail_${OBJ.detailData[i].id}`,
				newDomain,
				templateName
			)
				.then(() => {
					num++;
					detailNum++;
					if (detailNum == OBJ.detailData.length)
						console.log("详情页模板渲染完成!");
					if (num === len) {
						reslove();
					}
				})
				.catch((err) => {
					num++;
					console.log("详情页模板渲染失败" + err);
					reject(err);
				});
		}

		// 渲染其他页面
		for (let i = 0; i < renderPages.length; i++) {
			renderByOld(
				res,
				{
					data: OBJ,
					ROWS: null,
					blockData: blockData,
				},
				renderPages[i],
				renderPages[i],
				newDomain,
				templateName
			)
				.then(() => {
					console.log(renderPages[i] + "模板渲染完成!");
					num++;
					if (num === len) {
						reslove(renderPages[i] + "模板渲染完成");
					}
				})
				.catch((err) => {
					num++;
					console.log(renderPages[i] + "模板渲染失败" + err);
					reject(err);
				});
		}
	});
}
// 渲染函数-积木装修
function render(
	res,
	blockData,
	liquidName,
	htmlName,
	newDomain,
	VERSION,
	OBJ,
	templateName
) {
	return new Promise((reslove, reject) => {
		var num = 0;
		// isMobilePhone 1:移动端，0: pc端
		res.render(
			`${templateName}/${liquidName}`,
			{
				blockData,
				isMobilePhone: 0,
				VERSION,
				OBJ: OBJ,
				htmlName,
			},
			(err, html) => {
				if (err) {
					console.log(liquidName + "模板渲染失败!", err);
					reject(err);
				} else {
					fs.writeFile(
						path.resolve(
							path.join(buildRoot),
							`${newDomain}/pc/${htmlName}.html`
						),
						html,
						(err) => {
							if (!err) {
								num++;
								if (num === 2) {
									reslove();
								}
							}
						}
					);
				}
			}
		);
		res.render(
			`${templateName}/${liquidName}`,
			{
				blockData,
				isMobilePhone: 1,
				VERSION,
				OBJ,
				htmlName,
			},
			(err, html) => {
				if (err) {
					console.log(liquidName + "模板渲染失败!", err);
					reject(err);
				} else {
					fs.writeFile(
						path.resolve(
							path.join(buildRoot),
							`${newDomain}/wap/${htmlName}.html`
						),
						html,
						(err) => {
							if (!err) {
								num++;
								if (num === 2) {
									reslove();
								}
							}
						}
					);
				}
			}
		);
	});
}
// 渲染函数-非积木装修
function renderByOld(res, data, liquidName, htmlName, newDomain, templateName) {
	return new Promise((reslove, reject) => {
		var num = 0;
		res.render(
			`${templateName}/pc/${liquidName}`,
			{
				data: data.data,
				ROWS: data.ROWS,
				blockData: data.blockData.index,
				isMobilePhone: 0,
				htmlName,
			},
			(err, html) => {
				if (err) {
					console.log(liquidName + "模板渲染失败!", err);
					reject(err);
				} else {
					fs.writeFile(
						path.resolve(
							path.join(buildRoot),
							`${newDomain}/pc/${htmlName}.html`
						),
						html,
						(err) => {
							if (err) {
								reject(error);
							} else {
								num++;
								if (num === 2) {
									reslove();
								}
							}
						}
					);
				}
			}
		);
		res.render(
			`${templateName}/wap/${liquidName}`,
			{
				data: data.data,
				ROWS: data.ROWS,
				blockData: data.blockData.index,
				isMobilePhone: 1,
				htmlName,
			},
			(err, html) => {
				if (err) {
					console.log(liquidName + "模板渲染失败!", err);
					reject(err);
				} else {
					fs.writeFile(
						path.resolve(
							path.join(buildRoot),
							`${newDomain}/wap/${htmlName}.html`
						),
						html,
						(err) => {
							if (err) {
								reject(error);
							} else {
								num++;
								if (num === 2) {
									reslove();
								}
							}
						}
					);
				}
			}
		);
	});
}

// 创建店铺文件目录
function create_Vshop_Dir(domain, newDomain, templateName, OBJ) {
	fs.mkdirSync(path.join(buildRoot, newDomain));
	fs.mkdirSync(path.join(buildRoot, newDomain, "pc"));
	fs.mkdirSync(path.join(buildRoot, newDomain, "wap"));
	copyFile(

		path.resolve(__dirname, `../pages/${templateName}/assets`),
		path.join(buildRoot, newDomain, "assets"),
		function (err) {
			console.log(templateName + "静态资源复制完成");
		}
	);

	if (process.env.NODE_ENV !== "dev") {
		copyFile(
			path.join(`./config/${domain}`),
			path.join(buildRoot, newDomain, "data"),
			function (err) {
				console.log(templateName + "json数据复制完成");
			}
		);
	} else {
		fs.mkdirSync(path.join(buildRoot, newDomain, "data"));
	}

	// 定义全局变量文件
	fs.writeFileSync(
		path.resolve(
			path.join(buildRoot),
			`${newDomain}/data/globalVariable.js`
		),
		`var BASEDATA=${JSON.stringify(
			OBJ.baseData
		)};var CATEGORYDATA=${JSON.stringify(
			OBJ.categoryData
		)};var CONFIGDATA=${JSON.stringify(
			OBJ.configData
		)};var DETAILDATA=${JSON.stringify(
			OBJ.detailData
		)};var INDEXDATA=${JSON.stringify(OBJ.indexData)};
    var SIDEDATA=${JSON.stringify(OBJ.productSideData)}`
	);
}
// 删除原店铺文件
function delete_Vshop_Dir(path) {
	let files = [];
	if (fs.existsSync(path)) {
		files = fs.readdirSync(path);
		files.forEach(function (file, index) {
			let curPath = path + "/" + file;
			if (fs.statSync(curPath).isDirectory()) {
				delete_Vshop_Dir(curPath);
			} else {
				fs.unlinkSync(curPath);
			}
		});
		fs.rmdirSync(path);
	}
}

function copyReviewStatic(domain, templateName, OBJ) {
	mkdirSync(path.join(buildRoot, domain, "temptheme"));
	mkdirSync(path.join(buildRoot, domain, `temptheme/${templateName}`));
	copyFile(
		path.resolve(__dirname, `../pages/${templateName}/assets`),
		path.join(buildRoot, domain, `temptheme/${templateName}/assets`),
		function () {
			console.log(templateName + "预览静态资源复制完成");
		}
	);
	mkdirSync(path.join(buildRoot, domain, `temptheme/${templateName}/data`));
	// 定义全局变量文件
	fs.writeFileSync(
		path.join(
			buildRoot,
			`${domain}/temptheme/${templateName}/data/globalVariable.js`
		),
		`var BASEDATA=${JSON.stringify(
			OBJ.baseData
		)};var CATEGORYDATA=${JSON.stringify(
			OBJ.categoryData
		)};var CONFIGDATA=${JSON.stringify(
			OBJ.configData
		)};var DETAILDATA=${JSON.stringify(
			OBJ.detailData
		)};var INDEXDATA=${JSON.stringify(OBJ.indexData)}`
	);
}
// 复制首页html文件作为预览页面
function copyFileToIndex(domain, templateName, OBJ) {
	mkdirSync(path.join(buildRoot, domain, `temptheme/${templateName}/pc`));
	mkdirSync(path.join(buildRoot, domain, `temptheme/${templateName}/wap`));

	fs.writeFileSync(
		path.join(
			buildRoot,
			domain,
			`temptheme/${templateName}/pc/index.html`
		),
		fs.readFileSync(path.join(buildRoot, domain, "/pc/index.html"))
	);
	fs.writeFileSync(
		path.join(
			buildRoot,
			domain,
			`temptheme/${templateName}/wap/index.html`
		),
		fs.readFileSync(path.join(buildRoot, domain, "/wap/index.html"))
	);
}
module.exports = {
	publish,
};
