
var fs = require('fs');

/*
 * 复制目录、子目录，及其中的文件
 * @param src {String} 要复制的目录
 * @param dist {String} 复制到目标目录
 */
function copyDir(src, dist) {
	mkdirSync(dist)
	var paths = fs.readdirSync(src)
	paths.forEach(function (p) {
		var _src = src + '/' + p;
		var _dist = dist + '/' + p;
		fs.stat(_src, (err, stat) => {
			if (stat.isFile()) {// 判断是文件还是目录
				fs.copyFile(_src, _dist, () => { })
			} else if (stat.isDirectory()) {
				copyDir(_src, _dist)// 当是目录是，递归复制
			}
		})
	})
}

function copyFile(src, dist, callback) {
	copyDir(src, dist);
	if (callback) {
		callback();
	}
}
/*
 * 同步复制目录
 * @param src {String} 要复制的目录
 * @param dist {String} 复制到目标目录
 */
function copyDirSync(src, dist) {
	mkdirSync(dist)
	var paths = fs.readdirSync(src)
	paths.forEach(function (p) {
		var _src = src + '/' + p;
		var _dist = dist + '/' + p;
		var stat = fs.statSync(_src)
		if (stat.isFile()) {// 判断是文件还是目录
			fs.copyFileSync(_src, _dist)
		} else if (stat.isDirectory()) {
			copyDirSync(_src, _dist)// 当是目录是，递归复制
		}
	})
}

function mkdirSync(dist) {
	try {
		fs.accessSync(dist)
	} catch {
		fs.mkdirSync(dist);
	}
}

/**
 * @description 删除文件夹包括里面的文件
 * @param {*} path 文件夹路径
 */
function deleteDir(path) {
	let files = [];
	if (fs.existsSync(path)) {
		files = fs.readdirSync(path);
		files.forEach(function (file, index) {
			let curPath = path + "/" + file;
			if (fs.statSync(curPath).isDirectory()) {
				deleteDir(curPath);
			} else {
				fs.unlinkSync(curPath);
			}
		});
		fs.rmdirSync(path);
	}
}

module.exports = {
	copyFile,
	copyDirSync,
	mkdirSync,
	deleteDir
}
