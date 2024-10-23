// var host = 'http://mf.100good.cn/mlsmall/'
// var host = 'http://mf.100good.cn/'
 var host = 'http://127.0.0.1:8080/mlsmall/' //本地
//var host = 'https://www.100good.cn/'  //正式服
// var host = 'http://xcx.lieying100.com/' //测试服2

// var host = 'http://116.55.226.51:8087'   //测试服

var httpConfig = require("./http/config.js")
var host = httpConfig.host
var api = require("./utils/api.js")
var utils = require("./utils/utils.js")
import requestCenter from "./http/request-center"
import { PromiseX } from "./promisex/promisex"
Promise = PromiseX
Promise && Promise.trackRejection({
  //使用了async和await的promise不会在这里捕获到，而是会被vue自定识别并处理
  //没有使用async和await的promise抛出的异常，都会在这里被捕获到
  onUnhandledRejection: function(event) {
    let app = getApp()
    if(app) {
      app.onUnhandledRejection(event)
    }
  }
})

App({
  onLaunch: function (options) {
    var that = this

    requestCenter.getMemberInfo()
      .then(res => {
        if (res.isEmployee == 1 || (res.isBroker == 1 && res.brokerPower == 1)) {
          that.globalData.memberid = res.id
          that.globalData.ordinarymemberid = res.id
        } else {
          that.globalData.memberid = ''
        }
      })
      .catch((error) => {})

    wx.setStorageSync('indexStorage', "")
    const {
      statusBarHeight,
      windowHeight,
      windowWidth,
      safeArea,
      screenHeight
    } = wx.getSystemInfoSync();
    that.globalData.SystemWidth = windowWidth
    const menuButtontop = wx.getMenuButtonBoundingClientRect()
    let gap = menuButtontop.top - statusBarHeight //胶囊按钮到状态栏的高度
    let menuHeight = menuButtontop.height //右上角胶囊按钮的高度
    that.globalData.menuHeight = menuHeight
    console.log("状态栏高度"+statusBarHeight)
    that.globalData.statusBarHeight = statusBarHeight
    let LeftButtontitleBarHeight = gap * 2 + menuHeight + 4 //标题栏高度
    const tabBarHeight = safeArea.height - windowHeight + statusBarHeight;
    const availableHeight = screenHeight - menuButtontop.bottom
    let ratio = 750 / windowWidth;
    let pageWindowHeight = Math.ceil(windowHeight * ratio);
    let LeftButtonnavHeight = Math.ceil((statusBarHeight + LeftButtontitleBarHeight) * ratio)
    that.globalData.pageWindowHeight = pageWindowHeight
    that.globalData.tabheight = tabBarHeight * ratio
    that.globalData.LeftButtonnavHeight = LeftButtonnavHeight

    //wx.hideTabBar()        //隐藏原生tabbar

    // 分享功能
    wx.onAppRoute(res => {
      let pages = getCurrentPages();
      let view = pages[pages.length - 1];
      // 如果页面含有qcappnoshare这个变量，则不分享
      if (view) {
        let _data = view.data;
        if (_data.qcappnoshare) {
          return false;
        }
      }
      var routeParams = res.query
      var queryStr = ""
      for (var key in routeParams) {
        queryStr += key + "=" + routeParams[key] + "&"
      }
      if (queryStr.endsWith("&")) {
        queryStr = queryStr.substr(0, queryStr.lastIndexOf("&"))
      }
      // console.log('route', view.route)
      wx.showShareMenu({
        withShareTicket: true,
        menus: ['shareAppMessage', 'shareTimeline']
      });
      if(view.route !== 'businesscard/mecustomer/index') {
        view.onShareAppMessage = async function (res) {
          console.log('hhhhhhhhhhhhhhh',view )
          try {
            var shareType = res.target.dataset.shareType
          } catch {
            var shareType = 0
          }
          console.log('shareType',shareType)
          console.log('view.route',view.route)
          if (view.route == "pages/video-swiper/video-swiper") {
            console.log('走这了呀')
            console.log(view.__data__)
            let hideTopNavigation = await that.hideTopNavigation()
            // var shareData = res.target.dataset
            // let videoList = []
            // let videoData = shareData.videoData
            // videoList.push(videoData)
            // let videoList = view.data.videoList
            let videocurrent = view.data.current
            let sharetitle = view.data.videoMessage.title
            console.log('sharetitle', sharetitle)
            console.log("videocurrent",videocurrent)
            // videoList = 
            let datavideoList = []
            datavideoList[0] = view.data.videoList[videocurrent]
            console.log('datavideoList', datavideoList)
            return {
              title: sharetitle,
              // path: "pages/video-list/video-list?searchId=" + "&shareData=" + shareData
              path: "pages/video-share/video-share?videoList=" + encodeURIComponent(JSON.stringify(datavideoList))
              // path: "pages/video-share/video-share?videocurrent="+videocurrent
              // path: queryStr ? (view.route + "?" + queryStr) : view.route,
            }
          } else {
            let test = await that.hideTopNavigation()
            var shareids = that.globalData.ordinarymemberid
            console.log('新版分享ID', shareids)
            let pages = getCurrentPages();
            let pageData = pages[pages.length - 1];
            pageData.setData({
              isPageShow: true
            })
            //分享的标题
            var shareTitle = pageData.data.shareTitle ? pageData.data.shareTitle : ''
            //特殊处理 分享时需要携带那些参数
            var shaarePageData = pageData.data.shaarePageData ? pageData.data.shaarePageData : ''
            queryStr = queryStr + "&status=" + 1 + "&mumberId=" + shareids + "&sharePageData=" + shaarePageData
            console.log('testImg', pageData.data.testImg)
            return {
              title: shareTitle,
              path: queryStr ? (view.route + "?" + queryStr) : view.route,
              imageUrl: pageData.data.testImg
            }
          }
        }
      }
      
      //分享到朋友圈
      view.onShareTimeline = async function () {
        try {
          var shareType = res.target.dataset.shareType
        } catch {
          var shareType = 0
        }
        console.log('shareType',shareType)
        if (shareType == "video") {
          var shareData = res.target.dataset
          shareData = JSON.stringify(shareData)
          shareData = encodeURIComponent(shareData)
          return {
            title: shareTitle,
            path: "pages/video-list/video-list?searchId=" + "&shareData=" + shareData
          }
        } else {
          // "&id=" + 2 
          let test = await that.hideTopNavigation()
          console.log(test)
          var shareids = that.globalData.ordinarymemberid

          console.log('新版分享ID', shareids)
          let pages = getCurrentPages();
          console.log(pages)
          let pageData = pages[pages.length - 1];
          pageData.setData({
            isPageShow: true
          })
          if (pageData.data.shareTitle) {
            var shareTitle = pageData.data.shareTitle //分享的标题
          } else {
            var shareTitle = ''
          }
          console.log(shareTitle)
          queryStr = queryStr + "&status=" + 1 + "&mumberId=" + shareids + "&sharePageData=" + view.data.test
          console.log(queryStr)
          return {
            title: shareTitle,
            path: queryStr ? (view.route + "?" + queryStr) : view.route
          }
        }
        // return {
        //   title: shareTitle,
        //   query: routeParams
        // }
      }
    })

    //版本更新功能
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
    })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed(function () {
      console.log('新版本更新失败')
    })
  },
  //输出日志
  log: function (tag, info) {
    console.log(tag, info)
  },
  //navigateTo跳转页面
  navigateToPage(pageParameter, url) {
    console.log(pageParameter)
    wx.navigateTo({
      url: url + '?pageParameter=' + pageParameter,
    })
  },
  //监听Promise的错误（reject）事件
  onUnhandledRejection(errMsg) {
    console.log("onUnhandledRejection", errMsg)
    // fundebug.notifyError(errMsg);
    let error = errMsg.reason || {code: 500, message: "未知错误"}
    if(typeof error === "object") {
      if (error.code == '407') {
        let curPage = error.curPage || {}
        let query = {}

        if(curPage) {
          query["backPage"] = encodeURIComponent(curPage.route || "pages/index/index")
          let options = (curPage || {}).options || {}
          let backPageQueryList = []
          for(let key in options) {
            backPageQueryList.push(`${key}=${options[key] || ""}`)
          }
          query["backPageQuery"] = encodeURIComponent(backPageQueryList.join("&"))
          query["backType"] = error.backType || (!curPage.route ? "reLaunch":"redirectTo")
        }   
        this.toLogin(query)
      } else {
        if(error && error.message) {
          wx.showToast({
            title: error.message,
            icon: 'none'
          })
        }
      }
    } else {
      if(error == '407') {
        this.toLogin()
      } else {
        if(error) {
          wx.showToast({
            title: error,
            icon: 'none'
          })
        }
      }
    }
  },
  
  toLogin: function(query = {}) {
    let queryList = []
    for(let key in query) {
      queryList.push(`${key}=${query[key] || ""}`)
    }

    wx.redirectTo({
      url: `/pages/Loginregistration/Loginregistration?${queryList.join("&")}`,
    })
  },

  //自定义捕获错误方法
  customError(errMsg) {
    console.log("onUnhandledRejection", errMsg)
    wx.showToast({
      title: errMsg.message,
      icon: 'none'
    })
  },

  //隐藏页面的导航栏
  hideTopNavigation: function () {
    // return new Promise(async (resove, reject) => {
    //   const curPhone = await wx.getSystemInfo(); //获取当前得设备
    //   let pages = getCurrentPages();
    //   let pageData = pages[pages.length - 1];
    //   pageData.setData({
    //     isPageShow: true
    //   })

    //   if (curPhone.platform == 'ios') {
    //     resove('')
    //   } else {
    //     pageData.setData({
    //       hideCustomBar: 1
    //     })
    //     var timer = setTimeout(() => {
    //       wx.hideLoading({})
    //       resove('1')
    //       clearTimeout(timer)
    //     }, 1000)
    //   }
    // })
    return Promise.resolve()
  },

  onShow: async function (options) {
    console.log("onShow", options)
    var scene = wx.getLaunchOptionsSync()
    var that = this;
  
    // 显示页面的导航栏
    let pages = getCurrentPages();
    let pageData = pages[pages.length - 1];
    if (pageData) {
      pageData.setData({
        hideCustomBar: 0
      })
    }
    //显示页面导航栏结束
    that.globalData.IsLeftButton = 0 //小程序显示则显示组件
    var isstatus = options.query
    //扫码进入小程序
    if (options.scene == 1047 || options.scene == 1048 || options.scene == 1049) {
      let query = decodeURIComponent(options.query.scene).split("=");
      if (query[0] == 'memberId') {
        that.globalData.shareid = query[1]
      } else if ((query[0].split(","))[0] == 'memberId') {
        that.globalData.shareid = (query[0].split(","))[1]
      }
    }
    // 微信聊天主界面下拉，「最近使用」栏（基础库2.2.4版本起包含「我的小程序」栏）
    else if (options.scene == 1089) {
      console.log("微信聊天主界面下拉,非小程序分享")
      that.globalData.shareid = ''
      that.globalData.newshareid = ''
    } else if (isstatus.status == 1) {
      that.globalData.shareid = isstatus.mumberId
      that.globalData.newshareid = isstatus.mumberId
      var queryStr = ""
      for (var key in options.query) {
        queryStr += key + "=" + options.query[key] + "&"
      }
      if (queryStr.endsWith("&")) {
        queryStr = queryStr.substr(0, queryStr.lastIndexOf("&"))
      }
      that.globalData.SharePage = options.path + '?' + queryStr
    } else if (isstatus.q) {
      console.log("分享海报进来的", isstatus.q)
      let q = decodeURIComponent(isstatus.q);
      console.log('普通二维码decodeURIComponent后q的参数', q)
      let memberId = utils.getQueryString(q, 'memberId');
      let name = utils.getQueryString(q, 'name')
      that.globalData.shareid = memberId
      // that.obtaintoken().catch((error) => {
      //   if(error.code == 407) {
      //     // wx.navigateTo({
      //     //   url: '/pages/Loginregistration/Loginregistration?PageType=' + 'poster' + '&memberId=' + memberId + '&name=' + name,
      //     // })
      //     that.toLogin({memberId, name})
      //   }
      //   return Promise.reject()
      // })
    }

    // if(that.globalData.shareid || "") {
      // requestCenter.addRelation({
      //   memberId: that.globalData.shareid || ""
      // })
      // .catch(error => {
      //   console.log("addRelation", error)
      //   error == error || {}
      //   if(error.code == 407) {
      //     return Promise.reject()
      //   } else {
      //     return Promise.reject(error)
      //   }
      // })
    // }
  },

  //登陆
  obtaintoken: async function () {
    var that = this
    var code = await that.getcode()
    return new Promise(async (resove, reject) => {
      // if(true){
      //   that.globalData.token = 'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIxODk4NzExOTU4MyIsInN1YiI6IjE4OTg3MTE5NTgzIiwiaWF0IjoxNjMxOTU1MTA3fQ.VYoaLE7qKekFV78UT5EMY1ExHcZSBwF0Cvr4G0DwgP8'
      //   return false
      //   let params = {
      //     account:'18987119583',
      //     password:'119583'
      //   }
      //   let tokens = await requestCenter.getTokens(params)
      //   console.log(tokens)
      //   that.globalData.token = tokens.token
      //   that.globalData.isemployee = 1
      //   that.globalData.memberid = tokens.member.id
      //   resove('tokens.token')
      //   return false
      // }
      let data = {
        code: code,
        memberId: that.globalData.shareid ? that.globalData.shareid : ''
      }
      console.log('上传的数据' + JSON.stringify(data))
      api.newget('/rest/weiXin/wxLogin', data, 'GET', function (e) {
        console.log("wxLogin", e)
        wx.setStorageSync('isbind', e.message)
        that.globalData.uinfo = e.data.memberInfo
        // e.code = 407
        if (e.code == 200) {
          that.globalData.token = e.data.token
          // that.globalData.token = ''
          wx.setStorageSync('api_access_token', e.data.token)
          resove(e.data.token)
          that.globalData.username = e.data.memberInfo.nick
          that.globalData.userimg = e.data.memberInfo.logoVo.imagePath
          that.globalData.isemployee = e.data.memberInfo.isEmployee
          that.globalData.isBroker = e.data.memberInfo.isBroker
          that.globalData.postCouponPower = e.data.memberInfo.postCouponPower
          that.globalData.brokerPower = e.data.memberInfo.brokerPower
          if (e.data.memberInfo.phone == null) {
            that.globalData.phone = e.data.memberInfo.account
          } else {
            that.globalData.phone = e.data.memberInfo.phone
          }
          //用户的会员id  这里是不管是普通会员还是内部人员都携带着id走
          // that.globalData.ordinarymemberid = e.data.memberInfo.id
          that.globalData.isVerificate = e.data.memberInfo.isVerificate
          if (e.data.memberInfo.isEmployee == 1 || (e.data.memberInfo.isBroker == 1 && e.data.memberInfo.brokerPower == 1)) {
            that.globalData.memberid = e.data.memberInfo.id
            that.globalData.ordinarymemberid = e.data.memberInfo.id
          } else {
            that.globalData.memberid = ''
          }

        } else if (e.code == 407) {
          wx.setStorageSync('session_key', e.data.session_key)
          wx.setStorageSync('oppenid', e.data.openid)
          wx.setStorageSync('unionid', e.data.unionid)
          wx.setStorageSync('isLoginCode', e.code)
          reject({code: 407, message: "未注册"})
        } else {
          if (e.data == null) {
            wx.showToast({
              title: '登录失败',
              icon: 'none', //如果要纯文本，不要icon，将值设为'none'
              duration: 1000
            })
          }
          reject()
        }
      })
    })
  },

  //判断用户是否登陆，分享时不会建立关系
  IsLogin: async function () {
    // var that = this
    // var code = await that.getcode()
    // return new Promise((resove, reject) => {
    //   let data = {
    //     code: code,
    //     memberId: ''
    //   }
    //   api.request('/rest/weiXin/wxLogin', data, 'GET', function (e) {
    //     wx.setStorageSync('isbind', e.message)
    //     if (e.code == 200) {
    //       that.globalData.token = e.data.token
    //       // that.globalData.token = ''
    //       resove(e.data.token)
    //     } else if (e.code == 407) {
    //       reject(e)
    //     } else {
    //       if (e.data == null) {
    //         wx.showToast({
    //           title: '登录失败',
    //           icon: 'none', //如果要纯文本，不要icon，将值设为'none'
    //           duration: 1000
    //         })
    //       }
    //       reject()
    //     }
    //   })
    // })
    return Promise.resolve()
  },

  //公共组件查询是否存在名片
  //判断用户是否有名片
  busCard(e) {
    if(this.globalData.shareid || "") {
      requestCenter.getBusinessCard({
        memberId: this.globalData.shareid || ""
      })
      .then(res => {
        this.globalData.isbusVard = {
          judeCard: true,
          requested: true
        }
        return Promise.resolve({
          judeCard: true,
          requested: true
        })
      })
      .catch(error => {
        this.globalData.isbusVard = {
          judeCard: false,
          requested: true
        }
        return Promise.resolve({
          judeCard: false,
          requested: true
        })
      })
    } else {
      return Promise.resolve({
          judeCard: false,
          requested: true
      })
    }
    // return new Promise((resove, reject) => {
    //   if (!this.globalData.shareid) {
    //     resove('true')
    //     return false
    //   }
    //   try {
    //     api.newget('/rest/shareApi/getBusinessCard?memberId=' + this.globalData.shareid, {}, 'GET', (res) => {
    //       console.log(res)
    //       if (res.code == 500) {
    //         // 没有名片
    //         this.globalData.isbusVard = {
    //           judeCard: false,
    //           requested: true
    //         }
    //       } else if (res.code == 200) {
    //         this.globalData.isbusVard = {
    //           judeCard: true,
    //           requested: true
    //         }
    //       }
    //       resove('true')
    //     }, 0)
    //   } catch {
    //     resove('true')
    //   }

    // })

  },


  // 获取code
  getcode: function () {
    return new Promise((resove, reject) => {
      wx.checkSession({
        success: function (res) {
          console.log("处于登录态", wx.getStorageSync('wxcode'));
          wx.login({
            success(res) {
              wx.setStorageSync("wxcode", res.code)
              resove(res.code)
            }
          })
        },
        fail: function (res) {
          console.log("需要重新登录");
          wx.login({
            success(res) {
              wx.setStorageSync("wxcode", res.code)
              resove(res.code)
            }
          })
        }
      })
    })
  },
  onHide: function () {
    console.log("小程序隐藏")
    var that = this;
    that.globalData.IsLeftButton = 1 //处理分享出现白色空白
    wx.hideLoading({
      success: (res) => {},
    })
  },

  //页面隐藏引导用户登陆
  UserLogin: async function () {
    // let that = this
    // //防止跳两次登陆页面
    // if (that.globalData.isToUserLogin == 1 || that.globalData.JumpType) {
    //   return false
    // }
    // that.globalData.isToUserLogin = 1
    // if (that.globalData.token) {
    //   return false
    // }
    // this.obtaintoken().catch((error) => {
    //   if (error.code == 407) {
    //     let pages = getCurrentPages();
    //     let prevPage = pages[pages.length - 2];
    //     let pageData = pages[pages.length - 1];
    //     console.log(pageData)
    //     console.log(pageData.data.isToUserLogin)
    //     pageData.setData({
    //       isToUserLogin: true
    //     })
    //     console.log('测试数据123', that.globalData.SharePage)
    //     if (that.globalData.SharePage) {
    //       // wx.navigateTo({
    //       //   url: 'url',
    //       // })
    //       wx.navigateTo({
    //         url: '/pages/Loginregistration/Loginregistration?PagePath=' + encodeURIComponent(that.globalData.SharePage),
    //       })
    //     } else {
    //       wx.navigateTo({
    //         url: '/pages/Loginregistration/Loginregistration?PagePath=' + prevPage.route,
    //       })
    //     }
    //   }
    //   return Promise.reject()
    // })
    return Promise.resolve()
  },

  //未登录点击需要登陆的功能时
  UserLoginToClick: async function () {
    // var that = this
    // that.globalData.JumpType = 'click'
    // wx.navigateTo({
    //   url: '/pages/Loginregistration/Loginregistration?JumpType=' + 'click',
    // })
    return Promise.resolve()
  },
  // 弹窗  只显示一行字
  showToastMessage(title, time) {
    wx.showToast({
      title: title,
      icon: 'none',
      duration: time ? time : 2000
    })
  },

  getQueryValue: function(scene) {
    var urlString = scene;
    if (!urlString) { 
      return {};
    } 
    var searchQuery = urlString;
    var s1 = searchQuery.split('&');
    var obj = {};
    for (var i = 0; i < s1.length; i++) {
      var o = [];
      var o = s1[i].split('=');
      if (o.length > 1) {
        var o_value = o[1];
        for (var j = 2; j < o.length; j++) {
          o_value = o_value + '=' + o[j];
        }
        obj[o[0]] = o_value;
      }
    }
    return obj;
  },

  globalData: {
    hostUrl: host,
    ftpurl: httpConfig.ftpUrl,
    newFtpUrl: 'https://www.100good.cn/plug-in/aykjmobile/images',
    imgur: 'https://wj.100good.cn/',
    // imgur: 'https://www.mufei100.com/',
    upurl: host,
    token: '',
    // token:'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIxODA4NzA2MzUyOSIsInN1YiI6IjE4MDg3MDYzNTI5IiwiaWF0IjoxNjMxMTUxNTQyfQ.LANpjN1D4ZKwmhB9oQ6BPefKXVPS58lQg5InEs46k5s',
    uinfo: '',
    pageWindowHeight: '', //页面的高度
    tabheight: '',
    memberid: '',
    // memberid: 712,

    isemployee: '', //判断是否是内部员工
    tabIndexHeight: 90,
    customer: 'https://yq-mina-c3aob33g1to21.uclient.yunque360.com/frame.html?company_id=c3aob33g1to21',
    // 'https://yq-mina-c3aob33g1to21.uclient.yunque360.com/frame.html?company_id=c3aob33g1to21',
    // https://yq-mina-c3aob33g1to21.uclient.yunque360.com/frame.html?company_id=c3aob33g1to21
    new: true,
    username: '', //用户昵称
    userimg: '', //用户头像
    phone: '',
    shareid: '',
    shareurl: '',
    ordinarymemberid: '', //用户的会员id
    isVerificate: '', //判断用户是否有核销权限
    isBroker: '', //判断用户是否是经纪人
    newshareid: '', //分享id  一直带着走
    LeftButtonnavHeight: '', //顶部返回首页的按钮高度
    IsLeftButton: 0,
    SharePage: '', //分享的页面路径
    isToUserLogin: '',
    SystemWidth: '', //手机页面宽带
    JumpType: '',
    callPhone: '0871-68123333',
    isConsole: true, //判断是否显示日志
    menuHeight: 0, //状态栏的高度
    isbusVard: '',
    xcxType: 'xcx',
    statusBarHeight:0
  }
})