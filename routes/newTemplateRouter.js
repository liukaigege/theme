const path = require('path')
const fs = require('fs')
const { copyFile, mkdirSync, deleteDir, copyDirSync } = require("../tools/dir"); // 引入复制文件夹函数
const { getData } = require("../tools/utils")
const minify = require('html-minifier').minify
const UglifyJS = require('uglify-js')
module.exports = {
	newPublish: function (req, res) {
		let { templateName, domain } = req.query
		console.log(domain + ' : ' + templateName + '-' + new Date().getHours() + ':' + new Date().getMinutes() + '开始发布')
		// 复制资源
		initTemplate(templateName, domain)
		const buildRoot = path.join(__dirname, "../../", "build", `${domain}_copy`);
		// 删除旧文件夹
		deleteDir(buildRoot)
		// 静态资源拷贝
		copyAssets(domain, templateName, buildRoot)
		// 获取店铺数据
		getData(domain, templateName).then(data => {
			// 生成全局变量
			creatGlobal(buildRoot, data)
			// 生成html
			renderTemp(res, buildRoot, { ...data, shopName: domain }).then(() => {
				let dirName = path.join(__dirname, "../../", "build", `${domain}`);
				// 删除 domain
				deleteDir(dirName);
				// domain_copy 改名为 domain
				fs.renameSync(buildRoot, dirName);
				res.json({ code: 200, data: "发布成功" })
			}).catch(err => {
				console.log(err);
				res.json({ code: 500, ...err })
			})
		})
	},
};

/**
 * @description 静态资源拷贝
 * @param {*} domain 店铺管理员
 * @param {*} copyMain 暂时储存发版文件
 * @param {*} templateName 模板名称
 * @param {*} buildRoot 发版文件存储的路径
 */
function copyAssets(domain, templateName, buildRoot) {
	fs.mkdir(buildRoot, () => {
		copyFile(
			path.resolve(__dirname, `../../resources/${domain}/${templateName}/assets`),
			path.join(buildRoot, "assets"),
			() => console.log(templateName + "静态资源复制完成")
		);

		if (process.env.NODE_ENV !== "dev") {
			copyFile(
				path.join(`./config/${domain}`),
				path.join(buildRoot, "data"),
				() => console.log(templateName + "json数据复制完成")
			);
		} else {
			fs.mkdir(path.join(buildRoot, "data"), () => { });
		}
	});
}

/**
 * @description 生成html
 * @param {*} response res
 * @param {*} buildRoot
 * @param {*} data 模板数据
 */
function renderTemp(response, buildRoot, data) {
	return new Promise((res, rej) => {
		let temps = ['index', 'cart', 'contactUs', 'information', 'payment', 'orderSearch', 'orderDetail', 'productList', 'search', 'static', 'static404', 'payment-results']
		mkdirSync(path.join(buildRoot, 'pages'))
		let tempsRenderArr = temps.map(tempName => renderPromise(response, tempName, data, buildRoot))
		let detailTempRender = data.detailData.map(item => renderPromise(response, 'productDetail', { ...data, ROWS: item }, buildRoot))
		Promise.all([...tempsRenderArr, ...detailTempRender]).then(() => {
			console.log('发布完成');
			res()
		}).catch(rej)
	})
}
/**
 * @description promise render
 * @param {*} fileName 模板名称
 * @param {*} render
 * @param {*} data 编译模板数据
 */
function renderPromise(response, fileName, data, buildRoot) {
	return new Promise((res, rej) => {
		// assetsData  该页面所需静态资源配置
		response.render(fileName, { ...data, assetsData: data.assetsConfig[fileName]}, (err, html) => {
			if (err) rej({ msg: `${fileName}编译失败`, data: err })
			else {
				let name = fileName
				if (data.ROWS) name = `${fileName}_${data.ROWS.id}`
				fs.writeFile(path.join(buildRoot, `pages/${name}.html`), html, () => {
					if (err) rej({ msg: `${name}编译成功`, data: err })
					else {
						console.log(`${name}编译成功`)
						res()
					}
				});
			}
		})
	})
}
/**
 * @description 定义全局变量文件
 * @param {*} buildRoot
 * @param {*} data 编译模板数据
 */
function creatGlobal(buildRoot, data) {
	fs.writeFileSync(path.resolve(buildRoot, "assets/js/globalVariable.js"),
		`var BASEDATA=${JSON.stringify(data.baseData)};
		 var CATEGORYDATA=${JSON.stringify(data.categoryData)};
		 var CONFIGDATA=${JSON.stringify(data.configData)};
		 var DETAILDATA=${JSON.stringify(data.detailData)};
		 var INDEXDATA=${JSON.stringify(data.indexData)};
    	 `
	);
	console.log('全局数据写入完毕')
}

// 复制到resources 文件夹
function initTemplate(templateName, domain) {
	// 新模板文件夹
	let dir = path.resolve(__dirname, `../pages/${templateName}`)
	// 要复制到的文件夹
	let copyDir = path.resolve(__dirname, '../../resources', domain)
	// 创建文件夹
	mkdirSync(copyDir)
	// 删除原文件
	deleteDir(path.join(copyDir, templateName))
	// 拷贝模板到config下
	copyDirSync(dir, path.join(copyDir, templateName));
	console.log('资源复制完成')
	// 压缩js，css文件
	if(process.env.NODE_ENV == 'build') {
		compress(path.join(copyDir, templateName, 'assets/js'));
		compress(path.join(copyDir, templateName, 'assets/css'));
	}
	console.log('压缩完成')
}


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
			compress(pathname)
		} else {
			if (!pathname.includes('min.')) {
				try {
					var data = fs.readFileSync(pathname, 'utf8')
					if (pathname.endsWith('js')) {
						fs.writeFileSync(
							pathname,
							UglifyJS.minify(data, {
								compress: {
									drop_console: true,
								},
							}).code
						)
					} else if (pathname.endsWith('css')) {
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

		}
	})
}
