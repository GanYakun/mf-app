// var host = 'https://www.100good.cn/'
// var host = 'http://mf.100good.cn/mlsmall/'
// var host = 'http://mf.100good.cn/'
// var host = 'http://192.168.0.111:8080'

// var host = 'http://192.168.0.100:8080'
// var host = 'http://116.55.226.51:8087'   //测试服
// var host = 'http://192.168.0.166:8080'
// var host = 'http://192.168.0.101:8080'
var httpConfig = require("../http/config.js")
var host = httpConfig.host
const requestCenter = require("../http/request-center.js")

// var host = 'http://192.168.0.117'

// var host = 'http://116.55.226.51:8087/'  //测试服
// var host = 'http://192.168.0.111:8080/'




// var host = 'http://192.168.0.122:80'
// var host = 'http://116.55.251.10'





var num = []

var header = {
  // 'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
  'content-type': 'application/json',
  'ternalFlag': 'xcx'
  // 'X-AUTH-TOKEN': tokens,
}



/**
 * POST请求，
 * URL：接口
 * postData：参数，json类型  
 * doSuccess：成功的回调函数
 * doFail：失败的回调函数
 */
function loading() {
  wx.showLoading({
    title: 'Loading',
  })
}

function request(url, postData, method, doSuccess) {
  var tokens = getApp().globalData.token
  
  var CustomHeader = {
    // 'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
    'content-type': 'application/json',
    'ternalFlag': 'xcx'
  }
  return requestCenter.TokenIsExpired(() => {
    return _request({
      url: host + url,
      header: CustomHeader,
      method: method,
      data: postData,
      success: doSuccess
    })
  }, false)
  // wx.request({
  //   url: host + url,
  //   header: CustomHeader,
  //   method: method,
  //   data: postData,
  //   success: (res) => {
  //     num.splice(0, 1)
  //     // if (num.length == 0) {
  //     //   pageData.setData({
  //     //     isShowLoding: false
  //     //   })
  //     // }
  //     doSuccess(res.data);
  //   },
  //   fail: function (res) {
  //     wx.showToast({
  //       title: '请求超时,请重试',
  //       icon: 'none'
  //     })
  //     // console.log(res.data)
  //   },
  //   complete() {
  //     // wx.hideLoading()
  //   }
  // })
}

//该方法没有加载弹窗
function NoLoading(url, postData, method, doSuccess) {
  var CustomHeader = {
    'content-type': 'application/json',
    'ternalFlag': 'xcx',
  }
  return requestCenter.TokenIsExpired(() => {
    return _request({
      url: host + url,
      header: CustomHeader,
      method: method,
      data: postData,
      hasLoading: 0,
      success: doSuccess
    })
  }, false)
  // wx.request({
  //   url: host + url,
  //   header: CustomHeader,
  //   method: method,
  //   data: postData,
  //   success: (res) => {
  //     doSuccess(res.data);
  //   },
  //   fail: function (res) {
  //     wx.showToast({
  //       title: '请求超时,请重试',
  //       icon: 'none'
  //     })
  //   },
  // })
}

function xpost(url, postData, method, header = {}, doSuccess) {
  let key = "ternalFlag";
  let value = "xcx"
  header[key] = value;
  return requestCenter.TokenIsExpired(() => {
    return _request({
      url: host + url,
      header: header,
      method: method,
      data: postData,
      success: doSuccess
    })
  }, false)

  // wx.request({
  //   url: host + url,
  //   data: postData,
  //   method: method,
  //   header: header,
  //   success: function (res) {
  //     doSuccess(res.data);
  //   },
  //   fail: function (res) {
  //     wx.showToast({
  //       title: '请求超时,请重试',
  //       icon: 'none'
  //     })
  //   },
  // })
}

function xget(url, postData, method, header = {}, doSuccess) {
  let key = "ternalFlag";
  let value = "xcx"
  header[key] = value;
  return requestCenter.TokenIsExpired(() => {
    return _request({
      url: host + url,
      header: header,
      method: method,
      data: postData,
      success: doSuccess
    })
  }, false)
  // wx.request({
  //   url: host + url,
  //   data: postData,
  //   method: method,
  //   header: header,
  //   success: function (res) {
  //     doSuccess(res.data);
  //   },
  //   fail: function (res) {
  //     wx.showToast({
  //       title: '请求超时,请重试',
  //       icon: 'none'
  //     })
  //   },
  // })
}

function xdelete(url, postData, method, header = {}, doSuccess) {
  return requestCenter.TokenIsExpired(() => {
    return _request({
      url: host + url,
      header: header,
      method: method,
      data: postData,
      success: doSuccess
    })
  }, false)

  // wx.request({
  //   url: host + url,
  //   data: postData,
  //   method: method,
  //   header: header,
  //   success: function (res) {
  //     doSuccess(res.data);
  //   },
  //   fail: function (res) {
  //     wx.showToast({
  //       title: '请求超时,请重试',
  //       icon: 'none'
  //     })
  //   },
  // })
}

function xput(url, postData, method, header = {}, doSuccess) {
  return requestCenter.TokenIsExpired(() => {
    return _request({
      url: host + url,
      header: header,
      method: method,
      data: postData,
      success: doSuccess
    })
  }, false)

  // wx.request({
  //   url: host + url,
  //   data: postData,
  //   method: method,
  //   header: header,
  //   success: function (res) {
  //     doSuccess(res.data);
  //   },
  //   fail: function (res) {
  //     wx.showToast({
  //       title: '请求超时,请重试',
  //       icon: 'none'
  //     })
  //   },
  // })
}


/**
 * 
 * 带token访问
 * 
 */
async function newget(url, postData, method, doSuccess, isLodding, doFail) {
  var newheader = {
    'content-type': 'application/json',
    'ternalFlag': 'xcx'
  }
  return requestCenter.TokenIsExpired(() => {
    return _request({
      url: host + url,
      header: newheader,
      method: method,
      data: postData,
      hasLoading: isLodding,
      success: doSuccess,
      fail: doFail
    })
  }, false)
}

function _request({url = "", data = {}, method = "GET", header = {}, hasLoading, success = () => {}, fail = () => {}} = {}) {
  let app = getApp()
  let pages = getCurrentPages();
  let curPage = pages[pages.length - 1];
  console.log("_request", hasLoading)
  if(hasLoading != 0){
    if(!curPage.data.isShowLoding) {
      curPage.setData({
        isShowLoding: true
      })
    }
  }

  header["X-AUTH-TOKEN"] = wx.getStorageSync('api_access_token') || ""

  return new Promise((resolve, reject) => {
    wx.request({
      url,
      data,
      method,
      header,
      success: function(res) {
        var resData = res.data
        var resDataCode = resData.code
        if(resDataCode) {
          success(resData)
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
      },
      fail: function(error) {
        fail(error)
        reject(error)
      }
    })
  })
  .finally(() => {
    if(hasLoading != 0){
      if(curPage.data.isShowLoding) {
        curPage.setData({
          isShowLoding: false
        })
      }
    }
  })
}

/**
 * module.exports用来导出代码
 * js文件中通过var call = require("../util/request.js")  加载
 * 在引入引入文件的时候"  "里面的内容通过../../../这种类型，小程序的编译器会自动提示，因为你可能
 * 项目目录不止一级，不同的js文件对应的工具类的位置不一样
 */
module.exports.request = request;
module.exports.xpost = xpost;
module.exports.xget = xget;
module.exports.xdelete = xdelete;
module.exports.xput = xput;
module.exports.newget = newget,
module.exports.NoLoading = NoLoading