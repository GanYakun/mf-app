
class HttpService {
  constructor(){}

  get(url, params, headers) {
    if(!headers) {
      headers = {}
    }

    if(!params) {
      params = {}
    }
   
    /**
     * 统一设置分页大小
     */
    params = Object.assign({"pageSize": 12}, params)

    return this._request(url, 'GET', params, headers)
  }
  put(url, params, headers){
    if(!headers) {
      headers = {}
    }

    if(!params) {
      params = {}
    }

    /**
     * 统一设置分页大小
     */
    params = Object.assign({"pageSize": 12}, params)
   
    return this._request(url, 'PUT', params, headers)
  }

  post(url, params, headers) {
    if(!params) {
      params = {}
    }
   
    if(!headers) {
      headers = {}
    }
    headers['content-type'] = 'application/json'
    return this._request(url, 'POST', params, headers)
  }

  postJson(url, params, headers) {
    if(!params) {
      params = {}
    }
   
    /**
     * 统一设置分页大小
     */
    params = Object.assign({"pageSize": 12}, params)

    var queryParams = "";
    for (var key in params) {
      queryParams += key + "=" + params[key] + "&";
  　}
    queryParams = queryParams.substring(0, queryParams.lastIndexOf("&"));
    if(queryParams) {
      url = url + "?" + queryParams
    }

    if(!headers) {
      headers = {}
    }
    headers['content-type'] = 'application/json'
    return this._request(url, 'POST', params, headers)
  }

  postForm(url, params, headers) {
    if(!params) {
      params = {}
    }
   
    /**
     * 统一设置分页大小
     */
    params = Object.assign({"pageSize": 12}, params)

    if(!headers) {
      headers = {}
    }

    // headers['content-type'] = 'application/x-www-form-urlencoded'
    headers['content-type']  = ' application/x-www-form-urlencoded; charset=UTF-8'
    return this._request(url, 'POST', params, headers)
  }



  _request(url, method, params, headers) {
    let newParams = {}
    if(!params["pageSize"]) {
      for(let key in params) {
        if(key !== "pageSize") {
          newParams[key] = params[key]
        }
      }
      params = newParams
    }

    var app = getApp()
    var tokens = wx.getStorageSync('api_access_token') || ""
    // let pages = getCurrentPages();    //获取当前页面信息栈
    // let prevPsage = pages[pages.length-1]
    // prevPage.setData({

    // })
    if(tokens){
      headers['X-AUTH-TOKEN']=tokens
      // headers['X-AUTH-TOKEN']=""
    }
    return new Promise((resolve, reject) => {
      wx.request({
        url: url,
        method: method,
        data: params,
        header: headers,
        complete: function(res) {
          wx.hideLoading()
          var errMsg = res.errMsg //request:ok;request:fail
          if(errMsg != "request:ok") {
            var reason = {
              code: -1,
              msg: "请求超时"
            } 
            reject(reason)
          } else {
            var resData = res.data
            var resDataCode = resData.code
            if(resDataCode) {
              if((resDataCode + "").startsWith("2")) {
                resolve(resData.data)
              } 
              else if (resDataCode==406){
                reject(resData)
              }
              else {
                reject(resData)
              }
            } else {
              var reason = {
                statusCode: -1,
                msg: resData
              }
              reject(reason)
            }
          }
        }
      })
    })
  }

  _fileUpload(url,params){
    var app = getApp()
    return new Promise((resove,reject)=>{
      wx.uploadFile({
        url: url,
        filePath: params,
        name: 'file', //服务器定义的Key值   
        header: {
          // "content-type": "application/x-www-form-urlencoded",
          'X-AUTH-TOKEN': app.globalData.token
        },
        formData: {
          "user": "test",
        },
        success: function (e) {
          resove(e)
        },
        fail: function (e) {
          console.log('上传失败', e)
          reject(e.errMsg || undefined)
        }
      })
    })
  }
}

module.exports = HttpService