let getQueryString = function (url, name) {
  var reg = new RegExp('(^|&|/?)' + name + '=([^&|/?]*)(&|/?|$)', 'i')
  var r = url.substr(1).match(reg)
  if (r != null) {
    return r[2]
  }
  return null;
}

const promisic = function(func) {
	return function(params = {}) {
		return new Promise((resolve, reject) => {
			const args = Object.assign(params, {
				success: (res) => {
					resolve(res)
				},
				fail: (error) => {
          console.log("wx internal api invoke error", error)
					reject()
				}
			})
			func(args)
		})
	}
}

const compareVersion = function(v1, v2) {
	v1 = v1.split('.')
	v2 = v2.split('.')
	const len = Math.max(v1.length, v2.length)

	while (v1.length < len) {
		v1.push('0')
	}
	while (v2.length < len) {
		v2.push('0')
	}

	for (let i = 0; i < len; i++) {
		const num1 = parseInt(v1[i])
		const num2 = parseInt(v2[i])

		if (num1 > num2) {
			return 1
		} else if (num1 < num2) {
			return -1
		}
	}

	return 0
}

module.exports = {
  getQueryString: getQueryString,
  promisic: promisic,
  compareVersion: compareVersion
}